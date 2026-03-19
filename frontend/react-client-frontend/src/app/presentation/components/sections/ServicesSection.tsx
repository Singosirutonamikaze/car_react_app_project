import { useEffect, useRef } from "react";
import { FiCreditCard, FiHeadphones, FiShield, FiTruck } from "react-icons/fi";

function ServicesSection() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const servicesRef = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        const title = titleRef.current;
        const services = servicesRef.current;

        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(-30px)';

            setTimeout(() => {
                title.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 600);
        }

        services.forEach((service, index) => {
            if (service) {
                service.style.opacity = '0';
                service.style.transform = 'translateY(50px) scale(0.9)';

                setTimeout(() => {
                    service.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    service.style.opacity = '1';
                    service.style.transform = 'translateY(0) scale(1)';
                }, 800 + index * 150);
            }
        });
    }, []);

    const services = [
        {
            icon: <FiTruck className="w-8 h-8" />,
            title: "Livraison Rapide",
            description: "Service de livraison dans toute la ville sous 24h pour les commandes validées avant 16h."
        },
        {
            icon: <FiCreditCard className="w-8 h-8" />,
            title: "Paiement Sécurisé",
            description: "Plusieurs modes de paiement: cash, carte bancaire, virement ou paiement en plusieurs fois."
        },
        {
            icon: <FiShield className="w-8 h-8" />,
            title: "Garantie Complète",
            description: "Tous nos véhicules bénéficient d'une garantie de 12 mois minimum sur les pièces mécaniques."
        },
        {
            icon: <FiHeadphones className="w-8 h-8" />,
            title: "Support 7j/7",
            description: "Notre équipe est disponible pour vous accompagner tout au long de votre expérience d'achat."
        }
    ];

    return (
        <div className="mb-16">
            <h2
                ref={titleRef}
                className="text-3xl font-bold client-theme-text-primary text-center mb-12 transition-colors duration-300"
            >
                Nos Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                    <div
                        key={service.title}
                        ref={el => { servicesRef.current[index] = el; }}
                        className="client-theme-card-soft backdrop-blur-md rounded-xl p-6 border transition-all duration-300 group cursor-pointer hover:scale-105 hover:shadow-xl"
                    >
                        <div className="client-theme-text-secondary mb-4 flex justify-center transition-colors duration-300 group-hover:scale-110 transform">
                            {service.icon}
                        </div>
                        <h3 className="text-xl font-semibold client-theme-text-primary mb-2 text-center transition-colors duration-300">
                            {service.title}
                        </h3>
                        <p className="client-theme-text-secondary text-center transition-colors duration-300">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServicesSection;