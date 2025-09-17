export interface Translation {
  form: {
    title: string
    date: string
    venue: string
    name: string
    namePlaceholder: string
    role: string
    roleOptions: {
      parent: string
      policyMaker: string
      expert: string
      school: string
      other: string
    }
    contact: string
    contactPlaceholder: string
    comments: string
    commentsPlaceholder: string
    submit: string
    submitting: string
    success: string
    error: string
    required: string
    selectRole: string
    otherRole: string
    otherRolePlaceholder: string
  }
  language: {
    select: string
    nl: string
    en: string
    ar: string
    tr: string
  }
}