import { BuilderElement } from "../../types/element";

import Slider from "./slider";

import { Fragment, component$, h } from "@builder.io/qwik";

type BuilderBlockType = BuilderElement;
interface CarouselProps {
  slides: Array<
    | any
    | {
        content: BuilderBlockType[];
      }
  >;
  builderBlock: BuilderBlockType;
  nextButton?: BuilderBlockType[];
  prevButton?: BuilderBlockType[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  hideDots?: boolean;
  useChildrenForSlides?: boolean;
}
export const Carousel = component$((props: CarouselProps) => {
  return (
    <Slider
      builderBlock={props.builderBlock}
      useChildrenForSlides={
        props.useChildrenForSlides ? props.useChildrenForSlides : false
      }
      slides={props.slides}
      autoplay={props.autoplay ? props.autoplay : false}
      autoplaySpeed={props.autoplaySpeed ? props.autoplaySpeed * 1000 : 1000}
      dots={!props.hideDots}
      prevArrow={props.prevButton}
      frontArrow={props.nextButton}
    ></Slider>
  );
});

export default Carousel;
