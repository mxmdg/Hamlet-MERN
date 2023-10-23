export const bestCut = (x1, y1, x2, y2) => {
  let xPoses1 = Math.floor(x1 / parseInt(x2));
  let yPoses1 = Math.floor(y1 / parseInt(y2));
  let xPoses2 = Math.floor(x1 / parseInt(y2));
  let yPoses2 = Math.floor(y1 / parseInt(x2));

  let n1 = xPoses1 * yPoses1;
  let n2 = xPoses2 * yPoses2;
  n = Math.max(n1, n2);
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
    bestCut(xResto, y1, x2, y2);

    masPoses = n;
  } else if (x2 <= yResto && y2 < x1) {
    bestCut(yResto, x1, x2, y2);
    masPoses = n;
  } else {
    masPoses = 0;
  }

  totalPoses = parseInt(poses) + parseInt(masPoses);

  console.log(`Poses = ${poses} + ${masPoses}`);
  console.log(`Total = ${totalPoses}`);

  return { xPoses, yPoses, masPoses, totalPoses, xResto, yResto, x2, y2 };
};
