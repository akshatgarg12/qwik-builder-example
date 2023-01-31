/** @jsxImportSource react */
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { qwikify$ } from "@builder.io/qwik-react";
import { MUITooltip } from "./material-ui";

export const BasicTooltip = ({ title }: any) => {
  return (
    <MUITooltip title={title}>
      <div>
        {title}
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </div>
    </MUITooltip>
  );
};

export const QwikifyBasicTooltip = qwikify$(BasicTooltip, { clientOnly: true });
