# Gym Log

A simple three-day gym plan and session tracker that runs in Safari on iPhone. Each session is designed to take about 45 minutes, including a 5-minute warm-up and a short stretch.

## The plan

Train three days a week with at least one rest day between sessions (for example Monday, Wednesday, Friday). Rotate Day 1, 2, 3. The app suggests the next day for you.

| Day | Focus | Exercises |
|---|---|---|
| 1 | Chest, shoulders and abs | Chest press 3×8–12, Incline chest press 3×10–12, Shoulder press 3×10–12, Lateral raise 2×12–15, Ab crunch 3×12–15, Plank 3×30s |
| 2 | Back, rear shoulders and abs | Lat pulldown 3×10–12, Seated row 3×10–12, Chest-supported row 2×10–12, Reverse pec deck 3×12–15, Ab crunch 3×12–15, Captain's chair knee raises 3×10–15 |
| 3 | Chest, back, shoulders and abs | Chest press 3×10–12, Lat pulldown 3×10–12, Seated row 3×10–12, Shoulder press 2×10–12, Reverse pec deck 2×12–15, Ab crunch 3×12–15, Incline treadmill walk 10 min |

**How to progress:** pick a weight you can lift for the bottom of the rep range with one or two reps left in the tank. When you hit the top of the range on every set, add one weight step next time.

**Photos:** each exercise can show a photo. Upload your own into the `images` folder using the file names listed in `images/README.md`. Each exercise also has a "How to do it" link to video demos.

## Using the app

1. Open the app and pick the day (the suggested one is marked "Up next"), then tap **Start**.
2. Enter the weight for each exercise. It remembers what you used last time.
3. Tap a plate each time you finish a set. The rest timer starts at the bottom of the screen.
4. If you did fewer or more reps than the target, tap the filled plate and type the real number.
5. Tap **Finish and save** at the end. The session appears under **History**.

The timer beeps when rest is over, but not if your iPhone's silent switch is on.

## Putting it on GitHub (no coding needed)

1. Sign in at github.com and click **New repository**. Name it `gym-log`, set it to **Public**, and click **Create repository**.
2. On the new repo page, click **uploading an existing file**. Drag in everything from this folder, including the `icons` folder, then click **Commit changes**.
3. Go to **Settings → Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, pick **main** and **/(root)**, and click **Save**.
4. After a minute or two, your app is live at `https://YOUR-USERNAME.github.io/gym-log/`.

Public is required for GitHub Pages on a free account. Only the app code is public: your workout log is never uploaded and stays on your phone.

## Adding it to your iPhone

1. Open the link above in **Safari** (not Chrome).
2. Tap the **Share** button, then **Add to Home Screen**, then **Add**.
3. Always open it from the Home Screen icon. It then runs full screen, works with weak gym signal, and iOS is far less likely to clear its data.

## Changing the plan

Open `plan.js` on GitHub, click the pencil icon, edit names, sets, reps or rest times, then click **Commit changes**. The phone picks up the change next time you open the app with signal (you may need to close and reopen it). Comments at the top of the file explain each field.

Keep each exercise `id` the same if you only rename it, so your history stays linked.

## Your data

- Everything is stored in the browser's storage on your phone. Nothing is sent anywhere.
- Use **History → Export backup** every few weeks and save the file to iCloud Drive or Files.
- To move to a new phone, install the app there and use **Import backup**.

## Files

| File | What it does |
|---|---|
| `index.html` | The page itself |
| `plan.js` | Your training plan (edit this one) |
| `app.js` | How the tracker works |
| `style.css` | Look and feel, light and dark mode |
| `sw.js`, `manifest.webmanifest`, `icons/` | Let it install to the Home Screen and work offline |
