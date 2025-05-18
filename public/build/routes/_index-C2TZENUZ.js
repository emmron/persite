import {
  Dashboard,
  GameInitialization,
  TeamManagement,
  generatePlayersForTeam,
  initialGameState,
  players,
  teams
} from "/build/_shared/chunk-VXOW7BRJ.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Header
} from "/build/_shared/chunk-57FHY37I.js";
import {
  generateMetaTags
} from "/build/_shared/chunk-X6TQ4243.js";
import {
  o2 as o,
  o4 as o2,
  p,
  p2,
  p4 as p3,
  r,
  tabs_exports
} from "/build/_shared/chunk-IJYMBMRR.js";
import "/build/_shared/chunk-B43JI2TA.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-U65RCIF3.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/_index.tsx
var import_node = __toESM(require_node(), 1);
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\_index.tsx"
  );
  import.meta.hot.lastModified = "1747543677778.8335";
}
var meta = () => generateMetaTags({
  title: "AFL Manager | Coach Simulation Game",
  description: "Simulate being an AFL head coach - manage your team, set tactics, and lead your club to premiership glory!"
});
function Index() {
  _s();
  const [gameState, setGameState] = (0, import_react.useState)(initialGameState);
  const [allPlayers, setAllPlayers] = (0, import_react.useState)(players);
  const [activeTab, setActiveTab] = (0, import_react.useState)("dashboard");
  const handleGameStart = (newGameState) => {
    setGameState({
      ...newGameState,
      initialized: true
    });
    const generatedPlayers = [...players];
    teams.forEach((team) => {
      const existingPlayers = players.filter((p4) => p4.teamId === team.id);
      if (existingPlayers.length < 22) {
        const additionalPlayers = generatePlayersForTeam(team.id, 22 - existingPlayers.length);
        generatedPlayers.push(...additionalPlayers);
      }
    });
    setAllPlayers(generatedPlayers);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { size: "2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { size: {
    initial: "2",
    sm: "5"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 77,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { mt: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "8", align: "center", children: "AFL Manager" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 80,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", align: "center", mb: "4", children: "Simulate being an AFL head coach - lead your team to premiership glory!" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 81,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 79,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { size: "4", my: "4" }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 86,
      columnNumber: 9
    }, this),
    !gameState.initialized ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GameInitialization, { onGameStart: handleGameStart }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 88,
      columnNumber: 35
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Root, { defaultValue: "dashboard", onValueChange: setActiveTab, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.List, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Trigger, { value: "dashboard", children: "Dashboard" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 90,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Trigger, { value: "team", children: "Team" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 91,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Trigger, { value: "match", children: "Match Center" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 92,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Trigger, { value: "league", children: "League" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 93,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Trigger, { value: "players", children: "Players" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 94,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Trigger, { value: "club", children: "Club" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 95,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 89,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { pt: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Content, { value: "dashboard", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dashboard, { gameState, allPlayers }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 100,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 99,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Content, { value: "team", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TeamManagement, { gameState, allPlayers }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 104,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 103,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Content, { value: "match", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { children: "Match center content will go here" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 108,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 107,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Content, { value: "league", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { children: "League information content will go here" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 112,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 111,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Content, { value: "players", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { children: "Player management content will go here" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 116,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 115,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Content, { value: "club", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { children: "Club management content will go here" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 120,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 119,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 98,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 88,
      columnNumber: 90
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 73,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 72,
    columnNumber: 10
  }, this);
}
_s(Index, "WQGyUdFjTz3WeV3Vh6XkJDovOVA=");
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default,
  meta
};
//# sourceMappingURL=/build/routes/_index-C2TZENUZ.js.map
