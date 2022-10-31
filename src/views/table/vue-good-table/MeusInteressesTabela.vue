<template>
  <b-card-code title="Imóveis Cadastrados">
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
      style="margin-bottom: 10px"
      :to="{ name: 'dashboard-buscaAvancada' }"
    >
      <feather-icon icon="SearchIcon" class="mr-50" />
      Busca Avançada
    </b-button>
    <!-- advance search input -->
    <div class="custom-search">
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
    </div>

    <!-- table -->
    <vue-good-table
      :columns="columns"
      :rows="rowsFiltered"
      :rtl="direction"
      :search-options="{
        enabled: true,
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
      <div slot="emptystate">Nenhum Imóvel Cadastrado</div>
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
        </span>
        <span v-else>
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
                props.row.broker.fullName
                  ? props.row.broker.fullName + ", "
                  : ""
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
    BButton,
    BBadge,
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
      token: localStorage.getItem("token"),
      searchTerm: "",
      search: "",
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

      valores = this.rows.filter((item) => {
        return (
          item.condominio.toLowerCase().indexOf(this.search.toLowerCase()) >
            -1 ||
          item.bairro.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          item.tipo.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          item.finalidade.toLowerCase().indexOf(this.search.toLowerCase()) >
            -1 ||
          item.valor.toString().indexOf(this.search.toString()) > -1 ||
          item.cidade.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          item.area.toString().indexOf(this.search.toString()) > -1 ||
          item.quartos.toString().indexOf(this.search.toString()) > -1 ||
          item.suites.toString().indexOf(this.search.toString()) > -1
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
    loseInterest(imovelId) {
      let router = this.$router;
      var axios = require("axios");
      let pop = this.$toast;

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
          pop({
            component: ToastificationContent,
            props: {
              title: "Imóvel Retirado dos Favoritos",
              icon: "XIcon",
              variant: "danger",
            },
          });
          router.go();
        })
        .catch(function (error) {
          console.log(error);
        });

      // console.log(imovelId);
    },
    created() {
      var axios = require("axios");
      let token = localStorage.getItem("token");

      var config = {
        method: "get",
        url: `${process.env.VUE_APP_BASE_URL}/user/me/interests`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      axios(config)
        .then((response) => {
          // console.log(response.data);
          // this.rows = response.data;
          return response;
        })
        .then((res) => {
          this.rows = res.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  async beforeMount() {
    this.created();
  },
};
</script>
