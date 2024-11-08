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
import { formatPrice } from "@/lib/utils";
// import StatusDropdown from './StatusDropdown'
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2500;
  let lastWeekSum = 0;
  let lastMonthSum = 0;

  useEffect(() => {
    // Assuming you're fetching orders from an API, replace with actual data fetching if necessary
    const fetchOrders = async () => {
      const fetchedOrders = [
        {
          _id: { $oid: "672e23c073b809f67af1e9f2" },
          user: { email: "example@example.com" },
          details: {
            finish: "smooth",
            material: "silicone",
            color: "black",
            model: "iphonex",
            imageUrl:
              "https://res.cloudinary.com/djlnm017j/image/upload/v1731075802/uploads/euleonsd5opr3preuqv2.png",
          },
          subtotal: 100,
          deliveryCharge: 100,
          total: 200,
          status: "completed",
          createdAt: new Date(1731075810376),
          billingAddress: {
            line1: "41/B Nazirlane near Evergreen club, Watgunj ,Khidderpore",
            line2: null,
            city: "kolkata",
            state: "WB",
            postal_code: "700023",
            country: "IN",
          },
          shippingAddress: {
            name: "John Doe",
            line1: "41/B Nazirlane near Evergreen club, Watgunj ,Khidderpore",
            line2: null,
            city: "kolkata",
            state: "WB",
            postal_code: "700023",
            country: "IN",
          },
        },


      ];
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Week</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastWeekSum || 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(WEEKLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={(lastWeekSum * 100) / WEEKLY_GOAL} />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Month</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastMonthSum || 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(MONTHLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={(lastMonthSum * 100) / MONTHLY_GOAL} />
              </CardFooter>
            </Card>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Purchase date
                </TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id.$oid} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">
                      {order.shippingAddress?.name || "N/A"}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.user?.email || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {/* <StatusDropdown id={order._id.$oid} orderStatus={order.status} /> */}
                    {order.status}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(order.total || 0)}
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

export default Dashboard;
