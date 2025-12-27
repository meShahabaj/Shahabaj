import { useState, ChangeEvent } from 'react';
import Header from '../Header/Header.tsx';
import BelowComponent from './BelowComponent.tsx';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

const ImageEditorPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resizedURL, setResizedURL] = useState<string | null>(null);

  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [ratio, setRatio] = useState<number>(1);

  const [blur, setBlur] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const [faceBlur, setFaceBlur] = useState<boolean>(false);
  const [bgRemove, setBgRemove] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setRatio(img.width / img.height);
      setHeight(img.height);
      setWidth(img.width);
    };

    img.src = url;
    setImage(file);
    setPreview(url);
    setResizedURL(null);
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('height', height.toString());
    formData.append('width', width.toString());
    formData.append('blur', blur.toString());
    formData.append('faceBlur', String(faceBlur));
    formData.append('bgRemove', String(bgRemove));

    try {
      const res = await fetch(`${BACKEND_URL}/projects/image_editor/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const blob = await res.blob();
      setResizedURL(URL.createObjectURL(blob));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* CONTENT */}
      <main className="mx-auto">
        <Header />

        {!preview && (
          <div>
            {/* HEADER */}
            <header className="mx-auto max-w-4xl px-6 pt-6 pb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tight">
                AI Powered Image Editor
              </h1>
              <p className="mt-3 text-slate-400">
                Resize, blur whole image, Auto Blur Human Faces (AI)
              </p>
            </header>

            <div className="flex justify-center pt-20 px-4">
              <label className="group bg-red-600 cursor-pointer rounded-2xl border border-dashed border-white/20 px-12 py-14 text-center backdrop-blur-xl transition hover:border-sky-400 hover:shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {/* Upload Arrow */}
                <div className="flex flex-col items-center justify-center space-y-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-3 3m3-3l3 3"
                    />
                  </svg>

                  {/* Text */}
                  <p className="text-lg font-semibold text-white transition-colors">
                    Upload an image
                  </p>
                  <p className="text-sm text-white/80">PNG, JPG, or WEBP</p>
                </div>
              </label>
            </div>

            <BelowComponent />
          </div>
        )}

        {preview && (
          <div className="flex flex-col lg:flex-row gap-8 pt-5 px-4">
            {/* LEFT: TOOLS */}
            <section className="w-full lg:w-1/3 h-auto rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg flex flex-col">
              <h2 className="mb-6 text-lg font-semibold">Edit Tools</h2>

              <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-black-400">Height</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => {
                        const h = Number(e.target.value);
                        setHeight(h);
                        setWidth(Math.round(h * ratio));
                      }}
                      className="mt-1 w-full rounded-md border border-slate-700 px-3 py-2 text-sm focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-black-400">Width</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => {
                        const w = Number(e.target.value);
                        setWidth(w);
                        setHeight(Math.round(w / ratio));
                      }}
                      className="mt-1 w-full rounded-md border border-slate-700 px-3 py-2 text-sm focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-black-400">Blur</label>
                  <input
                    type="number"
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-700 px-3 py-2 text-sm focus:border-sky-400"
                  />
                </div>

                {[{ label: 'Blur All Faces', value: faceBlur, setter: setFaceBlur }].map(
                  (item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-black-300">{item.label}</span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={item.value}
                          onChange={() => item.setter(!item.value)}
                          className="peer hidden"
                        />
                        <span className="h-6 w-11 rounded-full bg-slate-600 peer-checked:bg-emerald-500" />
                        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition" />
                      </label>
                    </div>
                  )
                )}
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="mt-6 p-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Processing…' : 'Process Image'}
                </button>
              </div>


            </section>

            {/* RIGHT: PREVIEW */}
            <section className="w-full lg:w-2/3 h-auto rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-4 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-4">
                {/* ORIGINAL */}
                <div className="flex-1 flex flex-col min-h-0">
                  <p className="mb-1 text-xs text-black-400">Original</p>
                  <div className="flex-1 min-h-0 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img
                      src={preview}
                      alt="Original preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* RESULT */}
                {resizedURL && (
                  <div className="flex-1 flex flex-col min-h-0">
                    <p className="mb-1 text-xs text-slate-400">Result</p>
                    <div className="flex-1 min-h-0 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={resizedURL}
                        alt="Processed result"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {resizedURL && (
                <a
                  href={resizedURL}
                  download="updated_img.jpg"
                  className="self-end rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:opacity-90 mt-2"
                >
                  Download
                </a>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageEditorPage;
