
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initiateLogin,
  verifyLoginOtp,
  resetLoginState,
} from "../../redux/slice/loginSlice";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Link } from "react-router-dom";
import { fetchUserDetails } from "@/redux/slice/userSlice";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { loading, message, isOtpSent } = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(resetLoginState());
  }, [dispatch]);

  const handleSignup = () => {
    dispatch(initiateLogin({ email }));
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const result = await dispatch(verifyLoginOtp({ email, otp }));

    if (result.meta.requestStatus === "fulfilled") {

      const { user } = result.payload;
      localStorage.setItem("token", user.token);
      dispatch(fetchUserDetails());
      toast({
        title: `Login Successful`,
        description: `Welcome back! Your account is ready. Let's continue exploring.`,
      });
      window.history.back();

    }
  };

  return (
    <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-1 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-14 xl:pt-12 lg:pb-52">
      {!isOtpSent ? (
        <div className="grid place-items-center mx-auto w-full max-w-lg text-lg">
          <h2 className="text-gray-800 text-lg">
            case<span className="text-purple-400">craze</span>
          </h2>
          <h2 className="text-gray-800 text-3xl my-8">Login</h2>

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
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div>
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center mx-auto w-full max-w-lg text-lg">
          <h2 className="text-gray-800 text-lg">
            case<span className="text-purple-400">craze</span>
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

export default Login;
