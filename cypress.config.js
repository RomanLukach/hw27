const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://santa-secret.ru',
    // baseUrl: 'https://staging.lpitko.ru/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
