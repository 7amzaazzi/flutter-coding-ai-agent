import { Code2, Bug, Lightbulb, Zap } from 'lucide-react'
import { Card } from './ui/card'
import { useLanguage } from '../contexts/LanguageContext'

interface ExamplePromptsProps {
  onSelect: (prompt: string) => void
}



export function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  const { t } = useLanguage()
  
  const examples = [
    {
      icon: Code2,
      title: t('examplePrompt1'),
      prompt: t('examplePrompt1'),
      color: 'text-blue-500'
    },
    {
      icon: Bug,
      title: t('examplePrompt2'),
      prompt: t('examplePrompt2'),
      color: 'text-red-500'
    },
    {
      icon: Lightbulb,
      title: t('examplePrompt3'),
      prompt: t('examplePrompt3'),
      color: 'text-yellow-500'
    },
    {
      icon: Zap,
      title: t('examplePrompt4'),
      prompt: t('examplePrompt4'),
      color: 'text-green-500'
    }
  ]
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t('appTitle')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('tryExample')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((example) => (
          <Card
            key={example.title}
            className="p-4 hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
            onClick={() => onSelect(example.prompt)}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-secondary ${example.color}`}>
                <example.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{example.title}</h3>
                <p className="text-sm text-muted-foreground">{example.prompt}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
