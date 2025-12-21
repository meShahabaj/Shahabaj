import { JSX, Suspense } from "react";
import Slider, { type Settings } from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { videos } from "../Home_utils.tsx";
import type { Video } from "../Home_utils.tsx";

export default function VideoSlider(): JSX.Element {
    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <section className="relative flex flex-col items-center py-16 bg-gradient-to-b from-sky-50 to-white">
            <h2 className="text-4xl md:text-5xl font-bold text-sky-600 mb-10 drop-shadow-md">
                Videos
            </h2>

            <Suspense fallback={null}>
                <div className="max-w-7xl w-full px-4">
                    <Slider {...settings}>
                        {videos.map((video: Video, index: number) => (
                            <div key={index} className="px-3">
                                <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex flex-col items-center text-center rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-2xl bg-white/40 backdrop-blur-md"
                                >
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-[200px] object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
                                        <h4 className="text-white font-medium text-sm truncate">
                                            {video.title}
                                        </h4>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </Slider>
                </div>
            </Suspense>
        </section>
    );
}
