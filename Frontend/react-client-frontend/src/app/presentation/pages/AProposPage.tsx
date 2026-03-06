import PresentationLayout from "../../../shared/components/layouts/PresentationLayout"
import AProposPageSection from "../components/sections/AProposSection"

function AProposPage() {
  return (
    <PresentationLayout activeItem='/a-propos'>
      <div>
        <AProposPageSection />
      </div>
    </PresentationLayout>
  )
}

export default AProposPage
