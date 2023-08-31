import axios from "axios";
import { databaseURL } from "../Config/config";

export const fechtData = async (collection, setFunction) => {
  try {
    const res = await axios.get(collection);
    console.log(res.data);
    setFunction(res.data);
  } catch (e) {
    console.log(e);
  }
};

export const getPrivateElements = async (collection) => {
  const token = localStorage.getItem("token");
  try {
    const elements = await axios.get(`${databaseURL + collection}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return elements.data;
  } catch (e) {
    console.log(e);
  }
};
