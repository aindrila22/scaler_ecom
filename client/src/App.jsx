import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./components/Home/LandingPage";
import Signup from "./components/auth/Signup";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Upload from "./components/configure/Upload";
import Design from "./components/configure/Design";
import Preview from "./components/configure/Preview";
import Login from "./components/auth/Login";
import Success from "./components/result/Success";
import Cancel from "./components/result/Cancel";
import Dashboard from "./components/admin/Dashboard";
import OrderDetails from "./components/admin/OrderDetails";
import OrderStatus from "./components/status/OrderStatus";
import Profile from "./components/status/Profile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/configure/upload" element={<Upload />} />
        <Route path="/configure/design/:id" element={<Design />} />
        <Route path="/configure/preview/:id" element={<Preview />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/orders/:id" element={<OrderDetails />} />
        <Route path="/customcase/orders/:id" element={<OrderStatus />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;