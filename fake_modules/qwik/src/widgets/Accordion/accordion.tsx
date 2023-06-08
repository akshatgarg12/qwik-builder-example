import { BuilderElement } from "../../types/element";

import AccordionItem from "./accordion-item";

import {
  Fragment,
  component$,
  h,
  useStore,
  useStylesScoped$,
} from "@builder.io/qwik";

interface AccordionProps {
  items: {
    title: BuilderElement[];
    detail: BuilderElement[];
  }[];
  oneAtATime?: boolean;
  grid?: boolean;
  defaultOpen?: any; // does not exist in accordion.config
  builderBlock?: BuilderElement; // does not exist in accordion.config
  // TODO: gridRowWidth
  gridRowWidth?: number;
  useChildrenForItems?: boolean;
}
export interface AccordionState {
  open: any;
  onlyOneAtATime: boolean;
  getOpenGridItemPosition: number | boolean | undefined;
  openGridItemOrder: number | null;
}
export const Accordion = component$((props: AccordionProps) => {
  useStylesScoped$(STYLES);

  const state = useStore<any>({
    getOpenGridItemPosition: props.grid && open.length,
    onlyOneAtATime: Boolean(props.grid || props.oneAtATime),
    open: [],
    openGridItemOrder: null,
  });

  return (
    <div class="builder-accordion div-Accordion">
      {props.useChildrenForItems &&
      props.builderBlock &&
      props.builderBlock.children
        ? (props.builderBlock.children || []).map(function (block, index) {
            return (
              <AccordionItem
                state={state.state}
                titleBlocks={block.children ? block.children[0] : []}
                detailBlocks={block.children ? block.children[1] : []}
                index={index}
                openGridItemOrder={state.openGridItemOrder}
                onlyOneAtATime={state.onlyOneAtATime}
                fromChildren={true}
              ></AccordionItem>
            );
          })
        : null}
      {!props.useChildrenForItems && props.items
        ? (props.items || []).map(function (item, index) {
            return (
              <AccordionItem
                state={state.state}
                titleBlocks={item.title}
                detailBlocks={item.detail}
                index={index}
                openGridItemOrder={state.openGridItemOrder}
                onlyOneAtATime={state.onlyOneAtATime}
              ></AccordionItem>
            );
          })
        : null}
    </div>
  );
});

export default Accordion;

export const STYLES = `
.div-Accordion {
  display: flex;
  align-items: stretch;
  flex-direction: column;
}
`;
