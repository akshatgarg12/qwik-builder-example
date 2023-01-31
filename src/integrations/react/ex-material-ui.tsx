/** @jsxImportSource react */
import {
    Divider, 
    IconButton,
    Tooltip,
    SvgIcon, 
    CircularProgress,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField, 
} from '@material-ui/core';
import { qwikify$ } from '@builder.io/qwik-react';

export const MUIDivider = qwikify$(Divider)
export const MUIIconButton = qwikify$(IconButton)
export const MUITooltip = qwikify$(Tooltip)
export const MUISvgIcon = qwikify$(SvgIcon)
export const MUICircularProgress = qwikify$(CircularProgress, {clientOnly:true})
export const MUIInputAdornment = qwikify$(InputAdornment)
export const MUIList = qwikify$(List)
export const MUIListItem = qwikify$(ListItem)
export const MUIListItemText = qwikify$(ListItemText)
export const MUIPaper = qwikify$(Paper)
export const MUITextField = qwikify$(TextField)