import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" },
        company: { label: "Company", type: "text", optional: true as any }
      },
      async authorize(credentials) {
        try {
          const action = credentials?.action || 'login'
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${action}`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              company: credentials?.company
            }),
            headers: { 'Content-Type': 'application/json' },
          })

          const data = await res.json()

          if (res.ok && data) {
            return {
              id: data.id || data.access_token,
              email: credentials?.email as string,
              accessToken: data.access_token
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        ; (token as any).accessToken = (user as any).accessToken
      }
      return token
    },
    async session({ session, token }) {
      ; (session.user as any).accessToken = (token as any).accessToken as string | undefined
      return session
    },
  },
})
