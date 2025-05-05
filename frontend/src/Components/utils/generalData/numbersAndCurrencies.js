export const roundCents = (value) => {
  return Math.round(value * 100) / 100;
};

export const roundInteger = (value) => {
  return Math.round(value);
};

export const percentBefore = (p1) => {
  const pr1 = 100 - p1;
  const res = (p1 * 100) / pr1;
  console.log(pr1, res);
  return roundCents(res);
};
