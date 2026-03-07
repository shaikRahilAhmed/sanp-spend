# 🍃 MongoDB Atlas Setup Guide (Updated 2026)

## Current MongoDB Atlas Interface

MongoDB Atlas has updated their interface. Here's the exact flow:

---

## Step-by-Step with Current UI

### 1. Sign Up
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Click "Sign up with Google" (fastest)
3. Or use email/password

### 2. Create Database - NEW INTERFACE

After signing up, you'll see:

**Option 1: If you see "Build a Database" button**
- Click "Build a Database"

**Option 2: If you see "+ Create" button**
- Click "+ Create"
- Select "Database"

### 3. Choose Deployment Type - IMPORTANT!

You'll see **THREE** options:

```
┌─────────────────────────────────────────────────────────┐
│  Serverless                                             │
│  Pay only for what you use                              │
│  [Learn More]                                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Dedicated                                              │
│  For production workloads                               │
│  Starting at $57/month                                  │
│  [Learn More]                                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Shared                                                 │
│  Perfect for learning and exploring                     │
│  FREE                                                   │
│  [CREATE] ← CLICK THIS!                                │
└─────────────────────────────────────────────────────────┘
```

**CHOOSE: Shared (FREE)**
- Look for the one that says "FREE"
- It might also say "M0 Sandbox"
- Click the "CREATE" button under it

### 4. Configure Your Cluster

After clicking "CREATE" on Shared:

**Cloud Provider & Region:**
- Provider: AWS (recommended)
- Region: Choose closest to you:
  - India: `ap-south-1` (Mumbai)
  - Singapore: `ap-southeast-1`
  - US: `us-east-1` (N. Virginia)

**Cluster Tier:**
- Should show "M0 Sandbox" (FREE)
- 512 MB Storage
- Shared RAM

