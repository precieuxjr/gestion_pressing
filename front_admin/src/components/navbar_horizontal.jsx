import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import NotificationIcon from '../components/notifiocations';

export default function NavBarHorizontal({ 
  buttonLabel = "Nouveau client", 
  onButtonClick, 
  onSearch 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <header className="bg-white w-full h-14 flex items-center justify-between px-4 gap-3 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 w-80 md:w-96 h-10 px-3">
        <Search className="text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 outline-none text-xs text-gray-700 bg-transparent"
          placeholder="Rechercher..."
        />
      </div>
      <div className="flex items-center gap-3">
        <NotificationIcon />
        <button
          onClick={onButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          {buttonLabel}
        </button>
      </div>
    </header>
  );
}