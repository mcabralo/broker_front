<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />

        <h2 class="brand-text text-primary ml-1">Connect Corretores</h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
        <div
          class="w-100 d-lg-flex align-items-center justify-content-center px-5"
        >
          <b-img fluid :src="imgUrl" alt="Register V2" />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Register-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <b-card-title class="mb-1">
            Se prepare para conectar com outros corretores! 🚀
          </b-card-title>
          <b-card-text class="mb-2">
            Facilite e conecte seu cliente com sua casa dos sonhos!
          </b-card-text>

          <!-- form -->
          <validation-observer ref="registerForm" #default="{ invalid }">
            <b-form class="auth-register-form mt-2" @submit.prevent="register">
              <!-- username
              <b-form-group label="Usuário" label-for="register-username">
                <validation-provider
                  #default="{ errors }"
                  name="Username"
                  vid="username"
                  rules="required"
                >
                  <b-form-input
                    id="register-username"
                    v-model="username"
                    name="register-username"
                    :state="errors.length > 0 ? false : null"
                    placeholder="usuario"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group> -->

              <!-- fullName -->
              <b-form-group label="Nome Completo" label-for="fullName">
                <validation-provider
                  #default="{ errors }"
                  name="fullName"
                  vid="fullName"
                  rules="required"
                >
                  <b-form-input
                    id="fullName"
                    v-model="fullName"
                    name="fullName"
                    :state="errors.length > 0 ? false : null"
                    placeholder="João da Silva"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- mobile -->
              <b-form-group label="Telefone (Whatsapp)" label-for="whatsapp_number">
                <validation-provider
                  #default="{ errors }"
                  name="whatsapp_number"
                  vid="whatsapp_number"
                  rules="required"
                >
                  <b-form-input
                    id="whatsapp_number"
                    type="number"
                    pattern="[+]{1}[0-9]{11,14}"
                    v-model="whatsapp_number"
                    name="whatsapp_number"
                    :state="errors.length > 0 ? false : null"
                    placeholder="(71) 99999-9999"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- creci -->
              <b-form-group label="Creci" label-for="creci">
                <validation-provider
                  #default="{ errors }"
                  name="creci"
                  vid="creci"
                  rules="required"
                >
                  <b-form-input
                    id="creci"
                    v-model="creci"
                    name="creci"
                    :state="errors.length > 0 ? false : null"
                    placeholder="CRECI-BA 10002016"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- emailAddress -->
              <b-form-group label="Email" label-for="emailAddress">
                <validation-provider
                  #default="{ errors }"
                  name="emailAddress"
                  vid="emailAddress"
                  rules="required"
                >
                  <b-form-input
                    id="emailAddress"
                    v-model="emailAddress"
                    name="emailAddress"
                    :state="errors.length > 0 ? false : null"
                    placeholder="usuario@email.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- password -->
              <b-form-group label-for="password" label="Senha">
                <validation-provider
                  #default="{ errors }"
                  name="password"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="password"
                      v-model="password"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      :state="errors.length > 0 ? false : null"
                      name="password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        :icon="passwordToggleIcon"
                        class="cursor-pointer"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- <b-form-group>
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="status"
                  name="checkbox-1"
                >
                  I agree to
                  <b-link>privacy policy & terms</b-link>
                </b-form-checkbox>
              </b-form-group> -->

              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="invalid"
              >
                Registrar
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <span>Já possui uma conta?</span>
            <b-link :to="{ name: 'auth-login' }">
              <span>&nbsp;Faça login</span>
            </b-link>
          </p>

          <!-- divider -->
          <!-- <div class="divider my-2">
            <div class="divider-text">ou</div>
          </div>

          <div class="auth-footer-btn d-flex justify-content-center">
            <b-button variant="facebook" href="javascript:void(0)">
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button variant="twitter" href="javascript:void(0)">
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button variant="google" href="javascript:void(0)">
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button variant="github" href="javascript:void(0)">
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div> -->
        </b-col>
      </b-col>
      <!-- /Register-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VuexyLogo from "@core/layouts/components/Logo.vue";
import {
  BRow,
  BCol,
  BLink,
  BButton,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BInputGroup,
  BInputGroupAppend,
  BImg,
  BCardTitle,
  BCardText,
} from "bootstrap-vue";
import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import store from "@/store/index";
import useJwt from "@/auth/jwt/useJwt";

export default {
  components: {
    VuexyLogo,
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    BCardText,
    BCardTitle,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    // validations
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: "",
      fullName: "",
      emailAddress: "",
      password: "",
      whatsapp_number: "",
      creci: "",
      sideImg: require("@/assets/images/pages/register-v2.svg"),
      // validation
      required,
      email,
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === "dark") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require("@/assets/images/pages/register-v2-dark.svg");
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    register() {
      this.$refs.registerForm.validate().then((success) => {
        if (success) {
          let userData = {
            emailAddress: this.emailAddress,
            fullName: this.fullName,
            whatsapp_number: this.whatsapp_number,
            creci: this.creci,
            password: this.password,
          };

          async function callFunciontReg(userData, router) {
            await useJwt.registerCC(userData).then(() => {
              router.push({ name: "auth-login" });
            });
          }

          callFunciontReg(userData, this.$router);
        }
      });
    },
  },
};
/* eslint-disable global-require */
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
