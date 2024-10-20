import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const Phone = ({ imgSrc, dark = false, className, ...props }) => {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      <img
        src={
          dark
            ? "/phone-template-dark-edges.png"
            : "/phone-template-white-edges.png"
        }
        className="pointer-events-none z-50 select-none"
        alt="phone"
      />
      <div className="absolute -z-10 inset-0">
        <img className="object-cover w-full h-full" src={imgSrc} alt="pic" />
      </div>
    </div>
  );
};

Phone.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  dark: PropTypes.bool,
  className: PropTypes.string,
};

export default Phone;
