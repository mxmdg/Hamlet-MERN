import "./printers.css";

const Cmyk = (props) => {
  const k = (
    <div className="cmyk">
      <div className="black"></div>
    </div>
  );
  const cmyk = (
    <div className="cmyk">
      <div className="cyan"></div>
      <div className="magenta"></div>
      <div className="yellow"></div>
      <div className="black"></div>
    </div>
  );
  const tintas = props.colores === 1 ? k : cmyk;
  return tintas;
};

export default Cmyk;
