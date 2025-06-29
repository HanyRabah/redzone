import Image from 'next/image';

interface InstagramWidgetProps {
    instagramPosts: string[];
}
const InstagramWidget = ({ instagramPosts }: InstagramWidgetProps) => {
  return (
    <div className="p-6">
      <h4 className="text-red-600 font-['Oswald'] font-bold uppercase tracking-wider mb-6">Instagram</h4>
      <div className="grid grid-cols-2 gap-3">
        {instagramPosts.map((image, index) => (
          <a key={index} href="#" className="block group">
            <Image   
              className="w-full h-24 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300" 
              src={image}
              alt={`Instagram post ${index + 1}`}
            />
          </a>
        ))}
      </div>
    </div>
  );
};
export default InstagramWidget;