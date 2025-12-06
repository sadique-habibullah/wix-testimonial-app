import React, { type FC, useState, useEffect, useRef } from "react";
import { EmptyState, Page, WixDesignSystemProvider } from "@wix/design-system";
import "@wix/design-system/styles.global.css";
import { getAllTestimonialData, saveData } from "./../../../backend/data.web";
import { FunnelChart } from "recharts";

const DashboardPage: FC = () => {
  // global css style
  const GlobalStyles = () => (
    <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            color: #2d3748;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .testimonials-grid {
            display: grid;
            gap: 24px;
         // grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            grid-template-columns: repeat(2, 1fr); /* এক লাইনে ঠিক ২টা কার্ড */
        }
        .testimonial-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
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
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 400% 400%;
            animation: gradientShift 3s ease infinite;
        }
        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .testimonial-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        .user-info {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-right: 16px;
            border: 3px solid #667eea;
            object-fit: cover;
            transition: all 0.3s ease;
        }
        .user-avatar:hover {
            transform: scale(1.1);
            border-color: #f093fb;
        }
        .user-details h3 {
            color: #2d3748;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .user-details .user-tag {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        .video-section {
            margin-bottom: 20px;
            position: relative;
            cursor: pointer;
        }
        .video-thumbnail {
            width: 100%;
            height: 200px;
            border-radius: 16px;
            object-fit: cover;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        .video-section:hover .video-thumbnail {
            border-color: #667eea;
            transform: scale(1.02);
        }
        .play-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 70px;
            height: 70px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            pointer-events: none; /* Make it unclickable so the parent div handles the click */
        }
        .video-section:hover .play-button {
            transform: translate(-50%, -50%) scale(1.1);
            background: #667eea;
            color: white;
        }
        .play-button::after {
            content: '▶';
            font-size: 24px;
            margin-left: 4px;
        }
        .review-text {
            background: #f8fafc;
            padding: 20px;
            border-radius: 16px;
            margin-bottom: 24px;
            position: relative;
            border-left: 4px solid #667eea;
        }
        .review-text::before {
            content: '"';
            position: absolute;
            top: -10px;
            left: 10px;
            font-size: 3rem;
            color: #667eea;
            opacity: 0.3;
            font-family: serif;
        }
        .review-text p {
            color: #4a5568;
            line-height: 1.7;
            font-size: 1rem;
            font-weight: 400;
        }
        .rating {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }
        .stars {
            color: #fbbf24;
            font-size: 1.2rem;
            margin-right: 8px;
        }
        .rating-text {
            color: #6b7280;
            font-size: 0.9rem;
            font-weight: 500;
        }
        .actions {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .btn {
            padding: 12px 24px;
            border-radius: 12px;
            border: none;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
        }
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        .btn:hover::before {
            left: 100%;
        }
        .btn-approve {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        .btn-approve:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }
        .btn-decline {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }
        .btn-decline:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        }
        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        .status-approved {
            background: #d1fae5;
            color: #065f46;
        }
        .status-declined {
            background: #fee2e2;
            color: #991b1b;
        }
        .metadata {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
        }
        .date {
            color: #6b7280;
            font-size: 0.9rem;
        }
        @media (max-width: 768px) {
            .testimonials-grid {
                grid-template-columns: 1fr;
            }
            .header h1 {
                font-size: 2rem;
            }
            .testimonial-card {
                padding: 20px;
            }
            .actions {
                flex-direction: column;
            }
            .btn {
                width: 100%;
            }
        }
        .modal {
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 20px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        .close {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: #aaa;
            transition: color 0.3s;
        }
        .close:hover {
            color: #000;
        }
        .video-player {
            width: 100%;
            border-radius: 16px;
            margin-bottom: 20px;
            aspect-ratio: 16 / 9;
        }
    `}</style>
  );

  // video modal component
  const VideoModal = ({ testimonial, onClose }: any) => {
    const videoRef = useRef<any>(null);

    // Escape key or clicking outside will close the modal
    useEffect(() => {
      const handleKeydown = (e: any) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      const handleClickOutside = (e: any) => {
        if (e.target.classList.contains("modal")) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeydown);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";

      // Autoplay video on mount
      if (videoRef.current) {
        videoRef.current.play();
      }

      // Cleanup function
      return () => {
        document.removeEventListener("keydown", handleKeydown);
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "auto";
        if (videoRef.current) {
          videoRef.current.pause();
        }
      };
    }, [onClose]);

    if (!testimonial) return null;

    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <video ref={videoRef} className="video-player" controls>
            <source src={testimonial.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h3>{testimonial.name}'s Testimonial</h3>
          <p>
            Watch the full video testimonial to get the complete story and
            authentic experience.
          </p>
        </div>
      </div>
    );
  };

  // testimonial component
  const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState<any>([]);
    const [activeModalTestimonial, setActiveModalTestimonial] = useState(null);

    // fetch all testimonials from backend
    let initialTestimonials: any;

    useEffect(() => {
      async function loadTestimonials() {
        // console.log("inside loadTestimonials function");
        try {
          const allTestimonialsData = await getAllTestimonialData();
          if (allTestimonialsData.length > 0) {
            console.log("allTestimonialsData: ", allTestimonialsData);

            // populate initial testimonial data
            initialTestimonials = allTestimonialsData.map((item) => ({
              id: item._id,
              name: item.name || "Anonymous",
              avatarUrl:
                item.avatarUrl ||
                item.photo?.file?.url ||
                "https://avatar.iran.liara.run/public",
              tag: "Verified Customer", // amra chaile alada logic boshaite pari.
              rating: item.rating || 0,
              reviewText: item.testimonialText || "",
              videoThumbnail:
                item.videoThumbnail ||
                item.video?.file?.thumbnailUrl ||
                "https://placehold.co/600x400",
              videoUrl:
                item.videoUrl ||
                item.video?.file?.media?.video?.resolutions?.[0]?.url ||
                item.video?.file?.url ||
                "",
              submittedDate: new Date(
                item._createdDate || new Date()
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              status: item.status?.toLowerCase() || "pending",
            }));

            setTestimonials((testimonial: any) => [
              ...initialTestimonials,
              ...testimonial,
            ]);

            console.log(
              "initialTestimonials inside loadTestimonials function: ",
              initialTestimonials
            );
          } else {
            console.log("testimonial item not found!");
          }
        } catch (error) {
          console.error("error: ", error);
        }
      }
      loadTestimonials();
    }, []);

    //  -- version 1 --
    // const handleUpdateStatus = (id: any, newStatus: any) => {
    //   setTestimonials(
    //     testimonials.map((t: any) =>
    //       t.id === id ? { ...t, status: newStatus } : t
    //     )
    //   );
    // };

    // -- version 2 --

    // const handleUpdateStatus = async (id: string, newStatus: string) => {
    //   let updatedItem: any;

    //   // 1. age state update kora
    //   setTestimonials((prev: any) =>
    //     prev.map((t: any) => {
    //       if (t.id === id) {
    //         updatedItem = { ...t, status: newStatus };
    //         console.log("updatedItem: ", updatedItem);
    //         return updatedItem;
    //       }
    //       return t;
    //     })
    //   );

    //   // 2. tarpor database update kora
    //   try {
    //     if (updatedItem) {
    //       await saveData(updatedItem);
    //     }
    //   } catch (error) {
    //     console.log("error: ", error);
    //   }
    // };

    // -- version 3 --
    const handleUpdateStatus = async (id: string, newStatus: string) => {
      const prevItem = testimonials.find((t: any) => t.id === id);
      console.log("prevItem: ", prevItem);

      if (!prevItem) return;

      const updatedItem = { ...prevItem, status: newStatus };
      console.log("updatedItem: ", updatedItem);

      // 1. আগে local state update
      setTestimonials((prev: any) =>
        prev.map((t: any) => (t.id === id ? updatedItem : t))
      );

      // 2. database এ update call
      try {
        const { id, reviewText, ...rest } = updatedItem; // id ke ber korlam
        const toSave = {
          _id: id, // existing document update
          testimonialText: reviewText,
          ...rest, // baki shob data
        };
        console.log("toSave: ", toSave);

        const data = await saveData(toSave);
        console.log("database updated: ", data);
      } catch (error) {
        console.log("error: ", error);

        // 3. rollback (optional)
        setTestimonials((prev: any) =>
          prev.map((t: any) => (t.id === id ? prevItem : t))
        );
      }
    };

    const handleApprove = (id: any) => handleUpdateStatus(id, "approved");
    const handleDecline = (id: any) => handleUpdateStatus(id, "declined");

    // header component
    // const Header = () => (
    //   <div className="header">
    //     <h1>🎥 Video Testimonials Manager updated</h1>
    //   </div>
    // );

    // status component
    const StatusBadge = ({ status }: any) => {
      let badgeClass = "status-badge";
      let text = status;

      switch (status) {
        case "approved":
          badgeClass += " status-approved";
          break;
        case "declined":
          badgeClass += " status-declined";
          break;
        case "pending":
        default:
          badgeClass += " status-pending";
          break;
      }

      return <span className={badgeClass}>{text}</span>;
    };

    // testimonial card component
    const TestimonialCard = ({
      testimonial,
      onApprove,
      onDecline,
      onPlayVideo,
    }: any) => {
      return (
        <div className="testimonial-card">
          <div className="user-info">
            <img
              src={testimonial.avatarUrl}
              alt={testimonial.name}
              className="user-avatar"
            />
            <div className="user-details">
              <h3>{testimonial.name}</h3>
              <span className="user-tag">{testimonial.tag}</span>
            </div>
          </div>
          <div className="rating">
            <div className="stars">
              {"★".repeat(testimonial.rating)}
              {"☆".repeat(5 - testimonial.rating)}
            </div>
            <span className="rating-text">{testimonial.rating}.0 out of 5</span>
          </div>
          <div
            className="video-section"
            onClick={() => onPlayVideo(testimonial)}
          >
            <img
              src={testimonial.videoThumbnail}
              alt="Video thumbnail"
              className="video-thumbnail"
            />
            <div className="play-button"></div>
          </div>
          <div className="review-text">
            <p>{testimonial.reviewText}</p>
          </div>
          <div className="actions">
            <button
              className="btn btn-approve"
              onClick={() => onApprove(testimonial.id)}
            >
              ✓ Approve
            </button>
            <button
              className="btn btn-decline"
              onClick={() => onDecline(testimonial.id)}
            >
              ✗ Decline
            </button>
            <StatusBadge status={testimonial.status} />
          </div>
          <div className="metadata">
            <span className="date">
              📅 Submitted: {testimonial.submittedDate}
            </span>
          </div>
        </div>
      );
    };

    return (
      <div className="container">
        {/* <Header /> */}
        <div className="testimonials-grid">
          {testimonials.map((testimonial: any) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onPlayVideo={setActiveModalTestimonial}
            />
          ))}
        </div>
        {activeModalTestimonial && (
          <VideoModal
            testimonial={activeModalTestimonial}
            onClose={() => setActiveModalTestimonial(null)}
          />
        )}
      </div>
    );
  };

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page>
        <Page.Header
          title="🎥 Video Testimonials Manager"
          subtitle="Manage Testimonials"
        />
        <Page.Content>
          {/* <EmptyState
            title="Testimonials Manager"
            subtitle="Edit and manage testimonials"
            skin="page"
          /> */}
          <GlobalStyles />
          <TestimonialsManager />
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default DashboardPage;

// import React, { useState, useEffect, useRef } from "react";
// import { getAllTestimonialData } from "./../../../backend/data.web";

// // FILE: src/styles/GlobalStyles.js
// // সমস্ত CSS এখানে একটি কম্পোনেন্টে রাখা হয়েছে।
// const GlobalStyles = () => (
//   <style>{`
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
//         body {
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//             padding: 20px;
//             min-height: 100vh;
//         }
//         .container {
//             max-width: 1200px;
//             margin: 0 auto;
//         }
//         .header {
//             text-align: center;
//             margin-bottom: 40px;
//         }
//         .header h1 {
//             color: #2d3748;
//             font-size: 2.5rem;
//             font-weight: 700;
//             margin-bottom: 10px;
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             -webkit-background-clip: text;
//             -webkit-text-fill-color: transparent;
//             background-clip: text;
//         }
//         .testimonials-grid {
//             display: grid;
//             gap: 24px;
//             grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
//         }
//         .testimonial-card {
//             background: rgba(255, 255, 255, 0.95);
//             backdrop-filter: blur(10px);
//             border-radius: 20px;
//             padding: 28px;
//             box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
//             border: 1px solid rgba(255, 255, 255, 0.2);
//             transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//             position: relative;
//             overflow: hidden;
//         }
//         .testimonial-card::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             height: 4px;
//             background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
//             background-size: 400% 400%;
//             animation: gradientShift 3s ease infinite;
//         }
//         @keyframes gradientShift {
//             0%, 100% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//         }
//         .testimonial-card:hover {
//             transform: translateY(-8px) scale(1.02);
//             box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
//         }
//         .user-info {
//             display: flex;
//             align-items: center;
//             margin-bottom: 20px;
//         }
//         .user-avatar {
//             width: 60px;
//             height: 60px;
//             border-radius: 50%;
//             margin-right: 16px;
//             border: 3px solid #667eea;
//             object-fit: cover;
//             transition: all 0.3s ease;
//         }
//         .user-avatar:hover {
//             transform: scale(1.1);
//             border-color: #f093fb;
//         }
//         .user-details h3 {
//             color: #2d3748;
//             font-size: 1.2rem;
//             font-weight: 600;
//             margin-bottom: 4px;
//         }
//         .user-details .user-tag {
//             background: linear-gradient(135deg, #667eea, #764ba2);
//             color: white;
//             padding: 4px 12px;
//             border-radius: 12px;
//             font-size: 0.8rem;
//             font-weight: 500;
//         }
//         .video-section {
//             margin-bottom: 20px;
//             position: relative;
//             cursor: pointer;
//         }
//         .video-thumbnail {
//             width: 100%;
//             height: 200px;
//             border-radius: 16px;
//             object-fit: cover;
//             transition: all 0.3s ease;
//             border: 2px solid transparent;
//         }
//         .video-section:hover .video-thumbnail {
//             border-color: #667eea;
//             transform: scale(1.02);
//         }
//         .play-button {
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             width: 70px;
//             height: 70px;
//             background: rgba(255, 255, 255, 0.95);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
//             pointer-events: none; /* Make it unclickable so the parent div handles the click */
//         }
//         .video-section:hover .play-button {
//             transform: translate(-50%, -50%) scale(1.1);
//             background: #667eea;
//             color: white;
//         }
//         .play-button::after {
//             content: '▶';
//             font-size: 24px;
//             margin-left: 4px;
//         }
//         .review-text {
//             background: #f8fafc;
//             padding: 20px;
//             border-radius: 16px;
//             margin-bottom: 24px;
//             position: relative;
//             border-left: 4px solid #667eea;
//         }
//         .review-text::before {
//             content: '"';
//             position: absolute;
//             top: -10px;
//             left: 10px;
//             font-size: 3rem;
//             color: #667eea;
//             opacity: 0.3;
//             font-family: serif;
//         }
//         .review-text p {
//             color: #4a5568;
//             line-height: 1.7;
//             font-size: 1rem;
//             font-weight: 400;
//         }
//         .rating {
//             display: flex;
//             align-items: center;
//             margin-bottom: 16px;
//         }
//         .stars {
//             color: #fbbf24;
//             font-size: 1.2rem;
//             margin-right: 8px;
//         }
//         .rating-text {
//             color: #6b7280;
//             font-size: 0.9rem;
//             font-weight: 500;
//         }
//         .actions {
//             display: flex;
//             gap: 12px;
//             align-items: center;
//         }
//         .btn {
//             padding: 12px 24px;
//             border-radius: 12px;
//             border: none;
//             font-weight: 600;
//             font-size: 0.9rem;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//             position: relative;
//             overflow: hidden;
//         }
//         .btn::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: -100%;
//             width: 100%;
//             height: 100%;
//             background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
//             transition: left 0.5s;
//         }
//         .btn:hover::before {
//             left: 100%;
//         }
//         .btn-approve {
//             background: linear-gradient(135deg, #10b981, #059669);
//             color: white;
//             box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
//         }
//         .btn-approve:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
//         }
//         .btn-decline {
//             background: linear-gradient(135deg, #ef4444, #dc2626);
//             color: white;
//             box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
//         }
//         .btn-decline:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
//         }
//         .status-badge {
//             padding: 6px 12px;
//             border-radius: 20px;
//             font-size: 0.8rem;
//             font-weight: 600;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }
//         .status-pending {
//             background: #fef3c7;
//             color: #92400e;
//         }
//         .status-approved {
//             background: #d1fae5;
//             color: #065f46;
//         }
//         .status-declined {
//             background: #fee2e2;
//             color: #991b1b;
//         }
//         .metadata {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             margin-top: 20px;
//             padding-top: 16px;
//             border-top: 1px solid #e5e7eb;
//         }
//         .date {
//             color: #6b7280;
//             font-size: 0.9rem;
//         }
//         @media (max-width: 768px) {
//             .testimonials-grid {
//                 grid-template-columns: 1fr;
//             }
//             .header h1 {
//                 font-size: 2rem;
//             }
//             .testimonial-card {
//                 padding: 20px;
//             }
//             .actions {
//                 flex-direction: column;
//             }
//             .btn {
//                 width: 100%;
//             }
//         }
//         .modal {
//             position: fixed;
//             z-index: 1000;
//             left: 0;
//             top: 0;
//             width: 100%;
//             height: 100%;
//             background-color: rgba(0, 0, 0, 0.8);
//             backdrop-filter: blur(5px);
//             display: flex;
//             align-items: center;
//             justify-content: center;
//         }
//         .modal-content {
//             background: white;
//             padding: 30px;
//             border-radius: 20px;
//             width: 90%;
//             max-width: 800px;
//             max-height: 90vh;
//             overflow-y: auto;
//             position: relative;
//         }
//         .close {
//             position: absolute;
//             right: 20px;
//             top: 15px;
//             font-size: 28px;
//             font-weight: bold;
//             cursor: pointer;
//             color: #aaa;
//             transition: color 0.3s;
//         }
//         .close:hover {
//             color: #000;
//         }
//         .video-player {
//             width: 100%;
//             border-radius: 16px;
//             margin-bottom: 20px;
//             aspect-ratio: 16 / 9;
//         }
//     `}</style>
// );

// let initialTestimonials;

// console.log("page code running...");

// // FILE: src/data/testimonialsData.js
// // হার্ডকোডেড ডেটাকে একটি অ্যারেতে রাখা হয়েছে
// initialTestimonials = [
//   {
//     id: 1,
//     name: "Sarah Johnson",
//     avatarUrl:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
//     tag: "Verified Customer",
//     rating: 5,
//     reviewText:
//       "This product completely changed my life! I never expected such amazing results. The customer service was outstanding, and the quality exceeded all my expectations. I've been using it for 3 months now and couldn't be happier. Highly recommend to anyone looking for a game-changing solution!",
//     videoThumbnail:
//       "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
//     videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
//     submittedDate: "March 15, 2024",
//     status: "pending",
//   },
//   {
//     id: 2,
//     name: "Mike Chen",
//     avatarUrl:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
//     tag: "Premium Member",
//     rating: 5,
//     reviewText:
//       "Incredible experience from start to finish! The team went above and beyond to ensure I was satisfied. The product quality is top-notch, and the delivery was super fast. I've already recommended this to all my friends and family. This is exactly what I was looking for, and it delivered on every promise made.",
//     videoThumbnail:
//       "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=200&fit=crop",
//     videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
//     submittedDate: "March 12, 2024",
//     status: "approved",
//   },
//   {
//     id: 3,
//     name: "Emily Rodriguez",
//     avatarUrl:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
//     tag: "VIP Customer",
//     rating: 4,
//     reviewText:
//       "Great product overall! Really satisfied with the purchase and the customer support team was very helpful throughout the process. The quality is solid and it serves its purpose well. There's definitely room for improvement in some areas, but I'm generally happy with my decision to buy this. Would consider purchasing again in the future.",
//     videoThumbnail:
//       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
//     videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
//     submittedDate: "March 10, 2024",
//     status: "declined",
//   },
// ];

// // fetch all testimonials
// async function loadTestimonials() {
//   console.log("inside loadTestimonials function");
//   try {
//     const testimonials = await getAllTestimonialData();
//     if (testimonials.length > 0) {
//       console.log("testimonials: ", testimonials);

//       // populate initial testimonial data
//       initialTestimonials = testimonials.map((item) => ({
//         id: item._id,
//         name: item.name || "Anonymous",
//         avatarUrl:
//           item.photo?.file?.url || "https://avatar.iran.liara.run/public",
//         tag: "Verified Customer", // amra chaile alada logic boshaite pari.
//         rating: item.rating || 0,
//         reviewText: item.testimonialText || "",
//         videoThumbnail:
//           item.video?.file?.thumbnailUrl || "https://placehold.co/600x400",
//         videoUrl:
//           item.video?.file?.media?.video?.resolutions?.[0]?.url ||
//           item.video?.file?.url ||
//           "",
//         submittedDate: new Date(item._createdDate).toLocaleDateString("en-US", {
//           month: "long",
//           day: "numeric",
//           year: "numeric",
//         }),
//         status: item.status?.toLowerCase() || "pending",
//       }));

//       console.log(
//         "initialTestimonials inside loadTestimonials function: ",
//         initialTestimonials
//       );
//     } else {
//       console.log("testimonial item not found!");
//     }
//   } catch (error) {
//     console.error("error: ", error);
//   }
// }

// loadTestimonials();

// // FILE: src/components/Header.js
// const Header = () => (
//   <div className="header">
//     <h1>🎥 Video Testimonials Manager updated</h1>
//   </div>
// );

// // FILE: src/components/StatusBadge.js
// const StatusBadge = ({ status }) => {
//   let badgeClass = "status-badge";
//   let text = status;

//   switch (status) {
//     case "approved":
//       badgeClass += " status-approved";
//       break;
//     case "declined":
//       badgeClass += " status-declined";
//       break;
//     case "pending":
//     default:
//       badgeClass += " status-pending";
//       break;
//   }

//   return <span className={badgeClass}>{text}</span>;
// };

// // FILE: src/components/VideoModal.js
// const VideoModal = ({ testimonial, onClose }) => {
//   const videoRef = useRef(null);

//   // Escape key or clicking outside will close the modal
//   useEffect(() => {
//     const handleKeydown = (e) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//     };

//     const handleClickOutside = (e) => {
//       if (e.target.classList.contains("modal")) {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleKeydown);
//     document.addEventListener("mousedown", handleClickOutside);
//     document.body.style.overflow = "hidden";

//     // Autoplay video on mount
//     if (videoRef.current) {
//       videoRef.current.play();
//     }

//     // Cleanup function
//     return () => {
//       document.removeEventListener("keydown", handleKeydown);
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.body.style.overflow = "auto";
//       if (videoRef.current) {
//         videoRef.current.pause();
//       }
//     };
//   }, [onClose]);

//   if (!testimonial) return null;

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={onClose}>
//           &times;
//         </span>
//         <video ref={videoRef} className="video-player" controls>
//           <source src={testimonial.videoUrl} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//         <h3>{testimonial.name}'s Testimonial</h3>
//         <p>
//           Watch the full video testimonial to get the complete story and
//           authentic experience.
//         </p>
//       </div>
//     </div>
//   );
// };

// // FILE: src/components/TestimonialCard.js
// const TestimonialCard = ({
//   testimonial,
//   onApprove,
//   onDecline,
//   onPlayVideo,
// }) => {
//   return (
//     <div className="testimonial-card">
//       <div className="user-info">
//         <img
//           src={testimonial.avatarUrl}
//           alt={testimonial.name}
//           className="user-avatar"
//         />
//         <div className="user-details">
//           <h3>{testimonial.name}</h3>
//           <span className="user-tag">{testimonial.tag}</span>
//         </div>
//       </div>
//       <div className="rating">
//         <div className="stars">
//           {"★".repeat(testimonial.rating)}
//           {"☆".repeat(5 - testimonial.rating)}
//         </div>
//         <span className="rating-text">{testimonial.rating}.0 out of 5</span>
//       </div>
//       <div className="video-section" onClick={() => onPlayVideo(testimonial)}>
//         <img
//           src={testimonial.videoThumbnail}
//           alt="Video thumbnail"
//           className="video-thumbnail"
//         />
//         <div className="play-button"></div>
//       </div>
//       <div className="review-text">
//         <p>{testimonial.reviewText}</p>
//       </div>
//       <div className="actions">
//         <button
//           className="btn btn-approve"
//           onClick={() => onApprove(testimonial.id)}
//         >
//           ✓ Approve
//         </button>
//         <button
//           className="btn btn-decline"
//           onClick={() => onDecline(testimonial.id)}
//         >
//           ✗ Decline
//         </button>
//         <StatusBadge status={testimonial.status} />
//       </div>
//       <div className="metadata">
//         <span className="date">📅 Submitted: {testimonial.submittedDate}</span>
//       </div>
//     </div>
//   );
// };

// // FILE: src/TestimonialsManager.js (Main Component)
// const TestimonialsManager = () => {
//   const [testimonials, setTestimonials] = useState(initialTestimonials);
//   const [activeModalTestimonial, setActiveModalTestimonial] = useState(null);

//   const handleUpdateStatus = (id, newStatus) => {
//     setTestimonials(
//       testimonials.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
//     );
//   };

//   const handleApprove = (id) => handleUpdateStatus(id, "approved");
//   const handleDecline = (id) => handleUpdateStatus(id, "declined");

//   return (
//     <div className="container">
//       <Header />
//       <div className="testimonials-grid">
//         {testimonials.map((testimonial) => (
//           <TestimonialCard
//             key={testimonial.id}
//             testimonial={testimonial}
//             onApprove={handleApprove}
//             onDecline={handleDecline}
//             onPlayVideo={setActiveModalTestimonial}
//           />
//         ))}
//       </div>
//       {activeModalTestimonial && (
//         <VideoModal
//           testimonial={activeModalTestimonial}
//           onClose={() => setActiveModalTestimonial(null)}
//         />
//       )}
//     </div>
//   );
// };

// // FILE: src/App.js (Entry Point)
// function App() {
//   return (
//     <>
//       <GlobalStyles />
//       <TestimonialsManager />
//     </>
//   );
// }

// export default App;
