// export default defineNuxtPlugin(async (nuxtApp) => {
//   const { client } = useSanity();

//   // Make sure the client is initialized by checking connection with a simple query
//   try {
//     const testQuery = '*[_type == "tool"][0...1]';
//     await client.fetch(testQuery);
//     console.log("Sanity client initialized successfully");

//     // Make the client available to the app
//     nuxtApp.provide("sanityReady", true);
//   } catch (error) {
//     console.error("Failed to initialize Sanity client:", error);
//     nuxtApp.provide("sanityReady", false);
//   }
// });
