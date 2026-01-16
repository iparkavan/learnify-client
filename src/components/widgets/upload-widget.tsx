"use client";

// components/UploadWidget.tsx
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import React, { useState } from "react";

export default function UploadWidget() {
  const [url, setUrl] = useState<string | null>(null);

  console.log("UploadWidget rendered", url);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadToCloudinary(file, "lms-uploads");
    setUrl(uploadedUrl);
  };

  return (
    <div className="p-4 border rounded-md">
      <input type="file" onChange={handleChange} />
      {url && (
        <div className="mt-3">
          <p>Uploaded:</p>
          {url.endsWith(".mp4") ? (
            <video controls width="300" src={url}></video>
          ) : (
            <img src={url} width="300" alt="Uploaded file" />
          )}
        </div>
      )}
    </div>
  );
}
