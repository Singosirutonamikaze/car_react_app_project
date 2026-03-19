import { useEffect, useRef, useState } from "react";
import { FaFacebook, FaInstagram, FaTelegram, FaYoutube } from "react-icons/fa";
import ContactInfo from "./ContactInfo";
import ContactForm from "../forms/ContactForm";
import FAQSection from "./FAQSection";

function ContactSection() {
    const headerRef = useRef<HTMLDivElement>(null);
    const [showSocials, setShowSocials] = useState(false);

    const socialLinks = [
        {
            label: "Telegram",
            icon: FaTelegram,
            href: "https://t.me/",
        },
        {
            label: "YouTube",
            icon: FaYoutube,
            href: "https://youtube.com/",
        },
        {
            label: "Facebook",
            icon: FaFacebook,
            href: "https://facebook.com/",
        },
        {
            label: "Instagram",
            icon: FaInstagram,
            href: "https://instagram.com/",
        },
    ];

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
        <div className="container mx-auto px-4 py-12 min-h-screen client-layout-gradient client-theme-text-primary">
            <div ref={headerRef} className="mb-12 max-w-3xl">
                <h1 className="client-page-heading">
                    Contactez-nous
                </h1>
                <p className="client-page-subheading">
                    Une question, une demande particulière ou besoin d'assistance? Notre équipe est là pour vous aider.
                </p>

                <div className="mt-4">
                    <button
                        type="button"
                        className="client-theme-button border px-4 py-2 text-sm font-medium"
                        onClick={() => setShowSocials((prev) => !prev)}
                    >
                        Reseaux de partage
                    </button>

                    <div
                        className={`mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 transition-all duration-200 ${showSocials
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0 overflow-hidden"
                            }`}
                    >
                        {socialLinks.map((social) => {
                            const Icon = social.icon;

                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="client-theme-outline-button border px-3 py-2 text-sm flex items-center justify-center gap-2"
                                >
                                    <Icon />
                                    {social.label}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <ContactInfo />
                <ContactForm />
            </div>

            <FAQSection />
        </div>
    );
}

export default ContactSection;
