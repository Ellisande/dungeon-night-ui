import _ from "lodash";
import { Group } from "./../types/Group.d";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  collection,
  getFirestore,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  runTransaction,
  deleteDoc,
} from "firebase/firestore";
import { Auth, getAuth as getFirebaseAuth } from "firebase/auth";
// import * as admin from "firebase-admin";
import { config } from "../../firebaseConfig";
import { Toon } from "../types/Toon";
import { Server } from "../types/Server";
import cert from "../../firebaseCert.json";

if (!getApps().length) {
  initializeApp(config);
}

function initialize() {
  if (!getApps().length) {
    initializeApp(config);
  }
}

const MAX_GROUP_SIZE = 5;

// - find tank / healer
// - fill with dps (prefer no tank or healer)
const createGroupsForDifficulty = (
  lfgToons: Toon[],
  difficulty: Number,
  validSize = 5
): Group[] => {
  const difficultySeekers = lfgToons.filter(
    (toon) => difficulty >= toon.minimumLevel && difficulty <= toon.maximumLevel
  );
  if (difficultySeekers.length == 0) {
    return [];
  }
  let remaining = [...difficultySeekers];
  const tank = remaining.find((toon) => toon.roles.includes("tank"));
  if (tank) {
    remaining = remaining.filter((toon) => toon !== tank);
  }
  const healer = remaining.find((toon) => toon.roles.includes("healer"));
  if (healer) {
    remaining = remaining.filter((toon) => toon !== healer);
  }
  const dps = remaining
    .filter((toon) => toon.roles.includes("dps"))
    .slice(0, 3);
  remaining = remaining.filter((toon) => !dps.includes(toon));
  const potentialGroupToons = [tank, healer, ...dps].filter((i) => i) as Toon[];
  const isValidGroup = potentialGroupToons.length >= validSize;
  if (!isValidGroup) {
    return [];
  }
  const group = {
    toonNames: potentialGroupToons.map((toon) => toon.name),
    locked: false,
    full: potentialGroupToons.length == MAX_GROUP_SIZE,
    difficulty: difficulty,
  };
  return [
    group,
    ...createGroupsForDifficulty(remaining, difficulty, validSize),
  ] as Group[]; // array of full groups
};

async function claimToon(serverId: string, userId: string, toonName: string) {
  const updateToon = (oldState: Toon) => {
    if (oldState?.userId) {
      return;
    }
    return {
      ...oldState,
      userId,
    };
  };
  return await update(`/guilds/${serverId}/toons/${toonName}`)(updateToon);
}

async function getUnclaimedToons(serverId: string) {
  const toonsRef = await getDocs(
    collection(getDb(), `/guilds/${serverId}/toons`)
  );
  const toons: Toon[] = [];
  await toonsRef.forEach((doc: any) => {
    if (doc?.data()?.userId) {
      return;
    }
    toons.push({
      ...doc.data(),
    } as Toon);
  });
  return toons;
}

async function addToLfg(serverId: string, toonName: string) {
  const listUpdate = (oldState: any = { toonNames: [] }) => {
    if (oldState.toonNames.includes(toonName)) {
      return oldState;
    }
    return {
      toonNames: [...oldState.toonNames, toonName],
    };
  };
  return await update(`/guilds/${serverId}/lfg/toonNames`)(listUpdate);
}

async function removeFromLfg(serverId: string, toonName: string) {
  const listUpdate = (oldState: any = { toonNames: [] }) => {
    if (!oldState.toonNames.includes(toonName)) {
      return oldState;
    }
    return {
      toonNames: oldState.toonNames.filter((name: string) => name != toonName),
    };
  };
  return await update(`/guilds/${serverId}/lfg/toonNames`)(listUpdate);
}

async function updateToon(
  serverId: string,
  toonName: string,
  userId: string,
  toon: Partial<Toon>
) {
  const toonUpdate = (oldState: any) => {
    if (oldState.userId != userId) {
      throw {
        type: "Unauthorized",
        message: "You cannot update a character you do not own",
      };
    }
    return {
      ...oldState,
      ...toon,
    };
  };
  return await update(`/guilds/${serverId}/toons/${toonName}`)(toonUpdate);
}

