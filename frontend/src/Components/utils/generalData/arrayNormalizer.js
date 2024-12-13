function isObject(obj) {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

const arrayNormalizer = (element, errManager = Function) => {
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
  }
  } catch (error) {
    console.log(error)
  }
  
};

export default arrayNormalizer;