**Cluster Name:**
- Default: `Cluster0`
- You can change to: `snapspend-cluster`
- Or leave as default (doesn't matter)

**Additional Settings:**
- Leave everything else as default
- Don't change MongoDB version
- Don't add backup (not available in free tier)

**Click: "Create Deployment" or "Create Cluster"**

### 5. Security Quickstart (Automatic)

After clicking create, you'll see a security quickstart popup:

#### 5.1 Create Database User

```
┌─────────────────────────────────────────────────────────┐
│  How would you like to authenticate your connection?    │
│                                                          │
│  ○ Username and Password (selected)                     │
│  ○ Certificate                                          │
│                                                          │
│  Username: [snapspend-admin]                            │
│  Password: [●●●●●●●●●●●●] [Autogenerate Secure Password]│
│                                                          │
│  [Create User]                                          │
└─────────────────────────────────────────────────────────┘
```

1. Username: Type `snapspend-admin`
2. Click "Autogenerate Secure Password"
3. **COPY THE PASSWORD!** (You'll need it)
4. Click "Create User"

#### 5.2 Network Access

```
┌─────────────────────────────────────────────────────────┐
│  Where would you like to connect from?                  │
│                                                          │
│  ○ My Local Environment                                 │
│  ○ Cloud Environment                                    │
│                                                          │
│  IP Address: [_______________] [Add My Current IP]      │
│                                                          │
│  Or add: 0.0.0.0/0 (Allow from anywhere)               │
│                                                          │
│  [Add Entry]                                            │
└─────────────────────────────────────────────────────────┘
```

1. Choose "My Local Environment"
2. Click "Add My Current IP Address" (adds your current IP)
3. Then manually add: `0.0.0.0/0` (allows from anywhere - needed for Render)
4. Click "Add Entry"
5. Click "Finish and Close"

### 6. Get Connection String

After setup completes:

1. You'll see your cluster dashboard
2. Click "Connect" button (on your cluster)
3. Choose "Connect your application"
4. Driver: Node.js
5. Version: 5.5 or later
6. Copy the connection string:

```
mongodb+srv://snapspend-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 7. Modify Connection String

**Original:**
```
mongodb+srv://snapspend-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Step 1: Replace `<password>`**
```
mongodb+srv://snapspend-admin:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Step 2: Add database name `/snapspend` before the `?`**
```
mongodb+srv://snapspend-admin:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/snapspend?retryWrites=true&w=majority
```

**This is your final connection string!** Save it securely.

---

## Alternative: If You Don't See Security Quickstart

If the security quickstart doesn't appear automatically:

### Create User Manually
1. Click "Database Access" in left sidebar
2. Click "+ ADD NEW DATABASE USER"
3. Authentication Method: Password
4. Username: `snapspend-admin`
5. Password: Click "Autogenerate Secure Password" and copy it
6. Database User Privileges: "Atlas admin" or "Read and write to any database"
7. Click "Add User"

### Add IP Whitelist Manually
1. Click "Network Access" in left sidebar
2. Click "+ ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE"
4. This adds: `0.0.0.0/0`
5. Click "Confirm"

---

## Troubleshooting

### "I don't see the FREE option"
- Look for "Shared" deployment type
- It might say "M0 Sandbox"
- Should show "FREE" or "$0.00/month"
- Don't choose "Serverless" or "Dedicated"

### "It's asking for payment info"
- You selected wrong tier
- Go back and choose "Shared" (M0)
- Free tier never asks for payment

### "Cluster creation failed"
- Try different region
- Check your internet connection
- Try again in a few minutes

### "Can't connect to cluster"
- Verify password is correct (no spaces)
- Check IP whitelist includes `0.0.0.0/0`
- Make sure you added `/snapspend` to connection string

### "Connection string doesn't work"
- Format should be: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?options`
- Replace `<password>` with actual password
- Add `/snapspend` before the `?`
- No spaces in the string

---

## Visual Reference

### What You Should See:

**After Signup:**
```
[Build a Database] or [+ Create]
```

**Deployment Options:**
```
Serverless    Dedicated    Shared ← Choose this
                           FREE
                          [CREATE]
```

**Configuration:**
```
Provider: [AWS ▼]
Region: [ap-south-1 (Mumbai) ▼]
Cluster Tier: M0 Sandbox (FREE)
Cluster Name: [Cluster0]
[Create Deployment]
```

**Security Quickstart:**
```
1. Create Database User
   Username: snapspend-admin
   Password: [Autogenerate]
   
2. Network Access
   IP: 0.0.0.0/0
   
[Finish and Close]
```

**Connection:**
```
[Connect] → [Connect your application]
→ Copy connection string
→ Replace <password>
→ Add /snapspend
```

---

## Quick Checklist

- [ ] Signed up for MongoDB Atlas
- [ ] Clicked "Build a Database"
- [ ] Selected "Shared" (FREE) option
- [ ] Clicked "CREATE"
- [ ] Selected AWS provider
- [ ] Selected closest region
- [ ] Clicked "Create Deployment"
- [ ] Created user: `snapspend-admin`
- [ ] Copied password
- [ ] Added IP: `0.0.0.0/0`
- [ ] Got connection string
- [ ] Replaced `<password>`
- [ ] Added `/snapspend`
- [ ] Saved final connection string

---

## Final Connection String Format

```
mongodb+srv://snapspend-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/snapspend?retryWrites=true&w=majority
```

**Parts Explained:**
- `mongodb+srv://` - Protocol
- `snapspend-admin` - Your username
- `YOUR_PASSWORD` - Your actual password (no `<>`)
- `@cluster0.xxxxx.mongodb.net` - Your cluster address
- `/snapspend` - Database name (IMPORTANT!)
- `?retryWrites=true&w=majority` - Connection options

---

## Need More Help?

1. MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
2. Getting Started: https://docs.atlas.mongodb.com/getting-started/
3. Connection Strings: https://docs.mongodb.com/manual/reference/connection-string/

---

**You're ready to continue with the deployment!** 🎉

Use this connection string in your Render backend environment variables.
