import { getOpenApiDocumentation } from "./openapi-registry";

export function getSwaggerSpec() {
  return getOpenApiDocumentation();
}

export const swaggerSpec = getSwaggerSpec();
