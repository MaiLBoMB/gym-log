/*
  YOUR TRAINING PLAN
  ------------------
  This is the only file you need to edit to change your workouts.
  You can edit it straight on github.com: open the file, click the pencil icon,
  make your change, then click "Commit changes".

  Each exercise has:
    id        a short unique code. Keep it the same if you only rename an exercise,
              so your history and last weights stay linked to it.
    name      what you see in the app
    sets      how many sets (each set is one tap-able plate)
    reps      target reps, e.g. "8–10", "10 each side", or "30" for timed holds
    unit      leave out for reps; use "s" for timed holds like the plank
    rest      rest between sets, in seconds (starts the timer when you tick a set)
    weighted  true shows the weight box; false for bodyweight moves
    increment how much the + and − buttons change the weight, in kg
    note      a short form cue shown under the exercise name
*/

const PLAN = {
  targetMinutes: 45,
  warmupMinutes: 5,
  cooldownMinutes: 5,
  defaultIncrement: 2.5,
  progression: "When you hit the top of the rep range on every set, add one weight step next time.",

  days: [
    {
      id: "A",
      name: "Day A",
      focus: "Squat and push",
      warmup: "5 min easy bike or rower, then one light set of goblet squats.",
      cooldown: "3–5 min stretching: hips, quads, chest.",
      exercises: [
        { id: "goblet-squat", name: "Goblet squat", sets: 3, reps: "8–10", rest: 90, weighted: true, increment: 2,
          note: "Hold one dumbbell at your chest. Sit down between your heels, chest up." },
        { id: "db-bench", name: "Dumbbell bench press", sets: 3, reps: "8–10", rest: 90, weighted: true, increment: 2,
          note: "Lower to mid-chest under control, then press up." },
        { id: "cable-row", name: "Seated cable row", sets: 3, reps: "10–12", rest: 75, weighted: true,
          note: "Squeeze your shoulder blades together and pause for a second." },
        { id: "db-rdl", name: "Dumbbell Romanian deadlift", sets: 3, reps: "10", rest: 90, weighted: true, increment: 2,
          note: "Soft knees, push hips back until you feel your hamstrings, back flat." },
        { id: "plank", name: "Plank", sets: 3, reps: "30", unit: "s", rest: 45, weighted: false,
          note: "Squeeze glutes, ribs down. Add 5 seconds once 30 feels easy." }
      ]
    },
    {
      id: "B",
      name: "Day B",
      focus: "Pull and legs",
      warmup: "5 min easy bike or rower, then one light set of leg press.",
      cooldown: "3–5 min stretching: hamstrings, lats, shoulders.",
      exercises: [
        { id: "leg-press", name: "Leg press", sets: 3, reps: "10–12", rest: 90, weighted: true, increment: 5,
          note: "Lower until knees reach about 90 degrees. Don't slam into lockout." },
        { id: "lat-pulldown", name: "Lat pulldown", sets: 3, reps: "10–12", rest: 75, weighted: true,
          note: "Pull the bar to your upper chest, elbows down and back." },
        { id: "db-shoulder-press", name: "Seated dumbbell shoulder press", sets: 3, reps: "8–10", rest: 90, weighted: true, increment: 2,
          note: "Press up and slightly in. Keep your lower back against the bench." },
        { id: "walking-lunge", name: "Walking lunges", sets: 3, reps: "10 each leg", rest: 75, weighted: true, increment: 2,
          note: "Dumbbells at your sides. Long steps, back knee close to the floor." },
        { id: "face-pull", name: "Cable face pull", sets: 2, reps: "15", rest: 60, weighted: true,
          note: "Rope at face height. Pull towards your forehead, elbows high." }
      ]
    },
    {
      id: "C",
      name: "Day C",
      focus: "Hinge and full body",
      warmup: "5 min easy bike or rower, then two light sets of deadlifts.",
      cooldown: "3–5 min stretching: hips, hamstrings, upper back.",
      exercises: [
        { id: "trap-bar-deadlift", name: "Trap bar deadlift", sets: 3, reps: "5–6", rest: 120, weighted: true, increment: 5,
          note: "Hips back, chest up, push the floor away. Stop before your form slips." },
        { id: "incline-db-press", name: "Incline dumbbell press", sets: 3, reps: "8–10", rest: 90, weighted: true, increment: 2,
          note: "Bench at about 30 degrees. Lower to upper chest." },
        { id: "one-arm-row", name: "One-arm dumbbell row", sets: 3, reps: "10 each side", rest: 60, weighted: true, increment: 2,
          note: "Knee and hand on a bench. Pull the dumbbell towards your hip." },
        { id: "leg-curl", name: "Lying leg curl", sets: 3, reps: "10–12", rest: 60, weighted: true,
          note: "Slow on the way down, about three seconds." },
        { id: "pallof-press", name: "Pallof press", sets: 2, reps: "10 each side", rest: 45, weighted: true,
          note: "Cable at chest height, stand side-on. Press out and resist the twist." }
      ]
    }
  ]
};
