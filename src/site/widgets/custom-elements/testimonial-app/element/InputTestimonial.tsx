import React, { useState, useRef, useEffect } from "react";
import {
  createTestimonialCMS,
  getVideoUploadUrl,
  getPhotoUploadUrl,
  addManageMediaManagerPermission,
  getFolderList,
  getAllCollections,
  saveData,
} from "../../../../../backend/data.web";

// পুরো অ্যাপ্লিকেশনের স্টাইল এখানে রাখতে পারেন অথবা একটি CSS ফাইলে import করতে পারেন।
// আমি আপনার দেওয়া স্টাইলটি একটি <style> ট্যাগের মধ্যে রেখে দিয়েছি।

/**
 *
 * নোট
 * 1.photo mime type ebong video mime type alada alada dite hobe, like video/webm, photo/jpeg etc,
 * 2. photo filename ebong video file name er .extention change korte hobe. like .webm, .jpeg etc.
 * 3. backend er "getUploadUrl" function er name change kore duita function banaite hobe, ekta photo upload korar jonno, ekta video upload korar jono. tobe peramiter pass kkore buddhi kore kora jaite pare onno style e.
 */

const GlobalStyles = () => (
  <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .app-container {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
        }
        .app-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            pointer-events: none;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            max-width: 900px;
            width: 100%;
            position: relative;
            overflow: hidden;
        }
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
            background-size: 400% 400%;
            animation: gradientFlow 4s ease infinite;
        }
        @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        .header p {
            color: #6b7280;
            font-size: 1.1rem;
            font-weight: 400;
        }
        .progress-bar {
            height: 6px;
            background: #e5e7eb;
            border-radius: 10px;
            margin-bottom: 30px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 10px;
            transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .step-indicators {
            display: flex;
            justify-content: center;
            margin-bottom: 40px;
            gap: 20px;
        }
        .step-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e5e7eb;
            color: #9ca3af;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            position: relative;
        }
        .step-indicator.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .step-indicator.completed {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }
        .step-indicator.completed::after {
            content: '✓';
            font-size: 1.2rem;
        }
        .form-step {
            animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 30px;
        }
        .form-group {
            position: relative;
        }
        .form-group label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 0.95rem;
        }
        .form-input {
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 16px;
            font-size: 1rem;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            background: #fafafa;
            color: #374151;
        }
        .form-input:focus {
            outline: none;
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            transform: translateY(-2px);
        }
        .form-input:hover {
            border-color: #9ca3af;
            background: white;
        }
        .textarea {
            resize: vertical;
            min-height: 120px;
            font-family: inherit;
        }
        .photo-upload {
            border: 2px dashed #d1d5db;
            border-radius: 16px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #fafafa;
            position: relative;
            overflow: hidden;
        }
        .photo-upload:hover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.05);
            transform: translateY(-2px);
        }
        .photo-upload.dragover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.1);
            transform: scale(1.02);
        }
        .upload-icon {
            font-size: 3rem;
            color: #9ca3af;
            margin-bottom: 16px;
            transition: all 0.3s ease;
        }
        .photo-upload:hover .upload-icon {
            color: #667eea;
            transform: scale(1.1);
        }
        .rating-stars {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin: 20px 0;
        }
        .star {
            font-size: 2.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }
        .star.empty {
            color: #d1d5db;
        }
        .star.filled {
            color: #fbbf24;
            transform: scale(1.1);
        }
        .star:hover {
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
            transform: scale(1.2);
        }
        .video-section {
            text-align: center;
            margin: 30px 0;
        }
        .video-preview {
            margin: 20px 0;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .video-preview video {
            width: 100%;
            max-width: 400px;
            height: auto;
        }
        .video-controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .capture-btn {
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: white;
            border: none;
            padding: 18px 36px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
            position: relative;
            overflow: hidden;
        }
        .capture-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4);
        }
        .capture-btn:active {
            transform: translateY(-1px) scale(1.02);
        }
        .capture-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        .capture-btn:hover::before {
            left: 100%;
        }
        .camera-switch-btn {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        }
        .camera-switch-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
        }
        .recording-indicator {
            display: none;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
            color: #dc2626;
            font-weight: 600;
        }
        .recording-indicator.active {
            display: flex;
        }
        .recording-dot {
            width: 12px;
            height: 12px;
            background: #dc2626;
            border-radius: 50%;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
        }
        .btn-group {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 40px;
        }
        .btn {
            padding: 16px 32px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            position: relative;
            overflow: hidden;
        }
        .btn-secondary {
            background: #f3f4f6;
            color: #6b7280;
            border: 2px solid #e5e7eb;
        }
        .btn-secondary:hover {
            background: #e5e7eb;
            transform: translateY(-2px);
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }
        .btn-success {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }
        .btn-success:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
        }
        .success-message {
            text-align: center;
            padding: 40px;
            animation: fadeIn 0.5s ease;
        }
        .success-icon {
            font-size: 4rem;
            color: #10b981;
            margin-bottom: 20px;
        }
        @media (max-width: 768px) {
            .container {
                padding: 24px;
                margin: 10px;
            }
            .form-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .btn-group, .video-controls {
                flex-direction: column;
            }
            .header h1 {
                font-size: 2rem;
            }
            .step-indicators {
                gap: 12px;
            }
        }
        .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
        }
        .floating-shape {
            position: absolute;
            opacity: 0.1;
            animation: float 6s ease-in-out infinite;
        }
        .floating-shape:nth-child(1) {
            top: 10%;
            left: 10%;
            animation-delay: 0s;
        }
        .floating-shape:nth-child(2) {
            top: 70%;
            right: 10%;
            animation-delay: 2s;
        }
        .floating-shape:nth-child(3) {
            bottom: 10%;
            left: 30%;
            animation-delay: 4s;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
    `}</style>
);

// FILE: src/components/FormHeader.js
const FormHeader = () => (
  <div className="header">
    <h1>✨ Share Your Experience</h1>
    <p>Help others by sharing your amazing experience with us</p>
  </div>
);

// FILE: src/components/ProgressBar.js
const ProgressBar = ({ currentStep, totalSteps }: any) => {
  const percentage = (currentStep / totalSteps) * 100;
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

// FILE: src/components/StepIndicators.js
const StepIndicators = ({ currentStep, totalSteps }: any) => (
  <div className="step-indicators">
    {[...Array(totalSteps)].map((_, index) => {
      const stepNumber = index + 1;
      let className = "step-indicator";
      if (stepNumber < currentStep) {
        className += " completed";
      } else if (stepNumber === currentStep) {
        className += " active";
      }
      return (
        <div key={stepNumber} className={className}>
          {stepNumber < currentStep ? "" : stepNumber}
        </div>
      );
    })}
  </div>
);

// FILE: src/components/Step1.js
const Step1 = ({ formData, handleChange, handlePhotoUpload }: any) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef<any>(null);

  const handleFileChange = (file: any) => {
    if (file) {
      handlePhotoUpload(file);
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => e.preventDefault();
  const handleDrop = (e: any) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="form-step">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            placeholder="Enter your full name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            className="form-input"
            placeholder="Your company name"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            className="form-input"
            placeholder="Your job title"
            value={formData.jobTitle}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Profile Photo</label>
          <div
            className="photo-upload"
            onClick={() => photoInputRef.current.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {photoPreview ? (
              <>
                <img
                  src={photoPreview}
                  alt="Profile Preview"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />
                <p
                  style={{
                    marginTop: "12px",
                    color: "#10b981",
                    fontWeight: "600",
                  }}
                >
                  ✓ Photo Uploaded
                </p>
              </>
            ) : (
              <>
                <div className="upload-icon">📷</div>
                <p>
                  <strong>Upload Photo</strong>
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                  Drag & drop or click to browse
                </p>
              </>
            )}
            <input
              type="file"
              id="photoInput"
              accept="image/*"
              style={{ display: "none" }}
              ref={photoInputRef}
              onChange={(e: any) => handleFileChange(e.target.files[0])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// FILE: src/components/Step2.js
const Step2 = ({ formData, handleChange, rating, setRating }: any) => (
  <div className="form-step">
    <div className="form-group">
      <label>Rate Your Experience</label>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : "empty"}`}
            data-rating={star}
            onClick={() => setRating(star)}
          >
            {star <= rating ? "⭐" : "☆"}
          </span>
        ))}
      </div>
    </div>
    <div className="form-group">
      <label htmlFor="testimonialText">Your Testimonial *</label>
      <textarea
        id="testimonialText"
        name="testimonialText"
        className="form-input textarea"
        placeholder="Share your experience... Tell us how our product/service helped you achieve your goals. Be specific about the benefits you experienced."
        required
        value={formData.testimonialText}
        onChange={handleChange}
      ></textarea>
    </div>
  </div>
);

