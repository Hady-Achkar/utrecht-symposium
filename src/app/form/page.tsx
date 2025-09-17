import { Suspense } from "react"
import FormPageContent from "@/components/form-page-content"

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
      <FormPageContent />
    </Suspense>
  )
}