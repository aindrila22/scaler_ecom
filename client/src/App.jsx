import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./components/Home/LandingPage";
import Signup from "./components/auth/Signup";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;