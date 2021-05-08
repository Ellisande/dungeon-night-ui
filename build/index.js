var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __objSpread = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// <stdin>
__markAsModule(exports);
__export(exports, {
  assets: () => import_assets.default,
  entry: () => entry,
  routes: () => routes
});

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toModule(require("react"));

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_server = __toModule(require("react-dom/server"));
var import_remix = __toModule(require("remix"));
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = import_server.default.renderToString(/* @__PURE__ */ React.createElement(import_remix.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: __objSpread(__objSpread({}, Object.fromEntries(responseHeaders)), {
      "Content-Type": "text/html"
    })
  });
}

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/root.tsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links
});
var import_remix2 = __toModule(require("remix"));
var import_react_router_dom = __toModule(require("react-router-dom"));

// app/styles/global.css
var global_default = "/build/_assets/global-JSZMBHXS.css";

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/root.tsx
var links = () => {
  return [{rel: "stylesheet", href: global_default}];
};
function Document({children}) {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ React.createElement("link", {
    rel: "icon",
    href: "/favicon.png",
    type: "image/png"
  }), /* @__PURE__ */ React.createElement(import_remix2.Meta, null), /* @__PURE__ */ React.createElement(import_remix2.Links, null)), /* @__PURE__ */ React.createElement("body", null, children, /* @__PURE__ */ React.createElement(import_remix2.Scripts, null), process.env.NODE_ENV === "development" && /* @__PURE__ */ React.createElement(import_remix2.LiveReload, null)));
}
function App() {
  const app = (0, import_remix2.useRouteData)();
  return /* @__PURE__ */ React.createElement(Document, null, /* @__PURE__ */ React.createElement(import_react_router_dom.Outlet, null));
}
function ErrorBoundary({error}) {
  return /* @__PURE__ */ React.createElement(Document, null, /* @__PURE__ */ React.createElement("h1", null, "App Error"), /* @__PURE__ */ React.createElement("pre", null, error.message), /* @__PURE__ */ React.createElement("p", null, "Replace this UI with what you want users to see when your app throws uncaught errors."));
}

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/routes/404.tsx
var __exports = {};
__export(__exports, {
  default: () => FourOhFour,
  meta: () => meta
});
var meta = () => {
  return {title: "Ain't nothing here"};
};
function FourOhFour() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "404"));
}

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index,
  links: () => links2,
  loader: () => loader,
  meta: () => meta2
});
var import_remix3 = __toModule(require("remix"));

// app/styles/index.css
var styles_default = "/build/_assets/index-BGRSJ545.css";

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/routes/index.tsx
var meta2 = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!"
  };
};
var links2 = () => {
  return [{rel: "stylesheet", href: styles_default}];
};
var loader = async () => {
  return {message: "this is awesome \u{1F60E}"};
};
function Index() {
  let data = (0, import_remix3.useRouteData)();
  return /* @__PURE__ */ React.createElement("div", {
    style: {textAlign: "center", padding: 20}
  }, /* @__PURE__ */ React.createElement("h2", null, "Welcome to Remix!"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("a", {
    href: "https://remix.run/dashboard/docs"
  }, "Check out the docs"), " to get started."), /* @__PURE__ */ React.createElement("p", null, "Message from the loader: ", data.message));
}

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/routes/servers.tsx
var servers_exports = {};
__export(servers_exports, {
  default: () => Servers,
  links: () => links3,
  loader: () => loader2,
  meta: () => meta3
});
var import_react_router = __toModule(require("react-router"));
var import_react_router_dom2 = __toModule(require("react-router-dom"));
var import_remix4 = __toModule(require("remix"));

// app/utils/firebase.ts
var import_firebase = __toModule(require("firebase"));

// firebaseConfig.ts
var config = {
  apiKey: "AIzaSyB8laRFNWlGcuEWp66Du-4GAIgTBbWpzZE",
  authDomain: "dungeon-night.firebaseapp.com",
  projectId: "dungeon-night",
  storageBucket: "dungeon-night.appspot.com",
  messagingSenderId: "62082775087",
  appId: "1:62082775087:web:a5a535863690e68ed12eda",
  measurementId: "G-G1E5691Z0J"
};

