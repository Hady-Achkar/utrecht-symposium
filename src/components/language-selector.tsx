"use client"

import { Languages } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Translation } from "@/types/translations"

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
  translations: Translation
}

const languageFlags: Record<string, string> = {
  nl: "🇳🇱",
  en: "🇬🇧",
  ar: "🇸🇦",
  tr: "🇹🇷",
}

export function LanguageSelector({ value, onChange, translations }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Languages className="h-5 w-5 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{languageFlags[value]}</span>
              <span>{translations.language[value as keyof typeof translations.language]}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nl">
            <span className="flex items-center gap-2">
              <span>{languageFlags.nl}</span>
              <span>{translations.language.nl}</span>
            </span>
          </SelectItem>
          <SelectItem value="en">
            <span className="flex items-center gap-2">
              <span>{languageFlags.en}</span>
              <span>{translations.language.en}</span>
            </span>
          </SelectItem>
          <SelectItem value="ar">
            <span className="flex items-center gap-2">
              <span>{languageFlags.ar}</span>
              <span>{translations.language.ar}</span>
            </span>
          </SelectItem>
          <SelectItem value="tr">
            <span className="flex items-center gap-2">
              <span>{languageFlags.tr}</span>
              <span>{translations.language.tr}</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}