import PresentationLayout from "../../../shared/components/layouts/PresentationLayout"
import VoituresRechercheSection from "../components/sections/VoituresRechercheSection"

function RecherchePage() {
  return (
    <PresentationLayout activeItem="/recherche">
      <div>
        <VoituresRechercheSection />
      </div>
    </PresentationLayout>
  )
}

export default RecherchePage
