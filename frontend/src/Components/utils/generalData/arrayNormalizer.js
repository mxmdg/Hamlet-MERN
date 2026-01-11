function isObject(obj) {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

const arrayNormalizer = (input) => {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input
      .map((el) => {
        if (!el) return null;
        if (typeof el === "string") return el;
        if (typeof el === "object" && el._id) return el._id;
        return null;
      })
      .filter(Boolean);
  }

  if (typeof input === "string") {
    return [input];
  }

  if (typeof input === "object" && input._id) {
    return [input._id];
  }

  return [];
};

export const addElementToArray = (element, array) => {
  const newArray = [...array];
  newArray.push(element);
  return newArray;
};

export const removeElementFromArray = (index, array) => {
  const newArray = [...array];
  if (index > -1) {
    newArray.splice(index, 1);
  }
  return newArray;
};

export const replaceElementInArray = (newElement, oldElement, array) => {
  const newArray = [...array];
  const index = newArray.indexOf(oldElement);
  if (index > -1) {
    newArray.splice(index, 1, newElement);
  }
  return newArray;
};

export const updateElementInArray = (updatedElement, array) => {
  const newArray = [...array];
  const index = newArray.findIndex((el) => el._id === updatedElement._id);
  if (index > -1) {
    newArray.splice(index, 1, updatedElement);
  }
  return newArray;
};

export const orderArrayByKey = (array, key, asc = true) => {
  const order = asc ? 1 : -1;
  return array.sort((a, b) => {
    if (a[key] < b[key]) {
      return -1 * order;
    }
    if (a[key] > b[key]) {
      return 1 * order;
    }
    return 0;
  });
};

export default arrayNormalizer;
