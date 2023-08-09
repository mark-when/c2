import { OneView } from "./oneview/oneview";
import { useLpc } from "@markwhen/view-client";
import { isEventNode, walk2 } from "@markwhen/parser/lib/Noder";

function bob() {
  OneView.core = new OneView.Core();
  OneView.core.init();
  OneView.core.startDrawLoop();
  let isDark = false;

  const { postRequest } = useLpc({
    appState(appState) {
      if (appState.isDark !== isDark) {
        isDark = !!appState.isDark;
        OneView.core.commonUserSettings.theme = isDark ? "3" : "0";
        OneView.core.settings.reloadTheme();
        OneView.core.redraw(false)
      }
    },
    markwhenState(markwhenState) {
      OneView.core.calendarEventHandler.clearAllEvents();
      OneView.core.calendars = [
        new OneView.CalendarObject(
          "Default",
          "default",
          [],
          0,
          OneView.VisibilityType.Visible,
          true,
          true
        ),
      ];
      OneView.core.calendarPrimaryId = "Default";
      OneView.core.getCalendar("Default").allEventsAreFullDay = false;
      const events = [];
      for (const { node, path } of walk2(markwhenState.transformed, [])) {
        if (node && isEventNode(node)) {
          const eventObj = new OneView.CalendarEventObject(
            node.value.eventDescription.eventDescription,
            path.join(","),
            "",
            new Date(node.value.dateRangeIso.fromDateTimeIso),
            new Date(node.value.dateRangeIso.toDateTimeIso),
            "Default",
            path.join(",")
          );
          events.push(eventObj);
        }
      }
      OneView.core.calendarEventHandler.gradeCalendarEvents(events);
      events.sort(function (a, b) {
        return a.startZOP - b.startZOP;
      });
      events.forEach(e => OneView.core.calendarEventHandler.addEventToCalendar(e));
      OneView.core.calendarEventHandler.findCommonTimes();
      OneView.core.redraw(true);
    },
  });

  postRequest("appState");
  postRequest("markwhenState");
}
window.onload = function () {
  window.setTimeout(function () {
    try {
      bob();
    } catch (a) {
      console.error(a);
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
