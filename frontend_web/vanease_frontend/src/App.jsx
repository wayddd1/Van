import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles/global.css"
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/van-list" element={<h1>Van List</h1>} />
        <Route path="/book-van" element={<h1>Book a Van</h1>} />
        <Route path="/my-bookings" element={<h1>My Bookings</h1>} />
        <Route path="/login" element={<h1>Login Page</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
