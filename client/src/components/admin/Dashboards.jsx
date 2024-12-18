import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import MaxWidthWrapper from "../MaxWidthWrapper";
import StatusDropdown from "../StatusDropdown";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [orderSums, setOrderSums] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingSums, setLoadingSums] = useState(true);
  const DAILY_GOAL = 20;
  const WEEKLY_GOAL = 50;
  const MONTHLY_GOAL = 250;

  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await axios.get(`${backendUrl}/api/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchOrderSums = async () => {
      setLoadingSums(true);
      try {
        const response = await axios.get(`${backendUrl}/api/order-sums`);
        setOrderSums(response.data);
      } catch (error) {
        console.error("Error fetching order sums:", error);
      } finally {
        setLoadingSums(false);
      }
    };

    fetchOrderSums();
  }, []);

  //console.log("orders : ",orders)
  //console.log("orderSums : ",orderSums)

  const handleClick = (id) => {
    if (id) {
      navigate(`/dashboard/orders/${id}`);
    }
  };

  if (loadingOrders || loadingSums) {
    return (
      <MaxWidthWrapper>
        <div  className="min-h-screen flex justify-center items-center w-full mx-auto">
        <Loader2 className="animate-spin h-6 w-6 lg:h-10 lg:w-10 text-zinc-500 mb-2" />
        </div>
      </MaxWidthWrapper>
    );
  }
  return (
    <div className="flex min-h-screen w-full bg-muted/40 mb-8 px-5 pt-4">
      <div className="max-w-6xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col lg:gap-16 gap-10">
          <div className="grid gap-4 sm:grid-cols-2 w-full">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Today</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(orderSums.todaySum / 100 || 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(DAILY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((orderSums.todaySum / 100) * 100) / DAILY_GOAL}
                />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Week</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(orderSums.lastWeekSum / 100 || 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(WEEKLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((orderSums.lastWeekSum / 100) * 100) / WEEKLY_GOAL}
                />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Month</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(orderSums.lastMonthSum / 100 || 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(MONTHLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((orderSums.lastMonthSum / 100) * 100) / MONTHLY_GOAL}
                />
              </CardFooter>
            </Card>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>
          <div className="hidden lg:block w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Purchase date
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Amount</TableHead>
                  <TableHead className="text-right">More Info</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.length > 0 &&
                  orders.map((order) => (
                    <TableRow
                      key={order._id}
                      className="bg-accent text-purple-700"
                    >
                      <TableCell>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {order.user?.email || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-gray-400">
                        <StatusDropdown
                          id={order._id}
                          orderStatus={order.deliveryStatus}
                        />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-600">
                        {moment(order.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
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

          <div className="space-y-6 w-full lg:hidden block">
            {orders.length === 0 && (
              <div className="text-center my-10 italic font-semibold">
                No orders till now
              </div>
            )}
            {orders.length > 0 &&
              orders.map((order) => {
                return (
                  <Card key={order._id}>
                    <CardHeader className="pb-2">
                      <CardDescription>
                        <div className="text-sm text-muted-foreground md:inline">
                          {order.user?.email || "N/A"}
                        </div>
                      </CardDescription>

                      <CardTitle className="text-base">
                        {moment(order.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(order.total / 100 || 0)}
                      </div>
                    </CardContent>
                    <CardFooter className="space-x-3">
                      <Button
                        className="cursor-pointer"
                        onClick={() => handleClick(order._id)}
                      >
                        Details
                      </Button>
                      <CardDescription>
                        <StatusDropdown
                          id={order._id}
                          orderStatus={order.deliveryStatus}
                        />
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

export default Dashboard;
