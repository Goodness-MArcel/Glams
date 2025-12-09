// import "./About.css";

export default function About() {
  return (
    <>
      {/* Hero Section */}
     
      {/* Hero Section */}
      <section className="about-hero footer-gradient min-vh-100 d-flex align-items-center position-relative overflow-hidden">
        <div className="container">
          <h1 className="display-4 text-white">About Us</h1>
        </div>
      </section>
      {/* Our Story */}
      <section className="py-6 bg-light">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img
                src="/assets/about/factory.jpg"
                alt="AquaPure purification facility"
                className="img-fluid rounded-3 shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold text-primary mb-4">Our Story</h2>
              <p className="lead text-muted">
                Founded in Lagos with a simple mission: <strong>to make pure water accessible to everyone</strong>.
              </p>
              <p>
                We source from protected underground aquifers, purify through a 9-stage reverse osmosis system, and add back essential minerals for taste and health.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center mb-3">
                  <i className="bi bi-check2-circle text-info me-3"></i>
                  <span>NAFDAC Certified</span>
                </li>
                <li className="d-flex align-items-center mb-3">
                  <i className="bi bi-check2-circle text-info me-3"></i>
                  <span>ISO 22000 Food Safety</span>
                </li>
                <li className="d-flex align-items-center">
                  <i className="bi bi-check2-circle text-info me-3"></i>
                  <span>Daily Lab Testing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-6">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary">Our Core Values</h2>
            <p className="lead text-muted">What drives us every day</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="value-card text-center p-4 h-100">
                <div className="icon-circle mb-3">
                  <i className="bi bi-droplet-fill"></i>
                </div>
                <h5>Purity</h5>
                <p className="small text-muted">Only the cleanest water reaches you.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card text-center p-4 h-100">
                <div className="icon-circle mb-3">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5>Trust</h5>
                <p className="small text-muted">Certified safe. Always.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card text-center p-4 h-100">
                <div className="icon-circle mb-3">
                  <i className="bi bi-truck"></i>
                </div>
                <h5>Convenience</h5>
                <p className="small text-muted">Delivered when you need it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-6 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary">Meet Our Team</h2>
            <p className="lead text-muted">Passionate about pure water</p>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-md-3 col-6">
              <div className="team-card text-center">
                <img src="/assets/team/ceo.jpg" alt="CEO" className="team-img" />
                <h6 className="mt-3 mb-1">Dr. Aisha Bello</h6>
                <p className="text-muted small">Founder & CEO</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="team-card text-center">
                <img src="/assets/team/quality.jpg" alt="Quality" className="team-img" />
                <h6 className="mt-3 mb-1">Engr. Tunde Ade</h6>
                <p className="text-muted small">Head of Quality</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="team-card text-center">
                <img src="/assets/team/ops.jpg" alt="Operations" className="team-img" />
                <h6 className="mt-3 mb-1">Chioma Okeke</h6>
                <p className="text-muted small">Operations Lead</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="team-card text-center">
                <img src="/assets/team/support.jpg" alt="Support" className="team-img" />
                <h6 className="mt-3 mb-1">Kemi Yusuf</h6>
                <p className="text-muted small">Customer Success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 bg-gradient-primary text-white">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready for Pure Water?</h2>
          <p className="lead mb-4 opacity-90">
            Join thousands who trust AquaPure daily.
          </p>
          <a href="#contact" className="btn btn-light btn-lg px-5" onClick={(e) => {
            e.preventDefault();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
          }}>
            Order Now
          </a>
        </div>
      </section>
    </>
  );
}