const toValidNumber = (value, fallback = 1) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

export const createSvgDrawingContext = () => {
  let strokeStyle = "#000";
  let fillStyle = "transparent";
  let strokeWidth = 1;
  let shapes = [];

  const context = {
    clearRect: () => {
      shapes = [];
    },
    strokeRect: (x, y, width, height) => {
      const w = toValidNumber(width, 0);
      const h = toValidNumber(height, 0);

      if (w <= 0 || h <= 0) return;

      shapes.push({
        type: "rect",
        x: toValidNumber(x, 0),
        y: toValidNumber(y, 0),
        width: w,
        height: h,
        stroke: strokeStyle,
        strokeWidth: toValidNumber(strokeWidth, 1),
        fill: "none",
      });
    },
  };

  Object.defineProperty(context, "strokeStyle", {
    get: () => strokeStyle,
    set: (value) => {
      strokeStyle = value || "#000";
    },
  });

  Object.defineProperty(context, "fillStyle", {
    get: () => fillStyle,
    set: (value) => {
      fillStyle = value || "transparent";
    },
  });

  Object.defineProperty(context, "strokeWidth", {
    get: () => strokeWidth,
    set: (value) => {
      strokeWidth = toValidNumber(value, 1);
    },
  });

  Object.defineProperty(context, "lineWidth", {
    get: () => strokeWidth,
    set: (value) => {
      strokeWidth = toValidNumber(value, 1);
    },
  });

  return {
    context,
    getShapes: () => shapes,
  };
};
