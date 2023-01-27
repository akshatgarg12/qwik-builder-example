/** @jsxImportSource react */
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { qwikify$ } from '@builder.io/qwik-react';

export const BasicTooltip = () => {
  return (
    <Tooltip title="Delete">
      <IconButton>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
}

export const MUITooltip =  qwikify$(BasicTooltip, {clientOnly : true})