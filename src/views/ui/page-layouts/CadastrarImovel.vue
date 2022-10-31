<template>
  <validation-observer ref="cadastroForm" #default="{ invalid }">
    <b-form @submit.prevent="cadastrarImovel">
      <b-row>
        <!-- Finalidade -->
        <b-col cols="12">
          <b-form-group
            id="finalidade"
            label="Finalidade"
            label-for="finalidade"
          >
            <b-form-select v-model="finalidade" :options="listFinalidade" />
          </b-form-group>
        </b-col>

        <!-- Tipo -->
        <b-col cols="12">
          <b-form-group id="tipo" label="Tipo" label-for="tipo">
            <b-form-select v-model="tipo" :options="listTipo" />
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <span
            v-if="
              tipo == 'Apartamento' ||
              tipo == 'Casa' ||
              tipo == 'Sítios/Fazendas' ||
              tipo == 'Coberturas'
            "
          >
            <!-- Cidade -->
            <b-col cols="12">
              <b-form-group label="Cidade" label-for="cidade">
                <b-form-input
                  v-model="cidade"
                  id="cidade"
                  type="text"
                  placeholder="Cidade"
                />
              </b-form-group>
            </b-col>

            <!-- Bairro -->
            <b-col cols="12">
              <b-form-group label="Bairro" label-for="bairro">
                <b-form-input
                  v-model="bairro"
                  id="bairro"
                  type="text"
                  placeholder="Bairro"
                />
              </b-form-group>
            </b-col>

            <!-- Area -->
            <b-col cols="12">
              <b-form-group label="Area" label-for="area">
                <b-form-input
                  v-model="area"
                  id="area"
                  type="number"
                  placeholder="Area"
                />
              </b-form-group>
            </b-col>

            <!-- Quartos -->
            <b-col cols="12">
              <b-form-group label="Quartos" label-for="quartos">
                <b-form-input
                  v-model="quartos"
                  id="quartos"
                  type="number"
                  placeholder="Quartos"
                />
              </b-form-group>
            </b-col>

            <!-- Suites -->
            <b-col cols="12">
              <b-form-group label="Suites" label-for="suites">
                <b-form-input
                  v-model="suites"
                  id="suites"
                  type="number"
                  placeholder="Suites"
                />
              </b-form-group>
            </b-col>

            <!-- Valor -->
            <b-col md="12">
              <b-form-group label="Valor" label-for="valor">
                <b-form-input
                  v-model="valor"
                  id="valor"
                  type="number"
                  placeholder="Quartos"
                />
              </b-form-group>
            </b-col>

            <!-- condominio -->
            <b-col cols="12">
              <b-form-group label="Nome do Condomínio" label-for="condominio">
                <b-form-input
                  v-model="condominio"
                  id="condominio"
                  type="text"
                  placeholder="Nome do Condominio"
                />
              </b-form-group>
            </b-col>
          </span>

          <span
            v-else-if="
              tipo == 'Galpões' ||
              tipo == 'Terrenos' ||
              tipo == 'Salas Comerciais' ||
              tipo == 'Imóveis Comerciais' ||
              tipo == 'Pontos Comerciais'
            "
          >
            <!-- Cidade -->
            <b-col cols="12">
              <b-form-group label="Cidade" label-for="cidade">
                <b-form-input
                  v-model="cidade"
                  id="cidade"
                  type="text"
                  placeholder="Cidade"
                />
              </b-form-group>
            </b-col>

            <!-- Bairro -->
            <b-col cols="12">
              <b-form-group label="Bairro" label-for="bairro">
                <b-form-input
                  v-model="bairro"
                  id="bairro"
                  type="text"
                  placeholder="Bairro"
                />
              </b-form-group>
            </b-col>

            <!-- Area -->
            <b-col cols="12">
              <b-form-group label="Area" label-for="area">
                <b-form-input
                  v-model="area"
                  id="area"
                  type="number"
                  placeholder="Area"
                />
              </b-form-group>
            </b-col>

            <!-- Valor -->
            <b-col md="12">
              <b-form-group label="Valor" label-for="valor">
                <b-form-input
                  v-model="valor"
                  id="valor"
                  type="number"
                  placeholder="Quartos"
                />
              </b-form-group>
            </b-col>

            <!-- condominio -->
            <b-col cols="12">
              <b-form-group label="Nome do Condomínio" label-for="condominio">
                <b-form-input
                  v-model="condominio"
                  id="condominio"
                  type="text"
                  placeholder="Nome do Condominio"
                />
              </b-form-group>
            </b-col>
          </span>
        </b-col>

        <!-- submit and reset -->
        <b-col>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="text"
            variant="primary"
            class="mr-1"
          >
            Salvar
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="text"
            variant="outline-secondary"
          >
            Limpar
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </validation-observer>
</template>

<script>
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BFormText,
  BFormSelect,
  BFormDatalist,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
require("dotenv").config();

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BFormText,
    BButton,
    BFormDatalist,
    BFormSelect,
    ValidationProvider,
    ValidationObserver,
    ToastificationContent,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      finalidade: "",
      listFinalidade: ["Venda", "Aluguel", "Temporada", "Permuta"],
      tipo: "",
      listTipo: [
        "Apartamento",
        "Casa",
        "Sítios/Fazendas",
        "Coberturas",
        "Galpões",
        "Terrenos",
        "Salas Comerciais",
        "Imóveis Comerciais",
        "Pontos Comerciais",
      ],
      cidade: "",
      bairro: "",
      area: "",
      quartos: "",
      suites: "",
      valor: "",
      condominio: "",
    };
  },
  methods: {
    cadastrarImovel() {
      this.$refs.cadastroForm.validate().then((success) => {
        if (success) {
          var axios = require("axios");
          var data = JSON.stringify({
            finalidade: this.finalidade ? this.finalidade : null,
            tipo: this.tipo ? this.tipo : null,
            cidade: this.cidade ? this.cidade : null,
            bairro: this.bairro ? this.bairro : null,
            area: this.area ? this.area : null,
            quartos: this.quartos ? this.quartos : 0,
            suites: this.suites ? this.suites : 0,
            valor: this.valor ? this.valor : null,
            condominio: this.condominio ? this.condominio : null,
          });

          var config = {
            method: "post",
            url: `${process.env.VUE_APP_BASE_URL}/realestate`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: data,
          };

          let router = this.$router;
          let pop = this.$toast;
          let self = this;

          axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
              pop({
                component: ToastificationContent,
                props: {
                  title: "Imóvel Cadastrado com Sucesso",
                  icon: "PlusIcon",
                  variant: "success",
                },
              });
            })
            .then(function (response) {
              router.go();
            })
            .catch(function (error) {
              pop({
                component: ToastificationContent,
                props: {
                  title: "Imóvel não cadastrado",
                  icon: "XIcon",
                  variant: "danger",
                },
              });
              router.go();
              console.log(error);
            });
        }
      });
    },
  },
};
</script>
