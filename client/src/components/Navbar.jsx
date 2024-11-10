import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserDetails } from "@/redux/slice/userSlice";


const Navbar = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  console.log(userInfo);
  const isAdmin =
    userInfo && userInfo.email === import.meta.env.VITE_APP_ADMIN_EMAIL;
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/95 text-gray-600 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex justify-between items-center h-14 border-b border-zinc-200">
          <Link to="/" className="flex z-40 font-semibold lg:text-lg italic">
            case<span className="text-purple-400">craze</span>
          </Link>
          <div className="h-full flex items-center space-x-4">
            {userInfo !== null ? (
              <>
                <Link to="/profile"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Profile
                </Link>
                
                {isAdmin ? (
                  <Link
                   to="/dashboard"
                    href={"#"}
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard
                  </Link>
                ) : null}
                <Link
                  to="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    variant: "green",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign up
                </Link>

                <Link
                  to="/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login
                </Link>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
                <Link
                  to="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    variant: "green",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
