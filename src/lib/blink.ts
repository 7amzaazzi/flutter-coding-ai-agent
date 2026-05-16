import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'flutter-coding-agent-7gxhp6kj',
  authRequired: false,
  auth: {
    mode: 'managed'
  }
})
