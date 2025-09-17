import PresentationLayout from "../../../shared/components/layouts/PresentationLayout"
import ContactSection from "../components/sections/ContactSection"

function ContactPage() {
  return (
    <PresentationLayout activeItem="/contact">
      <div>
        <ContactSection />
      </div>
    </PresentationLayout>
  )
}

export default ContactPage
