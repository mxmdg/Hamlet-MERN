function isObject(obj) {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

const arrayNormalizer = (element= Array, errManager = Function) => {
  try {
    if (isObject(element)) {
      console.log("Object to Array");
      return [element];
    } else if (Array.isArray(element)) {
      console.log("Array it's ok");
      const ids = [];
      element.map((el) => {
        console.log(`mapeando id: ${el}`);
        if (isObject(el) !== true) {
          ids.push(el);
        }
      });
      return ids.length === 0 ? element : errManager(ids);
    } else if (typeof element === "string") {
      const id = [];
      id.push(element);
      errManager(id);
      return(id)
    }
  } catch (error) {
    console.log(error);
  }
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

export default arrayNormalizer;
