import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "./ui/dialog";
  import { buttonVariants } from "./ui/button";
  import { useDispatch } from "react-redux";
  import { toggleModal } from "@/redux/slice/modalSlice";
  import { useNavigate } from "react-router-dom";
  import PropTypes from "prop-types";
import axios from "axios";
import { backendUrl } from "@/lib/utils";
import { clearUser } from "@/redux/slice/userSlice";
import { toast } from "@/hooks/use-toast";
  
  const LogoutModal = ({isOpen, onClose}) => {
    const dispatch = useDispatch();
  
  
    const handleClose = () => {
      // Close modal by setting isOpen to false
      dispatch(toggleModal(false));
      onClose();
    };
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
          await axios.post(`${backendUrl}/auth/logout`, null, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          dispatch(clearUser());
          localStorage.removeItem("token");
          toast({
            title: "You are logged out",
            description: "To access your profile login again.",
            variant: "normal",
          });
          navigate(`/`);
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };
  
    return (
      <Dialog onOpenChange={handleClose} open={isOpen}>
        <DialogContent className="absolute z-[9999999] bg-white text-gray-900">
          <DialogHeader>
            <div className="relative mx-auto w-24 h-12 mb-10">
              <img
                src="/snake-3.png"
                alt="snake image"
                className="object-contain"
              />
            </div>
            <DialogTitle className="text-xl text-center  font-bold tracking-tight text-gray-900 pt-7">
              Are you sure you want to log out?
            </DialogTitle>
          </DialogHeader>
  
          <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200 mt-6">
            <div onClick={handleLogout} className={buttonVariants({ variant: "outline" })}>
              Yes
            </div>
            <div onClick={handleClose}  className={buttonVariants({ variant: "default" })}>
              No
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  LogoutModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  
  export default LogoutModal;
  