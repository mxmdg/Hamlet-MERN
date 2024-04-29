const Select = (props) => {
  // Props: inputName(String) changeHandler(function) options(array[{value: x, text: equis}]) value(String || Number)

  return (
    <div>
      <label>{props.inputLabel || props.inputName}</label>
      <select
        onChange={(e) => props.changeHandler(e)}
        defaultValue={props.item?.Costo?._id}
        id={props.inputName}
      >
        <option>Elija una opcion</option>
        {props.options.map((option) => (
          <option
            value={option.value}
            id={"id_" + option.value}
            key={"key_" + option.value}
            defaultValue={"id_" + props.value}
          >
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
