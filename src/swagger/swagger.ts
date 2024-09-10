const swaggerAutogen = require("swagger-autogen")();
const host = require("../config/swagger.config.ts");

console.log(host);

const doc = {
  info: {
    title: "simple backend",
    description: "Description",
  },
  host: host,
};

const outputFile = "./swagger_output.json";
const routes = ["../server.ts"];

swaggerAutogen(outputFile, routes, doc);
