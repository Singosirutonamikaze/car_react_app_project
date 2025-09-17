import PresentationLayout from "../../../shared/components/layouts/PresentationLayout"
import VoituresListSection from "../components/sections/VoituresListSection"

function VoituresPage() {
  return (
     <PresentationLayout activeItem="/voitures">
      <div className="">
        <VoituresListSection />
      </div>
    </PresentationLayout>
  )
}

export default VoituresPage
