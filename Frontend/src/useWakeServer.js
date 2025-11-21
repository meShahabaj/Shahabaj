import { useEffect } from "react";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useWakeServer = () => {
    
  useEffect(() => {
    const wake = async () => {
      try {
        await fetch(BACKEND_URL + "/test");
        console.log("Backend warmed up");
      } catch (err) {
        console.log("Warmup failed:", err);
      }
    };
    wake();
  }, []);
};
