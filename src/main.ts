import { OneView } from "./oneview/oneview";
import { useLpc } from "@markwhen/view-client";
import { isEventNode, walk2 } from "@markwhen/parser/lib/Noder";
import { Path } from "@markwhen/parser/lib/Types";

function bob() {

  let hovering: Path | undefined;
  let isDark = false;
  let events: OneView.CalendarEventObject[] = [];

  const redraw = (
    events: OneView.CalendarEventObject[],
    hovering: Path | undefined
  ) => {
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
    OneView.core.calendarEventHandler.gradeCalendarEvents(events);
    events.sort(function (a, b) {
      return a.startZOP - b.startZOP;
    });
    events.forEach((e) => {
      e.hovering = e.eventId === hovering?.join(",");
      OneView.core.calendarEventHandler.addEventToCalendar(e);
    });
    OneView.core.calendarEventHandler.findCommonTimes();
    OneView.core.redraw(true);
  };

  const { postRequest } = useLpc({
    appState(appState) {
      if (appState.isDark !== isDark) {
        isDark = !!appState.isDark;
        OneView.core.commonUserSettings.theme = isDark ? "3" : "0";
        OneView.core.settings.reloadTheme();
        OneView.core.redraw(false);
      }
      if (
        (!appState.hoveringPath && !hovering) ||
        appState.hoveringPath?.join(",") === hovering?.join(",")
      ) {
        // do nothing, they are equivalent
      } else {
        hovering = appState.hoveringPath;
        redraw(events, hovering);
      }
    },
    markwhenState(markwhenState) {
      events = [];
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
      redraw(events, hovering);
    },
  });

  OneView.core = new OneView.Core(postRequest);
  OneView.core.init();
  OneView.core.startDrawLoop();

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