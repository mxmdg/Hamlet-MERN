import { useEffect, useState } from "react";
import {
  drawCutting,
  cutOptimizer,
  drawSimpleCutting,
  drawOptimusCutting,
} from "./ImpositionService";

const Canvas = (props) => {
  useEffect(() => {
    const canvas = document.getElementById(props.id + "_canvas");
    console.log(canvas);
    const newContext = canvas.getContext("2d");
    drawCutting(
      470,
      320,
      props.part.Ancho,
      props.part.Alto,
      0,
      0,
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
        width: "100%",
        borderRadius: "4px",
        boxShadow: "3px 3px 6px #000",
        objectFit: "scale-down",
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
