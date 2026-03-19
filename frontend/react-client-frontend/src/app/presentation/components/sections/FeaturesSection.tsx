// src/app/presentation/components/sections/FeaturesSection.tsx
import { useRef, useEffect } from "react";
import { FiStar, FiShield, FiTrendingUp } from "react-icons/fi";
import { gsap } from "gsap";

function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        featureRefs.current.forEach((feature, index) => {
            if (feature) {
                tl.fromTo(feature,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                    index * 0.1
                );
            }
        });
    }, []);

    const features = [
        {
            icon: <FiStar className="w-6 h-6" />,
            title: "Qualité Premium",
            description: "Des véhicules sélectionnés pour leur excellence"
        },
        {
            icon: <FiShield className="w-6 h-6" />,
            title: "Sécurité Garantie",
            description: "Tous nos véhicules sont inspectés et certifiés"
        },
        {
            icon: <FiTrendingUp className="w-6 h-6" />,
            title: "Meilleur Prix",
            description: "Des offres compétitives pour tous les budgets"
        }
    ];

    return (
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-10 border-t client-border-t">
            {features.map((feature, index) => (
                <div
                    key={feature.title}
                    ref={el => { featureRefs.current[index] = el; }}
                    className="client-theme-card-soft backdrop-blur-md rounded-xl p-6 border transition-all duration-300"
                >
                    <div className="client-theme-text-secondary mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold client-theme-text-primary mb-2">{feature.title}</h3>
                    <p className="client-theme-text-secondary">{feature.description}</p>
                </div>
            ))}
        </div>
    );
}

export default FeaturesSection;