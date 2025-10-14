import NextAuth from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            accessToken?: string
            email?: string | null
            name?: string | null
            image?: string | null
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string
    }
}
