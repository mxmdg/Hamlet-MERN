// hooks/useBackendStatus.js
import { useEffect, useState } from "react";
import { checkBackendHealth } from "../Services/healthService";
import { checkHealth } from "../Components/customHooks/FetchDataHook";

export function useBackendStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    async function check() {
      const ok = await checkHealth();
      setStatus(ok ? "ok" : "down");
    }

    check();
  }, []);

  return status;
}