// FILE: src/components/Step3.js
const Step3 = ({ setVideoBlob }: any) => {
  const [isRecording, setIsRecording] = useState<any>(false);
  const [videoUrl, setVideoUrl] = useState<any>(null);
  const [currentCamera, setCurrentCamera] = useState<any>("user"); // 'user' for front, 'environment' for back
  const [cameraInitialized, setCameraInitialized] = useState<any>(false);
  const videoElementRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const streamRef = useRef<any>(null);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: any) => track.stop());
      streamRef.current = null;
    }
  };

  // Initialize camera on component mount
  useEffect(() => {
    initializeCamera();
    return () => {
      cleanupStream();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      cleanupStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentCamera,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      streamRef.current = stream;
      videoElementRef.current.srcObject = stream;
      videoElementRef.current.play();
      videoElementRef.current.muted = true;
      setCameraInitialized(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Unable to access camera. Please ensure you have granted camera permissions."
      );
    }
  };

  const switchCamera = async () => {
    const newCamera = currentCamera === "user" ? "environment" : "user";
    setCurrentCamera(newCamera);

    try {
      cleanupStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newCamera,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      streamRef.current = stream;
      videoElementRef.current.srcObject = stream;
      videoElementRef.current.play();
      videoElementRef.current.muted = true;
    } catch (error) {
      console.error("Error switching camera:", error);
      alert(
        "Unable to switch camera. Please check your device supports multiple cameras."
      );
      // Revert back to previous camera
      setCurrentCamera(currentCamera);
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      await initializeCamera();
    }

    setVideoUrl(null); // Clear previous recording
    try {
      const recorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = recorder;
      let recordedChunks: any = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

        // Show the recorded video
        videoElementRef.current.srcObject = null;
        videoElementRef.current.src = url;
        videoElementRef.current.controls = true;
        videoElementRef.current.muted = false;
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Unable to start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCaptureClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const resetCamera = async () => {
    setVideoUrl(null);
    await initializeCamera();
    if (videoElementRef.current) {
      videoElementRef.current.controls = false;
    }
  };

  return (
    <div className="form-step">
      <div className="video-section">
        <h3 style={{ marginBottom: "20px", color: "#374151" }}>
          📹 Record Your Video Testimonial
        </h3>
        <p style={{ color: "#6b7280", marginBottom: "30px" }}>
          A video testimonial adds authenticity and helps others connect with
          your experience
        </p>
        <div className="video-preview" style={{ display: "block" }}>
          <video ref={videoElementRef} autoPlay muted playsInline></video>
        </div>

        {isRecording && (
          <div className="recording-indicator active">
            <div className="recording-dot"></div>
            <span>Recording in progress...</span>
          </div>
        )}

        <div className="video-controls">
          {!isRecording && !videoUrl && cameraInitialized && (
            <button
              type="button"
              className="camera-switch-btn"
              onClick={switchCamera}
            >
              📱 Switch Camera ({currentCamera === "user" ? "Front" : "Back"})
            </button>
          )}

          <button
            type="button"
            className="capture-btn"
            onClick={handleCaptureClick}
            style={
              isRecording
                ? { background: "linear-gradient(135deg, #dc2626, #b91c1c)" }
                : {}
            }
          >
            {isRecording
              ? "⏹️ Stop Recording"
              : videoUrl
              ? "🎥 Record Again"
              : "🎥 Start Recording"}
          </button>

          {videoUrl && (
            <button
              type="button"
              className="camera-switch-btn"
              onClick={resetCamera}
            >
              📹 Reset Camera
            </button>
          )}
        </div>

        <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginTop: "16px" }}>
          💡 Tip: Look at the camera, speak clearly, and keep it under 2 minutes
        </p>
      </div>
    </div>
  );
};

