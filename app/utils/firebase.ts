import { Group } from "./../types/Group.d";
import type Firebase from "firebase";
import firebase from "firebase";
import { config } from "../../firebaseConfig";
import { Toon } from "../types/Toon";
import { Server } from "../types/Server";
let lazyDb: Firebase.firestore.Firestore;

async function addToLfg(serverId: string, toonName: string) {
  const listUpdate = (oldState: any = { toonNames: [] }) => {
    if (oldState.toonNames.includes(toonName)) {
      return oldState;
    }
    return {
      toonNames: [...oldState.toonNames, toonName],
    };
  };
  return update(getDb())(`/guilds/${serverId}/lfg/toonNames`)(listUpdate);
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
  return update(getDb())(`/guilds/${serverId}/lfg/toonNames`)(listUpdate);
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
  return update(getDb())(`/guilds/${serverId}/toons/${toonName}`)(toonUpdate);
}

const update =
  (db: Firebase.firestore.Firestore) =>
  (docPath: string) =>
  (updateFunction: any): any =>
    db.runTransaction((t) => {
      const docRef = db.doc(docPath);
      return t.get(docRef).then((oldState) => {
        const newState = updateFunction(oldState.data());
        if (oldState === newState) {
          return;
        }
        return t.set(docRef, newState);
      });
    });

async function getToonsForUser(serverId: string, ownerId: string) {
  const toonsRef = await getDb()
    .collection(`/guilds/${serverId}/toons`)
    .where("userId", "==", ownerId)
    .get();
  const toons: Toon[] = [];
  await toonsRef.forEach((doc) => {
    toons.push({
      ...doc.data(),
    } as Toon);
  });
  return toons;
}

async function getGroups(serverId: string) {
  const groupsRef = await getDb()
    .collection(`/guilds/${serverId}/groups`)
    .get();
  const groups: Group[] = [];
  await groupsRef.forEach((doc) => {
    const data = doc.data() || {};
    groups.push({
      id: doc.id,
      ...data,
    } as Group);
  });
  return groups;
}

async function getToon(serverId: string, toonName: string) {
  const toonSnapshot = await getDb()
    .doc(`/guilds/${serverId}/toons/${toonName}`)
    .get();
  return toonSnapshot.exists ? toonSnapshot.data() || {} : {};
}

async function getLfgToonNames(serverId: string) {
  const toonNameSnapshot = await getDb()
    .doc(`/guilds/${serverId}/lfg/toonNames`)
    .get();
  return toonNameSnapshot.exists ? toonNameSnapshot?.data()?.toonNames : [];
}

async function getServers() {
  const serversRef = getDb().collection("/guilds");
  const serverSnapshot = await serversRef.get();
  const servers: Server[] = [];
  await serverSnapshot.forEach((doc) => {
    const data = doc.data() || {};
    servers.push({
      id: doc.id,
      ...data,
    } as Server);
  });
  return servers;
}

function getDb(): Firebase.firestore.Firestore {
  if (!lazyDb) {
    lazyDb = getFirebase().firestore();
  }
  return lazyDb;
}

let lazyFirebase: Firebase.app.App;
function getFirebase() {
  if (firebase.apps.length) {
    lazyFirebase = firebase.app();
  }
  if (!lazyFirebase) {
    firebase.initializeApp(config);
    lazyFirebase = firebase.app();
  }
  return lazyFirebase;
}

let lazyAuth: Firebase.auth.Auth;
function getAuth() {
  if (!lazyAuth) {
    lazyAuth = getFirebase().auth();
  }
  return lazyAuth;
}

export {
  getAuth,
  getToon,
  getServers,
  getLfgToonNames,
  getGroups,
  getToonsForUser,
  updateToon,
  addToLfg,
  removeFromLfg,
};
