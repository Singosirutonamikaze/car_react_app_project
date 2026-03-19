import AProposHeroSection from "./AProposHeroSection";
import CTASection from "./CTASection";
import HistorySection from "./HistorySection";
import PaymentSection from "./PaymentSection";
import ServicesSection from "./ServicesSection";

function AProposPageSection() {
    return (
        <div className="container mx-auto px-4 py-12 min-h-screen client-layout-gradient client-theme-text-primary">
            <AProposHeroSection />
            <HistorySection />
            <ServicesSection />
            <PaymentSection />
            <CTASection />
        </div>
    );
}

export default AProposPageSection;