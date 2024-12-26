"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchDetails = async () => {
    setError(null);

    try {
      // Example API calls for fetching thumbnail and metadata
      const thumbnailResponse = await axios.post("http://localhost:8000/api/v1/video/generator", {
        videoUrl: videoUrl,
        frameCount: 3
      });
      console.log("risyandi ~ handleFetchDetails ~ thumbnailResponse:", thumbnailResponse)
      const metadataResponse = await axios.post("http://localhost:8000/api/v1/video/extractor", {
        videoUrl: videoUrl,
      });
      console.log("risyandi ~ handleFetchDetails ~ metadataResponse:", metadataResponse)

      setThumbnailUrl(thumbnailResponse.data.thumbnailPath);
      setMetadata(metadataResponse.data.metadata);
    } catch (err) {
      setError(
        "Failed to fetch video details. Please check the URL or try again."
      );
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Vidgenex</h1>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
            className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring focus:ring-indigo-300"
          />
          <button
            onClick={handleFetchDetails}
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
          >
            Fetch Details
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}

          {thumbnailUrl && (
            <div className="mt-6">
              <h2 className="font-semibold">Thumbnail</h2>
              <Image
                aria-hidden
                src={`http://localhost:8000/api/v1/` + thumbnailUrl}
                alt="Video Thumbnail"
                width={16}
                height={16}
                className="w-full rounded-md mt-2"
              />
            </div>
          )}

          {metadata && (
            <div className="mt-6">
              <h2 className="font-semibold">Metadata</h2>
              <textarea className="bg-gray-100 p-4 mt-2 text-sm resize-none rounded-md w-full h-52" value={JSON.stringify(metadata, null, 2)}
              onChange={(e) => setMetadata(e.target.value)}>
              </textarea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
