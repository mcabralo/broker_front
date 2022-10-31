<template>
  <b-card-code title="Busca Avançada">
    <b-button
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
      style="margin-bottom: 10px; margin-right: 10px"
      :to="{ name: 'dashboard-cadastrarImovel' }"
    >
      <feather-icon icon="PlusCircleIcon" class="mr-50" />
      Cadastrar Imóvel
    </b-button>
    <b-button
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
      style="margin-bottom: 10px; margin-right: 10px"
      :to="{ name: 'dashboard-minhasNecessidades' }"
    >
      <feather-icon icon="HeartIcon" class="mr-50" />
      Minhas Necessidades
    </b-button>
    <b-button
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
      style="margin-bottom: 10px"
      :to="{ name: 'dashboard-buscaAvancada' }"
    >
      <feather-icon icon="SearchIcon" class="mr-50" />
      Fazer Nova Busca
    </b-button>
    <!-- advance search input -->
    <!-- <div class="custom-search">
      <b-row>
        <b-col md="12">
          <b-form-group>
            <label>Busca:</label>
            <b-form-input
              placeholder="Busca..."
              type="text"
              class="d-inline-block"
              v-model="search"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </div> -->

    <!-- table -->
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :rtl="direction"
      :search-options="{
        enabled: false,
        externalQuery: searchTerm,
      }"
      :select-options="{
        enabled: false,
        selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
        selectionInfoClass: 'custom-class',
        selectionText: 'rows selected',
        clearSelectionText: 'clear',
        disableSelectInfo: true, // disable the select info panel on top
        selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
      }"
      :pagination-options="{
        enabled: true,
        perPage: pageLength,
      }"
      theme="my-theme"
    >
      <div slot="emptystate">Nenhum Imóvel Com Essas Características</div>
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'fullName'" class="text-nowrap">
          <b-avatar :src="props.row.avatar" class="mx-1" />
          <span>{{ props.row.fullName }}</span>
        </span>
        <span v-else-if="props.column.field === 'imovel'">
          <!-- {{ this.rows }} -->
          <b
            ><h3>
              {{
                props.row.condominio
                  ? "Condomínio " + props.row.condominio
                  : "Casa "
              }}
              {{ props.row.bairro ? "/ " + props.row.bairro : "" }}
            </h3></b
          >
          {{ props.row.tipo + ", " }}
          {{ props.row.finalidade + ", " }}
          {{ "R$ " + props.row.valor + ", " }}
          {{ props.row.cidade + ", " }}
          {{ props.row.area + "m², " }}
          {{ props.row.quartos ? props.row.quartos + "/4" : "" }}
          {{
            props.row.suites == 0
              ? ""
              : props.row.suites == 1
              ? "e " + props.row.suites + " suite"
              : "e " + props.row.suites + " suites"
          }}
          <br />
          <b-badge style="color: #454545" pill variant="info">{{
            props.row.contacts.length
          }}</b-badge>
          <i>
            {{
              props.row.contacts.length != 1
                ? "Interessados neste imóvel"
                : "Interessado neste imóvel"
            }}</i
          >
        </span>
        <span v-else-if="count(props.row.contacts) == 1">
          <b-button
            b-tooltip.hover
            title="Remover dos Interessados"
            pill
            variant="primary"
            class="btn-icon"
            @click="loseInterest(props.row.id)"
          >
            <!-- <feather-icon icon="CircleIcon" size="18" /> -->
            <feather-icon icon="HeartIcon" size="18" />
          </b-button>
          <span
            style="margin-left: 10px"
            v-if="props.row.broker.whatsapp_number"
          >
            <b-button
              b-tooltip.hover
              title="Enviar Mensagem ao Corretor"
              pill
              variant="success"
              class="btn-icon"
              target="new"
              :href="'https://wa.me/55' + props.row.broker.whatsapp_number"
            >
              <!-- <feather-icon icon="CircleIcon" size="18" /> -->
              <feather-icon icon="MessageCircleIcon" size="18" />
            </b-button>
            <br /><br />
            {{
              props.row.broker.fullName ? props.row.broker.fullName + ", " : ""
            }}
            {{ props.row.broker.creci ? props.row.broker.creci : "" }}
          </span>
        </span>
        <span v-else>
          <b-button
            b-tooltip.hover
            title="Adicionar aos Interessados"
            pill
            variant="outline-primary"
            class="btn-icon"
            @click="showInterest(props.row.id)"
          >
            <feather-icon icon="HeartIcon" size="18" />
            <!-- <feather-icon icon="HeartIcon" size="18" /> -->
          </b-button>
          <span
            style="margin-left: 10px"
            v-if="props.row.broker.whatsapp_number"
          >
            <b-button
              b-tooltip.hover
              title="Enviar Mensagem ao Corretor"
              pill
              variant="success"
              class="btn-icon"
              target="new"
              :href="'https://wa.me/55' + props.row.broker.whatsapp_number"
            >
              <!-- <feather-icon icon="CircleIcon" size="18" /> -->
              <feather-icon icon="MessageCircleIcon" size="18" />
            </b-button>
            <br /><br />
            {{
              props.row.broker.fullName ? props.row.broker.fullName + ", " : ""
            }}
            {{ props.row.broker.creci ? props.row.broker.creci : "" }}
          </span>
        </span>
      </template>

      <!-- pagination -->
      <template slot="pagination-bottom" slot-scope="props">
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex align-items-center mb-0 mt-1">
            <span class="text-nowrap"> Mostrando 1 até </span>
            <b-form-select
              v-model="pageLength"
              :options="['3', '5', '10', '20', '25']"
              class="mx-1"
              @input="
                (value) => props.perPageChanged({ currentPerPage: value })
              "
            />
            <span class="text-nowrap"> of {{ props.total }} registros </span>
          </div>
          <div>
            <b-pagination
              :value="1"
              :total-rows="props.total"
              :per-page="pageLength"
              first-number
              last-number
              align="right"
              prev-class="prev-item"
              next-class="next-item"
              class="mt-1 mb-0"
              @input="(value) => props.pageChanged({ currentPage: value })"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </div>
        </div>
      </template>
    </vue-good-table>

    <template #code>
      {{ codeAdvance }}
    </template>
  </b-card-code>
