import RenderBlock from "../../components/render-block/render-block";

import RenderBlocks from "../../components/render-blocks";

import BuilderContext from "../../context/builder.context";

import { BuilderElement } from "../../types/element";

import {
  Fragment,
  component$,
  h,
  useContext,
  useStore,
  useStylesScoped$,
} from "@builder.io/qwik";

export interface AccordionItem {
  state: any;
  titleBlocks: BuilderElement[];
  detailBlocks: BuilderElement[];
  index: number;
  openGridItemOrder: number | null;
  onlyOneAtATime: boolean;
  fromChildren: boolean;
}
export const AccordionItem = component$((props: any) => {
  useStylesScoped$(STYLES);

  const context = useContext(BuilderContext);
  const state = useStore<any>({
    isOpen: props.state.open.indexOf(props.index) !== -1,
  });

  return (
    <div key={props.index}>
      <div
        data-index={props.index}
        onClick$={(event) => {
          if (state.isOpen) {
            props.state.open = props.onlyOneAtATime
              ? []
              : props.state.open.filter((item: any) => item !== props.index);
          } else {
            props.state.open = props.onlyOneAtATime
              ? [props.index]
              : props.state.open.concat(props.index);
          }
        }}
        class={
          `builder-accordion-title builder-accordion-title-${
            state.isOpen ? "open" : "closed"
          }` + " div-AccordionItem"
        }
      >
        {props.fromChildren && props.titleBlocks.length ? (
          (props.titleBlocks || []).map(function (block, index) {
            return (
              <RenderBlock
                key={index}
                block={{
                  ...block,
                  repeat: null,
                }}
                context={context}
              ></RenderBlock>
            );
          })
        ) : (
          <RenderBlocks
            blocks={props.titleBlocks}
            path={`items.${props.index}.title`}
          ></RenderBlocks>
        )}
      </div>
      {state.isOpen ? (
        <div
          class={`builder-accordion-detail builder-accordion-detail-${
            state.isOpen ? "open" : "closed"
          }`}
        >
          {props.fromChildren && props.detailBlocks.length ? (
            (props.detailBlocks || []).map(function (block, index) {
              return (
                <RenderBlock
                  key={index}
                  block={{
                    ...block,
                    repeat: null,
                  }}
                  context={context}
                ></RenderBlock>
              );
            })
          ) : (
            <RenderBlocks
              blocks={props.detailBlocks}
              path={`items.${props.index}.detail`}
            ></RenderBlocks>
          )}
        </div>
      ) : null}
    </div>
  );
});

export default AccordionItem;

export const STYLES = `
.div-AccordionItem {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
`;
