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
    /*<TextField
      label={props.inputName}
      variant="outlined"
      type={props.type}
      step={props.step}
      value={valor}
      inputProps={ariaLabel}
      onChange={() => {}}
    /> */
    <div id={props.id}>
      <label>{props.inputName}</label>
      <input
        type={props.type}
        placeholder={props.inputName}
        id={props.inputName}
        step={props.step}
        defaultValue={valor}
      ></input>
    </div>
  );
};

export default Input;
