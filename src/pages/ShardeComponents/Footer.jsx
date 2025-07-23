import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaLocationArrow } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 text-white py-10">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Company Info */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">LifeSecure</h2>
                    <p>Your trusted platform for managing life insurance — secure your tomorrow, today.</p>
                    <div className="flex mt-4 space-x-4 text-xl">
                        <a href="https://www.facebook.com/rana.rahim.5473" className="hover:text-pink-300"><FaFacebook /></a>
                        <a href="#" className="hover:text-pink-300"><FaTwitter /></a>
                        <a href="#" className="hover:text-pink-300"><FaLinkedin /></a>
                    </div>
                </div>

                {/* Useful Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:text-pink-300 transition duration-200">Home</a></li>
                        <li><a href="/policies" className="hover:text-pink-300 transition duration-200">All Policies</a></li>
                        <li><a href="/dashboard" className="hover:text-pink-300 transition duration-200">Dashboard</a></li>
                        <li><a href="/contact" className="hover:text-pink-300 transition duration-200">Contact Us</a></li>
                    </ul>
                </div>

                {/* Support Info */}
                <div>
                    <h3 className="text-xl font-semibold mb-3">Support</h3>
                    <ul className="space-y-2">
                        <li><a href="/faq" className="hover:text-pink-300 transition duration-200">FAQ</a></li>
                        <li><a href="/terms" className="hover:text-pink-300 transition duration-200">Terms & Conditions</a></li>
                        <li><a href="/privacy" className="hover:text-pink-300 transition duration-200">Privacy Policy</a></li>
                        <li><a href="/help" className="hover:text-pink-300 transition duration-200">Help Center</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-xl font-semibold mb-3">Contact</h3>
                    <p className="flex items-center gap-2"><FaEnvelope /> sshapa17@gmail.com</p>
                    <p className="flex items-center gap-2 mt-2"><FaPhone /> +880 1610665069</p>
                    <p className="flex items-center gap-2 mt-2"><FaLocationArrow /> Dhaka, Bangladesh</p>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="text-center mt-10 border-t border-white/30 pt-4 text-sm text-gray-300">
                © {new Date().getFullYear()} LifeSecure. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
