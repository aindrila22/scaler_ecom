import MaxWidthWrapper from "../MaxWidthWrapper";
import PropTypes from "prop-types";
import Steps from "../Steps";

const Layout = ({ children }) => {
  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
