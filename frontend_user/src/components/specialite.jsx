import React from 'react';
import { Diamond, Shirt, Home, Sparkles } from 'lucide-react';

const specialtiesList = [
  {
    title: "TEXTILES DÉLICATS",
    description: "Soie, cachemire, dentelle et tissus précieux.",
    icon: <Diamond size={32} strokeWidth={1.5} />,
    color: "text-amber-500"
  },
  {
    title: "COSTUMES SUR MESURE",
    description: "Entretien professionnel de vos smokings.",
    icon: <Shirt size={32} strokeWidth={1.5} />,
    color: "text-blue-500"
  },
  {
    title: "ROBES DE MARIÉE",
    description: "Nettoyage et restauration avec expertise.",
    icon: <Sparkles size={32} strokeWidth={1.5} />,
    color: "text-blue-400"
  },
  {
    title: "LINGE DE MAISON",
    description: "Draps, rideaux et tapis traités avec soin.",
    icon: <Home size={32} strokeWidth={1.5} />,
    color: "text-gray-600"
  }
];

export default function Specialities() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {specialtiesList.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className={`mb-6 ${item.color}`}>
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-3 tracking-wide">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}