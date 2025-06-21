'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <img className="h-12" src="/images/logo/logo-white.png" alt="Red Zone" />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Menu</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center">
                <i className="far fa-envelope mr-2"></i>
                <a href="mailto:amr.elwadidy@gmail.com">amr.elwadidy@gmail.com</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-mobile-alt mr-2"></i>
                <a href="tel:+201156659999">+201156659999</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>Giza, Egypt</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:-translate-x-2 inline-block">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:-translate-x-2 inline-block">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:-translate-x-2 inline-block">
                  Spotify
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:-translate-x-2 inline-block">
                  Vimeo
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:-translate-x-2 inline-block">
                  Behance
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Red Zone. Designed by <a href="#" className="hover:text-white">DEEP Communications</a></p>
        </div>
      </div>
    </footer>
  );
}
