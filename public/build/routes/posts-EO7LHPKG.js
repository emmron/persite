import {
  SocialMediaSection
} from "/build/_shared/chunk-IXLDLB5E.js";
import {
  Header
} from "/build/_shared/chunk-57FHY37I.js";
import {
  Link,
  Outlet
} from "/build/_shared/chunk-3MB32K55.js";
import {
  o,
  o2,
  o4 as o3,
  p4 as p
} from "/build/_shared/chunk-IJYMBMRR.js";
import "/build/_shared/chunk-B43JI2TA.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-U65RCIF3.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/posts.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\posts.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\posts.tsx"
  );
  import.meta.hot.lastModified = "1747543677783.6194";
}
function PostsLayout() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { size: {
    initial: "2",
    sm: "5"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
      fileName: "app/routes/posts.tsx",
      lineNumber: 31,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o3, { size: "4", my: "6" }, void 0, false, {
      fileName: "app/routes/posts.tsx",
      lineNumber: 32,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
      fileName: "app/routes/posts.tsx",
      lineNumber: 34,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o3, { size: "4", my: "6" }, void 0, false, {
      fileName: "app/routes/posts.tsx",
      lineNumber: 36,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/#blog-list", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { size: "2", variant: "ghost", children: "Back to the posts list" }, void 0, false, {
      fileName: "app/routes/posts.tsx",
      lineNumber: 39,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/posts.tsx",
      lineNumber: 38,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: {
      marginTop: "38px"
    }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SocialMediaSection, {}, void 0, false, {
      fileName: "app/routes/posts.tsx",
      lineNumber: 47,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/posts.tsx",
      lineNumber: 44,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/posts.tsx",
    lineNumber: 27,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/posts.tsx",
    lineNumber: 26,
    columnNumber: 10
  }, this);
}
_c = PostsLayout;
var _c;
$RefreshReg$(_c, "PostsLayout");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  PostsLayout as default
};
//# sourceMappingURL=/build/routes/posts-EO7LHPKG.js.map
