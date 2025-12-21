import { useState, ChangeEvent } from 'react';
import JSZip from "jszip";
import EasyConnect from '../../App_utils/EasyConnect.tsx';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FaceExtractor = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [faces, setFaces] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setFaces([]);
    }
  };

  const extractFacesFromZip = async (zipBlob: Blob) => {
    const zipData = await zipBlob.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData);
    const urls: string[] = [];

    for (const fileName of Object.keys(zip.files)) {
      const file = zip.files[fileName];
      if (!file.dir && file.name.endsWith('.jpg')) {
        const blob = await file.async("blob");
        urls.push(URL.createObjectURL(blob));
      }
    }

    return [...new Set(urls)];
  };

  const handleUpload = async () => {
    if (!image) return alert('No image selected');
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(`${BACKEND_URL}/projects/face_extractor/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Face Not identified');

      const zipBlob = await response.blob();
      const faceURLs = await extractFacesFromZip(zipBlob);
      setFaces(faceURLs);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-100 font-sans flex flex-col items-center p-6">

      <EasyConnect />

      <div className="w-full max-w-5xl mt-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 grid md:grid-cols-[1fr_1.2fr] gap-8">

        {/* LEFT: Controls */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-white text-center tracking-wide">Upload Image to Extract Faces</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-xl px-4 py-3 cursor-pointer transition hover:bg-gray-700"
          />

          <button
            onClick={handleUpload}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg rounded-xl py-3 transition hover:scale-[1.03] hover:opacity-95 shadow-lg"
          >
            Extract Faces
          </button>
        </div>

        {/* RIGHT: Preview */}
        <div className="flex flex-col gap-6 items-center">
          {loading && (
            <div className="text-center text-gray-300 animate-pulse text-lg font-medium">
              ⏳ Extracting faces…
            </div>
          )}

          {!preview && !loading && (
            <div className="flex flex-col items-center justify-center h-80 w-full border-2 border-dashed border-white/20 rounded-2xl bg-white/5 text-gray-400">
              <img src="/images/placeholder.png" className="w-24 opacity-50 mb-2" />
              <p>No image selected</p>
            </div>
          )}

          {preview && (
            <div className="bg-white/5 rounded-2xl px-6 py-4 shadow-xl w-full max-w-md text-center border border-white/10">
              <h4 className="mb-4 text-white font-semibold text-lg">Original Image:</h4>
              <img src={preview} alt="Original" className="w-full rounded-xl border border-gray-600 transition-transform hover:scale-[1.02]" />
            </div>
          )}

          {faces.length > 0 && (
            <div className="w-full">
              <h4 className="mb-4 text-white font-semibold text-lg text-center">Extracted Faces:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {faces.map((faceURL, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 bg-white/10 rounded-2xl p-2 shadow-md border border-white/10">
                    <img src={faceURL} alt={`Face ${index + 1}`} className="w-full rounded-lg border border-gray-600" />
                    <a href={faceURL} download={`face_${index + 1}.jpg`}>
                      <button className="mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold transition hover:scale-105 hover:opacity-90 shadow-md">
                        Download
                      </button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FaceExtractor;
