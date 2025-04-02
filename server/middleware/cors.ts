import { defineEventHandler, getRequestHeader, setResponseHeader } from 'h3';

const allowedOrigins = ['https://aiupdate.be', 'https://localhost:3000','https://aiupd8frontend.netlify.app'];

export default defineEventHandler((event) => {
  // Get the origin header from the request
  const origin = getRequestHeader(event, 'origin') || '';

  // If the request origin is in our whitelist, use it; otherwise, fall back to the first allowed origin
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  setResponseHeader(event, 'Access-Control-Allow-Origin', allowedOrigin);

  // Set additional CORS headers
  setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS requests
  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    event.node.res.end();
  }
});
