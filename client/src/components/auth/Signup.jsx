// src/components/auth/Signup.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUser,
  verifyOtp,
  resetAuthState,
} from "../../redux/slice/authSlice";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserDetails } from "@/redux/slice/userSlice";
import { toast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { loading, message, isOtpSent } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  const handleSignup = () => {
    dispatch(signupUser({ fullName, email }));
  };

  const handleBackNavigation = () => {
    const previousUrl = sessionStorage.getItem("redirectAfterLogin");
    console.log("url", previousUrl);

    const targetUrls = [
      "/configure/upload",
      "/configure/design/",
      "/configure/preview/",
    ];
    const matches = targetUrls.some((targetUrl) =>
      previousUrl.includes(targetUrl)
    );

    if (matches) {
      navigate(`${previousUrl}`);
    } else {
      navigate(`/`);
      console.log("matches not");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const result = await dispatch(verifyOtp({ email, otp }));

    if (result.meta.requestStatus === "fulfilled") {
      const { user } = result.payload;
      localStorage.setItem("token", user.token);
      dispatch(fetchUserDetails());
      toast({
        title: "Welcome Aboard!",
        description: "Your account is ready! Dive in and explore all the features we have to offer.",
      });
      handleBackNavigation();
    }
  };

  return (
    <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-1 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-14 xl:pt-12 lg:pb-52">
      {!isOtpSent ? (
        <div className="grid place-items-center mx-auto w-full max-w-lg text-lg">
          <h2 className="text-gray-800 text-lg">
            case<span className="text-purple-400">craze</span>
          </h2>
          <h2 className="text-gray-800 text-3xl my-8">Register</h2>
          <input
            type="text"
            className="py-4 px-5 border border-gray-500 rounded-2xl outline-none mt-10 w-full text-gray-700 focus:border-2 focus:border-primary"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="py-4 px-5 border border-gray-500 rounded-2xl outline-none my-10 w-full focus:border-2 text-gray-700 focus:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="py-3 px-5 rounded-2xl bg-primary text-lg mb-10 text-white w-full text-center uppercase"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Signup"}
          </button>

          <div className="text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold">
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center mx-auto w-full max-w-lg text-lg">
          <h2 className="text-gray-800 text-lg">
            case<span className="text-purple-400">craze</span>
          </h2>
          <p className="my-7 text-base text-primary">{message}</p>
          <h2 className="text-gray-800 text-3xl my-8">Enter OTP</h2>
          <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <button
          className="py-2 px-5 rounded-2xl bg-primary text-lg my-10 text-white w-full text-center uppercase"
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
