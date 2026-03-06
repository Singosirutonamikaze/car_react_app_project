import { useEffect, useRef } from "react";

function HistorySection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const paragraphsRef = useRef<HTMLParagraphElement[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        const stats = statsRef.current;
        const paragraphs = paragraphsRef.current;

        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(60px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 400);
        }

        if (text) {
            text.style.opacity = '0';
            text.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                text.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                text.style.opacity = '1';
                text.style.transform = 'translateX(0)';
            }, 800);
        }

        paragraphs.forEach((paragraph, index) => {
            if (paragraph) {
                paragraph.style.opacity = '0';
                paragraph.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    paragraph.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    paragraph.style.opacity = '1';
                    paragraph.style.transform = 'translateY(0)';
                }, 1000 + index * 200);
            }
        });

        if (stats) {
            stats.style.opacity = '0';
            stats.style.transform = 'translateX(50px) scale(0.8)';
            
            setTimeout(() => {
                stats.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                stats.style.opacity = '1';
                stats.style.transform = 'translateX(0) scale(1)';
            }, 1200);
        }
    }, []);

    return (
        <div 
            ref={containerRef}
            className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 md:p-12 mb-16 border border-blue-700/30 hover:bg-blue-900/40 transition-all duration-300"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div ref={textRef}>
                    <h2 className="text-3xl font-bold text-white mb-6 hover:text-blue-100 transition-colors duration-300">Notre Histoire</h2>
                    <div className="space-y-4 text-blue-200">
                        <p 
                            ref={el => { if (el) paragraphsRef.current[0] = el; }}
                            className="hover:text-blue-100 transition-colors duration-300"
                        >
                            Fondé en 2015, CarHub est né de la passion de deux amis pour l'automobile et du constat
                            que l'achat d'un véhicule pouvait être simplifié et plus transparent.
                        </p>
                        <p 
                            ref={el => { if (el) paragraphsRef.current[1] = el; }}
                            className="hover:text-blue-100 transition-colors duration-300"
                        >
                            Aujourd'hui, nous sommes fiers d'être devenus une référence dans le secteur, avec des
                            milliers de véhicules livrés et une satisfaction client qui dépasse les 98%.
                        </p>
                        <p 
                            ref={el => { if (el) paragraphsRef.current[2] = el; }}
                            className="hover:text-blue-100 transition-colors duration-300"
                        >
                            Notre mission reste inchangée : rendre l'achat d'un véhicule accessible, sécurisé et
                            agréable pour tous.
                        </p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div 
                        ref={statsRef}
                        className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl h-64 w-full max-w-md flex items-center justify-center cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="text-center p-6">
                            <div className="text-5xl font-bold text-white mb-2 hover:scale-110 transition-transform duration-300">8+</div>
                            <div className="text-blue-200 hover:text-blue-100 transition-colors duration-300">Années d'expérience</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistorySection;