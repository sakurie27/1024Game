/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { Box, BoxProps } from "@mui/material";

export default qwikify$(function VolumeBar({
  value,
  ...props
}: BoxProps & { value: number }) {
  return (
    <Box
      width="1ch"
      height="50%"
      bgcolor="#ccccccc0"
      border="0.5px white solid"
      borderRadius="100vmax"
      sx={{
        transform: "rotate(180deg)",
        transformOrigin: "50% 50%",
      }}
      {...props}
    >
      <Box width="100%" height={Math.trunc(value) + "%"} bgcolor="white"></Box>
    </Box>
  );
});
