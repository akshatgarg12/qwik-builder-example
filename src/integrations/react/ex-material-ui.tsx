/** @jsxImportSource react */
import {
    Tooltip,
    CircularProgress,
} from '@material-ui/core';
import { qwikify$ } from '@builder.io/qwik-react';

export const MUITooltip = qwikify$(Tooltip)
export const MUICircularProgress = qwikify$(CircularProgress, {clientOnly:true})
