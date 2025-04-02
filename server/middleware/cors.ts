import { defineEventHandler, setResponseHeader } from 'h3';

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Access-Control-Allow-Origin', 'https://aiupd8frontend.netlify.app');
  setResponseHeader(event, 'Access-Control-Allow-Origin', 'https://aiupdate.be');
  setResponseHeader(event, 'Access-Control-Allow-Origin', 'https://aiupdate.howest.be');
  setResponseHeader(event, 'Access-Control-Allow-Origin', 'https://localhost:3000');
  setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (event.req.method?.toUpperCase() === 'OPTIONS') {
    event.res.statusCode = 200;
    event.res.end();
  }
});
