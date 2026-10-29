/*
  YOUR TRAINING PLAN
  ------------------
  This is the only file you need to edit to change your workouts.
  Edit it on github.com: open the file, click the pencil icon, make your change,
  then click "Commit changes".

  Each exercise has:
    id        a short unique code. The same machine uses the same id on every day,
              so its last weight carries across days. Keep it if you only rename.
    name      what you see in the app
    sets      how many sets (each set is one tap-able plate)
    reps      target reps, e.g. "8–12", or the time for timed exercises
    unit      leave out for reps; "s" for seconds (plank), "min" for minutes (treadmill)
    rest      rest between sets, in seconds (starts the timer when you tick a set)
    weighted  true shows the weight box; false for bodyweight or cardio
    increment how much the + and − buttons change the weight, in kg
    note      a short form cue shown under the exercise name
    image     a photo shown on the exercise card. Upload your own photo to the
              images folder with this exact file name. If the file isn't there,
              the card simply shows no photo.
    video     optional link for the "How to" button. Without it, the button
              searches YouTube for the exercise name.
*/

const PLAN = {
  targetMinutes: 45,
  warmupMinutes: 5,
  cooldownMinutes: 0,
  defaultIncrement: 5,
  progression: "When you hit the top of the rep range on every set, add one weight step next time.",

  days: [
    {
      id: "1",
      name: "Day 1",
      focus: "Chest, shoulders and abs",
      warmup: "5 min easy cross-trainer or bike, then one light set on the chest press.",
      cooldown: "",
      exercises: [
        { id: "chest-press", name: "Chest press machine", sets: 3, reps: "8–12", rest: 75, weighted: true,
          image: "images/chest-press.jpg", note: "Keep your back against the pad and push smoothly." },
        { id: "incline-chest-press", name: "Incline chest press machine", sets: 3, reps: "10–12", rest: 75, weighted: true,
          image: "images/incline-chest-press.jpg", note: "Targets the upper chest." },
        { id: "shoulder-press", name: "Shoulder press machine", sets: 3, reps: "10–12", rest: 75, weighted: true,
          image: "images/shoulder-press.jpg", note: "Keep your core tight and avoid arching your lower back." },
        { id: "lateral-raise", name: "Lateral raise machine", sets: 2, reps: "12–15", rest: 60, weighted: true, increment: 2.5,
          image: "images/lateral-raise.jpg", note: "Builds the side shoulders for a wider look." },
        { id: "ab-crunch", name: "Ab crunch machine", sets: 3, reps: "12–15", rest: 45, weighted: true,
          image: "images/ab-crunch.jpg", note: "Focus on contracting your abs." },
        { id: "plank", name: "Plank", sets: 3, reps: "30", unit: "s", rest: 45, weighted: false,
          image: "images/plank.jpg", note: "Keep your body in a straight line, on the floor or a mat." }
      ]
    },
    {
      id: "2",
      name: "Day 2",
      focus: "Back, rear shoulders and abs",
      warmup: "5 min easy rower or bike, then one light set on the lat pulldown.",
      cooldown: "",
      exercises: [
        { id: "lat-pulldown", name: "Lat pulldown machine", sets: 3, reps: "10–12", rest: 75, weighted: true,
          image: "images/lat-pulldown.jpg", note: "Pull towards your upper chest. Avoid swinging." },
        { id: "seated-row", name: "Seated row machine", sets: 3, reps: "10–12", rest: 75, weighted: true,
          image: "images/seated-row.jpg", note: "Keep your back straight and squeeze your shoulder blades." },
        { id: "chest-supported-row", name: "Chest-supported row machine", sets: 2, reps: "10–12", rest: 75, weighted: true,
          image: "images/chest-supported-row.jpg", note: "Supports your chest and reduces lower back strain." },
        { id: "reverse-pec-deck", name: "Reverse pec deck (rear delts)", sets: 3, reps: "12–15", rest: 60, weighted: true, increment: 2.5,
          image: "images/reverse-pec-deck.jpg", note: "Focus on controlled movement." },
        { id: "ab-crunch", name: "Ab crunch machine", sets: 3, reps: "12–15", rest: 45, weighted: true,
          image: "images/ab-crunch.jpg", note: "Focus on contracting your abs." },
        { id: "captains-chair", name: "Captain's chair knee raises", sets: 3, reps: "10–15", rest: 45, weighted: false,
          image: "images/captains-chair.jpg", note: "Raise your knees using your abs. Avoid swinging." }
      ]
    },
    {
      id: "3",
      name: "Day 3",
      focus: "Chest, back, shoulders and abs",
      warmup: "5 min easy cross-trainer or bike, then one light set on the chest press.",
      cooldown: "",
      exercises: [
        { id: "chest-press", name: "Chest press machine", sets: 3, reps: "10–12", rest: 75, weighted: true,
          image: "images/chest-press.jpg", note: "Keep your back against the pad and push smoothly." },
        { id: "lat-pulldown", name: "Lat pulldown machine", sets: 3, reps: "10–12", rest: 75, weighted: true,
          image: "images/lat-pulldown.jpg", note: "Pull towards your upper chest." },
        { id: "seated-row", name: "Seated row machine", sets: 3, reps: "10–12", rest: 75, weighted: true,
          image: "images/seated-row.jpg", note: "Keep your back straight and squeeze your shoulder blades." },
        { id: "shoulder-press", name: "Shoulder press machine", sets: 2, reps: "10–12", rest: 75, weighted: true,
          image: "images/shoulder-press.jpg", note: "Keep your core tight and avoid arching your lower back." },
        { id: "reverse-pec-deck", name: "Reverse pec deck (rear delts)", sets: 2, reps: "12–15", rest: 60, weighted: true, increment: 2.5,
          image: "images/reverse-pec-deck.jpg", note: "Builds rear shoulders and upper back strength." },
        { id: "ab-crunch", name: "Ab crunch machine", sets: 3, reps: "12–15", rest: 45, weighted: true,
          image: "images/ab-crunch.jpg", note: "Focus on contracting your abs." },
        { id: "incline-walk", name: "Incline treadmill walk", sets: 1, reps: "10", unit: "min", rest: 0, weighted: false,
          image: "images/incline-walk.jpg", note: "Set an incline of 5–10% and walk at a steady pace. Tick it when you finish." }
      ]
    }
  ]
};
