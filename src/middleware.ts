import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      console.log("req.nextUrl.pathname", req.nextUrl.pathname);
      // There is no need to check for authorization on API routes. TRPC handles that.
      if (req.nextUrl.pathname.startsWith("/api")) {
        return true;
      }

      // Login page shoud also be acessible to unauthorized users
      if (req.nextUrl.pathname.startsWith("/login")) {
        return true;
      }
      return !!token;
    },
  },
});
