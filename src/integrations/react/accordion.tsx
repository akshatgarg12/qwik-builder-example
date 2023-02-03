/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";
import {
  BuilderAsyncRequestsContext,
  BuilderBlockComponent,
  BuilderBlocks,
  BuilderElement,
  BuilderStoreContext,
  stringToFunction,
} from "@builder.io/react";
import * as React from 'react'
export interface AccordionProps {
  items: {
    title: BuilderElement[];
    detail: BuilderElement[];
  }[];
  oneAtATime?: boolean;
  grid?: boolean;
  defaultOpen?: number;
  builderBlock?: BuilderElement;
  // TODO: gridRowWidth
  gridRowWidth?: number;
  useChildrenForItems?: boolean;
}

export const AccordionFC = (props: AccordionProps) => {
  const [open, setOpen] = React.useState<Array<number>>([]);
  const divRef = React.useRef<React.LegacyRef<HTMLDivElement> | undefined>();
  let _errors: Error[] = [];
  let _logs: string[] = [];
  const getAccordionItem = (
    titleBlocks: BuilderElement[],
    detailBlocks: BuilderElement[],
    index: number,
    openGridItemOrder: number | null,
    onlyOneAtATime: boolean,
    fromChildren = false
  ): any => {
    const isOpen = open.indexOf(index) !== -1;
    const { grid } = props;

    return (
      // This will not work as expected with react 15
      // Did preact get the span replacmenet too?
      <React.Fragment key={index}>
        <div
          className={`builder-accordion-title builder-accordion-title-${
            isOpen ? "open" : "closed"
          }`}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            ...(grid && {
              width: props.gridRowWidth,
              ...(typeof openGridItemOrder === "number" && {
                order: index < openGridItemOrder ? index : index + 1,
              }),
            }),
          }}
          data-index={index}
          onClick={() => {
            if (isOpen) {
              setOpen(() =>
                onlyOneAtATime
                  ? []
                  : open.filter((item: number) => item !== index)
              );
            } else {
              setOpen(() => (onlyOneAtATime ? [index] : open.concat(index)));
            }
          }}
        >
          {fromChildren ? (
            titleBlocks.map((block, index) => (
              <BuilderBlockComponent
                key={index}
                block={{
                  ...block,
                  repeat: null,
                }}
                index={index}
                child={true} /* TODO: fieldname? */
              />
            ))
          ) : (
            <BuilderBlocks
              blocks={titleBlocks}
              dataPath={`items.${index}.title`}
            />
          )}
        </div>
        {isOpen && (
          <div
            className={`builder-accordion-detail builder-accordion-detail-${
              isOpen ? "open" : "closed"
            }`}
            style={{
              order:
                typeof openGridItemOrder === "number"
                  ? openGridItemOrder
                  : undefined,
              ...(grid && {
                width: "100%",
              }),
            }}
          >
            {isOpen &&
              (fromChildren ? (
                detailBlocks.map((block, index) => (
                  <BuilderBlockComponent
                    key={index}
                    block={{
                      ...block,
                      repeat: null,
                    }}
                    index={index}
                    child={true} /* TODO: fieldname? */
                  />
                ))
              ) : (
                <BuilderBlocks
                  blocks={detailBlocks}
                  dataPath={`items.${index}.detail`}
                />
              ))}
          </div>
        )}
      </React.Fragment>
    );
  };
  React.useEffect(() => {
    setTimeout(() => {
      if (divRef.current) {
        // @ts-ignore
        divRef.current.dispatchEvent(
          new CustomEvent("builder:accordion:load", {
            bubbles: true,
            cancelable: false,
            detail: {
              ref: this,
            },
          })
        );
      }
    });
  }, []);
  const { grid, oneAtATime } = props;

  const onlyOneAtATime = Boolean(grid || oneAtATime);

  const getOpenGridItemPosition = grid && open.length;
  let openGridItemOrder: number | null = null;
  if (getOpenGridItemPosition && divRef.current) {
    const openItemIndex = open[0];
    // @ts-ignore
    const openItem = divRef.current.querySelector(
      `.builder-accordion-title[data-index="${openItemIndex}"]`
    );

    let subjectItem = openItem;
    openGridItemOrder = openItemIndex;

    if (subjectItem) {
      let prevItemRect = subjectItem.getBoundingClientRect();

      while ((subjectItem = subjectItem && subjectItem.nextElementSibling)) {
        if (subjectItem) {
          if (subjectItem.classList.contains("builder-accordion-detail")) {
            continue;
          }
          const subjectItemRect = subjectItem.getBoundingClientRect();
          if (subjectItemRect.left > prevItemRect.left) {
            const index = parseInt(
              subjectItem.getAttribute("data-index") || "",
              10
            );
            if (!isNaN(index)) {
              prevItemRect = subjectItemRect;
              openGridItemOrder = index;
            }
          } else {
            break;
          }
        }
      }
    }
  }

  if (typeof openGridItemOrder === "number") {
    openGridItemOrder = openGridItemOrder + 1;
  }

  return (
    <BuilderAsyncRequestsContext.Consumer>
      {(value) => {
        _errors = value && value.errors;
        _logs = value && value.logs;

        return (
          <BuilderStoreContext.Consumer>
            {(state) => (
              <div
                ref={divRef.current}
                className="builder-accordion"
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  flexDirection: "column",
                  ...(grid && {
                    flexDirection: "row",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }),
                }}
              >
                {/* TODO: helper static method for builder blocks to do this stuff */}
                {props.useChildrenForItems
                  ? props.builderBlock &&
                    props.builderBlock.children &&
                    props.builderBlock.children.map(
                      (block: BuilderElement, index: number) => {
                        if (block.repeat && block.repeat.collection) {
                          const collectionPath = block.repeat.collection;
                          const collectionName = (collectionPath || "")
                            .split(/\.\w+\(/)[0]
                            .trim()
                            .split(".")
                            .pop();

                          const itemName =
                            block.repeat.itemName ||
                            (collectionName ? collectionName + "Item" : "item");

                          const array: any[] | void = stringToFunction(
                            collectionPath,
                            true,
                            _errors,
                            _logs
                          )(state.state);
                          if (Array.isArray(array)) {
                            return array.map((data, index) => {
                              // TODO: Builder state produce the data
                              const childState = {
                                ...state.state,
                                $index: index,
                                $item: data,
                                [itemName]: data,
                              };

                              return (
                                <BuilderStoreContext.Provider
                                  key={block.id}
                                  value={{ ...state, state: childState } as any}
                                >
                                  {getAccordionItem(
                                    block.children ? [block.children[0]] : [],
                                    block.children ? [block.children[1]] : [],
                                    index,
                                    openGridItemOrder,
                                    onlyOneAtATime,
                                    true
                                  )}
                                </BuilderStoreContext.Provider>
                              );
                            });
                          }
                        }
                        return getAccordionItem(
                          block.children ? [block.children[0]] : [],
                          block.children ? [block.children[1]] : [],
                          index,
                          openGridItemOrder,
                          onlyOneAtATime,
                          true
                        );
                      }
                    )
                  : props.items &&
                    props.items.map((item, index) => {
                      return getAccordionItem(
                        item.title,
                        item.detail,
                        index,
                        openGridItemOrder,
                        onlyOneAtATime
                      );
                    })}
              </div>
            )}
          </BuilderStoreContext.Consumer>
        );
      }}
    </BuilderAsyncRequestsContext.Consumer>
  );
};

export default qwikify$(AccordionFC, {clientOnly:true});
