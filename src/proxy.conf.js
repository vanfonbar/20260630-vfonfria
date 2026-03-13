/**
 * Proxy Configuration for Angular Dev Server
 *
 * This file configures the Angular development server to proxy API requests
 * to a backend server. This is useful for:
 * - Avoiding CORS issues during development
 * - Connecting to local or remote backend APIs
 * - Simulating production routing in development
 *
 * Usage:
 * 1. Uncomment and configure the PROXY_CONFIG below and replace the target URL
 * 2. The proxy is automatically used when running `npm start`
 * 3. Referenced in angular.json -> serve -> options -> proxyConfig
 *
 * IMPORTANT: If you make changes to this file, you MUST restart the dev server
 * (stop with Ctrl+C and run `npm start` again). Proxy config changes don't hot-reload.
 *
 * Learn more: https://angular.dev/tools/cli/serve#proxying-to-a-backend-server
 */

/*
 * Example Configuration Explanation:
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ What you see in Chrome Network tab:                                     │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ Request URL: http://localhost:4200/fax3/rest/api/users                  │
 * │ (The request appears to go to your local server)                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ What is actually sent:                                                  │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ Request URL: http://apdo05.itg.mercadona.com/fax3/rest/api/users        │
 * │ (The proxy intercepts and forwards to the target server)                │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * How it works:
 * 1. Your code does: this.http.get('/fax3/rest/api/users')
 * 2. Browser sends: GET http://localhost:4200/fax3/rest/api/users
 * 3. Dev server intercepts the request (because it matches context)
 * 4. Dev server forwards: GET http://apdo05.itg.mercadona.com/fax3/rest/api/users
 * 5. Response comes back through proxy to browser
 * 6. No CORS because browser thinks everything is localhost:4200
 *
 * Configuration options:
 * - context: Paths to be proxied (array)
 * - target: Real destination server
 * - secure: false = allows self-signed SSL certificates
 * - changeOrigin: true = changes the 'Host' header to target
 * - logLevel: 'debug' = shows proxy logs in console
 *
 * IMPORTANT: After modifying this file, restart the dev server (Ctrl+C + npm start)
 */

/*
const PROXY_CONFIG = [
  {
    context: [
      '/fax3/web',
      '/fax3/rest'
    ],
    target: 'http://apdo05.itg.mercadona.com',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
];

export default PROXY_CONFIG;
*/
