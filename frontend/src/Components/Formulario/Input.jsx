import {
  FormControl,
  TextField,
  FormHelperText,
  Grid,
  InputLabel,
} from "@mui/material";

const Input = (props) => {
  const ariaLabel = { "aria-label": "description" };

  const valueFinder = () => {
    for (const [key, val] of Object.entries(props.item)) {
      if (key == props.inputName) {
        //console.log(key, val)
        return val;
      }
    }
  };

  const valor = props.item ? valueFinder() : "";

  return (
    <FormControl id={props.id}>
      <TextField
        label={props.inputName}
        variant="outlined"
        type={props.type}
        step={props.step}
        value={valor}
        inputProps={ariaLabel}
      ></TextField>
    </FormControl>
  );
};

export default Input;
