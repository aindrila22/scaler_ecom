// src/components/auth/Signup.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signupUser,
  verifyOtp,
  resetAuthState,
} from "../../redux/slice/authSlice";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Link } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, message, isOtpSent } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  const handleSignup = () => {
    dispatch(signupUser({ fullName, email }));
  };

  const handleVerifyOtp = async () => {
    const result = await dispatch(verifyOtp({ email, otp }));

    if (result.meta.requestStatus === "fulfilled") {
      const { user } = result.payload;
      localStorage.setItem("token", user.token);
      navigate("/");
    }
  };

  return (
    <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-1 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-14 xl:pt-12 lg:pb-52">
      {!isOtpSent ? (
        <div className="grid place-items-center mx-auto w-full max-w-lg text-lg">
          <h2 className="text-gray-800 text-lg">
            case<span className="text-green-600">cobra</span>
          </h2>
          <h2 className="text-gray-800 text-3xl my-8">Register</h2>
          <input
            type="text"
            className="py-4 px-5 border border-gray-500 rounded-2xl outline-none mt-10 w-full focus:border-2 focus:border-blue-600"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="py-4 px-5 border border-gray-500 rounded-2xl outline-none my-10 w-full focus:border-2 focus:border-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="py-3 px-5 rounded-2xl bg-blue-700 text-lg mb-10 text-white w-full text-center uppercase"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Signup"}
          </button>

          <div>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center mx-auto w-full max-w-lg text-lg">
          <h2 className="text-gray-800 text-lg">
            case<span className="text-green-600">cobra</span>
          </h2>
          <p className="my-7 text-base text-blue-700">{message}</p>
          <h2 className="text-gray-800 text-3xl my-8">Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            className="py-4 px-5 border border-gray-500 rounded-2xl outline-none my-10 w-full focus:border-2 focus:border-blue-600"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="py-3 px-5 rounded-2xl bg-blue-700 text-lg mb-10 text-white w-full text-center uppercase"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default Signup;
