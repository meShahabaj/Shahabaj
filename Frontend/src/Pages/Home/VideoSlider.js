import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { videos } from "./Home_utils";
import "./VideoSlider.css";

export default function VideoSlider() {
  const settings = {
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
    <div className="video-slider-container">
      <Slider {...settings}>
        {videos.map((video, index) => (
          <div key={index} className="video-slide">
            <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-link">
              <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
              <h4 className="video-title">{video.title}</h4>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
}
