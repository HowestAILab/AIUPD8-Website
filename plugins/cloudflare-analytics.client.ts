import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin(() => {
  if (process.server) return;
  if (process.env.NODE_ENV !== 'production') return;

  const config = useRuntimeConfig();
  const token = config.public.cloudflareBeaconToken;
  if (!token) return;

  // Avoid injecting multiple times
  if (document.getElementById('cf-beacon-script')) return;

  const script = document.createElement('script');
  script.id = 'cf-beacon-script';
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', JSON.stringify({ token, spa: true }));

  document.head.appendChild(script);
});


