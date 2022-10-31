import jwtDefaultConfig from "./jwtDefaultConfig";
import getHomeRouteForLoggedInUser from "@/auth/utils";
import useJwt from "@/auth/jwt/useJwt";
import jwt_decode from "jwt-decode";

export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns = null;

  // jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig };

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  // For Refreshing Token
  subscribers = [];

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns;
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const accessToken = this.getToken();

        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
          config.headers["Content-Type"] = "application/json";
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      (response) => response,
      (error) => {
        // const { config, response: { status } } = error
        const { config, response } = error;
        const originalRequest = config;

        // if (status === 401) {
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            this.refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false;

              // Update accessToken in localStorage
              this.setToken(r.data.accessToken);
              this.setRefreshToken(r.data.refreshToken);

              this.onAccessTokenFetched(r.data.accessToken);
            });
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              // Make sure to assign accessToken according to your response.
              // Check: https://pixinvent.ticksy.com/ticket/2413870
              // Change Authorization header
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
              resolve(this.axiosIns(originalRequest));
            });
          });
          return retryOriginalRequest;
        }
        return Promise.reject(error);
      }
    );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  login(...args) {
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args);
  }

  register(...args) {
    return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args);
  }

  refreshToken() {
    return this.axiosIns.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }
  async loginCC(email, password) {
    let userData2;

    var axios = require("axios");
    var data = JSON.stringify({
      emailAddress: email,
      password: password,
    });

    var config = {
      method: "put",
      url: process.env.VUE_APP_BASE_URL + "/entrance/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    let router = this.$router;

    async function sendVar(retornoVar) {
      await axios(config)
        .then(function (response) {
          const responseCC = {
            ability: [{ action: "manage", subject: "all" }],
            email: email,
            token: response.data.token,
            refresh_token: response.data.refresh_token,
            role: "admin",
          };
          return responseCC;
        })
        .then((responseCC) => {
          const userData = responseCC;
          let jwt = jwt_decode(userData.token);
          localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("token", userData.token);
          localStorage.setItem("fullName", jwt.name);
          localStorage.setItem("refresh_token", responseCC.refresh_token);
          useJwt.setToken(responseCC.token);
          localStorage.setItem("role", userData.role);
          localStorage.setItem("auth", "true");
          localStorage.setItem("Data", new Date());
          return userData;
        })
        .then((response) => {
          retornoVar = response;
          return retornoVar;
        })
        .catch(function (error) {
          console.log(error);
          if (error.response.status != 200) {
            alert("Ocorreu um erro no login, tente novamente");
            router.push({ name: "auth-login" });
          }
        });
      return retornoVar;
    }

    let userData = sendVar(userData2).then((retorno) => {
      userData2 = retorno;
      return userData2;
    });
    return await userData;
  }
  async registerCC(userData) {
    var axios = require("axios");
    var data = userData;

    var config = {
      method: "post",
      url: process.env.VUE_APP_BASE_URL + "/entrance/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async renewToken(token, refresh_token) {
    var axios = require("axios");
    // var data = userData;
    var data = JSON.stringify({
      token: refresh_token,
    });

    var config = {
      method: "put",
      url: process.env.VUE_APP_BASE_URL + "/entrance/refresh_token",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer + ${token}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        const responseCC = {
          token: response.data.token,
        };
        return responseCC;
      })
      .then((responseCC) => {
        const userData = responseCC;
        localStorage.setItem("token", userData.token);
        localStorage.setItem("refresh_token", userData.refresh_token);
        useJwt.setToken(responseCC.token);
        localStorage.setItem("auth", "true");
        localStorage.setItem("Data", new Date());
      })
      .catch(function (error) {
        // Remove userData from localStorage
        console.log(error.request.status);
        console.log(error);

        if (error.request.status == "500" || error.request.status == "401") {
          // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
          localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName);
          localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName);

          // Remove userData from localStorage
          localStorage.removeItem("userData");
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("Data");
          localStorage.removeItem("userData");
          localStorage.removeItem("token");
          localStorage.removeItem("loglevel:webpack-dev-server");
          localStorage.removeItem("role");
          localStorage.removeItem("auth");

          // Reset ability
          this.$ability.update(initialAbility);

          // Redirect to login page
          this.$router.push({ name: "auth-login" });
        }
      });
  }
}