const update =
  (docPath: string) =>
  async (updateFunction: any): Promise<any> => {
    const db = getDb();
    await runTransaction(db, async (t) => {
      const docRef = doc(db, docPath);
      return t.get(docRef).then((oldState: any) => {
        const newState = updateFunction(oldState.data());
        if (oldState === newState) {
          return;
        }
        return t.set(docRef, newState);
      });
    });
  };

async function createToon(serverId: string, userId: string, toonName: string) {
  const toonUpdate = (oldState: any): Partial<Toon> => {
    if (oldState) {
      return oldState;
    }
    return {
      name: toonName,
      iLevel: 0,
      roles: [],
      difficulties: [],
      userId: userId,
    };
  };
  return await update(`/guilds/${serverId}/toons/${toonName}`)(toonUpdate);
}

async function clearAllGroupsAndLfg(serverId: string) {
  const groups = await getGroups(serverId);
  const clearGroupPromises = groups.map((group) =>
    removeGroup(serverId, group.id)
  );
  const clearLfgPromise = clearLfg(serverId);
  return await Promise.all([...clearGroupPromises, clearLfgPromise]);
}

async function getToonsForUser(serverId: string, ownerId: string) {
  const toonsQuery = query(
    collection(getDb(), `/guilds/${serverId}/toons`),
    where("userId", "==", ownerId)
  );
  const toonsRef = await getDocs(toonsQuery);
  const toons: Toon[] = [];
  await toonsRef.forEach((doc: any) => {
    toons.push({
      ...doc.data(),
    } as Toon);
  });
  return toons;
}

async function getGroups(serverId: string) {
  const groupsRef = await getDocs(
    collection(getDb(), `/guilds/${serverId}/groups`)
  );
  const groups: Group[] = [];
  await groupsRef.forEach((doc: any) => {
    const data = doc.data() || {};
    groups.push({
      id: doc.id,
      ...data,
    } as Group);
  });
  return groups;
}

async function removeGroup(serverId: string, groupId: string) {
  return await deleteDoc(doc(getDb(), `/guilds/${serverId}/groups/${groupId}`));
}

async function clearLfg(serverId: string) {
  const listUpdate = (oldState: any = { toonNames: [] }) => {
    return {
      toonNames: [],
    };
  };
  return await update(`/guilds/${serverId}/lfg/toonNames`)(listUpdate);
}

async function getToon(serverId: string, toonName: string) {
  const toonSnapshot = await getDoc(
    doc(getDb(), `/guilds/${serverId}/toons/${toonName}`)
  );
  return toonSnapshot.exists() ? toonSnapshot.data() || {} : {};
}

async function getLfgToonNames(serverId: string) {
  const toonNameSnapshot = await getDoc(
    doc(getDb(), `/guilds/${serverId}/lfg/toonNames`)
  );
  return toonNameSnapshot.exists() ? toonNameSnapshot?.data()?.toonNames : [];
}

async function getServers() {
  const serversRef = collection(getDb(), "/guilds");
  const serverSnapshot = await getDocs(serversRef);
  const servers: Server[] = [];
  await serverSnapshot.forEach((doc: any) => {
    const data = doc.data() || {};
    servers.push({
      id: doc.id,
      ...data,
    } as Server);
  });
  return servers;
}

function getDb() {
  initialize();
  return getFirestore(getApp());
}

// let lazyAdmin: typeof admin;
// function getAdmin() {
//   if (admin.apps.length) {
//     lazyAdmin = admin;
//   }
//   if (!lazyAdmin) {
//     const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
//     if (!serviceAccountKey && !cert) {
//       throw new Error(
//         "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required to do auth"
//       );
//     }
//     const serviceAccount = cert;

//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });
//     lazyAdmin = admin;
//   }

//   return lazyAdmin;
// }

