import PropTypes from 'prop-types';
import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20 ",
        className
      )}
    >
      {children}
    </div>
  );
};

MaxWidthWrapper.propTypes = {
  className: PropTypes.string, 
  children: PropTypes.node,
};

export default MaxWidthWrapper;