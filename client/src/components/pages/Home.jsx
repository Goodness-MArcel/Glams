import Hero from '../ui/Hero';
import BenefitCard from '../ui/BenefitCard';
import ProductCard from '../ui/ProductCard';
import TestimonialCarousel from '../ui/TestimonialCarousel';
import { useInView } from 'react-intersection-observer';
import bottle1 from '../../assets/bottle1.jpg';
import bottle2 from '../../assets/bottle2.jpg';
import img1 from "../../assets/watertable.jpg";


export default function Home() {
    const { ref: productsRef, inView: productsInView } = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    return (
        <>
            {/* Hero Section */}
            <section id="home">
                <Hero />
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="benefits-classic py-6 py-lg-7">
                <div className="container">
                    <div className="row justify-content-center g-4 g-xl-5 text-center">
                        <div className="col-md-4">
                            <BenefitCard
                                icon="bi-droplet-fill"
                                title="Ultra-Purified"
                                text="9-stage reverse osmosis + UV sterilization"
                            />
                        </div>
                        <div className="col-md-4">
                            <BenefitCard
                                icon="bi-shield-check"
                                title="100% Safe"
                                text="Tested daily for purity and safety"
                            />
                        </div>
                        <div className="col-md-4">
                            <BenefitCard
                                icon="bi-truck"
                                title="Fast Delivery"
                                text="Same-day service in your city"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="premium-range py-6 py-lg-7 bg-gradient-light" ref={productsRef}>
                <div className="container">
                    <div className={`text-center mb-5 ${productsInView ? 'animate-fade-up' : ''}`} style={{ animationDelay: '0.1s' }}>
                        <h2 className="display-5 fw-bold text-primary mb-3">Our Premium Range</h2>
                        <p className="lead text-muted">Pure, balanced, and delivered fresh</p>
                    </div>

                    <div className="row g-4 g-xl-5 justify-content-center">
                        <div className={`col-md-4 ${productsInView ? 'animate-fade-up' : ''}`} style={{ animationDelay: '0.2s' }}>
                            <ProductCard
                                img={bottle1}
                                title="500ml"
                                desc="Perfect for on-the-go hydration"
                                price="$1.50"
                            />
                        </div>
                        <div className={`col-md-4 ${productsInView ? 'animate-fade-up' : ''}`} style={{ animationDelay: '0.3s' }}>
                            <ProductCard
                                img={bottle2}
                                title="1 Liter"
                                desc="Ideal for family and daily use"
                                price="$2.80"
                            />
                        </div>
                        <div className={`col-md-4 ${productsInView ? 'animate-fade-up' : ''}`} style={{ animationDelay: '0.4s' }}>
                            <ProductCard
                                img={bottle1}
                                title="5 Liters"
                                desc="Bulk pack for home & office"
                                price="$8.00"
                            />
                        </div>
                    </div>

                    <div className="text-center mt-5">
                       <button 
                        className="btn btn-lg px-5" 
                        onClick={() => alert('Order form coming soon!')}
                        style={{
                            background: 'linear-gradient(135deg, #2cc0e0, #005f73)',
                            border: 'none',
                            color: '#e0f2fe',
                            fontWeight: '600',
                            borderRadius: '50px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(44, 192, 224, 0.3)'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #005f73, #003040)';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(44, 192, 224, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #2cc0e0, #005f73)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(44, 192, 224, 0.3)';
                        }}
                    >
                        Order Now
                    </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-hero mt-5  min-vh-100">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <img
                                src={img1}
                                alt="AquaPure purification facility"
                                className="img-fluid rounded-3 shadow"
                            />
                        </div>
                        <div className="col-lg-6">
                            <h2 className="display-5 fw-bold mb-4">Our Story</h2>
                            <p className="lead">
                                Founded with a simple mission: <strong>to make pure water accessible to everyone</strong>.
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
           


            {/* Testimonials Section */}
            <section id="testimonials" className="py-6 bg-light">
                <div className="container">
                    <h2 className="text-center mb-5 display-5 fw-bold">What Our Customers Say</h2>
                    <TestimonialCarousel />
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-6 text-white">
                <div className="container text-center">
                    <h2 className="display-5 fw-bold mb-4">Ready for Pure Water?</h2>
                    <p className="lead mb-4 opacity-90">
                        Join thousands who trust our service daily.
                    </p>
                    <button 
                        className="btn btn-lg px-5" 
                        onClick={() => alert('Order form coming soon!')}
                        style={{
                            background: 'linear-gradient(135deg, #2cc0e0, #005f73)',
                            border: 'none',
                            color: '#e0f2fe',
                            fontWeight: '600',
                            borderRadius: '50px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(44, 192, 224, 0.3)'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #005f73, #003040)';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(44, 192, 224, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #2cc0e0, #005f73)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(44, 192, 224, 0.3)';
                        }}
                    >
                        Order Now
                    </button>
                </div>
            </section>
        </>
    );
}