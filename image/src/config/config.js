const env = require('../utils/env')

module.exports = {
  EGRESS_URL: env('EGRESS_URL', ''),
  INGRESS_HOST: env('INGRESS_HOST', '127.0.0.1'),
  INGRESS_PORT: env('INGRESS_PORT', '8080'),
  NESTED_RESPONSE: env('NESTED_RESPONSE', 'no'),
  MODULE_NAME: env('MODULE_NAME', 'Innotas Water Sensor Decoder'),
  DEBUG_OUTPUT_LOG: env('DEBUG_OUTPUT_LOG', 'no'),
}
