import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

export default function TestimonialCarousel() {
  const testimonials = [
    { 
      text: "Best water I've ever tasted. Crystal clear and refreshing! The delivery is always on time and the quality is consistently excellent.", 
      author: "Sarah M.", 
      location: "Lagos",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b587?w=150&h=150&fit=crop&crop=face"
    },
    { 
      text: "Reliable delivery and premium quality. Highly recommend! My family has been using this service for over a year now.", 
      author: "John D.", 
      location: "Abuja",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      text: "The purity and taste are unmatched. I can really feel the difference in my daily hydration. Excellent customer service too!",
      author: "Amina K.",
      location: "Kano",
      rating: 5,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    {
      text: "Perfect for our office needs. The bulk delivery service is efficient and the water quality is exceptional. Highly satisfied!",
      author: "Michael O.",
      location: "Port Harcourt",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      text: "Clean, fresh, and delivered right to my doorstep. The mineral balance is perfect and my children love the taste!",
      author: "Fatima A.",
      location: "Kaduna",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      text: "Outstanding water quality and exceptional service. The subscription model makes it so convenient for our household.",
      author: "David I.",
      location: "Ibadan",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      text: "Pure, refreshing, and always delivered fresh. The 5-liter bottles are perfect for our family of six. Great value for money!",
      author: "Grace N.",
      location: "Enugu",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      text: "The best investment in our health. Crystal clear water with the perfect mineral content. Customer support is also excellent!",
      author: "Emmanuel C.",
      location: "Calabar",
      rating: 5,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i key={index} className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}></i>
    ));
  };

  return (
    <div className="testimonial-carousel-wrapper">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        effect="coverflow"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        loop={true}
        className="testimonial-swiper"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="testimonial-card bg-white rounded-4 p-4 shadow-sm h-100">
              <div className="text-center mb-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="rounded-circle mb-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div className="mb-2">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              
              <blockquote className="text-center mb-3">
                <p className="fst-italic text-muted mb-0">
                  "{testimonial.text}"
                </p>
              </blockquote>
              
              <div className="text-center">
                <h6 className="mb-0 fw-bold" style={{ color: '#005f73' }}>{testimonial.author}</h6>
                <small className="text-muted">
                  <i className="bi bi-geo-alt" style={{ color: '#2cc0e0' }}></i> {testimonial.location}
                </small>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="swiper-button-prev-custom testimonial-nav-btn">
        <i className="bi bi-chevron-left"></i>
      </div>
      <div className="swiper-button-next-custom testimonial-nav-btn">
        <i className="bi bi-chevron-right"></i>
      </div>

      <style jsx>{`
        .testimonial-carousel-wrapper {
          position: relative;
          padding: 2rem 0;
        }
        
        .testimonial-swiper {
          padding: 2rem 0 3rem 0;
        }
        
        .testimonial-card {
          min-height: 320px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(44, 192, 224, 0.15) !important;
          border-color: rgba(44, 192, 224, 0.3);
        }
        
        .testimonial-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2cc0e0, #005f73);
          color: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(44, 192, 224, 0.3);
        }
        
        .testimonial-nav-btn:hover {
          transform: translateY(-50%) scale(1.1);
          background: linear-gradient(135deg, #005f73, #003040);
          box-shadow: 0 8px 25px rgba(44, 192, 224, 0.4);
        }
        
        .swiper-button-prev-custom {
          left: -25px;
        }
        
        .swiper-button-next-custom {
          right: -25px;
        }
        
        .testimonial-nav-btn i {
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .swiper-button-prev-custom {
            left: 10px;
          }
          
          .swiper-button-next-custom {
            right: 10px;
          }
          
          .testimonial-nav-btn {
            width: 40px;
            height: 40px;
          }
          
          .testimonial-nav-btn i {
            font-size: 1rem;
          }
          
          .testimonial-card {
            min-height: 280px;
          }
        }
        
        /* Custom pagination styles */
        :global(.swiper-pagination-bullet) {
          background: #2cc0e0;
          opacity: 0.3;
        }
        
        :global(.swiper-pagination-bullet-active) {
          background: #005f73;
          opacity: 1;
          transform: scale(1.2);
        }
        
        /* Coverflow effect customization */
        :global(.swiper-slide-shadow-left),
        :global(.swiper-slide-shadow-right) {
          background-image: linear-gradient(to right, rgba(44, 192, 224, 0.5), rgba(0, 95, 115, 0.3));
        }
      `}</style>
    </div>
  );
}