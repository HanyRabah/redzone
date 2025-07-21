import { FaInstagram, FaFacebook, FaPinterest, FaBehance } from "react-icons/fa6";

const SocialShare = () => {
    const shareLinks = [
      { platform: 'instagram', icon: FaInstagram, url: '#' },
      { platform: 'facebook', icon: FaFacebook, url: '#' },
      { platform: 'pinterest', icon: FaPinterest, url: '#' },
      { platform: 'behance', icon: FaBehance, url: '#' }
    ];
  
    return (
      <div className="flex items-center justify-end pt-8 border-t border-gray-200 mt-8">
        <span className="text-gray-600 font-['Oswald'] text-sm uppercase tracking-wider mr-4">
          Share this article:
        </span>
        <div className="flex space-x-4">
          {shareLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              className="w-10 h-10 bg-gray-100 hover:bg-red-600 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 pointer-small"
            >
              <link.icon />
            </a>
          ))}
        </div>
      </div>
    );
  };

  export default SocialShare;