import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.primary.dark
      : theme.palette.primary.light,
  ...theme.typography.subtitle2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.primary,
}));

export const Item2 = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.info.dark
      : theme.palette.info.light,
  ...theme.typography.subtitle2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text,
}));
