import { useState } from "react";
import "./NumberIdentifier.css";
import EasyConnect from "../EasyConnect";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function NumberIdentifier() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setResult(null); // reset result
    };

    const handleUpload = async () => {
        if (!image) return alert("Please select an image!");

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch(
                `${BACKEND_URL}/projects/number_identifier/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setResult(data?.prediction || "No result returned");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="number_identifier-container">
            <EasyConnect />
            <h3>
                Caution: For now it is minimal & dummy model specially for MNIST like image from 0 to 100 numbers.
                Don't use for real things.
            </h3>

            <div className="number_identifier-body two-column-layout">
                {/* LEFT COLUMN */}
                <div className="number_identifier-controls">
                    <h2>Upload Image</h2>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                    />

                    <button
                        className="upload-btn"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Identify Number"}
                    </button>

                    {result && (
                        <div className="result-box">
                            <h3>Prediction:</h3>
                            <p>{result}</p>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN - PREVIEW */}
                <div className="number_identifier-preview">
                    {loading && (
                        <div className="loading-box">
                            <p className="loading-text">
                                ⏳ Backend waking up… please wait
                            </p>
                        </div>
                    )}

                    {!preview && !loading && (
                        <div className="empty-preview">
                            <img
                                src="/images/placeholder.png"
                                className="placeholder-icon"
                                alt="Placeholder"
                            />
                            <p>No image selected</p>
                        </div>
                    )}

                    {preview && !loading && (
                        <div className="preview-box">
                            <h4>Selected Image:</h4>
                            <img src={preview} alt="Preview" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
