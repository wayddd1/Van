import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./app/home"
import VanList from "./app/van-list"
import BookVan from "./app/book-van"
import Login from "./app/login"
import Register from "./app/register"
import Profile from "./app/profile"
import MyBookings from "./app/my-bookings"
import ManagerLogin from "./app/manager-login"
import ManagerDashboard from "./app/manager-dashboard"
import ManagerVans from "./app/manager-vans"
import ManagerBookings from "./app/manager-bookings"
import "./styles/global.css"

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with navbar */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/van-list"
          element={
            <>
              <Navbar />
              <VanList />
            </>
          }
        />
        <Route
          path="/book-van"
          element={
            <>
              <Navbar />
              <BookVan />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <>
              <Navbar />
              <MyBookings />
            </>
          }
        />

        {/* Auth routes without navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager-login" element={<ManagerLogin />} />

        {/* Manager routes with manager navbar */}
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/manager-vans" element={<ManagerVans />} />
        <Route path="/manager-bookings" element={<ManagerBookings />} />
      </Routes>
    </Router>
  )
}
