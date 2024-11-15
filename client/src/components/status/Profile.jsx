import {
  Card,
  CardContent,
  CardDescription,
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
import LogoutModal from "../LogoutModal";
import { Loader2 } from "lucide-react";


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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  if (loadingOrders || loadingUser) {
    return (
      <MaxWidthWrapper>
        <div className="min-h-screen flex justify-center items-center w-full mx-auto">
        <Loader2 className="animate-spin h-6 w-6 lg:h-10 lg:w-10 text-zinc-500 mb-2" />
        </div>
      </MaxWidthWrapper>
    );
  }
  return (
    <div className="flex min-h-screen w-full bg-muted/40 mb-8 px-5 pt-5">
      <div className="max-w-6xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4 ">
        <div className="flex flex-col lg:gap-16 gap-6">
          <div className="grid gap-4 sm:grid-cols-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl lg:text-4xl">{user.fullName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </CardContent>
              <CardFooter>
                <div
                  onClick={()=>setIsLoginModalOpen(true)}
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
          <LogoutModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />

          <h1 className="text-4xl font-bold tracking-tight">Orders Placed</h1>

          <Table className="hidden lg:block">
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

          <div className="space-y-6">
            {orders.map((order) => {
              return (
                <Card key={order._id}>
                  <CardHeader className="pb-2">
                    <CardDescription>
                    {moment(order.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                    </CardDescription>
                    
                    <CardTitle className="text-base">
                    <div className="text-sm text-muted-foreground">
                    {order.details.model}
                    </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                  
                    {formatPrice(order.total / 100 || 0)}
                  </CardContent>
                  <CardFooter className="space-x-3">
                  <Button
                        className="cursor-pointer"
                        onClick={() => handleClick(order._id)}
                      >
                        Details
                      </Button>
                    <CardDescription>
                    <span
                        className={`capitalize text-white px-4 py-2 rounded-md ${getStatusColor(
                          order.deliveryStatus
                        )}`}
                      >
                        {getStatusDefinition(order.deliveryStatus)}
                      </span>
                    </CardDescription>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
