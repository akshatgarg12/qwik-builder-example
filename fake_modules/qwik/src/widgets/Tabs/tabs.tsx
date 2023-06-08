import RenderBlocks from "../../components/render-blocks";

import { component$, useStore } from "@builder.io/qwik";

type ElementType = any;
export interface TabsProps {
  tabs: {
    label: ElementType[];
    content: ElementType[];
  }[];
  builderBlock: any;
  defaultActiveTab?: number;
  collapsible?: boolean;
  tabHeaderLayout?: string;
  activeTabStyle?: any;
}
export const Tabs = component$((props: TabsProps) => {
  const state = useStore<any>({ activeTab: 0 });

  return (
    <span
      class="builder-tabs-wrap"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: props.tabHeaderLayout,
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {props.tabs
        ? (props.tabs || []).map((item, index) => {
            return (
              <div>
                <span
                  key={index}
                  style={{
                    ...((props.tabs[state.activeTab] === item &&
                      props.activeTabStyle) ||
                      undefined),
                  }}
                  onClick$={() => {
                    console.log("Clicked on tab", index);
                    if (state.activeTab === index && props.collapsible) {
                      state.activeTab = -1;
                    } else {
                      state.activeTab = index;
                    }
                  }}
                  class={
                    "builder-tab-wrap " +
                    (props.tabs[state.activeTab] === item
                      ? "builder-tab-active"
                      : "")
                  }
                >
                  <RenderBlocks
                    parent={props.builderBlock.id}
                    path={`component.options.tabs.${state.activeTab}.label`}
                    blocks={item.label}
                  ></RenderBlocks>
                </span>
                {state.activeTab === index &&
                props.tabs[state.activeTab].content.length === 0 ? (
                  <div>
                    <h1>Hello</h1>
                    <RenderBlocks
                      parent={props.builderBlock.id}
                      path={`component.options.tabs.${state.activeTab}.content`}
                      blocks={props.tabs[state.activeTab].content}
                    ></RenderBlocks>
                  </div>
                ) : null}
              </div>
            );
          })
        : null}
    </span>
  );
});

export default Tabs;
