import { useEffect, useRef } from "react";
import { FiCreditCard } from "react-icons/fi";

function PaymentSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        const title = titleRef.current;
        const options = optionsRef.current;

        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(60px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 1000);
        }

        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                title.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                title.style.opacity = '1';
                title.style.transform = 'scale(1)';
            }, 1200);
        }

        options.forEach((option, index) => {
            if (option) {
                option.style.opacity = '0';
                option.style.transform = 'translateY(40px) rotate(-2deg)';
                
                setTimeout(() => {
                    option.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    option.style.opacity = '1';
                    option.style.transform = 'translateY(0) rotate(0deg)';
                }, 1400 + index * 200);
            }
        });
    }, []);

    const paymentOptions = [
        {
            icon: <FiCreditCard className="w-10 h-10 text-blue-300" />,
            title: "Paiement Comptant",
            description: "Bénéficiez d'une remise immédiate en réglant votre achat en une seule fois."
        },
        {
            icon: (
                <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
            ),
            title: "Paiement en Tranches",
            description: "Étalez vos paiements sur 3, 6 ou 12 mois sans frais supplémentaires."
        },
        {
            icon: (
                <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Financement sur Mesure",
            description: "Solutions de financement personnalisées avec nos partenaires bancaires."
        }
    ];

    return (
        <div 
            ref={containerRef}
            className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 md:p-12 mb-16 border border-blue-700/30 hover:bg-blue-900/40 transition-all duration-300"
        >
            <h2 
                ref={titleRef}
                className="text-3xl font-bold text-white text-center mb-8 hover:text-blue-100 transition-colors duration-300"
            >
                Options de Paiement Flexibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {paymentOptions.map((option, index) => (
                    <div 
                        key={index}
                        ref={el => { optionsRef.current[index] = el; }}
                        className="text-center group cursor-pointer"
                    >
                        <div className="bg-blue-800/40 rounded-xl p-4 mb-4 inline-flex group-hover:bg-blue-700/50 transition-all duration-300 group-hover:scale-110">
                            {option.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300">
                            {option.title}
                        </h3>
                        <p className="text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                            {option.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PaymentSection;