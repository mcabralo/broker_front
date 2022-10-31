<template>
  <div>
    <b-alert variant="primary" show>
      <div class="alert-body">
        <p>
          <strong>Dica: </strong>
          <span>Use os filtros para especializar sua busca.</span>
        </p>
      </div>
    </b-alert>
    <b-row>
      <b-col cols="12">
        <good-table-advance-search />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BAlert, BRow, BCol } from "bootstrap-vue";
import GoodTableAdvanceSearch from "../../table/vue-good-table/ImoveisPrincipal.vue";

export default {
  components: {
    BAlert,
    BRow,
    BCol,
    GoodTableAdvanceSearch,
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-good-table.scss";
</style>
