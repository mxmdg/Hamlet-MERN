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
          >
            {option.text}
          </option>
        ))}
      </select>
      <div className="value" id={props.inputName + "_id"}>
        {props.value}
      </div>
    </div>
  );
};

export default Select;
