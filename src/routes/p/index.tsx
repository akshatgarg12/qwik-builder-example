import { component$, Resource, useResource$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { getContent, RenderContent, getBuilderSearchParams } from "@builder.io/sdk-qwik";

import { CUSTOM_COMPONENTS, MyFunComponent } from "~/components/hamburger";
import { Counter } from "~/integrations/react/mui";

export const BUILDER_PUBLIC_API_KEY = '8335d18816304315aebeb7e9532281ce'; // <-- Add your Public API KEY here
export const BUILDER_MODEL = "page";

// export const getBuilder = loader$(({pathname, query}) => {
//   return getContent({
//     model: BUILDER_MODEL,
//     apiKey: BUILDER_PUBLIC_API_KEY,
//     options: getBuilderSearchParams(query),
//     userAttributes: {
//       urlPath: pathname || "/",
//     },
//   });
// })

export default component$(() => {
  // const builder = getBuilder.use()
  const location = useLocation();
  const builderContentRsrc = useResource$<any>(() => {
    return getContent({
      model: BUILDER_MODEL,
      apiKey: BUILDER_PUBLIC_API_KEY,
      options: getBuilderSearchParams(location.query),
      userAttributes: {
        urlPath: location.pathname || "/",
      },
    });
  });
  return (
    <>
      <Counter client:visible />
      <MyFunComponent />
      <Resource
        value={builderContentRsrc}
        onPending={() => <div>Loading...</div>}
        onResolved={(content) => (
          <RenderContent
            model={BUILDER_MODEL}
            content={content}
            apiKey={BUILDER_PUBLIC_API_KEY}
            customComponents={CUSTOM_COMPONENTS}
          />
        )}
      />
      <h1>Hello World</h1>
    </>
  );
});