import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  axios.defaults.withCredentials = true;

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () =>{
    try {
      const {data} = await axios.get(backendurl + '/api/auth/is-auth')
      if(data.success){
        setIsLoggedIn(true)
        getUserData()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/data", {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() =>{
      getAuthState();
  },[])

  const value = {
    backendurl,
    isLoggedin,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
