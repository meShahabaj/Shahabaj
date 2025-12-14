import { contacts } from "../Pages/Home/Home_utils.tsx";

export default function EasyConnect() {
    return (
        <div className="fixed flex flex-col justify-center top-[20%] left-[96.5%] z-50 bg-white p-2 rounded-lg">
            {contacts.map((c, i) => (
                <div key={i} className="my-1">
                    <a href={c.link} target="_blank" rel="noopener noreferrer">
                        <h2 className="text-sm font-medium text-gray-800 hover:text-blue-500 transition-colors">
                            {c.title}
                        </h2>
                    </a>
                </div>
            ))}
        </div>
    );
}
