import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import ImageHeroSection from "../../../../assets/images/cars/hero.png"

function HeroImage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const decor1Ref = useRef<HTMLDivElement>(null);
    const decor2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(containerRef.current,
            { opacity: 0, x: 50, rotation: 5 },
            { opacity: 1, x: 0, rotation: 3, duration: 1, ease: "power3.out" }
        )
            .fromTo(imageRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
                "-=0.5"
            )
            .fromTo(decor1Ref.current,
                { opacity: 0, scale: 0, rotation: -45 },
                { opacity: 1, scale: 1, rotation: -12, duration: 0.6, ease: "back.out(1.7)" },
                "-=0.3"
            )
            .fromTo(decor2Ref.current,
                { opacity: 0, scale: 0, rotation: 45 },
                { opacity: 1, scale: 1, rotation: 12, duration: 0.6, ease: "back.out(1.7)" },
                "-=0.3"
            );
    }, []);

    return (
        <div className="flex-1 flex justify-center lg:justify-end">
            <div ref={containerRef} className="relative w-full max-w-lg">
                <div ref={imageRef} className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 border border-blue-700/30 transform rotate-3">
                    <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl overflow-hidden h-80 flex items-center justify-center">
                        <div className="text-center p-6">
                           <img src={ImageHeroSection} alt="Image de la section Hero" />
                        </div>
                    </div>
                </div>

                <div ref={decor1Ref} className="absolute -bottom-6 -left-6 w-24 h-24 bg-cyan-500/20 rounded-xl backdrop-blur-md border border-cyan-400/30 transform -rotate-12"></div>
                <div ref={decor2Ref} className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/20 rounded-xl backdrop-blur-md border border-blue-400/30 transform rotate-12"></div>
            </div>
        </div>
    );
}

export default HeroImage;