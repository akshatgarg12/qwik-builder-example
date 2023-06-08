import { component$ } from "@builder.io/qwik";
import { RegisteredComponent } from "@builder.io/sdk-qwik";
import { Accordion } from "../../fake_modules/qwik/src/widgets/Accordion/accordion";
import { Carousel } from "../../fake_modules/qwik/src/widgets/Carousel/carousel";
import { MasonryComponent } from "../../fake_modules/qwik/src/widgets/Masonry/masonry";
import { Tabs } from "../../fake_modules/qwik/src/widgets/Tabs/tabs";

import { accordionConfig } from "../config/Accordion.config";
import { carouselConfig } from "../config/Carousel.config";
import { tabsConfig } from "../config/builder-tabs.config";
import { masonryConfig } from "../config/Masonry.config";

const Name = component$(() => <h1>MY NAME</h1>);
export const WIDGETS: RegisteredComponent[] = [
  {
    component: Name,
    name: "name",
  },
  {
    component: Accordion,
    ...accordionConfig,
  },
  {
    component: Carousel,
    ...carouselConfig,
  },
  {
    component: MasonryComponent,
    ...masonryConfig,
  },
  {
    component: Tabs,
    ...tabsConfig,
  },
];
