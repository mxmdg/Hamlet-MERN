export const objectToArrayFilter = (objectOfObjects) => {
  let result = [];
  Object.values(objectOfObjects).map((subObject) => {
    const res = Object.values(subObject).slice(1, -1);
    result.push(res);
  });
  return result;
};

export const objectToArray = (objectOfObjects) => {
  let result = [];
  Object.values(objectOfObjects).map((subObject) => {
    const res = subObject;
    result.push(res);
  });
  return result;
};
