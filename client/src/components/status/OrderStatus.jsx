import { useParams } from "react-router-dom";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { useEffect, useState } from "react";
import Phone from "../Phone";
import { backendUrl, cn, formatPrice } from "@/lib/utils";
import axios from "axios";
import { Check, Loader2 } from "lucide-react";
import { COLORS } from "@/lib/validators";
import moment from "moment";

const getStatusColor = (status) => {
    switch (status) {
      case "awaiting_shipment":
        return "bg-yellow-500";
      case "fulfilled":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };
  
  const getStatusDefinition = (status) => {
    switch (status) {
      case "awaiting_shipment":
        return "Order Received.";
      case "fulfilled":
        return "Dispatched";
      case "shipped":
        return "Delivered";
      default:
        return "Order Received.";
    }
  };
  

const OrderStatus = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (id) {
          const response = await axios.get(`${backendUrl}/api/order/${id}`);
          setOrderDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  //console.log(orderDetails);

  let tw = null;

  if (orderDetails && orderDetails.details.color) {
    const matchedColor = COLORS.find(
      (supportedColor) => supportedColor.value === orderDetails.details.color
    );
    tw = matchedColor ? matchedColor.tw : null;
  }

  if (loading) {
    return (
      <MaxWidthWrapper>
        <div className="min-h-screen flex justify-center items-center w-full mx-auto">
        <Loader2 className="animate-spin h-6 w-6 lg:h-10 lg:w-10 text-zinc-500 mb-2" />
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    !loading && (
      <MaxWidthWrapper className="flex-1 flex flex-col">
        <>
          <div className="mt-20 flex flex-col items-center lg:items-start md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-20 place-items-start">
            <div className="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2">
              <Phone
                className={cn(`${tw}`, "max-w-[150px] md:max-w-full")}
                imgSrc={orderDetails.details.imageUrl}
              />
            </div>

            <div className="my-6 sm:col-span-9 md:row-end-1">
              <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                {orderDetails.details.model} Case
              </h3>
              <div className="mt-3 flex items-center gap-1.5 text-base text-zinc-700">
                <Check className="h-4 w-4" />
                Order by <b>{orderDetails.user.fullName}</b>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-base text-zinc-700">
                <Check className="h-4 w-4" />
                Order received at <b> {moment(orderDetails.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</b>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-base text-zinc-700">
                <Check className="h-4 w-4" />
                Delivery Status :
                <span
                  className={`capitalize text-white px-4 py-2 rounded-md ${getStatusColor(
                    orderDetails.deliveryStatus
                  )}`}
                >
                  {getStatusDefinition(orderDetails.deliveryStatus)}
                </span>
              </div>
            </div>

            <div className="sm:col-span-12 md:col-span-9 text-base">
              <div className="grid grid-cols-2 gap-x-6 border-b border-zinc-200 py-10 text-base">
                <div>
                  <p className="font-medium text-zinc-900">Payment status</p>
                  <p className="mt-2 text-green-500">Paid</p>
                </div>

                <div>
                  <p className="font-medium text-zinc-900">Customer Email</p>
                  <p className="mt-2 text-zinc-700">
                    Email: <span className="text-primary">{orderDetails.user.email}</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                <div>
                  <p className="font-medium text-zinc-950">Order Details</p>
                  <ol className="mt-3 text-zinc-700 list-disc list-inside">
                    <li>
                      <b>MODEL :</b> {orderDetails.details.model}
                    </li>
                    <li>
                      <b>FINISH :</b> {orderDetails.details.finish}
                    </li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium text-zinc-950">Materials</p>
                  <ol className="mt-3 text-zinc-700 list-disc list-inside">
                    <li>
                      <b>MATERIAL : </b>
                      {orderDetails.details.material}
                    </li>
                    <li>
                      <b>COLOR : </b>
                      {orderDetails.details.color}
                    </li>
                  </ol>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 py-10 text-base">
                <div>
                  <p className="font-medium text-gray-900">Shipping address</p>
                  <div className="mt-2 text-zinc-700">
                    <address className="not-italic">
                      <span className="block">
                        {orderDetails.shippingAddress.line1 ?? ""}
                      </span>
                      <span className="block">
                        {orderDetails.shippingAddress.line2 ?? ""}
                      </span>
                      <span className="block">
                        {orderDetails.shippingAddress.postal_code ?? ""}{" "}
                        {orderDetails.shippingAddress.city ?? ""}
                      </span>
                      <span className="block">
                        {orderDetails.shippingAddress.state ?? ""}{" "}
                        {orderDetails.shippingAddress.country ?? ""}
                      </span>
                    </address>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Billing address</p>
                  <div className="mt-2 text-zinc-700">
                    <address className="not-italic">
                      <span className="block">
                        {orderDetails.billingAddress.line1 ?? ""}
                      </span>
                      <span className="block">
                        {orderDetails.billingAddress.line2 ?? ""}
                      </span>
                      <span className="block">
                        {orderDetails.billingAddress.postal_code ?? ""}{" "}
                        {orderDetails.billingAddress.city ?? ""}
                      </span>
                      <span className="block">
                        {orderDetails.billingAddress.state ?? ""}{" "}
                        {orderDetails.billingAddress.country ?? ""}
                      </span>
                    </address>
                  </div>
                </div>
              </div>

              <div className="my-8">
                <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
                  <div className="flow-root text-base">
                    <div className="flex items-center justify-between py-1 mt-2">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium text-gray-900">
                        {formatPrice(orderDetails.subtotal / 100)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between py-1 mt-2">
                      <p className="text-gray-600">Shipping</p>
                      <p className="font-medium text-gray-900">
                        {formatPrice(orderDetails.deliveryCharge / 100)}
                      </p>
                    </div>

                    <div className="my-2 h-px bg-gray-200" />

                    <div className="flex items-center justify-between py-2">
                      <p className="font-semibold text-gray-900">Order total</p>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(orderDetails.total / 100)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </MaxWidthWrapper>
    )
  );
};

export default OrderStatus;
