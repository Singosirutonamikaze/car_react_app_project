import type { ReactNode } from "react"
import NavBarPresentation from "../ui/navbars/NavBarPresentation"

function PresentationLayout({children}: { children: ReactNode }) {
  return (
    <div className="">
        <div className="">
          <NavBarPresentation />
        </div>
        <div className="">
          {children}
        </div>
    </div>
  )
}

export default PresentationLayout
