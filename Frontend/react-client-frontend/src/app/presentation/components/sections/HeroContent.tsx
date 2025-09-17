import { useRef, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../../router";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { gsap } from "gsap";

interface HeroContentProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: FormEvent) => void;
}

function HeroContent({ searchQuery, setSearchQuery, handleSearch }: HeroContentProps) {
    const navigate = useNavigate();
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const searchRef = useRef<HTMLFormElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(titleRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        )
            .fromTo(subtitleRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
                "-=0.5"
            )
            .fromTo(searchRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
                "-=0.3"
            )
            .fromTo(statsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
                "-=0.3"
            )
            .fromTo(buttonsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
                "-=0.3"
            );
    }, []);

    return (
        <div className="flex-1 text-center lg:text-left">
            <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Trouvez la voiture
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> parfaite </span>
                pour vous
            </h1>

            <p ref={subtitleRef} className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                Découvrez notre sélection exclusive de véhicules d'exception.
                Des performances incomparables à des prix compétitifs.
            </p>

            <form ref={searchRef} onSubmit={handleSearch} className="mb-10 max-w-2xl mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiSearch className="text-blue-300" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher une marque, un modèle..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-blue-900/40 backdrop-blur-md border border-blue-700/50 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        Rechercher
                        <FiArrowRight />
                    </button>
                </div>
            </form>

            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 max-w-2xl">
                <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white">500+</div>
                    <div className="text-blue-200">Voitures disponibles</div>
                </div>
                <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white">98%</div>
                    <div className="text-blue-200">Clients satisfaits</div>
                </div>
                <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white">25+</div>
                    <div className="text-blue-200">Villes desservies</div>
                </div>
            </div>

            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 mb-16">
                <button
                    onClick={() => navigate(ROUTES.CARS)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                    Explorer notre collection
                </button>
                <button
                    onClick={() => navigate(ROUTES.SIGNUP)}
                    className="bg-blue-900/40 backdrop-blur-md border border-blue-700/50 hover:border-blue-500/70 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                    Créer un compte
                </button>
            </div>
        </div>
    );
}

export default HeroContent;