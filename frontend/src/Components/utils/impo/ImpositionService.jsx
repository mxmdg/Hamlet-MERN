export const bestCut = (x1, y1, x2, y2) => {
  let xPoses1 = Math.floor(x1 / parseInt(x2));
  let yPoses1 = Math.floor(y1 / parseInt(y2));
  let xPoses2 = Math.floor(x1 / parseInt(y2));
  let yPoses2 = Math.floor(y1 / parseInt(x2));

  let n1 = xPoses1 * yPoses1;
  let n2 = xPoses2 * yPoses2;
  let n = Math.max(n1, n2);
  //console.log(`Entran ${n}`);

  return n;
};

export const cutOptimizer = (x1, y1, x2, y2) => {
  let xPoses = Math.floor(x1 / parseInt(x2));

  let yPoses = Math.floor(y1 / parseInt(y2));

  let poses = xPoses * yPoses;

  let xResto = x1 % x2;

  let yResto = y1 % y2;

  let masPoses;

  if (y2 <= xResto && x2 < y1) {
    masPoses = bestCut(xResto, y1, x2, y2);
  } else if (x2 <= yResto && y2 < x1) {
    masPoses = bestCut(yResto, x1, x2, y2);
  } else {
    masPoses = 0;
  }

  let totalPoses = parseInt(poses) + parseInt(masPoses);

  console.log(`Poses = ${poses} + ${masPoses}`);
  console.log(`Total = ${totalPoses}`);

  return { xPoses, yPoses, masPoses, totalPoses, xResto, yResto, x2, y2 };
};

export const drawBestCutting = (
  x1,
  y1,
  x2,
  y2,
  margen = 0,
  calle = 0,
  ctx,
  xCtx,
  yCtx
) => {
  let xPoses1 = Math.floor(x1 / parseInt(x2));
  let yPoses1 = Math.floor(y1 / parseInt(y2));
  let xPoses2 = Math.floor(x1 / parseInt(y2));
  let yPoses2 = Math.floor(y1 / parseInt(x2));

  let n1 = xPoses1 * yPoses1;
  let n2 = xPoses2 * yPoses2;

  let n = Math.max(n1, n2);
  //console.log(`Entran ${n}`);

  ctx.clearRect(0, 0, xCtx, yCtx);

  let izq = (xCtx - x1) / 2;
  let top = (yCtx - y1) / 2;

  ctx.strokeStyle = "#222";
  ctx.strokeWidth = "1";
  ctx.strokeRect(izq, top, x1, y1);

  ctx.strokeStyle = "#000";

  if (n1 >= n2 && n1 > 0) {
    top = top - y2;
    for (let h = 0; h < yPoses1; h++) {
      top = top + y2;
      for (let i = 0; i < xPoses1; i++) {
        ctx.strokeRect(
          izq + (x1 - x2 * xPoses1) / 2 + x2 * i,
          top + (y1 - y2 * yPoses1) / 2,
          x2,
          y2
        );
      }
    }
  } else if (n2 > n1 && n2 > 0) {
    top = top - x2;
    for (let h = 0; h < yPoses2; h++) {
      top = top + x2;
      for (let i = 0; i < xPoses2; i++) {
        ctx.strokeRect(
          izq + (x1 - y2 * xPoses2) / 2 + y2 * i,
          top + (y1 - x2 * yPoses2) / 2,
          y2,
          x2
        );
      }
    }
  } else if (n1 == 0 && n2 == 0) {
    ctx.clearRect(0, 0, xCtx, yCtx);
    ctx.strokeStyle = "#F00";
    ctx.strokeWidth = "3";
    ctx.strokeRect(izq, top, x1, y1);
  }

  //ctx.fillRect(izq + ((x1-x2)/2),top + ((y1-y2)/2),x2,y2);

  return n;
};
