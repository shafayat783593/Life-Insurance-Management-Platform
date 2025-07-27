import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { NavLink } from 'react-router'; // fixed from 'react-router'

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
        <div className="w-full max-h-[600px] mt-5">
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
                        {/* Responsive Image Height */}
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-[250px] sm:h-[400px] md:h-[600px] object-cover brightness-[.6]"
                        />
                        {/* Overlay Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
                            <h2 className="text-xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 drop-shadow">
                                {slide.title}
                            </h2>
                            <p className="text-sm sm:text-lg md:text-xl mb-3 sm:mb-6 drop-shadow">
                                {slide.tagline}
                            </p>
                            <NavLink
                                to="/quote"
                                className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm sm:text-lg shadow-md hover:shadow-xl transition-all"
                            >
                                Get a Free Quote
                            </NavLink>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HeroSlider;
;

{/* <NavLink
    to="/All-blogs"

    type="submit"
    className="w-40 px-8 scale-0 hover:scale-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all"
>
    All Blogs / Articles
</NavLink> */}