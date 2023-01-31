/** @jsxImportSource react */
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { qwikify$ } from "@builder.io/qwik-react";

export const MUITooltip = (props: any) => {
  return <Tooltip title={props.title}>{props.children}</Tooltip>;
};

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
