import { component$ } from "@builder.io/qwik";
import { MUITextField } from "../../integrations/react/material-ui";

const MaterialPage = component$(() => {
  return (
    <div>
      <h1>Material Page</h1>
      <MUITextField label="Material Text Field" />
    </div>
  );
});

export default MaterialPage;
