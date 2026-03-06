import { useEffect, useRef } from "react";
import { FiMapPin } from "react-icons/fi";

function LocationCard() {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 800);
        }
    }, []);

    return (
        <div 
            ref={cardRef}
            className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 border border-blue-700/30 h-64 flex items-center justify-center hover:bg-blue-900/40 transition-all duration-300 group cursor-pointer"
        >
            <div className="text-center text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                <FiMapPin className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transform transition-transform duration-300" />
                <p className="group-hover:scale-105 transform transition-transform duration-300">Localisation à Lomé, Togo</p>
                <p className="text-sm group-hover:scale-105 transform transition-transform duration-300">(Proche du Marché de Lomé)</p>
            </div>
        </div>
    );
}

export default LocationCard;