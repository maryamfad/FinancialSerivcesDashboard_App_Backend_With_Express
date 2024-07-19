import swaggerJsDoc from "swagger-jsdoc";


const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Your API Title",
    version: "1.0.0",
    description: "A description of your API",
  },
  servers: [
    {
      url: "http://localhost:3000", 
    },
  ],
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;

