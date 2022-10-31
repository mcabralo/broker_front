<template>
  <b-card-code title="Imóveis Cadastrados">
    <!-- advance search input -->
    <!-- <div class="custom-search">
      <b-row>
        <b-col md="12">
          <b-form-group>
            <label>Busca:</label>
            <b-form-input
              placeholder="Condomínio..."
              type="text"
              class="d-inline-block"
              @input="advanceSearch"
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
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'fullName'" class="text-nowrap">
          <b-avatar :src="props.row.avatar" class="mx-1" />
          <span>{{ props.row.fullName }}</span>
        </span>
        <span v-else-if="props.column.field === 'imovel'">
          <!-- {{ this.rows }} -->
          <b>
            {{
              props.row.condominio ? "Condomínio " + props.row.condominio : ""
            }}
            {{ props.row.bairro ? "/ " + props.row.bairro : "" }}
          </b>
          <br />
          {{ props.row.tipo + ", " }}
          {{ props.row.finalidade + ", " }}
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
          <b-badge pill variant="primary">{{
            props.row.contacts.length
          }}</b-badge>
          <i> Interessados neste imóvel</i>
        </span>
        <span v-else-if="count(props.row.contacts) == 1">
          <b-button
            b-tooltip.hover
            title="Remover dos Interessados"
            pill
            variant="outline-primary"
            class="btn-icon"
            @click="loseInterest(props.row.id)"
          >
            <!-- <feather-icon icon="CircleIcon" size="18" /> -->
            <feather-icon icon="CheckCircleIcon" size="18" />
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
          </span>
        </span>
        <span v-else>
          <b-button
            b-tooltip.hover
            title="Adicionar aos Interessados"
            pill
            variant="primary"
            class="btn-icon"
            @click="showInterest(props.row.id)"
          >
            <feather-icon icon="CircleIcon" size="18" />
            <!-- <feather-icon icon="CheckCircleIcon" size="18" /> -->
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
  BTooltip,
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { VueGoodTable } from "vue-good-table";
import store from "@/store/index";
import { codeAdvance } from "./code";
import { isJwtExpired } from "jwt-check-expiration";
import jwt_decode from "jwt-decode";
import useJwt from "@/auth/jwt/useJwt";
require("dotenv").config()

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
    BTooltip,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  data() {
    return {
      pageLength: 10,
      imovelId: "",
      dir: false,
      codeAdvance,
      token: localStorage.getItem("token"),
      columns: [
        {
          label: "Imóvel",
          field: "imovel",
        },
        {
          label: "Interações",
          field: "interactions",
        },
      ],
      rows: [],
      searchTerm: "",
      number: "",
    };
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
  },
  methods: {
    advanceSearch(val) {
      // console.log(this.searchTerm);
      // console.log(val);
      this.searchTerm = val;
    },
    onRowClick() {
      // console.log(params);
      this.$router.push({ name: "editarImovel" }).catch((error) => {
        console.error;
      });
      // this.$toast({
      //   component: ToastificationContent,
      //   props: {
      //     title: `Hello user! You have clicked on row ${params.row.id}`,
      //     icon: "UserIcon",
      //     variant: "success",
      //   },
      // });
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
          this.rows = res.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
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
          router.go();
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
          router.go();
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
  },
  async beforeMount() {
    this.created();

    console.log(jwt_decode(this.token));

    if (isJwtExpired(this.token)) {
      this.created();
      // useJwt.loginCC('mc02@mail7.io', 'mc02');
    }
  },
};
</script>
