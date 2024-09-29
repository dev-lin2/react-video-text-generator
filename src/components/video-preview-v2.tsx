import React, { useState, useRef, useEffect } from "react";
import Video from "@/assets/video.mp4";

interface TextSegment {
  text: string;
  color: string;
}

interface TitleConfig {
  segments: TextSegment[];
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  style: string;
  typeSpeed: number;
}

interface ImageConfig {
  url: string;
  position: { x: number; y: number };
  startTime: number;
  endTime: number;
}

interface VideoPreviewV2Props {
  titles: TitleConfig[];
  image: ImageConfig;
}

const VideoPreviewV2: React.FC<VideoPreviewV2Props> = ({ titles, image }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [showCoordinates, setShowCoordinates] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.addEventListener("loadedmetadata", resizeCanvas);

    // Preload the image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.url;
    img.onload = () => {
      imageRef.current = img;
    };

    let animationFrameId: number;

    const render = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      drawTitles(ctx, video.currentTime);
      drawImage(ctx, video.currentTime);
      drawCoordinates(ctx);
      animationFrameId = requestAnimationFrame(render);
    };

    video.addEventListener("play", () => {
      setIsPlaying(true);
      render();
    });

    video.addEventListener("pause", () => {
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameId);
    });

    video.addEventListener("ended", () => {
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameId);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("loadedmetadata", resizeCanvas);
    };
  }, [titles, image, showCoordinates]);

  const drawTitles = (ctx: CanvasRenderingContext2D, currentTime: number) => {
    titles.forEach((title) => {
      if (currentTime >= title.startTime && currentTime <= title.endTime) {
        const elapsedTime = currentTime - title.startTime;
        const charactersToShow = Math.floor(elapsedTime * title.typeSpeed);

        ctx.font = title.style;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        let x = title.position.x;
        let y = title.position.y;
        let totalCharactersShown = 0;

        for (const segment of title.segments) {
          if (totalCharactersShown >= charactersToShow) break;

          const segmentCharsToShow = Math.min(segment.text.length, charactersToShow - totalCharactersShown);
          const textToShow = segment.text.slice(0, segmentCharsToShow);

          ctx.fillStyle = segment.color;

          const lines = textToShow.split("\n");
          lines.forEach((line, index) => {
            const lineY = y + index * parseInt(title.style) * 1.2;
            ctx.strokeText(line, x, lineY);
            ctx.fillText(line, x, lineY);
          });

          totalCharactersShown += segmentCharsToShow;
          if (lines.length > 1) {
            x = title.position.x;
            y += (lines.length - 1) * parseInt(title.style) * 1.2;
          } else {
            x += ctx.measureText(textToShow).width;
          }
        }
      }
    });
  };

  const drawCoordinates = (ctx: CanvasRenderingContext2D) => {
    if (!showCoordinates) return;

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    ctx.save(); // Save the current context state
    ctx.font = "40px Arial"; // Set a specific font for coordinates

    // Draw x-axis
    for (let x = 0; x <= canvasWidth; x += 50) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText(x.toString(), x, 15);
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(x, 0, 1, canvasHeight);
    }

    // Draw y-axis
    for (let y = 0; y <= canvasHeight; y += 50) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText(y.toString(), 5, y);
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(0, y, canvasWidth, 1);
    }

    ctx.restore(); // Restore the context state
  };

  const drawImage = (ctx: CanvasRenderingContext2D, currentTime: number) => {
    if (currentTime >= image.startTime && currentTime <= image.endTime && imageRef.current) {
      const fadeInDuration = 1; // duration of the fade-in effect in seconds
      const elapsedTime = currentTime - image.startTime;
      const alpha = Math.min(elapsedTime / fadeInDuration, 1);

      const imageSize = 400; // Set the image size to 400x400
      const cornerRadius = 20; // Adjust this value to change the roundness of corners

      ctx.save();
      ctx.globalAlpha = alpha;

      // Create a rounded rectangle path
      ctx.beginPath();
      ctx.moveTo(image.position.x + cornerRadius, image.position.y);
      ctx.lineTo(image.position.x + imageSize - cornerRadius, image.position.y);
      ctx.quadraticCurveTo(image.position.x + imageSize, image.position.y, image.position.x + imageSize, image.position.y + cornerRadius);
      ctx.lineTo(image.position.x + imageSize, image.position.y + imageSize - cornerRadius);
      ctx.quadraticCurveTo(image.position.x + imageSize, image.position.y + imageSize, image.position.x + imageSize - cornerRadius, image.position.y + imageSize);
      ctx.lineTo(image.position.x + cornerRadius, image.position.y + imageSize);
      ctx.quadraticCurveTo(image.position.x, image.position.y + imageSize, image.position.x, image.position.y + imageSize - cornerRadius);
      ctx.lineTo(image.position.x, image.position.y + cornerRadius);
      ctx.quadraticCurveTo(image.position.x, image.position.y, image.position.x + cornerRadius, image.position.y);
      ctx.closePath();

      ctx.clip();

      ctx.drawImage(imageRef.current, image.position.x, image.position.y, imageSize, imageSize);

      ctx.restore();
    }
  };

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleDownload = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Unable to get 2D context");
      setIsProcessing(false);
      return;
    }

    video.currentTime = 0;
    await new Promise((resolve) => (video.oncanplay = resolve));

    const stream = canvas.captureStream(30);
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(video);
    const destination = audioCtx.createMediaStreamDestination();
    source.connect(destination);

    const combinedStream = new MediaStream([...stream.getVideoTracks(), ...destination.stream.getAudioTracks()]);
    const mediaRecorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = "processed_video.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setIsProcessing(false);
    };

    mediaRecorder.start();

    video.play();

    const handleVideoEnd = () => {
      mediaRecorder.stop();
      video.removeEventListener("ended", handleVideoEnd);
    };
    video.addEventListener("ended", handleVideoEnd);
  };

  return (
    <div className="mx-auto">
      <div className="relative" style={{ width: "640px", height: "360px" }}>
        <video
          ref={videoRef}
          src={Video}
          style={{ display: "none" }}
          crossOrigin="anonymous"
          onLoadedMetadata={() => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          }}
        />
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
      <div className="mt-4">
        <button onClick={handleStart} className="px-4 py-2 mr-4 text-white bg-blue-500 rounded" disabled={isPlaying}>
          Start
        </button>
        <button onClick={handleDownload} className="px-4 py-2 text-white bg-green-500 rounded" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Download"}
        </button>
        <button onClick={() => setShowCoordinates(!showCoordinates)} className="px-4 py-2 ml-4 text-white bg-purple-500 rounded">
          {showCoordinates ? "Hide Coordinates" : "Show Coordinates"}
        </button>
      </div>
    </div>
  );
};

export default VideoPreviewV2;
