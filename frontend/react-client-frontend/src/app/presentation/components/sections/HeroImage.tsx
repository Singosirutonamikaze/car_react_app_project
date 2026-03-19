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
                <div ref={imageRef} className="client-theme-card-soft backdrop-blur-md rounded-2xl p-8 border transform rotate-3">
                    <div className="rounded-xl overflow-hidden h-80 flex items-center justify-center client-layout-gradient">
                        <div className="text-center p-6">
                            <img src={ImageHeroSection} alt="Visuel principal de la section Hero" />
                        </div>
                    </div>
                </div>

                <div ref={decor1Ref} className="absolute -bottom-6 -left-6 w-24 h-24 rounded-xl backdrop-blur-md border transform -rotate-12 client-theme-hero-decor-soft"></div>
                <div ref={decor2Ref} className="absolute -top-6 -right-6 w-20 h-20 rounded-xl backdrop-blur-md border transform rotate-12 client-theme-hero-decor-strong"></div>
            </div>
        </div>
    );
}

export default HeroImage;