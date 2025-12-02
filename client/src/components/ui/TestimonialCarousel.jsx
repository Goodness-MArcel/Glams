export default function TestimonialCarousel() {
  const testimonials = [
    { text: "Best water I've ever tasted. Crystal clear and refreshing!", author: "Sarah M., Lagos" },
    { text: "Reliable delivery and premium quality. Highly recommend!", author: "John D., Abuja" }
  ];

  return (
    <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {testimonials.map((t, i) => (
          <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
            <div className="text-center px-5">
              <p className="lead fst-italic">"{t.text}"</p>
              <p className="fw-bold mt-3">— {t.author}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}