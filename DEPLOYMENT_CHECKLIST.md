# Deployment Checklist 🚀

Since your app is split into a **Frontend** and a **Backend**, correct configuration is critical for them to talk to each other in production.

## 1. Backend Configuration (e.g., Render Web Service)
When deploying your `backend` folder, you MUST set these Environment Variables in your dashboard:

| Variable | Value Example | Description |
|----------|---------------|-------------|
| `MONGO_URI` | `mongodb+srv://...` | Your production database connection string |
| `JWT_SECRET` | `somelongrandomstring` | Secret key for logging in users |
| `GOOGLE_CLIENT_ID` | `...` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `...` | From Google Cloud Console |
| `GITHUB_CLIENT_ID` | `...` | From GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | `...` | From GitHub Developer Settings |
| `FRONTEND_URL` | `https://my-app-frontend.onrender.com` | **CRITICAL**: Use the URL of your deployed Frontend (no trailing slash). This tells the backend where to redirect users after Google Login. |

## 2. Frontend Configuration (e.g., Render Static Site / Vercel)
When deploying your `frontend` folder, you MUST set this Environment Variable:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://my-app-backend.onrender.com/api` | **CRITICAL**: Use the URL of your deployed Backend, ending with `/api`. This tells the frontend where to send data. |

## 3. Google/GitHub Console Updates
Your OAuth providers need to know your new "Real" domain matches.

**Google Cloud Console:**
1. Go to **APIs & Services > Credentials**.
2. Edit your OAuth 2.0 Client.
3. Add to **Authorized redirect URIs**:
   - `https://my-app-backend.onrender.com/api/auth/google/callback`
   - *(Note: Replace `my-app-backend.onrender.com` with your actual Backend URL)*

**GitHub Developer Settings:**
1. Edit your OAuth App.
2. Update **Authorization callback URL** to:
   - `https://my-app-backend.onrender.com/api/auth/github/callback`

---

### ✅ Summary
- If you set `VITE_API_URL` on the frontend, the app stops looking for `localhost`.
- If you set `FRONTEND_URL` on the backend, Google Login redirects to the right place.
- If you update **Google Console**, Google allows the login.

Follow this list, and it will work perfectly!
