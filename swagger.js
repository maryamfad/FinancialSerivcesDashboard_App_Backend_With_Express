import swaggerJsDoc from "swagger-jsdoc";


const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "WealthPath",
    version: "1.0.0",
    description: "The backend APIs for wealthPath",
  },
  servers: [
    {
      url: "https://wealthpath-385e08c18cf4.herokuapp.com"
    },
    {
      url: "http://localhost:5000" 
    }
  ],
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;

