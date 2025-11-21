import { contacts } from "./Home/Home_utils";

export default function EasyConnect() {

    return (
        <div style={{
            zIndex: "1000", position: "fixed",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "96.5%",
            marginTop: "6.5%",
            backgroundColor: "white",
            padding: ".5rem",
            borderRadius: ".8rem",
        }}>
            {contacts.map((c, i) => (
                <div key={i} style={{ margin: "0.3rem 0rem" }}>
                    <a href={c.link} target="_blank" rel="noopener noreferrer">
                        <h2 >{c.title}</h2>
                    </a>
                </div>
            ))}
        </div>
    )
}


