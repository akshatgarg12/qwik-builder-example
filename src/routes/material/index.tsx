import { component$ } from "@builder.io/qwik";
import  { MUICircularProgress, MUIOutlinedCard } from "../../integrations/react/material-ui";

export default component$(() => {
  return (
    <div>
      <h1>This page contains material-ui components (qwikifed)</h1>
      <MUIOutlinedCard
        client:load
        word="Handsome"
        meaning="Good looking person"
      />
      <MUICircularProgress />
    </div>
  );
});
