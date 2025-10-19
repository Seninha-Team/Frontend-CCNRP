const { override } = require("customize-cra");

module.exports = {
  jest: (config) => {
    config.transformIgnorePatterns = [
      "/node_modules/(?!(axios|another-es-module-library-to-include))/",
    ];
    return config;
  },
};