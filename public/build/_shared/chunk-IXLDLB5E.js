import {
  Link
} from "/build/_shared/chunk-3MB32K55.js";
import {
  PERSITE_SOURCE_default,
  p2 as p
} from "/build/_shared/chunk-IJYMBMRR.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  createHotContext
} from "/build/_shared/chunk-U65RCIF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/components/SocialMediaSection/index.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\SocialMediaSection\\\\index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\SocialMediaSection\\index.tsx"
  );
  import.meta.hot.lastModified = "1747543677771.894";
}
function SocialMediaSection() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { width: "100%", height: "60px", style: {
    display: "grid",
    gridTemplateColumns: `repeat(${PERSITE_SOURCE_default.socialSection.length}, 1fr)`,
    gap: "0px",
    position: "absolute",
    bottom: "0",
    left: "0",
    borderTop: "1px solid var(--gray-a6)"
  }, children: PERSITE_SOURCE_default.socialSection.map((item, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { style: {
    textAlign: "center",
    borderRight: PERSITE_SOURCE_default.socialSection.length - 1 === index ? "none" : "1px solid var(--gray-a6)"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: item.link, className: "social-link", target: "_blank", "aria-label": item.ariaLabel, rel: "noreferrer", children: item.icon() }, void 0, false, {
    fileName: "app/components/SocialMediaSection/index.tsx",
    lineNumber: 38,
    columnNumber: 13
  }, this) }, item.link, false, {
    fileName: "app/components/SocialMediaSection/index.tsx",
    lineNumber: 34,
    columnNumber: 57
  }, this)) }, void 0, false, {
    fileName: "app/components/SocialMediaSection/index.tsx",
    lineNumber: 25,
    columnNumber: 10
  }, this);
}
_c = SocialMediaSection;
var _c;
$RefreshReg$(_c, "SocialMediaSection");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  SocialMediaSection
};
//# sourceMappingURL=/build/_shared/chunk-IXLDLB5E.js.map
