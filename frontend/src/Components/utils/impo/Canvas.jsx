import { useEffect, useState } from "react";
import { drawBestCutting, cutOptimizer } from "./ImpositionService";

const Canvas = (props) => {
  useEffect(() => {
    const canvas = document.getElementById(props.id + "_canvas");
    console.log(canvas);
    const newContext = canvas.getContext("2d");
    console.log(cutOptimizer(470, 320, props.part.Ancho, props.part.Alto));
    drawBestCutting(
      470,
      320,
      props.part.Ancho,
      props.part.Alto,
      3,
      3,
      newContext,
      props.width,
      props.height
    );
  }, []);

  return (
    <div
      style={{
        background: "#444",
        padding: "10px",
        margin: "0px 10px 5px 10px",
        width: props.width,
        borderRadius: "4px",
        boxShadow: "3px 3px 6px #000",
      }}
    >
      <canvas
        id={props.id + "_canvas"}
        width={props.width}
        height={props.height}
      ></canvas>
    </div>
  );
};

export default Canvas;
