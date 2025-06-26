# Tweet Vanisher

**Bulk-delete your tweets and replies using a simple browser script. No tools, no installs, just clean up with copy & paste.**

---

## 🧹 Overview

Tweet Vanisher is a JavaScript snippet (`index.js`) designed to help you quickly and safely delete **your tweets and replies** from your Twitter profile.

Whether you're:
- newly famous and want to scrub old opinions,
- preparing for a job interview,
- or just starting fresh—

**Tweet Vanisher makes it easy to wipe your timeline clean.**

> "_It is easier to live with a bad conscience than with a bad reputation._"  
> — Friedrich Nietzsche

---

## ✅ Features

- ✔️ Deletes your **own tweets**
- ✔️ Deletes **replies** you’ve posted
- ✔️ Skips tweets you don’t own
- ✔️ Prompts for your Twitter `@handle`
- ✔️ Saves progress across reloads using `localStorage`
- ✔️ Blocks accidental user interaction while running
- ❌ Does **not** delete retweets (yet)
- ❌ Does **not** remove likes

---

## 📂 File Structure

- [`index.js`](./index.js): The script you copy and paste into your browser’s DevTools Console.
- [`README.md`](./README.md): You're reading it.

---

## 🚀 How to Use

### Prerequisites
- Be logged in to Twitter.
- Know your handle (e.g., `@jack`).

### Instructions

1. **Navigate to your Twitter “Posts” tab:**

https://x.com/YOUR_USERNAME

2. **Open DevTools Console:**
- Chrome: `Right-click` → **Inspect** → **Console**
- Firefox: `Right-click` → **Inspect** → **Console**
- Safari: `Right-click` → **Inspect Element** → **Console**
- Edge: `Right-click` → **Inspect** → **Console**

3. **Open `index.js`**, copy the entire code, and **paste it into the Console**.

4. **Hit Enter** and follow the prompt to enter your `@username`.

5. The script will begin automatically deleting tweets and replies.

---

## 🧠 Tips

- **Stuck or malfunctioning?**  
Just reload the page manually and run the script again. It will resume where it left off (already-processed tweets are skipped).

- **Want to stop it?**  
Press the `Escape` key at any time to cancel the operation and restore browser control.

- **Multiple runs?**  
Since deleted tweets are tracked in `localStorage`, re-running the script won’t repeat deletions.

---

## ⚠️ Disclaimer

This script **permanently deletes** your content from Twitter. Deleted tweets **cannot be recovered**.

Use responsibly. Consider downloading your Twitter archive first.

---

## 👩‍💻 Who Should Use This?

- Public figures clearing old posts
- Professionals cleaning their online footprint
- Anyone seeking a fresh start

---

## 📜 License

MIT — Free to use, modify, and distribute. No warranties.
