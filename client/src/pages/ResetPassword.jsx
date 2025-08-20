import React, { useState, useRef, useContext } from "react";
import { assets } from "../assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendurl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isemailsent, setIsemailsent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isotpSubmitted, setIsotpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendurl}/api/auth/send-reset-otp`,
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsemailsent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onsubmitOtp = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el.value);
    setOtp(otpArray.join(""));
    setIsotpSubmitted(true);
  };

  const onsubmitPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendurl}/api/auth/reset-password`,
        { email, otp, newPassword: password }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 flex items-center justify-center relative px-4">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute top-5 left-5 sm:left-20 w-28 sm:w-32 cursor-pointer"
      />

      {/* Step 1: enter email */}
      {!isemailsent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>

          <div className="flex items-center gap-2 bg-[#333A5c] px-3 py-2 rounded-md mb-4">
            <img src={assets.mail_icon} alt="" className="w-4 h-4" />
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent flex-1 outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full hover:opacity-90 transition">
            Send OTP
          </button>
        </form>
      )}

      {/* Step 2: OTP input */}
      {isemailsent && !isotpSubmitted && (
        <form
          onSubmit={onsubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Verify OTP
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
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full hover:opacity-90 transition"
          >
            Submit OTP
          </button>
        </form>
      )}

      {/* Step 3: new password */}
      {isotpSubmitted && isemailsent && (
        <form
          onSubmit={onsubmitPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Set New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password below
          </p>

          <div className="flex items-center gap-2 bg-[#333A5c] px-3 py-2 rounded-md mb-4">
            <img src={assets.lock_icon} alt="" className="w-4 h-4" />
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent flex-1 outline-none text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full hover:opacity-90 transition">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
