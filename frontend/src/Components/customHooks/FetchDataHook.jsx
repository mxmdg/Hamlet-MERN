import axios from "axios";
import { databaseURL, url, backendPort } from "../Config/config";
import { getMyDate } from "../utils/generalData/fechaDiccionario";

export const fechtData = async (collection, setFunction) => {
  try {
    const res = await axios.get(`${databaseURL + collection}/`);
    setFunction(res.data);
  } catch (e) {
    throw e;
  }
};

export const checkHealth = async () => {
  try {
    const res = await axios.get(`${url}${backendPort}/health`);
    console.log(
      `Health check response: ${res.data.status} ${
        getMyDate(res.data.timestamp).ddmmyy
      }`
    );
    return true;
  } catch (e) {
    console.log(`Health check response: ${e}`);
    return false;
  }
};

export const getPrivateElements = async (collection) => {
  const token = localStorage.getItem("token");
  const memberships = JSON.parse(localStorage.getItem("memberships") || "[]");
  const tenantId = memberships[0]?.tenant?.id;

  if (!tenantId) {
    throw new Error("Tenant activo no encontrado");
  }

  const elements = await axios.get(`${databaseURL}${collection}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Tenant": tenantId,
    },
  });

  return elements.data;
};

export const getPrivateElementByID = async (collection, id) => {
  const token = localStorage.getItem("token");
  const memberships = JSON.parse(localStorage.getItem("memberships") || "[]");
  const tenantId = memberships[0]?.tenant?.id;

  console.log(tenantId, memberships[0]?.tenant?.key);

  if (!tenantId) {
    throw new Error("Tenant activo no encontrado");
  }

  const elements = await axios.get(`${databaseURL}${collection}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Tenant": tenantId,
    },
  });

  return elements.data;
};

export const addPrivateElement = async (collection, formData) => {
  const token = localStorage.getItem("token");
  const memberships = JSON.parse(localStorage.getItem("memberships") || "[]");
  const tenantId = memberships[0]?.tenant?.id;
  try {
    const elements = await axios.post(`${databaseURL + collection}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Tenant": tenantId,
      },
    });
    console.log(elements);
    return elements;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const uploadFile = async (endpoint, data) => {
  console.log(endpoint);
  console.log(data);
  try {
    const elements = await axios.post(`${endpoint}`, data[0], {});
    return elements;
  } catch (e) {
    throw e;
  }
};

export const putPrivateElement = async (itemURL, formData) => {
  const token = localStorage.getItem("token");
  const memberships = JSON.parse(localStorage.getItem("memberships") || "[]");
  const tenantId = memberships[0]?.tenant?.id;

  try {
    console.log("URL from FetchDataHook: " + itemURL);
    const elements = await axios.put(itemURL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Tenant": tenantId,
      },
    });
    return elements;
  } catch (e) {
    throw e;
  }
};

export const patchPrivateElement = async (collection, id, formData) => {
  const token = localStorage.getItem("token");
  const memberships = JSON.parse(localStorage.getItem("memberships") || "[]");
  const tenantId = memberships[0]?.tenant?.id;
  try {
    const elements = await axios.patch(
      `${databaseURL + collection}/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant": tenantId,
        },
      }
    );
    return elements;
  } catch (e) {
    throw e;
  }
};

export const deletePrivateElement = async (collection, id) => {
  const token = localStorage.getItem("token");
  const memberships = JSON.parse(localStorage.getItem("memberships") || "[]");
  const tenantId = memberships[0]?.tenant?.id;
  try {
    const elements = await axios.delete(`${databaseURL + collection}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Tenant": tenantId,
      },
    });
    return { message: `Elemento eliminado` };
  } catch (e) {
    throw e;
  }
};

export const deleteClickHandler = async (id, collection) => {
  try {
    await deletePrivateElement(collection, id);
  } catch (e) {
    throw e;
  }
};

export const deleteMultiple = (ids, collection) => {
  const items = Array.isArray(ids) ? ids : [ids];

  items.forEach((item) => {
    deleteClickHandler(item, collection);
  });
};
