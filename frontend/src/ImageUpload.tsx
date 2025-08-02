// frontend/src/ImageUpload.tsx
import React, { useState } from 'react';

const ImageUpload = ({ onResponse }: { onResponse: (response: string) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onResponse(data.response);
    } catch (e) {
      onResponse("Ошибка загрузки изображения.");
    }

    setLoading(false);
  };

  return (
    <div className="my-4 flex flex-col items-center">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {file && (
        <div className="mt-2 text-sm text-gray-300">{file.name}</div>
      )}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-2 bg-purple-600 px-4 py-1 rounded hover:bg-purple-700"
      >
        {loading ? "Анализ..." : "Отправить изображение"}
      </button>
    </div>
  );
};

export default ImageUpload;
