import { useState } from "react";
import { useSelector } from "react-redux";

import { useToasts } from "react-toast-notifications";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
export default function useFetcher() {
  const { addToast } = useToasts();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
     const isAuthenticated = JSON.parse(window.sessionStorage.getItem("authenticated")) || false;

   const { lang } = useSelector((state) => state.localiztion);


  
  
  const fetchData = async (url, type) => {
    setLoading(true);
    // setError(null);

    try {
     const response = await fetch(BaseUrl + url, {
       headers: {
         method: "GET",
         lang:lang,
         Authorization: isAuthenticated,
       },
     });
     const json = await response.json();
      if (json.success) {
       if (type && type === "mobile") {
         setData((prevData) => ({
           ...prevData,
           [url]: json,
         }));
       }
       else {
         setData((prevData) => ({
         ...prevData, 
         [url]: json.data,
       }));
       }
     } else {
         addToast(json.message, { appearance: "error", autoDismiss: true });
       setError(json.message);
     }
    } catch (error) {
      setError(error.message);
         addToast(error.message, { appearance: "error", autoDismiss: true });

    } finally {
      setLoading(false);
    }
  };
  
  const createData = async (url, newData, method, callback, onFinish) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(BaseUrl + url, {
        method: method || "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: isAuthenticated,
          lang: lang,
        },
        body: JSON.stringify(newData),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message);
        
      }
      if (json.success) {
        if (callback && typeof callback === "function") {
          callback();
        }
        addToast(json.message, { appearance: "success", autoDismiss: true });

      } else {
        setError(json.message);
        addToast(json.message, { appearance: "error", autoDismiss: true });

      }
      // Optional: You can update the fetched data here if needed
      //   fetchData(url);
    } catch (error) {
      setError(error.message);
        addToast(error.message, { appearance: "error", autoDismiss: true });

    } finally {
      onFinish &&  onFinish()
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData, createData };
}
