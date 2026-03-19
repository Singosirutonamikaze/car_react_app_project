// src/app/presentation/components/sections/HeroSection.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../../router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import FeaturesSection from "./FeaturesSection";

if (globalThis.window !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
}

function HeroSection() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 z-0 client-theme-hero-overlay"></div>

            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 rounded-full filter blur-3xl opacity-30 animate-pulse-slow client-theme-hero-orb-1"></div>
                <div className="absolute top-40 right-20 w-96 h-96 rounded-full filter blur-3xl opacity-20 animate-pulse-slow client-theme-hero-orb-2"></div>
                <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full filter blur-3xl opacity-25 animate-pulse-slow client-theme-hero-orb-3"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <HeroContent
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearch={handleSearch}
                    />
                    <HeroImage />
                </div>

                <FeaturesSection />
            </div>
        </div>
    );
}

export default HeroSection;