// app/utils/firebase.ts
var lazyDb;
async function getGroups(serverId) {
  const groupsRef = await getDb().collection(`/guilds/${serverId}/groups`).get();
  const groups = [];
  await groupsRef.forEach((doc) => {
    const data = doc.data() || {};
    groups.push(__objSpread({
      id: doc.id
    }, data));
  });
  return groups;
}
async function getToon(serverId, toonName) {
  const toonSnapshot = await getDb().doc(`/guilds/${serverId}/toons/${toonName}`).get();
  return toonSnapshot.exists ? toonSnapshot.data() || {} : {};
}
async function getLfgToonNames(serverId) {
  var _a;
  const toonNameSnapshot = await getDb().doc(`/guilds/${serverId}/lfg/toonNames`).get();
  return toonNameSnapshot.exists ? (_a = toonNameSnapshot == null ? void 0 : toonNameSnapshot.data()) == null ? void 0 : _a.toonNames : [];
}
async function getServers() {
  const serversRef = getDb().collection("/guilds");
  const serverSnapshot = await serversRef.get();
  const servers = [];
  await serverSnapshot.forEach((doc) => {
    const data = doc.data() || {};
    servers.push(__objSpread({
      id: doc.id
    }, data));
  });
  return servers;
}
function getDb() {
  if (!lazyDb) {
    lazyDb = getFirebase().firestore();
  }
  return lazyDb;
}
var lazyFirebase;
function getFirebase() {
  if (import_firebase.default.apps.length) {
    lazyFirebase = import_firebase.default.app();
  }
  if (!lazyFirebase) {
    import_firebase.default.initializeApp(config);
    lazyFirebase = import_firebase.default.app();
  }
  return lazyFirebase;
}

// app/styles/server.css
var server_default = "/build/_assets/server-WO76FJ4H.css";

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/routes/servers.tsx
var links3 = () => {
  return [{rel: "stylesheet", href: server_default}];
};
var loader2 = async () => {
  const servers = await getServers();
  const enhancedServers = await Promise.all(servers.map(async (server) => {
    const lfgToonNames = await getLfgToonNames(server.id);
    return __objSpread(__objSpread({}, server), {
      lfgToonNames
    });
  }));
  return (0, import_remix4.json)(enhancedServers);
};
function Servers() {
  const servers = (0, import_remix4.useRouteData)();
  return /* @__PURE__ */ React.createElement("div", {
    className: "server-page"
  }, /* @__PURE__ */ React.createElement("nav", {
    className: "server-nav"
  }, servers.map((server) => {
    var _a;
    return /* @__PURE__ */ React.createElement(import_react_router_dom2.NavLink, {
      key: server.id,
      to: server.id,
      className: "server-nav-link"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "server-name"
    }, server.name || server.id), /* @__PURE__ */ React.createElement("div", {
      className: "server-lfg"
    }, ((_a = server == null ? void 0 : server.lfgToonNames) == null ? void 0 : _a.length) || 0));
  })), /* @__PURE__ */ React.createElement(import_react_router.Outlet, null));
}
function meta3() {
  return {
    title: "Discord Servers",
    description: "List of discord servers supported by the bot."
  };
}

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/routes/servers/$server.tsx
var server_exports = {};
__export(server_exports, {
  default: () => ServerView,
  links: () => links4,
  loader: () => loader3
});
var import_remix5 = __toModule(require("remix"));

// app/components/Difficulty.tsx
function Difficulty(props) {
  const {difficulty} = props;
  let style = "normal";
  if (difficulty == "heroic") {
    style = "heroic";
  }
  if (difficulty == "mythic") {
    style = "mythic";
  }
  if (/m\d+/.test(difficulty)) {
    const level = Number(difficulty.replace(/m/i, ""));
    style = level >= 10 ? "legendary" : "mythic";
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: `difficulty ${style}`
  }, difficulty);
}

// app/components/Toon.tsx
function HealerIcon() {
  return /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className: "h-6 w-6 toon-role healer",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
  }));
}
function DpsIcon() {
  return /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className: "h-6 w-6 toon-role dps",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
  }), /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
  }));
}
function TankIcon() {
  return /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className: "h-6 w-6 toon-role tank",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
  }));
}
var iconMap = {
  tank: TankIcon,
  dps: DpsIcon,
  healer: HealerIcon
};
function roleMapper(role) {
  const Icon = iconMap[role];
  return /* @__PURE__ */ React.createElement(Icon, {
    key: role
  });
}
function getMaxDifficulty(difficulties) {
  const mythicPlus = difficulties.filter((difficulty) => /m\d+/.test(difficulty));
  if (mythicPlus.length > 0) {
    const mPlusNumbers = mythicPlus.map((difficulty) => difficulty.replace(/m/i, "")).map(Number);
    return "m" + Math.max(...mPlusNumbers);
  }
  if (difficulties.includes("mythic")) {
    return "mythic";
  }
  if (difficulties.includes("heroic")) {
    return "heroic";
  }
  return "normal";
}
function ToonRow(props) {
  const {
    toon,
    className,
    showMaxDifficulty = false,
    showILevel = false
  } = props;
  return /* @__PURE__ */ React.createElement("div", {
    className: `toon ${className}`
  }, /* @__PURE__ */ React.createElement("div", {
    className: "toon-name"
  }, toon.name), /* @__PURE__ */ React.createElement("div", {
    className: "toon-roles"
  }, toon.roles.map(roleMapper)), showMaxDifficulty && /* @__PURE__ */ React.createElement("div", {
    className: "toon-max-difficulty"
  }, /* @__PURE__ */ React.createElement(Difficulty, {
    difficulty: getMaxDifficulty(toon.difficulties)
  })), showILevel && /* @__PURE__ */ React.createElement("div", {
    className: "toon-ilevel"
  }, toon.iLevel));
}

