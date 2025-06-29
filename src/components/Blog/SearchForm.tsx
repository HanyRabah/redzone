import { useState } from "react";
import { SearchIcon } from "lucide-react";

interface SearchFormProps {
    onSearch: (searchTerm: string) => void;
}
const SearchForm = ({onSearch}: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-6 border-b border-gray-700">
      <div className="relative">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e)}
          className="w-full bg-white text-gray-900 placeholder-gray-500 px-4 py-3 pr-12 rounded-lg border-0 focus:ring-2 focus:ring-red-600 focus:outline-none font-['Oswald'] uppercase tracking-wide text-sm" 
          placeholder="Search..."
        />
        <button 
          onClick={handleSearch}
          className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 rounded-r-lg"
        >
          <SearchIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