// FILE: src/components/SuccessMessage.js
const SuccessMessage = () => (
  <div className="success-message">
    <div className="success-icon">🎉</div>
    <h2 style={{ color: "#10b981", marginBottom: "16px" }}>Thank You!</h2>
    <p style={{ color: "#6b7280" }}>
      Your testimonial has been submitted successfully. We'll review it and get
      back to you soon.
    </p>
  </div>
);

// FILE: src/TestimonialForm.js (Main Component)
const TestimonialForm = () => {
  const TOTAL_STEPS = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    testimonialText: "",
    photo: null,
    video: null,
  });
  const [rating, setRating] = useState(0);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (file: any) => {
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const setVideoBlob = (blob: any) => {
    setFormData((prev) => ({ ...prev, video: blob }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email) {
        alert("Please fill in your name and email address");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.testimonialText || rating === 0) {
        alert("Please provide a rating and write your testimonial");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  function generateRandomId(length = 8) {
    return Math.random().toString(36).substr(2, length);
  }

  async function hasTestimonialsCollection() {
    const { collections = [] } = await getAllCollections();
    return collections.some((item) => item._id === "testimonials");
  }

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    console.log("Submitting Form Data:", { ...formData, rating });

    try {
      // 1️⃣ Check Testimonials collection
      if (await hasTestimonialsCollection()) {
        console.log("Testimonials collection আছে!");
      } else {
        console.log("Testimonials collection নেই, create করা হচ্ছে।");
        const createCMS = await createTestimonialCMS();
        console.log("create CMS: ", createCMS);
      }

      // 2️⃣ Generate random ID for filename
      const randomId = generateRandomId();

      // 3️⃣ Local copy of formData
      let updatedFormData: any = {
        ...formData,
        rating,
        status: "pending",
        submittedAt: new Date(),
      };

      // 4️⃣ Video upload
      if (formData.video) {
        const uploadVideoUrl = await getVideoUploadUrl(randomId); // random id for filename
        console.log("uploadVideoUrl: ", uploadVideoUrl);

        const videoMimeType = "video/webm";

        const uploadVideoResponse = await fetch(uploadVideoUrl || "", {
          method: "PUT",
          headers: { "Content-Type": videoMimeType },
          body: formData.video,
        });

        let uploadedVideoData = {};
        if (uploadVideoResponse.ok) {
          try {
            uploadedVideoData = await uploadVideoResponse.json();
          } catch {
            uploadedVideoData = { url: uploadVideoUrl }; // fallback: just URL
          }
          updatedFormData.video = uploadedVideoData;
        } else {
          throw new Error("Video upload failed");
        }
      }

      // 5️⃣ Photo upload
      if (formData.photo) {
        const uploadPhotoUrl = await getPhotoUploadUrl(randomId);
        console.log("uploadPhotoUrl: ", uploadPhotoUrl);

        const photoMimeType = "image/jpeg";

        const uploadPhotoResponse = await fetch(uploadPhotoUrl || "", {
          method: "PUT",
          headers: { "Content-Type": photoMimeType },
          body: formData.photo,
        });

        let uploadedPhotoData = {};
        if (uploadPhotoResponse.ok) {
          try {
            uploadedPhotoData = await uploadPhotoResponse.json();
          } catch {
            uploadedPhotoData = { url: uploadPhotoUrl }; // fallback
          }
          updatedFormData.photo = uploadedPhotoData;
        } else {
          throw new Error("Photo upload failed");
        }
      }

      // 6️⃣ Save in CMS
      const toSave = {
        ...updatedFormData,
        videoUrl:
          updatedFormData?.video?.file?.media?.video?.resolutions?.[0]?.url ||
          updatedFormData.video?.file?.url ||
          "",
        avatarUrl: updatedFormData?.photo?.file?.url,
        tag: "Verified Customer",
        videoThumbnail: updatedFormData?.video?.file?.thumbnailUrl || "",
      };
      const saveDataInCMS = await saveData(toSave);
      console.log("saveDataInCMS: ", saveDataInCMS);

      if (saveDataInCMS) {
        setFormData(updatedFormData); //   finally update state
        setIsSubmitted(true);
      } else {
        alert("Failed to save in CMS");
      }
    } catch (error) {
      console.log("Failed to submit: ", error);
      alert(`Failed to submit: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      {!isSubmitted ? (
        <>
          <FormHeader />
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          <StepIndicators currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          {currentStep === 1 && (
            <Step1
              formData={formData}
              handleChange={handleChange}
              handlePhotoUpload={handlePhotoUpload}
            />
          )}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              handleChange={handleChange}
              rating={rating}
              setRating={setRating}
            />
          )}
          {currentStep === 3 && <Step3 setVideoBlob={setVideoBlob} />}

          <div className="btn-group">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePrev}
              >
                ← Previous
              </button>
            )}
            {currentStep < TOTAL_STEPS && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next →
              </button>
            )}
            {currentStep === TOTAL_STEPS && (
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "⏳ Submitting..." : "🚀 Submit Testimonial"}
              </button>
            )}
          </div>
        </>
      ) : (
        <SuccessMessage />
      )}
    </div>
  );
};

// FILE: src/App.js (Entry Point)
function InputTestimonial() {
  return (
    <div className="app-container">
      <GlobalStyles />
      <div className="floating-shapes">
        <div className="floating-shape">🌟</div>
        <div className="floating-shape">✨</div>
        <div className="floating-shape">💫</div>
      </div>
      <TestimonialForm />
    </div>
  );
}

export default InputTestimonial;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   createTestimonialCMS,
//   getVideoUploadUrl,
//   getPhotoUploadUrl,
//   addManageMediaManagerPermission,
//   getFolderList,
//   getAllCollections,
//   saveData,
// } from "../../../../../backend/data.web";

// // পুরো অ্যাপ্লিকেশনের স্টাইল এখানে রাখতে পারেন অথবা একটি CSS ফাইলে import করতে পারেন।
// // আমি আপনার দেওয়া স্টাইলটি একটি <style> ট্যাগের মধ্যে রেখে দিয়েছি।

// /**
//  *
//  * নোট
//  * 1.photo mime type ebong video mime type alada alada dite hobe, like video/webm, photo/jpeg etc,
//  * 2. photo filename ebong video file name er .extention change korte hobe. like .webm, .jpeg etc.
//  * 3. backend er "getUploadUrl" function er name change kore duita function banaite hobe, ekta photo upload korar jonno, ekta video upload korar jono. tobe peramiter pass kkore buddhi kore kora jaite pare onno style e.
//  */

// const GlobalStyles = () => (
//   <style>{`
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
//         body {
//             font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             min-height: 100vh;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             padding: 20px;
//             position: relative;
//             overflow-x: hidden;
//         }
//         body::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
//             pointer-events: none;
//         }
//         .container {
//             background: rgba(255, 255, 255, 0.95);
//             backdrop-filter: blur(20px);
//             border-radius: 24px;
//             padding: 40px;
//             box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
//             border: 1px solid rgba(255, 255, 255, 0.3);
//             max-width: 900px;
//             width: 100%;
//             position: relative;
//             overflow: hidden;
//         }
//         .container::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             height: 4px;
//             background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
//             background-size: 400% 400%;
//             animation: gradientFlow 4s ease infinite;
//         }
//         @keyframes gradientFlow {
//             0%, 100% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//         }
//         .header {
//             text-align: center;
//             margin-bottom: 40px;
//         }
//         .header h1 {
//             font-size: 2.5rem;
//             font-weight: 800;
//             background: linear-gradient(135deg, #667eea, #764ba2);
//             -webkit-background-clip: text;
//             -webkit-text-fill-color: transparent;
//             background-clip: text;
//             margin-bottom: 10px;
//         }
//         .header p {
//             color: #6b7280;
//             font-size: 1.1rem;
//             font-weight: 400;
//         }
//         .progress-bar {
//             height: 6px;
//             background: #e5e7eb;
//             border-radius: 10px;
//             margin-bottom: 30px;
//             overflow: hidden;
//         }
//         .progress-fill {
//             height: 100%;
//             background: linear-gradient(90deg, #667eea, #764ba2);
//             border-radius: 10px;
//             transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//         }
//         .step-indicators {
//             display: flex;
//             justify-content: center;
//             margin-bottom: 40px;
//             gap: 20px;
//         }
//         .step-indicator {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             width: 40px;
//             height: 40px;
//             border-radius: 50%;
//             background: #e5e7eb;
//             color: #9ca3af;
//             font-weight: 600;
//             font-size: 1.1rem;
//             transition: all 0.3s ease;
//             position: relative;
//         }
//         .step-indicator.active {
//             background: linear-gradient(135deg, #667eea, #764ba2);
//             color: white;
//             transform: scale(1.1);
//             box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
//         }
//         .step-indicator.completed {
//             background: linear-gradient(135deg, #10b981, #059669);
//             color: white;
//         }
//         .step-indicator.completed::after {
//             content: '✓';
//             font-size: 1.2rem;
//         }
//         .form-step {
//             animation: fadeIn 0.5s ease;
//         }
//         @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(20px); }
//             to { opacity: 1; transform: translateY(0); }
//         }
//         .form-grid {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//             gap: 24px;
//             margin-bottom: 30px;
//         }
//         .form-group {
//             position: relative;
//         }
//         .form-group label {
//             display: block;
//             font-weight: 600;
//             color: #374151;
//             margin-bottom: 8px;
//             font-size: 0.95rem;
//         }
//         .form-input {
//             width: 100%;
//             padding: 16px 20px;
//             border: 2px solid #e5e7eb;
//             border-radius: 16px;
//             font-size: 1rem;
//             transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//             background: #fafafa;
//             color: #374151;
//         }
//         .form-input:focus {
//             outline: none;
//             border-color: #667eea;
//             background: white;
//             box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
//             transform: translateY(-2px);
//         }
//         .form-input:hover {
//             border-color: #9ca3af;
//             background: white;
//         }
//         .textarea {
//             resize: vertical;
//             min-height: 120px;
//             font-family: inherit;
//         }
//         .photo-upload {
//             border: 2px dashed #d1d5db;
//             border-radius: 16px;
//             padding: 40px 20px;
//             text-align: center;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             background: #fafafa;
//             position: relative;
//             overflow: hidden;
//         }
//         .photo-upload:hover {
//             border-color: #667eea;
//             background: rgba(102, 126, 234, 0.05);
//             transform: translateY(-2px);
//         }
//         .photo-upload.dragover {
//             border-color: #667eea;
//             background: rgba(102, 126, 234, 0.1);
//             transform: scale(1.02);
//         }
//         .upload-icon {
//             font-size: 3rem;
//             color: #9ca3af;
//             margin-bottom: 16px;
//             transition: all 0.3s ease;
//         }
//         .photo-upload:hover .upload-icon {
//             color: #667eea;
//             transform: scale(1.1);
//         }
//         .rating-stars {
//             display: flex;
//             gap: 8px;
//             justify-content: center;
//             margin: 20px 0;
//         }
//         .star {
//             font-size: 2.5rem;
//             color: #d1d5db;
//             cursor: pointer;
//             transition: all 0.2s ease;
//             user-select: none;
//         }
//         .star:hover,
//         .star.active {
//             color: #fbbf24;
//             transform: scale(1.1);
//         }
//         .star:hover {
//             filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
//         }
//         .video-section {
//             text-align: center;
//             margin: 30px 0;
//         }
//         .video-preview {
//             margin: 20px 0;
//             border-radius: 16px;
//             overflow: hidden;
//             box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//         }
//         .video-preview video {
//             width: 100%;
//             max-width: 400px;
//             height: auto;
//         }
//         .capture-btn {
//             background: linear-gradient(135deg, #ff6b6b, #ee5a52);
//             color: white;
//             border: none;
//             padding: 18px 36px;
//             border-radius: 50px;
//             font-size: 1.1rem;
//             font-weight: 600;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
//             position: relative;
//             overflow: hidden;
//         }
//         .capture-btn:hover {
//             transform: translateY(-3px) scale(1.05);
//             box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4);
//         }
//         .capture-btn:active {
//             transform: translateY(-1px) scale(1.02);
//         }
//         .capture-btn::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: -100%;
//             width: 100%;
//             height: 100%;
//             background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
//             transition: left 0.5s;
//         }
//         .capture-btn:hover::before {
//             left: 100%;
//         }
//         .recording-indicator {
//             display: none;
//             align-items: center;
//             justify-content: center;
//             gap: 10px;
//             margin: 20px 0;
//             color: #dc2626;
//             font-weight: 600;
//         }
//         .recording-indicator.active {
//             display: flex;
//         }
//         .recording-dot {
//             width: 12px;
//             height: 12px;
//             background: #dc2626;
//             border-radius: 50%;
//             animation: pulse 1s infinite;
//         }
//         @keyframes pulse {
//             0%, 100% { opacity: 1; transform: scale(1); }
//             50% { opacity: 0.5; transform: scale(1.1); }
//         }
//         .btn-group {
//             display: flex;
//             gap: 16px;
//             justify-content: center;
//             margin-top: 40px;
//         }
//         .btn {
//             padding: 16px 32px;
//             border-radius: 16px;
//             font-weight: 600;
//             font-size: 1rem;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             border: none;
//             position: relative;
//             overflow: hidden;
//         }
//         .btn-secondary {
//             background: #f3f4f6;
//             color: #6b7280;
//             border: 2px solid #e5e7eb;
//         }
//         .btn-secondary:hover {
//             background: #e5e7eb;
//             transform: translateY(-2px);
//         }
//         .btn-primary {
//             background: linear-gradient(135deg, #667eea, #764ba2);
//             color: white;
//             box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
//         }
//         .btn-primary:hover {
//             transform: translateY(-3px);
//             box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
//         }
//         .btn-success {
//             background: linear-gradient(135deg, #10b981, #059669);
//             color: white;
//             box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
//         }
//         .btn-success:hover {
//             transform: translateY(-3px);
//             box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
//         }
//         .success-message {
//             text-align: center;
//             padding: 40px;
//             animation: fadeIn 0.5s ease;
//         }
//         .success-icon {
//             font-size: 4rem;
//             color: #10b981;
//             margin-bottom: 20px;
//         }
//         @media (max-width: 768px) {
//             .container {
//                 padding: 24px;
//                 margin: 10px;
//             }
//             .form-grid {
//                 grid-template-columns: 1fr;
//                 gap: 20px;
//             }
//             .btn-group {
//                 flex-direction: column;
//             }
//             .header h1 {
//                 font-size: 2rem;
//             }
//             .step-indicators {
//                 gap: 12px;
//             }
//         }
//         .floating-shapes {
//             position: absolute;
//             width: 100%;
//             height: 100%;
//             overflow: hidden;
//             pointer-events: none;
//         }
//         .floating-shape {
//             position: absolute;
//             opacity: 0.1;
//             animation: float 6s ease-in-out infinite;
//         }
//         .floating-shape:nth-child(1) {
//             top: 10%;
//             left: 10%;
//             animation-delay: 0s;
//         }
//         .floating-shape:nth-child(2) {
//             top: 70%;
//             right: 10%;
//             animation-delay: 2s;
//         }
//         .floating-shape:nth-child(3) {
//             bottom: 10%;
//             left: 30%;
//             animation-delay: 4s;
//         }
//         @keyframes float {
//             0%, 100% { transform: translateY(0px) rotate(0deg); }
//             50% { transform: translateY(-20px) rotate(180deg); }
//         }
//     `}</style>
// );

// // FILE: src/components/FormHeader.js
// const FormHeader = () => (
//   <div className="header">
//     <h1>✨ Share Your Experience</h1>
//     <p>Help others by sharing your amazing experience with us</p>
//   </div>
// );

// // FILE: src/components/ProgressBar.js
// const ProgressBar = ({ currentStep, totalSteps }) => {
//   const percentage = (currentStep / totalSteps) * 100;
//   return (
//     <div className="progress-bar">
//       <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
//     </div>
//   );
// };

// // FILE: src/components/StepIndicators.js
// const StepIndicators = ({ currentStep, totalSteps }) => (
//   <div className="step-indicators">
//     {[...Array(totalSteps)].map((_, index) => {
//       const stepNumber = index + 1;
//       let className = "step-indicator";
//       if (stepNumber < currentStep) {
//         className += " completed";
//       } else if (stepNumber === currentStep) {
//         className += " active";
//       }
//       return (
//         <div key={stepNumber} className={className}>
//           {stepNumber < currentStep ? "" : stepNumber}
//         </div>
//       );
//     })}
//   </div>
// );

// // FILE: src/components/Step1.js
// const Step1 = ({ formData, handleChange, handlePhotoUpload }) => {
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const photoInputRef = useRef(null);

//   const handleFileChange = (file) => {
//     if (file) {
//       handlePhotoUpload(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhotoPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDragOver = (e) => e.preventDefault();
//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFileChange(e.dataTransfer.files[0]);
//     }
//   };

//   return (
//     <div className="form-step">
//       <div className="form-grid">
//         <div className="form-group">
//           <label htmlFor="name">Full Name *</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             className="form-input"
//             placeholder="Enter your full name"
//             required
//             value={formData.name}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="email">Email Address *</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             className="form-input"
//             placeholder="your@email.com"
//             required
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="phone">Phone Number</label>
//           <input
//             type="tel"
//             id="phone"
//             name="phone"
//             className="form-input"
//             placeholder="+1 (555) 000-0000"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="company">Company</label>
//           <input
//             type="text"
//             id="company"
//             name="company"
//             className="form-input"
//             placeholder="Your company name"
//             value={formData.company}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="jobTitle">Job Title</label>
//           <input
//             type="text"
//             id="jobTitle"
//             name="jobTitle"
//             className="form-input"
//             placeholder="Your job title"
//             value={formData.jobTitle}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="photo">Profile Photo</label>
//           <div
//             className="photo-upload"
//             onClick={() => photoInputRef.current.click()}
//             onDragOver={handleDragOver}
//             onDrop={handleDrop}
//           >
//             {photoPreview ? (
//               <>
//                 <img
//                   src={photoPreview}
//                   alt="Profile Preview"
//                   style={{
//                     maxWidth: "100px",
//                     maxHeight: "100px",
//                     borderRadius: "12px",
//                     objectFit: "cover",
//                   }}
//                 />
//                 <p
//                   style={{
//                     marginTop: "12px",
//                     color: "#10b981",
//                     fontWeight: "600",
//                   }}
//                 >
//                   ✓ Photo Uploaded
//                 </p>
//               </>
//             ) : (
//               <>
//                 <div className="upload-icon">📷</div>
//                 <p>
//                   <strong>Upload Photo</strong>
//                 </p>
//                 <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
//                   Drag & drop or click to browse
//                 </p>
//               </>
//             )}
//             <input
//               type="file"
//               id="photoInput"
//               accept="image/*"
//               style={{ display: "none" }}
//               ref={photoInputRef}
//               onChange={(e) => handleFileChange(e.target.files[0])}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // FILE: src/components/Step2.js
// const Step2 = ({ formData, handleChange, rating, setRating }) => (
//   <div className="form-step">
//     <div className="form-group">
//       <label>Rate Your Experience</label>
//       <div className="rating-stars">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <span
//             key={star}
//             className={`star ${star <= rating ? "active" : ""}`}
//             data-rating={star}
//             onClick={() => setRating(star)}
//           >
//             ⭐
//           </span>
//         ))}
//       </div>
//     </div>
//     <div className="form-group">
//       <label htmlFor="testimonialText">Your Testimonial *</label>
//       <textarea
//         id="testimonialText"
//         name="testimonialText"
//         className="form-input textarea"
//         placeholder="Share your experience... Tell us how our product/service helped you achieve your goals. Be specific about the benefits you experienced."
//         required
//         value={formData.testimonialText}
//         onChange={handleChange}
//       ></textarea>
//     </div>
//   </div>
// );

// // FILE: src/components/Step3.js
// const Step3 = ({ setVideoBlob }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const videoElementRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const streamRef = useRef(null);

//   const cleanupStream = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//   };

//   // Cleanup on component unmount
//   useEffect(() => {
//     return () => {
//       cleanupStream();
//     };
//   }, []);

//   const startRecording = async () => {
//     setVideoUrl(null); // Clear previous recording
//     try {
//       cleanupStream(); // Ensure any previous stream is stopped
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: { ideal: 1280 }, height: { ideal: 720 } },
//         audio: true,
//       });

//       console.log("stream: ", stream);

//       streamRef.current = stream;
//       videoElementRef.current.srcObject = stream;
//       videoElementRef.current.play(); // Start preview
//       videoElementRef.current.muted = true;

//       const recorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = recorder;
//       let recordedChunks = [];

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           recordedChunks.push(event.data);
//         }
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(recordedChunks, { type: "video/webm" });
//         setVideoBlob(blob);
//         const url = URL.createObjectURL(blob);
//         setVideoUrl(url);
//         cleanupStream();

//         // Show the recorded video
//         videoElementRef.current.srcObject = null;
//         videoElementRef.current.src = url;
//         videoElementRef.current.controls = true;
//         videoElementRef.current.muted = false;
//       };

//       recorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       alert(
//         "Unable to access camera. Please ensure you have granted camera permissions."
//       );
//     }
//   };

//   const stopRecording = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state !== "inactive"
//     ) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const handleCaptureClick = () => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   };

//   return (
//     <div className="form-step">
//       <div className="video-section">
//         <h3 style={{ marginBottom: "20px", color: "#374151" }}>
//           📹 Record Your Video Testimonial
//         </h3>
//         <p style={{ color: "#6b7280", marginBottom: "30px" }}>
//           A video testimonial adds authenticity and helps others connect with
//           your experience
//         </p>
//         <div className="video-preview" style={{ display: "block" }}>
//           <video ref={videoElementRef} autoPlay muted playsInline></video>
//         </div>
//         {isRecording && (
//           <div className="recording-indicator active">
//             <div className="recording-dot"></div>
//             <span>Recording in progress...</span>
//           </div>
//         )}
//         <button
//           type="button"
//           className="capture-btn"
//           onClick={handleCaptureClick}
//           style={
//             isRecording
//               ? { background: "linear-gradient(135deg, #dc2626, #b91c1c)" }
//               : {}
//           }
//         >
//           {isRecording
//             ? "⏹️ Stop Recording"
//             : videoUrl
//             ? "🎥 Record Again"
//             : "🎥 Start Recording"}
//         </button>
//         <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginTop: "16px" }}>
//           💡 Tip: Look at the camera, speak clearly, and keep it under 2 minutes
//         </p>
//       </div>
//     </div>
//   );
// };

// // FILE: src/components/SuccessMessage.js
// const SuccessMessage = () => (
//   <div className="success-message">
//     <div className="success-icon">🎉</div>
//     <h2 style={{ color: "#10b981", marginBottom: "16px" }}>Thank You!</h2>
//     <p style={{ color: "#6b7280" }}>
//       Your testimonial has been submitted successfully. We'll review it and get
//       back to you soon.
//     </p>
//   </div>
// );

// // FILE: src/TestimonialForm.js (Main Component)
// const TestimonialForm = () => {
//   const TOTAL_STEPS = 3;
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     jobTitle: "",
//     testimonialText: "",
//     photo: null,
//     video: null,
//   });
//   const [rating, setRating] = useState(0);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoUpload = (file) => {
//     setFormData((prev) => ({ ...prev, photo: file }));
//   };

//   const setVideoBlob = (blob) => {
//     setFormData((prev) => ({ ...prev, video: blob }));
//   };

//   const validateStep = () => {
//     if (currentStep === 1) {
//       if (!formData.name || !formData.email) {
//         alert("Please fill in your name and email address");
//         return false;
//       }
//     } else if (currentStep === 2) {
//       if (!formData.testimonialText || rating === 0) {
//         alert("Please provide a rating and write your testimonial");
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleNext = () => {
//     if (validateStep()) {
//       if (currentStep < TOTAL_STEPS) {
//         setCurrentStep(currentStep + 1);
//       }
//     }
//   };

//   const handlePrev = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   function generateRandomId(length = 8) {
//     return Math.random().toString(36).substr(2, length);
//   }

//   async function hasTestimonialsCollection() {
//     const { collections = [] } = await getAllCollections();
//     return collections.some((item) => item._id === "testimonials");
//   }

//   const handleSubmit = async () => {
//     if (!validateStep()) return;

//     setIsSubmitting(true);

//     console.log("Submitting Form Data:", { ...formData, rating });

//     try {
//       // 1️⃣ Check Testimonials collection
//       if (await hasTestimonialsCollection()) {
//         console.log("Testimonials collection আছে!");
//       } else {
//         console.log("Testimonials collection নেই, create করা হচ্ছে।");
//         const createCMS = await createTestimonialCMS();
//         console.log("create CMS: ", createCMS);
//       }

//       // 2️⃣ Generate random ID for filename
//       const randomId = generateRandomId();

//       // 3️⃣ Local copy of formData
//       let updatedFormData = { ...formData, rating, status: "Pending" };

//       // 4️⃣ Video upload
//       if (formData.video) {
//         const uploadVideoUrl = await getVideoUploadUrl(randomId); // random id for filename
//         console.log("uploadVideoUrl: ", uploadVideoUrl);

//         const videoMimeType = "video/webm";

//         const uploadVideoResponse = await fetch(uploadVideoUrl || "", {
//           method: "PUT",
//           headers: { "Content-Type": videoMimeType },
//           body: formData.video,
//         });

//         let uploadedVideoData = {};
//         if (uploadVideoResponse.ok) {
//           try {
//             uploadedVideoData = await uploadVideoResponse.json();
//           } catch {
//             uploadedVideoData = { url: uploadVideoUrl }; // fallback: just URL
//           }
//           updatedFormData.video = uploadedVideoData;
//         } else {
//           throw new Error("Video upload failed");
//         }
//       }

//       // 5️⃣ Photo upload
//       if (formData.photo) {
//         const uploadPhotoUrl = await getPhotoUploadUrl(randomId);
//         console.log("uploadPhotoUrl: ", uploadPhotoUrl);

//         const photoMimeType = "image/jpeg";

//         const uploadPhotoResponse = await fetch(uploadPhotoUrl || "", {
//           method: "PUT",
//           headers: { "Content-Type": photoMimeType },
//           body: formData.photo,
//         });

//         let uploadedPhotoData = {};
//         if (uploadPhotoResponse.ok) {
//           try {
//             uploadedPhotoData = await uploadPhotoResponse.json();
//           } catch {
//             uploadedPhotoData = { url: uploadPhotoUrl }; // fallback
//           }
//           updatedFormData.photo = uploadedPhotoData;
//         } else {
//           throw new Error("Photo upload failed");
//         }
//       }

//       // 6️⃣ Save in CMS
//       const saveDataInCMS = await saveData(updatedFormData);
//       console.log("saveDataInCMS: ", saveDataInCMS);

//       if (saveDataInCMS) {
//         setFormData(updatedFormData); //   finally update state
//         setIsSubmitted(true);
//       } else {
//         alert("Failed to save in CMS");
//       }
//     } catch (error) {
//       console.log("Failed to submit: ", error);
//       alert(`Failed to submit: ${error}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // const handleSubmit = async () => {
//   //   if (validateStep()) {
//   //     setIsSubmitting(true);
//   //     console.log("Submitting Form Data:", { ...formData, rating });

//   //     try {
//   //       // testimonial CMS create kora
//   //       if (await hasTestimonialsCollection()) {
//   //         console.log("Testimonials collection আছে!");
//   //       } else {
//   //         console.log("Testimonials collection নাই, ক্রিয়েট করা হচ্ছে ।");

//   //         const createCMS = await createTestimonialCMS();
//   //         console.log("create CMS: ", createCMS);
//   //       }

//   //       // filename er jonno random id generate kora
//   //       const randomId = generateRandomId();

//   //       // video upload korar function
//   //       const uploadVideoUrl = await getVideoUploadUrl(randomId);
//   //       console.log("uploadVideoUrl: ", uploadVideoUrl);

//   //       const videoMimeType = "video/webm";

//   //       const uploadVideoResponse = await fetch(uploadVideoUrl || "", {
//   //         method: "PUT",
//   //         headers: { "Content-Type": videoMimeType },
//   //         body: formData.video,
//   //       });

//   //       const uploadedVideoData = await uploadVideoResponse.json();
//   //       console.log("uploadedVideoData: ", uploadedVideoData);

//   //       // video object update kora
//   //       setFormData((prev) => ({
//   //         ...prev,
//   //         video: uploadedVideoData,
//   //       }));

//   //       // profile photo upload korar function
//   //       if (formData.photo) {
//   //         try {
//   //           const uploadPhotoUrl = await getPhotoUploadUrl(randomId);
//   //           console.log("uploadPhotoUrl: ", uploadPhotoUrl);

//   //           const photoMimeType = "image/jpeg";

//   //           const uploadPhotoResponse = await fetch(uploadPhotoUrl || "", {
//   //             method: "PUT",
//   //             headers: { "Content-Type": photoMimeType },
//   //             body: formData.photo,
//   //           });

//   //           const uploadedPhotoData = await uploadPhotoResponse.json();
//   //           console.log("uploadedPhotoData: ", uploadedPhotoData);

//   //           // photo object update kora
//   //           setFormData((prev) => ({
//   //             ...prev,
//   //             photo: uploadedPhotoData,
//   //           }));
//   //         } catch (error) {
//   //           console.log("error from uploadProfilePhoto: ", error);
//   //           alert("profile photo upload error");
//   //         }
//   //       }

//   //       if (uploadVideoResponse.ok) {
//   //         //  && uploadProfilePhoto.ok

//   //         const saveDataInCMS = await saveData(formData);
//   //         console.log("saveDataInCMS: ", saveDataInCMS);

//   //         if (saveDataInCMS) {
//   //           setIsSubmitted(true);
//   //         } else {
//   //           setIsSubmitting(false);
//   //           alert("Failed to save in CMS");
//   //         }
//   //       } else {
//   //         console.log("Failed to submit");
//   //         alert("Failed to submit");
//   //       }
//   //       setIsSubmitting(false);
//   //     } catch (error) {
//   //       console.log("Failed to submit: ", error);
//   //       alert(`Failed to submit: ${error}`);
//   //       setIsSubmitting(false);
//   //     }

//   //     // Simulate API call
//   //     // setTimeout(() => {
//   //     //   setIsSubmitting(false);
//   //     //   setIsSubmitted(true);
//   //     // }, 2000);
//   //   }
//   // };

//   return (
//     <div className="container">
//       {!isSubmitted ? (
//         <>
//           <FormHeader />
//           <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
//           <StepIndicators currentStep={currentStep} totalSteps={TOTAL_STEPS} />

//           {currentStep === 1 && (
//             <Step1
//               formData={formData}
//               handleChange={handleChange}
//               handlePhotoUpload={handlePhotoUpload}
//             />
//           )}
//           {currentStep === 2 && (
//             <Step2
//               formData={formData}
//               handleChange={handleChange}
//               rating={rating}
//               setRating={setRating}
//             />
//           )}
//           {currentStep === 3 && <Step3 setVideoBlob={setVideoBlob} />}

//           <div className="btn-group">
//             {currentStep > 1 && (
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={handlePrev}
//               >
//                 ← Previous
//               </button>
//             )}
//             {currentStep < TOTAL_STEPS && (
//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 onClick={handleNext}
//               >
//                 Next →
//               </button>
//             )}
//             {currentStep === TOTAL_STEPS && (
//               <button
//                 type="button"
//                 className="btn btn-success"
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "⏳ Submitting..." : "🚀 Submit Testimonial"}
//               </button>
//             )}
//           </div>
//         </>
//       ) : (
//         <SuccessMessage />
//       )}
//     </div>
//   );
// };

// // FILE: src/App.js (Entry Point)
// function InputTestimonial() {
//   return (
//     <>
//       <GlobalStyles />
//       <div className="floating-shapes">
//         <div className="floating-shape">🌟</div>
//         <div className="floating-shape">✨</div>
//         <div className="floating-shape">💫</div>
//       </div>
//       <TestimonialForm />
//     </>
//   );
// }

// export default InputTestimonial;
