import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations = {
  en: {
    // Header
    appTitle: 'Flutter Coding AI Agent',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    
    // Chat
    typeMessage: 'Ask me anything about Flutter...',
    examplePrompt1: 'How do I create a StatefulWidget?',
    examplePrompt2: 'Explain Flutter\'s widget tree',
    examplePrompt3: 'Show me how to use ListView.builder',
    examplePrompt4: 'What are the best state management solutions?',
    tryExample: 'Try an example',
    send: 'Send',
    
    // Messages
    aiThinking: 'AI is thinking...',
    errorMessage: 'Failed to send message. Please try again.',
    copied: 'Copied!',
    copy: 'Copy',
    
    // Auth
    signInPrompt: 'Sign in to save your conversations',
    welcome: 'Welcome',
  },
  ar: {
    // Header
    appTitle: 'وكيل Flutter للبرمجة بالذكاء الاصطناعي',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    
    // Chat
    typeMessage: 'اسألني أي شيء عن Flutter...',
    examplePrompt1: 'كيف أنشئ StatefulWidget؟',
    examplePrompt2: 'اشرح شجرة الواجهات في Flutter',
    examplePrompt3: 'أرني كيفية استخدام ListView.builder',
    examplePrompt4: 'ما هي أفضل حلول إدارة الحالة؟',
    tryExample: 'جرب مثالاً',
    send: 'إرسال',
    
    // Messages
    aiThinking: 'الذكاء الاصطناعي يفكر...',
    errorMessage: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    copied: 'تم النسخ!',
    copy: 'نسخ',
    
    // Auth
    signInPrompt: 'سجل الدخول لحفظ محادثاتك',
    welcome: 'أهلاً',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved === 'ar' || saved === 'en') ? saved : 'en'
  })

  const isRTL = language === 'ar'

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language, isRTL])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
