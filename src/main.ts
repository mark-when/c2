import { OneView } from "./oneview/oneview";
import { useLpc } from "@markwhen/view-client";

window.populateCalendars = function () {
  OneView.core.populateCalendars();
};
function bob() {
  OneView.core = new OneView.Core();
  OneView.core.init();
  OneView.core.startDrawLoop();
  let isDark = false;

  const { postRequest } = useLpc({
    appState(appState) {
      console.log(appState.isDark, isDark);
      if (appState.isDark !== isDark) {
        isDark = !!appState.isDark;
        OneView.core.commonUserSettings.theme = isDark ? "3" : "0";
        OneView.core.settings.reloadTheme();
        OneView.core.reloadAllCalendarData();
      }
    },
    markwhenState(markwhenState) {},
  });

  postRequest("appState");
  postRequest("markwhenState");
}
window.onload = function () {
  // window.setTimeout(function () {
  //   try {
  bob();
  //   } catch (a) {
  //     console.error(a);
  //   }
  // }, 50);
};
window.onpopstate = function (a) {
  OneView.core &&
    OneView.core.appStateHandler &&
    OneView.core.appStateHandler.back();
};
window.onhashchange = function () {
  OneView.core.eventHandler.closeAllPagesAndMenus();
};
