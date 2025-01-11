# Google OAuth Credentials Setup Guide

## For SongBankTS Project

### 1. Access Google Cloud Console

- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create or Select a Project

- Click on the project dropdown at the top
- Select "New Project" or use existing
- Name it "SongBankTS" (or your preferred name)
- Click "Create"

### 3. Enable OAuth API

- Go to "APIs & Services" → "Library"
- Search for "Google OAuth2"
- Enable the API if not already enabled

### 4. Configure OAuth Consent Screen

- Go to "APIs & Services" → "OAuth consent screen"
- Choose "External" user type
- Fill in required information:
  - App name: "SongBankTS"
  - User support email: your-email@domain.com
  - Developer contact email: your-email@domain.com
- Save and continue

### 5. Create OAuth Credentials

- Go to "APIs & Services" → "Credentials"
- Click "+ CREATE CREDENTIALS"
- Select "OAuth client ID"
- Choose "Web application"
- Set the following:
  - Name: "SongBankTS Web Client"
  - Authorized JavaScript origins:
    ```
    http://localhost:5173
    http://localhost:3000
    ```
  - Authorized redirect URIs:
    ```
    http://localhost:5173/callback
    http://localhost:3000/callback
    ```

### 6. Save Your Credentials

- Download the JSON file
- Copy credentials to your .env file:
  ```
  VITE_GOOGLE_OAUTH_CLIENT_ID=your_client_id
  VITE_GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
  ```

### 7. Security Best Practices

- Never commit .env file to Git
- Keep credentials secure
- Regularly rotate secrets
- Use environment variables

### 8. Testing

- Run your application
- Test OAuth flow
- Verify credentials work

### Support

For issues, visit:

- Google Cloud Console Help: https://support.google.com/cloud
- OAuth 2.0 Documentation: https://developers.google.com/identity/protocols/oauth2
