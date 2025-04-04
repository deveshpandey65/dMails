
            
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
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
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000, // New expiry time
            refreshToken: refreshedTokens.refresh_token || token.refreshToken, // Use new refresh token if provided
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
                    ].join(" "), // Convert array to space-separated string
                    access_type: "offline",
                    prompt: "consent", // Ensures refresh token is always received
                },
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, account }) {
            // On initial sign-in
            if (account) {
                token.id_token = account.id_token;
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = account.expires_at * 1000; // Convert to milliseconds
            }

            // Check if token is expired
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Refresh access token
            return await refreshGoogleToken(token);
        },

        async session({ session, token }) {
            if (token.id_token) {
                try {
                    const res = await fetch("https://dmails.netlify.app/auth/google-login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            token: token.id_token,
                            accessToken: token.accessToken,
                            refreshToken: token.refreshToken,
                        }),
                    });
                    const data = await res.json();

                    if (res.ok) {
                        session.jwt = data.token;
                        session.user = data.user;
                    }
                    else{
                        console.error("Error fetching session:", data.message);
                    }
                } catch (error) {
                    console.error("Google Login Error:", error);
                }
            } else {
                console.error("No ID token found in token object!");
            }

            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
