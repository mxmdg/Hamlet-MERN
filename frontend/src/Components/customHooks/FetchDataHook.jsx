import axios from "axios";

export const fechtData = async (collection, setFunction) => {
  try {
    const res = await axios.get(collection);
    console.log(res.data);
    setFunction(res.data);
  } catch (e) {
    console.log(e);
  }
};
