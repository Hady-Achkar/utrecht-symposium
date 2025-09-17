"use client";

import { useState } from "react";
import { LanguageSelector } from "./language-selector";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { Translation } from "@/types/translations";

import nlTranslations from "@/translations/nl.json";
import enTranslations from "@/translations/en.json";
import arTranslations from "@/translations/ar.json";
import trTranslations from "@/translations/tr.json";

const translations: Record<string, Translation> = {
  nl: nlTranslations as Translation,
  en: enTranslations as Translation,
  ar: arTranslations as Translation,
  tr: trTranslations as Translation,
};

interface SymposiumFormProps {
  initialLanguage?: string;
}

export function SymposiumForm({ initialLanguage = "nl" }: SymposiumFormProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    otherRole: "",
    contact: "",
    comments: "",
  });

  const t = translations[language].form;
  const isRTL = language === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: dbError } = await supabase
        .from("symposium_registrations")
        .insert([
          {
            name: formData.name,
            role: formData.role === "other" ? `other: ${formData.otherRole}` : formData.role,
            contact: formData.contact,
            comments: formData.comments,
            language,
            created_at: new Date().toISOString(),
          },
        ]);

      if (dbError) throw dbError;

      // Send notification email
      await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role === "other" ? `other: ${formData.otherRole}` : formData.role,
          contact: formData.contact,
          comments: formData.comments,
          language,
        }),
      });

      setSubmitted(true);
      setFormData({
        name: "",
        role: "",
        otherRole: "",
        contact: "",
        comments: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f0ebf8] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg border-t-[10px] border-t-[#673ab7] p-8 text-center">
            <h2 className="text-2xl font-normal text-[#202124] mb-4">
              {t.success}
            </h2>
            <p className="text-[#5f6368] mb-6">
              {language === "nl" ? "Uw antwoord is geregistreerd." :
               language === "en" ? "Your response has been recorded." :
               language === "ar" ? "تم تسجيل إجابتك." : "Yanıtınız kaydedildi."}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[#673ab7] hover:underline font-medium"
            >
              {language === "nl" ? "Nog een antwoord verzenden" :
               language === "en" ? "Submit another response" :
               language === "ar" ? "إرسال رد آخر" : "Başka bir yanıt gönder"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f0ebf8] py-4 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg overflow-hidden border-t-[10px] border-t-[#673ab7] mb-3">
          {/* Header Image */}
          <div className="w-full h-48 bg-gradient-to-r from-[#673ab7] to-[#8b5cf6] relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-5xl mb-2">🏫</p>
                <p className="text-lg font-medium">Utrecht Symposium 2024</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h1 className="text-[32px] font-normal text-[#202124] leading-[135%]">
              {t.title}
            </h1>
            <div className="mt-3 space-y-1">
              <p className="text-base text-[#5f6368] flex items-center gap-2">
                <span>📅</span> {t.date}
              </p>
              <p className="text-base text-[#5f6368] flex items-center gap-2">
                <span>📍</span> {t.venue}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#dadce0] flex items-center justify-between">
              <div className="text-[#d93025] text-sm">* {t.required}</div>
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                translations={translations[language]}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="bg-white rounded-lg mb-3 p-6">
            <div className="space-y-2">
              <label className="block text-base text-[#202124] font-medium">
                {t.name}
                <span className="text-[#d93025] ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.namePlaceholder}
                required
                className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none py-1 text-sm text-[#202124] placeholder:text-[#70757a] transition-colors"
              />
            </div>
          </div>

          {/* Role Field */}
          <div className="bg-white rounded-lg mb-3 p-6">
            <div className="space-y-2">
              <label className="block text-base text-[#202124] font-medium mb-3">
                {t.role}
                <span className="text-[#d93025] ml-1">*</span>
              </label>
              <div className="space-y-3">
                {Object.entries(t.roleOptions).map(([value, label]) => (
                  <label key={value} className="flex items-center cursor-pointer hover:bg-[#f8f9fa] -mx-2 px-2 py-2 rounded">
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={formData.role === value}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value, otherRole: "" })}
                      className="w-5 h-5 text-[#673ab7] border-2 border-[#5f6368] focus:ring-[#673ab7] focus:ring-offset-0 cursor-pointer"
                      required
                    />
                    <span className="ml-3 text-sm text-[#202124]">{label as string}</span>
                  </label>
                ))}
              </div>
              {/* Other Role Input */}
              {formData.role === "other" && (
                <div className="mt-4 pl-8">
                  <label className="block text-sm text-[#202124] font-medium mb-2">
                    {t.otherRole}
                  </label>
                  <input
                    type="text"
                    value={formData.otherRole}
                    onChange={(e) => setFormData({ ...formData, otherRole: e.target.value })}
                    placeholder={t.otherRolePlaceholder}
                    className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none py-1 text-sm text-[#202124] placeholder:text-[#70757a] transition-colors"
                    required={formData.role === "other"}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contact Field */}
          <div className="bg-white rounded-lg mb-3 p-6">
            <div className="space-y-2">
              <label className="block text-base text-[#202124] font-medium">
                {t.contact}
                <span className="text-[#d93025] ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder={t.contactPlaceholder}
                required
                className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none py-1 text-sm text-[#202124] placeholder:text-[#70757a] transition-colors"
              />
            </div>
          </div>

          {/* Comments Field */}
          <div className="bg-white rounded-lg mb-3 p-6">
            <div className="space-y-2">
              <label className="block text-base text-[#202124] font-medium">
                {t.comments}
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder={t.commentsPlaceholder}
                rows={3}
                className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none py-1 text-sm text-[#202124] placeholder:text-[#70757a] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#fce8e6] text-[#d93025] rounded-lg p-4 mb-3 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.role || !formData.contact}
              className="bg-[#673ab7] text-white px-6 py-2 rounded hover:bg-[#5e35b1] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? t.submitting : t.submit}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "",
                  role: "",
                  otherRole: "",
                  contact: "",
                  comments: "",
                });
                setError("");
              }}
              className="text-[#673ab7] hover:bg-[#f8f9fa] px-4 py-2 rounded font-medium text-sm transition-colors"
            >
              {language === "nl" ? "Formulier wissen" :
               language === "en" ? "Clear form" :
               language === "ar" ? "مسح النموذج" : "Formu temizle"}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-[#70757a]">
            {language === "nl" ? "Dit formulier is gemaakt met Next.js en Supabase" :
             language === "en" ? "This form was created with Next.js and Supabase" :
             language === "ar" ? "تم إنشاء هذا النموذج باستخدام Next.js و Supabase" :
             "Bu form Next.js ve Supabase ile oluşturuldu"}
          </div>
        </form>
      </div>
    </div>
  );
}