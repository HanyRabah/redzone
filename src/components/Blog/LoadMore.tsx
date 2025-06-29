
import { useState } from "react";

interface LoadMoreButtonProps {
    loadMorePosts: () => void;
}
const LoadMoreButton = ({loadMorePosts}: LoadMoreButtonProps) => {
    const [loading, setLoading] = useState(false);
  
    const handleLoadMore = () => {
      setLoading(true);
      // Simulate loading
      setTimeout(() => {
        setLoading(false);
        console.log('Loading more posts...');
        loadMorePosts();
      }, 1000);
    };
  
    return (
      <div className="text-center mb-20">
        <button 
          onClick={handleLoadMore}
          disabled={loading}
          className="inline-flex items-center px-8 py-3 bg-red-600 text-white font-['Oswald'] font-semibold uppercase tracking-wider hover:bg-red-700 disabled:opacity-50 transition-colors duration-300 rounded-lg group"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              Loading more
              <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform duration-300"></i>
            </>
          )}
        </button>
      </div>
    );
  };

  export default LoadMoreButton;
   