import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData
} from "/build/_shared/chunk-3MB32K55.js";
import {
  PERSITE_SOURCE_default,
  R
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
  __export,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// node_modules/@vercel/analytics/dist/react/index.mjs
var import_react = __toESM(require_react(), 1);
"use client";
var name = "@vercel/analytics";
var version = "1.5.0";
var initQueue = () => {
  if (window.va)
    return;
  window.va = function a(...params) {
    (window.vaq = window.vaq || []).push(params);
  };
};
function isBrowser() {
  return typeof window !== "undefined";
}
function detectEnvironment() {
  try {
    const env = "development";
    if (env === "development" || env === "test") {
      return "development";
    }
  } catch (e) {
  }
  return "production";
}
function setMode(mode = "auto") {
  if (mode === "auto") {
    window.vam = detectEnvironment();
    return;
  }
  window.vam = mode;
}
function getMode() {
  const mode = isBrowser() ? window.vam : detectEnvironment();
  return mode || "production";
}
function isDevelopment() {
  return getMode() === "development";
}
function getScriptSrc(props) {
  if (props.scriptSrc) {
    return props.scriptSrc;
  }
  if (isDevelopment()) {
    return "https://va.vercel-scripts.com/v1/script.debug.js";
  }
  if (props.basePath) {
    return `${props.basePath}/insights/script.js`;
  }
  return "/_vercel/insights/script.js";
}
function inject(props = {
  debug: true
}) {
  var _a;
  if (!isBrowser())
    return;
  setMode(props.mode);
  initQueue();
  if (props.beforeSend) {
    (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
  }
  const src = getScriptSrc(props);
  if (document.head.querySelector(`script[src*="${src}"]`))
    return;
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.dataset.sdkn = name + (props.framework ? `/${props.framework}` : "");
  script.dataset.sdkv = version;
  if (props.disableAutoTrack) {
    script.dataset.disableAutoTrack = "1";
  }
  if (props.endpoint) {
    script.dataset.endpoint = props.endpoint;
  } else if (props.basePath) {
    script.dataset.endpoint = `${props.basePath}/insights`;
  }
  if (props.dsn) {
    script.dataset.dsn = props.dsn;
  }
  script.onerror = () => {
    const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
    console.log(
      `[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`
    );
  };
  if (isDevelopment() && props.debug === false) {
    script.dataset.debug = "false";
  }
  document.head.appendChild(script);
}
function pageview({
  route,
  path
}) {
  var _a;
  (_a = window.va) == null ? void 0 : _a.call(window, "pageview", { route, path });
}
function getBasePath() {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return void 0;
  }
  return process.env.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
}
function Analytics(props) {
  (0, import_react.useEffect)(() => {
    var _a;
    if (props.beforeSend) {
      (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
  }, [props.beforeSend]);
  (0, import_react.useEffect)(() => {
    inject({
      framework: props.framework || "react",
      basePath: props.basePath ?? getBasePath(),
      ...props.route !== void 0 && { disableAutoTrack: true },
      ...props
    });
  }, []);
  (0, import_react.useEffect)(() => {
    if (props.route && props.path) {
      pageview({ route: props.route, path: props.path });
    }
  }, [props.route, props.path]);
  return null;
}

// node_modules/@radix-ui/themes/styles.css?url
var styles_default = "/build/_assets/styles-4YV7AOIV.css?url";

// node_modules/@fontsource/lexend/index.css?url
var lexend_default = "/build/_assets/index-6475A6XZ.css?url";

// app/main.css?url
var main_default = "/build/_assets/main-4EIMQOTS.css?url";

// app/accordion.css?url
var accordion_default = "/build/_assets/accordion-ZSCU5LY3.css?url";

// app/afl-manager.css?url
var afl_manager_default = "/build/_assets/afl-manager-ZD6PPOSD.css?url";

// app/components/Footer/index.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\Footer\\\\index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\Footer\\index.tsx"
  );
  import.meta.hot.lastModified = "1747543677766.8286";
}
function Footer() {
  _s();
  const data = useRouteLoaderData("root");
  const host = data?.host || "localhost";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: {
    width: "100%",
    textAlign: "center",
    fontSize: "0.9rem",
    paddingBottom: "1rem"
  }, children: [
    "Get this website for free \u2013 ",
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
      "a",
      {
        href: `https://mzaremski.com/persite?utm_source=${host}`,
        children: "PerSite"
      },
      void 0,
      false,
      {
        fileName: "app/components/Footer/index.tsx",
        lineNumber: 38,
        columnNumber: 35
      },
      this
    )
  ] }, void 0, true, {
    fileName: "app/components/Footer/index.tsx",
    lineNumber: 27,
    columnNumber: 10
  }, this);
}
_s(Footer, "HP+Y84T8RxtBxKrBpCtBHZ7kTOE=", false, function() {
  return [useRouteLoaderData];
});
_c = Footer;
var _c;
$RefreshReg$(_c, "Footer");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/Backgrounds/index.tsx
var Backgrounds_exports = {};
__export(Backgrounds_exports, {
  FlyingOrbes: () => FlyingOrbes,
  ParallaxyStars: () => ParallaxyStars,
  PerlinNoise: () => PerlinNoise,
  ShootingStars: () => ShootingStars,
  css: () => css
});

