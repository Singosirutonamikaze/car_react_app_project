import { useEffect, useRef } from "react";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import LocationCard from "./LocationCard";

function ContactInfo() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        const container = containerRef.current;
        const items = itemsRef.current;

        if (container && items.length > 0) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(50px)';

            setTimeout(() => {
                container.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 200);

            items.forEach((item, index) => {
                if (item) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-30px)';

                    setTimeout(() => {
                        item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 400 + index * 150);
                }
            });
        }
    }, []);

    const contactData = [
        {
            icon: FiMapPin,
            title: "Adresse",
            content: ["Rue du Commerce, Quartier Administratif", "Lomé, Togo"]
        },
        {
            icon: FiPhone,
            title: "Téléphone",
            content: ["+228 22 21 20 19", "+228 90 91 92 93 (WhatsApp)", "Lun-Sam: 8h-18h"]
        },
        {
            icon: FiMail,
            title: "Email",
            content: ["contact@carhub.tg", "info@carhub.tg", "Réponse sous 24h"]
        },
        {
            icon: FiClock,
            title: "Horaires",
            content: ["Lundi-Vendredi: 8h-18h", "Samedi: 9h-16h", "Dimanche: Fermé"]
        }
    ];

    return (
        <div>
            <div
                ref={containerRef}
                className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 border border-blue-700/30 mb-8 hover:bg-blue-900/40 transition-all duration-300"
            >
                <h2 className="text-2xl font-bold text-white mb-6">Nos coordonnées</h2>
                <div className="space-y-6">
                    {contactData.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={index}
                                ref={el => { itemsRef.current[index] = el; }}
                                className="flex items-start group cursor-pointer"
                            >
                                <div className="text-blue-400 mt-1 mr-4 group-hover:text-blue-300 transition-colors duration-300 group-hover:scale-110 transform">
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold group-hover:text-blue-100 transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    {item.content.map((line, lineIndex) => (
                                        <p
                                            key={lineIndex}
                                            className={`text-blue-200 group-hover:text-blue-100 transition-colors duration-300 ${lineIndex === item.content.length - 1 && item.content.length > 2 ? 'text-sm' : ''
                                                }`}
                                        >
                                            {lineIndex === 0 && item.content.length > 1 && line.includes('<br />')
                                                ? line.split('<br />').map((part, i) => (
                                                    <span key={i}>{part}{i < line.split('<br />').length - 1 && <br />}</span>
                                                ))
                                                : line
                                            }
                                        </p>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <LocationCard />
        </div>
    );
}

export default ContactInfo;