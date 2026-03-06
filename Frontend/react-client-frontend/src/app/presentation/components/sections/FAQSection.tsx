import { useEffect, useRef } from "react";

function FAQSection() {
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const faqRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        const title = titleRef.current;
        const faqs = faqRefs.current;

        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                title.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 600);
        }

        faqs.forEach((faq, index) => {
            if (faq) {
                faq.style.opacity = '0';
                faq.style.transform = 'translateY(30px) scale(0.95)';
                
                setTimeout(() => {
                    faq.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    faq.style.opacity = '1';
                    faq.style.transform = 'translateY(0) scale(1)';
                }, 800 + index * 100);
            }
        });
    }, []);

    const faqData = [
        {
            question: "Quels sont les modes de paiement acceptés?",
            answer: "Nous acceptons les paiements en espèces, par virement bancaire, mobile money (Flooz, TMoney) et cartes bancaires."
        },
        {
            question: "Proposez-vous une garantie sur les véhicules?",
            answer: "Oui, tous nos véhicules bénéficient d'une garantie minimale de 6 mois sur les pièces mécaniques."
        },
        {
            question: "Proposez-vous des services de dédouanement?",
            answer: "Oui, nous pouvons vous accompagner dans les démarches de dédouanement pour les véhicules importés."
        },
        {
            question: "Livrez-vous dans toutes les régions du Togo?",
            answer: "Oui, nous livrons dans toutes les régions du Togo (Maritime, Plateaux, Centrale, Kara, Savanes)."
        },
        {
            question: "Proposez-vous du financement?",
            answer: "Oui, nous travaillons avec des institutions financières locales pour vous proposer des solutions de financement adaptées."
        },
        {
            question: "Les véhicules sont-ils adaptés aux routes togolaises?",
            answer: "Absolument! Nous sélectionnons spécialement des véhicules robustes et adaptés aux conditions routières du Togo."
        }
    ];

    return (
        <div className="mt-16">
            <h2 
                ref={titleRef}
                className="text-3xl font-bold text-white text-center mb-8"
            >
                Questions fréquentes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqData.map((faq, index) => (
                    <div 
                        key={index}
                        ref={el => { faqRefs.current[index] = el; }}
                        className="bg-blue-900/30 backdrop-blur-md rounded-xl p-6 border border-blue-700/30 hover:bg-blue-900/40 transition-all duration-300 group cursor-pointer hover:scale-105 hover:shadow-xl"
                    >
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300">
                            {faq.question}
                        </h3>
                        <p className="text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FAQSection;