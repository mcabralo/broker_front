<template>
  <b-card>
    <!-- media -->
    <!-- <b-media no-body>
      <b-media-aside>
        <b-link>
          <b-img
            ref="previewEl"
            rounded
            :src="optionsLocal.avatar"
            height="80"
          />
        </b-link> -->
    <!--/ avatar -->
    <!-- </b-media-aside>

      <b-media-body class="mt-75 ml-75"> -->
    <!-- upload button -->
    <!-- <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          size="sm"
          class="mb-75 mr-75"
          @click="$refs.refInputEl.$el.click()"
        >
          Upload
        </b-button>
        <b-form-file
          ref="refInputEl"
          v-model="profileFile"
          accept=".jpg, .png, .gif"
          :hidden="true"
          plain
          @input="inputImageRenderer"
        /> -->
    <!--/ upload button -->

    <!-- reset -->
    <!-- <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          variant="outline-secondary"
          size="sm"
          class="mb-75 mr-75"
        >
          Reset
        </b-button> -->
    <!--/ reset -->
    <!-- <b-card-text>Allowed JPG, GIF or PNG. Max size of 800kB</b-card-text>
      </b-media-body>
    </b-media> -->
    <!--/ media -->

    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col sm="6">
          <b-form-group label="Nome" label-for="name">
            <b-form-input
              v-model="user.fullName"
              placeholder="Nome"
              name="name"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Email" label-for="email">
            <b-form-input
              v-model="user.emailAddress"
              name="email"
              placeholder="usuario@example.com"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Creci" label-for="creci">
            <b-form-input
              v-model="user.creci"
              name="creci"
              placeholder="Creci"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Contato" label-for="contato">
            <b-form-input
              v-model="user.whatsapp_number"
              name="contato"
              placeholder="Contato"
            />
          </b-form-group>
        </b-col>

        <!-- alert -->
        <!-- <b-col
          cols="12"
          class="mt-75"
        >
          <b-alert
            show
            variant="warning"
            class="mb-50"
          >
            <h4 class="alert-heading">
              Your email is not confirmed. Please check your inbox.
            </h4>
            <div class="alert-body">
              <b-link class="alert-link">
                Resend confirmation
              </b-link>
            </div>
          </b-alert>
        </b-col> -->
        <!--/ alert -->

        <b-col cols="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-2 mr-1"
            @click.prevent="alterInfo"
          >
            Alterar
          </b-button>
          <!-- <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            type="reset"
            class="mt-2"
            @click.prevent="resetForm"
          >
            Reset
          </b-button> -->
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import {
  BFormFile,
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BRow,
  BCol,
  BAlert,
  BCard,
  BCardText,
  BMedia,
  BMediaAside,
  BMediaBody,
  BLink,
  BImg,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
import { ref } from "@vue/composition-api";
require("dotenv").config()

export default {
  components: {
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BAlert,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
  },
  directives: {
    Ripple,
  },
  props: {
    generalData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionsLocal: JSON.parse(JSON.stringify(this.generalData)),
      profileFile: null,
      user: {},
    };
  },
  beforeCreate() {
    var axios = require("axios");
    let token = localStorage.getItem("token");

    var config = {
      method: "get",
      url: `${process.env.VUE_APP_BASE_URL}/user/me`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then(function (response) {
        return response;
      })
      .then((resp) => {
        this.user = resp.data;
        // console.log(this.user);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    resetForm() {
      this.optionsLocal = JSON.parse(JSON.stringify(this.generalData));
    },
    alterInfo() {
      var axios = require("axios");
      let token = localStorage.getItem("token");

      var data = JSON.stringify({
        fullName: this.user.fullName,
        whatsapp_number: this.user.whatsapp_number,
        creci: this.user.creci,
        emailAddress: this.user.emailAddress,
      });

      var config = {
        method: "put",
        url: `${process.env.VUE_APP_BASE_URL}/user/me`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    },
  },
  setup() {
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl);

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
    };
  },
};
</script>
