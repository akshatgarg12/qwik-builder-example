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
  useVisibleTask$,
} from "@builder.io/qwik";

import Glide from "@glidejs/glide/dist/glide.modular.esm";

export interface SliderProps {
  builderBlock: any;
  useChildrenForSlides: boolean;
  slides: any[];
  prevArrow: any;
  frontArrow: any;
  dots: boolean;
  autoplay: boolean;
  autoplaySpeed: number;
}
export const prevArrowFn = function prevArrowFn(props, state, context) {
  state.glide.go("<");
};
export const nextArrowFn = function nextArrowFn(props, state, context) {
  state.glide.go(">");
};
export const Slider = component$((props: SliderProps) => {
  const context = useContext(BuilderContext);
  const state = useStore<any>({
    glide: new Glide(".glide", {
      type: "slider",
      startAt: 0,
      autoplay: props.autoplay ? props.autoplaySpeed * 1000 : undefined,
    }),
  });
  useVisibleTask$(() => {
    state.glide.on("mount:after", () => {
      console.log("slider mounted!");
    });
    state.glide.mount();
  });

  return (
    <div class="glide">
      <div data-glide-el="track" class="glide__track">
        <div class="glide__slides">
          {props.useChildrenForSlides &&
          props.builderBlock &&
          props.builderBlock.children
            ? (props.builderBlock.children || []).map(function (block, index) {
                return (
                  <div class="glide__slide" key={index}>
                    <RenderBlock
                      block={block}
                      key={block.id}
                      context={context}
                    ></RenderBlock>
                  </div>
                );
              })
            : null}
          {!props.useChildrenForSlides && props.slides
            ? (props.slides || []).map(function (slide, index) {
                return (
                  <div class="glide__slide" key={index}>
                    <RenderBlocks
                      key={index}
                      path={`component.options.slides.${index}.content`}
                      blocks={slide.content}
                    ></RenderBlocks>
                  </div>
                );
              })
            : null}
        </div>
      </div>
      {props.dots ? (
        <div class="glide__bullets" data-glide-el="controls[nav]">
          {(props.slides || []).map(function (_, index) {
            return (
              <button
                class="glide__bullet"
                onClick$={(event) => (state.glide.index = index)}
              ></button>
            );
          })}
        </div>
      ) : null}
      <div data-glide-el="controls">
        <div onClick$={(event) => prevArrowFn(props, state, context)}>
          <RenderBlocks
            path="component.options.prevButton"
            blocks={props.prevArrow}
          ></RenderBlocks>
        </div>
        <div
          onClick$={(event) => nextArrowFn.bind(null, props, state, context)}
        >
          <RenderBlocks
            path="component.options.nextButton"
            blocks={props.frontArrow}
          ></RenderBlocks>
        </div>
      </div>
    </div>
  );
});

export default Slider;
