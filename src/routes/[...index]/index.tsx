// import { component$, Resource, useResource$ } from "@builder.io/qwik";
// import { useLocation } from "@builder.io/qwik-city";
// import {
//   getContent,
//   RenderContent,
//   getBuilderSearchParams,
// } from "@builder.io/sdk-qwik";
// import { WIDGETS } from "../../components/widgets";

// export const BUILDER_PUBLIC_API_KEY = "8335d18816304315aebeb7e9532281ce"; // <-- Add your Public API KEY here
// export const BUILDER_MODEL = "page";
// export default component$(() => {
//   const location = useLocation();
//   const builderContentRsrc = useResource$<any>(() => {
//     return getContent({
//       model: BUILDER_MODEL,
//       apiKey: BUILDER_PUBLIC_API_KEY,
//       options: getBuilderSearchParams(location.url.searchParams),
//       userAttributes: {
//         urlPath: location.url.pathname || "/",
//       },
//     });
//   });

//   return (
//     <Resource
//       value={builderContentRsrc}
//       onPending={() => <div>Loading...</div>}
//       onResolved={(content) => (
//         <div>
//           {/* <code>
//             {JSON.stringify(content, null, 2)}
//           </code> */}
//           <RenderContent
//             model={BUILDER_MODEL}
//             content={content}
//             apiKey={BUILDER_PUBLIC_API_KEY}
//             customComponents={WIDGETS}
//           />
//         </div>
//       )}
//     />
//   );
// });

import { component$ } from "@builder.io/qwik";
import { DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import {
  getContent as getBuilderContent,
  RenderContent,
} from "@builder.io/sdk-qwik";

// Enter your key here!
export const apiKey = "8335d18816304315aebeb7e9532281ce"; // ggignore

export const useBuilderContentLoader = routeLoader$(async (context) => {
  const path = `/${context.params.index}`;
  // Don't target on url and device for better cache efficiency
  const userAttributes = { urlPath: path, device: "_" } as any;
  const data = await getBuilderContent({
    model: "page",
    apiKey: apiKey,
    userAttributes,
  });
  console.log(JSON.stringify(data, null, 2));
  return data;
});

export default component$(() => {
  const content = useBuilderContentLoader();

  // if using `event.status(404)`, uncomment these lines:
  if (content.value === null) {
    // eslint-disable-next-line qwik/single-jsx-root
    return <h1>Page not found</h1>;
  }

  return (
    <div>
      <RenderContent model="page" content={content.value} apiKey={apiKey} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
