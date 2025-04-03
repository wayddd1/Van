import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"
import Home from "./home"
import VanList from "./van-list"
import BookVan from "./book-van"
import MyBookings from "./my-bookings"

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/van-list" element={<VanList />} />
        <Route path="/book-van" element={<BookVan />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  )
}

