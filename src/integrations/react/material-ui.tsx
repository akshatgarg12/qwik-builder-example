/** @jsxImportSource react */
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { qwikify$ } from "@builder.io/qwik-react";
import Tooltip from "@mui/material/Tooltip";

export const MUITooltip = (props: any) => {
  return <Tooltip placement="top" title={props.title}>{props.children}</Tooltip>;
};

interface OutlinedCardProps {
  word: string;
  meaning: string;
}

export const OutlinedCard = ({ word, meaning }: OutlinedCardProps) => {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <React.Fragment>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
              {word}
            </Typography>
            <Typography variant="body2">{meaning}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </React.Fragment>
      </Card>
    </Box>
  );
};

export default qwikify$(OutlinedCard, { clientOnly: true });
export const MUICircularProgress = qwikify$(CircularProgress, {clientOnly:true})