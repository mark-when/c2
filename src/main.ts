import { OneView } from "./oneview/oneview";
import { useLpc } from "@markwhen/view-client";
import { isEventNode, walk2 } from "@markwhen/parser/lib/Noder";
import { Path } from "@markwhen/parser/lib/Types";
import { Node, NodeArray, SomeNode } from "@markwhen/parser/lib/Node";

type ColorMap = Record<string, Record<string, string>>;

function bob() {
  let hovering: Path | undefined;
  let detail: Path | undefined;
  let isDark = false;
  let events: OneView.CalendarEventObject[] = [];
  let colorMap: ColorMap = {};
  let transformed: Node<NodeArray>;

  const eventColor = (node: SomeNode, colorMap: ColorMap) => {
    const ourTags = isEventNode(node)
      ? node.value.eventDescription.tags
      : node.tags;
    // @ts-ignore
    const source = node.source || "default";
    return ourTags ? colorMap?.[source]?.[ourTags[0]] : undefined;
  };

  const redraw = (
    transformed: Node<NodeArray>,
    hovering: Path | undefined,
    hard: boolean = true
  ) => {
    events = [];
    for (const { node, path } of walk2(transformed, [])) {
      if (node && isEventNode(node)) {
        const eventObj = new OneView.CalendarEventObject({
          summary: node.value.eventDescription.eventDescription,
          description: path.join(","),
          location: "",
          startDate: new Date(node.value.dateRangeIso.fromDateTimeIso),
          endDate: new Date(node.value.dateRangeIso.toDateTimeIso),
          calendarId: "Default",
          eventId: path.join(","),
          color: eventColor(node, colorMap),
          isHovered: path.join(",") === hovering?.join(","),
          isDetail: path.join(",") === detail?.join(","),
          mwNode: node,
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
