import { useEffect, useRef, type MouseEvent } from "react";


function CTASection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const title = titleRef.current;
        const text = textRef.current;
        const button = buttonRef.current;

        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 1600);
        }

        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                title.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                title.style.opacity = '1';
                title.style.transform = 'scale(1)';
            }, 1800);
        }

        if (text) {
            text.style.opacity = '0';
            text.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                text.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                text.style.opacity = '1';
                text.style.transform = 'translateY(0)';
            }, 2000);
        }

        if (button) {
            button.style.opacity = '0';
            button.style.transform = 'translateY(30px) scale(0.8)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0) scale(1)';
            }, 2200);
        }
    }, []);

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const btn = e.currentTarget;
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    };

    return (
        <div ref={containerRef} className="text-center">
            <h2 
                ref={titleRef}
                className="text-3xl font-bold text-white mb-6 hover:text-blue-100 transition-colors duration-300"
            >
                Prêt à trouver votre véhicule idéal?
            </h2>
            <p 
                ref={textRef}
                className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto hover:text-blue-100 transition-colors duration-300"
            >
                Rejoignez des milliers de clients satisfaits et vivez une expérience d'achat automobile exceptionnelle.
            </p>
            <button 
                ref={buttonRef}
                onClick={handleButtonClick}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl"
            >
                Explorer notre collection
            </button>
        </div>
    );
}

export default CTASection;