// app/styles/toons.css
var toons_default = "/build/_assets/toons-CRULBANU.css";

// app/styles/groups.css
var groups_default = "/build/_assets/groups-JI4FIP2L.css";

// app/components/Group.tsx
function GroupContainer(props) {
  const {group, toons = []} = props;
  return /* @__PURE__ */ React.createElement("div", {
    className: "group"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "group-id"
  }, "Group ", group.id), /* @__PURE__ */ React.createElement("div", {
    className: "group-difficulty"
  }, /* @__PURE__ */ React.createElement(Difficulty, {
    difficulty: group.difficulty
  })), /* @__PURE__ */ React.createElement("div", {
    className: "group-full"
  }, group.full ? "Full" : ""), /* @__PURE__ */ React.createElement("div", {
    className: "group-members"
  }, !toons.length && group.toonNames.map((toonName) => /* @__PURE__ */ React.createElement("div", {
    key: toonName,
    className: "toon-name"
  }, toonName)), toons.length > 0 && toons.map((toon) => /* @__PURE__ */ React.createElement(ToonRow, {
    key: toon.name,
    toon
  }))));
}

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/routes/servers/$server.tsx
var links4 = () => {
  return [
    {rel: "stylesheet", href: toons_default},
    {rel: "stylesheet", href: groups_default}
  ];
};
var loader3 = async ({params}) => {
  const serverId = params.server;
  const lfgToonNames = await getLfgToonNames(serverId);
  const groups = await getGroups(serverId);
  const toons = await Promise.all(lfgToonNames.map(async (name) => {
    return await getToon(serverId, name);
  }));
  return (0, import_remix5.json)({lfgToonNames, groups, toons});
};
var toonFinderFunc = (toons) => (toonName) => {
  return toons.find((toon) => toon.name == toonName) || {};
};
function ServerView() {
  const {lfgToonNames, groups, toons} = (0, import_remix5.useRouteData)();
  const toonFinder = toonFinderFunc(toons);
  const allLfgToons = lfgToonNames.map(toonFinder);
  const enhancedGroups = groups.map((group) => __objSpread(__objSpread({}, group), {
    toons: group.toonNames.map(toonFinder)
  }));
  const groupedToons = enhancedGroups.flatMap((group) => group.toons);
  const waitingToons = allLfgToons.filter((toon) => !groupedToons.includes(toon));
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Groups: ", groups.length), /* @__PURE__ */ React.createElement("div", {
    className: "groups"
  }, (enhancedGroups == null ? void 0 : enhancedGroups.length) > 0 && enhancedGroups.map((group) => /* @__PURE__ */ React.createElement(GroupContainer, {
    key: group.id,
    group,
    toons: group.toons
  })), (!groups || !groups.length) && /* @__PURE__ */ React.createElement("div", null, "No Groups Formed Yet")), /* @__PURE__ */ React.createElement("h2", null, "Waiting: ", waitingToons.length), /* @__PURE__ */ React.createElement("div", {
    className: "lfg-toons"
  }, waitingToons.map((toon) => /* @__PURE__ */ React.createElement(ToonRow, {
    toon,
    key: toon.name,
    showMaxDifficulty: true,
    showILevel: true
  }))));
}

// route-module:/Users/ellisande/dev/source/dungeon-night-ui/app/routes/servers/index.tsx
var servers_exports2 = {};
__export(servers_exports2, {
  default: () => Placeholder
});
function Placeholder() {
  return /* @__PURE__ */ React.createElement("div", null, "Select a server");
}

// <stdin>
var import_assets = __toModule(require("./assets.json"));
var entry = {module: entry_server_exports};
var routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "/",
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/404": {
    id: "routes/404",
    parentId: "root",
    path: "*",
    caseSensitive: false,
    module: __exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: "/",
    caseSensitive: false,
    module: routes_exports
  },
  "routes/servers": {
    id: "routes/servers",
    parentId: "root",
    path: "servers",
    caseSensitive: false,
    module: servers_exports
  },
  "routes/servers/$server": {
    id: "routes/servers/$server",
    parentId: "routes/servers",
    path: ":server",
    caseSensitive: false,
    module: server_exports
  },
  "routes/servers/index": {
    id: "routes/servers/index",
    parentId: "routes/servers",
    path: "/",
    caseSensitive: false,
    module: servers_exports2
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
