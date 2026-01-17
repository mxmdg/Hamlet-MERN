import axios from "axios";
import { HAMLET_API, HEALTH_API } from "../Config/config";

export const fechtData = async (collection, setFunction) => {
  const token = localStorage.getItem("token");
  const memberships = JSON.parse(localStorage.getItem("memberships") || "[]");
  const tenantId = memberships[0]?.tenant?.id;
  try {
    const res = await axios.get(`${HAMLET_API}${collection}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Tenant": tenantId,
      },
    });
    setFunction(res.data);
  } catch (e) {
    throw e;
  }
};

export const checkHealth = async () => {
  try {
    const res = await axios.get(`${HEALTH_API}`);
    /* console.log(
      `Health check response: ${res.data.status} ${
        getMyDate(res.data.timestamp).ddmmyy
      }`
    ); */
    return true;
  } catch (e) {
    //console.log(`Health check response: ${e}`);
    return false;
  }
};

export const getPrivateElements = async (collection) => {
  const token = localStorage.getItem("token");
  const memberships = JSON.parse(localStorage.getItem("memberships") || "[]");
  const tenantId = memberships[0]?.tenant?.id;

  if (!tenantId) {
    throw new Error("Imprenta activa no encontrada");
  }

  const elements = await axios.get(`${HAMLET_API}${collection}`, {
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

  if (!tenantId) {
    throw new Error("Tenant activo no encontrado");
  }

  const elements = await axios.get(`${HAMLET_API}${collection}/${id}`, {
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
    const elements = await axios.post(`${HAMLET_API + collection}`, formData, {
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

export const uploadFile = async (endpoint, data) => {
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
      `${HAMLET_API + collection}/${id}`,
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
    const elements = await axios.delete(`${HAMLET_API + collection}/${id}`, {
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
