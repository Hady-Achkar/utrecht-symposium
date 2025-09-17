"use client"

import { useSearchParams } from "next/navigation"
import { SymposiumForm } from "@/components/symposium-form"

export default function FormPageContent() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "nl"

  return <SymposiumForm initialLanguage={lang} />
}