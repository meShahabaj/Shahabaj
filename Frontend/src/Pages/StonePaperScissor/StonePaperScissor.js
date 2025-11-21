import { useState } from "react";
import GameRunning from "./GameRunning";
import "./StonePaperScissor.css";

export default function StonePaperScissor({ logout, goToDashboard }) {
    const [response, setResponse] = useState("");
    const [isGameRunning, setIsGameRunning] = useState(false);

    return (
        <div className="App">
            {
                isGameRunning ? <GameRunning goToDashboard={() => {
                    setIsGameRunning(false);
                    goToDashboard();
                }} /> : <div><h1 className="title">✊ ✋ ✌️ Stone Paper Scissor</h1>

                    <div className="game-panel">
                        <h3 className={`response ${response ? "show" : ""}`}>
                            {response || "Click Play to start!"}
                        </h3>
                    </div>

                    <button className="play-btn" onClick={() => { setIsGameRunning(true) }}>
                        ▶ Play
                    </button>
                </div>

            }
        </div>
    );
}
