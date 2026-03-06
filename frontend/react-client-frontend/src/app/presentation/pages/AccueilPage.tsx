import PresentationLayout from "../../../shared/components/layouts/PresentationLayout"
import HeroSection from "../components/sections/HeroSection"

function AccueilPage() {
  return (
    <PresentationLayout activeItem='/home'>
     <div>
       <HeroSection />
     </div>
    </PresentationLayout>
  )
}

export default AccueilPage
