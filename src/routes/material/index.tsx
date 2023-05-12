import { component$ } from "@builder.io/qwik";
import {
  MUIList,
  MUIListItem,
  MUIListItemText,
} from "../../integrations/react/material-ui";

const MaterialPage = component$(() => {
  return (
    <div>
      <h1>Material Page</h1>
      <MUIList>
        <MUIListItem>
          <MUIListItemText primary="Primary" />
        </MUIListItem>
        <MUIListItem>
          <MUIListItemText primary="Secondary" />
        </MUIListItem>
        <MUIListItem>
          <MUIListItemText primary="Third" />
        </MUIListItem>
      </MUIList>
    </div>
  );
});

export default MaterialPage;
