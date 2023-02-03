import { component$ } from "@builder.io/qwik";
import { RegisteredComponent } from "@builder.io/sdk-qwik";
import { QwikifyBasicTooltip } from "~/integrations/react/tooltip";
import BuilderAccordion, { AccordionProps } from '~/integrations/react/accordion'
import { accordionConfig } from "~/config/Accordion.config";
const BasicTooltip = component$(() => <QwikifyBasicTooltip />)
const Accordion = component$((props : AccordionProps) => <BuilderAccordion {...props}/>)
const Name = component$(() => <h1>MY NAME</h1>)
export const WIDGETS: RegisteredComponent[] = [
  {
    component : BasicTooltip,
    name : "Basic tooltip",
    builtIn: true
  },
  {
    component: Name,
    name : 'name',
    builtIn:true
  },
  {
    component : Accordion,
    builtIn : true,
    ...accordionConfig
  }
];
