import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-gradient text-white py-5 py-lg-6 mt-5">
      <div className="container">
        <div className="row g-4 g-lg-5">

          {/* Brand & Description */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-info fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-droplet-fill"></i> Glams
            </h5>
            <p className="small opacity-90 mb-3">
              Pure water. Pure life. Delivered fresh to your door with love.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-semibold text-info mb-3">
              <i className="bi bi-link-45deg"></i> Quick Links
            </h6>
            <ul className="list-unstyled footer-links small">
              <li>
                <i className="bi bi-chevron-right"></i>
                <a href="/about">About Us</a>
                </li>
              <li> <i className="bi bi-chevron-right"></i>
                <a href="/products">Our Products</a></li>
              <li> <i className="bi bi-chevron-right"></i>
                <a href="/education">Hydration Guide</a></li>
              <li> <i className="bi bi-chevron-right"></i>
                <a href="/contact">Contact Us</a></li>
              <li> <i className="bi bi-chevron-right"></i>
                <a href="/faq">FAQ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6 text-start">
            <h6 className="fw-semibold text-info mb-3">
              <i className="bi bi-truck"></i> Services
            </h6>
            <ul className="list-unstyled footer-links">
              <li>
                 <i className="bi bi-chevron-right"></i><a href="/delivery">Same-Day Delivery</a></li>
              <li>
                 <i className="bi bi-chevron-right"></i><a href="/subscription">Subscription Plans</a></li>
              <li>
                 <i className="bi bi-chevron-right"></i><a href="/wholesale">Wholesale</a></li>
              <li>
                 <i className="bi bi-chevron-right"></i><a href="/corporate">Corporate Orders</a></li>
              <li>
                 <i className="bi bi-chevron-right"></i><a href="/returns">Return Policy</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="col-lg-4 col-md-6 text-start">
            <h6 className="fw-semibold text-info mb-3">
              <i className="bi bi-headset"></i> Get in Touch
            </h6>
            <div className="mb-3 small">
              <p className="mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-telephone"></i> +234 800 123 4567
              </p>
              <p className="mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-envelope"></i> hello@Glams.com
              </p>
              <p className="mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt"></i> Imo State, Nigeria
              </p>
            </div>

            {/* Newsletter */}
            <form className="newsletter-form d-flex flex-column flex-sm-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="form-control form-control-sm"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn-info btn-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="border-secondary opacity-25 my-4" />

        <div className="row align-items-center small">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 opacity-75">
              © {new Date().getFullYear()} Glams. All rights reserved.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            {/* Certifications */}
            <div className="d-inline-flex gap-3 align-items-center">
              <img src="/assets/icons/nafdac.png" alt="NAFDAC Certified" className="cert-icon" />
              <img src="/assets/icons/iso.png" alt="ISO 22000" className="cert-icon" />
              <img src="/assets/icons/halal.png" alt="Halal Certified" className="cert-icon" />
            </div>

            {/* Payment Methods */}
            <div className="d-inline-flex gap-2 ms-3">
              <i className="bi bi-credit-card-2-back-fill text-info"></i>
              <i className="bi bi-paypal text-info"></i>
              <i className="bi bi-bank text-info"></i>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn btn-outline-light btn-sm rounded-pill px-4 back-to-top"
            aria-label="Back to top"
          >
            <i className="bi bi-arrow-up"></i> Top
          </button>
        </div>
      </div>
    </footer>
  );
}