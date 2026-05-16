import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Loader2, Moon, Sun, Languages } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ChatMessage } from './ChatMessage'
import { ExamplePrompts } from './ExamplePrompts'
import { blink } from '../lib/blink'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  code?: string
  language?: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const { t, language, setLanguage, isRTL } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (prompt?: string) => {
    const messageText = prompt || input.trim()
    if (!messageText || isLoading) return

    setInput('')
    setIsLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText
    }

    setMessages(prev => [...prev, userMessage])

    try {
      // Generate AI response
      const { text } = await blink.ai.generateText({
        prompt: `You are a Flutter coding expert assistant. Help the user with their Flutter development question. If you provide code, format it clearly. Be concise and helpful.

User question: ${messageText}`,
        maxTokens: 1000
      })

      // Extract code blocks from response
      const codeMatch = text.match(/```(\w+)?\n([\s\S]*?)```/)
      const code = codeMatch ? codeMatch[2].trim() : undefined
      const language = codeMatch ? (codeMatch[1] || 'dart') : undefined
      const contentWithoutCode = code ? text.replace(/```(\w+)?\n[\s\S]*?```/, '').trim() : text

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: contentWithoutCode,
        code,
        language
      }

      setMessages(prev => [...prev, assistantMessage])

      // Save to database if user is logged in
      if (user?.id) {
        if (!conversationId) {
          const newConvId = `conv_${Date.now()}`
          setConversationId(newConvId)
          
          await blink.db.conversations.create({
            id: newConvId,
            userId: user.id,
            title: messageText.slice(0, 50) + (messageText.length > 50 ? '...' : ''),
            createdAt: Date.now(),
            updatedAt: Date.now()
          })

          await blink.db.messages.createMany([
            {
              id: userMessage.id,
              conversationId: newConvId,
              userId: user.id,
              role: 'user',
              content: messageText,
              createdAt: Date.now()
            },
            {
              id: assistantMessage.id,
              conversationId: newConvId,
              userId: user.id,
              role: 'assistant',
              content: assistantMessage.content,
              code: assistantMessage.code || null,
              language: assistantMessage.language || null,
              createdAt: Date.now()
            }
          ])
        } else {
          await blink.db.messages.createMany([
            {
              id: userMessage.id,
              conversationId,
              userId: user.id,
              role: 'user',
              content: messageText,
              createdAt: Date.now()
            },
            {
              id: assistantMessage.id,
              conversationId,
              userId: user.id,
              role: 'assistant',
              content: assistantMessage.content,
              code: assistantMessage.code || null,
              language: assistantMessage.language || null,
              createdAt: Date.now()
            }
          ])

          await blink.db.conversations.update(conversationId, {
            updatedAt: Date.now()
          })
        }
      }
    } catch (error) {
      console.error('Error generating response:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">{t('appTitle')}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English {language === 'en' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')}>
                  العربية {language === 'ar' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Auth */}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => blink.auth.logout()}
              >
                {t('signOut')}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => blink.auth.login()}
              >
                {t('signIn')}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4">
          {messages.length === 0 ? (
            <ExamplePrompts onSelect={handleSubmit} />
          ) : (
            <div className="py-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} {...message} />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  </div>
                  <div className="flex-1 max-w-3xl">
                    <div className="rounded-lg p-4 bg-card border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t('aiThinking')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('typeMessage')}
              className="pr-12 min-h-[60px] max-h-[200px] resize-none"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="absolute right-2 bottom-2"
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
