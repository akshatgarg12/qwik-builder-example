import RenderBlock from "../../components/render-block/render-block";

import RenderBlocks from "../../components/render-blocks";

import BuilderContext from "../../context/builder.context";

import { BuilderElement } from "../../types/element";

import { Fragment, component$, h, useContext } from "@builder.io/qwik";

type BuilderBlockType = BuilderElement;
interface MasonryProps {
  tiles: Array<{
    content: BuilderBlockType[];
  } /* BuilderBlock <- export this type */>;
  builderBlock: BuilderBlockType;
  useChildrenForTiles?: boolean;
  gutterSize?: string;
  columnWidth?: string;
}
export const MasonryComponent = component$((props: MasonryProps) => {
  const context = useContext(BuilderContext);

  return (
    <div>
      <div
        class="grid"
        data-masonry={`{ "columnWidth": ${props.columnWidth}, "itemSelector": ".grid-item" }`}
      >
        {props.useChildrenForTiles &&
        props.builderBlock &&
        props.builderBlock.children
          ? (props.builderBlock.children || []).map(function (block, index) {
              return (
                <div
                  class="grid-item"
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    width: props.columnWidth,
                  }}
                >
                  <RenderBlock
                    block={block}
                    context={context}
                    id={block.id}
                  ></RenderBlock>
                </div>
              );
            })
          : null}
        {!props.useChildrenForTiles && props.tiles
          ? (props.tiles || []).map(function (tile, index) {
              return (
                <div
                  class="grid-item"
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    width: props.columnWidth,
                  }}
                >
                  <RenderBlocks
                    blocks={(() => {
                      (tile as any).content || tile;
                    })()}
                    path={`component.options.tiles.${index}.content`}
                    parent={props.builderBlock && props.builderBlock.id}
                  ></RenderBlocks>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
});

export default MasonryComponent;
