import React from 'react';
import { Diamond, Shirt, Home, Sparkles } from 'lucide-react';

const specialtiesList = [
  {
    title: "Textiles Délicats",
    description: "Soie, cachemire, dentelle et tissus précieux traités avec le plus grand soin.",
    icon: Diamond,
    color: "bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400"
  },
  {
    title: "Costumes Sur Mesure",
    description: "Entretien, défroissage et finition professionnelle de vos tailleurs et smokings.",
    icon: Shirt,
    color: "bg-blue-50 text-blue-500 dark:bg-blue-950/30 dark:text-blue-400"
  },
  {
    title: "Robes de Mariée",
    description: "Nettoyage, détartrage et restauration d'experte pour vos tenues d'exception.",
    icon: Sparkles,
    color: "bg-purple-50 text-purple-500 dark:bg-purple-950/30 dark:text-purple-400"
  },
  {
    title: "Linge de Maison",
    description: "Draps de lit, rideaux occultants et tapis volumineux traités en profondeur.",
    icon: Home,
    color: "bg-teal-50 text-teal-500 dark:bg-teal-950/30 dark:text-teal-400"
  }
];

export default function Specialities() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {specialtiesList.map((item, index) => {
          const IconComponent = item.icon;
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-200/60 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 group"
            >
              {/* Conteneur de l'icône stylisé en badge */}
              <div className={`mb-6 p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-sm ${item.color}`}>
                <IconComponent size={28} strokeWidth={1.75} />
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 tracking-wide">
                {item.title}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}