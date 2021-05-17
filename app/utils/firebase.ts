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
} from "firebase/firestore";
import { Auth, getAuth as getFirebaseAuth } from "firebase/auth";
// import * as admin from "firebase-admin";
import { config as firebaseConfig } from "../../firebaseConfig";
import { Toon } from "../types/Toon";
import { Server } from "../types/Server";
import cert from "../../firebaseCert.json";

const config =
  Object.keys(firebaseConfig).length > 0
    ? firebaseConfig
    : JSON.parse(process.env.FIREBASE_CONFIG as string);

if (!getApps().length) {
  initializeApp(config);
}

function initialize() {
  if (!getApps().length) {
    initializeApp(config);
  }
}

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
  addToLfg,
  removeFromLfg,
  getUnclaimedToons,
  claimToon,
};
