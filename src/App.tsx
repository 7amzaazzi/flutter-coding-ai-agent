import { ChatInterface } from './components/ChatInterface'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ChatInterface />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App 