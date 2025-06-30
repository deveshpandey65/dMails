import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
require("dotenv").config();

async function refreshGoogleToken(token) {
    try {
        const url = "https://oauth2.googleapis.com/token";
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: token.refreshToken,
                grant_type: "refresh_token",
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw new Error(refreshedTokens.error || "Failed to refresh access token");
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token || token.refreshToken,
        };
    } catch (error) {
        console.error("Failed to refresh access token:", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: [
                        "openid",
                        "email",
                        "profile",
                        "https://www.googleapis.com/auth/gmail.readonly",
                        "https://www.googleapis.com/auth/gmail.modify",
                        "https://www.googleapis.com/auth/userinfo.email",
                    ].join(" "),
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, account, user }) {
            // Initial sign-in
            console.log( "token:",token)
            if (account) {
                token.id_token = account.id_token;
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                console.log("URL:", process.env.NEXT_PUBLIC_BACKEND_URL)
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            token: account.id_token,
                            accessToken: account.access_token,
                            refreshToken: account.refresh_token,
                        }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                        token.appJwt = data.token;
                        token.appUser = data.user;
                    } else {
                        console.error("❌ Failed to login to backend:", data.message);
                    }
                } catch (err) {
                    console.error("❌ Backend login error:", err);
                }
            }
              

            if (Date.now() < token.accessTokenExpires) return token;

            return await refreshGoogleToken(token);
        },

        async session({ session, token }) {
            console.log("Token Session:", token);

            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.expires = token.accessTokenExpires;
            session.id_token = token.id_token;
            console.log( "Token Session:",token );
            if (token.appJwt) {
                session.jwt = token.appJwt;         
                session.user = token.appUser || session.user;
            }

            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
