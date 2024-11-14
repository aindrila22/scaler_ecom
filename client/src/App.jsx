import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MaxWidthWrapper from "./components/MaxWidthWrapper";

// Use lazy loading for routes
const LandingPage = lazy(() => import("./components/Home/LandingPage"));
const Signup = lazy(() => import("./components/auth/Signup"));
const NotFound = lazy(() => import("./components/NotFound"));
const Upload = lazy(() => import("./components/configure/Upload"));
const Design = lazy(() => import("./components/configure/Design"));
const Preview = lazy(() => import("./components/configure/Preview"));
const Login = lazy(() => import("./components/auth/Login"));
const Success = lazy(() => import("./components/result/Success"));
const Cancel = lazy(() => import("./components/result/Cancel"));
const Dashboard = lazy(() => import("./components/admin/Dashboards"));
const OrderDetails = lazy(() => import("./components/admin/OrderDetails"));
const OrderStatus = lazy(() => import("./components/status/OrderStatus"));
const Profile = lazy(() => import("./components/status/Profile"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense
        fallback={
          <MaxWidthWrapper>
            <div className="my-40 flex justify-center items-center w-full mx-auto">
            <img className="w-40 h-28" src="/animation.gif" />
            </div>
          </MaxWidthWrapper>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/configure/upload" element={<Upload />} />
          <Route path="/configure/design/:id" element={<Design />} />
          <Route path="/configure/preview/:id" element={<Preview />} />
          <Route path="/success/:id" element={<Success />} />
          <Route path="/cancel/:id" element={<Cancel />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/orders/:id" element={<OrderDetails />} />
          <Route path="/customcase/orders/:id" element={<OrderStatus />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
