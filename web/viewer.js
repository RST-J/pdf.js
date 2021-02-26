/* Copyright 2016 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AppOptions } from "./app_options.js";
import { PDFViewerApplication, webViewerInitialized, webViewerOpenFileViaQuery } from "./app.js";

/* eslint-disable-next-line no-unused-vars */
const pdfjsVersion =
  typeof PDFJSDev !== "undefined" ? PDFJSDev.eval("BUNDLE_VERSION") : void 0;
/* eslint-disable-next-line no-unused-vars */
const pdfjsBuild =
  typeof PDFJSDev !== "undefined" ? PDFJSDev.eval("BUNDLE_BUILD") : void 0;

if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("CHROME")) {
  var defaultUrl; // eslint-disable-line no-var

  (function rewriteUrlClosure() {
    // Run this code outside DOMContentLoaded to make sure that the URL
    // is rewritten as soon as possible.
    const queryString = document.location.search.slice(1);
    const m = /(^|&)file=([^&]*)/.exec(queryString);
    defaultUrl = m ? decodeURIComponent(m[2]) : "";

    // Example: chrome-extension://.../http://example.com/file.pdf
    const humanReadableUrl = "/" + defaultUrl + location.hash;
    history.replaceState(history.state, "", humanReadableUrl);
    if (top === window) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage("showPageAction");
    }
  })();
}

if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
  require("./firefoxcom.js");
  require("./firefox_print_service.js");
}
if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("GENERIC")) {
  require("./genericcom.js");
}
if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("CHROME")) {
  require("./chromecom.js");
}
if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("CHROME || GENERIC")) {
  require("./pdf_print_service.js");
}

function getViewerConfiguration() {
  const mainContainer = document.getElementById("viewerContainer");
  const viewerContainer = document.getElementById("viewer");
  const contextFirstPage = document.getElementById("contextFirstPage");
  const contextLastPage = document.getElementById("contextLastPage");
  const contextPageRotateCw = document.getElementById("contextPageRotateCw");
  const contextPageRotateCcw = document.getElementById("contextPageRotateCcw");
  const outerContainer = document.getElementById("outerContainer");
  const toggleButton = document.getElementById("sidebarToggle");
  const thumbnailButton = document.getElementById("viewThumbnail");
  const thumbnailView = document.getElementById("thumbnailView");
  const resizer = document.getElementById("sidebarResizer");
  const container = document.getElementById("errorWrapper");
  const errorMessage = document.getElementById("errorMessage");
  const closeButton = document.getElementById("errorClose");
  const errorMoreInfo = document.getElementById("errorMoreInfo");
  const moreInfoButton = document.getElementById("errorShowMore");
  const lessInfoButton = document.getElementById("errorShowLess");
  const printContainer = document.getElementById("printContainer");
  return {
    appContainer: document.body,
    mainContainer: mainContainer,
    viewerContainer: viewerContainer,
    eventBus: null,
    fullscreen: {
      contextFirstPage: contextFirstPage,
      contextLastPage: contextLastPage,
      contextPageRotateCw: contextPageRotateCw,
      contextPageRotateCcw: contextPageRotateCcw,
    },
    sidebar: {
      // Divs (and sidebar button)
      outerContainer: outerContainer,
      viewerContainer: viewerContainer,
      toggleButton: toggleButton,
      // Buttons
      thumbnailButton: thumbnailButton,
      // Views
      thumbnailView: thumbnailView,
    },
    sidebarResizer: {
      outerContainer: outerContainer,
      resizer: resizer,
    },
    errorWrapper: {
      container: container,
      errorMessage: errorMessage,
      closeButton: closeButton,
      errorMoreInfo: errorMoreInfo,
      moreInfoButton: moreInfoButton,
      lessInfoButton: lessInfoButton,
    },
    printContainer: printContainer,
    openFileInputName: "fileInput",
    debuggerScriptPath: "./debugger.js",
  };
}

if (typeof PDFJSDev === "undefined" || !PDFJSDev.test("PRODUCTION")) {
  Promise.all([
    import("pdfjs-web/genericcom.js"),
    import("pdfjs-web/pdf_print_service.js"),
  ]);
} else {
  if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("CHROME")) {
    AppOptions.set("defaultUrl", defaultUrl);
  }
}

window.PDFViewerApplication = PDFViewerApplication;
window.PDFViewerApplicationOptions = AppOptions;
window.getViewerConfiguration = getViewerConfiguration;
window.webViewerInitialized = webViewerInitialized;

export {
    PDFViewerApplication,
    AppOptions as PDFViewerApplicationOptions,
    getViewerConfiguration,
    webViewerInitialized
};
