# Using GitHub Token in Build

## For Personal Use (Recommended)

1. **Create `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Add your GitHub token** to `.env`:
   ```
   VITE_GITHUB_TOKEN=ghp_your_actual_token_here
   ```

3. **Build the app**:
   ```bash
   npm run build
   ```

4. **Deploy**: The built app will have your token embedded and work automatically without authentication prompts.

## For Other Users

If the environment variable is not set, users will see an "Authenticate" button and can enter their own GitHub token at runtime.

## Security Notes

- ⚠️ **Never commit `.env` to Git** (already in `.gitignore`)
- ⚠️ The token will be visible in the built JavaScript files
- ✅ This is fine for personal use on your own domain
- ✅ Token can be revoked anytime from GitHub settings

## GitHub Actions Deployment

To use the token in GitHub Actions, add it as a repository secret:

1. Go to repository Settings → Secrets and variables → Actions
2. Add new secret: `GH_TOKEN` with your token value
3. Update `.github/workflows/deploy.yml`:

```yaml
- name: Build
  env:
    VITE_GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
  run: npm run build
```
