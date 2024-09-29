import React, { useState } from "react";
import { TitleConfig } from "../App";

interface VideoFormProps {
  titles: TitleConfig[];
  setTitles: React.Dispatch<React.SetStateAction<TitleConfig[]>>;
}

const VideoForm: React.FC<VideoFormProps> = ({ titles, setTitles }) => {
  const [newTitle, setNewTitle] = useState<string>("");

  const handleTitleChange = (index: number, field: keyof TitleConfig, value: any) => {
    setTitles((prevTitles) =>
      prevTitles.map((title, i) =>
        i === index
          ? {
              ...title,
              [field]: field === "segments" ? parseSegments(value) : value,
            }
          : title
      )
    );
  };

  const parseSegments = (text: string) => {
    return text.split("\n").map((segment, index) => ({
      text: segment,
      color: titles[index]?.segments[index]?.color || "#FFFFFF", // Preserve existing color or use default
    }));
  };

  const handleAddTitle = () => {
    if (newTitle.trim()) {
      setTitles((prevTitles) => [
        ...prevTitles,
        {
          segments: parseSegments(newTitle),
          startTime: 0,
          endTime: 5,
          position: { x: 100, y: 100 },
          style: "50px Arial",
          typeSpeed: 20,
        },
      ]);
      setNewTitle("");
    }
  };

  const handleRemoveTitle = (index: number) => {
    setTitles((prevTitles) => prevTitles.filter((_, i) => i !== index));
  };

  const handleColorChange = (titleIndex: number, segmentIndex: number, color: string) => {
    setTitles((prevTitles) =>
      prevTitles.map((title, i) =>
        i === titleIndex
          ? {
              ...title,
              segments: title.segments.map((segment, j) => (j === segmentIndex ? { ...segment, color } : segment)),
            }
          : title
      )
    );
  };

  return (
    <form className="w-full max-w-md p-4 bg-white rounded-md shadow-md">
      {titles.map((title, titleIndex) => (
        <div key={titleIndex} className="pb-6 mb-6 border-b">
          <label className="block mb-2 font-bold text-gray-700">Title {titleIndex + 1}</label>
          <textarea
            value={title.segments.map((seg) => seg.text).join("\n")}
            onChange={(e) => handleTitleChange(titleIndex, "segments", e.target.value)}
            className="w-full px-3 py-2 mb-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          {title.segments.map((segment, segmentIndex) => (
            <div key={segmentIndex} className="flex items-center mb-2">
              <label className="mr-2">Color for line {segmentIndex + 1}:</label>
              <input type="color" value={segment.color} onChange={(e) => handleColorChange(titleIndex, segmentIndex, e.target.value)} className="w-8 h-8" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">Start Time</label>
              <input
                type="number"
                value={title.startTime}
                onChange={(e) => handleTitleChange(titleIndex, "startTime", Number(e.target.value))}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">End Time</label>
              <input
                type="number"
                value={title.endTime}
                onChange={(e) => handleTitleChange(titleIndex, "endTime", Number(e.target.value))}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">X Position</label>
              <input
                type="number"
                value={title.position.x}
                onChange={(e) => handleTitleChange(titleIndex, "position", { ...title.position, x: Number(e.target.value) })}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">Y Position</label>
              <input
                type="number"
                value={title.position.y}
                onChange={(e) => handleTitleChange(titleIndex, "position", { ...title.position, y: Number(e.target.value) })}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="block mb-1 text-sm font-bold text-gray-700">Font Style</label>
            <input
              type="text"
              value={title.style}
              onChange={(e) => handleTitleChange(titleIndex, "style", e.target.value)}
              placeholder="e.g., 50px Arial"
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-2">
            <label className="block mb-1 text-sm font-bold text-gray-700">Type Speed</label>
            <input
              type="number"
              value={title.typeSpeed}
              onChange={(e) => handleTitleChange(titleIndex, "typeSpeed", Number(e.target.value))}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemoveTitle(titleIndex)}
            className="px-2 py-1 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="mb-4">
        <label className="block mb-2 font-bold text-gray-700">Add New Title</label>
        <textarea
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter new title text"
          className="w-full px-3 py-2 mb-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button type="button" onClick={handleAddTitle} className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
          Add New Title
        </button>
      </div>
    </form>
  );
};

export default VideoForm;
