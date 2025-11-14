# 🔗 Configure Vercel MCP in Cursor

## What is MCP?

MCP (Model Context Protocol) allows me to directly access your Vercel project to:
- Check environment variables
- View deployment logs
- See function errors
- Monitor deployment status

---

## 📋 Setup Steps

### Step 1: Get Vercel Access Token

1. **Go to**: https://vercel.com/account/tokens
2. **Sign in** to your Vercel account
3. **Click**: "Create Token"
4. **Name**: `Cursor MCP` (or any name)
5. **Scope**: Select "Full Account" or "Read" (read-only is safer)
6. **Expiration**: Choose "No expiration" or set a date
7. **Click**: "Create Token"
8. **Copy the token** immediately (you won't see it again!)

### Step 2: Get Your Vercel Team/Project ID

From your URL: `https://vercel.com/keshavs-projects-fd093435`

- **Team ID**: `keshavs-projects-fd093435` (this is your team/project identifier)
- Or go to your project → Settings → General → Copy "Project ID"

### Step 3: Configure MCP in Cursor

1. **Open Cursor Settings**:
   - Press `Ctrl+,` (Windows) or `Cmd+,` (Mac)
   - Or go to File → Preferences → Settings

2. **Find MCP Settings**:
   - Search for "MCP" in settings
   - Or go to Extensions → MCP

3. **Add Vercel MCP Server**:
   - Click "Add MCP Server" or "+"
   - Add this configuration:

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-vercel"
      ],
      "env": {
        "VERCEL_ACCESS_TOKEN": "your-vercel-token-here",
        "VERCEL_TEAM_ID": "keshavs-projects-fd093435"
      }
    }
  }
}
```

4. **Replace**:
   - `your-vercel-token-here` with the token from Step 1
   - `keshavs-projects-fd093435` with your actual team/project ID if different

5. **Save** the configuration

6. **Restart Cursor** for changes to take effect

---

## 🔍 Alternative: Cursor Settings File

If the UI doesn't work, edit the settings file directly:

1. **Open**: `%APPDATA%\Cursor\User\globalStorage\mcp.json` (Windows)
   Or: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json` (Mac)

2. **Add the configuration** above

3. **Restart Cursor**

---

## ✅ Verify It Works

After setup, I should be able to:
- List your Vercel projects
- Check environment variables
- View deployment logs
- See function errors

**Try saying**: "Check my Vercel environment variables" and I'll test the connection!

---

## 🆘 Troubleshooting

### MCP Server Not Found
- Make sure you have Node.js installed
- Try: `npx -y @modelcontextprotocol/server-vercel` in terminal to test

### Token Invalid
- Generate a new token in Vercel
- Make sure it has the right permissions

### Can't Find Settings
- Update Cursor to the latest version
- MCP might be in "Features" or "Experimental" section

---

## 📝 Quick Reference

**Your Vercel Info:**
- **URL**: https://vercel.com/keshavs-projects-fd093435
- **Team/Project**: `keshavs-projects-fd093435`

**What You Need:**
1. Vercel Access Token (from https://vercel.com/account/tokens)
2. Team/Project ID: `keshavs-projects-fd093435`

**Once configured, I can check everything for you!** 🚀



