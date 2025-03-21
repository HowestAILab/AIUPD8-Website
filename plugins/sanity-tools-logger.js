// export default defineNuxtPlugin(async (nuxtApp) => {
//   // Example of fetching tools and logging the structure
//   const { client } = useSanity();

//   try {
//     // First, try a simple query to test connection
//     console.log("Testing Sanity connection...");
//     const simpleQuery = `*[_type == "tool"][0...5]`;
//     const simpleResult = await client.fetch(simpleQuery);
//     console.log(
//       "Sanity connection successful. Simple query result:",
//       simpleResult
//     );

//     if (simpleResult && simpleResult.length > 0) {
//       // If simple query works, try the expanded query
//       const expandedQuery = `*[_type == "tool"][0...3]{
//         _id,
//         title,
//         description,
//         isFavourite,
//         link,
//         youtubeLink,
//         uses,
//         setups,
//         pricings,
//         licenses,
//         generationTimes,
//         inputs,
//         outputs,
//         tasks,
//         profiles,
//         image,
//         showcaseImages
//       }`;

//       const expandedResult = await client.fetch(expandedQuery);
//       console.log("Tools fetched from Sanity (expanded):", expandedResult);
//     }
//   } catch (error) {
//     console.error("Error connecting to Sanity:", error);
//     console.error("Check your Sanity configuration in nuxt.config.ts");
//     console.error("Make sure your projectId, dataset, and token are correct");
//   }
// });
