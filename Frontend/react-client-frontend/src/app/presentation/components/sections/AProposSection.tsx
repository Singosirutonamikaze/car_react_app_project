import AProposHeroSection from "./AProposHeroSection";
import CTASection from "./CTASection";
import HistorySection from "./HistorySection";
import PaymentSection from "./PaymentSection";
import ServicesSection from "./ServicesSection";

function AProposPageSection() {
    return (
        <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 min-h-screen">
            <AProposHeroSection />
            <HistorySection />
            <ServicesSection />
            <PaymentSection />
            <CTASection />
        </div>
    );
}

export default AProposPageSection;