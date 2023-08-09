import { OneView } from "./oneview/oneview";
import { useLpc } from "@markwhen/view-client";

window.populateCalendars = function () {
  OneView.core.populateCalendars();
};
function bob() {
  OneView.core = new OneView.Core();
  OneView.core.init();
  OneView.core.startDrawLoop();
}
window.onload = function () {
  window.setTimeout(function () {
    try {
      bob();
    } catch (a) {
      window.setTimeout(function () {
        bob();
      }, 3e3);
    }
  }, 50);
};
window.onpopstate = function (a) {
  OneView.core &&
    OneView.core.appStateHandler &&
    OneView.core.appStateHandler.back();
};
window.onhashchange = function () {
  OneView.core.eventHandler.closeAllPagesAndMenus();
};

const { postRequest } = useLpc({
  appState(appState) {
    console.log("appstate", appState);
  },
  markwhenState(markwhenState) {
    
  },
});
