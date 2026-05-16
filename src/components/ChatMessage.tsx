import { Bot, User } from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  code?: string
  language?: string
}

export function ChatMessage({ role, content, code, language }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-3 mb-6 animate-fade-in ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`rounded-lg p-4 ${
          isUser 
            ? 'bg-primary text-primary-foreground ml-12' 
            : 'bg-card border border-border'
        }`}>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          
          {code && (
            <div className="mt-4">
              <CodeBlock code={code} language={language} />
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-4 w-4 text-foreground" />
        </div>
      )}
    </div>
  )
}
