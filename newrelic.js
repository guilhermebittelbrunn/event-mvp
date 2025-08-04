'use strict';

/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  agent_enabled: process.env.NODE_ENV && ['production', 'staging'].includes(process.env.NODE_ENV),
  /**
   * Array of application names.
   */
  app_name: [process.env.NEW_RELIC_APP_NAME],
  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  application_logging: {
    enabled: false,
  },
  logging: {
    enabled: false,
    level: 'error',
  },
  audit_log: {
    enabled: false,
  },
  distributed_tracing: {
    enabled: false,
  },
  slow_sql: { enabled: true },
  rules: {
    ignore: ['.*/health-check'],
  },
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination's
   * attributes include/exclude lists.
   */
  allow_all_headers: true,
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows * as wildcard
     * at end.
     *
     * NOTE: If excluding headers, they must be in camelCase form to be filtered.
     *
     * @name NEW_RELIC_ATTRIBUTES_EXCLUDE
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
};
