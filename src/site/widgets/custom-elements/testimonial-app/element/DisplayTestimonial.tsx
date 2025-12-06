import React, { useState, useEffect, useRef, useCallback } from "react";

// FILE: src/styles/GlobalStyles.js
// সমস্ত CSS এখানে একটি কম্পোনেন্টে রাখা হয়েছে।
const GlobalStyles = () => (
  <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }
        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:
                radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 50%);
            pointer-events: none;
        }
        .container {
            max-width: 1200px;
            width: 100%;
            text-align: center;
        }
        .header {
            margin-bottom: 60px;
            position: relative;
        }
        .header::before {
            content: '✨';
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 2rem;
            animation: twinkle 2s ease-in-out infinite;
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
            50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
        }
        .header h1 {
            font-size: 3.5rem;
            font-weight: 800;
            color: white;
            margin-bottom: 16px;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            background: linear-gradient(135deg, #ffffff, #f0f9ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.2rem;
            font-weight: 400;
            margin-bottom: 12px;
        }
        .stats-bar {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 20px;
        }
        .stat-item {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.95rem;
        }
        .stat-number {
            font-weight: 700;
            font-size: 1.1rem;
            color: #fbbf24;
        }
        .carousel-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 32px;
            padding: 50px 40px 40px;
            box-shadow:
                0 25px 80px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
        }
        .carousel-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
            background-size: 400% 400%;
            animation: gradientFlow 6s ease infinite;
        }
        @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .carousel-wrapper {
            position: relative;
            overflow: hidden;
        }
        .carousel-track {
            display: flex;
            gap: 24px;
        }
        .testimonial-card {
            flex: 0 0 calc(100% / 3 - 16px);
            background: linear-gradient(135deg, #f8fafc, #ffffff);
            border-radius: 20px;
            padding: 32px 24px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            position: relative;
            overflow: hidden;
        }
        .testimonial-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        .testimonial-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
        }
        .testimonial-card:hover::before {
            transform: scaleX(1);
        }
        .testimonial-card.center {
            transform: scale(1.05);
            z-index: 2;
            box-shadow: 0 15px 60px rgba(102, 126, 234, 0.2);
        }
        .user-info {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            gap: 16px;
        }
        .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 3px solid #667eea;
            object-fit: cover;
            transition: all 0.3s ease;
            position: relative;
        }
        .user-avatar::after {
            content: '✓';
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 20px;
            height: 20px;
            background: #10b981;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            border: 2px solid white;
        }
        .testimonial-card:hover .user-avatar {
            transform: scale(1.1);
            border-color: #fbbf24;
        }
        .user-details h3 {
            color: #1f2937;
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 4px;
        }
        .user-location {
            color: #6b7280;
            font-size: 0.9rem;
            font-weight: 500;
        }
        .rating {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 20px;
        }
        .star {
            color: #fbbf24;
            font-size: 1.1rem;
            filter: drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3));
        }
        .rating-text {
            margin-left: 8px;
            color: #6b7280;
            font-size: 0.9rem;
            font-weight: 500;
        }
        .video-section {
            margin-bottom: 24px;
            position: relative;
            cursor: pointer;
            border-radius: 16px;
            overflow: hidden;
            background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .video-section:hover {
            transform: scale(1.02);
            background: linear-gradient(135deg, #ddd6fe, #c4b5fd);
        }
        .play-button {
            width: 60px;
            height: 60px;
            background: rgba(102, 126, 234, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            border: 3px solid rgba(255, 255, 255, 0.3);
        }
        .play-button:hover {
            transform: scale(1.15);
            background: rgba(102, 126, 234, 1);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }
        .play-button::after {
            content: '▶';
            color: white;
            font-size: 20px;
            margin-left: 3px;
        }
        .testimonial-text {
            color: #4b5563;
            font-size: 1rem;
            line-height: 1.6;
            font-weight: 500;
            text-align: left;
            position: relative;
            padding-left: 20px;
        }
        .testimonial-text::before {
            content: '"';
            position: absolute;
            left: 0;
            top: -8px;
            font-size: 2rem;
            color: #667eea;
            opacity: 0.3;
            font-family: serif;
        }
        .carousel-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 40px;
        }
        .nav-button {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .nav-button:hover {
            transform: translateY(-2px) scale(1.1);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        .nav-button:active {
            transform: translateY(0) scale(1.05);
        }
        .carousel-indicators {
            display: flex;
            justify-content: center;
            gap: 12px;
        }
        .indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #d1d5db;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        .indicator.active {
            background: #667eea;
            transform: scale(1.2);
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }
        .indicator.active::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            animation: ripple 2s infinite;
        }
        @keyframes ripple {
            0% {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
        .autoplay-toggle {
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .toggle-switch {
            position: relative;
            width: 50px;
            height: 24px;
            background: #d1d5db;
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        .toggle-switch.active {
            background: #667eea;
        }
        .toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .toggle-switch.active .toggle-slider {
            transform: translateX(26px);
        }
        .toggle-label {
            font-size: 0.9rem;
            color: #6b7280;
            font-weight: 500;
        }
        @media (max-width: 1024px) {
            .testimonial-card {
                flex: 0 0 calc(50% - 12px);
            }
        }
        @media (max-width: 768px) {
            .testimonial-card {
                flex: 0 0 100%;
            }
            .header h1 {
                font-size: 2.5rem;
            }
            .carousel-container {
                padding: 30px 20px 25px;
            }
            .stats-bar {
                flex-direction: column;
                gap: 12px;
            }
        }
        .video-modal {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(5px);
        }
        .video-modal-content {
            position: relative;
            width: 90%;
            max-width: 800px;
            background: black;
            border-radius: 20px;
            overflow: hidden;
        }
        .video-modal video {
            width: 100%;
            height: auto;
            display: block;
        }
        .video-modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `}</style>
);

// FILE: src/data/testimonialsData.js
const testimonialsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face",
    rating: 5.0,
    text: "Amazing product! Highly recommend it to everyone. The quality exceeded my expectations and the customer service was outstanding.",
    videoId: "video1",
  },
  {
    id: 2,
    name: "Mike Chen",
    location: "San Francisco, USA",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    rating: 5.0,
    text: "Changed my daily routine for the better. This product has made such a positive impact on my productivity and overall well-being.",
    videoId: "video2",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Miami, USA",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    rating: 5.0,
    text: "Fantastic support and easy to use! The team went above and beyond to ensure I had the best possible experience.",
    videoId: "video3",
  },
  {
    id: 4,
    name: "David Kim",
    location: "Seattle, USA",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    rating: 5.0,
    text: "Incredible value for money! I've tried many similar products but nothing comes close to the quality and effectiveness of this one.",
    videoId: "video4",
  },
  {
    id: 5,
    name: "Lisa Wang",
    location: "Los Angeles, USA",
    avatar:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=60&h=60&fit=crop&crop=face",
    rating: 5.0,
    text: "Life-changing experience! This product has helped me achieve goals I never thought were possible. Absolutely recommend to everyone!",
    videoId: "video5",
  },
];

// FILE: src/components/Header.js
const Header = () => (
  <div className="header">
    <h1>🌟 Happy Customers</h1>
    <p>See what our amazing customers have to say about their experience</p>
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-number">2,500+</span> Happy Customers
      </div>
      <div className="stat-item">
        <span className="stat-number">4.9/5</span> Average Rating
      </div>
      <div className="stat-item">
        <span className="stat-number">98%</span> Satisfaction Rate
      </div>
    </div>
  </div>
);

// FILE: src/components/TestimonialCard.js
const TestimonialCard = ({ testimonial, isCenter, onPlayVideo }) => (
  <div className={`testimonial-card ${isCenter ? "center" : ""}`}>
    <div className="user-info">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="user-avatar"
      />
      <div className="user-details">
        <h3>{testimonial.name}</h3>
        <div className="user-location">{testimonial.location}</div>
      </div>
    </div>
    <div className="rating">
      {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
        <span key={i} className="star">
          ★
        </span>
      ))}
      <span className="rating-text">{testimonial.rating.toFixed(1)}</span>
    </div>
    <div
      className="video-section"
      onClick={() => onPlayVideo(testimonial.videoId)}
    >
      <div className="play-button"></div>
    </div>
    <div className="testimonial-text">{testimonial.text}</div>
  </div>
);

// FILE: src/components/VideoModal.js
const VideoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="video-modal" onClick={onClose}>
      <button className="video-modal-close" onClick={onClose}>
        ×
      </button>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <video controls autoPlay>
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

// FILE: src/TestimonialCarousel.js
const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const autoplayIntervalRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handlePlayVideo = () => {
    setIsAutoplay(false); // Pause autoplay when video opens
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsAutoplay(true); // Resume autoplay when video closes
  };

  useEffect(() => {
    if (isAutoplay) {
      autoplayIntervalRef.current = setInterval(nextSlide, 4000);
    } else {
      clearInterval(autoplayIntervalRef.current);
    }
    return () => clearInterval(autoplayIntervalRef.current);
  }, [isAutoplay, nextSlide]);

  const getVisibleCards = () => {
    const numVisible =
      window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    const cards = [];
    for (let i = 0; i < numVisible; i++) {
      cards.push(
        testimonialsData[(currentIndex + i) % testimonialsData.length]
      );
    }
    return cards;
  };

  const visibleCards = getVisibleCards(); // simplified for this example
  const centerCardIndex = Math.floor(visibleCards.length / 2);

  return (
    <div className="container">
      <Header />
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div className="carousel-track">
            {testimonialsData.map((testimonial, index) => {
              const offset = index - currentIndex;
              const position =
                (offset + testimonialsData.length) % testimonialsData.length;
              const cardWidth =
                100 /
                (window.innerWidth <= 768
                  ? 1
                  : window.innerWidth <= 1024
                  ? 2
                  : 3);
              const style = {
                transform: `translateX(${
                  (position -
                    (window.innerWidth <= 768
                      ? 0
                      : window.innerWidth <= 1024
                      ? 0.5
                      : 1)) *
                  cardWidth
                }%)`,
                transition:
                  "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                opacity:
                  position >= 0 &&
                  position <
                    (window.innerWidth <= 768
                      ? 1
                      : window.innerWidth <= 1024
                      ? 2
                      : 3)
                    ? 1
                    : 0,
              };
              // This is a simplified carousel logic for React.
              // A more robust implementation would clone items for a true infinite feel.
              // For simplicity, this example just rotates the data.
            })}
            {visibleCards.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isCenter={index === centerCardIndex}
                onPlayVideo={handlePlayVideo}
              />
            ))}
          </div>
        </div>
        <div className="carousel-controls">
          <button className="nav-button" onClick={prevSlide}>
            ‹
          </button>
          <div className="carousel-indicators">
            {testimonialsData.map((_, index) => (
              <div
                key={index}
                className={`indicator ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
          <button className="nav-button" onClick={nextSlide}>
            ›
          </button>
        </div>
        <div className="autoplay-toggle">
          <span className="toggle-label">Auto-play</span>
          <div
            className={`toggle-switch ${isAutoplay ? "active" : ""}`}
            onClick={() => setIsAutoplay(!isAutoplay)}
          >
            <div className="toggle-slider"></div>
          </div>
        </div>
      </div>
      <VideoModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

// FILE: src/App.js
function App() {
  return (
    <>
      <GlobalStyles />
      <TestimonialCarousel />
    </>
  );
}

export default App;
