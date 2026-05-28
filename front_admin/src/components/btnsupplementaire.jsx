import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function OptionsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <MoreHorizontal
        onClick={() => setOpen(!open)}
        className="w-5 h-5 text-gray-500 cursor-pointer hover:bg-gray-100 rounded"
      />
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border py-1 z-10">
          <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Modifier</button>
          <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Dupliquer</button>
          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Supprimer</button>
        </div>
      )}
    </div>
  );
}