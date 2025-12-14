import { FC } from "react";

import { contacts } from "./App_utils.tsx";

const EasyConnect: FC = () => {
    return (
        <div
            className="
        fixed top-1/2 right-0 z-50
        -translate-y-1/2
        hidden md:flex flex-col gap-4
        bg-white
        p-2.5 rounded-2xl
        shadow-xl shadow-black/10
        border border-black/30
      "
        >
            {contacts.map(({ key, title, link }) => (
                <a
                    key={key}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={title}
                    className="
            group flex items-center justify-center
             text-sm font-medium
            transition-all duration-300 ease-out
            hover:-translate-y-0.5 hover:scale-[1.02]
            focus:outline-none            
          "
                >
                    {title}
                </a>
            ))}
        </div>
    );
};

export default EasyConnect;
