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

export const getPrivateElementByID = async (collection, id) => {
  const token = localStorage.getItem("token");
  try {
    const elements = await axios.get(`${databaseURL + collection}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return elements;
  } catch (e) {
    console.log(e);
  }
};

export const addPrivateElement = async (collection, formData) => {
  const token = localStorage.getItem("token");
  try {
    const elements = await axios.post(`${databaseURL + collection}`, formData , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return elements;
  } catch (e) {
    console.log(e);
  }
};

export const putPrivateElement = async (itemURL, formData) => {
  const token = localStorage.getItem("token");
  try {
    const elements = await axios.put(itemURL, formData , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return elements;
  } catch (e) {
    console.log(e);
  }
};

export const deletePrivateElement = async (collection, id) => {
  const token = localStorage.getItem("token");
  try {
    const elements = await axios.delete(`${databaseURL + collection}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {message: `Elemento eliminado`};
  } catch (e) {
    console.log(e);
  }
};
