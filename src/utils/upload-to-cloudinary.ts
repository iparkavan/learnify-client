import axios from "axios";

export async function uploadToCloudinary(file: File, folder: string) {
  // 1️⃣ Get signature from your backend
  const sigRes = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/cloudinary/signature?folder=${folder}`,
    { withCredentials: true } // if using auth cookies
  );

  const { timestamp, signature, api_key, cloud_name } = sigRes.data;

  // 2️⃣ Prepare FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  // 3️⃣ Upload directly to Cloudinary
  const uploadType = file.type.startsWith("video") ? "video" : "image";
  const uploadRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloud_name}/${uploadType}/upload`,
    formData
  );

  return uploadRes.data;
}
