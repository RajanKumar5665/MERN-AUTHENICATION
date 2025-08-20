import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext"; // ✅ check path

const VerifyEmail = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true; // ✅ allow cookies/session

  // ✅ include isLoggedIn, userData
  const { backendurl, getUserData, isLoggedIn, userData } =
    useContext(AppContext);

  const inputRefs = useRef([]); // store refs of OTP boxes

  // 👉 Auto move to next input
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 👉 Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // 👉 Paste OTP into boxes
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    const pasteArray = paste.replace(/\D/g, "").split("");

    pasteArray.forEach((char, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = char;
      }
    });

    if (pasteArray.length > 0) {
      const lastIndex =
        Math.min(pasteArray.length, inputRefs.current.length) - 1;
      inputRefs.current[lastIndex].focus();
    }
  };

  // 👉 Submit OTP
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const otp = inputRefs.current.map((el) => el?.value || "").join("");

      if (otp.length !== 6) {
        toast.error("Please enter all 6 digits of the OTP");
        return;
      }

      const { data } = await axios.post(
        `${backendurl}/api/auth/verify-account`, // ✅ use backendurl
        { otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Redirect if already verified
  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 flex items-center justify-center relative px-4">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute top-5 left-5 sm:left-20 w-28 sm:w-32 cursor-pointer"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email
        </p>

        <div onPaste={handlePaste} className="flex justify-between mb-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              inputMode="numeric"
              pattern="\d*"
              required
              className="w-12 h-12 bg-[#333A5c] text-white text-center text-xl rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ref={(el) => (inputRefs.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 
                     text-white rounded-full hover:opacity-90 transition"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
