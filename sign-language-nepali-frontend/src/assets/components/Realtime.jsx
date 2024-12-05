import React, { useEffect, useRef, useState } from "react";
import "../components/style.css";
import bibek from "../images/bibek2.jpg";
import pratik from "../images/pratik.jpg";
import nabin from "../images/nabin.jpg";
import dipesh from "../images/dipesh.jpg";

const RealTimeGestureRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [gesture, setGesture] = useState("Loading...");
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  // Reference for the recognition section
  const recognitionRef = useRef(null); 

  // Start the camera and process frames
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      processFrames();
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera: ", error);
      alert("Cannot access the camera.");
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
  };

  // Process video frames and send to backend
  const processFrames = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Draw the video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0);

      // Convert canvas content to Blob
      canvas.toBlob(async (blob) => {
        try {
          const formData = new FormData();
          formData.append("image", blob, "gesture.jpg");

          const response = await fetch(
            "http://localhost:5000/recognize_gesture",
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            const data = await response.json();
            setGesture(data.predicted_gesture || "No gesture detected");
          } else {
            setGesture("No gesture detected");
          }
        } catch (error) {
          console.error("Error:", error);
          setGesture("Error recognizing gesture.");
        }

        // Continue processing if the camera is on
        if (isCameraOn) {
          requestAnimationFrame(processFrames);
        }
      }, "image/jpeg");
    }
  };

  useEffect(() => {
    startCamera();

    // Cleanup: stop the camera when the component unmounts
    return () => stopCamera();
  }, []);

  const scrollToRecognition = () => {
    recognitionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Navbar */}
      <header>
        <div className="logo">SignRecognizer</div>
        <nav>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#how">How to use</a>
            </li>
            <li>
              <a href="#team">Team</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
      {/* Hero Section */}

      <section className="hero" id="home">
        <h1>Sign Recognization for Devanagari script</h1>
        <p>Breaking barriers, one sign at a time.</p>
        <button className="cta-btn" onClick={scrollToRecognition} >Get Started</button>
      </section>

      {/* Real-Time Gesture Recognition */}
      <section className="recognition"  ref={recognitionRef}>
        {/* Video Preview */}
        <video ref={videoRef} autoPlay />

        {/* Gesture Prediction */}
        <div id="result">
          <p>
            <span>{gesture}</span>
          </p>
        </div>
        {/* Buttons */}
        <div>
          <button
            onClick={startCamera}
            disabled={isCameraOn}
            className="bg-green-500 px-4 py-3 rounded-lg text-white hover:bg-green-900  "
          >
            Start Camera
          </button>
          <button
            onClick={stopCamera}
            disabled={!isCameraOn}
            className="ml-9 bg-red-500 px-4 py-3 rounded-lg text-white hover:bg-red-900"
          >
            Stop Camera
          </button>
        </div>
        {/* Hidden Canvas for Processing Frames */}
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </section>

      {/* Features Section */}
      <header class="team-header" id="how">
        <h1>How to use?</h1>
      </header>
      <div class="key-features">
        <section class="feature">
          <h2 className="font-semibold">Step-1</h2>
          <p>Open the app.</p>
        </section>
        <section class="feature">
          <h2 className="font-semibold">Step-2</h2>
          <p>Click the start camera button.</p>
        </section>
        <section class="feature">
          <h2 className="font-semibold">Step-3</h2>
          <p>Give the hand sign in front of the camera.</p>
        </section>
        <section class="feature">
          <h2 className="font-semibold">Step-4</h2>
          <p>Distance should be approx. 30cm.</p>
        </section>
        <section class="feature">
          <h2 className="font-semibold">Step-5</h2>
          <p>Hold the action for a bit.</p>
        </section>
        <section class="feature">
          <h2 className="font-semibold">Step-6</h2>
          <p>Stop the camera.</p>
        </section>
      </div>
      {/* Team Section */}
      <header className="team-header" id="team">
        <h1>Meet Our Team</h1>
      </header>
      <main className="team-container">
        <div className="team-member">
          <img src={bibek} alt="Member 1" className="team-photo" />
          <h3>Bibek Rokaya</h3>
          <p className="role">Frontend Developer</p>
          <p className="bio">
            Specializes in creating responsive designs and interactive UIs.
          </p>
        </div>
        <div className="team-member">
          <img src={pratik} alt="Member 2" className="team-photo" />
          <h3>Pratik Devkota</h3>
          <p className="role">Backend Developer</p>
          <p className="bio">
            Ensures smooth functionality with robust server-side logic.
          </p>
        </div>
        <div className="team-member">
          <img src={nabin} alt="Member 3" className="team-photo" />
          <h3>Nabin Gotami</h3>
          <p className="role">UI/UX Designer</p>
          <p className="bio">
            Crafts visually appealing and user-friendly interfaces.
          </p>
        </div>
        <div className="team-member">
          <img src={dipesh} alt="Member 4" className="team-photo" />
          <h3>Dipesh Thapa</h3>
          <p className="role">Team Leader</p>
          <p className="bio">
            Ensures timely delivery and collaboration among team members.
          </p>
        </div>
      </main>

  
      {/* Contact Us */}
      <header className="team-header" id="contact">
        <h1>Contact Us For any Query?</h1>
      </header>
      <section className="contact-form">
        <h2>Contact Us</h2>
        <form action="#" method="post">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Enter your full name"
          />
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter your email address"
          />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            required
            placeholder="Enter your message"
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
      {/* Footer */}
      <footer>
        <p>
          &copy; 2024 Sign Language Recognition. All rights reserved. Developed
          by
          <b>(NP - BD) Team</b>
        </p>
      </footer>
    </div>
  );
};

export default RealTimeGestureRecognition;
