/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { Comment, Star, ThumbUp } from "@mui/icons-material";
import { Grid, Avatar, Typography, IconButton, Box, iconButtonClasses } from "@mui/material";
export interface BottomInfoProps {
  meta: MetaSchema;
}
export default qwikify$(function Bottominfo({ meta }: BottomInfoPros) {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
      }}
    >
      <Grid item xs>
        {/* TODO: danmaku */}
      </Grid>
      <Grid item xs="auto" m="2ch" container>
        <Avatar
          src={meta.upavatar}
          sx={{
            width: 64,
            height: 64,
            border: "1px white solid",
          }}
          // prevent layout shift
          imgProps={{
            width: 64,
            height: 64,
          }}
        />
        <Typography variant="subtitle1" m="1ch">
          {meta.upname}
        </Typography>
      </Grid>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{
          position: "absolute",
          m: "2ch",
          right: "0",
          top: "0",
          bottom: "0",
          gap: "1.5em",
          [`& .${iconButtonClasses.root}`]: {
            color: "#ffffffb0",
            stroke: '#eeeeeee0'
          }
        }}
      >
        <IconButton >
          <ThumbUp fontSize="large" />
        </IconButton>
        <IconButton>
          <Comment fontSize="large" />
        </IconButton>
        <IconButton>
          <Star fontSize="large" />
        </IconButton>
      </Box>
    </Grid>
  );
});
