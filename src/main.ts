import { OneView } from "./oneview/oneview";
import { useLpc, MarkwhenState, Sourced } from "@markwhen/view-client";
import { isEvent, iter, Eventy, Event, EventGroup } from "@markwhen/parser";
import { Path } from "@markwhen/parser";

type ColorMap = Record<string, Record<string, string>>;

function bob() {
  let hovering: Path | undefined;
  let detail: Path | undefined;
  let isDark = false;
  let events: OneView.CalendarEventObject[] = [];
  let colorMap: ColorMap = {};
  let transformed: EventGroup;

  const eventColor = (node: Sourced<Eventy>, colorMap: ColorMap) => {
    const ourTags = node.tags;
    const source = node.source || "default";
    return ourTags ? colorMap?.[source]?.[ourTags[0]] : undefined;
  };

  const redraw = (
    transformed: EventGroup,
    hovering: Path | undefined,
    hard: boolean = true
  ) => {
    events = [];
    for (const { eventy, path } of iter(transformed)) {
      if (eventy && isEvent(eventy)) {
        const eventObj = new OneView.CalendarEventObject({
          summary: eventy.firstLine.restTrimmed,
          description: path.join(","),
          location: "",
          startDate: new Date(eventy.dateRangeIso.fromDateTimeIso),
          endDate: new Date(eventy.dateRangeIso.toDateTimeIso),
          calendarId: "Default",
          eventId: path.join(","),
          color: eventColor(eventy, colorMap),
          isHovered: path.join(",") === hovering?.join(","),
          isDetail: path.join(",") === detail?.join(","),
          mwNode: eventy,
        });
        events.push(eventObj);
      }
    }
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
      OneView.core.calendarEventHandler.addEventToCalendar(e);
    });
    OneView.core.calendarEventHandler.findCommonTimes();
    OneView.core.redraw(hard);
  };

  const { postRequest } = useLpc({
    appState(appState) {
      if (appState.isDark !== isDark) {
        isDark = !!appState.isDark;
        OneView.core.commonUserSettings.theme = isDark ? "3" : "0";
        OneView.core.settings.reloadTheme();
      }
      hovering = appState.hoveringPath;
      colorMap = appState.colorMap;
      detail = appState.detailPath;
      redraw(transformed, hovering);
    },
    markwhenState(markwhenState) {
      transformed = markwhenState.transformed!;
      redraw(transformed, hovering);
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
