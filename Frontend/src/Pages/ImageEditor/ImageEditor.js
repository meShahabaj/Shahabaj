import { useState } from 'react';
import './ImageEditor.css';
import EasyConnect from '../EasyConnect';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resizedURL, setResizedURL] = useState(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [ratio, setRatio] = useState(1);
  const [blur, setBlur] = useState(1);
  const [loading, setLoading] = useState(false);
  const [faceBlur, setFaceBlur] = useState(false);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img_url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        setRatio(img.width / img.height);
        setHeight(img.height);
        setWidth(img.width);
      };
      img.src = img_url;
      setImage(file);
      setPreview(img_url);
      setResizedURL(null);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!image) return alert('No image selected');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('height', height);
    formData.append('width', width);
    formData.append('blur', blur);
    formData.append('faceBlur', faceBlur);

    try {
      const response = await fetch(`${BACKEND_URL}/projects/image_editor/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResizedURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false); 
    }
  };

  const changeHeight = (e) => {
    const h = parseInt(e.target.value);
    setHeight(h);
    setWidth(Math.round(h * ratio));
  };

  const changeWidth = (e) => {
    const w = parseInt(e.target.value);
    setWidth(w);
    setHeight(Math.round(w / ratio));
  };

  return (
    <div className="image-editor-container">
      <EasyConnect />

      <div className="editor-body two-column-layout">

        {/* LEFT: Controls */}
        <div className="editor-controls">
          <h2>Upload & Edit Image</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />

          <div className="input-group">
            <label>Height</label>
            <input type="number" value={height} onChange={changeHeight} />

            <label>Width</label>
            <input type="number" value={width} onChange={changeWidth} />

            <label>Blur</label>
            <input
              type="number"
              value={blur}
              onChange={(e) => setBlur(e.target.value)}
            />
            <label>Blur All Faces</label>

            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={faceBlur}
                onChange={() => setFaceBlur(!faceBlur)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <button className="resize-button" onClick={handleUpload}>
            Resize
          </button>
        </div>

        {/* RIGHT: Preview */}
        <div className="editor-preview">
          {loading && (
            <div className="loading-box">
              <p className="loading-text">⏳ Waiting for backend… first request may take some time</p>
            </div>
          )}

          {!preview && (
            <div className="empty-preview">
              <img
                src="/images/placeholder.png"
                className="placeholder-icon"
              />
              <p>No image selected</p>
            </div>
          )}

          {preview && (
            <div className="preview-box">
              <h4>Original Preview:</h4>
              <img src={preview} alt="Original" />
            </div>
          )}

          {resizedURL && (
            <div className="preview-box">
              <h4>Resized Image:</h4>
              <img src={resizedURL} alt="Resized" />
              <br />
              <a href={resizedURL} download="updated_img.jpg">
                <button className="download-button">Download</button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
