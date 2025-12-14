import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { videos, Video } from "./Home_utils.tsx";

export default function VideoSlider() {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-20">
      <Slider {...settings}>
        {videos.map((video: Video, index: number) => (
          <div key={index} className="px-4">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="
                  w-full h-[200px] object-cover rounded-xl
                  transition-transform duration-300
                  group-hover:scale-105
                  shadow-md group-hover:shadow-xl
                "
              />

              <h4
                className="
                  mt-3 text-base font-semibold text-slate-700
                  max-w-[90%] truncate
                "
              >
                {video.title}
              </h4>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
}
