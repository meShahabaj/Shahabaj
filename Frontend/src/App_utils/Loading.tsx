import { FC } from "react";

interface LoadingProps {
    message?: string;
}

const Loading: FC<LoadingProps> = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-900 font-sans gap-6">
            {/* Animated Dots */}
            <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 animate-bounce-smooth"></div>
                <div className="w-5 h-5 rounded-full bg-blue-500 animate-bounce-smooth-200"></div>
                <div className="w-5 h-5 rounded-full bg-blue-500 animate-bounce-smooth-400"></div>
            </div>


            {/* Loading Message */}
            <p className="text-white text-lg font-medium opacity-90">{message}</p>
        </div>
    );
};

export default Loading;
