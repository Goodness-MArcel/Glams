import { useState, useEffect } from "react";
import "./Hero.css";
import img1 from "../../assets/watertable.jpg";
import img2 from "../../assets/water2.jpg";
import img3 from "../../assets/water3.jpg";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const slides = [
    { id: 1, img: img1, alt: "Crystal waterfall" },
    { id: 2, img: img2, alt: "Bottle splash" },
    { id: 3, img: img3, alt: "Ocean waves" },
  ];

  const fullText = "Pure Water. Pure Life.";
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  // Typewriter Effect
  useEffect(() => {
    const handleTyping = () => {
      const currentLength = typedText.length;

      if (!isDeleting && currentLength === fullText.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && currentLength === 0) {
        setIsDeleting(false);
        setCurrentSlide((prev) => (prev + 1) % slides.length); // Next slide when text resets
      }

      const timeout = isDeleting ? deletingSpeed : typingSpeed;
      setTimeout(() => {
        setTypedText((prev) =>
          isDeleting
            ? fullText.substring(0, currentLength - 1)
            : fullText.substring(0, currentLength + 1)
        );
      }, timeout);
    };

    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentSlide]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <section className="hero-carousel min-vh-100 d-flex align-items-center position-relative overflow-hidden">
      {/* Background Carousel */}
      <div className="carousel-background">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            <div className="overlay"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container position-relative z-3">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 text-center text-lg-start">
            <h1 className="display-3 fw-bold text-white mb-4 typewriter-container">
              <span className="typewriter">{typedText}</span>
              <span className="cursor">|</span>
            </h1>
            <p className="lead text-white mb-4 opacity-90">
              Crystal-clear, mineral-balanced, and delivered fresh to your door.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <a href="#contact" className="btn btn-primary btn-lg px-5 shadow-lg" onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
              }}>
                Order Now
              </a>
              <a href="#products" className="btn btn-outline-light btn-lg px-5" onClick={(e) => {
                e.preventDefault();
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
              }}>
                Discover Water
              </a>
            </div>
          </div>
          <div className="col-lg-6 text-center mt-5 mt-lg-0">
            <div className="hero-bottle-wrapper">
              <img
                src="/assets/hero/bottle-premium.png"
                alt="AquaPure Premium Bottle"
                className="img-fluid hero-bottle"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="wave-bottom d-md-none"></div>
    </section>
  );
}