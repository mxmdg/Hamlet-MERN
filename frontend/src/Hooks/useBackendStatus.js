// hooks/useBackendStatus.js
import { useEffect, useState } from "react";
import { checkBackendHealth } from "../Services/healthService";
import { checkHealth } from "../Components/customHooks/FetchDataHook";

export function useBackendStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    async function check() {
      const ok = await checkHealth();
      console.log(ok);
      if (mounted) {
        setStatus(ok ? "ok" : "down");
      }
    }

    check();

    return () => (mounted = false);
  }, []);

  return status;
}
