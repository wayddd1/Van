import { Link } from "react-router-dom"
import "../styles/home.css"
import Footer from "../components/Footer"
import AlphardHybrid from '../assets/Alphard-Hybrid.png';
import ChevroletExpress from '../assets/Chevrolet-Express-Van.jpg';
import ChryslerPacifica from "../assets/Chrysler-Pacifica.png";
import FordTransit from "../assets/Ford-Transit.png";
import Background from "../assets/Background.png"
export default function Home() {
  const vans = [
    {
      id: 1,
      name: "Alphard Hybrid",
      description:
        "The Toyota Alphard Hybrid blends luxury and fuel efficiency, offering a smooth, quiet ride. Ideal for executive travel or comfortable family trips.",
      price: "From ₱5,500/day",
      image: AlphardHybrid,
    },
    {
      id: 2,
      name: "Chevrolet Express",
      description:
        "A reliable and powerful full-size van, perfect for large groups or long-distance travel with generous cargo space and seating for up to 12.",
      price: "From ₱4,200/day",
      image: ChevroletExpress,
    },
    {
      id: 3,
      name: "Chrysler Pacifica",
      description:
        "A modern and spacious minivan featuring premium interiors, advanced safety tech, and seating for 7—ideal for family getaways or city tours.",
      price: "From ₱3,800/day",
      image: ChryslerPacifica,
    },
    {
      id: 4,
      name: "Ford Transit",
      description:
        "Designed for versatility and comfort, the Ford Transit offers a premium ride with ample space—perfect for corporate events or VIP group travel.",
      price: "From ₱6,000/day",
      image: FordTransit,
    },
  ];
  

  const features = [
    {
      icon: "🚐",
      title: "Diverse Fleet",
      description:
        "Choose from our wide range of well-maintained vans to suit any need, from family trips to cargo transport.",
    },
    {
      icon: "💰",
      title: "Competitive Pricing",
      description:
        "Enjoy the best value with our transparent pricing, no hidden fees, and special discounts for long-term rentals.",
    },
    {
      icon: "🔧",
      title: "24/7 Support",
      description:
        "Our customer service team is available around the clock to assist you with any questions or issues.",
    },
    {
      icon: "📍",
      title: "Convenient Locations",
      description: "Multiple pickup and drop-off points throughout the city, including airport and downtown locations.",
    },
    {
      icon: "📱",
      title: "Easy Booking",
      description: "Book your van in minutes with our simple online booking system, available on any device.",
    },
    {
      icon: "✅",
      title: "Flexible Rental Periods",
      description: "Daily, weekly, and monthly rental options to accommodate your schedule and needs.",
    },
  ]

  const steps = [
    {
      number: "1",
      title: "Choose Your Van",
      description: "Browse our fleet and select the perfect van for your needs based on size, features, and budget.",
      icon: "🔍",
    },
    {
      number: "2",
      title: "Book Online",
      description:
        "Complete our simple booking form with your details, preferred dates, and pickup/drop-off locations.",
      icon: "📅",
    },
    {
      number: "3",
      title: "Confirm Reservation",
      description: "Receive instant confirmation of your booking via email with all the details of your reservation.",
      icon: "📧",
    },
    {
      number: "4",
      title: "Pick Up Your Van",
      description: "Arrive at your chosen location, complete a quick check-in process, and hit the road in your van.",
      icon: "🔑",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Cebu City",
      quote:
        "VanEase made our family road trip so much easier! The van was spotless, comfortable, and the booking process was a breeze.",
      rating: 5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Michael Rodriguez",
      location: "Cebu City",
      quote:
        "As a small business owner, I regularly rent cargo vans from VanEase. Their reliability and customer service are unmatched.",
      rating: 5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Emily Chen",
      location: "Cebu City",
      quote:
        "We rented a luxury van for a weekend getaway with friends. The amenities were fantastic and made our trip truly special.",
      rating: 4,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">Premium Van Rental</h1>
              <h2 className="hero-subtitle">For Every Journey</h2>
              <p className="hero-text">
                Experience comfort and reliability with our modern fleet of vans. Perfect for family trips, business
                needs, or adventure seekers.
              </p>
              <div className="hero-buttons">
                <Link to="/book-van" className="btn btn-primary">
                  Book Now
                </Link>
                <Link to="/van-list" className="btn btn-secondary">
                  View Fleet
                </Link>
              </div>
            </div>
            <img className="hero-image" src={Background} alt="Van rental fleet" style={{width: "100%", height: "100%", objectFit: "fill" }} />
          </div>
        </section>

        {/* Van Fleet Section */}
        <section className="fleet-section">
          <h2 className="section-title">Our Van Fleet</h2>
          <p className="section-subtitle">
            Choose the perfect van for your needs from our diverse and well-maintained fleet
          </p>

          <div className="grid grid-4">
            {vans.map((van) => (
              <div key={van.id} className="card van-card">
                <img src={van.image || "/placeholder.svg"} alt={van.name} className="card-img" style={{width: "100%", height: "100%", objectFit: "contain" }} />
                <div className="card-body van-card-body">
                  <h3 className="card-title">{van.name}</h3>
                  <p className="card-text">{van.description}</p>
                  <div className="van-card-footer">
                    <span className="van-price">{van.price}</span>
                    <button className="btn btn-secondary">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="see-more-container">
            <Link to="/van-list" className="btn btn-primary">
              Explore Our Full Van Collection
            </Link>
          </div>
        </section>

        {/* Why Choose VanEase Section */}
        <section className="features-section">
          <div className="features-container">
            <h2 className="section-title">Why Choose VanEase</h2>
            <p className="section-subtitle">
              We're committed to providing the best van rental experience with quality vehicles and exceptional service
            </p>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="how-it-works-container">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Renting a van with VanEase is quick and easy, following these simple steps
            </p>

            <div className="steps-container">
              {steps.map((step, index) => (
                <div key={index} className="step-card">
                  <div className="step-number-container">
                    <div className="step-number">{step.number}</div>
                    <div className="step-icon">{step.icon}</div>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="steps-cta">
              <Link to="/book-van" className="btn btn-primary">
                Book Your Van Now
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="testimonials-container">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">
              Don't just take our word for it - hear from some of our satisfied customers
            </p>

            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-header">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="testimonial-image"
                    />
                    <div className="testimonial-info">
                      <h3 className="testimonial-name">{testimonial.name}</h3>
                      <p className="testimonial-location">{testimonial.location}</p>
                      <div className="testimonial-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`testimonial-star ${i < testimonial.rating ? "filled" : ""}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

