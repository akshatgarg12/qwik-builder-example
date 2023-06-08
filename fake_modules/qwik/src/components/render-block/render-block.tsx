import { TARGET } from "../../constants/target.js";

import { BuilderContextInterface } from "../../context/types.js";

import { extractTextStyles } from "../../functions/extract-text-styles.js";

import { getBlockActions } from "../../functions/get-block-actions.js";

import { getBlockComponentOptions } from "../../functions/get-block-component-options.js";

import { getBlockProperties } from "../../functions/get-block-properties.js";

import { getProcessedBlock } from "../../functions/get-processed-block.js";

import { getReactNativeBlockStyles } from "../../functions/get-react-native-block-styles.js";

import { BuilderBlock } from "../../types/builder-block.js";

import BlockStyles from "./block-styles";

import {
  getComponent,
  getRepeatItemData,
  isEmptyHtmlElement,
} from "./render-block.helpers.js";

import {
  RenderComponentProps,
  default as RenderComponent,
} from "./render-component";

import RenderRepeatedBlock from "./render-repeated-block";

import {
  Fragment,
  component$,
  h,
  useComputed$,
  useStore,
} from "@builder.io/qwik";

export type RenderBlockProps = {
  block: BuilderBlock;
  context: BuilderContextInterface;
};
export const RenderBlock = component$((props: RenderBlockProps) => {
  const state = useStore<any>({ Tag: props.block.tagName || "div" });
  const component = useComputed$(() => {
    return getComponent({
      block: props.block,
      context: props.context,
    });
  });
  const repeatItem = useComputed$(() => {
    return getRepeatItemData({
      block: props.block,
      context: props.context,
    });
  });
  const useBlock = useComputed$(() => {
    return repeatItem.value
      ? props.block
      : getProcessedBlock({
          block: props.block,
          localState: props.context.localState,
          rootState: props.context.rootState,
          rootSetState: props.context.rootSetState,
          context: props.context.context,
          shouldEvaluateBindings: true,
        });
  });
  const canShowBlock = useComputed$(() => {
    if ("hide" in useBlock.value) {
      return !useBlock.value.hide;
    }
    if ("show" in useBlock.value) {
      return useBlock.value.show;
    }
    return true;
  });
  const actions = useComputed$(() => {
    return getBlockActions({
      block: useBlock.value,
      rootState: props.context.rootState,
      rootSetState: props.context.rootSetState,
      localState: props.context.localState,
      context: props.context.context,
    });
  });
  const attributes = useComputed$(() => {
    const blockProperties = getBlockProperties(useBlock.value);
    return {
      ...blockProperties,
      ...(TARGET === "reactNative"
        ? {
            style: getReactNativeBlockStyles({
              block: useBlock.value,
              context: props.context,
              blockStyles: blockProperties.style,
            }),
          }
        : {}),
    };
  });
  const childrenWithoutParentComponent = useComputed$(() => {
    /**
     * When there is no `componentRef`, there might still be children that need to be rendered. In this case,
     * we render them outside of `componentRef`.
     * NOTE: We make sure not to render this if `repeatItemData` is non-null, because that means we are rendering an array of
     * blocks, and the children will be repeated within those blocks.
     */
    const shouldRenderChildrenOutsideRef =
      !component.value?.component && !repeatItem.value;
    return shouldRenderChildrenOutsideRef ? useBlock.value.children ?? [] : [];
  });
  const childrenContext = useComputed$(() => {
    const getInheritedTextStyles = () => {
      if (TARGET !== "reactNative") {
        return {};
      }
      return extractTextStyles(
        getReactNativeBlockStyles({
          block: useBlock.value,
          context: props.context,
          blockStyles: attributes.value.style,
        })
      );
    };
    return {
      apiKey: props.context.apiKey,
      apiVersion: props.context.apiVersion,
      localState: props.context.localState,
      rootState: props.context.rootState,
      rootSetState: props.context.rootSetState,
      content: props.context.content,
      context: props.context.context,
      registeredComponents: props.context.registeredComponents,
      inheritedStyles: getInheritedTextStyles(),
    };
  });
  const renderComponentProps = useComputed$(() => {
    return {
      blockChildren: useBlock.value.children ?? [],
      componentRef: component.value?.component,
      componentOptions: {
        ...getBlockComponentOptions(useBlock.value),
        /**
         * These attributes are passed to the wrapper element when there is one. If `noWrap` is set to true, then
         * they are provided to the component itself directly.
         */
        ...(!component.value?.noWrap
          ? {}
          : {
              attributes: {
                ...attributes.value,
                ...actions.value,
              },
            }),
      },
      context: childrenContext.value,
    };
  });
  return (
    <>
      {canShowBlock.value ? (
        !component.value?.noWrap ? (
          <>
            {isEmptyHtmlElement(state.Tag) ? (
              <state.Tag {...attributes.value} {...actions.value}></state.Tag>
            ) : null}
            {!isEmptyHtmlElement(state.Tag) && repeatItem.value
              ? (repeatItem.value || []).map(function (data, index) {
                  return (
                    <RenderRepeatedBlock
                      key={index}
                      repeatContext={data.context}
                      block={data.block}
                    ></RenderRepeatedBlock>
                  );
                })
              : null}
            {!isEmptyHtmlElement(state.Tag) && !repeatItem.value ? (
              <state.Tag {...attributes.value} {...actions.value}>
                <RenderComponent
                  {...renderComponentProps.value}
                ></RenderComponent>
                {(childrenWithoutParentComponent.value || []).map(function (
                  child
                ) {
                  return (
                    <RenderBlock
                      key={"render-block-" + child.id}
                      block={child}
                      context={childrenContext.value}
                    ></RenderBlock>
                  );
                })}
                {(childrenWithoutParentComponent.value || []).map(function (
                  child
                ) {
                  return (
                    <BlockStyles
                      key={"block-style-" + child.id}
                      block={child}
                      context={childrenContext.value}
                    ></BlockStyles>
                  );
                })}
              </state.Tag>
            ) : null}
          </>
        ) : (
          <RenderComponent {...renderComponentProps.value}></RenderComponent>
        )
      ) : null}
    </>
  );
});

export default RenderBlock;