// let lazyAdminAuth: admin.auth.Auth;
// function getAdminAuth() {
//   if (!lazyAdminAuth) {
//     lazyAdminAuth = getAdmin().auth();
//   }
//   return lazyAdminAuth;
// }

type GroupBuilder = {
  remainingPlayers: Toon[];
  groups: Group[];
};

async function shuffleGroups(serverId: string) {
  // get list of LFG toons
  const lfgToonNames = await getLfgToonNames(serverId);
  const lfgToonsPromises = lfgToonNames.map(
    async (name: string) => await getToon(serverId, name)
  );
  const lfgToons = await Promise.all(lfgToonsPromises);
  const shuffledLfgToons = _.shuffle(lfgToons);
  const sortedLfgToons = _.sortBy(shuffledLfgToons, [
    "roles.length",
    "maximumLevel",
  ]);

  const lowestLevel = Math.min(...lfgToons.map((toon) => toon.minimumLevel));
  const highestLevel = Math.max(...lfgToons.map((toon) => toon.maximumLevel));

  const allDifficulties = _.range(highestLevel, lowestLevel);

  const fullGroupsAndRemaining = allDifficulties.reduce(
    (previous: GroupBuilder, difficulty) => {
      const newGroups = createGroupsForDifficulty(
        previous.remainingPlayers,
        difficulty
      );
      const filteredRemaining = previous.remainingPlayers.filter(
        (toon) =>
          !newGroups.flatMap((group) => group.toonNames).includes(toon.name)
      );
      return {
        remainingPlayers: filteredRemaining,
        groups: [...previous.groups, ...newGroups],
      };
    },
    {
      remainingPlayers: sortedLfgToons,
      groups: [],
    }
  );

  const partialGroupsAndRemaining = allDifficulties.reduce(
    (previous: GroupBuilder, difficulty) => {
      const newGroups = createGroupsForDifficulty(
        previous.remainingPlayers,
        difficulty,
        3
      );
      const filteredRemaining = previous.remainingPlayers.filter(
        (toon) =>
          !newGroups.flatMap((group) => group.toonNames).includes(toon.name)
      );
      return {
        remainingPlayers: filteredRemaining,
        groups: [...previous.groups, ...newGroups],
      };
    },
    {
      remainingPlayers: fullGroupsAndRemaining.remainingPlayers,
      groups: [],
    }
  );

  // consider anyone else "still waiting"

  const allUnsavedGroups = [
    ...fullGroupsAndRemaining.groups,
    ...partialGroupsAndRemaining.groups,
  ].map((group, index) => ({ ...group, id: index + 1 + "" }));

  try {
    const allGroups = await getGroups(serverId);
    await Promise.all(
      allGroups.map((group) => removeGroup(serverId, group.id))
    );
    await Promise.all(
      allUnsavedGroups.map((unsavedGroup) =>
        createGroup(serverId, unsavedGroup)
      )
    );
  } catch (error) {
    // TODO: Do something different here?
    throw error;
  }

  return await getGroups(serverId);
}

const createGroup = (serverId: string, group: Group) => {
  const id = group?.id || _.uniqueId("");
  const upsertGroup = update(`guilds/${serverId}/groups/${id}`);
  return upsertGroup((oldGroup: Group) => {
    const oldOrEmpty = oldGroup
      ? oldGroup
      : {
          toonNames: [],
          locked: false,
          full: false,
          difficulty: "normal",
        };
    const updated = {
      ...oldOrEmpty,
      ...group,
    };
    return updated;
  });
};

let lazyAuth: Auth;
function getAuth() {
  initialize();
  if (!lazyAuth) {
    lazyAuth = getFirebaseAuth(getApp());
  }
  return lazyAuth;
}

export {
  getAuth,
  // getAdminAuth,
  getToon,
  getServers,
  getLfgToonNames,
  getGroups,
  getToonsForUser,
  updateToon,
  createToon,
  addToLfg,
  removeFromLfg,
  getUnclaimedToons,
  claimToon,
  clearAllGroupsAndLfg,
  shuffleGroups,
};
