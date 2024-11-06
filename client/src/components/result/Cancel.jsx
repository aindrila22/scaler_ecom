import MaxWidthWrapper from "../MaxWidthWrapper";
import { useLocation } from "react-router-dom";

function Cancel() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      {/* <Steps /> */}
      <h1>Payment Cancel!</h1>
      <p>Your order ID is: {orderId}</p>
    </MaxWidthWrapper>
  );
}

export default Cancel;