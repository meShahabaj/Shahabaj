import { useState, ChangeEvent } from 'react';
import EasyConnect from '../../App_utils/EasyConnect.tsx';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">




      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-6 pb-16">


        {!preview && (
          <div>{/* HEADER */}
            <header className="mx-auto max-w-4xl px-6 pt-6 pb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tight">Image Editor</h1>
              <p className="mt-3 text-slate-400">
                Resize images, blur faces, and remove backgrounds using AI.
              </p>
            </header>


            <div className="flex justify-center pt-20">
              <label className="group cursor-pointer rounded-2xl border border-dashed border-white/20 bg-white/5 px-12 py-14 text-center backdrop-blur-xl transition hover:border-sky-400">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-lg font-medium">Upload an image</p>
                <p className="mt-1 text-sm text-slate-400">PNG, JPG, or WEBP</p>
              </label>
            </div></div>
        )}

        {preview && (
          <div className="grid grid-cols-[520px_1fr] gap-8 pt-5">

            {/* LEFT: TOOLS */}
            <section className="h-[420px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg flex flex-col">
              <h2 className="mb-6 text-lg font-semibold">Edit Tools</h2>

              <div className="space-y-5 flex-1 overflow-y-auto pr-1">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Height</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => {
                        const h = Number(e.target.value);
                        setHeight(h);
                        setWidth(Math.round(h * ratio));
                      }}
                      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-400">Width</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => {
                        const w = Number(e.target.value);
                        setWidth(w);
                        setHeight(Math.round(w / ratio));
                      }}
                      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Blur</label>
                  <input
                    type="number"
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-sky-400"
                  />
                </div>

                {[
                  { label: 'Blur All Faces', value: faceBlur, setter: setFaceBlur },
                  // { label: 'Remove Background', value: bgRemove, setter: setBgRemove },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{item.label}</span>
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
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Processing…' : 'Process Image'}
              </button>
            </section>

            {/* RIGHT: PREVIEW */}
            <section className="h-[520px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg flex flex-col gap-4 overflow-hidden">

              <div className="flex-1 grid grid-rows-[minmax(0,.5fr)_minmax(0,.5fr)] gap-4">

                {/* ORIGINAL */}
                <div className="flex flex-col min-h-0">
                  <p className="mb-1 text-xs text-slate-400">Original</p>
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
                  <div className="flex flex-col min-h-0">
                    <p className="mb-1 text-xs text-slate-400">Result</p>
                    <div className="flex-1 min-h-0 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden">

                      <img
                        src={resizedURL}
                        alt="Processed result"
                        className="max-h-full max-w-full object-contain"
                      />

                    </div>
                  </div>)}
              </div>

              {resizedURL && (
                <a
                  href={resizedURL}
                  download="updated_img.jpg"
                  className="self-end rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Download
                </a>
              )}
            </section>

          </div>
        )}
      </main>

    </div >
  );
};

export default ImageEditorPage;
