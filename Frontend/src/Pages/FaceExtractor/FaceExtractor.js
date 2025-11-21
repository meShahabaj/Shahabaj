import { useState } from 'react';
import JSZip from "jszip";
import './FaceExtractor.css';

import EasyConnect from '../EasyConnect';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FaceExtractor = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [faces, setFaces] = useState([]);  // ⬅️ Store extracted face images
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img_url = URL.createObjectURL(file);
      setImage(file);
      setPreview(img_url);
      setFaces([]); // clear old faces
    }
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

      if (!response.ok) throw new Error('Upload failed');

      // Get ZIP blob
      const zipBlob = await response.blob();

      // Convert ZIP -> Extract images
      const faceURLs = await extractFacesFromZip(zipBlob);
      setFaces(faceURLs);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- ZIP Extractor Function ----
  const extractFacesFromZip = async (zipBlob) => {
    const zipData = await zipBlob.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData); // requires JSZip

    const urls = [];
    for (const fileName of Object.keys(zip.files)) {
      const file = zip.files[fileName];
      if (!file.dir && file.name.endsWith('.jpg')) {
        const blob = await file.async("blob");
        const url = URL.createObjectURL(blob);
        urls.push(url);
      }
    }
    const unique = [...new Set(urls)];
    return unique;

    // return urls;
  };

  return (
    <div className="image-editor-container">
      <EasyConnect />

      <div className="editor-body two-column-layout">

        {/* LEFT SIDE */}
        <div className="editor-controls">
          <h2>Upload Image to Extract Faces</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />

          <button className="resize-button" onClick={handleUpload}>
            Extract Faces
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="editor-preview">

          {loading && (
            <div className="loading-box">
              <p className="loading-text">⏳ Extracting faces…</p>
            </div>
          )}

          {!preview && (
            <div className="empty-preview">
              <img src="/images/placeholder.png" className="placeholder-icon" />
              <p>No image selected</p>
            </div>
          )}

          {preview && (
            <div className="preview-box">
              <h4>Original Image:</h4>
              <img src={preview} alt="Original" />
            </div>
          )}

          {faces.length > 0 && (
            <div className="faces-container">
              <h4>Extracted Faces:</h4>

              <div className="face-grid">
                {faces.map((faceURL, index) => (
                  <div key={index} className="face-item">
                    <img src={faceURL} alt={`Face ${index + 1}`} />

                    <a href={faceURL} download={`face_${index + 1}.jpg`}>
                      <button className="download-button">Download</button>
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
