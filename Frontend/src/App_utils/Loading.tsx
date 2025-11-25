import React, { FC } from "react";

interface LoadingProps {
    message?: string;
}

const Loading: FC<LoadingProps> = ({ message = "Loading..." }) => {
    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "sans-serif",
        color: "#333",
        gap: "1rem",
    };

    const dotsContainerStyle: React.CSSProperties = {
        display: "flex",
        gap: "10px",
    };

    const dotStyle = (delay: number): React.CSSProperties => ({
        width: "15px",
        height: "15px",
        borderRadius: "50%",
        backgroundColor: "#3b82f6",
        animation: `bounce 0.6s ${delay}s infinite alternate`,
    });

    const keyframes = `
    @keyframes bounce {
      from { transform: translateY(0); }
      to { transform: translateY(-20px); }
    }
  `;

    const delays = [0, 0.2, 0.4];

    return (
        <div style={containerStyle}>
            <style>{keyframes}</style>
            <div style={dotsContainerStyle}>
                {delays.map((d, i) => (
                    <div key={i} style={dotStyle(d)} />
                ))}
            </div>
            <p>{message}</p>
        </div>
    );
};

export default Loading;
