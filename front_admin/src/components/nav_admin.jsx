import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Users, 
    Shirt, 
    CreditCard, 
    Truck,
    Settings,
    LogOut    
} from 'lucide-react';
import profil from '../assets/profil/PHOTO.jpeg';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate(); // ✅ Déplacé à l'intérieur du composant

    const handleLogout = () => { // ✅ Déplacé à l'intérieur du composant
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };  

    const menu = [
        { id: 1, nom: 'Tableau de bord', icon: LayoutDashboard, lien: '/admin/dashboard' }, 
        { id: 2, nom: 'Gestion des Commandes', icon: ShoppingCart, lien: '/admin/commandes' },
        { id: 3, nom: 'Gestion des Clients', icon: Users, lien: '/admin/clients' },
        { id: 4, nom: 'Services du Pressing', icon: Shirt, lien: '/admin/services' },
        { id: 5, nom: 'Paiement & Facturation', icon: CreditCard, lien: '/admin/paiements' },
        { id: 6, nom: 'Livraisons', icon: Truck, lien: '/admin/livraisons' }
    ];

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" }
        })
    };

    return (
        <motion.nav 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className=" fixed top-0 left-0  flex flex-col min-h-screen bg-gray-50 w-2xs border-r border-gray-300 items-center"
        >
            <motion.h1 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-blue-500 font-bold lg:text-[21px] p-4"
            >
                Smart PRESSING <span className='text-center'>Manager</span> 
            </motion.h1>

            <ul className="flex flex-col gap-6 py-3 w-full px-4">
                {menu.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Link to={item.lien} key={item.id}>
                            <motion.li 
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                variants={itemVariants}
                                whileHover={{ x: 5, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex flex-row items-center gap-3 cursor-pointer transition-colors hover:text-blue-500"
                            >
                                <Icon className="w-5 h-5" />  
                                <span className="text-[14px] font-semibold">{item.nom}</span> 
                            </motion.li>
                        </Link>
                    );
                })}

                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="border border-gray-300"
                />
   <Link to={`/admin/parametre`}>
                <motion.div 
                    custom={menu.length}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="flex flex-row items-center gap-3 text-[14px] font-semibold cursor-pointer transition-colors hover:text-blue-500"
                >
                    <Settings className="w-5 h-5" />
                    <span>Paramètre</span>
                </motion.div>
                </Link>
                <motion.div 
                    custom={menu.length + 1}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="flex flex-row items-center gap-3 text-[14px] font-semibold cursor-pointer"
                    onClick={handleLogout} // ✅ Déplacé le onClick ici
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-red-800">Deconnexion</span>
                </motion.div>
            </ul>

            {/* Profil manager */}
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: "backOut" }}
                className="flex flex-row bg-gray-100 border-gray-400 my-4 border p-2 rounded-2xl gap-2 mt-auto mx-4"
            >
                <div className="relative">
                    <img 
                        src={profil} 
                        alt="profil"  
                        className="w-20 h-20 rounded-full object-cover border border-white shadow-lg"
                    />
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}       
                        transition={{ delay: 0.7, duration: 0.2 }}
                        className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <motion.p 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-[12px] font-bold"
                    >
                        PRECIEUX MAYELA
                    </motion.p>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.65 }}
                        className="text-[11px] text-gray-700"
                    >
                        Manager
                    </motion.p>
                </div>
            </motion.div>
        </motion.nav>
    );
}