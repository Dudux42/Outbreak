import {
  alynnePlayerAnimationClips,
  femalePlayerAnimationClips,
  luisPlayerAnimationClips,
  malePlayerAnimationClips,
} from "./animationDatabase.js";

function createCharacterProfiles({ avaBelmontPortraitUrl, peterAshfieldPortraitUrl, alynnePortraitUrl, luisPortraitUrl }) {
  return {
    female: {
      id: "female",
      name: "Ava Belmont",
      description: "Female survivor",
      portrait: avaBelmontPortraitUrl,
      animations: femalePlayerAnimationClips,
    },
    male: {
      id: "male",
      name: "Peter Ashfield",
      description: "Male survivor",
      portrait: peterAshfieldPortraitUrl,
      animations: malePlayerAnimationClips,
    },
    alynne: {
      id: "alynne",
      name: "Alynne",
      description: "Stealth survivor",
      portrait: alynnePortraitUrl,
      animations: alynnePlayerAnimationClips,
    },
    luis: {
      id: "luis",
      name: "Luis",
      description: "Determined survivor",
      portrait: luisPortraitUrl,
      animations: luisPlayerAnimationClips,
    },
  };
}

const characterDatabase = [
  {
    id: "ava_belmont",
    name: "Ava Belmont",
    status: "active",
    playable: true,
    runtimeProfileId: "female",
    portrait: "./assets/portraits/ava_belmont.png",
  },
  {
    id: "peter_ashfield",
    name: "Peter Ashfield",
    status: "active",
    playable: true,
    runtimeProfileId: "male",
    portrait: "./assets/portraits/peter_shared_background.png",
  },
  {
    id: "alynne",
    name: "Alynne",
    status: "active",
    playable: true,
    runtimeProfileId: "alynne",
    portrait: "./assets/portraits/alynne_restyled.png",
  },
  {
    id: "luis",
    name: "Luis",
    status: "active",
    playable: true,
    runtimeProfileId: "luis",
    portrait: "./assets/portraits/luis_restyled.png",
  },
  {
    id: "future_survivor_02",
    name: "Future Survivor 02",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_02.png",
  },
  {
    id: "future_survivor_03",
    name: "Future Survivor 03",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_03.png",
  },
  {
    id: "future_survivor_04",
    name: "Future Survivor 04",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_04.png",
  },
  {
    id: "future_survivor_05",
    name: "Future Survivor 05",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_05.png",
  },
  {
    id: "future_survivor_06",
    name: "Future Survivor 06",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_06.png",
  },
  {
    id: "future_survivor_07",
    name: "Future Survivor 07",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_07.png",
  },
  {
    id: "future_survivor_08",
    name: "Future Survivor 08",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_08.png",
  },
  {
    id: "future_survivor_09",
    name: "Future Survivor 09",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_09.png",
  },
  {
    id: "future_survivor_10",
    name: "Future Survivor 10",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_10.png",
  },
];

export { characterDatabase, createCharacterProfiles };
