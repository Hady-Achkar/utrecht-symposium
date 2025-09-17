"use client";

import { useState } from "react";
import { SymposiumForm } from "./symposium-form";

const languages = [
  { code: "nl", flag: "🇳🇱", name: "Nederlands", welcome: "Welkom" },
  { code: "en", flag: "🇬🇧", name: "English", welcome: "Welcome" },
  { code: "ar", flag: "🇸🇦", name: "العربية", welcome: "مرحباً", rtl: true },
  { code: "tr", flag: "🇹🇷", name: "Türkçe", welcome: "Hoş geldiniz" },
];

export function LanguageLanding() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  if (selectedLanguage) {
    return <SymposiumForm initialLanguage={selectedLanguage} />;
  }

  return (
    <div className="min-h-screen bg-[#f0ebf8] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-lg border-t-[10px] border-t-[#673ab7] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-normal text-[#202124] mb-4">
              Symposium Registratie
            </h1>
            <p className="text-lg text-[#5f6368] mb-2">
              Utrecht · 15 October / oktober · 19:30
            </p>
            <p className="text-[#5f6368]">
              Huis van Actief Burgerschap, Bibliotheek Neude
            </p>
          </div>

          <div className="border-t border-[#dadce0] pt-8">
            <p className="text-center text-[#202124] mb-6 text-lg">
              Selecteer uw taal
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className="group relative bg-white border-2 border-[#dadce0] rounded-lg p-6 hover:border-[#673ab7] hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  dir={lang.rtl ? "rtl" : "ltr"}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3">{lang.flag}</div>
                    <div className="text-[#202124] font-medium text-lg mb-1">
                      {lang.name}
                    </div>
                    <div className="text-[#673ab7] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {lang.welcome}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#dadce0]">
            <p className="text-center text-xs text-[#70757a]">
              Kansenongelijkheid en de kracht van taal in het basisonderwijs
              <br />
              Inequality of Opportunity and the Power of Language in Primary
              Education
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
