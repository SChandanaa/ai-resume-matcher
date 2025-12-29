const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

const configurePassport = () => {
    // Google Strategy
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists by email or googleId
                let user = await User.findOne({ 
                    $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] 
                });

                if (!user) {
                    // Create new user
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        role: 'candidate' // default role
                    });
                } else if (!user.googleId) {
                    // Link Google account to existing email user
                    user.googleId = profile.id;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }));
    } else {
        console.warn("Google Client ID/Secret not found in environment variables. Google OAuth will not work.");
    }

    // GitHub Strategy
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
        passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/api/auth/github/callback",
            scope: ['user:email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // GitHub emails can be private, so profile.emails might need specific handling or fetching
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                
                if (!email) {
                    // If no email public, we might fail or handle otherwise. For now, assume we get it.
                    return done(new Error("No email found from GitHub"), null);
                }

                let user = await User.findOne({ 
                    $or: [{ githubId: profile.id }, { email: email }] 
                });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName || profile.username,
                        email: email,
                        githubId: profile.id,
                        role: 'candidate'
                    });
                } else if (!user.githubId) {
                    user.githubId = profile.id;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }));
    } else {
        console.warn("GitHub Client ID/Secret not found in environment variables. GitHub OAuth will not work.");
    }
};

module.exports = configurePassport;
