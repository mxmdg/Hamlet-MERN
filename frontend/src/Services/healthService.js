// services/healthService.js
import { url, backendPort } from "../Components/Config/config";
import { checkHealth } from "../Components/customHooks/FetchDataHook";

export async function checkBackendHealth() {
  try {
    const res = await checkHealth();
    return res;
  } catch (err) {
    return err;
  }
}
