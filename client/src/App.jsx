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
        <Route path="/success?order_id=:id" element={<Success />} />
        <Route path="/cancel?order_id=:id" element={<Cancel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;