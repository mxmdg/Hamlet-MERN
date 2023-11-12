import axios from "axios";
import { databaseURL } from "../Config/config";

export const fechtData = async (collection, setFunction) => {
  try {
    const res = await axios.get(`${databaseURL + collection}/`);
    console.log(res.data);
    setFunction(res.data);
  } catch (e) {
    throw e;
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
    throw e;
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
    console.log(elements);
    return elements;
  } catch (e) {
    throw e;
  }
};

export const addPrivateElement = async (collection, formData) => {
  const token = localStorage.getItem("token");
  try {
    const elements = await axios.post(`${databaseURL + collection}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return elements;
  } catch (e) {
    throw e;
  }
};

export const putPrivateElement = async (itemURL, formData) => {
  const token = localStorage.getItem("token");
  try {
    const elements = await axios.put(itemURL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return elements;
  } catch (e) {
    throw e;
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
    return { message: `Elemento eliminado` };
  } catch (e) {
    throw e;
  }
};

export const deleteClickHandler = async (id, collection) => {
  try {
    await axios.delete(`${databaseURL + collection}/${id}`);
  } catch (e) {
    throw e;
  }
};

export const deleteMultiple = (id, collection) => {
  if (id.length > 1) {
    if (
      window.confirm(
        "ATENCION! Esta accion borrará los elementos seleccionados"
      )
    ) {
      id.map((item) => {
        try {
          deleteClickHandler(item, collection);
        } catch (e) {
          throw e;
        }
      });
    }
  } else if (id.length === 1) {
    if (
      window.confirm("ATENCION! Esta accion borrará el elemento seleccionado")
    ) {
      try {
        deleteClickHandler(id, collection);
      } catch (e) {
        throw e;
      }
    }
  }
};
