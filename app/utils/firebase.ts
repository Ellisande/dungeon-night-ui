import { Group } from "./../types/Group.d";
import type Firebase from "firebase";
import firebase from "firebase";
import { config } from "../../firebaseConfig";
let lazyDb: Firebase.firestore.Firestore;

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

export { getToon, getServers, getLfgToonNames, getGroups };
