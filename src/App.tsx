import { useState } from "react";
import NavBar from "./components/navbar";
import VideoForm from "./components/video-form";
import VideoPreviewV2 from "./components/video-preview-v2";

export interface TextSegment {
  text: string;
  color: string;
}

export interface ImageConfig {
  url: string;
  position: { x: number; y: number };
  startTime: number;
  endTime: number;
}

export interface TitleConfig {
  segments: TextSegment[];
  position: { x: number; y: number };
  startTime: number;
  endTime: number;
  style: string;
  typeSpeed: number;
}

export default function Home() {
  const [image, setImage] = useState<ImageConfig>({
    url: "./src/assets/mage.jpg",
    position: { x: 820, y: 400 },
    startTime: 6,
    endTime: 10,
  });

  const [titles, setTitles] = useState<TitleConfig[]>([
    {
      segments: [
        { text: "おはよう", color: "yellow" },
        { text: "こんにちは", color: "blue" },
      ],
      startTime: 1,
      endTime: 3,
      position: { x: 100, y: 200 },
      style: "50px Arial",
      typeSpeed: 20,
    },
    {
      segments: [
        { text: "おやすみ", color: "red" },
        { text: "なさい", color: "green" },
      ],
      startTime: 2,
      endTime: 3,
      position: { x: 600, y: 200 },
      style: "50px Arial",
      typeSpeed: 20,
    },
    {
      segments: [{ text: "Good Night , Sweet Dreams", color: "blue" }],
      startTime: 4,
      endTime: 10,
      position: { x: 100, y: 200 },
      style: "100px Arial",
      typeSpeed: 20,
    },
  ]);

  return (
    <div className="h-screen space-y-2 bg-white">
      <NavBar />
      <div className="flex">
        <VideoForm titles={titles} setTitles={setTitles} />
        <VideoPreviewV2 titles={titles} image={image} />
      </div>
    </div>
  );
}
