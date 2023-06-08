import { getDefaultRegisteredComponents } from "../../constants/builder-registered-components.js";

import { TARGET } from "../../constants/target.js";

import builderContext from "../../context/builder.context";

import {
  BuilderRenderState,
  RegisteredComponent,
  RegisteredComponents,
} from "../../context/types.js";

import { evaluate } from "../../functions/evaluate.js";

import { getContent } from "../../functions/get-content/index.js";

import { fetch } from "../../functions/get-fetch.js";

import { isBrowser } from "../../functions/is-browser.js";

import { isEditing } from "../../functions/is-editing.js";

import { isPreviewing } from "../../functions/is-previewing.js";

import {
  components,
  createRegisterComponentMessage,
} from "../../functions/register-component.js";

import { _track } from "../../functions/track/index.js";

import { getInteractionPropertiesForEvent } from "../../functions/track/interaction.js";

import { logger } from "../../helpers/logger.js";

import { checkIsDefined } from "../../helpers/nullable.js";

import {
  registerInsertMenu,
  setupBrowserForEditing,
} from "../../scripts/init-editing.js";

import { Breakpoints, BuilderContent } from "../../types/builder-content.js";

import { Nullable } from "../../types/typescript.js";

import RenderBlocks from "../render-blocks";

import { getRenderContentScriptString } from "../render-content-variants/helpers.js";

import RenderContentStyles from "./components/render-styles";

import {
  getContentInitialValue,
  getContextStateInitialValue,
} from "./render-content.helpers.js";

import {
  BuilderComponentStateChange,
  RenderContentProps,
} from "./render-content.types.js";

import { wrapComponentRef } from "./wrap-component-ref.js";

