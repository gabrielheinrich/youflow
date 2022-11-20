import { Exercise, Workout } from "./types";

export const exercises: Exercise[] = [
  {
    id: "0",
    name: "Short Test",
    description: "Simple Test",
    srcType: "youtube",
    srcId: "raUEsDttCL4",
    startSecond: 54,
    endSecond: 58,
  },
  {
    id: "1",
    name: "Yoga Stuff",
    description: "Simple YOLO Yoga",
    srcType: "youtube",
    srcId: "raUEsDttCL4",
    startSecond: 254,
    endSecond: 280,
  },
  {
    id: "2",
    name: "Other Stretch",
    description: "Stretch Awesome",
    srcType: "youtube",
    srcId: "ZbtVVYBLCug",
    startSecond: 535,
    endSecond: 570,
  },
  {
    id: "3",
    name: "Cardio",
    description: "Long Cardio Workout",
    srcType: "youtube",
    srcId: "kZDvg92tTMc",
    startSecond: 466,
    endSecond: 509,
  },
  {
    id: "4",
    name: "Meditation",
    description: "Be calm like Water...",
    srcType: "youtube",
    srcId: "ockCQMt9kM0",
    startSecond: 10,
    endSecond: 200,
  },
  {
    id: "01GJAFZV6P7EQTPP6848NKJP5Z",
    name: "Side Neck Stretch",
    srcType: "youtube",
    srcId: "L_xrDAtykMI",
    description: "",
    startSecond: 61,
    endSecond: 76,
    thumbnailUrl:
      "https://kqdtdudmyyxqvimwhuxh.supabase.co/storage/v1/object/public/test/L_xrDAtykMI_61.jpg",
  },
];

export const workouts: Workout[] = [
  {
    id: "1",
    name: "Yoga",
    createdUtc: 1668946590059,
    timeline: [
      {
        id: "2b8a67a9-35db-4edd-90fd-b30ce51d3544",
        exerciseId: "0",
        exerciseReps: 4,
        cooldownTimeSecs: 30,
      },
      {
        id: "f9a5bf4a-f3fe-48ac-a59b-71772464eef5",
        exerciseId: "1",
        exerciseReps: 3,
        cooldownTimeSecs: 30,
      },
      {
        id: "047306e9-32e0-4017-9300-80b69b0eaabe",
        exerciseId: "3",
        exerciseReps: 2,
        cooldownTimeSecs: 30,
      },
    ],
  },
  {
    id: "2",
    name: "Quick Stretch",
    createdUtc: 1668946590059,
    timeline: [
      {
        id: "5128a03d-46c1-4c8d-ba41-b9d66c94ce62",
        exerciseId: "2",
        exerciseReps: 2,
        cooldownTimeSecs: 20,
      },
    ],
  },
  {
    id: "3",
    name: "Cardio",
    createdUtc: 1668946590059,
    timeline: [
      {
        id: "9ba40c18-e58f-419d-9062-7f62cf0046a2",
        exerciseId: "2",
        exerciseReps: 2,
        cooldownTimeSecs: 20,
      },
    ],
  },
];
