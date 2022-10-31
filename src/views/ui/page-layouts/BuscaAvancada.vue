<template>
  <validation-observer ref="cadastroForm">
    <b-form @submit.prevent="buscaAvancada">
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
        <b-col cols="6">
          <b-form-group label="Área (De)" label-for="areaMin">
            <b-form-input
              v-model="areaMin"
              id="areaMin"
              type="number"
              placeholder="Area"
            />
          </b-form-group>
        </b-col>
        <!-- Area -->
        <b-col cols="6">
          <b-form-group label="Área (Até)" label-for="areaMax">
            <b-form-input
              v-model="areaMax"
              id="areaMax"
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
        <b-col md="6">
          <b-form-group label="Valor (De)" label-for="valorMin">
            <b-form-input
              v-model="valorMin"
              id="valorMin"
              type="number"
              placeholder="0"
            />
          </b-form-group>
        </b-col>
        <!-- Valor -->
        <b-col md="6">
          <b-form-group label="Valor (Até)" label-for="valorMax">
            <b-form-input
              v-model="valorMax"
              id="valorMax"
              type="number"
              placeholder="9999999"
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

        <!-- submit and reset -->
        <b-col>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="text"
            variant="primary"
            class="mr-1"
          >
            Buscar Imóveis
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
  BFormDatalist,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { BFormSelect } from "bootstrap-vue";
import { VueGoodTable } from "vue-good-table";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
require("dotenv").config();
export default {
  components: {
    BRow,
    BCol,
    VueGoodTable,
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
      areaMin: "",
      quartos: "",
      suites: "",
      valorMin: "",
      condominio: "",
      valorMax: "",
      areaMax: "",
    };
  },
  methods: {
    buscaAvancada(params) {
      // this.$refs.cadastroForm.validate().then((success) => {
      // if (success) {
      // var axios = require("axios");
      var data = JSON.stringify({
        finalidade: this.finalidade,
        tipo: this.tipo,
        cidade: this.cidade,
        bairro: this.bairro,
        area: this.area,
        quartos: this.quartos,
        suites: this.suites,
        valor: this.valor,
        condominio: this.condominio,
      });

      // console.log(params);

      this.$router.push({
        name: "dashboard-buscaAvancadaTabela",
        params: {
          finalidade: this.finalidade,
          tipo: this.tipo,
          cidade: this.cidade,
          bairro: this.bairro,
          areaMin: this.areaMin,
          areaMax: this.areaMax,
          quartos: this.quartos,
          suites: this.suites,
          valorMin: this.valorMin,
          valorMax: this.valorMax,
          condominio: this.condominio,
        },
      });
      // var config = {
      //   method: "post",
      //   url: `${process.env.VUE_APP_BASE_URL}/realestate`,
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      //   data: data,
      // };
      // let router = this.$router;
      // let pop = this.$toast;
      // axios(config)
      //   .then(function (response) {
      //     console.log(JSON.stringify(response.data));
      //     pop({
      //       component: ToastificationContent,
      //       props: {
      //         title: "Imóvel Cadastrado com Sucesso",
      //         icon: "PlusIcon",
      //         variant: "success",
      //       },
      //     });
      //   })
      //   .then(function (response) {
      //     router.go();
      //   })
      //   .catch(function (error) {
      //     pop({
      //       component: ToastificationContent,
      //       props: {
      //         title: "Imóvel não cadastrado",
      //         icon: "XIcon",
      //         variant: "danger",
      //       },
      //     });
      //     console.log(error);
      //   });
      // }
      // });
    },
  },
};
</script>
