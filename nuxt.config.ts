import Aura from "@primevue/themes/aura";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
    "nuxt-vuefire",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/fonts",
    "@vee-validate/nuxt",
  ],
  ssr: false,

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },

  routeRules: {
    "/api/**": {
      proxy: process.env.NUXT_PUBLIC_API_BASE_URL + "/**",
    },
  },
  css: ["primeicons/primeicons.css"],

  vuefire: {
    auth: true,
    config: {
      apiKey: "AIzaSyB3zPkTKaRKzmmYU7PqwyOEE060PbLpwDU",
      authDomain: "imna-afe96.firebaseapp.com",
      projectId: "imna-afe96",
      storageBucket: "imna-afe96.appspot.com",
      messagingSenderId: "251557223921",
      appId: "1:251557223921:web:8aa3f79ccb3e66e3363850",
      measurementId: "G-M9ME428RSF",
    },
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'app-dark-mode'
      }
    }
  },
  primevue: {
   importTheme: {from: '~/themes/theme.js'}
  },
});
