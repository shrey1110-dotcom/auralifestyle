///*import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import MicrosoftStrategy from "passport-microsoft";
import User from "../models/User.js";

// flags we can reuse in routes
export const providersEnabled = {
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL),
  microsoft: Boolean(process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET && process.env.MS_CALLBACK_URL),
};

export function configurePassport() {
  // GOOGLE (only if env vars present)
  if (providersEnabled.google) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (_at, _rt, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value?.toLowerCase() || null;
            const avatar = profile.photos?.[0]?.value || null;
            const providerId = profile.id;
            let user = await User.findOne({ provider: "google", providerId });
            if (!user) {
              user = await User.create({
                provider: "google",
                providerId,
                email,
                name: profile.displayName || "",
                avatar,
              });
            }
            done(null, user);
          } catch (e) {
            done(e);
          }
        }
      )
    );
  } else {
    console.warn("⚠️ Google OAuth disabled (missing GOOGLE_CLIENT_ID/SECRET/CALLBACK_URL).");
  }

  // MICROSOFT (only if env vars present)
  if (providersEnabled.microsoft) {
    passport.use(
      new MicrosoftStrategy(
        {
          clientID: process.env.MS_CLIENT_ID,
          clientSecret: process.env.MS_CLIENT_SECRET,
          callbackURL: process.env.MS_CALLBACK_URL,
          scope: ["user.read"],
        },
        async (_at, _rt, profile, done) => {
          try {
            const email =
              profile.emails?.[0]?.value?.toLowerCase() ||
              profile._json?.userPrincipalName ||
              null;
            const providerId = profile.id;
            let user = await User.findOne({ provider: "microsoft", providerId });
            if (!user) {
              user = await User.create({
                provider: "microsoft",
                providerId,
                email,
                name: profile.displayName || "",
                avatar: null,
              });
            }
            done(null, user);
          } catch (e) {
            done(e);
          }
        }
      )
    );
  } else {
    console.warn("⚠️ Microsoft OAuth disabled (missing MS_CLIENT_ID/SECRET/CALLBACK_URL).");
  }

  // session plumbing for OAuth handshake (safe to keep even if providers disabled)
  passport.serializeUser((user, done) => done(null, user._id.toString()));
  passport.deserializeUser(async (id, done) => {
    try {
      const u = await User.findById(id);
      done(null, u);
    } catch (e) {
      done(e);
    }
  });
}
///