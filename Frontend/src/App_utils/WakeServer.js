import axios from "axios";
import { useEffect } from "react";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const WakeServer = () => {

  useEffect(() => {
    const wake = async () => {
      try {
        await axios.get(BACKEND_URL + "/test");
      } catch (err) {
        console.log("Sever err:", err);
      }
    };
    wake();
  }, []);
};
