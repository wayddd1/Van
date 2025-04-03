import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./app/home"
import VanList from "./app/van-list"
import BookVan from "./app/book-van"
import MyBookings from "./app/my-bookings"
import Login from "./app/Login"
import Register from "./app/register"
import Profile from "./app/Profile"
import "./styles/global.css"

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Login />} /> {/* Default to Login page */}
            <Route path="/home" element={<Home />} />
            <Route path="/van-list" element={<VanList />} />
            <Route path="/book-van" element={<BookVan />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

          </Routes>
        </main>
      </div>
    </Router>
  )
}
