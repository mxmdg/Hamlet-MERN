import axios from "axios";
import { databaseURL } from "../Config/config";

export const fechtData = async (collection, setFunction) => {
  try {
    const res = await axios.get(collection);
    console.log(res.data);
    setFunction(res.data);
  } catch (e) {
    return { message: e };
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
    return { message: e };
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
    return { message: e };
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
    return { message: e };
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
    return { message: e };
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
    return { message: e };
  }
};

export const deleteClickHandler = async (id, collection) => {
  try {
    await axios.delete(`${databaseURL + collection}/${id}`);
  } catch (e) {
    alert(e);
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
        } catch (error) {
          console.log(error);
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
        return { message: e };
      }
    }
  }
};
