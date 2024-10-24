import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { buttonVariants } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "@/redux/slice/modalSlice";
import { Link } from "react-router-dom";

const LoginModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);

  const setIsOpen = (open) => {
    dispatch(toggleModal(open));
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999999] bg-white text-gray-900">
        <DialogHeader>
          <div className="relative mx-auto w-24 h-24 mb-2">
            <img
              src="/snake-1.png"
              alt="snake image"
              className="object-contain"
            />
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            Log in to continue
          </DialogTitle>
          <DialogDescription className="text-base text-center py-2">
            <span className="font-medium text-zinc-900">
              Your configuration was saved!
            </span>{" "}
            Please login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <Link to="/login" className={buttonVariants({ variant: "outline" })}>
            Login
          </Link>
          <Link to="/signup" className={buttonVariants({ variant: "default" })}>
            Sign up
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
