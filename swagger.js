const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Your API Title",
    version: "1.0.0",
    description: "A description of your API",
  },
  servers: [
    {
      url: "http://localhost:3000", // Replace with your server URL
    },
  ],
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerDocs,
  swaggerUI,
};
