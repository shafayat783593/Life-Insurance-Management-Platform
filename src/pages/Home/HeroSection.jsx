// HeroSlider.jsx
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Carousel } from "react-responsive-carousel";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const slides = [
    {
        id: 1,
        title: "Secure Your Tomorrow Today",
        tagline: "Protect what matters most with reliable life insurance.",
        image: "https://i.ibb.co/LdjPb7QS/incurence3.jpg",
    },
    {
        id: 2,
        title: "Plan for a Safer Future",
        tagline: "Affordable policies for you and your family.",
        image: "https://i.ibb.co/hFwyv1tW/incrunce2.webp",
    },
    {
        id: 3,
        title: "Peace of Mind Guaranteed",
        tagline: "Your family's safety is our top priority.",
        image: "https://i.ibb.co/1GzG2bDr/incrunce4.jpg",
    },
];

const HeroSlider = () => {
    return (
        <div className="w-full max-h-[600px] mt-20">
            <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={5000}
                transitionTime={900}
            >
                {slides.map((slide) => (
                    <div key={slide.id} className="relative">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-[600px] object-cover brightness-[.6]"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">
                                {slide.title}
                            </h2>
                            <p className="text-lg md:text-xl mb-6 drop-shadow">{slide.tagline}</p>
                            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white text-lg rounded shadow">
                                Get a Free Quote
                            </button>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HeroSlider;
