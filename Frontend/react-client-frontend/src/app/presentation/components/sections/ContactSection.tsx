import { useEffect, useRef } from "react";
import ContactInfo from "./ContactInfo";
import ContactForm from "../forms/ContactForm";
import FAQSection from "./FAQSection";

function ContactSection() {
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const header = headerRef.current;
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-30px)';
            
            setTimeout(() => {
                header.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100);
        }
    }, []);

    return (
        <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 min-h-screen">
            <div ref={headerRef} className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text">
                    Contactez-nous
                </h1>
                <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                    Une question, une demande particulière ou besoin d'assistance? Notre équipe est là pour vous aider.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <ContactInfo />
                <ContactForm />
            </div>

            <FAQSection />
        </div>
    );
}

export default ContactSection;
