export const invertHex = (color) => {
  color = color.replace("#", "");

  // #rgb -> #rrggbb (duplicamos cada dígito)
  if (color.length === 3) {
    color = color.split("").map((c) => c + c).join("");
  }

  const r = color.substr(0, 2);
  const g = color.substr(2, 2);
  const b = color.substr(4, 2);
  const a = color.length === 8 ? color.substr(6, 2) : null; // alpha, si existe

  const getComplement = (rr) => {
    const a = rr.substring(0, 1);
    const b = rr.substring(1, 2);
    const invert = (c) => {
      let index = parseInt(c, 16);
      index = 15 - index;
      return index.toString(16);
    };
    return invert(a) + invert(b);
  };

  const invertedColor =
    "#" + getComplement(r) + getComplement(g) + getComplement(b) + (a ?? "");

  return invertedColor;
};