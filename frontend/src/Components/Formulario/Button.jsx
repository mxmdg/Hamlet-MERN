import { Button } from "@mui/material";

const Button = (props) => {
  const clickHandler = (e) => {
    e.preventDefault();
    props.selectForm(props.id);
  };

  return (
    <>
      <Button
        variant="filled"
        color="secondary"
        type={"reset"}
        id={props.id}
        onClick={clickHandler}
      >
        {props.inputName}
      </Button>
    </>
  );
};

export default Button;
