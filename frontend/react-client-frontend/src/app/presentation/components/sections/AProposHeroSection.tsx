import { useEffect, useRef } from "react";

function AProposHeroSection() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const title = titleRef.current;
        const description = descriptionRef.current;

        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(-50px) scale(0.9)';

            setTimeout(() => {
                title.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0) scale(1)';
            }, 200);
        }

        if (description) {
            description.style.opacity = '0';
            description.style.transform = 'translateY(30px)';

            setTimeout(() => {
                description.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                description.style.opacity = '1';
                description.style.transform = 'translateY(0)';
            }, 600);
        }
    }, []);

    return (
        <div className="mb-16">
            <div className="w-full max-w-3xl client-page-heading-wrap">
                <h1
                    ref={titleRef}
                    className="client-page-heading"
                >
                    À propos de CarHub
                </h1>

                <p
                    ref={descriptionRef}
                    className="client-page-subheading"
                >
                    Découvrez l'histoire derrière CarHub et notre engagement à vous offrir la meilleure expérience automobile.
                </p>
            </div>
        </div>
    );
}

export default AProposHeroSection;