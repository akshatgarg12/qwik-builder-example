import { component$, Resource, useResource$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import {
  getContent,
  RenderContent,
  getBuilderSearchParams,
} from "@builder.io/sdk-qwik";
import { WIDGETS } from "../../components/widgets";

export const BUILDER_PUBLIC_API_KEY = "8335d18816304315aebeb7e9532281ce"; // <-- Add your Public API KEY here
export const BUILDER_MODEL = "page";
export default component$(() => {
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
    <Resource
      value={builderContentRsrc}
      onPending={() => <div>Loading...</div>}
      onResolved={(content) => (
        <div>
          {/* <code>
            {JSON.stringify(content, null, 2)}
          </code> */}
          <RenderContent
            model={BUILDER_MODEL}
            content={content}
            apiKey={BUILDER_PUBLIC_API_KEY}
            customComponents={WIDGETS}
          />
        </div>
      )}
    />
  );
});
