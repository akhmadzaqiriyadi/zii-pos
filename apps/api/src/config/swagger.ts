import { getOpenApiDocumentation } from "@/config/openapi-registry";

export function getSwaggerSpec() {
  return getOpenApiDocumentation();
}