import {
  Fragment,
  component$,
  h,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";

export const mergeNewContent = function mergeNewContent(
  props,
  state,
  elementRef,
  newContent: BuilderContent
) {
  state.useContent = {
    ...state.useContent,
    ...newContent,
    data: {
      ...state.useContent?.data,
      ...newContent?.data,
    },
    meta: {
      ...state.useContent?.meta,
      ...newContent?.meta,
      breakpoints:
        newContent?.meta?.breakpoints || state.useContent?.meta?.breakpoints,
    },
  };
};
export const setBreakpoints = function setBreakpoints(
  props,
  state,
  elementRef,
  breakpoints: Breakpoints
) {
  state.useContent = {
    ...state.useContent,
    meta: {
      ...state.useContent?.meta,
      breakpoints,
    },
  };
};
export const contentSetState = function contentSetState(
  props,
  state,
  elementRef,
  newRootState: BuilderRenderState
) {
  state.contentState = newRootState;
};
export const processMessage = function processMessage(
  props,
  state,
  elementRef,
  event: MessageEvent
) {
  const { data } = event;
  if (data) {
    switch (data.type) {
      case "builder.configureSdk": {
        const messageContent = data.data;
        const { breakpoints, contentId } = messageContent;
        if (!contentId || contentId !== state.useContent?.id) {
          return;
        }
        if (breakpoints) {
          setBreakpoints(props, state, elementRef, breakpoints);
        }
        state.forceReRenderCount = state.forceReRenderCount + 1; // This is a hack to force Qwik to re-render.
        break;
      }
      case "builder.contentUpdate": {
        const messageContent = data.data;
        const key =
          messageContent.key ||
          messageContent.alias ||
          messageContent.entry ||
          messageContent.modelName;
        const contentData = messageContent.data;
        if (key === props.model) {
          mergeNewContent(props, state, elementRef, contentData);
          state.forceReRenderCount = state.forceReRenderCount + 1; // This is a hack to force Qwik to re-render.
        }

        break;
      }
      case "builder.patchUpdates": {
        // TODO
        break;
      }
    }
  }
};
export const evaluateJsCode = function evaluateJsCode(
  props,
  state,
  elementRef
) {
  // run any dynamic JS code attached to content
  const jsCode = state.useContent?.data?.jsCode;
  if (jsCode) {
    evaluate({
      code: jsCode,
      context: props.context || {},
      localState: undefined,
      rootState: state.contentState,
      rootSetState: contentSetState.bind(null, props, state, elementRef),
    });
  }
};
export const onClick = function onClick(props, state, elementRef, event: any) {
  if (state.useContent) {
    const variationId = state.useContent?.testVariationId;
    const contentId = state.useContent?.id;
    _track({
      type: "click",
      canTrack: state.canTrackToUse,
      contentId,
      apiKey: props.apiKey,
      variationId: variationId !== contentId ? variationId : undefined,
      ...getInteractionPropertiesForEvent(event),
      unique: !state.clicked,
    });
  }
  if (!state.clicked) {
    state.clicked = true;
  }
};
export const evalExpression = function evalExpression(
  props,
  state,
  elementRef,
  expression: string
) {
  return expression.replace(/{{([^}]+)}}/g, (_match, group) =>
    evaluate({
      code: group,
      context: props.context || {},
      localState: undefined,
      rootState: state.contentState,
      rootSetState: contentSetState.bind(null, props, state, elementRef),
    })
  );
};
export const handleRequest = function handleRequest(
  props,
  state,
  elementRef,
  {
    url,
    key,
  }: {
    key: string;
    url: string;
  }
) {
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const newState = {
        ...state.contentState,
        [key]: json,
      };
      contentSetState(props, state, elementRef, newState);
    })
    .catch((err) => {
      console.error("error fetching dynamic data", url, err);
    });
};
export const runHttpRequests = function runHttpRequests(
  props,
  state,
  elementRef
) {
  const requests: {
    [key: string]: string;
  } = state.useContent?.data?.httpRequests ?? {};
  Object.entries(requests).forEach(([key, url]) => {
    if (url && (!state.httpReqsData[key] || isEditing())) {
      const evaluatedUrl = evalExpression(props, state, elementRef, url);
      handleRequest(props, state, elementRef, {
        url: evaluatedUrl,
        key,
      });
    }
  });
};
export const emitStateUpdate = function emitStateUpdate(
  props,
  state,
  elementRef
) {
  if (isEditing()) {
    window.dispatchEvent(
      new CustomEvent<BuilderComponentStateChange>(
        "builder:component:stateChange",
        {
          detail: {
            state: state.contentState,
            ref: {
              name: props.model,
            },
          },
        }
      )
    );
  }
};
export const RenderContent = component$((props: RenderContentProps) => {
  const elementRef = useSignal<Element>();
  const state = useStore<any>(
    {
      allRegisteredComponents: [
        ...getDefaultRegisteredComponents(),
        // While this `components` object is deprecated, we must maintain support for it.
        // Since users are able to override our default components, we need to make sure that we do not break such
        // existing usage.
        // This is why we spread `components` after the default Builder.io components, but before the `props.customComponents`,
        // which is the new standard way of providing custom components, and must therefore take precedence.
        ...components,
        ...(props.customComponents || []),
      ].reduce(
        (acc, { component, ...curr }) => ({
          ...acc,
          [curr.name]: {
            component:
              TARGET === "vue3" ? wrapComponentRef(component) : component,
            ...curr,
          },
        }),
        {} as RegisteredComponents
      ),
      canTrackToUse: checkIsDefined(props.canTrack) ? props.canTrack : true,
      clicked: false,
      contentState: getContextStateInitialValue({
        content: props.content,
        data: props.data,
        locale: props.locale,
      }),
      forceReRenderCount: 0,
      httpReqsData: {},
      overrideContent: null,
      scriptStr: getRenderContentScriptString({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: props.content?.id!,
        parentContentId: props.parentContentId!,
      }),
      update: 0,
      useContent: getContentInitialValue({
        content: props.content,
        data: props.data,
      }),
    },
    { deep: true }
  );
  useContextProvider(
    builderContext,
    useStore({
      content: state.useContent,
      localState: undefined,
      rootState: state.contentState,
      rootSetState:
        TARGET === "qwik"
          ? undefined
          : contentSetState.bind(null, props, state, elementRef),
      context: props.context || {},
      apiKey: props.apiKey,
      apiVersion: props.apiVersion,
      registeredComponents: state.allRegisteredComponents,
      inheritedStyles: {},
    })
  );
  useVisibleTask$(() => {
    if (!props.apiKey) {
      logger.error(
        "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
      );
    }
    if (isBrowser()) {
      if (isEditing()) {
        state.forceReRenderCount = state.forceReRenderCount + 1;
        registerInsertMenu();
        setupBrowserForEditing({
          ...(props.locale
            ? {
                locale: props.locale,
              }
            : {}),
          ...(props.includeRefs
            ? {
                includeRefs: props.includeRefs,
              }
            : {}),
          ...(props.enrich
            ? {
                enrich: props.enrich,
              }
            : {}),
        });
        Object.values<RegisteredComponent>(
          state.allRegisteredComponents
        ).forEach((registeredComponent) => {
          const message = createRegisterComponentMessage(registeredComponent);
          window.parent?.postMessage(message, "*");
        });
        window.addEventListener(
          "message",
          processMessage.bind(null, props, state, elementRef)
        );
        window.addEventListener(
          "builder:component:stateChangeListenerActivated",
          emitStateUpdate.bind(null, props, state, elementRef)
        );
      }
      if (state.useContent) {
        const variationId = state.useContent?.testVariationId;
        const contentId = state.useContent?.id;
        _track({
          type: "impression",
          canTrack: state.canTrackToUse,
          contentId,
          apiKey: props.apiKey,
          variationId: variationId !== contentId ? variationId : undefined,
        });
      }

      // override normal content in preview mode
      if (isPreviewing()) {
        const searchParams = new URL(location.href).searchParams;
        const searchParamPreviewModel = searchParams.get("builder.preview");
        const searchParamPreviewId = searchParams.get(
          `builder.preview.${searchParamPreviewModel}`
        );
        const previewApiKey =
          searchParams.get("apiKey") || searchParams.get("builder.space");

        /**
         * Make sure that:
         * - the preview model name is the same as the one we're rendering, since there can be multiple models rendered
         *  at the same time, e.g. header/page/footer.
         * - the API key is the same, since we don't want to preview content from other organizations.
         * - if there is content, that the preview ID is the same as that of the one we receive.
         *
         * TO-DO: should we only update the state when there is a change?
         **/
        if (
          searchParamPreviewModel === props.model &&
          previewApiKey === props.apiKey &&
          (!props.content || searchParamPreviewId === props.content.id)
        ) {
          getContent({
            model: props.model,
            apiKey: props.apiKey,
            apiVersion: props.apiVersion,
          }).then((content) => {
            if (content) {
              mergeNewContent(props, state, elementRef, content);
            }
          });
        }
      }
      evaluateJsCode(props, state, elementRef);
      runHttpRequests(props, state, elementRef);
      emitStateUpdate(props, state, elementRef);
    }
  });
  useTask$(({ track }) => {
    track(() => props.content);
    if (props.content) {
      mergeNewContent(props, state, elementRef, props.content);
    }
  });
  useTask$(({ track }) => {
    track(() => state.useContent?.data?.jsCode);
    track(() => state.contentState);
    evaluateJsCode(props, state, elementRef);
  });
  useTask$(({ track }) => {
    track(() => state.useContent?.data?.httpRequests);
    runHttpRequests(props, state, elementRef);
  });
  useTask$(({ track }) => {
    track(() => state.contentState);
    emitStateUpdate(props, state, elementRef);
  });

  return (
    <>
      {state.useContent ? (
        <div
          ref={elementRef}
          onClick$={(event) => onClick(props, state, elementRef, event)}
          builder-content-id={state.useContent?.id}
          builder-model={props.model}
          {...(TARGET === "reactNative"
            ? {
                dataSet: {
                  // currently, we can't set the actual ID here.
                  // we don't need it right now, we just need to identify content divs for testing.
                  "builder-content-id": "",
                },
              }
            : {})}
          {...(props.hideContent
            ? {
                hidden: true,
                "aria-hidden": true,
              }
            : {})}
          class={props.classNameProp}
        >
          {props.isSsrAbTest ? (
            <script dangerouslySetInnerHTML={state.scriptStr}></script>
          ) : null}
          {TARGET !== "reactNative" ? (
            <RenderContentStyles
              contentId={state.useContent?.id}
              cssCode={state.useContent?.data?.cssCode}
              customFonts={state.useContent?.data?.customFonts}
            ></RenderContentStyles>
          ) : null}
          <RenderBlocks
            blocks={state.useContent?.data?.blocks}
            key={state.forceReRenderCount}
          ></RenderBlocks>
        </div>
      ) : null}
    </>
  );
});

export default RenderContent;
