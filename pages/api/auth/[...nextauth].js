import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages:{
      signIn: '/'
  },
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL,
})