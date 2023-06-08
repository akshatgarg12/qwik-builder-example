import BuilderContext from "../context/builder.context";

import { isEditing } from "../functions/is-editing.js";

import { BuilderBlock } from "../types/builder-block.js";

import BlockStyles from "./render-block/block-styles";

import RenderBlock from "./render-block/render-block";

import {
  Fragment,
  component$,
  h,
  useComputed$,
  useContext,
  useStylesScoped$,
} from "@builder.io/qwik";

export type RenderBlockProps = {
  blocks?: BuilderBlock[];
  parent?: string;
  path?: string;
  styleProp?: Record<string, any>;
};
export const onClick = function onClick(props, state, builderContext) {
  if (isEditing() && !props.blocks?.length) {
    window.parent?.postMessage(
      {
        type: "builder.clickEmptyBlocks",
        data: {
          parentElementId: props.parent,
          dataPath: props.path,
        },
      },
      "*"
    );
  }
};
export const onMouseEnter = function onMouseEnter(
  props,
  state,
  builderContext
) {
  if (isEditing() && !props.blocks?.length) {
    window.parent?.postMessage(
      {
        type: "builder.hoverEmptyBlocks",
        data: {
          parentElementId: props.parent,
          dataPath: props.path,
        },
      },
      "*"
    );
  }
};
export const RenderBlocks = component$((props: RenderBlockProps) => {
  useStylesScoped$(STYLES);

  const builderContext = useContext(BuilderContext);
  const state: any = {};
  const className = useComputed$(() => {
    return "builder-blocks" + (!props.blocks?.length ? " no-blocks" : "");
  });
  return (
    <div
      class={className.value + " div-RenderBlocks"}
      builder-path={props.path}
      builder-parent-id={props.parent}
      style={props.styleProp}
      onClick$={(event) => onClick(props, state, builderContext)}
      onMouseEnter$={(event) => onMouseEnter(props, state, builderContext)}
    >
      {props.blocks
        ? (props.blocks || []).map(function (block) {
            return (
              <RenderBlock
                key={"render-block-" + block.id}
                block={block}
                context={builderContext}
              ></RenderBlock>
            );
          })
        : null}
      {props.blocks
        ? (props.blocks || []).map(function (block) {
            return (
              <BlockStyles
                key={"block-style-" + block.id}
                block={block}
                context={builderContext}
              ></BlockStyles>
            );
          })
        : null}
    </div>
  );
});

export default RenderBlocks;

export const STYLES = `
.div-RenderBlocks {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
`;
