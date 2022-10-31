export default [
  // {
  //   path: "/dashboard/analytics",
  //   name: "dashboard-analytics",
  //   component: () => import("@/views/dashboard/analytics/Analytics.vue"),
  // },
  // {
  //   path: "/dashboard/ecommerce",
  //   name: "dashboard-ecommerce",
  //   component: () => import("@/views/dashboard/ecommerce/Ecommerce.vue"),
  // },
  // {
  //   path: "/dashboard/tabela",
  //   name: "dashboard-tabela",
  //   component: () => import("@/views/ui/page-layouts/LayoutEmpty.vue"),
  //   meta: {
  //     pageTitle: "Todos os imóveis",
  //     // breadcrumb: [
  //     //   {
  //     //     text: "Layouts",
  //     //   },
  //     //   {
  //     //     text: "Layout Empty",
  //     //     active: true,
  //     //   },
  //     // ],
  //   },
  // },
  {
    path: "/dashboard/cadastrarImovel",
    name: "dashboard-cadastrarImovel",
    component: () => import("@/views/ui/page-layouts/CadastrarImovel.vue"),
    meta: {
      pageTitle: "Adicionar um Imóvel",
    },
  },
  {
    path: "/dashboard/meusImoveis",
    name: "dashboard-meusImoveis",
    component: () => import("@/views/ui/page-layouts/MeusImoveis.vue"),
    meta: {
      pageTitle: "Imovéis Cadastrados",
    },
  },
  {
    path: "/dashboard/minhasNecessidades",
    name: "dashboard-minhasNecessidades",
    component: () => import("@/views/ui/page-layouts/MeusInteresses.vue"),
    meta: {
      pageTitle: "Imovéis Cadastrados",
    },
  },
  {
    path: "/dashboard/buscaAvancada",
    name: "dashboard-buscaAvancada",
    component: () => import("@/views/ui/page-layouts/BuscaAvancada.vue"),
    meta: {
      pageTitle: "Busca Avançada",
    },
  },
  {
    path: "/dashboard/buscaAvancadaTabela",
    name: "dashboard-buscaAvancadaTabela",
    component: () => import("@/views/table/vue-good-table/BuscaAvancadaTabela.vue"),
    meta: {
      pageTitle: "Busca Avançada",
    },
  },
  {
    path: "/dashboard/",
    name: "dashboard",
  component: () => import("@/views/ui/page-layouts/LayoutList.vue"),
    meta: {
      pageTitle: "Imovéis",
    },
  },
  {
    path: "/dashboard/editarImovel/:id",
    name: "editarImovel",
    component: () => import("@/views/ui/page-layouts/ImovelEdit.vue"),
    meta: {
      pageTitle: "Editar Imóvel",
    },
    breadcrumb: [
      {
        text: "Meus Imóveis",
      },
    ],
  },
];