// app/components/Backgrounds/background-shooting-stars.css?url
var background_shooting_stars_default = "/build/_assets/background-shooting-stars-X3KFS3PS.css?url";

// app/components/Backgrounds/background-perlin-noise.css?url
var background_perlin_noise_default = "/build/_assets/background-perlin-noise-7EODXIOM.css?url";

// app/components/Backgrounds/background-parallaxy-stars.css?url
var background_parallaxy_stars_default = "/build/_assets/background-parallaxy-stars-2YSM7XJQ.css?url";

// app/components/Backgrounds/background-flying-orbes.css?url
var background_flying_orbes_default = "/build/_assets/background-flying-orbes-PC5FZLGK.css?url";

// app/components/Backgrounds/FlyingOrbes.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\Backgrounds\\\\FlyingOrbes.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\Backgrounds\\FlyingOrbes.tsx"
  );
  import.meta.hot.lastModified = "1747543677762.1582";
}
var FlyingOrbes = () => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { id: "background-flying-orbes", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 23,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 24,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 25,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 27,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 28,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 29,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 30,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 31,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 32,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 33,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 34,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 36,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 37,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 39,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
      lineNumber: 40,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/Backgrounds/FlyingOrbes.tsx",
    lineNumber: 22,
    columnNumber: 10
  }, this);
};
_c2 = FlyingOrbes;
var _c2;
$RefreshReg$(_c2, "FlyingOrbes");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/Backgrounds/ParallaxyStars.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\Backgrounds\\\\ParallaxyStars.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\Backgrounds\\ParallaxyStars.tsx"
  );
  import.meta.hot.lastModified = "1747543677762.1582";
}
var ParallaxyStars = () => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { id: "background-parallaxy-stars", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "background-parallaxy-stars", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", {}, void 0, false, {
        fileName: "app/components/Backgrounds/ParallaxyStars.tsx",
        lineNumber: 24,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", {}, void 0, false, {
        fileName: "app/components/Backgrounds/ParallaxyStars.tsx",
        lineNumber: 25,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", {}, void 0, false, {
        fileName: "app/components/Backgrounds/ParallaxyStars.tsx",
        lineNumber: 26,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/Backgrounds/ParallaxyStars.tsx",
      lineNumber: 23,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "background-parallaxy-stars background-parallaxy-stars__second-half", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", {}, void 0, false, {
        fileName: "app/components/Backgrounds/ParallaxyStars.tsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", {}, void 0, false, {
        fileName: "app/components/Backgrounds/ParallaxyStars.tsx",
        lineNumber: 30,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", {}, void 0, false, {
        fileName: "app/components/Backgrounds/ParallaxyStars.tsx",
        lineNumber: 31,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/Backgrounds/ParallaxyStars.tsx",
      lineNumber: 28,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/Backgrounds/ParallaxyStars.tsx",
    lineNumber: 22,
    columnNumber: 10
  }, this);
};
_c3 = ParallaxyStars;
var _c3;
$RefreshReg$(_c3, "ParallaxyStars");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/Backgrounds/PerlinNoise.tsx
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\Backgrounds\\\\PerlinNoise.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\Backgrounds\\PerlinNoise.tsx"
  );
  import.meta.hot.lastModified = "1747543677763.1577";
}
var PerlinNoise = () => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { id: "background-perlin-noise" }, void 0, false, {
    fileName: "app/components/Backgrounds/PerlinNoise.tsx",
    lineNumber: 22,
    columnNumber: 10
  }, this);
};
_c4 = PerlinNoise;
var _c4;
$RefreshReg$(_c4, "PerlinNoise");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/Backgrounds/ShootingStars.tsx
var import_jsx_dev_runtime5 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\Backgrounds\\\\ShootingStars.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\Backgrounds\\ShootingStars.tsx"
  );
  import.meta.hot.lastModified = "1747543677763.1577";
}
var ShootingStars = () => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { id: "background-shooting-stars", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 23,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 24,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 25,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 26,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 27,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 28,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 29,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 30,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 31,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", {}, void 0, false, {
      fileName: "app/components/Backgrounds/ShootingStars.tsx",
      lineNumber: 32,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/Backgrounds/ShootingStars.tsx",
    lineNumber: 22,
    columnNumber: 10
  }, this);
};
_c5 = ShootingStars;
var _c5;
$RefreshReg$(_c5, "ShootingStars");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/Backgrounds/index.tsx
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\Backgrounds\\index.tsx"
  );
}
var css = {
  ShootingStars: background_shooting_stars_default,
  PerlinNoise: background_perlin_noise_default,
  ParallaxyStars: background_parallaxy_stars_default,
  FlyingOrbes: background_flying_orbes_default
};

