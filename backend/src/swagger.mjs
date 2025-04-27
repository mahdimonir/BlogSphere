import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "BlogSphere API",
    description: "Automatically generated Swagger docs",
    version: "1.0.0",
  },
  host: "localhost:8000",
  basePath: "/",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
