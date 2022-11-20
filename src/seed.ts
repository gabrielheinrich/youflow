import { Exercise, Workout } from "./types";

export const exercises: Exercise[] = [
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
  {
    id: "01GJAGCMM1TYVG0Z53QCS92483",
    name: "Shoulder Stretch",
    srcType: "youtube",
    srcId: "L_xrDAtykMI",
    description: "",
    startSecond: 126,
    endSecond: 141,
    thumbnailUrl:
      "https://kqdtdudmyyxqvimwhuxh.supabase.co/storage/v1/object/public/test/L_xrDAtykMI_126.jpg",
  },
  {
    id: "01GJAGE5XQWQ6V8FPEKK7V8MB3",
    name: "Child's Pose Stretch",
    srcType: "youtube",
    srcId: "L_xrDAtykMI",
    description: "",
    startSecond: 173,
    endSecond: 188,
    thumbnailUrl:
      "https://kqdtdudmyyxqvimwhuxh.supabase.co/storage/v1/object/public/test/L_xrDAtykMI_173.jpg",
  },
  {
    id: "01GJAGFH44Z2WAPSKHRW8P4V2H",
    name: "Chest Stretch",
    srcType: "youtube",
    srcId: "L_xrDAtykMI",
    description: "",
    startSecond: 209,
    endSecond: 224,
    thumbnailUrl:
      "https://kqdtdudmyyxqvimwhuxh.supabase.co/storage/v1/object/public/test/L_xrDAtykMI_209.jpg",
  },
  {
    id: "01GJAGGNCT489X6M2S06N3C5T2",
    name: "Chest Side Stretch",
    srcType: "youtube",
    srcId: "L_xrDAtykMI",
    description: "",
    startSecond: 256,
    endSecond: 271,
    thumbnailUrl:
      "https://kqdtdudmyyxqvimwhuxh.supabase.co/storage/v1/object/public/test/L_xrDAtykMI_256.jpg",
  },
  {
    id: "01GJAGHVTKCXHAANCZEJPST9RA",
    name: "Cobra Pose",
    srcType: "youtube",
    srcId: "L_xrDAtykMI",
    description: "",
    startSecond: 301,
    endSecond: 316,
    thumbnailUrl:
      "https://kqdtdudmyyxqvimwhuxh.supabase.co/storage/v1/object/public/test/L_xrDAtykMI_301.jpg",
  },
  {
    id: "01GJAGKR5AMD375E4H9B28T0M3",
    name: "Hip Stretch",
    srcType: "youtube",
    srcId: "L_xrDAtykMI",
    description: "",
    startSecond: 428,
    endSecond: 443,
    thumbnailUrl:
      "https://kqdtdudmyyxqvimwhuxh.supabase.co/storage/v1/object/public/test/L_xrDAtykMI_428.jpg",
  },
  {
    id: "01GJAGNVKQT96ZBRSVECBDEW87",
    name: "Knee Mobility",
    srcType: "youtube",
    srcId: "L_xrDAtykMI",
    description: "",
    startSecond: 522,
    endSecond: 537,
    thumbnailUrl:
      "https://kqdtdudmyyxqvimwhuxh.supabase.co/storage/v1/object/public/test/L_xrDAtykMI_522.jpg",
  },
  {
    id: "K56Z12XNQ5c01",
    name: "Cat and Cow",
    srcType: "youtube",
    srcId: "K56Z12XNQ5c",
    description: "",
    startSecond: 12,
    endSecond: 24,
  },
  {
    id: "K56Z12XNQ5c02",
    name: "Leg lift",
    srcType: "youtube",
    srcId: "K56Z12XNQ5c",
    description: "",
    startSecond: 79,
    endSecond: 89,
  },
  {
    id: "K56Z12XNQ5c03",
    name: "Knee Bend in High Plank",
    srcType: "youtube",
    srcId: "K56Z12XNQ5c",
    description: "",
    startSecond: 216,
    endSecond: 225,
  },
  {
    id: "K56Z12XNQ5c04",
    name: "High Plank Body Twist",
    srcType: "youtube",
    srcId: "K56Z12XNQ5c",
    description: "",
    startSecond: 270,
    endSecond: 281,
  },
];

export const workouts: Workout[] = [
  {
    id: "01GJAH8VXYJAG338MBDXCQZGC8",
    name: "Beginner Stretch Routine",
    createdUtc: 1668948455359,
    timeline: [
      {
        id: "01GJAH8VY10QSYWH66SSC2619J",
        exerciseId: "01GJAFZV6P7EQTPP6848NKJP5Z",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
      {
        id: "01GJAH8VY31SP8GXTSTQM9CPXW",
        exerciseId: "01GJAGCMM1TYVG0Z53QCS92483",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
      {
        id: "01GJAH8VY3HA915TFX7RQZBJPP",
        exerciseId: "01GJAGE5XQWQ6V8FPEKK7V8MB3",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
      {
        id: "01GJAH8VY3B64MM62ZTWBPS1WM",
        exerciseId: "01GJAGFH44Z2WAPSKHRW8P4V2H",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
      {
        id: "01GJAH8VY4ZAN88X2AQCPBMG2P",
        exerciseId: "01GJAGGNCT489X6M2S06N3C5T2",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
      {
        id: "01GJAH8VY4H2ANX408RV4GQB59",
        exerciseId: "01GJAGHVTKCXHAANCZEJPST9RA",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
      {
        id: "01GJAH8VY5WYTN72VM2J1XF5V2",
        exerciseId: "01GJAGKR5AMD375E4H9B28T0M3",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
      {
        id: "01GJAH8VY5504KPJCX2G84DM3F",
        exerciseId: "01GJAGNVKQT96ZBRSVECBDEW87",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
    ],
  },
  {
    id: "01GJAHH1FJTVRWMX89P57J2EG1",
    name: "Full Body Workout",
    createdUtc: 1668948723186,
    timeline: [
      {
        id: "01GJAHH1FYYYBB4GCRGZTHA2HN",
        exerciseId: "K56Z12XNQ5c01",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
      {
        id: "01GJAHH1FYKXNRCZBBVDWFEEER",
        exerciseId: "K56Z12XNQ5c02",
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
    ],
  },
];
