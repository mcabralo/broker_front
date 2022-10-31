<template>
  <validation-observer ref="cadastroForm" #default="{ invalid }">
    <b-card-code title="Corretores Interessados">
      <!-- table -->
      <vue-good-table
        :columns="columns"
        :rows="rows"
        :rtl="direction"
        @on-row-click="getWhatsapp"
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
        <div slot="emptystate">Nenhum corretor se interessou ainda</div>
        <template slot="table-row" slot-scope="props">
          <!-- <span v-if="props.column.field === 'fullName'" class="text-nowrap">
            <b-avatar :src="props.row.avatar" class="mx-1" />
            <span>{{ props.row.fullName }}</span>
          </span>
          <span v-else>
            <b>
            </b>
          </span> -->
          <span v-if="props.column.field === 'corretor'">
            <b>{{ props.row.fullName ? props.row.fullName : "" }}</b
            >{{ props.row.emailAddress ? ", " + props.row.emailAddress : "" }}
          </span>
          <span v-else-if="props.column.field === 'interactions'">
            <b-button
              b-tooltip.hover
              title="Enviar Mensagem ao Corretor"
              pill
              variant="success"
              class="btn-icon"
              target="new"
              style="margin-left: 10px"
              :href="'https://wa.me/55' + props.row.whatsapp_number"
            >
              <!-- <feather-icon icon="CircleIcon" size="18" /> -->
              <feather-icon icon="MessageCircleIcon" size="16" />
            </b-button>
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
    </b-card-code>
    <b-form @submit.prevent="cadastrarImovel">
      <b-row>
        <!-- Finalidade -->
        <b-col cols="12">
          <b-form-group
            id="finalidade"
            label="Finalidade"
            label-for="finalidade"
          >
            <b-form-select v-model="imovel.finalidade" :options="listFinalidade" />
          </b-form-group>
        </b-col>

        <!-- Tipo -->
        <b-col cols="12">
          <b-form-group id="tipo" label="Tipo" label-for="tipo">
            <b-form-select v-model="imovel.tipo" :options="listTipo" />
          </b-form-group>
        </b-col>

        <!-- Cidade -->
        <b-col cols="12">
          <b-form-group label="Cidade" label-for="cidade">
            <b-form-input
              v-model="imovel.cidade"
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
              v-model="imovel.bairro"
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
              v-model="imovel.area"
              id="area"
              type="number"
              placeholder="Area"
            />
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <!-- Quartos -->
          <b-form-group
            label="Quartos"
            label-for="quartos"
            v-if="imovel.quartos > 0 && imovel.suites > 0"
          >
            <b-form-input
              v-model="imovel.quartos"
              id="quartos"
              type="number"
              placeholder="Quartos"
            />
          </b-form-group>
        </b-col>

        <!-- Suites -->
        <b-col cols="12">
          <b-form-group
            label="Suites"
            label-for="suites"
            v-if="imovel.quartos > 0 && imovel.suites > 0"
          >
            <b-form-input
              v-model="imovel.suites"
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
              v-model="imovel.valor"
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
              v-model="imovel.condominio"
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
            type="submit"
            variant="primary"
            class="mr-1"
          >
            Salvar
          </b-button>
          <b-button
            id="delete"
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="button"
            @click="deleteImovel(imovel.id)"
            variant="danger"
          >
            Deletar
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
  BPagination,
  BFormDatalist,
} from "bootstrap-vue";
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import Ripple from "vue-ripple-directive";
import { BFormSelect } from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { ref, onUnmounted } from "@vue/composition-api";
import { VueGoodTable } from "vue-good-table";
import store from "@/store/index";
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
    BPagination,
    ToastificationContent,
    BCardCode,
    VueGoodTable,
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
      imovel: {},
      idImovel: this.$route.params.id,
      pageLength: 10,
      dir: false,
      token: localStorage.getItem("token"),
      columns: [
        {
          label: "Corretor",
          field: "corretor",
        },
        {
          label: "Contato",
          field: "interactions",
        },
      ],
      rows: {},
      searchTerm: "",
    };
  },
  beforeMount() {
    var axios = require("axios");

    var config = {
      method: "get",
      url: `${process.env.VUE_APP_BASE_URL}/realestate/${this.idImovel}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        return response;
      })
      .then((res) => {
        this.imovel = res.data;
        this.rows = res.data.contacts;
        // console.log(this.rows);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    cadastrarImovel() {
      this.$refs.cadastroForm.validate().then((success) => {
        if (success) {
          var axios = require("axios");
          var data = JSON.stringify({
            finalidade: this.imovel.finalidade,
            tipo: this.imovel.tipo,
            cidade: this.imovel.cidade,
            bairro: this.imovel.bairro,
            area: this.imovel.area,
            quartos: this.imovel.quartos,
            suites: this.imovel.suites,
            valor: this.imovel.valor,
            condominio: this.imovel.condominio,
          });

          console.log(data);

          var config = {
            method: "put",
            url: `${process.env.VUE_APP_BASE_URL}/realestate/${this.idImovel}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: data,
          };

          let router = this.$router;
          let pop = this.$toast;

          axios(config)
            .then(function (response) {
              // console.log(JSON.stringify(response.data));
              pop({
                component: ToastificationContent,
                props: {
                  title: "Imóvel Atualizado com Sucesso",
                  icon: "PlusIcon",
                  variant: "success",
                },
              });
            })
            .then(function (response) {
              // router.go();
            })
            .catch(function (error) {
              pop({
                component: ToastificationContent,
                props: {
                  title: "Imóvel Não Atualizado",
                  icon: "XIcon",
                  variant: "danger",
                },
              });
              console.log(error);
            });
        }
      });
    },
    getWhatsapp() {},
    deleteImovel(id) {
      if (
        confirm(
          "Tem certeza que deseja exluir? Não será possível recuperar este imóvel"
        )
      ) {
        var axios = require("axios");

        var config = {
          method: "delete",
          url: `${process.env.VUE_APP_BASE_URL}/realestate/${id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        let router = this.$router;

        axios(config)
          .then(function (response) {
            // console.log(JSON.stringify(response.data));
            router.push({ name: "dashboard-meusImoveis" });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
  },
};
</script>
