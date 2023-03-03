import { component$ } from "@builder.io/qwik";
import { RegisteredComponent } from "@builder.io/sdk-qwik";
const Name = component$(() => <h1>MY NAME</h1>)
export const WIDGETS: RegisteredComponent[] = [
  {
    component: Name,
    name : 'name'
  }
];
