import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function GameRunning() {
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let handLandmarker = null;
  
  useEffect(() => {
    async function initModel() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/Data/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });

      startCamera();
    }

    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        requestAnimationFrame(detectHands);
      };
    }

    const isStraight = (A, B, C) => {
      const BAx = A.x - B.x;
      const BAy = A.y - B.y;
      const BCx = C.x - B.x;
      const BCy = C.y - B.y;

      const dot = BAx * BCx + BAy * BCy;
      const magBA = Math.hypot(BAx, BAy);
      const magBC = Math.hypot(BCx, BCy);

      if (magBA === 0 || magBC === 0) return false;

      const angle = Math.acos(dot / (magBA * magBC)) * (180 / Math.PI);
      return angle > 160;
    };

    async function detectHands() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (handLandmarker) {
        const results = handLandmarker.detectForVideo(video, performance.now());

        if (results.landmarks && results.landmarks.length > 0) {
          const l = results.landmarks[0]; // first hand

          const is_thumb_open = isStraight(l[1], l[2], l[4]);
          const is_index_open = isStraight(l[5], l[6], l[8]);
          const is_middle_open = isStraight(l[9], l[10], l[12]);
          const is_ring_open = isStraight(l[13], l[14], l[16]);
          const is_pinky_open = isStraight(l[17], l[18], l[20]);

          let detected_gesture = "";

          if (is_thumb_open && is_index_open && is_middle_open && is_ring_open && is_pinky_open) {
            detected_gesture = "Paper";
          } else if (!is_thumb_open && !is_index_open && !is_middle_open && !is_ring_open && !is_pinky_open) {
            detected_gesture = "Rock";
          } else if (is_index_open && is_middle_open && !is_thumb_open && !is_ring_open && !is_pinky_open) {
            detected_gesture = "Scissors";
          } else {
            detected_gesture = "Unknown";
          }

          if (detected_gesture !== "Unknown") {
            try {
              const response = await axios.post(
                `${BACKEND_URL}/projects/rock_paper_scissor/detect`,
                { data: detected_gesture },
                { headers: { "Content-Type": "application/json", Accept: "application/json" } }
              );
              if(response.data=="You Won"){
                setUserScore(prev => prev + 1);
              }
              if(response.data=="Computer Won"){
                setComputerScore(prev => prev + 1);
              }
            } catch (err) {
              console.error("Error sending gesture:", err);
            }
          } else {
            console.log("Unknown gesture");
          }
        }
      }

      requestAnimationFrame(detectHands);
    }

    initModel();
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas
        ref={canvasRef}
        style={{
          width: "640px",
          height: "480px",
          border: "2px solid #000",
        }}
      ></canvas>
      <h1>User Score: {userScore}</h1>
      <h1>Computer Score: {computerScore}</h1>
    </div>
  );
}
