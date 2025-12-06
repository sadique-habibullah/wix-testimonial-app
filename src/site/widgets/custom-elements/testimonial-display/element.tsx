import React, {
  type FC,
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";
import { getApprovedTestimonialData } from "./../../../../backend/data.web";

interface Props {
  displayName?: string;
}

// FILE: src/styles/GlobalStyles.js
const GlobalStyles = () => (
  <style>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      /* body এবং body::before এর স্টাইলগুলো এখান থেকে সরিয়ে দেওয়া হয়েছে।
      */

      .floating-elements {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
      }

      .floating-shape {
        position: absolute;
        opacity: 0.1;
        animation: float 8s ease-in-out infinite;
        font-size: 2rem;
        color: #667eea; /* রঙ পরিবর্তন করা হয়েছে যাতে সাদা ব্যাকগ্রাউন্ডে দেখা যায় */
      }

      .floating-shape:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; }
      .floating-shape:nth-child(2) { top: 60%; right: 15%; animation-delay: 2s; }
      .floating-shape:nth-child(3) { bottom: 20%; left: 20%; animation-delay: 4s; }
      .floating-shape:nth-child(4) { top: 30%; right: 25%; animation-delay: 6s; }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0.1;
        }
        50% {
          transform: translateY(-30px) rotate(180deg);
          opacity: 0.2;
        }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .container {
        max-width: 1200px;
        width: 100%;
        text-align: center;
        position: relative;
        z-index: 2;
        /* body থেকে centering সরিয়ে এখানে আনা হয়েছে */
        margin: 40px auto; 
        padding: 20px;
      }

      .header {
        margin-bottom: 50px;
        position: relative;
      }

      .header::before {
        content: "✨";
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 2.5rem;
        animation: twinkle 3s ease-in-out infinite;
      }

      @keyframes twinkle {
        0%,
        100% {
          opacity: 0.6;
          transform: translateX(-50%) scale(1) rotate(0deg);
        }
        50% {
          opacity: 1;
          transform: translateX(-50%) scale(1.3) rotate(15deg);
        }
      }

      .header h1 {
        font-size: 3.8rem;
        font-weight: 900;
        color: #1f2937; /* রঙ পরিবর্তন করা হয়েছে */
        margin-bottom: 20px;
        text-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
        background: linear-gradient(135deg, #374151, #111827);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -1px;
      }

      .header p {
        color: #4b5563; /* রঙ পরিবর্তন করা হয়েছে */
        font-size: 1.3rem;
        font-weight: 400;
        margin-bottom: 25px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }

      .stats-bar {
        display: flex;
        justify-content: center;
        gap: 50px;
        margin-top: 25px;
      }

      .stat-item {
        color: #374151; /* রঙ পরিবর্তন করা হয়েছে */
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .stat-number {
        font-weight: 800;
        font-size: 1.8rem;
        color: #fbbf24;
        text-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .carousel-container {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(25px);
        border-radius: 35px;
        padding: 55px 45px 45px;
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.18),
          inset 0 1px 0 rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(0, 0, 0, 0.08);
        position: relative;
        overflow: hidden;
      }

      .carousel-container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: linear-gradient(
          90deg,
          #ff6b6b,
          #4ecdc4,
          #45b7d1,
          #96ceb4,
          #feca57,
          #ff9ff3,
          #54a0ff
        );
        background-size: 700% 700%;
        animation: rainbowFlow 8s ease infinite;
      }

      @keyframes rainbowFlow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .carousel-wrapper {
        position: relative;
        overflow: hidden;
        margin-bottom: 35px;
      }

      .carousel-track {
        display: flex;
        gap: 30px;
        padding: 10px;
        cursor: grab;
      }
      .carousel-track:active {
        cursor: grabbing;
      }

      .testimonial-card {
        flex-shrink: 0;
        width: calc(100% / 3 - 20px);
        background: linear-gradient(135deg, #f8fafc, #ffffff, #f1f5f9);
        border-radius: 25px;
        padding: 35px 28px;
        box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08),
          0 2px 8px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(0, 0, 0, 0.03);
        transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
        overflow: hidden;
      }

      .testimonial-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
        background-size: 300% 100%;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s ease;
        animation: gradientSlide 3s ease infinite;
      }

      @keyframes gradientSlide {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .testimonial-card:hover {
        transform: translateY(-12px) scale(1.03);
        box-shadow: 0 25px 65px rgba(0, 0, 0, 0.15),
          0 8px 25px rgba(102, 126, 234, 0.1);
      }

      .testimonial-card:hover::before {
        transform: scaleX(1);
      }

      .testimonial-card.center {
        transform: scale(1.08) translateY(-8px);
        z-index: 3;
        box-shadow: 0 20px 70px rgba(102, 126, 234, 0.25),
          0 10px 35px rgba(0, 0, 0, 0.1);
      }

      .testimonial-card.center::before {
        transform: scaleX(1);
      }
      
      .user-info { display: flex; align-items: center; margin-bottom: 22px; gap: 18px; }

      .user-avatar {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        border: 4px solid transparent;
        background: linear-gradient(135deg, #667eea, #764ba2) padding-box,
          linear-gradient(135deg, #667eea, #764ba2) border-box;
        object-fit: cover;
        transition: all 0.4s ease;
        position: relative;
      }

      .user-avatar::after {
        content: "✓";
        position: absolute;
        bottom: -3px;
        right: -3px;
        width: 22px;
        height: 22px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: bold;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
      }

      .testimonial-card:hover .user-avatar {
        transform: scale(1.12) rotate(5deg);
        border: 4px solid #fbbf24;
      }
      
      .user-details h3 {
        color: #1f2937;
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 6px;
        background: linear-gradient(135deg, #1f2937, #374151);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .user-location {
        color: #6b7280;
        font-size: 0.95rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .user-location::before { content: "📍"; font-size: 0.9rem; }

      .rating {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-bottom: 25px;
        padding: 8px;
        background: rgba(251, 191, 36, 0.1);
        border-radius: 15px;
        border: 1px solid rgba(251, 191, 36, 0.2);
      }

      .star {
        color: #fbbf24;
        font-size: 1.3rem;
        filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3));
        transition: all 0.2s ease;
        animation: sparkle 2s ease infinite;
        animation-delay: calc(var(--i) * 0.1s);
      }

      @keyframes sparkle {
        0%, 100% {
          transform: scale(1);
          filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3));
        }
        50% {
          transform: scale(1.1);
          filter: drop-shadow(0 4px 8px rgba(251, 191, 36, 0.5));
        }
      }

      .rating-text {
        margin-left: 10px;
        color: #6b7280;
        font-size: 0.95rem;
        font-weight: 600;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .video-section {
        margin-bottom: 28px;
        position: relative;
        cursor: pointer;
        border-radius: 20px;
        overflow: hidden;
        background: linear-gradient(135deg, #e0e7ff, #c7d2fe, #ddd6fe);
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s ease;
        border: 2px solid transparent;
      }

      .video-section:hover {
        transform: scale(1.03);
        background: linear-gradient(135deg, #ddd6fe, #c4b5fd, #a78bfa);
        border-color: rgba(102, 126, 234, 0.3);
        box-shadow: 0 12px 35px rgba(102, 126, 234, 0.2);
      }

      .play-button {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        backdrop-filter: blur(15px);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.4s ease;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4),
          inset 0 2px 0 rgba(255, 255, 255, 0.2);
        border: 3px solid rgba(255, 255, 255, 0.3);
        position: relative;
      }
      .play-button::after {
        content: "▶";
        color: white;
        font-size: 22px;
        margin-left: 4px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .testimonial-text {
        color: #4b5563;
        font-size: 1.05rem;
        line-height: 1.7;
        font-weight: 500;
        text-align: left;
        position: relative;
        padding-left: 25px;
        padding-right: 15px;
        min-height: 120px;
      }

      .testimonial-text::before {
        content: '"';
        position: absolute;
        left: 0;
        top: -12px;
        font-size: 2.5rem;
        color: #667eea;
        opacity: 0.4;
        font-family: serif;
      }

      .testimonial-text::after {
        content: '"';
        position: absolute;
        right: 0;
        bottom: -20px;
        font-size: 2.5rem;
        color: #667eea;
        opacity: 0.4;
        font-family: serif;
      }

      .carousel-controls { display: flex; justify-content: center; align-items: center; gap: 30px; margin-top: 45px; }

      .nav-button {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
        color: white;
        font-size: 1.4rem;
        cursor: pointer;
        transition: all 0.4s ease;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .nav-button:hover {
        transform: translateY(-3px) scale(1.1);
        box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.3);
      }
      
      .carousel-indicators { display: flex; justify-content: center; gap: 15px; }

      .indicator {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #d1d5db;
        cursor: pointer;
        transition: all 0.4s ease;
        position: relative;
        border: 2px solid transparent;
      }
      .indicator.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        transform: scale(1.3);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5), 0 0 20px rgba(102, 126, 234, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
      }

      .autoplay-controls { margin-top: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; }

      .autoplay-toggle {
        position: relative;
        width: 60px;
        height: 30px;
        background: #d1d5db;
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .autoplay-toggle.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 15px rgba(102, 126, 234, 0.3);
      }

      .toggle-slider {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 24px;
        height: 24px;
        background: white;
        border-radius: 50%;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }
      .autoplay-toggle.active .toggle-slider { transform: translateX(30px); }
      .toggle-label { font-size: 1rem; color: #6b7280; font-weight: 600; display: flex; align-items: center; gap: 8px; }
      .toggle-label::before { content: "⚡"; font-size: 1.1rem; }

      @media (max-width: 1024px) {
        .testimonial-card { width: calc(50% - 15px); }
        .stats-bar { gap: 30px; }
      }

      @media (max-width: 768px) {
        .testimonial-card { width: 100%; }
        .header h1 { font-size: 2.8rem; }
        .carousel-container { padding: 35px 25px 30px; }
        .stats-bar { flex-direction: column; gap: 15px; }
        .carousel-controls { gap: 20px; }
      }

      .video-modal {
        position: fixed;
        z-index: 2000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .video-modal-close {
        position: absolute;
        top: 25px;
        right: 25px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        font-size: 1.4rem;
        cursor: pointer;
        z-index: 2001;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }
      .video-modal-close:hover {
        background: rgba(220, 38, 38, 0.9);
        transform: scale(1.1);
      }
    `}</style>
);

// FILE: src/data/testimonialsData.js
// let testimonialsData: any;
// testimonialsData = [
//   {
//     id: 1,
//     name: "Sarah Johnson",
//     location: "New York, USA",
//     avatar:
//       "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=65&h=65&fit=crop&crop=face",
//     rating: 5.0,
//     text: "Amazing product! Highly recommend it to everyone. The quality exceeded my expectations and the customer service was outstanding. This has truly transformed my daily routine.",
//     videoId: "video1",
//   },
//   {
//     id: 2,
//     name: "Mike Chen",
//     location: "San Francisco, USA",
//     avatar:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=65&h=65&fit=crop&crop=face",
//     rating: 5.0,
//     text: "Changed my daily routine for the better. This product has made such a positive impact on my productivity and overall well-being. I can't imagine my life without it now.",
//     videoId: "video2",
//   },
//   {
//     id: 3,
//     name: "Emily Rodriguez",
//     location: "Miami, USA",
//     avatar:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=65&h=65&fit=crop&crop=face",
//     rating: 5.0,
//     text: "Fantastic support and easy to use! The team went above and beyond to ensure I had the best possible experience. Highly recommended for anyone looking for quality.",
//     videoId: "video3",
//   },
//   {
//     id: 4,
//     name: "David Kim",
//     location: "Seattle, USA",
//     avatar:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=65&h=65&fit=crop&crop=face",
//     rating: 5.0,
//     text: "Incredible value for money! I've tried many similar products but nothing comes close to the quality and effectiveness of this solution. Worth every penny.",
//     videoId: "video4",
//   },
//   {
//     id: 5,
//     name: "Lisa Wang",
//     location: "Los Angeles, USA",
//     avatar:
//       "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=65&h=65&fit=crop&crop=face",
//     rating: 5.0,
//     text: "Life-changing experience! This product has helped me achieve goals I never thought were possible. The results speak for themselves. Absolutely amazing!",
//     videoId: "video5",
//   },
// ];

// (async () => {
//   testimonialsData = await getAllTestimonialData();
//   console.log("testimonialsData: ", testimonialsData);
// })();

// FILE: src/components/FloatingElements.js
const FloatingElements = () => (
  <div className="floating-elements">
    <div className="floating-shape">⭐</div>
    <div className="floating-shape">💫</div>
    <div className="floating-shape">✨</div>
    <div className="floating-shape">🌟</div>
  </div>
);

// FILE: src/components/Header.js
const Header = () => (
  <div className="header">
    <h1>🌟 Happy Customers</h1>
    <p>Discover why thousands of customers love our service</p>
    <div className="stats-bar">
      <div className="stat-item">
        <div className="stat-number">5,000+</div>
        <div>Happy Customers</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">4.9/5</div>
        <div>Average Rating</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">99%</div>
        <div>Satisfaction Rate</div>
      </div>
    </div>
  </div>
);

// FILE: src/components/TestimonialCard.js
const TestimonialCard = forwardRef<any>(
  ({ testimonial, isCenter, onPlayVideo }: any, ref) => (
    <div className={`testimonial-card ${isCenter ? "center" : ""}`} ref={ref}>
      <div className="user-info">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="user-avatar"
        />
        <div className="user-details">
          <h3>{testimonial.name}</h3>
          {/* <div className="user-location">{testimonial.location}</div> // hide location, COZ we never get the location from user */}
        </div>
      </div>
      <div className="rating">
        {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
          <span
            key={i}
            className="star"
            style={{ ["--i" as any]: i + 1 } as React.CSSProperties}
          >
            ★
          </span>
        ))}
        <span className="rating-text">{testimonial.rating.toFixed(1)}</span>
      </div>
      <div className="video-section" onClick={() => onPlayVideo(testimonial)}>
        <img
          src={testimonial.videoThumbnail}
          alt="Video thumbnail"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "16px",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
          }}
        />
        <div
          className="play-button"
          style={{
            position: "relative",
            zIndex: 2,
          }}
        ></div>
      </div>
      <div className="testimonial-text">{testimonial.text}</div>
    </div>
  )
);

// FILE: src/components/VideoModal.js
const VideoModal = ({
  isOpen,
  onClose,
  testimonial,
}: {
  isOpen: boolean;
  testimonial: any;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  console.log("testimonialsData from videoModal component: ", testimonial);

  return (
    <div className="video-modal" onClick={onClose}>
      <button className="video-modal-close" onClick={onClose}>
        ×
      </button>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <video controls autoPlay onEnded={onClose}>
          <source
            src={testimonial.videoId} //https://www.w3schools.com/html/mov_bbb.mp4
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

// FILE: src/TestimonialCarousel.js
const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState<any>(0);
  const [isAutoplay, setIsAutoplay] = useState<any>(true);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [cardWidth, setCardWidth] = useState<any>(0);
  const [testimonialsData, setTestimonialsData] = useState<any[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState<any | null>(null);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const allTestimonialsData = await getApprovedTestimonialData();
        console.log("allTestimonialsData: ", allTestimonialsData);

        if (allTestimonialsData.length > 0) {
          setTestimonialsData(
            allTestimonialsData.map((item) => ({
              id: item._id,
              name: item.name || "Anonymous",
              location: item.location || "",
              avatar:
                item.avatarUrl ||
                item.photo?.file?.url ||
                "https://avatar.iran.liara.run/public",
              rating: item.rating || 0,
              text: item.testimonialText || "",
              videoId:
                item.videoUrl ||
                item.video?.file?.media?.video?.resolutions?.[0]?.url ||
                item.video?.file?.url ||
                "",
              videoThumbnail:
                item.videoThumbnail ||
                item.video?.file?.thumbnailUrl ||
                "https://placehold.co/600x400",
            }))
          );
        }
      } catch (error) {
        console.error("error: ", error);
      }
    }
    loadTestimonials();
  }, []);

  const totalSlides = testimonialsData.length;
  const autoplayIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const firstCardRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev: any) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentIndex((prev: any) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePlayVideo = useCallback((testimonial: any) => {
    setIsAutoplay(false);
    setActiveTestimonial(testimonial);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsAutoplay(true);
  }, []);

  useEffect(() => {
    const calculateCardWidth = () => {
      if (firstCardRef.current) {
        setCardWidth(firstCardRef.current.offsetWidth);
      }
    };
    // Timeout ensures that the layout is stable before measuring
    const timer = setTimeout(calculateCardWidth, 100);
    window.addEventListener("resize", calculateCardWidth);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateCardWidth);
    };
  }, []);

  useEffect(() => {
    if (isAutoplay) {
      autoplayIntervalRef.current = setInterval(nextSlide, 5000);
    } else if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [isAutoplay, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === " ") {
        e.preventDefault();
        setIsAutoplay((prev: any) => !prev);
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoplayIntervalRef.current) {
          clearInterval(autoplayIntervalRef.current);
        }
      } else if (isAutoplay) {
        autoplayIntervalRef.current = setInterval(nextSlide, 5000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAutoplay, nextSlide, isModalOpen]);

  // Loading...
  if (!testimonialsData || testimonialsData.length === 0) {
    // testimonialsData.length === 0 etar jonno alada logic set kora lagbe
    // just return loading text with style and animation
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          color: "#333",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(0,0,0,0.1)",
            borderTop: "4px solid #0070f3", // primary color
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "10px",
          }}
        ></div>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "500",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Loading testimonials...
        </p>
      </div>
    );
  }

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const itemsPerView = getItemsPerView();
  const gap = 30;
  const offset = -(currentIndex * (cardWidth + gap));
  const centerCardRawIndex = currentIndex + Math.floor(itemsPerView / 2);

  return (
    <div className="container">
      <Header />
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div
            className="carousel-track"
            style={{ transform: `translateX(${offset}px)` }}
          >
            {testimonialsData.map((testimonial: any, index: any) => (
              <TestimonialCard
                key={testimonial.id}
                ref={index === 0 ? firstCardRef : null}
                testimonial={testimonial}
                isCenter={centerCardRawIndex % totalSlides === index}
                onPlayVideo={() => handlePlayVideo(testimonial)}
              />
            ))}
          </div>
        </div>

        <div className="carousel-controls">
          <button
            className="nav-button"
            onClick={prevSlide}
            aria-label="Previous Testimonial"
          >
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
          <button
            className="nav-button"
            onClick={nextSlide}
            aria-label="Next Testimonial"
          >
            ›
          </button>
        </div>

        <div className="autoplay-controls">
          <span className="toggle-label">Auto-play</span>
          <div
            className={`autoplay-toggle ${isAutoplay ? "active" : ""}`}
            onClick={() => setIsAutoplay(!isAutoplay)}
          >
            <div className="toggle-slider"></div>
          </div>
        </div>
      </div>
      <VideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        testimonial={activeTestimonial}
      />
    </div>
  );
};

// FILE: src/App.js
function App() {
  return (
    <>
      <GlobalStyles />
      <FloatingElements />
      <TestimonialCarousel />
    </>
  );
}

const CustomElement: FC<Props> = ({ displayName = `Your Widget's Title` }) => {
  return (
    <div>
      <App />
    </div>
  );
};

const customElement = reactToWebComponent(
  CustomElement,
  React,
  ReactDOM as any,
  {
    props: {
      displayName: "string",
    },
  }
);

export default customElement;