// app/root.tsx
var import_jsx_dev_runtime6 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\root.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\root.tsx"
  );
}
function Layout({
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("meta", { charSet: "utf-8" }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 36,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(Meta, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 38,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(Links, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 39,
        columnNumber: 9
      }, this),
      false
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("body", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(R, { ...PERSITE_SOURCE_default.theme.radixConfig, children: [
      Backgrounds_exports[PERSITE_SOURCE_default.theme.background](),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("main", { style: {
        paddingTop: "2vw",
        paddingLeft: "2vw",
        paddingRight: "2vw",
        paddingBottom: "5vw"
      }, children }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 46,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(Footer, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 54,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(ScrollRestoration, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 55,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(Scripts, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 56,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(Analytics, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 57,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 43,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/root.tsx",
      lineNumber: 42,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/root.tsx",
    lineNumber: 34,
    columnNumber: 10
  }, this);
}
_c6 = Layout;
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(Outlet, {}, void 0, false, {
    fileName: "app/root.tsx",
    lineNumber: 69,
    columnNumber: 10
  }, this);
}
_c22 = App;
function links() {
  return [{
    rel: "stylesheet",
    href: styles_default
  }, {
    rel: "stylesheet",
    href: lexend_default
  }, {
    rel: "stylesheet",
    href: main_default
  }, {
    rel: "stylesheet",
    href: accordion_default
  }, {
    rel: "stylesheet",
    href: afl_manager_default
  }, {
    rel: "stylesheet",
    href: css[PERSITE_SOURCE_default.theme.background]
  }, {
    rel: "icon",
    href: "/favicon.ico"
  }];
}
var _c6;
var _c22;
$RefreshReg$(_c6, "Layout");
$RefreshReg$(_c22, "App");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Layout,
  App as default,
  links
};
//# sourceMappingURL=/build/root-GSCD7BEY.js.map
