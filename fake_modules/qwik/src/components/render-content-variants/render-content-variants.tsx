import { handleABTestingSync } from "../../helpers/ab-tests";

import { getDefaultCanTrack } from "../../helpers/canTrack";

import RenderContent from "../render-content/render-content";

import { RenderContentProps } from "../render-content/render-content.types";

import RenderInlinedStyles from "../render-inlined-styles";

import {
  checkShouldRunVariants,
  getVariants,
  getVariantsScriptString,
} from "./helpers";

import { Fragment, component$, h, useStore } from "@builder.io/qwik";

type VariantsProviderProps = RenderContentProps;
export const RenderContentVariants = component$(
  (props: VariantsProviderProps) => {
    const state = useStore<any>({
      contentToRender: checkShouldRunVariants({
        canTrack: getDefaultCanTrack(props.canTrack),
        content: props.content,
      })
        ? props.content
        : handleABTestingSync({
            item: props.content,
            canTrack: getDefaultCanTrack(props.canTrack),
          }),
      hideVariantsStyleString: getVariants(props.content)
        .map((value) => `.variant-${value.id} { display: none; } `)
        .join(""),
      shouldRenderVariants: checkShouldRunVariants({
        canTrack: getDefaultCanTrack(props.canTrack),
        content: props.content,
      }),
      variantScriptStr: getVariantsScriptString(
        getVariants(props.content).map((value) => ({
          id: value.id!,
          testRatio: value.testRatio,
        })),
        props.content?.id || ""
      ),
    });

    return (
      <Fragment>
        {state.shouldRenderVariants ? (
          <>
            <RenderInlinedStyles
              id={`variants-styles-${props.content?.id}`}
              styles={state.hideVariantsStyleString}
            ></RenderInlinedStyles>
            <script
              id={`variants-script-${props.content?.id}`}
              dangerouslySetInnerHTML={state.variantScriptStr}
            ></script>
            {(getVariants(props.content) || []).map(function (variant) {
              return (
                <RenderContent
                  key={variant.id}
                  content={variant}
                  apiKey={props.apiKey}
                  apiVersion={props.apiVersion}
                  canTrack={props.canTrack}
                  customComponents={props.customComponents}
                  hideContent={true}
                  parentContentId={props.content?.id}
                  isSsrAbTest={state.shouldRenderVariants}
                ></RenderContent>
              );
            })}
          </>
        ) : null}
        <RenderContent
          model={props.model}
          content={state.contentToRender}
          apiKey={props.apiKey}
          apiVersion={props.apiVersion}
          canTrack={props.canTrack}
          customComponents={props.customComponents}
          classNameProp={`variant-${props.content?.id}`}
          parentContentId={props.content?.id}
          isSsrAbTest={state.shouldRenderVariants}
        ></RenderContent>
      </Fragment>
    );
  }
);

export default RenderContentVariants;
