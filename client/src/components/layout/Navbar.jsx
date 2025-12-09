import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isProductPage = location.pathname === "/products";

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen(!open);

  const handleScroll = (e, sectionId) => {
    e.preventDefault();
    closeMenu();

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="navbar fixed-top bg-white shadow-sm px-3 py-2">
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <a
            className="navbar-brand fw-bold text-primary"
            href="#home"
            onClick={(e) => handleScroll(e, "home")}
          >
            <i className="bi bi-droplet-fill"></i>
            <span className="text-info">Glam</span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="nav-links-desktop d-none d-lg-flex align-items-center gap-4 mb-0">
            {!isProductPage && (
              <>
                <li>
                  <a
                    href="#home"
                    className="nav-link"
                    onClick={(e) => handleScroll(e, "home")}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="nav-link"
                    onClick={(e) => handleScroll(e, "benefits")}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    className="nav-link"
                    onClick={(e) => handleScroll(e, "products")}
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="nav-link"
                    onClick={(e) => handleScroll(e, "testimonials")}
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="nav-link"
                    onClick={(e) => handleScroll(e, "contact")}
                  >
                    Contact
                  </a>
                </li>
              </>
            )}

            {isProductPage && (
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
            )}

            <li>
              <a
                href="#contact"
                className="btn btn-primary px-4"
                onClick={(e) => handleScroll(e, "contact")}
              >
                Order Now
              </a>
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <button
            className={`menu-btn d-lg-none ${open ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar with Close Button */}
      <div className={`side-nav ${open ? "show" : ""}`}>
        {/* Close Button */}
        <button
          className="close-btn"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <ul className="navbar-nav mt-5">
          {!isProductPage && (
            <>
              <li className="nav-item">
                <a
                  onClick={(e) => handleScroll(e, "home")}
                  className="nav-link"
                  href="#home"
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  onClick={(e) => handleScroll(e, "benefits")}
                  className="nav-link"
                  href="#benefits"
                >
                  About
                </a>
              </li>
              <li className="nav-item">
                <a
                  onClick={(e) => handleScroll(e, "products")}
                  className="nav-link"
                  href="#products"
                >
                  Products
                </a>
              </li>
              <li className="nav-item">
                <a
                  onClick={(e) => handleScroll(e, "testimonials")}
                  className="nav-link"
                  href="#testimonials"
                >
                  Testimonials
                </a>
              </li>
              <li className="nav-item">
                <a
                  onClick={(e) => handleScroll(e, "contact")}
                  className="nav-link"
                  href="#contact"
                >
                  Contact
                </a>
              </li>
            </>
          )}
          {isProductPage && (
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
          )}
        </ul>

        <a
          href="#contact"
          className="btn btn-primary w-100 mt-4"
          onClick={(e) => handleScroll(e, "contact")}
        >
          Order Now
        </a>
      </div>

      {/* Overlay */}
      {open && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
}
