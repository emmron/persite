import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  SocialMediaSection
} from "/build/_shared/chunk-IXLDLB5E.js";
import {
  Header
} from "/build/_shared/chunk-57FHY37I.js";
import {
  useLoaderData
} from "/build/_shared/chunk-3MB32K55.js";
import {
  generateMetaTags
} from "/build/_shared/chunk-X6TQ4243.js";
import {
  i,
  o,
  o2,
  o4 as o3,
  p,
  p2,
  p3,
  p4,
  r,
  r3 as r2,
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

// app/routes/afl-forum.tsx
var import_node = __toESM(require_node(), 1);
var import_react3 = __toESM(require_react(), 1);

// app/components/AFLForum/NewsSection.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLForum\\\\NewsSection.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLForum\\NewsSection.tsx"
  );
  import.meta.hot.lastModified = "1747543677748.558";
}
function NewsSection({
  articles
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "6", mb: "4", children: "Latest AFL News" }, void 0, false, {
      fileName: "app/components/AFLForum/NewsSection.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", gap: "4", children: articles.map((article) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { variant: "surface", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { gap: "4", direction: {
      initial: "column",
      sm: "row"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { style: {
        minWidth: "200px",
        maxWidth: "300px"
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(i, { ratio: 16 / 9, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: article.imageUrl, alt: article.title, style: {
        objectFit: "cover",
        width: "100%",
        height: "100%"
      }, onError: (e) => {
        const target = e.target;
        target.onerror = null;
        const colors = ["#1e40af", "#b91c1c", "#047857", "#7c2d12", "#581c87"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        target.style.display = "none";
        target.parentElement.innerHTML = `
                        <div style="
                          width: 100%; 
                          height: 100%; 
                          background-color: ${randomColor}; 
                          display: flex; 
                          align-items: center; 
                          justify-content: center;
                          color: white;
                          padding: 1rem;
                          text-align: center;
                          font-weight: bold;
                        ">
                          ${article.title}
                        </div>
                      `;
      } }, void 0, false, {
        fileName: "app/components/AFLForum/NewsSection.tsx",
        lineNumber: 39,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "app/components/AFLForum/NewsSection.tsx",
        lineNumber: 38,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/components/AFLForum/NewsSection.tsx",
        lineNumber: 34,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", children: article.title }, void 0, false, {
          fileName: "app/components/AFLForum/NewsSection.tsx",
          lineNumber: 71,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", mb: "2", children: article.date }, void 0, false, {
          fileName: "app/components/AFLForum/NewsSection.tsx",
          lineNumber: 72,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { children: article.content }, void 0, false, {
          fileName: "app/components/AFLForum/NewsSection.tsx",
          lineNumber: 73,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLForum/NewsSection.tsx",
        lineNumber: 70,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLForum/NewsSection.tsx",
      lineNumber: 30,
      columnNumber: 13
    }, this) }, article.id, false, {
      fileName: "app/components/AFLForum/NewsSection.tsx",
      lineNumber: 29,
      columnNumber: 34
    }, this)) }, void 0, false, {
      fileName: "app/components/AFLForum/NewsSection.tsx",
      lineNumber: 28,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLForum/NewsSection.tsx",
    lineNumber: 25,
    columnNumber: 10
  }, this);
}
_c = NewsSection;
var _c;
$RefreshReg$(_c, "NewsSection");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/AFLForum/ForumThreads.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLForum\\\\ForumThreads.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLForum\\ForumThreads.tsx"
  );
  import.meta.hot.lastModified = "1747543677747.8237";
}
function ForumThreads({
  threads
}) {
  _s();
  const [expandedThread, setExpandedThread] = (0, import_react.useState)(null);
  const [newThreadTitle, setNewThreadTitle] = (0, import_react.useState)("");
  const [newThreadContent, setNewThreadContent] = (0, import_react.useState)("");
  const [newComments, setNewComments] = (0, import_react.useState)({});
  const toggleThread = (threadId) => {
    if (expandedThread === threadId) {
      setExpandedThread(null);
    } else {
      setExpandedThread(threadId);
    }
  };
  const handleNewComment = (threadId, comment) => {
    setNewComments({
      ...newComments,
      [threadId]: ""
    });
    alert("Comment submitted anonymously!");
  };
  const handleNewThread = () => {
    setNewThreadTitle("");
    setNewThreadContent("");
    alert("Thread created anonymously!");
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "6", mb: "4", children: "Forum Discussions" }, void 0, false, {
      fileName: "app/components/AFLForum/ForumThreads.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", mb: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "4", mb: "2", children: "Start a New Discussion" }, void 0, false, {
        fileName: "app/components/AFLForum/ForumThreads.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("form", { onSubmit: (e) => {
        e.preventDefault();
        handleNewThread();
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { direction: "column", gap: "2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r2, { placeholder: "Thread title", value: newThreadTitle, onChange: (e) => setNewThreadTitle(e.target.value), required: true }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 70,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r2, { placeholder: "What's on your mind about AFL?", value: newThreadContent, onChange: (e) => setNewThreadContent(e.target.value), required: true }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 71,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o, { type: "submit", mt: "2", children: "Post Anonymously" }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 72,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLForum/ForumThreads.tsx",
        lineNumber: 69,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/AFLForum/ForumThreads.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLForum/ForumThreads.tsx",
      lineNumber: 63,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { direction: "column", gap: "4", children: threads.map((thread) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { onClick: () => toggleThread(thread.id), style: {
        cursor: "pointer"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "4", children: thread.title }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 83,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { justify: "between", align: "center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", color: "gray", children: [
            "Posted by ",
            thread.author,
            " on ",
            thread.date
          ] }, void 0, true, {
            fileName: "app/components/AFLForum/ForumThreads.tsx",
            lineNumber: 85,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", color: "gray", children: [
            thread.comments.length,
            " comments"
          ] }, void 0, true, {
            fileName: "app/components/AFLForum/ForumThreads.tsx",
            lineNumber: 86,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 84,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { mt: "2", children: thread.content }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 88,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLForum/ForumThreads.tsx",
        lineNumber: 80,
        columnNumber: 13
      }, this),
      expandedThread === thread.id && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { mt: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o3, { size: "4", my: "3" }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 92,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "3", mb: "2", children: "Comments" }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 95,
          columnNumber: 17
        }, this),
        thread.comments.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { direction: "column", gap: "3", children: thread.comments.map((comment) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", size: "1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", color: "gray", mb: "1", children: [
            comment.author,
            " \u2022 ",
            comment.date
          ] }, void 0, true, {
            fileName: "app/components/AFLForum/ForumThreads.tsx",
            lineNumber: 98,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: comment.content }, void 0, false, {
            fileName: "app/components/AFLForum/ForumThreads.tsx",
            lineNumber: 101,
            columnNumber: 25
          }, this)
        ] }, comment.id, true, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 97,
          columnNumber: 53
        }, this)) }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 96,
          columnNumber: 47
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { color: "gray", size: "2", mb: "3", children: "No comments yet. Be the first to comment!" }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 103,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { mt: "3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("form", { onSubmit: (e) => {
          e.preventDefault();
          handleNewComment(thread.id, newComments[thread.id] || "");
        }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { direction: "column", gap: "2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r2, { placeholder: "Add your comment...", value: newComments[thread.id] || "", onChange: (e) => setNewComments({
            ...newComments,
            [thread.id]: e.target.value
          }), required: true }, void 0, false, {
            fileName: "app/components/AFLForum/ForumThreads.tsx",
            lineNumber: 112,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o, { type: "submit", size: "2", children: "Comment Anonymously" }, void 0, false, {
            fileName: "app/components/AFLForum/ForumThreads.tsx",
            lineNumber: 116,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 111,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 107,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/components/AFLForum/ForumThreads.tsx",
          lineNumber: 106,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLForum/ForumThreads.tsx",
        lineNumber: 91,
        columnNumber: 46
      }, this)
    ] }, thread.id, true, {
      fileName: "app/components/AFLForum/ForumThreads.tsx",
      lineNumber: 79,
      columnNumber: 32
    }, this)) }, void 0, false, {
      fileName: "app/components/AFLForum/ForumThreads.tsx",
      lineNumber: 78,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLForum/ForumThreads.tsx",
    lineNumber: 59,
    columnNumber: 10
  }, this);
}
_s(ForumThreads, "5hEmf/dnzaNb/6/RDNO+HWjiNDI=");
_c2 = ForumThreads;
var _c2;
$RefreshReg$(_c2, "ForumThreads");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/afl-forum.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\afl-forum.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\afl-forum.tsx"
  );
  import.meta.hot.lastModified = "1747543677779.855";
}
var meta = generateMetaTags({
  title: "AFL Forum | Anonymous Discussion",
  description: "Discuss Australian Football League news, matches, and more - no login required!"
});
function AFLForum() {
  _s2();
  const {
    newsArticles,
    forumThreads
  } = useLoaderData();
  const [activeTab, setActiveTab] = (0, import_react3.useState)("news");
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p4, { size: "2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o2, { size: {
    initial: "2",
    sm: "5"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Header, {}, void 0, false, {
      fileName: "app/routes/afl-forum.tsx",
      lineNumber: 114,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { mt: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(r, { size: "8", align: "center", children: "AFL Forum" }, void 0, false, {
        fileName: "app/routes/afl-forum.tsx",
        lineNumber: 117,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", color: "gray", align: "center", mb: "4", children: "Discuss Australian Football League - No login required!" }, void 0, false, {
        fileName: "app/routes/afl-forum.tsx",
        lineNumber: 118,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/afl-forum.tsx",
      lineNumber: 116,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o3, { size: "4", my: "4" }, void 0, false, {
      fileName: "app/routes/afl-forum.tsx",
      lineNumber: 123,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(tabs_exports.Root, { defaultValue: "news", onValueChange: setActiveTab, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(tabs_exports.List, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(tabs_exports.Trigger, { value: "news", children: "News" }, void 0, false, {
          fileName: "app/routes/afl-forum.tsx",
          lineNumber: 127,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(tabs_exports.Trigger, { value: "forum", children: "Forum Discussions" }, void 0, false, {
          fileName: "app/routes/afl-forum.tsx",
          lineNumber: 128,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/afl-forum.tsx",
        lineNumber: 126,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { pt: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(tabs_exports.Content, { value: "news", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(NewsSection, { articles: newsArticles }, void 0, false, {
          fileName: "app/routes/afl-forum.tsx",
          lineNumber: 133,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/afl-forum.tsx",
          lineNumber: 132,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(tabs_exports.Content, { value: "forum", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(ForumThreads, { threads: forumThreads }, void 0, false, {
          fileName: "app/routes/afl-forum.tsx",
          lineNumber: 137,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/afl-forum.tsx",
          lineNumber: 136,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/afl-forum.tsx",
        lineNumber: 131,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/afl-forum.tsx",
      lineNumber: 125,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o3, { size: "4", my: "6" }, void 0, false, {
      fileName: "app/routes/afl-forum.tsx",
      lineNumber: 142,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(SocialMediaSection, {}, void 0, false, {
      fileName: "app/routes/afl-forum.tsx",
      lineNumber: 143,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/afl-forum.tsx",
    lineNumber: 110,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/afl-forum.tsx",
    lineNumber: 109,
    columnNumber: 10
  }, this);
}
_s2(AFLForum, "2O9ZHR6pAqKhY8hG3piG5RVJ5jI=", false, function() {
  return [useLoaderData];
});
_c3 = AFLForum;
var _c3;
$RefreshReg$(_c3, "AFLForum");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  AFLForum as default,
  meta
};
//# sourceMappingURL=/build/routes/afl-forum-NVRCM7Z4.js.map
