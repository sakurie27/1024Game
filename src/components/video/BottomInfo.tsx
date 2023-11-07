/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { Comment, Star, ThumbUp } from "@mui/icons-material";
import {
  Grid,
  Avatar,
  Typography,
  IconButton,
  Box,
  iconButtonClasses,
  Skeleton,
  skeletonClasses,
} from "@mui/material";
export interface BottomInfoProps {
  meta?: MetaSchema;
}
export default qwikify$(function Bottominfo({ meta }: BottomInfoProps) {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        pointerEvents: 'none',
        [`.${skeletonClasses.root}`]: {
          bgcolor: "grey.900",
        },
      }}
    >
      <Grid item xs>
        {/* TODO: danmaku */}
      </Grid>
      <Grid item xs="auto" m="2ch" container flexWrap="nowrap">
        {meta ? (
          <Avatar
            src={meta?.upavatar}
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
        ) : (
          <Skeleton
            sx={{
              flexShrink: 0,
            }}
            animation="wave"
            width={64}
            height={64}
            variant="circular"
          />
        )}
        <Box
          flexShrink={1}
          display="flex"
          flexDirection="column"
          mx="2ch"
          width="100%"
          alignItems="space-even"
        >
          {meta ? (
            <>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                flexGrow={1}
                lineHeight={1.5}
              >
                {meta.title}
              </Typography>
              <Typography variant="subtitle2" flexShrink={1}>
                {meta.upname}
              </Typography>
            </>
          ) : (
            <>
              <Skeleton
                animation="wave"
                variant="rectangular"
                height="1.5rem"
                width="60%"
              ></Skeleton>
            </>
          )}
        </Box>
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
            stroke: "#eeeeeee0",
          },
        }}
      >
        <IconButton>
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
