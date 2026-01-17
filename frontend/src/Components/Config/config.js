//export const url = "http://181.104.19.45:";
//export const url = "http://192.168.0.198:";
//export const url = "http://192.168.56.1:";
//export const url = "http://192.168.0.137:";
export const API_BASE = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;

// módulos
export const HAMLET_API = `${API_BASE}/Hamlet/`;
export const HEALTH_API = `${API_BASE}/health`;
export const VALIDATE_PDF = `${process.env.REACT_APP_API_HOST}:8000/upload`;
