import React, { useContext } from "react";
import { assets } from "../assets";
import { data, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
// import VerifyEmail from "../pages/VerifyEmail";

const Navbar = () => {
  const navigate = useNavigate();

  const { userData, backendurl, setUserData, setIsLoggedIn } =
    useContext(AppContext);

    const sendverificationOtp = async () =>{
      try {
        axios.defaults.withCredentials = true;

        const {data} = await axios.post(backendurl + '/api/auth/send-verify-otp')

        if(data.success){
          navigate('/verify-account')
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(data.message)
      }
    }

//logout fuctionalites
const logout = async () =>{
  try {
    axios.defaults.withCredentials = true;
    const { data } = await axios.post(backendurl + '/api/auth/logout')
    data.success && setIsLoggedIn(false)
    data.success && setUserData(false)
    navigate('/');
  } catch (error) {
    toast.error(error.message)
  }
}

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 test-sm">
              {!userData.isAccountVerified && <li onClick={sendverificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">VerifyEmail</li>}
              
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-300"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