</template>

<script>
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import {
  BAvatar,
  BPagination,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BRow,
  BCol,
  BButton,
  BBadge,
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { VueGoodTable } from "vue-good-table";
import store from "@/store/index";
import { codeAdvance } from "./code";
import { isJwtExpired } from "jwt-check-expiration";
import jwt_decode from "jwt-decode";
import Ripple from "vue-ripple-directive";
import router from "@/router";
require("dotenv").config();

export default {
  components: {
    BCardCode,
    VueGoodTable,
    BAvatar,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BRow,
    BCol,
    BBadge,
    BButton,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  data() {
    return {
      pageLength: 10,
      dir: false,
      codeAdvance,
      columns: [
        {
          label: "Imóvel",
          field: "imovel",
        },
        {
          label: "Corretor Responsável",
          field: "contato",
        },
      ],
      rows: [],
      searchTerm: "",
      search: "",
      token: localStorage.getItem("token"),
      finalidade: this.$route.params.finalidade || null,
      tipo: this.$route.params.tipo || null,
      cidade: this.$route.params.cidade || null,
      bairro: this.$route.params.bairro || null,
      areaMin: this.$route.params.areaMin || null,
      areaMax: this.$route.params.areaMax || null,
      quartos: this.$route.params.quartos || null,
      suites: this.$route.params.suites || null,
      valorMin: this.$route.params.valorMin || null,
      valorMax: this.$route.params.valorMax || null,
      condominio: this.$route.params.condominio || null,
    };
  },
  directives: {
    Ripple,
  },
  computed: {
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true;
        return this.dir;
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false;
      return this.dir;
    },
    rowsFiltered() {
      let valores = [];

      valores = this.rows.filter((i) => {
        return (
          i.condominio.toLowerCase().indexOf(this.condominio.toLowerCase()) >
            -1 ||
          i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1 ||
          i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 ||
          i.finalidadelidade
            .toLowerCase()
            .indexOf(this.finalidadelidade.toLowerCase()) > -1 ||
          i.valor.toString().indexOf(this.valor.toString()) > -1 ||
          i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) > -1 ||
          i.area.toString().indexOf(this.area.toString()) > -1 ||
          i.quartos.toString().indexOf(this.quartos.toString()) > -1 ||
          i.suites.toString().indexOf(this.suites.toString()) > -1
        );
      });

      return valores;
    },
  },
  methods: {
    advanceSearch(val) {
      // console.log(this.searchTerm);
      // console.log(val);
      this.searchTerm = val;
    },
    // onRowClick(params) {
    //   this.$toast({
    //     component: ToastificationContent,
    //     props: {
    //       title: `Hello user! You have clicked on row ${params.row.id}`,
    //       icon: "UserIcon",
    //       variant: "success",
    //     },
    //   });
    // },
    showInterest(imovelId) {
      let router = this.$router;
      var axios = require("axios");

      var config = {
        method: "post",
        url: `${process.env.VUE_APP_BASE_URL}/realestate/${imovelId}/interest`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      };

      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          router.push({ name: "dashboard-buscaAvancada" });
        })
        .catch(function (error) {
          console.log(error);
        });

      // console.log(imovelId);
    },
    loseInterest(imovelId) {
      let router = this.$router;
      var axios = require("axios");

      var config = {
        method: "delete",
        url: `${process.env.VUE_APP_BASE_URL}/realestate/${imovelId}/interest`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      };

      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          router.push({ name: "dashboard-buscaAvancada" });
        })
        .catch(function (error) {
          console.log(error);
        });

      // console.log(imovelId);
    },
    count(teste) {
      let userId = jwt_decode(this.token);
      for (let i = 0; i < teste.length; i++) {
        if (userId.user == teste[i].id) {
          return 1;
        }
      }
    },
    created() {
      var axios = require("axios");

      var config = {
        method: "get",
        url: `${process.env.VUE_APP_BASE_URL}/realestate`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      };

      axios(config)
        .then((response) => {
          // console.log(response.data);
          // this.rows = response.data;
          return response;
        })
        .then((res) => {
          // this.rows = res.data;
          let valores = [];

          // valores = res.data.filter((i) => {
          //   return (
          //     i.finalidade.toLowerCase().indexOf(this.finalidade.toLowerCase() || '') > -1 &&
          //     i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase() || '') > -1 &&
          //     i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase() || '') > -1 &&
          //     i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase() || '') > -1 &&
          //     i.area >= Number(this.areaMin) &&
          // i.area <= Number(this.areaMax) &&
          //     i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
          //     i.suites.toString().indexOf(this.suites.toString()) > -1 &&
          //     i.valor >= Number(this.valorMin) &&
          //     i.valor <= Number(this.valorMax)
          //   );
          // });

          // console.log(valores);

          // console.log(
          //   (this.finalidade != null &&
          //     this.tipo != null &&
          //     this.cidade != null &&
          //     this.bairro != null &&
          //     this.area != null &&
          //     this.quartos != null &&
          //     this.suites != null &&
          //     this.valorMin != null &&
          //     this.valorMax != null &&
          //     this.condominio != null) == null
          // );

          switch (true) {
            case this.finalidade != null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("1");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("2");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("3");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("4");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("5");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("6");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("7");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("8");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case (this.valorMin != null || this.valorMax != null) &&
              this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.condominio == null:
              console.log("9");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.tipo != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("10");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1
                );
              });
              break;
            case this.tipo != null &&
              this.cidade != null &&
              this.finalidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("11");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) > -1
                );
              });
              break;
            case this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              this.finalidade == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("12");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
                );
              });
              break;
            case this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.finalidade == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("13");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.finalidade == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("14");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              this.finalidade == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("15");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.finalidade == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("16");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.cidade != null &&
              this.finalidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("17");
              valores = res.data.filter((i) => {
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) > -1
                );
              });
              break;
            case this.cidade != null &&
              this.bairro != null &&
              this.finalidade == null &&
              this.tipo == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("18");
              valores = res.data.filter((i) => {
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
                );
              });
              break;
            case this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.finalidade == null &&
              this.tipo == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("19");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites == null &&
              this.finalidade == null &&
              this.tipo == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("20");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              this.finalidade == null &&
              this.tipo == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("21");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.finalidade == null &&
              this.tipo == null &&
              this.condominio == null:
              console.log("22");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.bairro != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("23");
              valores = res.data.filter((i) => {
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
                );
              });
              break;
            case this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("24");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("25");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("26");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.condominio == null:
              console.log("27");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.bairro != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("28");
              valores = res.data.filter((i) => {
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
                );
              });
              break;
            case this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("29");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("30");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("31");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.condominio == null:
              console.log("32");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case (this.areaMin != null || this.areaMax != null) &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("33");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("34");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("35");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.condominio == null:
              console.log("36");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.quartos != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("37");
              valores = res.data.filter((i) => {
                return (
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.quartos != null &&
              this.suites != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("38");
              valores = res.data.filter((i) => {
                return (
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.condominio == null:
              console.log("39");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.suites != null &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("40");
              valores = res.data.filter((i) => {
                return i.suites.toString().indexOf(this.suites.toString()) > -1;
              });
              break;
            case this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.condominio == null:
              console.log("41");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade != null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("42");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("43");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("44");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.areaMin.toLowerCase().indexOf(this.areaMin.toLowerCase()) >
                    -1
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("45");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("46");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.finalidade != null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.condominio == null:
              console.log("47");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade.toString().indexOf(this.finalidade.toString()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("48");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("48");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("49");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("50");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("51");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.finalidade == null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.condominio == null:
              console.log("52");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("53");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("54");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("55");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("56");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("57");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.finalidade != null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.condominio == null:
              console.log("58");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.finalidade.toString().indexOf(this.finalidade.toString()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.cidade == null &&
              this.tipo != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("59");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("60");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("61");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("62");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("63");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade.toString().indexOf(this.finalidade.toString()) >
                    -1 &&
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("64");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("65");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("66");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("67");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("68");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("69");
              valores = res.data.filter((i) => {
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("70");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("71");
              valores = res.data.filter((i) => {
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("72");
              valores = res.data.filter((i) => {
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("73");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.bairro.toString().indexOf(this.bairro.toString()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("74");
              valores = res.data.filter((i) => {
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("75");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("76");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("77");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.bairro.toString().indexOf(this.bairro.toString()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("78");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("79");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("80");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("81");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("82");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("83");
              valores = res.data.filter((i) => {
                return (
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("84");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("85");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("86");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade.toString().indexOf(this.finalidade.toString()) >
                    -1 &&
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("87");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("88");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("89");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade.toString().indexOf(this.finalidade.toString()) >
                    -1 &&
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("90");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("91");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade.toString().indexOf(this.finalidade.toString()) >
                    -1 &&
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("92");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("93");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("94");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("95");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("96");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("97");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("98");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("99");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("100");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("101");
              valores = res.data.filter((i) => {
                return (
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("102");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area.toLowerCase().indexOf(this.areaMin.toLowerCase()) >
                    -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("103");
              valores = res.data.filter((i) => {
                return (
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos != null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("104");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("105");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("106");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("107");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area.toLowerCase().indexOf(this.areaMin.toLowerCase()) >
                    -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("108");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("108");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.area.toLowerCase().indexOf(this.areaMin.toLowerCase()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("109");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.area.toLowerCase().indexOf(this.areaMin.toLowerCase()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("110");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("111");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("112");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("113");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("114");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade.toString().indexOf(this.finalidade.toString()) >
                    -1 &&
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("115");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade.toString().indexOf(this.finalidade.toString()) >
                    -1 &&
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("116");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toString().indexOf(this.tipo.toString()) > -1 &&
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("117");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("117");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    i.quartos.toLowerCase().indexOf(this.quartos.toStromg()) >
                    i.suites.toString().indexOf(this.suitestoLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos != null &&
              this.suites != null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("118");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    i.quartos.toLowerCase().indexOf(this.quartos.toStromg()) >
                    i.suites.toString().indexOf(this.suitestoLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("119");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.cidade.toString().indexOf(this.cidade.toString()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax) &&
                  i.condominio.toString().indexOf(this.condominio.toString()) >
                    -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("119");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("120");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade == null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("121");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("122");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade == null &&
              this.bairro != null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("123");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.bairro.toLowerCase().indexOf(this.bairrode.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio == null:
              console.log("124");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax) &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("125");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade != null &&
              this.bairro == null &&
              this.quartos != null &&
              this.areaMin == null &&
              this.areaMax == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("126");
              valores = res.data.filter((i) => {
                return (
                  i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
                    -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro != null &&
              this.quartos != null &&
              this.areaMin == null &&
              this.areaMax == null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("127");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.quartos.toString().indexOf(this.quartos.toString()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              (this.areaMin != null || this.areaMax != null) &&
              this.quartos == null &&
              this.suites == null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio != null:
              console.log("128");
              valores = res.data.filter((i) => {
                this.areaMax != null
                  ? this.areaMax
                  : (this.areaMax = "99999999999");
                this.areaMin != null ? this.areaMin : (this.areaMin = "0");
                return (
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1 &&
                  i.area >= Number(this.areaMin) &&
                  i.area <= Number(this.areaMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.areaMax == null &&
              this.quartos == null &&
              this.suites == null &&
              (this.valorMin != null || this.valorMax != null) &&
              this.condominio != null:
              console.log("129");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.condominio
                    .toLowerCase()
                    .indexOf(this.condominio.toLowerCase()) > -1 &&
                  i.valor >= Number(this.valorMin) &&
                  i.valor <= Number(this.valorMax)
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo != null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.areaMax == null &&
              this.quartos != null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("130");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
                  i.quartos.toStromg().indexOf(this.quartos.toStromg()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade == null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro != null &&
              this.areaMin == null &&
              this.areaMax == null &&
              this.quartos != null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("131");
              valores = res.data.filter((i) => {
                this.valorMax != null
                  ? this.valorMax
                  : (this.valorMax = "99999999999");
                this.valorMin != null ? this.valorMin : (this.valorMin = "0");
                return (
                  i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
                    -1 &&
                  i.quartos.toStromg().indexOf(this.quartos.toStromg()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            case this.finalidade != null &&
              this.tipo == null &&
              this.cidade == null &&
              this.bairro == null &&
              this.areaMin == null &&
              this.areaMax == null &&
              this.quartos != null &&
              this.suites != null &&
              this.valorMin == null &&
              this.valorMax == null &&
              this.condominio == null:
              console.log("132");
              valores = res.data.filter((i) => {
                return (
                  i.finalidade
                    .toLowerCase()
                    .indexOf(this.finalidade.toLowerCase()) > -1 &&
                  i.quartos.toStromg().indexOf(this.quartos.toStromg()) > -1 &&
                  i.suites.toString().indexOf(this.suites.toString()) > -1
                );
              });
              break;
            default:
              console.log("default");
              valores = res.data;
              break;
          }

          //         case this.finalidade != null &&
          // this.tipo != null &&
          // this.cidade != null &&
          // this.bairro != null &&
          // (this.areaMin != null || this.areaMax != null) &&
          // this.quartos != null &&
          // this.suites != null &&
          // (this.valorMin != null || this.valorMax != null) &&
          // this.condominio != null:
          // console.log("106");
          // valores = res.data.filter((i) => {
          //   this.valorMax != null
          //     ? this.valorMax
          //     : (this.valorMax = "99999999999");
          //   this.valorMin != null ? this.valorMin : (this.valorMin = "0");
          //   return (
          //     i.finalidade.toLowerCase().indexOf(this.finalidade.toLowerCase()) > -1 &&
          //     i.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 &&
          //     i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) > -1 &&
          //     i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1 &&
          //     i.area.toLowerCase().indexOf(this.areaMin.toLowerCase()) > -1 &&
          //     i.valor >= Number(this.valorMin) &&
          //     i.valor <= Number(this.valorMax) &&
          //     i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1 &&
          //     i.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) > -1
          //       -1
          //   );
          // });
          // break;

          //         case this.finalidade == null &&
          // this.cidade == null &&
          // this.tipo == null &&
          // this.bairro == null &&
          // this.area == null &&
          // this.quartos == null &&
          // this.suites == null &&
          // this.valorMin == null &&
          // this.valorMax == null &&
          // this.condominio == null:
          // console.log("42");
          // valores = res.data.filter((i) => {
          //   return (
          //     i.finalidade
          //       .toLowerCase()
          //       .indexOf(this.finalidade.toLowerCase()) > -1 &&
          //     i.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) > -1
          //   );
          // });
          // break;

          // this.finalidade;
          // this.tipo;
          // this.cidade;
          // this.bairro;
          // this.area;
          // this.quartos;
          // this.suites;
          // this.valorMin;
          // this.valorMax;
          // this.condominio;

          // valores = res.data.filter((item) => {
          //   return (
          //     item.condominio
          //       .toLowerCase()
          //       .indexOf(this.condominio.toLowerCase()) > -1 ||
          //     item.bairro ? console.log(item.bairro) : ''
          //   );
          // });
          // valores = res.data.filter((item) => {
          //   return (
          //     item.condominio
          //       .toLowerCase()
          //       .indexOf(this.condominio.toLowerCase()) > -1 ||
          //     item.bairro.toLowerCase().indexOf(this.bairro.toLowerCase()) >
          //       -1 ||
          //     item.tipo.toLowerCase().indexOf(this.tipo.toLowerCase()) > -1 ||
          //     item.finalidade
          //       .toLowerCase()
          //       .indexOf(this.finalidadelidade.toLowerCase()) > -1 ||
          //     item.valor.toString().indexOf(this.valor.toString()) > -1 ||
          //     item.cidade.toLowerCase().indexOf(this.cidade.toLowerCase()) >
          //       -1 ||
          //     item.area.toString().indexOf(this.area.toString()) > -1 ||
          //     item.quartos.toString().indexOf(this.quartos.toString()) > -1 ||
          //     item.suites.toString().indexOf(this.suites.toString()) > -1
          //   );
          // });

          // let produtos = [
          //   { nome: "Coca Cola", preco: 5 },
          //   { nome: "Pizza", preco: 15 },
          //   { nome: "Kinder Ovo", preco: 99 },
          //   { nome: "Pizza", preco: 25 },
          // ];

          // let produtosCaros = produtos.filter(function (value, index, arr) {
          //   return (arr[index].preco > 20 || arr[index].nome == null);
          // });

          // console.log(valores);

          this.rows = valores;
        })
        .catch(function (error) {
          console.log(error);
        });
      // var axios = require("axios");
      // let token = localStorage.getItem("token");

      // var config = {
      //   method: "get",
      //   url: `${process.env.VUE_APP_BASE_URL}/user/me/interests`,
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // };
      // axios(config)
      //   .then((response) => {
      //     // console.log(response.data);
      //     // this.rows = response.data;
      //     return response;
      //   })
      //   .then((res) => {
      //     this.rows = res.data;
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
    },
  },
  async beforeMount() {
    this.created();
  },
};
</script>
