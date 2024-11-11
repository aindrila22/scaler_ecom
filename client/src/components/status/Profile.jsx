import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backendUrl, formatPrice } from "@/lib/utils";
import axios from "axios";

import { useEffect, useState } from "react";
import moment from "moment";
import { Button, buttonVariants } from "../ui/button";
import { useNavigate } from "react-router-dom";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { clearUser } from "@/redux/slice/userSlice";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";

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

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoadingUser(true);
      try {
        const response = await axios.get(`${backendUrl}/auth/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserDetails();
  }, []);

  console.log(user);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/orders/user/${user._id}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleClick = (id) => {
    if (id) {
      navigate(`/customcase/orders/${id}`);
    }
  };

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
  if (loadingOrders || loadingUser) {
    return (
      <MaxWidthWrapper>
        <div className="my-40 flex justify-center items-center w-full mx-auto">
          <iframe
            className="w-80 h-80"
            src="https://lottie.host/embed/d43ddc52-c9ae-4c65-9a97-f935f4a6e1af/Mn4tT8TE6k.json"
          ></iframe>
        </div>
      </MaxWidthWrapper>
    );
  }
  return (
    <div className="flex min-h-screen w-full bg-muted/40 mb-8">
      <div className="max-w-6xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl">{user.fullName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </CardContent>
              <CardFooter>
                <div
                  onClick={handleLogout}
                  className={buttonVariants({
                    size: "sm",
                    variant: "secondary",
                  })}
                >
                  Sign out
                </div>
              </CardFooter>
            </Card>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Orders Placed</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchase date</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">Model</TableHead>
                <TableHead className="hidden sm:table-cell">Amount</TableHead>
                <TableHead className="text-right">More Info</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.length < 0 && (
                <div className="flex justify-center items-center my-10 w-full">
                  No orders till now
                </div>
              )}
              {orders.length > 0 &&
                orders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="bg-accent text-purple-700"
                  >
                    <TableCell>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {moment(order.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-gray-400">
                      <span
                        className={`capitalize text-white px-4 py-2 rounded-md ${getStatusColor(
                          order.deliveryStatus
                        )}`}
                      >
                        {getStatusDefinition(order.deliveryStatus)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-600">
                      {order.details.model}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-400 font-bold">
                      {formatPrice(order.total / 100 || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        className="cursor-pointer"
                        onClick={() => handleClick(order._id)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
