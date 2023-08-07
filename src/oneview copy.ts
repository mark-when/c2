var oneview9;
(function (a) {
  var p;
  (function (a) {
    function b() {
      document.addEventListener("pause", c, false);
      document.addEventListener("resume", e, false);
      document.addEventListener("menubutton", f, false);
    }
    function c() {}
    function e() {}
    function f() {
      OneView.core &&
        OneView.core.appStateHandler &&
        OneView.core.appStateHandler.showMainMenu(true);
    }
    a.initialize = function () {
      document.addEventListener("deviceready", b, false);
    };
  })((p = a.Application || (a.Application = {})));
  window.onload = function () {
    p.initialize();
  };
})(oneview9 || (oneview9 = {}));

namespace OneView {
  // LocalStorage class
  export class LocalStorage {
    constructor(readonly calendarEvents = []) {}

    dateTimeReviver(key: string, value: any) {
      if (
        typeof value === "string" &&
        key.length > 4 &&
        (key.substr(key.length - 4) === "Date" ||
          key.substr(key.length - 4) === "Time")
      ) {
        return new Date(value);
      }
      return value;
    }

    localStorageSetItem(key: string, value: any) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {}
    }
  }

  export class CommonUserSettings extends LocalStorage {
    cachedTimeZoneDiffInMinutes = undefined;
    cachedGrayDays: string | undefined = undefined;
    cachedSavedCalendarColors = undefined;
    cachedFirstDayOfWeek = undefined;
    defaultUseWeek = false;
    defaultUse24hFormat = false;

    constructor() {
      super();
    }

    get calendarIdLastAddedTo() {
      var a = localStorage.getItem("oneview_settings_lastCalendarId");
      if (void 0 !== a && null !== a) return JSON.parse(a);
    }
    set calendarIdLastAddedTo(a) {
      this.localStorageSetItem(
        "oneview_settings_lastCalendarId",
        JSON.stringify(a)
      );
    }

    get hasShownRemindersInfo() {
      return this.getBoolean("oneview_settings_hasShownRemindersInfo", false);
    }

    set hasShownRemindersInfo(a) {
      this.localStorageSetItem(
        "oneview_settings_hasShownRemindersInfo",
        JSON.stringify(a)
      );
    }

    getDefaultUse24hFormat() {
      return void 0 !== this.defaultUse24hFormat &&
        null !== this.defaultUse24hFormat
        ? this.defaultUse24hFormat
        : (this.defaultUse24hFormat = !(
            0 < moment().format("LT").indexOf(moment().format("A")) &&
            0 < moment().format("A").length
          ));
    }

    getDefaultUseWeek() {
      if (void 0 !== this.defaultUseWeek && null !== this.defaultUseWeek)
        return this.defaultUseWeek;
      var a =
        "AT AX BE CH CZ DE DK EE ES EU FI FO FR GB GL GR IE IM IS IT LI LU LV NL NO PL PT SE SJ".split(
          " "
        );
      this.defaultUseWeek = false;
      for (var b = 0; b < a.length; b++)
        -1 < navigator.language.toUpperCase().indexOf(a[b]) &&
          (this.defaultUseWeek = true);
      return this.defaultUseWeek;
    }

    get showWeekNumbers() {
      return this.getBoolean(
        "oneview_settings_showWeekNumbers",
        this.getDefaultUseWeek()
      );
    }

    set showWeekNumbers(a) {
      this.localStorageSetItem(
        "oneview_settings_showWeekNumbers",
        JSON.stringify(a)
      );
    }

    get use24hFormat() {
      return this.getBoolean(
        "oneview_settings_use24hFormat",
        this.getDefaultUse24hFormat()
      );
    }

    set use24hFormat(a) {
      this.localStorageSetItem(
        "oneview_settings_use24hFormat",
        JSON.stringify(a)
      );
    }

    get timeZoneForSettingsPage() {
      return this.getString("oneview_settings_timeZone", "-");
    }

    set timeZoneForSettingsPage(a) {
      this.cachedTimeZoneDiffInMinutes = void 0;
      this.localStorageSetItem("oneview_settings_timeZone", JSON.stringify(a));
    }

    get dataAmountToLoad() {
      return this.getNumber("oneview_settings_dataAmountToLoad", 48, false);
    }

    set dataAmountToLoad(a) {
      this.localStorageSetItem(
        "oneview_settings_dataAmountToLoad",
        JSON.stringify(a)
      );
    }

    get language() {
      var b;
      b = moment.locale();
      OneView.Translate.languageExists(b) || (b = "-");
      return this.getString("oneview_settings_language", b);
    }

    set language(a) {
      this.localStorageSetItem("oneview_settings_language", JSON.stringify(a));
      this.updateAppWithLang();
    }

    updateAppWithLang() {
      var b = this.language;
      if ("" === b || "-" == b) b = navigator.language;
      moment.locale(b);
      OneView.core.translate = new OneView.Translate(b);
      OneView.core.helper.monthesShort = new OneView.Hashtable();
      OneView.core.helper.monthesLong = new OneView.Hashtable();
      OneView.core.helper.weekdayShort = new OneView.Hashtable();
      OneView.core.helper.weekdayLong = new OneView.Hashtable();
    }

    get theme() {
      return this.getString("oneview_settings_theme", "0");
    }

    set theme(a) {
      this.localStorageSetItem("oneview_settings_theme", JSON.stringify(a));
    }

    get licenseDarkTheme() {
      return this.getBoolean("oneview_settings_licenceDarkTheme", false);
    }

    set licenseDarkTheme(a) {
      this.localStorageSetItem(
        "oneview_settings_licenceDarkTheme",
        JSON.stringify(a)
      );
    }

    get licenseCandyTheme() {
      return this.getBoolean("oneview_settings_licenceCandyTheme", false);
    }

    set licenseCandyTheme(a) {
      this.localStorageSetItem(
        "oneview_settings_licenceCandyTheme",
        JSON.stringify(a)
      );
    }

    get licenseColorPicker() {
      return this.getBoolean("oneview_settings_licenceColorPicker", false);
    }

    set licenseColorPicker(a) {
      this.localStorageSetItem(
        "oneview_settings_licenceColorPicker",
        JSON.stringify(a)
      );
    }

    get firstDayOfWeek() {
      if (void 0 == this.cachedFirstDayOfWeek) {
        var a = moment().startOf("week").isoWeekday();
        this.cachedFirstDayOfWeek = this.correctWeekDayNumber(
          Number(this.getString("oneview_settings_firstDayOfWeek", "" + a))
        );
      }
      return this.cachedFirstDayOfWeek;
    }

    set firstDayOfWeek(a) {
      this.cachedFirstDayOfWeek = void 0;
      this.localStorageSetItem(
        "oneview_settings_firstDayOfWeek",
        JSON.stringify(this.correctWeekDayNumber(a))
      );
    }

    get savedCalendarColors() {
      if (void 0 == this.cachedSavedCalendarColors) {
        var b = JSON.stringify(new OneView.Dictionary());
        this.cachedSavedCalendarColors = new OneView.Dictionary();
        b = JSON.parse(
          this.getObjectData("oneview_saved_calendar_colors", "" + b)
        );
        this.cachedSavedCalendarColors.setup(b._keys, b._values);
      }
      return this.cachedSavedCalendarColors;
    }

    set savedCalendarColors(a) {
      this.cachedSavedCalendarColors = void 0;
      OneView.syncArrays();
      this.localStorageSetItem(
        "oneview_saved_calendar_colors",
        JSON.stringify(a)
      );
    }

    get grayDays() {
      void 0 == this.cachedGrayDays &&
        (this.cachedGrayDays = (
          this.getString("oneview_settings_grayDays", "67") + ""
        ).replace("0", "7"));
      return this.cachedGrayDays;
    }
    set grayDays(a) {
      this.cachedGrayDays = void 0;
      this.localStorageSetItem(
        "oneview_settings_grayDays",
        JSON.stringify(a.replace("0", "7"))
      );
    }

    getCachedTimeZoneDiffInMinutes() {
      if (void 0 == this.cachedTimeZoneDiffInMinutes) {
        var a = this.timeZoneForSettingsPage;
        return void 0 == a || "-" == a
          ? 0
          : 60 * Number(a) + new Date().getTimezoneOffset();
      }
      return this.cachedTimeZoneDiffInMinutes;
    }

    getBoolean(a, b) {
      var c = localStorage.getItem(a);
      return void 0 !== c && null !== c ? JSON.parse(c) : b;
    }
    getObjectData(a, b) {
      var c = localStorage.getItem(a);
      return void 0 !== c && null !== c ? c : b;
    }
    getString(a, b) {
      var c = localStorage.getItem(a);
      return void 0 !== c && null !== c ? JSON.parse(c) : b;
    }
    getNumber(a, b, f) {
      a = localStorage.getItem(a);
      void 0 !== a && null !== a && (a = JSON.parse(a));
      return void 0 !== a && null !== a ? (f || 0 != a ? a : b) : b;
    }
    correctWeekDayNumber(a) {
      for (; 1 > a; ) a += 7;
      for (; 7 < a; ) a -= 7;
      return a;
    }
  }
  export class DrawArea {
    previousFont = "";
    canvasCache = new OneView.SpeedCache();

    debugText(b) {
      OneView.core.zopDrawArea.canvasContext.fillStyle = "#FF0000";
      this.setFont(20);
      OneView.core.zopDrawArea.canvasContext.fillText(b, 5, 30);
    }
    drawIcon(a, c, e, f, g) {
      var b = this;
      if (!(this.loadingIconNames && 0 <= this.loadingIconNames.indexOf(a)))
        if (
          ((c = Math.floor(c)),
          (e = Math.floor(e)),
          (f = Math.floor(f)),
          (g = Math.floor(g)),
          this.loadedIconNames && 0 <= this.loadedIconNames.indexOf(a))
        )
          this.drawPicture(
            this.loadedIcons[this.loadedIconNames.indexOf(a)],
            c,
            e,
            f,
            g
          );
        else {
          this.loadingIconNames || (this.loadingIconNames = []);
          this.loadingIconNames.push(a);
          var d = new Image();
          d.onload = function () {
            setTimeout(function () {
              b.loadIcon(a, d, c, e, f, g);
            }, 1);
          };
          d.src = "images/" + a + ".svg";
        }
    }
    loadIcon(a, c, e, f, g, d) {
      this.drawPicture(c, e, f, g, d);
      this.loadingIconNames.splice(this.loadingIconNames.indexOf(a), 1);
      this.loadedIconNames || (this.loadedIconNames = []);
      this.loadedIcons || (this.loadedIcons = []);
      this.loadedIconNames.push(a);
      this.loadedIcons.push(c);
    }
    drawLoader(b) {
      var c =
          Math.min(
            OneView.core.zopDrawArea.zopAreaWidth,
            OneView.core.zopDrawArea.zopAreaHeight
          ) / 32,
        e = OneView.core.zopDrawArea.zopAreaWidth / 2,
        f = OneView.core.zopDrawArea.zopAreaHeight / 2;
      OneView.core.zopDrawArea.canvasContext.strokeStyle =
        OneView.core.settings.theme.colorDark;
      OneView.core.zopDrawArea.canvasContext.lineWidth = Math.max(
        c / 2,
        c / 6 + 12
      );
      OneView.core.zopDrawArea.canvasContext.lineCap = "butt";
      OneView.core.zopDrawArea.canvasContext.beginPath();
      OneView.core.zopDrawArea.canvasContext.arc(e, f, c, b, b + 2.5);
      OneView.core.zopDrawArea.canvasContext.stroke();
    }
    drawPicture(b, c, e, f, g) {
      c = Math.floor(c);
      e = Math.floor(e);
      f = Math.floor(f);
      g = Math.floor(g);
      OneView.core.zopDrawArea.canvasContext.drawImage(b, c, e, f, g);
    }
    drawPictureWithOffset(b, c, e, f, g, d, n) {
      c = Math.floor(c);
      e = Math.floor(e);
      f = Math.floor(f);
      g = Math.floor(g);
      OneView.core.zopDrawArea.canvasContext.drawImage(
        b,
        d,
        n,
        f,
        g,
        c,
        e,
        f,
        g
      );
    }
    drawFilledRectangle(b, c, e, f, g, d) {
      OneView.core.zopDrawArea.setShadow(d);
      OneView.core.zopDrawArea.canvasContext.fillStyle = g;
      OneView.core.zopDrawArea.canvasContext.fillRect(
        Math.floor(b),
        Math.floor(c),
        Math.floor(e),
        Math.floor(f)
      );
      OneView.core.zopDrawArea.removeShadow(d);
    }
    setFont(b, c, e, f) {
      void 0 === c && (c = false);
      void 0 === e && (e = false);
      void 0 === f && (f = false);
      c
        ? ((c = b + "px " + OneView.core.settings.theme.titleBarFont),
          f && (c = b + "px " + OneView.core.settings.theme.titleBarFontBold),
          e && (c = b + "px " + OneView.core.settings.theme.textFont))
        : (c = f
            ? b + "px " + OneView.core.settings.theme.textFontBold
            : e
            ? b + "px " + OneView.core.settings.theme.textFontThin
            : b + "px " + OneView.core.settings.theme.textFont);
      OneView.core.zopDrawArea.canvasContext.font !== c &&
        (OneView.core.zopDrawArea.canvasContext.font = c);
    }
    drawTriangle(b, c, e, f, g, d, n, l) {
      OneView.core.zopDrawArea.setShadow(l);
      f = c + f;
      d = c + d;
      OneView.core.zopDrawArea.canvasContext.fillStyle = n;
      OneView.core.zopDrawArea.canvasContext.beginPath();
      OneView.core.zopDrawArea.canvasContext.moveTo(b, c);
      OneView.core.zopDrawArea.canvasContext.lineTo(b + e, f);
      OneView.core.zopDrawArea.canvasContext.lineTo(b + g, d);
      OneView.core.zopDrawArea.canvasContext.closePath();
      OneView.core.zopDrawArea.canvasContext.fill();
      OneView.core.zopDrawArea.removeShadow(l);
    }
    drawLine2(a, c, e, f, g, d, n) {
      this.drawLine(a, c, e - a, f - c, g, d, n);
    }
    startLines(b, c, e, f) {
      OneView.core.zopDrawArea.canvasContext.beginPath();
      OneView.core.zopDrawArea.canvasContext.lineWidth = e;
      OneView.core.zopDrawArea.canvasContext.moveTo(b, c);
      OneView.core.zopDrawArea.canvasContext.strokeStyle = f;
      OneView.core.zopDrawArea.canvasContext.lineCap = "round";
      OneView.core.zopDrawArea.canvasContext.lineJoin = "round";
    }
    continueLines(b, c) {
      OneView.core.zopDrawArea.canvasContext.lineTo(b, c);
    }
    endLines() {
      OneView.core.zopDrawArea.canvasContext.stroke();
    }
    drawLine(b, c, e, f, g, d, n) {
      OneView.core.zopDrawArea.setShadow(n);
      f = c + f;
      OneView.core.zopDrawArea.canvasContext.beginPath();
      OneView.core.zopDrawArea.canvasContext.lineCap = "square";
      OneView.core.zopDrawArea.canvasContext.lineWidth = g;
      OneView.core.zopDrawArea.canvasContext.moveTo(b, c);
      OneView.core.zopDrawArea.canvasContext.lineTo(b + e, f);
      OneView.core.zopDrawArea.canvasContext.strokeStyle = d;
      OneView.core.zopDrawArea.canvasContext.stroke();
      OneView.core.zopDrawArea.removeShadow(n);
    }
    drawHorizontalLineNotZOP(b, c, e, f, g, d) {
      OneView.core.zopDrawArea.setShadow(d);
      c = Math.floor(c);
      OneView.core.zopDrawArea.canvasContext.beginPath();
      OneView.core.zopDrawArea.canvasContext.lineWidth = g;
      OneView.core.zopDrawArea.canvasContext.lineCap = "square";
      OneView.core.zopDrawArea.canvasContext.moveTo(b, c);
      OneView.core.zopDrawArea.canvasContext.lineTo(b + e, c);
      OneView.core.zopDrawArea.canvasContext.strokeStyle = f;
      OneView.core.zopDrawArea.canvasContext.stroke();
      OneView.core.zopDrawArea.removeShadow(d);
    }
    drawVerticalLineNotZOP(b, c, e, f, g) {
      b = Math.floor(b) + 0.5;
      OneView.core.zopDrawArea.canvasContext.beginPath();
      OneView.core.zopDrawArea.canvasContext.lineWidth = g;
      OneView.core.zopDrawArea.canvasContext.lineCap = "square";
      OneView.core.zopDrawArea.canvasContext.moveTo(b, c);
      OneView.core.zopDrawArea.canvasContext.lineTo(b, e);
      OneView.core.zopDrawArea.canvasContext.strokeStyle = f;
      OneView.core.zopDrawArea.canvasContext.stroke();
    }
    drawCenteredText(b, c, e, f, g, d, n, l, h) {
      void 0 === h && (h = false);
      for (
        n = Math.max(
          0,
          (f - OneView.core.zopDrawArea.measureTextWidth(b, g, l, false)) / 2
        );
        OneView.core.zopDrawArea.measureTextWidth(b, g, l, false) > f;

      )
        b = b.substring(0, b.length - 1);
      OneView.core.drawArea.drawText(b, c + n, e, g, d, false, l, h, false);
    }
    startNewRound() {
      this.canvasCache.startNewRound();
    }
    drawText(b, c, e, f, g, d, n, l, h) {
      void 0 === l && (l = false);
      void 0 === h && (h = false);
      this.setFont(f, n, l, h);
      OneView.core.zopDrawArea.canvasContext.fillStyle = g;
      OneView.core.zopDrawArea.canvasContext.fillText(
        b,
        Math.floor(c) + 0.45,
        Math.floor(e + f) + 0.45
      );
    }
  }

  export class DrawAreaEffects {
    preparingScrollCounter = 0;
    previousScrollSpeed = 0;
    scrollSpeed = 0;
    speedSlowDown = 0.013;

    azGoalTopZOP: any;
    azGoalBottomZOP: any;
    speedModifier: any;
    megaSlowZoom: any;

    startAutoZoom(b, c, e, f) {
      this.azGoalTopZOP = b;
      this.azGoalBottomZOP = c;
      this.speedModifier = (this.megaSlowZoom = e) ? 4e6 : 6e3;
      this.azTopZOPSpeed = this.getAzTopZopSpeed();
      this.azBottomZOPSpeed = this.getAzBottomZopSpeed();
      this.azTopZOPSpeed_Linear =
        this.azGoalTopZOP > OneView.core.zopHandler.topZOP
          ? this.azTopZOPSpeed / 2e3
          : this.azTopZOPSpeed / 20;
      this.azBottomZOPSpeed_Linear =
        this.azGoalBottomZOP < OneView.core.zopHandler.bottomZOP
          ? this.azBottomZOPSpeed / 3e3
          : this.azBottomZOPSpeed / 20;
      this.azLastZoomTime = OneView.core.getTimeStamp();
      this.azRunning = true;
      this.azCallBack = f;
      OneView.core.redraw(false);
    }
    runAutoZoom() {
      if (!this.azRunning) return false;
      var b = OneView.core.getTimeStamp() - this.azLastZoomTime;
      if (0 === b) return false;
      var c = OneView.core.zopHandler.topZOP + this.azTopZOPSpeed * b;
      if (
        (0 <= this.azTopZOPSpeed && c > this.azGoalTopZOP) ||
        (0 > this.azTopZOPSpeed && c < this.azGoalTopZOP)
      )
        (c = this.azGoalTopZOP), (this.azTopZOPSpeed = 0);
      b = OneView.core.zopHandler.bottomZOP + this.azBottomZOPSpeed * b;
      if (
        (0 <= this.azBottomZOPSpeed && b > this.azGoalBottomZOP) ||
        (0 > this.azBottomZOPSpeed && b < this.azGoalBottomZOP)
      )
        (b = this.azGoalBottomZOP), (this.azBottomZOPSpeed = 0);
      OneView.core.zopHandler.setZoom(
        c,
        b,
        OneView.core.zopHandler.topPixel,
        OneView.core.zopHandler.bottomPixel
      );
      if (0 == this.azTopZOPSpeed && 0 == this.azBottomZOPSpeed)
        return this.stopAutoZoom(), false;
      this.megaSlowZoom
        ? ((this.azTopZOPSpeed = this.getAzTopZopSpeed() / 2),
          (this.azBottomZOPSpeed = this.getAzBottomZopSpeed() / 2))
        : ((this.azTopZOPSpeed =
            (this.getAzTopZopSpeed() + this.azTopZOPSpeed_Linear) / 2),
          (this.azBottomZOPSpeed =
            (this.getAzBottomZopSpeed() + this.azBottomZOPSpeed_Linear) / 2));
      return true;
    }
    getAzTopZopSpeed() {
      return (
        (this.azGoalTopZOP - OneView.core.zopHandler.topZOP) /
        this.speedModifier
      );
    }
    getAzBottomZopSpeed() {
      return (
        (this.azGoalBottomZOP - OneView.core.zopHandler.bottomZOP) /
        this.speedModifier
      );
    }
    runEffects() {
      return this.runAutoScroll() || this.runAutoZoom();
    }
    prepareAutoScroll(b, c) {
      void 0 === c && (c = 0);
      var e = OneView.core.getTimeStamp(),
        f = e - this.lastScrollTime;
      f <= c ||
        ((this.previousScrollSpeed = this.scrollSpeed),
        1 < this.preparingScrollCounter
          ? ((this.scrollSpeed = (b - this.lastScrollYPixel) / f),
            this.scrollSpeed > OneView.core.zopHandler.maxScrollSpeed &&
              (this.scrollSpeed = OneView.core.zopHandler.maxScrollSpeed),
            this.scrollSpeed < -OneView.core.zopHandler.maxScrollSpeed &&
              (this.scrollSpeed = -OneView.core.zopHandler.maxScrollSpeed))
          : (this.scrollSpeed = 0),
        this.preparingScrollCounter++,
        (this.lastScrollTime = e),
        (this.lastScrollYPixel = b));
    }
    startAutoScroll(b) {
      OneView.core.zopHandler.startScroll(b);
      0 != this.previousScrollSpeed &&
        0 != this.scrollSpeed &&
        (this.scrollSpeed =
          ((this.scrollSpeed + this.previousScrollSpeed) / 2) * 1.2);
      this.preparingScrollCounter = this.previousScrollSpeed = 0;
    }
    runAutoScroll() {
      if (0 != this.scrollSpeed && 0 === this.preparingScrollCounter) {
        var b = OneView.core.getTimeStamp(),
          c = b - this.lastScrollTime;
        if (0 === c) return false;
        var e = this.lastScrollYPixel + this.scrollSpeed * c;
        this.lastScrollYPixel = e;
        this.lastScrollTime = b;
        OneView.core.zopHandler.continueScroll(e);
        OneView.core.zopHandler.endScroll();
        OneView.core.zopHandler.startScroll(e);
        this.speedSlowDown =
          (c * OneView.core.zopHandler.maxScrollSpeed) / 2200;
        this.scrollSpeed =
          this.scrollSpeed > 2 * this.speedSlowDown
            ? this.scrollSpeed - this.speedSlowDown
            : this.scrollSpeed < 2 * -this.speedSlowDown
            ? this.scrollSpeed + this.speedSlowDown
            : 0;
        0 === this.scrollSpeed && OneView.core.zopHandler.endScroll();
        return true;
      }
      return false;
    }
    isScrollingOrZooming() {
      return 1 < this.scrollSpeed || true === this.azRunning;
    }
    stopAllEffects() {
      this.previousScrollSpeed = this.scrollSpeed = 0;
      OneView.core.zopHandler.endScroll();
      this.stopAutoZoom();
      OneView.core.redraw(false);
    }
    stopAutoZoom() {
      this.azRunning = false;
      this.azBottomZOPSpeed = this.azTopZOPSpeed = 0;
      this.azCallBack && (this.azCallBack(), (this.azCallBack = void 0));
      OneView.core.redraw(false);
    }
  }

  export class CalendarsControl {
    pageHtml =
      '<div id="noColorPickerWindow" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItem" style="text-align:center">{#Color picker?#}</div>    <div>        <button id="gotoShopCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>        <button id="gotoShopOk" class="topBarButton" style="width:50%"><img src="images/shop.svg" class="topBarImage"/><span>{#Shop#}</span></button>    </div></div></div></div><div id="calendarsTopBar" class="topBar">    <button id="calendarsBack" class="topBarButton" style="width:50%"><img src="images/arrow-left.svg" class="topBarImage"/></span><span>{#Back#}</span></button>    <button id="emptyButton" class="topBarButton" style="width:50%"></button>    <div id="calendarsTitle" class="topBarTitle" style="width:100%">{#Calendars#}</div></div><div id="calendarsArea" class="pageContent">    <ul class="calendarsPopupList" id="calendarsPopupList"></ul></div>';
    visibilitySettings = [];

    show() {
      OneView.core.domHandler.hideCanvas();
      this.timestamp = OneView.core.getTimeStamp();
      OneView.core.calendarDataProxy.analyticsPage("Calendars page");
      this.calendarsPage = OneView.core.domHandler.pageHtmlFormatHelper(
        "calendarsPage",
        this.pageHtml
      );
      this.calendarsPage.style.display = "block";
      OneView.core.domHandler.resizeDomElements();
      OneView.core.domHandler.resizeDomElements();
      OneView.core.domHandler.resizeDomElements =
        OneView.core.domHandler.resizeDomElements.bind(OneView.core.domHandler);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 0);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 100);
      var b = (OneView.core.settings.titleWidth / OneView.core.ratio - 24) / 2;
      document.getElementById("calendarsBack").style.padding = b + "px";
      document.getElementById("emptyButton").style.padding =
        OneView.core.settings.titleWidth / OneView.core.ratio / 2 + 1 + "px";
      document.getElementById("calendarsArea").style.top = "54px";
      OneView.core.showBackButtons()
        ? (OneView.core.domHandler.addClickEvent(
            "calendarsBack",
            this.calendarsBack,
            this
          ),
          (document.getElementById("calendarsTitle").style.display = "none"))
        : ((document.getElementById("calendarsBack").style.display = "none"),
          (document.getElementById("emptyButton").style.display = "none"));
      this.visibilitySettings = [];
      for (b = 0; b < OneView.core.calendars.length; b++)
        this.visibilitySettings.push(
          new d(
            OneView.core.calendars[b].id,
            OneView.core.calendars[b].visibility
          )
        );
      for (
        var e = document.getElementById("calendarsPopupList");
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      this.liElements = [];
      this.checkBoxElements = [];
      this.spanElements = [];
      this.colorBoxElements = [];
      for (b = 0; b < OneView.core.calendars.length; b++) {
        var f = document.createElement("li"),
          g = document.createTextNode(OneView.core.calendars[b].name),
          m = document.createElement("span");
        this.liElements.push(f);
        var n = document.createElement("img");
        n.id = "checkbox" + b;
        n.style.height = "24px";
        n.style.paddingTop = "6px";
        n.style.paddingRight = "12px";
        n.style.paddingBottom = "6px";
        n.style.verticalAlign = "top";
        f.appendChild(n);
        this.checkBoxElements.push(n);
        var l = document.createElement("span");
        l.id = "span" + b;
        l.className = "textInList";
        l.style.maxWidth =
          OneView.core.domHandler.screenWidthForDOM - 130 + "px";
        l.appendChild(g);
        f.appendChild(l);
        this.spanElements.push(l);
        this.colorBoxElements.push(m);
        m.className = "colorBox";
        m.id = "colorBox" + b;
        m.style.cssFloat = "right";
        f.appendChild(m);
        this.styleBasedOnVisibility(f, n, m, OneView.core.calendars[b], null);
        if (OneView.core.commonUserSettings.licenceColorPicker) {
          g = document.createElement("div");
          g.id = "colorPicker" + b;
          f.appendChild(g);
          n = new Piklor();
          n.init(
            g,
            OneView.core.settings.theme.eventColors,
            {
              open: m,
              closeOnBlur: false,
            },
            "" + b
          );
          var h = this;
          n.colorChosen(function (b, c) {
            var e = +c,
              f = OneView.core.settings.theme.eventColors.indexOf(b);
            document.getElementById("colorBox" + e);
            var g = OneView.core.commonUserSettings.savedCalendarColors;
            OneView.core.commonUserSettings.savedCalendarColors.containsKey(
              OneView.core.calendars[e].id
            )
              ? (g[OneView.core.calendars[e].id] = f)
              : g.add(OneView.core.calendars[e].id, f);
            OneView.core.commonUserSettings.savedCalendarColors = g;
            OneView.core.calendars[e].colorId = f;
            OneView.core.calendars[e].visibility =
              OneView.VisibilityType.Visible;
            OneView.core.calendarDataProxy.saveSettings();
            h.styleBasedOnVisibility(
              h.liElements[e],
              h.checkBoxElements[e],
              h.colorBoxElements[e],
              OneView.core.calendars[e],
              null
            );
          });
        } else
          (this.showNoColorPickerWindow =
            this.showNoColorPickerWindow.bind(this)),
            m.addEventListener("click", this.showNoColorPickerWindow, false);
        f.id = "calendarsPopupList" + b;
        e.appendChild(f);
        OneView.core.domHandler.addClickEvent(f.id, this.calendarClicked, this);
      }
    }
    showNoColorPickerWindow() {
      document.getElementById("noColorPickerWindow").style.display = "table";
      OneView.core.domHandler.addClickEvent("gotoShopOk", this.gotoShop, this);
      OneView.core.domHandler.addClickEvent(
        "gotoShopCancel",
        this.hideNoColorPickerWindow,
        this
      );
    }
    hideNoColorPickerWindow() {
      document.getElementById("noColorPickerWindow").style.display = "none";
    }
    gotoShop() {
      OneView.core.appStateHandler.viewShop();
    }
    hide() {
      OneView.core.appStateHandler.calendarsControlIsShowing = false;
      for (var b = 0; b < OneView.core.calendars.length; b++)
        this.visibilitySettings[b].newVisibility =
          OneView.core.calendars[b].visibility;
      OneView.core.calendarDataProxy.persistCalendarsVisibilitySettings(
        this.visibilitySettings
      );
      OneView.core.domHandler.showCanvas();
      OneView.core.domHandler.removeElement(this.calendarsPage.id);
    }
    reshow() {
      this.show();
    }
    styleBasedOnVisibility(b, e, f, g, d) {
      b.style.backgroundColor = OneView.core.settings.theme.colorBackground;
      d = OneView.core.helper.getEventColor(d, g);
      f.style.backgroundColor = d;
      f.style.borderColor = d;
      g.visibility == OneView.VisibilityType.Visible
        ? ((e.src = "images/checkbox-checked.svg"),
          (b.style.color = OneView.core.settings.theme.colorHorizontalTitle))
        : ((e.src = "images/checkbox-unchecked.svg"),
          (b.style.color = OneView.core.helper.colorToRGBA(
            OneView.core.settings.theme.colorHorizontalTitle,
            0.5
          )));
    }
    getEventTarget(a) {
      a = a || window.event;
      return a.target || a.srcElement;
    }
    calendarClicked(b) {
      b.preventDefault();
      var c = OneView.core.getTimeStamp();
      (this.lastClickTime && this.lastClickTime + 250 > c) ||
        ((this.lastClickTime = c),
        (b = this.getEventTarget(b)),
        (c = this.liElements.indexOf(b)),
        0 > c && (c = this.checkBoxElements.indexOf(b)),
        0 <= c &&
          ((OneView.core.calendars[c].visibility =
            OneView.core.calendars[c].visibility ==
            OneView.VisibilityType.Visible
              ? OneView.VisibilityType.Hidden
              : OneView.VisibilityType.Visible),
          this.styleBasedOnVisibility(
            this.liElements[c],
            this.checkBoxElements[c],
            this.colorBoxElements[c],
            OneView.core.calendars[c],
            null
          )));
    }
    calendarsBack(b) {
      300 > OneView.core.getTimeStamp() - this.timestamp ||
        OneView.core.appStateHandler.back();
    }
  }

  export class CalendarVisibilitySetting {
    constructor(readonly id: string, readonly oldVisibility: any) {}
  }

  export class SettingsControl {
    pageHtml =
      '<div id="noThemesWindow" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItem" style="text-align:center">{#More themes?#}</div>    <div>        <button id="gotoShopCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>        <button id="gotoShopOk" class="topBarButton" style="width:50%"><img src="images/shop.svg" class="topBarImage"/><span>{#Shop#}</span></button>    </div></div></div></div><div id="settingsTopBar" class="topBar">    <button id="settingsBack" class="topBarButton" style="width:50%"><img src="images/arrow-left.svg" class="topBarImage"/></span><span>{#Back#}</span></button>    <button id="emptyButton" class="topBarButton" style="width:50%"></button>    <div id="settingsTitle" class="topBarTitle" style="width:100%">{#Settings#}</div></div><div id="settingsArea" class="pageContent pageTopPadding" style="float:left; background-color: #E9E9E9;">    <div class="miniTitle sizedTitle" id="themeTitle">{#Theme#}</div>        <div style="position: relative"><div class="inputBox"><select id="settingsTheme" class="base inputBase" ></select></div>    </div>        <div class="miniTitle sizedTitle" id="timezoneTitle">{#Time zone#}</div>            <div style="position: relative"><div class="inputBox"><select id="settingsTimeZone" class="base inputBase" >                <option class="inputOption" value="-">{#Auto#}</option>                <option class="inputOption" value="-12">-12</option>                <option class="inputOption" value="-11">-11</option>                <option class="inputOption" value="-10">-10</option>                <option class="inputOption" value="-9.5">-9:30</option>                <option class="inputOption" value="-9">-9</option>                <option class="inputOption" value="-8">-8</option>                <option class="inputOption" value="-7">-7</option>                <option class="inputOption" value="-6">-6</option>                <option class="inputOption" value="-5">-5</option>                <option class="inputOption" value="-4">-4</option>                <option class="inputOption" value="-3.5">-3:30</option>                <option class="inputOption" value="-3">-3</option>                <option class="inputOption" value="-2">-2</option>                <option class="inputOption" value="-1">-1</option>                <option class="inputOption" value="0" >0</option>                <option class="inputOption" value="+1">+1</option>                <option class="inputOption" value="+2">+2</option>                <option class="inputOption" value="+3">+3</option>                <option class="inputOption" value="+3.5">+3:30</option>                <option class="inputOption" value="+4">+4</option>                <option class="inputOption" value="+4.5">+4:30</option>                <option class="inputOption" value="+5">+5</option>                <option class="inputOption" value="+5.5">+5:30</option>                <option class="inputOption" value="+5.75">+5:45</option>                <option class="inputOption" value="+6">+6</option>                <option class="inputOption" value="+6.5">+6:30</option>                <option class="inputOption" value="+7">+7</option>                <option class="inputOption" value="+8">+8</option>                <option class="inputOption" value="+8.5">+8:30</option>                <option class="inputOption" value="+8.75">+8:45</option>                <option class="inputOption" value="+9">+9</option>                <option class="inputOption" value="+9.5">+9:30</option>                <option class="inputOption" value="+10">+10</option>                <option class="inputOption" value="+10.5">+10:30</option>                <option class="inputOption" value="+11">+11</option>                <option class="inputOption" value="+12">+12</option>                <option class="inputOption" value="+12.75">+12:45</option>                <option class="inputOption" value="+13">+13</option>                <option class="inputOption" value="+14">+14</option>            </select></div></div>        <div class="miniTitle sizedTitle" id="firstDayTitle">{#First day of week#}</div>            <div style="position: relative"><div class="inputBox"><select id="settingsFirstDay" class="base inputBase" >            </select></div></div>    <div class="miniTitle sizedTitle">{#Show week numbers#}</div>    <div style="position: relative"><div class="inputBox transparent"><input id="checkBoxShowWeeks" type="checkbox" class="base inputBase inputCheckBox"></input></div></div>    <div class="miniTitle sizedTitle">{#Use 24-hour format#}</div>    <div style="position: relative"><div class="inputBox transparent"><input id="checkBox24h" type="checkbox" class="base inputBase inputCheckBox"></input></div></div>    <div class="miniTitle sizedTitle" id="grayDaysTitle">{#Gray days#}</div>        <div style="position: relative"><div class="inputBox"><select id="settingsGrayDays" class="base inputBase maybeBig" multiple="multiple"></select></div>    </div>    <div class="miniTitle sizedTitle" id="languageTitle">{#Language#}</div>        <div style="position: relative"><div class="inputBox"><select id="settingsLanguage" class="base inputBase" ></select></div>    </div>    <div class="miniTitle sizedTitle" id="daatAmountTitle">{#Data amount (startup speed)#}</div>        <div style="position: relative"><div class="inputBox"><select id="settingsDataAmount" class="base inputBase" >            <option class="inputOption" value="4800">{#All#}</option>            <option class="inputOption" value="48">{#4 Years#}</option>            <option class="inputOption" value="4">{#4 months#}</option>        </select></div>     </div></div>';
    visibilitySettings = [];

    show() {
      OneView.core.domHandler.hideCanvas();
      OneView.core.calendarDataProxy.analyticsPage("Settings page");
      this.timestamp = OneView.core.getTimeStamp();
      this.settingsPage = OneView.core.domHandler.pageHtmlFormatHelper(
        "settingsPage",
        this.pageHtml
      );
      this.settingsPage.style.display = "block";
      OneView.core.domHandler.resizeDomElements();
      OneView.core.domHandler.resizeDomElements();
      OneView.core.domHandler.resizeDomElements =
        OneView.core.domHandler.resizeDomElements.bind(OneView.core.domHandler);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 0);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 100);
      var b = (OneView.core.settings.titleWidth / OneView.core.ratio - 24) / 2;
      document.getElementById("settingsBack").style.padding = b + "px";
      document.getElementById("emptyButton").style.padding =
        OneView.core.settings.titleWidth / OneView.core.ratio / 2 + 1 + "px";
      document.getElementById("settingsArea").style.top = "54px";
      OneView.core.showBackButtons()
        ? (OneView.core.domHandler.addClickEvent(
            "settingsBack",
            this.settingsBack,
            this
          ),
          (document.getElementById("settingsTitle").style.display = "none"))
        : ((document.getElementById("settingsBack").style.display = "none"),
          (document.getElementById("emptyButton").style.display = "none"));
      this.firstDaySelectElement = document.getElementById("settingsFirstDay");
      this.grayDaysSelectElement = document.getElementById("settingsGrayDays");
      this.timeZoneSelectElement = document.getElementById("settingsTimeZone");
      this.languageSelectElement = document.getElementById("settingsLanguage");
      this.themeSelectElement = document.getElementById("settingsTheme");
      this.dataAmountSelectElement =
        document.getElementById("settingsDataAmount");
      this.showWeekCheckBox = document.getElementById("checkBoxShowWeeks");
      this.use24hCheckBox = document.getElementById("checkBox24h");
      OneView.core.domHandler.addWeekDaysToSelectNode(
        this.firstDaySelectElement
      );
      OneView.core.domHandler.addWeekDaysToSelectNode(
        this.grayDaysSelectElement
      );
      this.showWeekCheckBox.checked =
        OneView.core.commonUserSettings.showWeekNumbers;
      this.use24hCheckBox.checked =
        OneView.core.commonUserSettings.use24hFormat;
      this.timeZoneSelectElement.value =
        OneView.core.commonUserSettings.timeZoneForSettingsPage;
      OneView.Translate.languageExists(moment.locale()) ||
        ((b = new Option(
          "-",
          OneView.core.translate.get("Auto(partially English)"),
          false,
          false
        )),
        (b.className = "inputOption"),
        this.languageSelectElement.appendChild(b));
      for (var c = 0; c < OneView.core.translate.languages.keys().length; c++)
        (b = new Option(
          OneView.core.translate.languages.values()[c],
          OneView.core.translate.languages.keys()[c],
          false,
          false
        )),
          (b.className = "inputOption"),
          this.languageSelectElement.appendChild(b);
      this.languageSelectElement.value =
        OneView.core.commonUserSettings.language.toString();
      for (c = 0; c < OneView.core.settings.themes.keys().length; c++)
        (b = new Option(
          OneView.core.translate.get(
            OneView.core.settings.themes.values()[c].themeName
          ),
          OneView.core.settings.themes.keys()[c],
          false,
          false
        )),
          (b.className = "inputOption"),
          this.themeSelectElement.appendChild(b);
      this.themeSelectElement.value =
        OneView.core.commonUserSettings.theme.toString();
      1 == OneView.core.settings.themes.keys().length &&
        ((this.preventOptions = this.preventOptions.bind(this)),
        this.themeSelectElement.addEventListener(
          "mousedown",
          this.preventOptions
        ),
        this.themeSelectElement.addEventListener(
          "touchstart",
          this.preventOptions
        ));
      this.dataAmountSelectElement.value =
        OneView.core.commonUserSettings.dataAmountToLoad.toString();
      OneView.core.domHandler.selectWeekDays(
        this.firstDaySelectElement,
        "" + OneView.core.commonUserSettings.firstDayOfWeek
      );
      OneView.core.domHandler.selectWeekDays(
        this.grayDaysSelectElement,
        "" + OneView.core.commonUserSettings.grayDays
      );
    }
    preventOptions(a) {
      a.preventDefault();
      this.themeSelectElement.blur();
      window.focus();
      this.showNoThemesWindow();
    }
    showNoThemesWindow() {
      document.getElementById("noThemesWindow").style.display = "table";
      OneView.core.domHandler.addClickEvent("gotoShopOk", this.gotoShop, this);
      OneView.core.domHandler.addClickEvent(
        "gotoShopCancel",
        this.hideNoThemesWindow,
        this
      );
    }
    hideNoThemesWindow() {
      document.getElementById("noThemesWindow").style.display = "none";
    }
    gotoShop() {
      OneView.core.appStateHandler.viewShop();
    }
    hide() {
      var b = false;
      OneView.core.appStateHandler.settingsControlIsShowing = false;
      OneView.core.commonUserSettings.showWeekNumbers =
        this.showWeekCheckBox.checked;
      OneView.core.commonUserSettings.use24hFormat !=
        this.use24hCheckBox.checked &&
        ((OneView.core.commonUserSettings.use24hFormat =
          this.use24hCheckBox.checked),
        OneView.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Use 24h",
          1 == OneView.core.commonUserSettings.use24hFormat ? 1 : 0
        ),
        (b = true));
      OneView.core.commonUserSettings.timeZoneForSettingsPage !=
        this.timeZoneSelectElement.value &&
        ((OneView.core.commonUserSettings.timeZoneForSettingsPage =
          this.timeZoneSelectElement.value),
        OneView.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Time zone",
          OneView.core.helper.getNumberFromString(
            OneView.core.commonUserSettings.timeZoneForSettingsPage,
            1e3
          )
        ),
        (b = true));
      OneView.core.commonUserSettings.dataAmountToLoad.toString() !=
        this.dataAmountSelectElement.value &&
        ((OneView.core.commonUserSettings.dataAmountToLoad = Number(
          this.dataAmountSelectElement.value
        )),
        OneView.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Data amount to load",
          OneView.core.commonUserSettings.dataAmountToLoad
        ),
        (b = true));
      OneView.core.commonUserSettings.firstDayOfWeek + "" !=
        OneView.core.domHandler.getSelectOptions(this.firstDaySelectElement) &&
        ((OneView.core.commonUserSettings.firstDayOfWeek = Number(
          OneView.core.domHandler.getSelectOptions(this.firstDaySelectElement)
        )),
        OneView.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "First Day Of Week",
          OneView.core.commonUserSettings.firstDayOfWeek
        ),
        OneView.core.calendarDateHandler.clearWeekInfo());
      OneView.core.commonUserSettings.grayDays + "" !=
        OneView.core.domHandler.getSelectOptions(this.grayDaysSelectElement) &&
        ((OneView.core.commonUserSettings.grayDays =
          OneView.core.domHandler.getSelectOptions(this.grayDaysSelectElement)),
        OneView.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Gray days",
          OneView.core.helper.getNumberFromString(
            OneView.core.commonUserSettings.grayDays,
            1e3
          )
        ),
        OneView.core.calendarDateHandler.clearWeekInfo());
      OneView.core.commonUserSettings.language.toString() !==
        this.languageSelectElement.value &&
        ((OneView.core.commonUserSettings.language =
          this.languageSelectElement.value),
        OneView.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Language " + this.languageSelectElement.value,
          1
        ),
        OneView.core.reopenApp(),
        (b = true));
      OneView.core.commonUserSettings.theme.toString() !==
        this.themeSelectElement.value &&
        ((OneView.core.commonUserSettings.theme =
          this.themeSelectElement.value),
        OneView.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Theme " + this.themeSelectElement.value,
          1
        ),
        OneView.core.settings.reloadTheme(),
        OneView.core.reopenApp(),
        (b = true));
      OneView.core.domHandler.showCanvas();
      OneView.core.domHandler.removeElement(this.settingsPage.id);
      b && OneView.core.reloadAllCalendarData();
    }
    reshow() {
      this.show();
    }
    getEventTarget(a) {
      a = a || window.event;
      return a.target || a.srcElement;
    }
    settingsBack(b) {
      300 > OneView.core.getTimeStamp() - this.timestamp ||
        OneView.core.appStateHandler.back();
    }
  }

  export class MainMenuControl {
    constructor() {
      this.nudgeBecauseMenuBeingDragged = 0;
      this.menuItems = [];
      this.transparency = -1;
      this.animationDuration = 600;
      this.lastDragDirection = this.currentMaxRight = 0;
      this.movingMenuWidth = OneView.core.settings.titleWidth;
    }

    resetDrawAreaSize(b, e) {
      this.movingMenuWidth = OneView.core.settings.titleWidth;
    }
    reshow() {
      this.safeBack();
    }
    show() {
      this.menuItemLogin = new d(
        OneView.core.translate.get("Connect Google calendar"),
        OneView.core.charCodeLogin
      );
      this.menuItemFake = new d(
        OneView.core.translate.get("Show demo calendar"),
        OneView.core.charCodeFake
      );
      this.menuItemLogout = new d(
        OneView.core.translate.get("Disconnect from Google"),
        OneView.core.charCodeLogout
      );
      this.menuItemCalendars = new d(
        OneView.core.translate.get("Calendars"),
        OneView.core.charCodeCalendars
      );
      this.menuItemShop = new d(
        OneView.core.translate.get("Shop"),
        OneView.core.charCodeShop
      );
      this.menuItemReload = new d(
        OneView.core.translate.get("Refresh"),
        OneView.core.charCodeReload
      );
      this.menuItemSettings = new d(
        OneView.core.translate.get("Settings"),
        OneView.core.charCodeSettings
      );
      this.menuItemAbout = new d(
        OneView.core.translate.get("About"),
        OneView.core.charCodeAbout
      );
      this.menuItemRate = new d(
        OneView.core.translate.get("Rate"),
        OneView.core.charCodeHeart
      );
      this.menuItemFeedback = new d(
        OneView.core.translate.get("Send feedback"),
        OneView.core.charCodeSend
      );
      this.showTime = OneView.core.getTimeStamp();
      this.menuItems = [];
      OneView.core.enableGoogle &&
        OneView.core.calendarDataProxy &&
        (OneView.core.calendarDataProxy.calendarDataProxyType !==
          OneView.CalendarDataProxyType.Google ||
          OneView.core.calendarDataProxy.enableGoogleLogin) &&
        this.menuItems.push(this.menuItemLogin);
      OneView.core.calendarDataProxy &&
        OneView.core.calendarDataProxy.enableMultipleCalendars &&
        this.menuItems.push(this.menuItemCalendars);
      OneView.core.calendarDataProxy &&
        OneView.core.calendarDataProxy.enableShop &&
        this.menuItems.push(this.menuItemShop);
      OneView.core.calendarDataProxy &&
        OneView.core.calendarDataProxy.enableReload &&
        this.menuItems.push(this.menuItemReload);
      this.menuItems.push(this.menuItemSettings);
      OneView.core.helper.isAndroid() &&
        (this.menuItems.push(this.menuItemRate),
        this.menuItems.push(this.menuItemFeedback));
      OneView.core.calendarDataProxy &&
        OneView.core.calendarDataProxy.enableGoogleLogout &&
        this.menuItems.push(this.menuItemLogout);
      this.redraw();
    }
    safeBack() {
      OneView.core.appStateHandler.safeBack(this) || this.startCloseAnimation();
    }
    click(b, e) {
      500 > OneView.core.getTimeStamp() - this.showTime
        ? (this.showTime = OneView.core.getTimeStamp())
        : ((this.showTime = OneView.core.getTimeStamp()),
          this.isFullyExpanded() &&
            (this.safeBack(),
            this.hitTest(this.menuItemLogin, b, e)
              ? this.menuItemLogin_Click()
              : this.hitTest(this.menuItemReload, b, e)
              ? this.menuItemReload_Click()
              : this.hitTest(this.menuItemLogout, b, e)
              ? this.menuItemLogout_Click()
              : this.hitTest(this.menuItemFake, b, e)
              ? this.menuItemFake_Click()
              : this.hitTest(this.menuItemCalendars, b, e)
              ? this.menuItemCalendars_Click()
              : this.hitTest(this.menuItemShop, b, e)
              ? this.menuItemShop_Click()
              : this.hitTest(this.menuItemSettings, b, e)
              ? this.menuItemSettings_Click()
              : this.hitTest(this.menuItemAbout, b, e)
              ? this.menuItemAbout_Click()
              : this.hitTest(this.menuItemRate, b, e)
              ? this.menuItemRate_Click()
              : this.hitTest(this.menuItemFeedback, b, e) &&
                this.menuItemFeedback_Click()));
    }
    hide() {
      this.startCloseAnimation();
    }
    setSizes() {
      this.menuLeft = this.menuTop = 1;
      var b = 0;
      this.textSize = OneView.core.settings.menuTextHeight;
      this.logoTextSize = Math.floor(2.2 * this.textSize);
      this.logoSize = Math.floor(3 * OneView.core.settings.menuIconHeight);
      this.logoTextSubSize = Math.floor(1.4 * this.textSize);
      for (
        var e = OneView.core.zopDrawArea.measureTextWidth(
            "OneView",
            this.logoTextSize,
            true,
            false
          ),
          f = 0;
        f < this.menuItems.length;
        f++
      )
        (this.menuItems[f].top = b),
          (b += OneView.core.settings.menuItemHeight),
          (this.menuItems[f].bottom = b),
          (e = Math.max(
            e,
            OneView.core.zopDrawArea.measureTextWidth(
              this.menuItems[f].text,
              this.textSize,
              true,
              false
            )
          ));
      this.expandedMenuWidth = Math.floor(
        Math.min(
          e +
            OneView.core.settings.menuItemHeight +
            OneView.core.settings.menuIconHeight,
          Math.min(
            OneView.core.domHandler.screenWidth,
            OneView.core.domHandler.screenHeight
          )
        )
      );
      this.movingMenuWidth = Math.floor(
        Math.max(
          OneView.core.settings.titleWidth,
          Math.min(this.currentMaxRight, this.expandedMenuWidth)
        )
      );
      this.menuHeight = OneView.core.domHandler.screenHeight;
      this.nudgeBecauseMenuBeingDragged = Math.floor(
        Math.max(
          0,
          OneView.core.mainMenuControl.movingMenuWidth -
            OneView.core.settings.titleWidth
        )
      );
      this.transparency = Math.max(
        -1,
        Math.min(
          1,
          (2 * Math.min(this.currentMaxRight, this.movingMenuWidth) -
            this.expandedMenuWidth -
            OneView.core.settings.titleWidth) /
            (this.expandedMenuWidth - OneView.core.settings.titleWidth)
        )
      );
      this.logoSizeGrowing = Math.floor(
        0.85 * this.logoSize +
          0.15 * this.logoSize * Math.max(0, this.transparency)
      );
      this.textColor = OneView.core.settings.theme.colorTitleText;
    }
    drawAreaResized() {
      OneView.core.appStateHandler.isMainMenuShowing && this.redraw();
    }
    redrawMenuIcon() {
      OneView.core.zopDrawArea.canvasContext.globalAlpha = Math.max(
        0,
        -this.transparency
      );
      var b = OneView.core.zopHandler.dateToZOP(new Date()),
        e = Math.min(
          0.6 * OneView.core.settings.titleWidth,
          20 * OneView.core.ratio * OneView.core.settings.zoom
        ),
        f = (OneView.core.settings.titleWidth - e) / 2,
        g = OneView.core.zopDrawArea.zopAreaTop + f,
        d = this.movingMenuWidth - OneView.core.settings.titleWidth + f,
        f = OneView.core.zopHandler.bottomZOP - OneView.core.zopHandler.topZOP,
        b = Math.max(
          0,
          (Math.abs(b - (OneView.core.zopHandler.topZOP + f / 2)) - 0.45 * f) /
            (0.1 * f)
        ),
        n = 1 - Math.min(1, b),
        l = 1 - 3 * Math.max(0, Math.min(1.333, b) - 1),
        b = OneView.core.settings.lineThickness,
        h = g + e / 5,
        k = g + e / 2,
        p = g + e - e / 5,
        q = g + e / 2,
        r = d + e / 6,
        v = d + e - e / 6,
        t = (d + e / 2) * n + (d + e / 2) * (1 - n),
        w = h * n + g * (1 - n),
        z = (d + e - b) * n + (d + e) * (1 - n),
        x = h * n + q * (1 - n),
        f = (d + b) * n + r * (1 - n),
        A = k * n + (g + e - b / 2) * (1 - n),
        r = (d + e - b) * n + r * (1 - n),
        k = k * n + (q - e / 7) * (1 - n),
        u = (d + b) * n + v * (1 - n),
        g = p * n + (g + e - b / 2) * (1 - n),
        v = (d + e - b) * n + v * (1 - n),
        p = p * n + (q - e / 7) * (1 - n);
      OneView.core.drawArea.startLines(
        (d + b) * n + d * (1 - n),
        h * n + q * (1 - n),
        b,
        OneView.core.settings.theme.colorTitleText
      );
      OneView.core.drawArea.continueLines(t, w);
      OneView.core.drawArea.continueLines(z, x);
      OneView.core.drawArea.endLines();
      1 <= l &&
        (OneView.core.drawArea.drawLine2(
          f,
          A,
          r,
          k,
          b,
          OneView.core.settings.theme.colorTitleText,
          false
        ),
        OneView.core.drawArea.drawLine2(
          u,
          g,
          v,
          p,
          b,
          OneView.core.settings.theme.colorTitleText,
          false
        ));
      var y = e / 5;
      if (
        1 > l &&
        ((e = f * l + ((f + u - y) / 2) * (1 - l)),
        (d = p * l + A * (1 - l)),
        (n = u * l + ((f + u + y) / 2) * (1 - l)),
        (h = p * l + A * (1 - l)),
        (x = 2 * y),
        1 > l &&
          ((q = e * l + e * (1 - l)),
          (t = d * l + (d - x) * (1 - l)),
          (w = n * l + n * (1 - l)),
          (z = h * l + (h - x) * (1 - l)),
          1 > l))
      ) {
        var B = d - x,
          x = q * l + (q + y / 2) * (1 - l),
          C = t * l + B * (1 - l),
          y = w * l + (w - y / 2) * (1 - l),
          l = z * l + B * (1 - l);
        OneView.core.drawArea.startLines(
          r,
          k,
          b,
          OneView.core.settings.theme.colorTitleText
        );
        OneView.core.drawArea.continueLines(f, A);
        OneView.core.drawArea.continueLines(e, d);
        OneView.core.drawArea.continueLines(q, t);
        OneView.core.drawArea.continueLines(x, C);
        OneView.core.drawArea.endLines();
        OneView.core.drawArea.startLines(
          v,
          p,
          b,
          OneView.core.settings.theme.colorTitleText
        );
        OneView.core.drawArea.continueLines(u, g);
        OneView.core.drawArea.continueLines(n, h);
        OneView.core.drawArea.continueLines(w, z);
        OneView.core.drawArea.continueLines(y, l);
        OneView.core.drawArea.endLines();
      }
      OneView.core.zopDrawArea.canvasContext.globalAlpha = 1;
    }
    hitMenuButton(b, e) {
      return 0 < b &&
        b < OneView.core.settings.titleWidth &&
        0 < e &&
        e < OneView.core.settings.titleWidth
        ? true
        : false;
    }
    redraw() {
      this.setSizes();
      if (
        0.1 < this.movingMenuWidth / this.expandedMenuWidth &&
        0 < this.transparency
      ) {
        OneView.core.zopDrawArea.canvasContext.save();
        OneView.core.zopDrawArea.canvasContext.rect(
          this.menuLeft - 1,
          this.menuTop,
          this.movingMenuWidth,
          this.menuHeight + 2
        );
        OneView.core.zopDrawArea.canvasContext.clip();
        var b = this.expandedMenuWidth / 20;
        this.menuTop = b;
        OneView.core.drawArea.drawIcon(
          OneView.core.charCodeLogo,
          this.menuLeft + (this.expandedMenuWidth - this.logoSizeGrowing) / 2,
          this.menuTop + (this.logoSize - this.logoSizeGrowing) / 2,
          this.logoSizeGrowing,
          this.logoSizeGrowing
        );
        this.menuTop += this.logoSize;
        OneView.core.drawArea.drawCenteredText(
          "OneView",
          this.menuLeft,
          this.menuTop,
          this.expandedMenuWidth,
          this.logoTextSize,
          this.textColor,
          false,
          true,
          true
        );
        this.menuTop += this.logoTextSize;
        OneView.core.drawArea.drawCenteredText(
          "Calendar",
          this.menuLeft,
          this.menuTop,
          this.expandedMenuWidth,
          this.logoTextSubSize,
          this.textColor,
          false,
          true,
          true
        );
        this.menuTop += this.logoTextSubSize + 2 * b;
        for (b = 0; b < this.menuItems.length; b++)
          this.paintMenuItem(this.menuItems[b]);
        OneView.core.zopDrawArea.canvasContext.globalAlpha = Math.min(
          1,
          Math.max(0, 1 - this.transparency)
        );
        OneView.core.drawArea.drawFilledRectangle(
          OneView.core.zopHandler.leftPixel,
          0,
          OneView.core.settings.titleWidth +
            OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged +
            2 * OneView.core.ratio,
          OneView.core.zopDrawArea.zopAreaHeight,
          OneView.core.settings.theme.colorTitleBackground,
          false
        );
        OneView.core.zopDrawArea.canvasContext.globalAlpha = 1;
        OneView.core.zopDrawArea.canvasContext.restore();
      }
    }
    paintMenuItem(b) {
      var c = OneView.core.settings.menuItemHeight - 1;
      OneView.core.drawArea.drawHorizontalLineNotZOP(
        this.menuLeft,
        this.menuTop + b.top,
        this.expandedMenuWidth - 4,
        this.textColor,
        1,
        false
      );
      OneView.core.drawArea.drawHorizontalLineNotZOP(
        this.menuLeft,
        this.menuTop + b.top + 1 + OneView.core.settings.menuItemHeight - 1,
        this.expandedMenuWidth - 4,
        this.textColor,
        1,
        false
      );
      OneView.core.drawArea.drawText(
        b.text,
        this.menuLeft + c,
        this.menuTop +
          b.top +
          (OneView.core.settings.menuItemHeight - this.textSize) / 2.5,
        this.textSize,
        this.textColor,
        false,
        true,
        false,
        false
      );
      OneView.core.drawArea.drawIcon(
        b.charCode,
        this.menuLeft + c / 2 - OneView.core.settings.menuIconHeight / 2,
        this.menuTop + b.top + c / 2 - OneView.core.settings.menuIconHeight / 2,
        OneView.core.settings.menuIconHeight,
        OneView.core.settings.menuIconHeight
      );
    }
    hitTest(a, b, f) {
      return -1 < this.menuItems.indexOf(a) &&
        b > this.menuLeft &&
        b < this.menuLeft + this.expandedMenuWidth &&
        f > this.menuTop + a.top &&
        f < this.menuTop + a.bottom
        ? true
        : false;
    }
    menuItemLogin_Click() {
      OneView.core.calendarDataProxy.analyticsEvent("Event", "Login Clicked");
      OneView.core.calendarDataProxy
        ? ((OneView.core.calendarDataProxy =
            new OneView.GoogleCalendarDataProxy()),
          OneView.core.calendarDataProxy.login())
        : OneView.core.loadDataProxy();
    }
    menuItemReload_Click() {
      OneView.core.calendarDataProxy.analyticsEvent("Event", "Reload Clicked");
      OneView.core.reloadAllCalendarData();
    }
    menuItemLogout_Click() {
      OneView.core.calendarDataProxy.logout();
      OneView.core.calendarDataProxy.analyticsEvent("Event", "Logout Clicked");
      OneView.core.calendarDataProxy = new OneView.DemoCalendarDataProxy();
      OneView.core.calendarDataProxy.populateCalendarEvents(function () {
        OneView.core.dataLoadReady();
      });
    }
    menuItemFake_Click() {
      OneView.core.calendarDataProxy = new OneView.DemoCalendarDataProxy();
      OneView.core.calendarDataProxy.populateCalendarEvents(function () {
        OneView.core.dataLoadReady();
      });
    }
    menuItemCalendars_Click() {
      OneView.core.appStateHandler.viewCalendars();
    }
    menuItemShop_Click() {
      OneView.core.appStateHandler.viewShop();
    }
    menuItemSettings_Click() {
      OneView.core.appStateHandler.viewSettings();
    }
    menuItemAbout_Click() {
      OneView.core.appStateHandler.viewAbout();
    }
    menuItemRate_Click() {
      OneView.core.helper.isAndroid()
        ? window.open("market://details?id=com.oneviewcalendar.app")
        : window.open(
            "https://web.archive.org/web/20190808203716/https://play.google.com/store/apps/details?id=com.oneviewcalendar.app"
          );
    }
    menuItemFeedback_Click() {
      window.open(
        "mailto:support@oneviewcalendar.com?body=%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A-------------------%0D%0ASent from OneView Calendar version: 1.1.8"
      );
    }
    getAnimationProgress() {
      var b = OneView.core.getTimeStamp(),
        b =
          Math.min(
            this.animationDuration,
            Math.max(10, b - this.animationStartTime)
          ) / this.animationDuration;
      return 1 - (1 - b) * (1 - b) * (1 - b) * (1 - b);
    }
    startOpenAnimation() {
      this.animationAborted = false;
      OneView.core.appStateHandler.isMainMenuBeingDragged = false;
      this.animationStartTime = OneView.core.getTimeStamp() - 20;
      this.animationStartPos = this.currentMaxRight;
      this.animationGoalDistance =
        this.expandedMenuWidth - this.animationStartPos;
      this.doOpenAnimation();
    }
    doOpenAnimation() {
      var b = this;
      this.animationAborted ||
        ((this.currentMaxRight =
          this.animationStartPos +
          this.animationGoalDistance * this.getAnimationProgress()),
        this.isFullyExpanded() ||
          window.setTimeout(function () {
            b.doOpenAnimation();
          }, 30),
        OneView.core.redraw(true));
    }
    isFullyExpanded() {
      return this.movingMenuWidth >= this.expandedMenuWidth - 5;
    }
    startCloseAnimation() {
      this.animationAborted = false;
      OneView.core.appStateHandler.isMainMenuBeingDragged = false;
      this.animationStartTime = OneView.core.getTimeStamp() - 20;
      this.animationStartPos = this.currentMaxRight;
      this.animationGoalDistance = -this.animationStartPos;
      this.doCloseAnimation();
    }
    doCloseAnimation() {
      var b = this;
      this.animationAborted ||
        ((this.currentMaxRight =
          this.animationStartPos +
          this.animationGoalDistance * this.getAnimationProgress()),
        0 < this.currentMaxRight
          ? window.setTimeout(function () {
              b.doCloseAnimation();
            }, 30)
          : ((this.currentMaxRight = 0),
            (OneView.core.appStateHandler.isMainMenuBeingDragged = false),
            (this.movingMenuWidth = OneView.core.settings.titleWidth),
            (OneView.core.appStateHandler.isMainMenuShowing = false),
            this.redraw()));
      OneView.core.redraw(true);
    }
    startDragging(b, e) {
      OneView.core.appStateHandler.isMainMenuBeingDragged = false;
      return (b >= OneView.core.zopDrawArea.zopAreaLeft &&
        b <=
          OneView.core.zopDrawArea.zopAreaLeft +
            Math.max(OneView.core.settings.titleWidth, this.currentMaxRight)) ||
        (OneView.core.appStateHandler.isMainMenuShowing &&
          this.isFullyExpanded())
        ? (this.animationAborted = true)
        : false;
    }
    continueDragging(b, e) {
      this.animationAborted =
        OneView.core.appStateHandler.isMainMenuBeingDragged = true;
      b = Math.max(b, OneView.core.settings.titleWidth);
      this.lastDragDirection = b - this.currentMaxRight;
      this.currentMaxRight = b;
      OneView.core.appStateHandler.isMainMenuShowing ||
        (OneView.core.appStateHandler.showMainMenu(false),
        (this.currentMaxRight = b));
    }
    endDragging() {
      OneView.core.appStateHandler.isMainMenuBeingDragged = false;
      0 < this.lastDragDirection
        ? (OneView.core.appStateHandler.addVisibleControl(
            OneView.core.mainMenuControl
          ),
          this.startOpenAnimation())
        : this.safeBack();
    }
  }

  export class AddButtonControl {
    constructor() {
      this.animationLength = 2e3;
      this.precision = 4;
      this.animationActive = false;
    }

    drawAreaResized() {
      OneView.core.appStateHandler.isAddButtonBeingDragged && this.redraw();
      this.width = Math.floor(
        OneView.core.settings.titleWidth *
          OneView.core.settings.theme.addButtonWidthFactor
      );
      this.halfWidth = Math.floor(this.width / 2);
      this.radius = Math.floor(this.width / 2);
      this.defaultCenterY =
        OneView.core.zopDrawArea.zopAreaTop +
        OneView.core.zopDrawArea.zopAreaHeight -
        2 * OneView.core.settings.margin -
        this.radius;
      this.currentCenterX = this.defaultCenterX =
        OneView.core.zopDrawArea.zopAreaLeft +
        OneView.core.zopDrawArea.zopAreaWidth -
        2 * OneView.core.settings.margin -
        this.radius;
      this.currentCenterY = this.defaultCenterY;
      this.leftForDetailedSelection =
        (OneView.core.zopHandler.rightPixel -
          OneView.core.settings.titleWidth) /
          2 +
        OneView.core.settings.titleWidth;
    }
    redrawAddButton() {
      OneView.core.appStateHandler.isAddButtonBeingDragged ||
      this.isAnimationActive()
        ? (this.passedMinDistance() &&
            this.selectedStartTime &&
            OneView.core.zopDrawArea.drawFilledRectangle(
              OneView.core.settings.titleWidth +
                OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
              OneView.core.zopHandler.dateToZOP(this.selectedStartTime),
              OneView.core.zopDrawArea.zopAreaWidth -
                OneView.core.settings.titleWidth -
                OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
              OneView.core.zopHandler.dateToZOP(this.selectedEndTime),
              OneView.core.settings.theme.colorFadeOut,
              5
            ),
          this.passedMinDistance() &&
            OneView.core.drawArea.drawVerticalLineNotZOP(
              this.leftForDetailedSelection,
              0,
              OneView.core.zopDrawArea.zopAreaHeight,
              OneView.core.settings.theme.colorMarker,
              3
            ),
          OneView.core.zopDrawArea.drawFilledCircle2(
            this.defaultCenterX +
              OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
            this.defaultCenterY,
            this.radius + 1,
            OneView.core.settings.theme.colorDarkSoft,
            false
          ),
          OneView.core.zopDrawArea.drawFilledCircle2(
            this.defaultCenterX +
              OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
            this.defaultCenterY,
            this.radius - 1,
            OneView.core.settings.theme.colorLightSoft,
            false
          ))
        : ((this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY));
      OneView.core.zopDrawArea.drawFilledCircle2(
        this.currentCenterX +
          OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
        this.currentCenterY,
        this.radius,
        OneView.core.settings.theme.colorAddButton,
        false
      );
      var b = OneView.core.settings.lineThickness,
        c = 0;
      1 === b && (c = 0.5);
      this.isAnimationActive()
        ? ((b = this.radius / 2.2),
          OneView.core.drawArea.drawCenteredText(
            "Drag me",
            this.currentCenterX -
              this.radius +
              OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
            this.currentCenterY - b / 1.5,
            2 * this.radius,
            b,
            OneView.core.settings.theme.colorTagText,
            false,
            false,
            false
          ))
        : (OneView.core.drawArea.drawLine2(
            this.currentCenterX +
              OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
              c,
            Math.floor(this.currentCenterY - this.width / 7) - c,
            this.currentCenterX +
              OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
              c,
            Math.floor(this.currentCenterY + this.width / 7) - c,
            b,
            OneView.core.settings.theme.colorTitleText,
            false
          ),
          OneView.core.drawArea.drawLine2(
            Math.floor(
              this.currentCenterX -
                this.width / 7 +
                OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged
            ) - c,
            this.currentCenterY - c,
            Math.floor(
              this.currentCenterX +
                this.width / 7 +
                OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged
            ) - c,
            this.currentCenterY - c,
            b,
            OneView.core.settings.theme.colorTitleText,
            false
          ));
    }
    startDragging(b, c) {
      this.passefMinDistanceEver = false;
      return b >
        this.currentCenterX +
          OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
          1.5 * this.radius &&
        b <
          this.currentCenterX +
            OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged +
            1.5 * this.radius &&
        c >
          this.currentCenterY +
            OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
            1.5 * this.radius &&
        c <
          this.currentCenterY +
            OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged +
            1.5 * this.radius
        ? (OneView.core.appStateHandler.isAddButtonBeingDragged = true)
        : (OneView.core.appStateHandler.isAddButtonBeingDragged = false);
    }
    getTitleExtraData() {
      if (
        OneView.core.appStateHandler.isAddButtonBeingDragged &&
        this.detailedTimeInfo
      )
        return this.detailedTimeInfo;
    }
    continueDragging(b, c) {
      this.currentCenterX = b;
      this.currentCenterY = c;
      if (this.passedMinDistance()) {
        this.passefMinDistanceEver = true;
        var e;
        b >= this.leftForDetailedSelection &&
          (e = OneView.core.calendarDateHandler.getClosestFakeDetailAt(
            c,
            this.precision,
            false
          ));
        if (!e) {
          this.detailedTimeInfo = void 0;
          e = OneView.core.calendarDateHandler.selectCalendarDateObjectAt(
            b,
            c,
            true
          );
          for (
            var f = 10;
            e &&
            e.calendarDateObjectType === OneView.CalendarDateObjectType.Title;

          )
            (e = OneView.core.calendarDateHandler.selectCalendarDateObjectAt(
              b + f,
              c,
              true
            )),
              (f += 10);
        }
        e &&
          e.calendarDateObjectType === OneView.CalendarDateObjectType.Week &&
          (this.detailedTimeInfo = e.longText);
        e &&
          (e.calendarDateObjectType < OneView.CalendarDateObjectType.Hour &&
            (e = new OneView.CalendarDateObject(
              OneView.CalendarDateObjectType.Hour,
              e.startDateTime
            )),
          this.selectedStartTime !== e.startDateTime &&
            ((this.previousSelectedStartTime = this.selectedStartTime),
            (this.previousSelectedEndTime = this.selectedEndTime),
            (this.selectedTimeStamp = OneView.core.getTimeStamp())),
          (this.selectedStartTime = e.startDateTime),
          (this.selectedEndTime = e.endDateTime));
        e &&
          ((this.detailedTimeInfo = e.longText),
          e.calendarDateObjectType <= OneView.CalendarDateObjectType.Hour &&
            (this.detailedTimeInfo =
              moment(e.startDateTime).format("dddd ") + e.longText));
      } else
        this.detailedTimeInfo =
          this.selectedEndTime =
          this.selectedStartTime =
            void 0;
    }
    endDragging() {
      OneView.core.appStateHandler.isAddButtonBeingDragged = false;
      this.selectedTimeStamp + 200 > OneView.core.getTimeStamp() &&
        void 0 !== this.previousSelectedEndTime &&
        ((this.selectedStartTime = this.previousSelectedStartTime),
        (this.selectedEndTime = this.previousSelectedEndTime));
      this.passedMinDistance()
        ? this.selectedStartTime &&
          (OneView.core.zopDrawArea.drawFilledRectangle(
            OneView.core.settings.titleWidth,
            OneView.core.zopHandler.dateToZOP(this.selectedStartTime),
            OneView.core.zopDrawArea.zopAreaWidth -
              OneView.core.settings.titleWidth,
            OneView.core.zopHandler.dateToZOP(this.selectedEndTime),
            OneView.core.settings.theme.colorFadeOut,
            5
          ),
          (this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY),
          OneView.core.appStateHandler.startAddCalendarEventObject(
            this.selectedStartTime,
            this.selectedEndTime
          ))
        : this.passefMinDistanceEver
        ? ((this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY))
        : ((this.animationStartTime = OneView.core.getTimeStamp()),
          (this.animationActive = true));
      this.detailedTimeInfo =
        this.selectedEndTime =
        this.selectedStartTime =
          void 0;
    }
    isAnimationActive() {
      OneView.core.appStateHandler.isAddButtonBeingDragged &&
        (this.animationActive = false);
      return this.animationActive;
    }
    passedMinDistance() {
      return (
        Math.abs(this.currentCenterX - this.defaultCenterX) +
          Math.abs(this.currentCenterY - this.defaultCenterY) >=
        this.width
      );
    }
    doAnimation() {
      var b = OneView.core.getTimeStamp() - this.animationStartTime;
      b > this.animationLength &&
        ((this.currentCenterX = this.defaultCenterX),
        (this.currentCenterY = this.defaultCenterY));
      if (b > 2 * this.animationLength)
        (this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY),
          (this.animationActive = false);
      else {
        var c = OneView.core.zopDrawArea.zopAreaHeight / 8,
          e =
            Math.PI / 2 -
            ((b / this.animationLength) * Math.PI + (2 * Math.PI) / 8),
          b = ((b / this.animationLength) * Math.PI) / 2;
        this.currentCenterX = this.defaultCenterX + Math.sin(e) * c - 0.706 * c;
        this.currentCenterY = this.defaultCenterY + Math.cos(e) * c - 0.708 * c;
        this.currentCenterX -= Math.sin(b) * c * 1;
        this.currentCenterY -= Math.sin(b) * c * 1.5;
        this.continueDragging(this.currentCenterX, this.currentCenterY);
        OneView.core.redraw(false);
      }
    }
    doAnimation2() {
      var b = OneView.core.getTimeStamp() - this.animationStartTime;
      b > this.animationLength &&
        ((this.currentCenterX = this.defaultCenterX),
        (this.currentCenterY = this.defaultCenterY));
      if (b > 2 * this.animationLength)
        (this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY),
          (this.animationActive = false);
      else {
        var c = OneView.core.zopDrawArea.zopAreaHeight / 8,
          e = this.defaultCenterY - 1 * c,
          f = this.defaultCenterX - 1 * c,
          g = this.defaultCenterY - 8 * c,
          d = this.defaultCenterX - 8 * c,
          n = this.defaultCenterY - 5 * c,
          l = Math.min(1, (2 * b) / this.animationLength);
        this.currentCenterX = this.newPosHelper(
          this.defaultCenterX - 2 * c,
          this.currentCenterX,
          l
        );
        this.currentCenterY = this.newPosHelper(e, this.currentCenterY, l);
        l = Math.max(0, Math.min(1, (b * b) / 600 / this.animationLength));
        this.currentCenterX = this.newPosHelper(f, this.currentCenterX, l);
        this.currentCenterY = this.newPosHelper(g, this.currentCenterY, l);
        b > this.animationLength / 2 &&
          ((l = Math.min(
            1,
            (b - this.animationLength / 2) /
              (this.animationLength - this.animationLength / 2)
          )),
          (this.currentCenterX = this.newPosHelper(d, this.currentCenterX, l)),
          (this.currentCenterY = this.newPosHelper(n, this.currentCenterY, l)));
        l = Math.min(1, b / this.animationLength);
        this.continueDragging(
          this.newPosHelper(this.defaultCenterX, this.currentCenterX, l),
          this.newPosHelper(this.defaultCenterY, this.currentCenterY, l)
        );
        OneView.core.redraw(false);
      }
    }
    newPosHelper(a, c, e) {
      return a * e + c * (1 - e);
    }
    redraw() {}
  }

  export class PopupMenuControl_Base {
    constructor() {
      this.menuItems = [];
      this.menuItems = a;
    }
    resetDrawAreaSize(a, c) {}
    showMenuFor(b, c) {
      this.x = b;
      this.y = c;
      this.tryShiftPixels = c - OneView.core.domHandler.screenHeight / 2;
      this.redraw();
    }
    click(a, c) {
      for (var b = 0; b < this.menuItems.length; b++)
        if (this.hitTest(this.menuItems[b], a, c)) {
          this.menuItems[b].onMenuItemClicked();
          return;
        }
      history.back();
    }
    drawAreaResized() {
      this.redraw();
    }
    redraw() {
      for (var b = 0, c = 0, e = 0; e < this.menuItems.length; e++)
        this.menuItems[e].isVisible &&
          ((this.menuItems[e].top = b),
          (b += OneView.core.settings.menuItemHeight),
          (this.menuItems[e].bottom = b),
          (c = Math.max(
            c,
            OneView.core.zopDrawArea.measureTextWidth(
              this.menuItems[e].text,
              OneView.core.settings.menuTextHeight,
              true,
              false
            )
          )));
      this.menuWidth = Math.min(
        c +
          OneView.core.settings.menuItemHeight +
          OneView.core.settings.menuIconHeight,
        Math.min(
          OneView.core.domHandler.screenWidth,
          OneView.core.domHandler.screenHeight
        )
      );
      this.menuHeight = b + 1;
      this.menuLeft =
        (OneView.core.domHandler.screenWidth - this.menuWidth) / 2;
      this.menuTop =
        (OneView.core.domHandler.screenHeight - this.menuHeight) / 2 +
        this.tryShiftPixels;
      this.menuTop = Math.max(20, this.menuTop);
      this.menuTop = Math.min(
        OneView.core.domHandler.screenHeight - 20 - this.menuHeight,
        this.menuTop
      );
      OneView.core.drawArea.drawFilledRectangle(
        this.menuLeft - 1,
        this.menuTop - 1,
        this.menuWidth + 2,
        this.menuHeight + 2,
        OneView.core.settings.theme.colorWhite,
        false
      );
      OneView.core.drawArea.drawFilledRectangle(
        this.menuLeft,
        this.menuTop,
        this.menuWidth,
        this.menuHeight,
        OneView.core.settings.theme.colorDarkSoft,
        false
      );
      for (e = 0; e < this.menuItems.length; e++)
        this.paintMenuItem(this.menuItems[e]);
    }
    paintMenuItem(b) {
      if (b.isVisible) {
        var c = OneView.core.settings.menuItemHeight - 1;
        OneView.core.drawArea.drawFilledRectangle(
          this.menuLeft + 1,
          this.menuTop + b.top + 1,
          this.menuWidth - 2,
          OneView.core.settings.menuItemHeight - 1,
          OneView.core.settings.theme.colorDark,
          false
        );
        OneView.core.drawArea.drawText(
          b.text,
          this.menuLeft + c + 1,
          this.menuTop +
            b.top +
            (OneView.core.settings.menuItemHeight -
              OneView.core.settings.menuTextHeight) /
              2.5,
          OneView.core.settings.menuTextHeight,
          OneView.core.settings.theme.colorWhite,
          false,
          true,
          false,
          false
        );
        OneView.core.drawArea.drawIcon(
          b.charCode,
          this.menuLeft + c / 2 - OneView.core.settings.menuIconHeight / 2,
          this.menuTop +
            b.top +
            c / 2 -
            OneView.core.settings.menuIconHeight / 2,
          OneView.core.settings.menuIconHeight,
          OneView.core.settings.menuIconHeight
        );
      }
    }
    hitTest(a, c, e) {
      return c > this.menuLeft &&
        c < this.menuLeft + this.menuWidth &&
        e > this.menuTop + a.top &&
        e < this.menuTop + a.bottom
        ? true
        : false;
    }
  }

  export class MenuItemInfo {
    constructor(a, b, c) {
      this.isHighlited = false;
      this.isVisible = true;
      this.text = a;
      this.charCode = b;
      this.onMenuItemClicked = c;
    }
  }

  export class EditEventControl {
    constructor() {
      this.pageHtml =
        '<div id="message" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div id="messageText" class="base menuItem" style="text-align:center">{#Error#}</div>    <div>        <button id="messageOk" class="topBarButton" style="width:100%"><img src="images/check.svg" height="24px" style="vertical-align: text-bottom"/><span>{#Ok#}</span></button>    </div></div></div></div><div id="noColorPickerWindow" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItem" style="text-align:center">{#Color picker?#}</div>    <div>        <button id="gotoShopCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>        <button id="gotoShopOk" class="topBarButton" style="width:50%"><img src="images/shop.svg" class="topBarImage"/><span>{#Shop#}</span></button>    </div></div></div></div><div id="colorPickerWindow" class="outer" style="display: none" > <div class="middle" > <div class="inner" >          <div id="colorPickerArea" style="padding: 20px; padding-top: 12px;"></div></div></div></div><div id="editEventTopBar" class="topBar">    <button id="editEventCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>    <button id="editEventOk" class="topBarButton" style="width:50%"><img src="images/check.svg" class="topBarImage"/><span>{#Ok#}</span></button></div><div class="pageContent" id="editEventArea" style="float:left; background-color: #E9E9E9;">        <div class="editEventPopupContent pageTopPadding" id="editEventPopupContent">            <div class="miniTitle sizedTitle">{#Title#}</div>            <div style="position: relative"><div class="inputBox"><input type="text" class="base inputBase inputOneLiner" name="task" id="editEventTitle" required /></div></div>            <div class="miniTitle sizedTitle">{#Start#}</div>            <div style="position: relative"><div class="inputBox lessSpace"><input type="date" class="base inputBase inputDate" id="editEventDateStart" min="0001-01-01" max="4000-01-01" /><span id="fakeDateStart" class="base inputBase dateFake" ></span></div></div>            <div style="position: relative"><div class="inputBox"><input type="time" class="base inputBase inputDate androidDown" id="editEventTimeStart" step="60"></div></div>            <div class="miniTitle sizedTitle">{#End#}</div>            <div style="position: relative"><div class="inputBox lessSpace"><select id="editEventDuration" class="base inputBase">            </select></div></div>            <div style="position: relative"><div class="inputBox lessSpace"><input type="date" class="base inputBase inputDate" id="editEventDateEnd" min="0001-01-01" max="4000-01-01" ><span id="fakeDateEnd" class="base inputBase dateFake"></span></div></div>            <div style="position: relative"><div class="inputBox"><input type="time" class="base inputBase inputDate androidDown" id="editEventTimeEnd"  step="60"/></div></div>            <div class="miniTitle sizedTitle" id="remindersTitle">{#Reminders#}</div>            <div style="position: relative"><div class="inputBox"><select id="editEventReminders" class="base inputBase maybeBig" multiple="multiple" >            </select></div></div>            <div class="miniTitle sizedTitle">{#Where#}</div>            <div style="position: relative"><div class="inputBox"><input type="text" class="base inputBase inputOneLiner" name="task" id="editEventLocation" ></div></div>            <div class="miniTitle sizedTitle">{#Details#}</div>            <div style="position: relative"><div class="inputBox"><textarea class="base inputBase inputTwoLiner" name="task" id="editEventDetails" ></textarea></div></div>            <div id="spaceForColors"></div>                        <div class="miniTitle sizedTitle">{#Calendar#}</div>                        <div style="position: relative"><div id="calendarSelWrapper" class="inputBox"><select id="editEventCalendar" class="base inputBase inputOneLiner" >                        </select></div><div id="editEventColor" class="square"></div>            <table style ="width:100%">                <tr>                    <td style="white-space: nowrap">                        <div class="miniTitle sizedTitle">{#Recurrence#}</div>                        <div><div class="inputBox"><div class="base inputBase inputOneLiner" id="editEventRecurrenceWrapper"><span class="pageContentText" id="editEventRecurrence" style="cursor: pointer" style="float:left" taborder="10"></span></div></div></div>                    </td><td style="width:80%"></td>                 </tr>            </table>            </div> </div>         </div></div>';
      this.isShowingDatePickerForStartTime = false;
      this.canEditReccur = true;
    }
    reshow() {
      OneView.core.appStateHandler.editEventControlIsShowing = true;
      this.updateRecurrenceHtml();
      this.timestamp = OneView.core.getTimeStamp();
    }
    init(b, c) {
      this.calendarEvent =
        c === OneView.EventEditType.AllInSeries && b.isRecurring
          ? OneView.core.calendarDataProxy.getFirstRecurringEvent(b)
          : b;
      this.editType = c;
      this.originalStartDate = this.calendarEvent.startDateTime;
      this.originalEndDate = this.calendarEvent.endDateTime;
      this.originalIsRecurring = this.calendarEvent.isRecurring;
      this.rruleFetched = this.rruleFetched.bind(this);
      OneView.core.calendarDataProxy.getRRuleObject(
        this.calendarEvent,
        this.rruleFetched
      );
    }
    show() {
      OneView.core.domHandler.hideCanvas();
      OneView.core.calendarDataProxy.analyticsPage("Edit event page");
      this.editPage = OneView.core.domHandler.pageHtmlFormatHelper(
        "editEvent",
        this.pageHtml
      );
      this.editPage.style.display = "block";
      OneView.core.domHandler.resizeDomElements();
      OneView.core.domHandler.resizeDomElements();
      this.setByDuration(null);
      OneView.core.domHandler.resizeDomElements =
        OneView.core.domHandler.resizeDomElements.bind(OneView.core.domHandler);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 0);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 100);
      this.durationSelectElement = document.getElementById("editEventDuration");
      this.updateDuration();
      this.remindersSelectElement =
        document.getElementById("editEventReminders");
      this.updateReminders();
      var b = (OneView.core.settings.titleWidth / OneView.core.ratio - 24) / 2;
      document.getElementById("editEventOk").style.padding = b + "px";
      document.getElementById("editEventCancel").style.padding = b + "px";
      document.getElementById("editEventArea").style.top = "54px";
      OneView.core.domHandler.addClickEvent(
        "editEventOk",
        this.editEventOk,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "editEventCancel",
        this.editEventCancel,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "editEventRecurrence",
        this.editRecurrency,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "editEventArea",
        this.doNothing,
        this
      );
      OneView.core.helper.canShowDatePicker() &&
        (OneView.core.domHandler.addClickEvent(
          "editEventTimeStart",
          this.showDatePickerForStartTime,
          this
        ),
        OneView.core.domHandler.addClickEvent(
          "editEventTimeEnd",
          this.showDatePickerForEndTime,
          this
        ));
      OneView.core.domHandler.addEvent(
        "editEventDateStart",
        "change",
        this.startChanged,
        this
      );
      OneView.core.domHandler.addEvent(
        "editEventDateEnd",
        "change",
        this.endChanged,
        this
      );
      OneView.core.domHandler.addEvent(
        "editEventTimeStart",
        "change",
        this.startChanged,
        this
      );
      OneView.core.domHandler.addEvent(
        "editEventTimeEnd",
        "change",
        this.endChanged,
        this
      );
      OneView.core.domHandler.addEvent(
        "editEventDuration",
        "change",
        this.editEventDurationChanged,
        this
      );
      OneView.core.domHandler.addEvent(
        "editEventTimeStart",
        "blur",
        this.showFakeTimeStart,
        this
      );
      OneView.core.domHandler.addEvent(
        "editEventTimeEnd",
        "blur",
        this.showFakeTimeEnd,
        this
      );
      this.calendarEvent.summary
        ? (document.getElementById("editEventTitle").value =
            this.calendarEvent.summary)
        : (document.getElementById("editEventTitle").value = "");
      this.calendarEvent.location
        ? (document.getElementById("editEventLocation").value =
            this.calendarEvent.location)
        : (document.getElementById("editEventLocation").value = "");
      new OneView.Helper().isMobile() ||
        (document.getElementById("remindersTitle").innerHTML +=
          "  (" +
          OneView.core.translate.get(
            "Hold CTRL/CMD while clicking on the reminders you want."
          ) +
          ")");
      this.updateFakes();
      this.updateRealDateInputs();
      this.calendarEvent.description
        ? (document.getElementById("editEventDetails").value =
            this.calendarEvent.description)
        : (document.getElementById("editEventDetails").value = "");
      this.updateRecurrenceHtml();
      b = document.getElementById("editEventCalendar");
      this.calendarChanged = this.calendarChanged.bind(this);
      b.onchange = this.calendarChanged;
      var c = "",
        e;
      for (e = 0; e < OneView.core.calendars.length; e++)
        1 == OneView.core.calendars[e].canEditCalendarEvents &&
          (c +=
            "<option value='" +
            OneView.core.calendars[e].id +
            "' > " +
            OneView.core.calendars[e].name +
            " </option > ");
      b.innerHTML = c;
      b.value = this.calendarEvent.calendarId;
      OneView.core.domHandler.addClickEvent(
        "editEventColor",
        this.showColorPickerWindow,
        this
      );
      document.getElementById("colorPickerArea").style.backgroundColor =
        OneView.core.settings.theme.colorBackground;
      document.getElementById("editEventColor").style.backgroundColor =
        OneView.core.helper.getEventColor2(this.calendarEvent);
      b = new Piklor();
      b.init(
        document.getElementById("colorPickerArea"),
        OneView.core.settings.theme.eventColors,
        {
          open: document.getElementById("editEventColor"),
          closeOnBlur: true,
        },
        ""
      );
      var f = this;
      b.colorChosen(function (b, c) {
        b &&
          ((f.calendarEvent.extraColorId =
            OneView.core.settings.theme.eventColors.indexOf(b)),
          f.calendarEvent.extraColorId ==
            OneView.core.getCalendar(f.calendarEvent.calendarId).colorId &&
            (f.calendarEvent.extraColorId = void 0),
          (document.getElementById("editEventColor").style.backgroundColor =
            OneView.core.helper.getEventColor2(f.calendarEvent)));
        f.hideColorPickerWindow();
      });
    }
    calendarChanged(b) {
      b = document.getElementById("editEventCalendar").value;
      document.getElementById("editEventColor").style.backgroundColor =
        OneView.core.helper.getCalendarColor(OneView.core.getCalendar(b));
      this.calendarEvent.extraColorId = void 0;
    }
    onSuccess(a) {
      this.isShowingDatePickerForStartTime
        ? ((document.getElementById("editEventTimeStart").value =
            this.timeToValue(a)),
          (this.calendarEvent.startDateTime = a),
          this.startChanged(null))
        : ((document.getElementById("editEventTimeEnd").value =
            this.timeToValue(a)),
          (this.calendarEvent.endDateTime = a),
          this.endChanged(null));
    }
    onError(a) {}
    showDatePicker(b) {
      this.isShowingDatePickerForStartTime = b;
      b = {
        date: b
          ? this.calendarEvent.startDateTime
          : this.calendarEvent.endDateTime,
        mode: "time",
        androidTheme: 1,
        is24Hour: OneView.core.commonUserSettings.use24hFormat,
      };
      this.onSuccess = this.onSuccess.bind(this);
      this.onError = this.onError.bind(this);
      datePicker.show(b, this.onSuccess, this.onError);
    }
    showDatePickerForStartTime(a) {
      a.preventDefault();
      this.showDatePicker(true);
    }
    showDatePickerForEndTime(a) {
      a.preventDefault();
      this.showDatePicker(false);
    }
    showMessage(b, c) {
      var e = this;
      document.getElementById("message").style.display = "table";
      document.getElementById("messageText").innerText = b;
      OneView.core.domHandler.addClickEvent(
        "messageOk",
        function () {
          e.hideMessage(c);
        },
        this
      );
    }
    hideMessage(b) {
      document.getElementById("message").style.display = "none";
      b && OneView.core.appStateHandler.back();
    }
    showColorPickerWindow() {
      OneView.core.commonUserSettings.licenceColorPicker
        ? (document.getElementById("colorPickerWindow").style.display = "table")
        : ((document.getElementById("noColorPickerWindow").style.display =
            "table"),
          OneView.core.domHandler.addClickEvent(
            "gotoShopOk",
            this.gotoShop,
            this
          ),
          OneView.core.domHandler.addClickEvent(
            "gotoShopCancel",
            this.hideNoColorPickerWindow,
            this
          ));
    }
    hideColorPickerWindow() {
      document.getElementById("colorPickerWindow").style.display = "none";
    }
    hideNoColorPickerWindow() {
      document.getElementById("noColorPickerWindow").style.display = "none";
    }
    gotoShop() {
      OneView.core.appStateHandler.viewShop();
    }
    updateRecurrenceHtml() {
      this.canEditReccur = true;
      this.calendarEvent.isRecurring &&
        this.editType != OneView.EventEditType.ThisOnly &&
        (document.getElementById("editEventRecurrence").innerHTML =
          "YES (Press to edit)");
      this.calendarEvent.isRecurring &&
        this.editType == OneView.EventEditType.ThisOnly &&
        ((this.canEditReccur = false),
        (document.getElementById("editEventRecurrence").innerHTML =
          OneView.core.translate.get("Not possible")),
        document
          .getElementById("editEventRecurrence")
          .setAttribute("style", "cursor: default"),
        document
          .getElementById("editEventRecurrence")
          .removeEventListener("touchend", this.editRecurrency, false),
        document
          .getElementById("editEventRecurrence")
          .removeEventListener("mouseup", this.editRecurrency, false));
      this.calendarEvent.isRecurring ||
        (document.getElementById("editEventRecurrence").innerHTML =
          "NO (Press to add)");
    }
    autoAdjustSoNotNegativeTime() {
      this.calendarEvent.startDateTime >= this.calendarEvent.endDateTime &&
        ((this.calendarEvent.endDateTime = moment(
          this.calendarEvent.startDateTime
        )
          .add(1, "hours")
          .toDate()),
        this.updateRealDateInputs(),
        this.updateFakes());
    }
    showFakeTimeStart() {
      this.autoAdjustSoNotNegativeTime();
    }
    showFakeTimeEnd() {
      this.calendarEvent.startDateTime >= this.calendarEvent.endDateTime &&
        ((this.calendarEvent.startDateTime = moment(
          this.calendarEvent.endDateTime
        )
          .add(-1, "hours")
          .toDate()),
        this.updateRealDateInputs(),
        this.updateFakes());
    }
    dateToValue(a) {
      this.timezoneOffset = 6e4 * a.getTimezoneOffset();
      return new Date(a.getTime() - this.timezoneOffset)
        .toISOString()
        .replace("Z", "")
        .split("T")[0];
    }
    timeToValue(a) {
      this.timezoneOffset = 6e4 * a.getTimezoneOffset();
      return new Date(a.getTime() - this.timezoneOffset)
        .toISOString()
        .replace("Z", "")
        .split("T")[1];
    }
    valueToDate(a) {
      return new Date(new Date(a).getTime() + this.timezoneOffset);
    }
    rruleFetched(a) {
      a && (this.originalRRule = this.calendarEvent.rruleToSave = a);
    }
    hide() {
      OneView.core.appStateHandler.editEventControlIsShowing = false;
      OneView.core.domHandler.showCanvas();
      OneView.core.domHandler.removeElement(this.editPage.id);
    }
    startChanged(b) {
      var c = this;
      new OneView.Helper().isAndroid()
        ? (this.readDateTimeToCalendarEvent(),
          this.updateEndBasedOnDuration(),
          this.autoAdjustSoNotNegativeTime(),
          b.target.blur())
        : ((this.lastStartChangedOnWeb = OneView.core.getTimeStamp()),
          (this.startChangedOnWeb = this.startChangedOnWeb.bind(this)),
          window.setTimeout(function () {
            c.startChangedOnWeb(b);
          }, 700));
    }
    startChangedOnWeb(b) {
      OneView.core.getTimeStamp() < this.lastStartChangedOnWeb + 600 ||
        (this.readDateTimeToCalendarEvent(),
        this.updateEndBasedOnDuration(),
        this.autoAdjustSoNotNegativeTime(),
        window.setTimeout(b.target.focus, 50));
    }
    endChanged(b) {
      var c = this;
      new OneView.Helper().isAndroid()
        ? (this.readDateTimeToCalendarEvent(),
          this.autoAdjustSoNotNegativeTime(),
          this.updateFakes(),
          this.updateDuration(),
          b.target.blur())
        : ((this.lastEndChangedOnWeb = OneView.core.getTimeStamp()),
          (this.endChangedOnWeb = this.endChangedOnWeb.bind(this)),
          window.setTimeout(function () {
            c.endChangedOnWeb(b);
          }, 700));
    }
    endChangedOnWeb(b) {
      OneView.core.getTimeStamp() < this.lastEndChangedOnWeb + 600 ||
        (this.readDateTimeToCalendarEvent(),
        this.autoAdjustSoNotNegativeTime(),
        this.updateFakes(),
        this.updateDuration(),
        window.setTimeout(b.target.focus, 50));
    }
    updateFakes() {
      document.getElementById("fakeDateStart").innerText =
        OneView.core.helper.GetDateWithWeekDay(
          this.calendarEvent.startDateTime
        );
      document.getElementById("fakeDateEnd").innerText =
        OneView.core.helper.GetDateWithWeekDay(this.calendarEvent.endDateTime);
    }
    updateRealDateInputs() {
      document.getElementById("editEventDateStart").value = this.dateToValue(
        this.calendarEvent.startDateTime
      );
      document.getElementById("editEventTimeStart").value = this.timeToValue(
        this.calendarEvent.startDateTime
      );
      document.getElementById("editEventDateEnd").value = this.dateToValue(
        this.calendarEvent.endDateTime
      );
      document.getElementById("editEventTimeEnd").value = this.timeToValue(
        this.calendarEvent.endDateTime
      );
    }
    validateStartAndEnd() {
      return this.calendarEvent.startDateTime >= this.calendarEvent.endDateTime
        ? (this.showMessage("Please enter a valid end time.", false), false)
        : true;
    }
    validateTitle(a) {
      return null == a || 0 == a.length
        ? (this.showMessage("Please enter a title.", false), false)
        : true;
    }
    editEventOk(b) {
      b.preventDefault();
      b = document.getElementById("editEventTitle").value;
      if (
        this.validateTitle(b) &&
        (this.readDateTimeToCalendarEvent(),
        this.validateStartAndEnd() &&
          !(300 > OneView.core.getTimeStamp() - this.timestamp))
      ) {
        var c;
        this.calendarEvent.reminders = [];
        for (c = 0; c < this.remindersSelectElement.options.length; c++)
          this.remindersSelectElement.options[c].selected &&
            this.calendarEvent.reminders.push(
              new OneView.Reminder(
                +this.remindersSelectElement.options[c].value
              )
            );
        this.calendarEvent.summary = b;
        this.calendarEvent.location =
          document.getElementById("editEventLocation").value;
        this.calendarEvent.description =
          document.getElementById("editEventDetails").value;
        b = this.calendarEvent.calendarId;
        c = document.getElementById("editEventCalendar").value;
        OneView.core.commonUserSettings.calendarIdLastAddedTo = c;
        OneView.core.persistChangesToCalendars();
        this.editType != OneView.EventEditType.New && b != c
          ? (OneView.core.calendarDataProxy.deleteEvent(
              this.calendarEvent,
              this.editType,
              true
            ),
            (this.calendarEvent.calendarId = c),
            OneView.core.calendarDataProxy.addNewEvent(
              this.calendarEvent,
              true
            ))
          : ((this.calendarEvent.calendarId = c),
            this.editType == OneView.EventEditType.New
              ? OneView.core.calendarDataProxy.addNewEvent(
                  this.calendarEvent,
                  false
                )
              : (this.editType == OneView.EventEditType.DontKnow &&
                  (this.editType = OneView.EventEditType.AllInSeries),
                OneView.core.calendarDataProxy.editExistingEvent(
                  this.calendarEvent,
                  this.editType
                )));
        void 0 !== this.calendarEvent.reminders &&
        0 < this.calendarEvent.reminders.length &&
        !OneView.core.commonUserSettings.hasShownRemindersInfo
          ? (this.showMessage(
              "You have set reminders. Please note that this app relies on your default calendar to show the reminders.",
              true
            ),
            (OneView.core.commonUserSettings.hasShownRemindersInfo = true))
          : OneView.core.appStateHandler.back();
      }
    }
    readDateTimeToCalendarEvent() {
      this.calendarEvent.startDateTime = this.valueToDate(
        document.getElementById("editEventDateStart").value +
          "T" +
          this.addMiliseconds(
            document.getElementById("editEventTimeStart").value
          ) +
          "Z"
      );
      this.calendarEvent.endDateTime = this.valueToDate(
        document.getElementById("editEventDateEnd").value +
          "T" +
          this.addMiliseconds(
            document.getElementById("editEventTimeEnd").value
          ) +
          "Z"
      );
      OneView.core.zopHandler.updateStartEndZOP(this.calendarEvent);
      OneView.core.calendarEventHandler.gradeCalendarEvent(this.calendarEvent);
      OneView.core.calendarEventHandler.reorderAllEvents();
    }
    addMiliseconds(a) {
      return 5 == a.length ? a + ":00.000" : 8 == a.length ? a + ".000" : a;
    }
    editEventCancel(b) {
      b.preventDefault();
      this.calendarEvent.startDateTime = this.originalStartDate;
      this.calendarEvent.endDateTime = this.originalEndDate;
      this.calendarEvent.rruleToSave = this.originalRRule;
      this.calendarEvent.isRecurring = this.originalIsRecurring;
      OneView.core.zopHandler.updateStartEndZOP(this.calendarEvent);
      OneView.core.calendarEventHandler.gradeCalendarEvent(this.calendarEvent);
      OneView.core.calendarEventHandler.reorderAllEvents();
      OneView.core.appStateHandler.back();
    }
    doNothing(a) {}
    editEventDurationChanged(b) {
      b = OneView.core.domHandler.getSelectOptions(this.durationSelectElement);
      this.calendarEvent.endDateTime = moment(this.calendarEvent.startDateTime)
        .add("milliseconds", b)
        .toDate();
      this.updateRealDateInputs();
      this.updateFakes();
    }
    updateEndBasedOnDuration() {
      this.calendarEvent.endDateTime = moment(this.calendarEvent.startDateTime)
        .add("milliseconds", this.previousDuration)
        .toDate();
      this.updateRealDateInputs();
      this.updateFakes();
    }
    updateDuration() {
      this.previousDuration =
        this.calendarEvent.endDateTime.getTime() -
        this.calendarEvent.startDateTime.getTime();
      OneView.core.domHandler.addDurationsToSelectNode(
        this.durationSelectElement,
        this.calendarEvent.startDateTime,
        this.calendarEvent.endDateTime
      );
    }
    updateReminders() {
      void 0 == this.calendarEvent.reminders &&
        (this.calendarEvent.reminders = []);
      OneView.core.domHandler.addRemindersToSelectNode(
        this.remindersSelectElement,
        this.calendarEvent.reminders
      );
    }
    setByDuration(a) {}
    setByTime(a) {}
    editRecurrency(b) {
      this.canEditReccur &&
        OneView.core.appStateHandler.editRecurrence(this.calendarEvent);
    }
    moveEvent(b) {
      this.readDateTimeToCalendarEvent();
      this.hide();
      OneView.core.appStateHandler.startMoveCalendarEventObject(
        this.calendarEvent,
        OneView.core.domHandler.screenWidth / 2,
        OneView.core.domHandler.screenHeight / 2,
        OneView.EventEditType.DontKnow
      );
    }
  }

  export class EditRecurrenceControl {
    constructor() {
      this.pageHtml =
        '<div id="editRecurrenceTopBar" class="topBar">    <button id="editRecurrenceCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/></span><span>{#Cancel#}</span></button>    <button id="editRecurrenceOk" class="topBarButton" style="width:50%"><img src="images/check.svg" class="topBarImage"/></span><span>{#Ok#}</span></button></div><div class="pageContent" id="editRecurrenceArea" style="float:left; background-color: #E9E9E9;">        <div class="editRecurrencePopupContent pageTopPadding" id="editRecurrencePopupContent">            <div class="miniTitle sizedTitle">{#Frequency#}</div>            <div style="position: relative"><div class="inputBox">                <select class="base inputBase" id="editRecurrenceFrequency">                    <option class="inputOption" value="none">{#Not repeated#}</option>                    <option class="inputOption" value="day">{#Day#}</option>                    <option class="inputOption" value="week">{#Week#}</option>                    <option class="inputOption" value="month">{#Month#}</option>                    <option class="inputOption" value="year">{#Year#}</option>                </select>            </div></div>            <div id="daySelectionArea">                <div class="miniTitle sizedTitle">{#Every X day(s)#}</div>                <div style="position: relative"><div class="inputBox">                    <input type="number" class="base inputBase" name="task" id="dayInterval">                </div></div>            </div>            <div id="weekSelectionArea">                <div class="miniTitle sizedTitle">{#Every X week(s)#}</div>                <div style="position: relative"><div class="inputBox">                    <input type="number" class="base inputBase" name="task" id="weekInterval">                </div></div>                <div class="miniTitle sizedTitle">{#Week days#}</div>                <div style="position: relative"><div class="inputBox">                    <select id="weekDays" class="base inputBase maybeBig" multiple="multiple">                    </select>                </div></div>            </div>            <div id="monthSelectionArea">                <div class="miniTitle sizedTitle">{#Every X month(s)#}</div>                <div style="position: relative"><div class="inputBox">                    <input type="number" class="base inputBase" name="task" id="monthInterval">                </div></div>                <div class="miniTitle sizedTitle">{#Type#}</div>                <div style="position: relative"> <div class="inputBox">                     <select class="base inputBase" id="editRecurrenceMonthType">                        <option class="inputOption" value="date">?</option>                        <option class="inputOption" value="weekday">?</option>                    </select>                </div></div>            </div>            <div id="yearSelectionArea">                <div class="miniTitle sizedTitle">{#Every X year(s)#}</div>                <div style="position: relative"><div class="inputBox">                    <input type="number" class="base inputBase" name="task" id="yearInterval">                </div></div>            </div>            <div class="miniTitle sizedTitle">{#End#}</div>                <div style="position: relative"><div class="inputBox">                     <select class="base inputBase" id="editRecurrenceEnd">                         <option class="inputOption" value="forever">{#Forever#}</option>                         <option class="inputOption" value="untildate">{#End before a date#}</option>                         <option class="inputOption" value="numberoftimes">{#Repeat X times#}</option>                    </select>                </div></div>                <div class="miniTitle sizedTitle" id="numberoftimes_input_title">{#Repeat X times#}</div>                <div style="position: relative"><div class="inputBox">                     <input type="number" class="base inputBase" name="task" id="numberoftimes_input">                </div></div>                <div class="miniTitle sizedTitle" id="untildate_input_title">{#End before#}</div>                <div style="position: relative"><div class="inputBox">                     <input type="date" class="base inputBase inputDate" name="task" id="untildate_input">                </div></div>            </div>        </div></div><br/><br/>';
    }
    reshow() {
      this.show();
    }
    init(a) {
      this.calendarEvent = a;
    }
    show() {
      var b = this;
      OneView.core.calendarDataProxy.analyticsPage("Edit recurrence page");
      this.editPage = OneView.core.domHandler.pageHtmlFormatHelper(
        "editRecurrence",
        this.pageHtml
      );
      this.editPage.style.display = "block";
      OneView.core.domHandler.resizeDomElements();
      OneView.core.domHandler.resizeDomElements();
      OneView.core.domHandler.resizeDomElements =
        OneView.core.domHandler.resizeDomElements.bind(OneView.core.domHandler);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 0);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 100);
      var c = (OneView.core.settings.titleWidth / OneView.core.ratio - 24) / 2;
      document.getElementById("editRecurrenceOk").style.padding = c + "px";
      document.getElementById("editRecurrenceCancel").style.padding = c + "px";
      document.getElementById("editRecurrenceArea").style.top = "54px";
      this.editRecurrenceFrequency = document.getElementById(
        "editRecurrenceFrequency"
      );
      this.daySelectionArea = document.getElementById("daySelectionArea");
      this.weekSelectionArea = document.getElementById("weekSelectionArea");
      this.monthSelectionArea = document.getElementById("monthSelectionArea");
      this.yearSelectionArea = document.getElementById("yearSelectionArea");
      this.dayInterval = document.getElementById("dayInterval");
      this.weekInterval = document.getElementById("weekInterval");
      this.monthInterval = document.getElementById("monthInterval");
      this.yearInterval = document.getElementById("yearInterval");
      this.weekDays = document.getElementById("weekDays");
      this.editRecurrenceMonthType = document.getElementById(
        "editRecurrenceMonthType"
      );
      this.editRecurrenceEnd = document.getElementById("editRecurrenceEnd");
      this.numberoftimes_input_title = document.getElementById(
        "numberoftimes_input_title"
      );
      this.untildate_input_title = document.getElementById(
        "untildate_input_title"
      );
      this.numberoftimes_input = document.getElementById("numberoftimes_input");
      this.untildate_input = document.getElementById("untildate_input");
      OneView.core.domHandler.addWeekDaysToSelectNode(this.weekDays);
      OneView.core.domHandler.addEvent(
        "editRecurrenceFrequency",
        "change",
        this.editRecurrenceFrequencyChanged,
        this
      );
      OneView.core.domHandler.addEvent(
        "editRecurrenceEnd",
        "change",
        this.editRecurrenceEndChanged,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "editRecurrenceOk",
        this.editRecurrenceOk,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "editRecurrenceCancel",
        this.editRecurrenceCancel,
        this
      );
      this.loadSettings = this.loadSettings.bind(this);
      c = OneView.core.translate
        .get("On day %1 of each month")
        .replace("%1", "" + this.calendarEvent.startDateTime.getDate());
      this.editRecurrenceMonthType[0].text = c;
      var c = OneView.core.translate.get("On %1, week %2 of each month"),
        e = Math.floor(this.calendarEvent.startDateTime.getDate() / 7) + 1,
        c = c.replace(
          "%1",
          "" + moment(this.calendarEvent.startDateTime).format("dddd")
        ),
        c = c.replace("%2", "" + e);
      this.editRecurrenceMonthType[1].text = c;
      var f = this;
      OneView.core.dynamicallyLoadFile("libs/rrule.js", "js", function () {
        void 0 === b.calendarEvent.rruleToSave &&
          ((b.calendarEvent.rruleToSave = new RRule()),
          (b.calendarEvent.rruleToSave.options.count = 10),
          (b.calendarEvent.rruleToSave.options.freq =
            OneView.RRuleFrequencies.Week),
          (b.calendarEvent.rruleToSave.options.interval = 1),
          (b.calendarEvent.rruleToSave.options.byweekday = [
            b.calendarEvent.startDateTime.getDay() - 1,
          ]));
        f.loadSettings(b.calendarEvent.rruleToSave);
      });
      this.editPage.style.display = "block";
    }
    loadSettings(b) {
      this.yearInterval.value = b.options.interval.toString();
      this.monthInterval.value = b.options.interval.toString();
      this.weekInterval.value = b.options.interval.toString();
      this.dayInterval.value = b.options.interval.toString();
      if (b.options.freq == OneView.RRuleFrequencies.Year)
        this.editRecurrenceFrequency.value = "year";
      else if (b.options.freq == OneView.RRuleFrequencies.Month)
        (this.editRecurrenceFrequency.value = "month"),
          (this.editRecurrenceMonthType.value =
            void 0 == b.options.bynweekday || 0 == b.options.bynweekday.length
              ? "date"
              : "weekday");
      else if (b.options.freq == OneView.RRuleFrequencies.Week) {
        this.editRecurrenceFrequency.value = "week";
        for (var c = 0; c < this.weekDays.options.length; c++)
          this.weekDays.options[c].selected = false;
        this.weekDays.options[0].selected =
          -1 < b.options.byweekday.indexOf(OneView.RRuleWeekDay.Monday);
        this.weekDays.options[1].selected =
          -1 < b.options.byweekday.indexOf(OneView.RRuleWeekDay.Tuesday);
        this.weekDays.options[2].selected =
          -1 < b.options.byweekday.indexOf(OneView.RRuleWeekDay.Wednesday);
        this.weekDays.options[3].selected =
          -1 < b.options.byweekday.indexOf(OneView.RRuleWeekDay.Thursday);
        this.weekDays.options[4].selected =
          -1 < b.options.byweekday.indexOf(OneView.RRuleWeekDay.Friday);
        this.weekDays.options[5].selected =
          -1 < b.options.byweekday.indexOf(OneView.RRuleWeekDay.Saturday);
        this.weekDays.options[6].selected =
          -1 < b.options.byweekday.indexOf(OneView.RRuleWeekDay.Sunday);
      } else
        b.options.freq == OneView.RRuleFrequencies.Day &&
          (this.editRecurrenceFrequency.value = "day");
      0 < b.options.count
        ? ((this.editRecurrenceEnd.value = "numberoftimes"),
          (this.numberoftimes_input.value = b.options.count.toString()))
        : void 0 !== b.options.until && null !== b.options.until
        ? ((this.editRecurrenceEnd.value = "untildate"),
          (this.untildate_input.value = moment(b.options.until).format(
            "YYYY-MM-DD"
          )))
        : (this.editRecurrenceEnd.value = "forever");
      this.editRecurrenceEndChanged(null);
      this.editRecurrenceFrequencyChanged(null);
    }
    hide() {
      OneView.core.domHandler.removeElement(this.editPage.id);
    }
    editRecurrenceFrequencyChanged(a) {
      this.daySelectionArea.style.display = "none";
      this.weekSelectionArea.style.display = "none";
      this.monthSelectionArea.style.display = "none";
      this.yearSelectionArea.style.display = "none";
      "day" == this.editRecurrenceFrequency.value &&
        (this.daySelectionArea.style.display = "block");
      "week" == this.editRecurrenceFrequency.value &&
        (this.weekSelectionArea.style.display = "block");
      "month" == this.editRecurrenceFrequency.value &&
        (this.monthSelectionArea.style.display = "block");
      "year" == this.editRecurrenceFrequency.value &&
        (this.yearSelectionArea.style.display = "block");
    }
    editRecurrenceEndChanged(a) {
      this.untildate_input.style.display = "none";
      this.numberoftimes_input.parentElement.parentElement.style.display =
        "none";
      this.untildate_input_title.style.display = "none";
      this.numberoftimes_input_title.style.display = "none";
      "numberoftimes" == this.editRecurrenceEnd.value &&
        ((this.numberoftimes_input.parentElement.parentElement.style.display =
          "block"),
        (this.numberoftimes_input_title.style.display = "block"));
      "untildate" == this.editRecurrenceEnd.value &&
        ((this.untildate_input.style.display = "block"),
        (this.untildate_input_title.style.display = "block"));
    }
    editRecurrenceOk(b) {
      b = new RRule();
      if ("year" == this.editRecurrenceFrequency.value)
        (b.options.freq = OneView.RRuleFrequencies.Year),
          (b.options.interval = this.yearInterval.valueAsNumber);
      else if ("month" == this.editRecurrenceFrequency.value) {
        if (
          ((b.options.freq = OneView.RRuleFrequencies.Month),
          (b.options.interval = this.monthInterval.valueAsNumber),
          "date" != this.editRecurrenceMonthType.value)
        )
          if ("weekday" == this.editRecurrenceMonthType.value) {
            var c =
              Math.floor(this.calendarEvent.startDateTime.getDate() / 7) + 1;
            b.options.bynweekday = [];
            b.options.bynweekday.push(c);
            b.options.bynweekday.push(
              this.calendarEvent.startDateTime.getDay() - 1
            );
          } else throw "not date or weekday";
      } else
        "week" == this.editRecurrenceFrequency.value
          ? ((b.options.freq = OneView.RRuleFrequencies.Week),
            (b.options.byweekday = []),
            (b.options.interval = this.weekInterval.valueAsNumber),
            this.weekDays.options[0].selected &&
              b.options.byweekday.push(OneView.RRuleWeekDay.Monday),
            this.weekDays.options[1].selected &&
              b.options.byweekday.push(OneView.RRuleWeekDay.Tuesday),
            this.weekDays.options[2].selected &&
              b.options.byweekday.push(OneView.RRuleWeekDay.Wednesday),
            this.weekDays.options[3].selected &&
              b.options.byweekday.push(OneView.RRuleWeekDay.Thursday),
            this.weekDays.options[4].selected &&
              b.options.byweekday.push(OneView.RRuleWeekDay.Friday),
            this.weekDays.options[5].selected &&
              b.options.byweekday.push(OneView.RRuleWeekDay.Saturday),
            this.weekDays.options[6].selected &&
              b.options.byweekday.push(OneView.RRuleWeekDay.Sunday))
          : "day" == this.editRecurrenceFrequency.value &&
            ((b.options.freq = OneView.RRuleFrequencies.Day),
            (b.options.interval = this.dayInterval.valueAsNumber));
      b.options.count = void 0;
      b.options.until = void 0;
      "untildate" == this.editRecurrenceEnd.value
        ? (b.options.until = new Date(this.untildate_input.value))
        : "numberoftimes" == this.editRecurrenceEnd.value &&
          (b.options.count = +this.numberoftimes_input.value);
      this.calendarEvent.rruleToSave = b;
      this.calendarEvent.isRecurring =
        "none" !== this.editRecurrenceFrequency.value;
      this.hide();
      history.back();
    }
    editRecurrenceCancel(a) {
      this.hide();
      history.back();
    }
  }

  export class ViewEventControl {
    constructor() {
      this.pageHtml =
        '<div id="editRecurrenceMenu" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div id="editRecurrenceOnlyOne" class="base menuItem">{#Only edit this event#}</div>    <div id="editRecurrenceAll" class="base menuItem">{#Edit the whole series#}</div>    \x3c!--<div id="editRecurrenceFuture" class="base menuItem">{#Edit this and future events#}</div>--\x3e    <div id="editRecurrenceCancel" class="base menuItem">{#Cancel#}</div></div></div></div><div id="noEditMenu" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItemInfo">{#Sorry, this event can\'t be edited#}</div>    <div id="noEditOk" class="base menuItem">{#Ok#}</div></div></div></div><div id="deleteConfirmPopup" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItem" style="text-align:center">{#Delete?#}</div>    <div>        <button id="deleteConfirmCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>        <button id="deleteConfirmOk" class="topBarButton" style="width:50%"><img src="images/check.svg" class="topBarImage"/><span>{#Ok#}</span></button>    </div></div></div></div><div id="deleteRecurrenceMenu" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div id="deleteRecurrenceOnlyOne" class="base menuItem">{#Only delete this event#}</div>    <div id="deleteRecurrenceAll" class="base menuItem">{#Delete the whole series#}</div>    \x3c!--<div id="deleteRecurrenceFuture" class="base menuItem">{#Delete this and future events#}</div>--\x3e    <div id="deleteRecurrenceCancel" class="base menuItem">{#Cancel#}</div></div></div></div><div id="viewEventTopBar" class="topBar">    <button id="viewEventBack" class="topBarButton" style="width:39%">        _insertBackButtonImage        <span id="viewEventBackText" style="color: _buttonImageColor">{#Back#}</span>    </button>    \x3c!--<button id="viewEventMove" class="topBarButton" style="width:?%"><img src="images/clock.svg" class="topBarImage"/><span id="viewEventMoveText">{#Move#}</span></button>--\x3e    <button id="viewEventDelete" class="topBarButton" style="width:23%">        _insertTrashButtonImage    </button>    <button id="viewEventEdit" class="topBarButton" style="width:38%">        _insertPencilButtonImage        <span id="viewEventEditText" style="color: _buttonImageColor">{#Edit#}</span>    </button></div><div class="pageContent" id="viewEventArea" style="float:left">    <div id="viewEventTitle" class="topBarTitleX" style="width:100%"></div>    <div class="pagePadding pageTopPadding" style="padding-left:20px;padding-right:20px;">        <div class="editEventPopupContent" id="editEventPopupContent">            <br>            <br>            <div>                <div class="miniTitle">{#When#}</div>                <div class="pageContentText" id="viewEventTime1"></div>                <div class="pageContentText" id="viewEventTime2"></div>                <br>            </div>            <div id="viewEventBoxWhere">                <div class="miniTitle" id="viewEventTitleWhere">{#Where#}</div>                <div class="pageContentText" id="viewEventLocation"></div>                <br>            </div>            <div id="viewEventBoxDetails">                <div class="miniTitle" id="viewEventTitleDetails">{#Details#}</div>                <div class="pageContentText" id="viewEventDetails" style="white-space: pre-wrap;"></div>                <br>            </div>            <div>                <div class="miniTitle">{#Calendar#}</div>                <div class="pageContentText" id="viewEventCalendar"></div>                <br>            </div>            <div id="viewEventBoxReminders">                <div class="miniTitle">{#Reminders#}</div>                <div class="pageContentText" id="viewEventReminders"></div>                <br>            </div>            <div id="viewEventBoxInvited">                <div class="miniTitle">{#Invited#}</div>                <div class="pageContentText" id="viewEventInvited"></div>                <br>            </div>        </div>    </div></div><br/><br/>';
    }
    init(a) {
      this.calendarEvent = a;
    }
    reshow() {
      this.show();
    }
    show() {
      OneView.core.domHandler.hideCanvas();
      OneView.core.calendarDataProxy.analyticsPage("View event page");
      var b = OneView.core.domHandler.insertImages(
        this.pageHtml,
        OneView.core.helper.getEventTextColor(
          this.calendarEvent,
          OneView.core.getCalendar(this.calendarEvent.calendarId)
        )
      );
      this.viewPage = OneView.core.domHandler.pageHtmlFormatHelper(
        "viewEvent",
        b
      );
      OneView.core.domHandler.resizeDomElements(
        OneView.core.helper.getEventColor2(this.calendarEvent)
      );
      OneView.core.domHandler.resizeDomElements(
        OneView.core.helper.getEventColor2(this.calendarEvent)
      );
      b = (OneView.core.settings.titleWidth / OneView.core.ratio - 24) / 2;
      document.getElementById("viewEventBack").style.padding = b + "px";
      document.getElementById("viewEventEdit").style.padding = b + "px";
      document.getElementById("viewEventDelete").style.padding = b + "px";
      document.getElementById("viewEventArea").style.top = "54px";
      OneView.core.showBackButtons()
        ? OneView.core.domHandler.addClickEvent(
            "viewEventBack",
            this.viewEventBack,
            this
          )
        : (OneView.core.domHandler.removeElement("viewEventBack"),
          (document.getElementById("viewEventEdit").style.width = "50%"),
          (document.getElementById("viewEventDelete").style.width = "50%"));
      OneView.core.calendarEventHandler.canEditEvent(this.calendarEvent)
        ? (OneView.core.domHandler.addClickEvent(
            "viewEventEdit",
            this.viewEventEdit,
            this
          ),
          OneView.core.domHandler.addClickEvent(
            "viewEventDelete",
            this.viewEventDelete,
            this
          ))
        : (OneView.core.domHandler.removeElement("viewEventEdit"),
          OneView.core.domHandler.removeElement("viewEventDelete"),
          OneView.core.showBackButtons() &&
            (document.getElementById("viewEventBack").style.width = "100%"));
      b = document.createElement("a");
      b.href =
        "https://web.archive.org/web/20190808203716/http://maps.google.com/?q=" +
        this.calendarEvent.location;
      b.className = "blueLink";
      OneView.core.domHandler.addElement(b, "viewEventLocation");
      this.viewPage.style.display = "block";
      document.getElementById("viewEventTitle").textContent =
        this.calendarEvent.summary;
      document.getElementById("viewEventTitle").style.color =
        OneView.core.helper.getEventTextColor(
          this.calendarEvent,
          OneView.core.getCalendar(this.calendarEvent.calendarId)
        );
      b.textContent = this.calendarEvent.location;
      document.getElementById("viewEventTime1").textContent =
        OneView.core.helper.GetDateTimeLine1(
          this.calendarEvent.startDateTime,
          this.calendarEvent.endDateTime
        );
      document.getElementById("viewEventTime2").textContent =
        OneView.core.helper.GetDateTimeLine2(
          this.calendarEvent.startDateTime,
          this.calendarEvent.endDateTime
        );
      document.getElementById("viewEventDetails").textContent =
        this.calendarEvent.description;
      document.getElementById("viewEventCalendar").textContent =
        OneView.core.getCalendar(this.calendarEvent.calendarId).name;
      if (
        void 0 == this.calendarEvent.location ||
        0 === this.calendarEvent.location.length
      )
        document.getElementById("viewEventBoxWhere").hidden = true;
      if (
        void 0 == this.calendarEvent.description ||
        0 === this.calendarEvent.description.length
      )
        document.getElementById("viewEventBoxDetails").hidden = true;
      document.getElementById("viewEventReminders").textContent =
        this.remindersToString();
      if (
        void 0 == this.calendarEvent.reminders ||
        0 === this.calendarEvent.reminders.length
      )
        document.getElementById("viewEventBoxReminders").hidden = true;
      if (
        void 0 == this.calendarEvent.invited ||
        0 === this.calendarEvent.invited.length
      )
        document.getElementById("viewEventBoxInvited").hidden = true;
      this.resize();
    }
    resize() {
      var a;
      a = this.verifySize("Back", false);
      a = this.verifySize("Edit", a);
      a = this.verifySize("Back", a);
      this.verifySize("Edit", a);
    }
    remindersToString() {
      if (
        void 0 == this.calendarEvent.reminders ||
        0 == this.calendarEvent.reminders.length
      )
        return "None";
      var a,
        c = "";
      for (a = 0; a < this.calendarEvent.reminders.length; a++)
        (c += this.reminderToString(this.calendarEvent.reminders[a])),
          a < this.calendarEvent.reminders.length - 1 && (c += ", ");
      return c;
    }
    reminderToString(a) {
      return 60 == a.minutes
        ? "1 hour"
        : 90 == a.minutes
        ? "1.5 hours"
        : 120 == a.minutes
        ? "2 hours"
        : 180 == a.minutes
        ? "3 hours"
        : 360 == a.minutes
        ? "6 hours"
        : 720 == a.minutes
        ? "12 hours"
        : 1440 == a.minutes
        ? "24 hours"
        : 2880 == a.minutes
        ? "2 days"
        : 10080 == a.minutes
        ? "1 week"
        : a.minutes + " minutes";
    }
    verifySize(b, c) {
      if (document.getElementById("viewEvent" + b)) {
        var e = document.getElementById("viewEvent" + b),
          f = document.getElementById("viewEvent" + b + "Text"),
          g = e.offsetWidth,
          g = g - (e.offsetHeight - 10),
          e = OneView.core.domHandler.getTextLength(
            f.textContent,
            f.style.fontSize
          );
        if (g < e + 18 || c)
          return (
            (document.getElementById("viewEvent" + b + "Text").style.display =
              "none"),
            true
          );
        document.getElementById("viewEvent" + b + "Text").style.display =
          "inline";
        return false;
      }
    }
    hide() {
      OneView.core.appStateHandler.viewEventControlIsShowing = false;
      OneView.core.domHandler.showCanvas();
      OneView.core.domHandler.removeElement(this.viewPage.id);
    }
    viewEventBack(b) {
      OneView.core.appStateHandler.back();
    }
    viewEventDelete(b) {
      OneView.core.calendarEventHandler.canEditEvent(this.calendarEvent) &&
        (this.calendarEvent.isRecurring && this.calendarEvent.recurringEventId
          ? this.showDeleteRecurrenceMenu()
          : this.showDeleteConfirm());
    }
    deleteEvent() {
      OneView.core.appStateHandler.back();
      OneView.core.appStateHandler.deleteEvent(
        this.calendarEvent,
        OneView.EventEditType.DontKnow
      );
    }
    viewEventEdit(b) {
      OneView.core.calendarEventHandler.canEditEvent(this.calendarEvent) &&
        (this.calendarEvent.isRecurring && this.calendarEvent.recurringEventId
          ? OneView.core.calendarDataProxy.canEditRecurring(this.calendarEvent)
            ? this.showEditRecurrenceMenu()
            : this.showNoEditMenu()
          : (OneView.core.appStateHandler.back(),
            OneView.core.appStateHandler.editEvent(
              this.calendarEvent,
              OneView.EventEditType.DontKnow
            )));
    }
    showNoEditMenu() {
      document.getElementById("noEditMenu").style.display = "table";
      OneView.core.domHandler.addClickEvent(
        "noEditOk",
        this.hideNoEditMenu,
        this
      );
    }
    hideNoEditMenu() {
      document.getElementById("noEditMenu").style.display = "none";
    }
    showDeleteConfirm() {
      document.getElementById("deleteConfirmPopup").style.display = "table";
      OneView.core.domHandler.addClickEvent(
        "deleteConfirmOk",
        this.deleteEvent,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "deleteConfirmCancel",
        this.hideDeleteConfirm,
        this
      );
    }
    showEditRecurrenceMenu() {
      document.getElementById("editRecurrenceMenu").style.display = "table";
      OneView.core.domHandler.addClickEvent(
        "editRecurrenceOnlyOne",
        this.editRecurrenceOnlyOne,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "editRecurrenceAll",
        this.editRecurrenceAll,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "editRecurrenceCancel",
        this.hideEditRecurrenceMenu,
        this
      );
    }
    editRecurrenceOnlyOne() {
      this.hideEditRecurrenceMenu();
      OneView.core.appStateHandler.back();
      OneView.core.appStateHandler.editEvent(
        this.calendarEvent,
        OneView.EventEditType.ThisOnly
      );
    }
    editRecurrenceAll() {
      this.hideEditRecurrenceMenu();
      OneView.core.appStateHandler.back();
      OneView.core.appStateHandler.editEvent(
        this.calendarEvent,
        OneView.EventEditType.AllInSeries
      );
    }
    editRecurrenceFuture() {
      this.hideEditRecurrenceMenu();
      OneView.core.appStateHandler.back();
      OneView.core.appStateHandler.editEvent(
        this.calendarEvent,
        OneView.EventEditType.ThisAndFuture
      );
    }
    hideEditRecurrenceMenu() {
      document.getElementById("editRecurrenceMenu").style.display = "none";
    }
    hideDeleteConfirm() {
      document.getElementById("deleteConfirmPopup").style.display = "none";
    }
    showDeleteRecurrenceMenu() {
      document.getElementById("deleteRecurrenceMenu").style.display = "table";
      OneView.core.domHandler.addClickEvent(
        "deleteRecurrenceOnlyOne",
        this.deleteRecurrenceOnlyOne,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "deleteRecurrenceAll",
        this.deleteRecurrenceAll,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "deleteRecurrenceCancel",
        this.hideDeleteRecurrenceMenu,
        this
      );
    }
    deleteRecurrenceOnlyOne() {
      this.hideDeleteRecurrenceMenu();
      OneView.core.appStateHandler.back();
      OneView.core.appStateHandler.deleteEvent(
        this.calendarEvent,
        OneView.EventEditType.ThisOnly
      );
    }
    deleteRecurrenceAll() {
      this.hideDeleteRecurrenceMenu();
      OneView.core.appStateHandler.back();
      OneView.core.appStateHandler.deleteEvent(
        this.calendarEvent,
        OneView.EventEditType.AllInSeries
      );
    }
    deleteRecurrenceFuture() {
      this.hideDeleteRecurrenceMenu();
      OneView.core.appStateHandler.back();
      OneView.core.appStateHandler.deleteEvent(
        this.calendarEvent,
        OneView.EventEditType.ThisAndFuture
      );
    }
    hideDeleteRecurrenceMenu() {
      document.getElementById("deleteRecurrenceMenu").style.display = "none";
    }
    viewEventMove(b) {
      this.hide();
      OneView.core.calendarEventHandler.canEditEvent(this.calendarEvent) &&
        OneView.core.appStateHandler.startMoveCalendarEventObject(
          this.calendarEvent,
          OneView.core.domHandler.screenWidth / 2,
          OneView.core.domHandler.screenHeight / 2,
          OneView.EventEditType.DontKnow
        );
    }
  }

  export class Helper {
    constructor() {
      this.monthesShort = new OneView.Hashtable();
      this.monthesLong = new OneView.Hashtable();
      this.weekdayShort = new OneView.Hashtable();
      this.weekdayLong = new OneView.Hashtable();
    }
    colorToRGBA(a, c) {
      var b = parseInt(a.substr(1), 16);
      return (
        "rgba(" +
        ((b >> 16) & 255) +
        "," +
        ((b >> 8) & 255) +
        "," +
        (b & 255) +
        "," +
        c +
        ")"
      );
    }
    GetDateTimeLine1(a, c) {
      var b = moment(a),
        f = moment(c);
      return this.IsSameDay(b, f)
        ? b.format("dddd") + ", " + b.format("LL")
        : 0 == b.hours() && b.minutes()
        ? b.format("dddd") + ", " + b.format("LL") + " - "
        : b.format("dddd") + ", " + b.format("LLL") + " - ";
    }
    GetDateTimeLine2(a, c) {
      var b = moment(a),
        f = moment(c);
      return this.IsSameDay(b, f)
        ? 0 == b.hours() &&
          0 == b.minutes() &&
          ((23 == f.hours() && 59 == f.minutes()) ||
            (0 == f.hours() && 0 == f.minutes()))
          ? ""
          : b.format("LT") + " - " + f.format("LT")
        : 0 == b.hours() && b.minutes()
        ? f.format("dddd") + ", " + f.format("LL")
        : f.format("dddd") + ", " + f.format("LLL");
    }
    IsSameDay(a, c) {
      return a.format("L") == c.clone().subtract(1, "minutes").format("L");
    }
    GetDateWithWeekDay(a) {
      a = moment(a);
      return a.format("dddd") + ", " + a.format("LL");
    }
    GetTime(a) {
      return moment(a).format("LT");
    }
    isNullOrEmpty(a) {
      return !a || 0 === a.length;
    }
    isAndroid() {
      return navigator.userAgent.match(/Android/i);
    }
    isBlackBerry() {
      return navigator.userAgent.match(/BlackBerry/i);
    }
    isiOS() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    }
    isOpera() {
      return navigator.userAgent.match(/Opera Mini/i);
    }
    isWindows() {
      return navigator.userAgent.match(/IEMobile/i);
    }
    isMobile() {
      return (
        this.isAndroid() ||
        this.isBlackBerry() ||
        this.isiOS() ||
        this.isOpera() ||
        this.isWindows()
      );
    }
    sortCalendars() {
      OneView.core.calendars.sort(function (b, c) {
        return c.id == OneView.core.calendarPrimaryId
          ? 1
          : b.id == OneView.core.calendarPrimaryId
          ? -1
          : c.canEditCalendarEvents && !b.canEditCalendarEvents
          ? 1
          : b.canEditCalendarEvents && !c.canEditCalendarEvents
          ? -1
          : b.allEventsAreFullDay && !c.allEventsAreFullDay
          ? 1
          : c.allEventsAreFullDay && !b.allEventsAreFullDay
          ? -1
          : b.countEvents - c.countEvents;
      });
      for (
        var b = 0,
          c = OneView.core.settings.theme.eventColors.length - 1,
          e = 0;
        e < OneView.core.calendars.length;
        e++
      )
        if (
          (OneView.core.calendars[e].allEventsAreFullDay &&
          !OneView.core.calendars[e].canEditCalendarEvents
            ? ((OneView.core.calendars[e].colorId = c), c--)
            : ((OneView.core.calendars[e].colorId = b), b++),
          0 > OneView.core.calendars[e].colorId &&
            (OneView.core.calendars[e].colorId = 0),
          OneView.core.calendars[e].colorId >
            OneView.core.settings.theme.eventColors.length &&
            (OneView.core.calendars[e].colorId =
              OneView.core.settings.theme.eventColors.length - 1),
          OneView.core.commonUserSettings.licenceColorPicker &&
            OneView.core.commonUserSettings.savedCalendarColors &&
            OneView.core.commonUserSettings.savedCalendarColors.containsKey(
              OneView.core.calendars[e].id
            ))
        ) {
          var f =
            OneView.core.commonUserSettings.savedCalendarColors[
              OneView.core.calendars[e].id
            ];
          -1 < Number(f) &&
            100 > Number(f) &&
            (OneView.core.calendars[e].colorId = f);
        }
    }
    replaceAll(a, c, e) {
      return a.split(c).join(e);
    }
    canShowDatePicker() {
      return OneView.core.isCordovaApp ? true : false;
    }
    setCalendarColorId(b, c) {
      var e = OneView.core.commonUserSettings.savedCalendarColors;
      OneView.core.commonUserSettings.licenceColorPicker &&
      e &&
      e.containsKey(b)
        ? (e[b] = c)
        : e.add(b, c);
      OneView.core.commonUserSettings.savedCalendarColors = e;
    }
    getEventColor2(b) {
      return this.getEventColor(b, OneView.core.getCalendar(b.calendarId));
    }
    getEventTextColor(b, c) {
      var e =
        OneView.core.settings.theme.eventTextColors[
          c.colorId % OneView.core.settings.theme.eventColors.length
        ];
      b &&
        void 0 != b.androidColorNum &&
        void 0 == b.extraColorId &&
        (b.extraColorId = this.getColorIdFromAndroidNum(b.androidColorNum));
      return b && b.extraColorId
        ? OneView.core.settings.theme.eventTextColors[
            b.extraColorId % OneView.core.settings.theme.eventTextColors.length
          ]
        : e;
    }
    getCalendarColor(b) {
      return OneView.core.settings.theme.eventColors[
        b.colorId % OneView.core.settings.theme.eventColors.length
      ];
    }
    getEventColor(b, c) {
      var e =
        OneView.core.settings.theme.eventColors[
          c.colorId % OneView.core.settings.theme.eventColors.length
        ];
      b &&
        void 0 != b.androidColorNum &&
        void 0 == b.extraColorId &&
        (b.extraColorId = this.getColorIdFromAndroidNum(b.androidColorNum));
      if (b && b.extraColorId)
        return OneView.core.settings.theme.eventColors[
          b.extraColorId % OneView.core.settings.theme.eventColors.length
        ];
      "" === e &&
        0 === c.colorId &&
        (null == b
          ? (e = OneView.core.settings.theme.eventColorsForFirstCalendar[3])
          : ((e = b.endZOP - b.startZOP),
            (e =
              e <
              OneView.core.zopHandler.zopSizeOfHour -
                OneView.core.zopHandler.zopSizeOf5Minutes
                ? OneView.core.settings.theme.eventColorsForFirstCalendar[4]
                : e <
                  OneView.core.zopHandler.zopSizeOfHour +
                    OneView.core.zopHandler.zopSizeOf5Minutes
                ? OneView.core.settings.theme.eventColorsForFirstCalendar[3]
                : e <
                  OneView.core.zopHandler.zopSizeOfDay -
                    OneView.core.zopHandler.zopSizeOf5Minutes
                ? OneView.core.settings.theme.eventColorsForFirstCalendar[2]
                : e <
                  OneView.core.zopHandler.zopSizeOfDay +
                    OneView.core.zopHandler.zopSizeOf5Minutes
                ? OneView.core.settings.theme.eventColorsForFirstCalendar[1]
                : OneView.core.settings.theme.eventColorsForFirstCalendar[0])));
      return e;
    }
    getAndroidNumFromColor(a) {
      a = this.hexToRgb(a);
      return -16777216 + (a[0] << 16) + (a[1] << 8) + a[2];
    }
    fillLeadingZeros(a, c) {
      var b = "000000000" + a;
      return b.substr(b.length - c);
    }
    getColorIdFromAndroidNum(b) {
      b = +b;
      var c = (b >> 8) & 255,
        e = b & 255;
      b =
        "#" +
        this.fillLeadingZeros(((b >> 16) & 255).toString(16), 2) +
        this.fillLeadingZeros(c.toString(16), 2) +
        this.fillLeadingZeros(e.toString(16), 2);
      for (
        var c = -1, e = 1e5, f, g = 0;
        g < OneView.core.settings.theme.eventColors.length;
        g++
      )
        (f = this.getColorDistance(
          b,
          OneView.core.settings.theme.eventColors[g]
        )),
          f < e && ((e = f), (c = g));
      return c;
    }
    getColorDistance(a, c) {
      for (
        var b = 0,
          f = 0,
          g = this.hexToRgb(a),
          d = this.hexToRgb(c),
          n = -1,
          l = -1,
          h = -1,
          k = 256,
          p = -1,
          q = -1,
          r = -1,
          v = 256,
          t = 0;
        t < g.length;
        t++
      )
        (f += (d[t] - g[t]) / g.length),
          l < g[t] && ((l = g[t]), (n = t)),
          k > g[t] && ((k = g[t]), (h = t)),
          q < d[t] && ((q = d[t]), (p = t)),
          v > d[t] && ((v = d[t]), (r = t));
      f /= 2;
      for (t = 0; t < g.length; t++)
        (l = (g[t] + f - d[t]) / 50), (b += l * l * l * l);
      b += Math.abs(f / 150);
      n != p && (b = 1.25 * b + 0.25);
      h != r && (b = 1.1 * b + 0.1);
      return b;
    }
    hexToRgb(a) {
      return [
        parseInt(a.substr(1, 2), 16),
        parseInt(a.substr(3, 2), 16),
        parseInt(a.substr(5, 2), 16),
      ];
    }
    addUserTimeZoneSetting(b) {
      var c = OneView.core.commonUserSettings.getCachedTimeZoneDiffInMinutes();
      b = new Date(b.getTime());
      b.setMinutes(b.getMinutes() + c);
      return b;
    }
    removeUserTimeZoneSetting(b) {
      var c = OneView.core.commonUserSettings.getCachedTimeZoneDiffInMinutes();
      b = new Date(b.getTime());
      b.setMinutes(b.getMinutes() - c);
      return b;
    }
    getNumberFromString(a, c) {
      return isNaN(+a) ? c : +a;
    }
  }

  export class DomHandler {
    constructor() {
      this.canvasMenuContext =
        this.canvasMenu =
        this.canvasContext =
        this.canvas =
          void 0;
      this.screenLeftForDOM =
        this.screenTopForDOM =
        this.screenHeightForDOM =
        this.screenWidthForDOM =
        this.screenHeight =
        this.screenWidth =
          0;
      this.backButtonImage =
        '        <span class="topBarImage" style="display: inline-block; fill: _buttonImageColor">            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" height="100%">                <path d="M20 8q0.828 0 1.414 0.586t0.586 1.414q0 0.844-0.594 1.422l-10.578 10.578h31.172q0.828 0 1.414 0.586t0.586 1.414-0.586 1.414-1.414 0.586h-31.172l10.578 10.578q0.594 0.578 0.594 1.422 0 0.828-0.586 1.414t-1.414 0.586q-0.844 0-1.422-0.578l-14-14q-0.578-0.609-0.578-1.422t0.578-1.422l14-14q0.594-0.578 1.422-0.578z" > </path>            </svg>        </span>';
      this.pencilButtonImage =
        '        <span class="topBarImage" style="display: inline-block; fill: _buttonImageColor">            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 48 48">                <path d="M40.5 0c4.142 0 7.5 3.358 7.5 7.5 0 1.688-0.558 3.246-1.5 4.5l-3 3-10.5-10.5 3-3c1.254-0.942 2.811-1.5 4.5-1.5zM3 34.5l-3 13.5 13.5-3 27.75-27.75-10.5-10.5-27.75 27.75zM33.543 17.043l-21 21-2.585-2.585 21-21 2.585 2.585z"></path>            </svg>        </span>';
      this.trashButtonImage =
        '        <span class="topBarImage" style="display: inline-block; fill: _buttonImageColor">            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 48 48">                <path d="M20 2h8q2.484 0 4.242 1.758t1.758 4.242v2h8q0.828 0 1.414 0.586t0.586 1.414-0.586 1.414-1.414 0.586h-2v24q0 2.484-1.758 4.242t-4.242 1.758h-20q-2.484 0-4.242-1.758t-1.758-4.242v-24h-2q-0.828 0-1.414-0.586t-0.586-1.414 0.586-1.414 1.414-0.586h8v-2q0-2.484 1.758-4.242t4.242-1.758zM36 38v-24h-24v24q0 0.828 0.586 1.414t1.414 0.586h20q0.828 0 1.414-0.586t0.586-1.414zM28 6h-8q-0.828 0-1.414 0.586t-0.586 1.414v2h12v-2q0-0.828-0.586-1.414t-1.414-0.586z"></path>            </svg>        </span>';
      this.alreadyFadedIn = false;
      this.getTextLength = function (a, c) {
        var b = document.getElementById("ruler");
        b.style.fontSize = c;
        b.innerHTML = a;
        return b.offsetWidth;
      };
      this.tryCreateHtmlElements();
    }
    init() {
      OneView.core.mainMenuControl = new OneView.MainMenuControl();
      OneView.core.addButtonControl = new OneView.AddButtonControl();
      OneView.core.zopDrawArea.init(this.canvas, this.canvasContext);
    }
    getElement(a) {
      return document.getElementById(a);
    }
    addElement(a, c) {
      return this.getElement(a.id) ? a : this.getElement(c).appendChild(a);
    }
    addDiv(a, c, e) {
      if (this.getElement(a)) return this.getElement(a);
      var b = document.createElement("div");
      b.id = a;
      b.className = c;
      return this.addElement(b, e);
    }
    showCanvas() {
      OneView.core.calendarDataProxy.analyticsPage("Main page");
      this.addElement(this.canvas, document.body.id);
      this.resetDrawAreaSize_Delayed();
      OneView.core.redraw(true);
      window.setTimeout(function () {
        return OneView.core.redraw(true);
      }, 100);
    }
    insertImages(b, c) {
      var e = OneView.core.helper.replaceAll(
          b,
          "_insertBackButtonImage",
          this.backButtonImage
        ),
        e = OneView.core.helper.replaceAll(
          e,
          "_insertPencilButtonImage",
          this.pencilButtonImage
        ),
        e = OneView.core.helper.replaceAll(
          e,
          "_insertTrashButtonImage",
          this.trashButtonImage
        );
      return (e = OneView.core.helper.replaceAll(e, "_buttonImageColor", c));
    }
    hideCanvas() {
      this.removeElement(this.canvas.id);
    }
    pageHtmlFormatHelper(b, c) {
      for (
        var e = OneView.core.domHandler.addDiv(b, "page", "pageRoot"),
          f = OneView.core.domHandler.addDiv(b + "inner", "pageInner", b),
          g = 0;
        g < OneView.core.translate.keys.length;
        g++
      )
        c = this.replaceMultiple(
          c,
          "{#" + OneView.core.translate.keys[g] + "#}",
          OneView.core.translate.get(OneView.core.translate.keys[g])
        );
      f.innerHTML = c;
      return e;
    }
    replaceMultiple(a, c, e) {
      return a.split(c).join(e);
    }
    removeElement(a) {
      (a = this.getElement(a)) && a.parentNode && a.parentNode.removeChild(a);
    }
    addEvent(a, c, e, f) {
      e = e.bind(f);
      this.getElement(a).addEventListener(c, e, false);
    }
    addClickEvent(a, c, e) {
      this.addEvent(a, "click", c, e);
    }
    touchClickDown(a) {}
    touchClickUp(a) {}
    tryCreateHtmlElements() {
      void 0 === this.canvas &&
        ((this.canvas = document.createElement("canvas")),
        (this.canvas.id = "canvas"),
        document.body.appendChild(this.canvas),
        (this.canvasContext = this.canvas.getContext("2d")));
      void 0 === this.canvasMenu &&
        ((this.canvasMenu = document.createElement("canvas")),
        (this.canvasMenu.id = "canvasMenu"),
        document.body.appendChild(this.canvasMenu),
        (this.canvasMenuContext = this.canvasMenu.getContext("2d")));
    }
    resetDrawAreaSize_Delayed() {
      this.resetDrawAreaSize = this.resetDrawAreaSize.bind(this);
      window.setTimeout(this.resetDrawAreaSize, 100);
      window.setTimeout(this.resetDrawAreaSize, 300);
    }
    resetDrawAreaSize() {
      var b = document.querySelector('meta[name="viewport"]');
      b &&
        (b.content.match(/width=device-width/) &&
          (b.content = b.content.replace(/width=[^,]+/, "width=1")),
        (b.content = b.content.replace(
          /width=[^,]+/,
          "width=" + window.innerWidth
        )));
      window.devicePixelRatio &&
        0 !== window.devicePixelRatio &&
        OneView.core.ratio !== window.devicePixelRatio &&
        (OneView.core.ratio = window.devicePixelRatio);
      if (
        this.screenWidthForDOM !== window.innerWidth ||
        this.screenHeightForDOM !== window.innerHeight
      )
        (this.screenWidthForDOM = window.innerWidth),
          (this.screenHeightForDOM = window.innerHeight);
      var b =
          window.msMatchMedia ||
          window.MozMatchMedia ||
          window.WebkitMatchMedia ||
          window.matchMedia,
        c = "onorientationchange" in window,
        e = void 0;
      if (
        "undefined" !== typeof b &&
        window.matchMedia("(orientation: portrait)").matches
      )
        e = true;
      else if (
        "undefined" !== typeof b &&
        window.matchMedia("(orientation: landscape)").matches
      )
        e = false;
      else if ((c && 0 == window.orientation) || 180 == window.orientation)
        e = true;
      else if ((c && 0 == window.orientation) || 180 == window.orientation)
        e = false;
      void 0 !== e && null !== e
        ? (e
            ? (this.screenWidthForDOM !==
                Math.min(window.innerWidth, window.innerHeight) &&
                (this.screenWidthForDOM = Math.min(
                  window.innerWidth,
                  window.innerHeight
                )),
              this.screenHeightForDOM !==
                Math.max(window.innerWidth, window.innerHeight) &&
                (this.screenHeightForDOM = Math.max(
                  window.innerWidth,
                  window.innerHeight
                )),
              (b = Math.min(screen.width, screen.height)))
            : (this.screenWidthForDOM !==
                Math.max(window.innerWidth, window.innerHeight) &&
                (this.screenWidthForDOM = Math.max(
                  window.innerWidth,
                  window.innerHeight
                )),
              this.screenHeightForDOM !=
                Math.min(window.innerWidth, window.innerHeight) &&
                (this.screenHeightForDOM = Math.min(
                  window.innerWidth,
                  window.innerHeight
                )),
              (b = Math.max(screen.width, screen.height))),
          b < 0.9 * this.screenWidthForDOM &&
          OneView.core.domRatio !== b / this.screenWidthForDOM
            ? (OneView.core.domRatio = b / this.screenWidthForDOM)
            : 1 !== OneView.core.domRatio && (OneView.core.domRatio = 1))
        : (OneView.core.domRatio = 1);
      b = document.getElementById("phone");
      this.screenLeftForDOM = this.screenTopForDOM = 0;
      this.screenWidthForDOM = Math.floor(this.screenWidthForDOM);
      this.screenHeightForDOM = Math.floor(this.screenHeightForDOM);
      b
        ? ((b.className = "phone_js_resize"),
          (b.style.width = Math.floor(0.55 * window.innerHeight) + "px"),
          (this.screenWidthForDOM = Math.floor(0.75 * b.clientWidth) - 2),
          (this.screenHeightForDOM = Math.floor(0.64 * b.clientHeight)),
          (c = b.getBoundingClientRect()),
          (e =
            c.left +
            (document.documentElement.scrollLeft
              ? document.documentElement.scrollLeft
              : document.body.scrollLeft)),
          (this.screenTopForDOM = Math.floor(
            c.top +
              (document.documentElement.scrollTop
                ? document.documentElement.scrollTop
                : document.body.scrollTop) +
              (b.clientHeight - this.screenHeightForDOM) / 2
          )),
          (this.screenLeftForDOM =
            Math.floor(e + (b.clientWidth - this.screenWidthForDOM) / 2) + 1),
          (c = document.getElementById("bg")),
          (c.className = "bg_js_resize"),
          (c.style.top = Math.floor(0.32 * window.innerHeight + 0) + "px"),
          (c.style.height = Math.floor(1.05 * window.innerHeight + 0) + "px"),
          (c = document.getElementById("logowrapper")),
          (c.className = ""),
          (c.style.height = Math.floor(0.35 * window.innerHeight + 0) + "px"),
          (c = document.getElementById("phonewrapper")),
          (c.className = ""),
          (c.style.height = Math.floor(1.05 * window.innerHeight + 0) + "px"),
          (c = document.getElementById("logo")),
          (c.className = "logo"),
          (c.style.fontSize = 0.25 * window.innerHeight + 0 + "px"),
          (c = document.getElementById("logosub")),
          (c.className = "logosub"),
          (c.style.fontSize = 0.05 * window.innerHeight + 0 + "px"),
          (c.style.top = Math.floor(0.05 * -window.innerHeight + 0) + "px"),
          (c = document.getElementById("pageRoot")),
          (c.style.width = this.screenWidthForDOM + "px"),
          (c.style.height = this.screenHeightForDOM + "px"),
          (c.style.position = "absolute"),
          (c.style.top = this.screenTopForDOM + "px"),
          (c.style.left = this.screenLeftForDOM + "px"),
          (OneView.core.settings.zoom = Math.max(
            0.67,
            Math.min(
              1,
              Math.min(
                OneView.core.domHandler.screenWidthForDOM,
                OneView.core.domHandler.screenHeightForDOM
              ) / 300
            )
          )))
        : (OneView.core.settings.zoom = 1);
      this.tryCreateHtmlElements();
      this.screenWidth = Math.round(
        this.screenWidthForDOM * OneView.core.ratio * OneView.core.domRatio
      );
      this.screenHeight = Math.round(
        this.screenHeightForDOM * OneView.core.ratio * OneView.core.domRatio
      );
      OneView.core.setSizeSettings();
      this.canvas.style.width = this.screenWidthForDOM + "px";
      this.canvas.style.height = this.screenHeightForDOM + "px";
      this.canvas.style.position = "absolute";
      this.canvas.style.top = this.screenTopForDOM + "px";
      this.canvas.style.left = this.screenLeftForDOM + "px";
      this.canvas.style.zIndex = "2";
      this.canvas.width = this.screenWidth;
      this.canvas.height = this.screenHeight;
      OneView.core.settings.menuButtonBottom =
        0.875 * OneView.core.settings.titleWidth;
      this.canvasMenu.style.width = this.canvas.style.width;
      this.canvasMenu.style.height = this.canvas.style.height;
      this.canvasMenu.style.position = this.canvas.style.position;
      this.canvasMenu.style.zIndex = "10";
      this.canvasMenu.width = this.canvas.width;
      this.canvasMenu.height = this.canvas.height;
      this.canvasMenu.style.display = "none";
      this.canvasMenu.style.top = this.canvas.style.top;
      this.canvasMenu.style.left = this.canvas.style.left;
      b || window.scrollTo(0, 0);
      OneView.core.zopDrawArea.resetDrawAreaSize(
        this.screenHeight,
        this.screenWidth
      );
      OneView.core.mainMenuControl.resetDrawAreaSize(
        this.screenHeight,
        this.screenWidth
      );
      OneView.core.calendarEventHandler.drawAreaResized();
      OneView.core.mainMenuControl.drawAreaResized();
      OneView.core.addButtonControl.drawAreaResized();
      OneView.core.appStateHandler.viewEventControl.resize();
      OneView.core.appStateHandler.sizesInitiated = true;
      this.resizeDomElements();
      OneView.core.preloadAllImages();
      OneView.core.redraw(true);
      this.fadeInIfWebPage();
    }
    fadeInIfWebPage() {
      this.alreadyFadedIn ||
        (document.getElementById("phone") &&
          ($(".innerX").animate(
            {
              opacity: 1,
            },
            2e3
          ),
          $("#canvas").animate(
            {
              opacity: 1,
            },
            2e3
          )),
        (this.alreadyFadedIn = true));
    }
    resizeDomElements(b) {
      void 0 === b && (b = "");
      var c = Math.min(
          24,
          Math.max(
            11,
            Math.min(
              OneView.core.domHandler.screenWidthForDOM,
              OneView.core.domHandler.screenHeightForDOM
            ) / 19
          )
        ),
        e = Math.min(
          16,
          Math.max(
            10,
            Math.min(
              OneView.core.domHandler.screenWidthForDOM,
              OneView.core.domHandler.screenHeightForDOM
            ) / 23
          )
        ),
        f = 2 * c,
        g = c - 11 + 2,
        d = Math.max(2 * g, 13),
        n = Math.floor(c / 8),
        l,
        h = document.querySelectorAll(".pageInner");
      if (null == b || 4 > b.length)
        b = OneView.core.settings.theme.colorTitleBackground;
      for (var k = 0; k < h.length; k++)
        h[k].style.backgroundColor =
          OneView.core.settings.theme.colorBackground;
      h = document.querySelectorAll(".pageContent");
      for (k = 0; k < h.length; k++)
        (h[k].style.fontFamily =
          '"' + OneView.core.settings.theme.textFont + '", arial, sans-serif'),
          (h[k].style.backgroundColor = "rgba(125, 125, 125, 0.08)");
      h = document.querySelectorAll(".topBarTitleX");
      for (k = 0; k < h.length; k++)
        h[k].style.fontFamily =
          '"' +
          OneView.core.settings.theme.titleBarFontBold +
          '", arial, sans-serif';
      h = document.querySelectorAll(
        ".topBar, .topBarTitle, .topBarButton, .menuItem, .topBarTitleX, .shopItemButton"
      );
      for (k = 0; k < h.length; k++) h[k].style.backgroundColor = b;
      h = document.querySelectorAll(".pageTopPadding");
      for (k = 0; k < h.length; k++)
        (h[k].style.paddingTop = d + "px"),
          (h[k].style.paddingBottom = d + "px");
      h = document.querySelectorAll(".pageSecondTopPadding");
      for (k = 0; k < h.length; k++)
        (h[k].style.marginTop = "-" + d + "px"),
          (h[k].style.paddingTop = d + "px"),
          (h[k].style.paddingBottom = d + "px"),
          (h[k].style.borderTopColor = OneView.core.settings.theme.colorWhite),
          (h[k].style.borderTopStyle = "solid"),
          (h[k].style.borderTopWidth = g + "px");
      h = document.querySelectorAll(".inputBox");
      for (k = 0; k < h.length; k++)
        (h[k].style.position = "absolute"),
          (h[k].style.maxWidth = "700px"),
          (h[k].style.marginBottom = d + "px"),
          (h[k].style.left = d + "px"),
          (h[k].style.overflow = "hidden"),
          (h[k].style.right = d + "px"),
          (h[k].style.backgroundColor =
            OneView.core.settings.theme.colorBackground),
          (h[k].parentElement.style.height =
            Math.max(3 * d, h[k].offsetHeight + d) + "px"),
          (l = h[k].clientWidth);
      h = document.querySelectorAll(".noLeftRightMargin");
      for (k = 0; k < h.length; k++)
        (h[k].style.right = "0"), (h[k].style.left = "0");
      h = document.querySelectorAll("#spaceForColors");
      for (k = 0; k < h.length; k++)
        (h[k].style.maxWidth = "700px"),
          (h[k].style.marginTop = "0"),
          (h[k].style.marginBottom = d + "px"),
          (h[k].style.marginLeft = d + "px"),
          (h[k].style.marginRight = d + "px");
      h = document.querySelectorAll(".lessSpace");
      for (k = 0; k < h.length; k++)
        h[k].parentElement.style.height = h[k].offsetHeight + d + "px";
      h = document.querySelectorAll(".transparent");
      for (k = 0; k < h.length; k++) h[k].style.backgroundColor = "transparent";
      h = document.querySelectorAll(".square");
      for (k = 0; k < h.length; k++)
        (h[k].style.height = f + "px"),
          (h[k].style.width = f + "px"),
          (h[k].style.position = "relative"),
          (h[k].style.cssFloat = "right"),
          (h[k].style.right = d + "px"),
          (h[k].style.marginBottom = d + "px");
      h = document.querySelectorAll(".base");
      for (k = 0; k < h.length; k++)
        (h[k].style.fontSize = c + "px"),
          (h[k].style.lineHeight = f + n + "px"),
          (h[k].style.height = f + "px"),
          (h[k].style.paddingLeft = g + "px"),
          (h[k].style.paddingRight = g + "px"),
          (h[k].style.outline = "none"),
          (h[k].style.minHeight = "0"),
          (h[k].style.fontFamily = "Roboto"),
          (h[k].style.color = OneView.core.settings.theme.colorGrayText),
          (h[k].style.whiteSpace = "nowrap");
      h = document.querySelectorAll(".inputBase");
      for (k = 0; k < h.length; k++)
        (h[k].style.backgroundColor = "transparent"),
          (h[k].style.width = l - 2 * g + "px");
      h = document.querySelectorAll(".inputTab");
      for (k = 0; k < h.length; k++)
        (h[k].style.backgroundColor =
          OneView.core.settings.theme.colorBackground),
          (h[k].style.lineHeight = "0"),
          (h[k].style.width = l / 2 - 1 * g + "px"),
          (h[k].style.display = "inline-block"),
          (h[k].style.position = "absolute"),
          (h[k].style.textAlign = "center");
      h = document.querySelectorAll(".right");
      for (k = 0; k < h.length; k++) h[k].style.right = "0";
      h = document.querySelectorAll(".menuItem");
      for (k = 0; k < h.length; k++)
        (h[k].style.borderTopColor = OneView.core.settings.theme.colorWhite),
          (h[k].style.color = OneView.core.settings.theme.colorTagText),
          (h[k].style.height = ""),
          (h[k].style.paddingTop = g + "px"),
          (h[k].style.paddingBottom = g + "px"),
          (h[k].style.whiteSpace = "normal");
      h = document.querySelectorAll(".inputOneLiner");
      for (k = 0; k < h.length; k++)
        (h[k].style.height = f + "px"),
          this.addEvent(h[k].id, "keydown", this.overrideEnter, this);
      h = document.querySelectorAll(".inputTwoLiner");
      for (k = 0; k < h.length; k++)
        (h[k].style.height = 2 * f + "px"),
          (h[k].style.lineHeight = 1.2 * c + "px"),
          (h[k].style.width = l - 2 * g + "px");
      h = document.querySelectorAll(".maybeBig");
      if (!new OneView.Helper().isMobile())
        for (k = 0; k < h.length; k++)
          (h[k].style.height = 6 * f + "px"),
            (h[k].style.lineHeight = 1.3 * c + "px"),
            (h[k].style.width = "100%"),
            (h[k].style.backgroundColor =
              OneView.core.settings.theme.colorBackground);
      h = document.querySelectorAll(".inputDate");
      for (k = 0; k < h.length; k++)
        (h[k].style.left = d + "px"), (h[k].style.width = l - 2 * g + "px");
      h = document.querySelectorAll(".tableWithMargin");
      for (k = 0; k < h.length; k++) h[k].style.marginRight = d + "px";
      h = document.querySelectorAll(".inputCheckBox");
      for (k = 0; k < h.length; k++)
        (h[k].style.width = f + "px"),
          (h[k].style.backgroundColor = "transparent"),
          "3" == OneView.core.commonUserSettings.theme
            ? (h[k].style.webkitAppearance = "none")
            : (h[k].style.fontSize = "0");
      h = document.querySelectorAll(".androidDown");
      if (new OneView.Helper().isAndroid())
        for (k = 0; k < h.length; k++)
          (h[k].style.position = "relative"),
            (h[k].style.top = Math.ceil(0.8 * g) + "px"),
            (h[k].style.left = "0"),
            (h[k].style.paddingTop = "0"),
            (h[k].style.paddingBottom = "0"),
            (h[k].style.paddingLeft = g / 2 + "px"),
            (h[k].style.paddingRight = g / 2 + "px"),
            (h[k].style.width = l - g + "px"),
            (h[k].style.marginTop = "0"),
            (h[k].style.marginBottom = g + "px"),
            (h[k].style.height = "0"),
            (h[k].style.lineHeight = f - g + "px"),
            (h[k].style.height = f - c + "px"),
            (h[k].parentElement.style.height = f + n + "px");
      h = document.querySelectorAll(".dateFake");
      for (k = 0; k < h.length; k++)
        (h[k].style.position = "absolute"),
          (h[k].style.background = OneView.core.settings.theme.colorBackground),
          (h[k].style.left = "0"),
          (h[k].style.pointerEvents = "none"),
          (h[k].style.top = "0"),
          (h[k].style.right = 3 * d + "px"),
          (h[k].style.width = "80%"),
          (h[k].style.overflow = "hidden");
      h = document.querySelectorAll(".sizedTitle");
      for (k = 0; k < h.length; k++)
        (h[k].style.position = "relative"),
          (h[k].style.fontSize = e + "px"),
          (h[k].style.paddingLeft = d + "px"),
          (h[k].style.paddingRight = d + "px");
      h = document.querySelectorAll(
        ".miniTitle, .shopItemTitle, .shopItemDescription"
      );
      for (k = 0; k < h.length; k++)
        h[k].style.color = OneView.core.settings.theme.colorHorizontalTitle;
      h = document.querySelectorAll(".miniTitle");
      for (k = 0; k < h.length; k++)
        h[k].style.color = OneView.core.helper.colorToRGBA(
          OneView.core.settings.theme.colorHorizontalTitle,
          0.5
        );
      h = document.querySelectorAll(".pageContentText");
      for (k = 0; k < h.length; k++)
        h[k].style.color = OneView.core.settings.theme.colorHorizontalTitle;
      h = document.querySelectorAll(".inputOption");
      for (k = 0; k < h.length; k++)
        (h[k].style.paddingTop = g + "px"),
          (h[k].style.backgroundColor =
            OneView.core.settings.theme.colorBackground);
    }
    overrideEnter(a) {
      if (
        13 == a.which &&
        "textarea" != a.target.type &&
        "button" != a.target.type
      )
        return a.target.blur(), false;
    }
    getSelectOptions(a) {
      for (var b = "", e = 0; e < a.options.length; e++)
        a.options[e].selected && (b += a.options[e].value);
      return b;
    }
    selectWeekDays(a, c) {
      for (var b = 0; b < a.options.length; b++)
        a.options[b].selected = -1 < c.indexOf(a.options[b].value);
    }
    addWeekDaysToSelectNode(b) {
      for (var c, e = 1; 7 >= e; e++)
        (c = new Option(
          OneView.core.helper.weekdayLong.find(e),
          "" + e,
          false,
          false
        )),
          (c.className = "inputOption"),
          b.appendChild(c);
    }
    addRemindersToSelectNode(b, c) {
      var e = [],
        f = moment(),
        g = f.clone().add("minutes", 0);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("minutes", 1);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("minutes", 5);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("minutes", 10);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("minutes", 15);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("minutes", 20);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("minutes", 25);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("minutes", 30);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("minutes", 45);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("hours", 1);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("minutes", 90);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("hours", 2);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("hours", 3);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("hours", 6);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("hours", 12);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("days", 1);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("days", 2);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      g = f.clone().add("days", 7);
      e.push(
        new OneView.NumberStringPair(g.diff(f, "minutes"), g.from(f, true))
      );
      for (var d = 0; d < c.length; d++)
        (g = f.clone().add("minutes", c[d].minutes)),
          this.addSortedIfNotExists(
            e,
            new OneView.NumberStringPair(c[d].minutes, g.from(f, true))
          );
      b.innerHTML = "";
      for (f = 0; f < e.length; f++) {
        g = false;
        for (d = 0; d < c.length; d++)
          c[d].minutes == e[f].valueNumber && (g = true);
        d = new Option(e[f].valueString, "" + e[f].valueNumber, false, g);
        d.className = "inputOption";
        b.appendChild(d);
      }
    }
    selectDuration(a, c, e) {}
    addDurationsToSelectNode(b, c, e) {
      var f = [];
      c = moment(c);
      var g = c.clone().add("minutes", 1),
        d = c.clone().add("minutes", 15);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 30);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 45);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 60);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 75);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 90);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 105);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 120);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 150);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 3);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 4);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 6);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 8);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 12);
      f.push(new OneView.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("days", 1);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 2);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 3);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 4);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 5);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 6);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 7);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 8);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 9);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 10);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 14);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 21);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 1);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 2);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 3);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 4);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 6);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 12);
      f.push(new OneView.NumberStringPair(d.diff(g), d.from(c, true)));
      d = moment(e);
      this.addSortedIfNotExists(
        f,
        new OneView.NumberStringPair(d.diff(c), d.from(c, true))
      );
      b.innerHTML = "";
      for (g = 0; g < f.length; g++)
        (e = new Option(
          f[g].valueString,
          "" + f[g].valueNumber,
          false,
          f[g].valueNumber === d.diff(c)
        )),
          (e.className = "inputOption"),
          b.appendChild(e);
    }
    addSortedIfNotExists(a, c) {
      for (var b = a.length, f = false, g = 0; g < b && 0 == f; g++)
        c.valueNumber < a[g].valueNumber && (a.splice(g, 0, c), (f = true)),
          c.valueNumber === a[g].valueNumber && (f = true);
      false === f && a.push(c);
    }
  }

  export class LoadingHandler {
    constructor() {
      this.showMessage = false;
      this.loadingCounter = 0;
    }
    showLoadingSpinnerIfNeeded() {
      if (0 < this.loadingCounter)
        if (
          !OneView.core.calendarDataProxy.connectionOk() ||
          (2e4 < OneView.core.getTimeStamp() - this.loadStartTime &&
            24e3 > OneView.core.getTimeStamp() - this.loadStartTime)
        )
          (this.loadingCounter = 0),
            (this.showMessage = true),
            (this.messageStartTime = OneView.core.getTimeStamp());
        else {
          if (OneView.core.drawArea && OneView.core.zopDrawArea) {
            var b = ((OneView.core.getTimeStamp() % 1e3) / 1e3) * 2 * Math.PI;
            OneView.core.drawArea.drawLoader(b);
          }
        }
      else 0 > this.loadingCounter && (this.loadingCounter = 0);
      this.showMessage &&
        (5e3 > OneView.core.getTimeStamp() - this.messageStartTime
          ? (OneView.core.drawArea.drawFilledRectangle(
              0,
              0,
              OneView.core.zopDrawArea.zopAreaWidth,
              OneView.core.settings.titleWidth +
                OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
              OneView.core.settings.theme.colorRed,
              false
            ),
            OneView.core.drawArea.drawCenteredText(
              OneView.core.translate.get("Connection failed"),
              0,
              (OneView.core.settings.titleWidth +
                OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
                OneView.core.settings.menuTextHeight) /
                2,
              OneView.core.zopDrawArea.zopAreaWidth,
              OneView.core.settings.menuTextHeight,
              OneView.core.settings.theme.colorWhite,
              false,
              false
            ),
            OneView.core.redraw(true))
          : (this.showMessage = false));
    }
    isLoading() {
      return 0 < this.loadingCounter;
    }
    startLoading() {
      this.showMessage = false;
      OneView.core.eventHandler.closeAllPagesAndMenus();
      0 > this.loadingCounter
        ? (this.loadingCounter = 1)
        : this.loadingCounter++;
      OneView.core &&
        ((this.loadStartTime = OneView.core.getTimeStamp()),
        OneView.core.redraw(true));
    }
    stopLoadingWithError() {
      this.showMessage = true;
      this.stopLoading();
    }
    stopLoading() {
      this.loadingCounter = 0;
      OneView.core.redraw(true);
    }
  }

  export class AppStateHandler {
    constructor() {
      this.isEditingEvent = this.isCreatingNewEvent = 0;
      this.isChoosingDateTimeForEvent = false;
      this.isAutoZooming =
        this.isAutoScrolling =
        this.isManuallyZooming =
        this.isManuaullyScrolling =
          0;
      this.isPopupEditRecurringMenuShowing =
        this.isPopupMainMenuShowing =
        this.isMainMenuBeingDragged =
        this.isAddButtonBeingDragged =
        this.isMainMenuShowing =
          false;
      this.isPopupDissabled = 0;
      this.sizesInitiated =
        this.settingsControlIsShowing =
        this.shopControlIsShowing =
        this.calendarsControlIsShowing =
        this.editEventControlIsShowing =
        this.viewEventControlIsShowing =
        this.isDraggingBottomMarker =
        this.isDraggingTopMarker =
          false;
      this.visibleControls = [];
      this.settingsControl = new OneView.SettingsControl();
      this.calendarsControl = new OneView.CalendarsControl();
      this.shopControl = new OneView.ShopControl();
      this.viewEventControl = new OneView.ViewEventControl();
      this.editEventControl = new OneView.EditEventControl();
      this.editRecurrenceControl = new OneView.EditRecurrenceControl();
    }
    isMainWindowShowing() {
      return (
        !this.isMainMenuShowing &&
        !this.editEventControlIsShowing &&
        !this.isChoosingDateTimeForEvent &&
        !this.isPopupEditRecurringMenuShowing &&
        !this.viewEventControlIsShowing
      );
    }
    setChoosingDateTimeForEvent(b) {
      (this.isChoosingDateTimeForEvent = b)
        ? (this.isPopupDissabled++,
          OneView.core.zopDrawArea &&
            (OneView.core.dateTimeSelectionHandler.makeVisible(true),
            OneView.core.redraw(true)))
        : (this.isPopupDissabled--,
          OneView.core.zopDrawArea &&
            (OneView.core.dateTimeSelectionHandler.makeVisible(false),
            OneView.core.redraw(true)));
    }
    viewEvent(b) {
      OneView.core.loadingHandler.isLoading() ||
        ((this.viewEventControlIsShowing = true),
        this.viewEventControl.init(b),
        this.addVisibleControl(this.viewEventControl));
    }
    editEvent(b, c) {
      OneView.core.loadingHandler.isLoading() ||
        ((this.editEventControlIsShowing = true),
        this.editEventControl.init(b, c),
        this.addVisibleControl(this.editEventControl));
    }
    deleteEvent(b, c) {
      OneView.core.calendarDataProxy.deleteEvent(b, c, false);
    }
    editRecurrence(a) {
      this.editRecurrenceControl.init(a);
      this.addVisibleControl(this.editRecurrenceControl);
    }
    startMoveCalendarEventObject(a, c, e, f) {}
    startAddCalendarEventObject(b, c) {
      var e = new OneView.CalendarEventObject(
        "",
        "",
        "",
        b,
        c,
        this.getDefaultCalendarId(),
        "-1"
      );
      this.editEvent(e, OneView.EventEditType.New);
    }
    getDefaultCalendarId() {
      var b = OneView.core.commonUserSettings.calendarIdLastAddedTo;
      if (
        OneView.core.getCalendar(b).visibility ===
          OneView.VisibilityType.Visible &&
        OneView.core.getCalendar(b).canEditCalendarEvents
      )
        return b;
      for (var b = void 0, c = 0; c < OneView.core.calendars.length; c++)
        if (
          OneView.core.calendars[c].visibility ===
            OneView.VisibilityType.Visible &&
          OneView.core.calendars[c].canEditCalendarEvents
        ) {
          b = OneView.core.calendars[c].id;
          break;
        }
      return void 0 == b ||
        OneView.core.getCalendar(OneView.core.calendarPrimaryId).visibility ===
          OneView.VisibilityType.Visible
        ? OneView.core.calendarPrimaryId
        : b;
    }
    addVisibleControl(a) {
      this.visibleControls[this.visibleControls.length - 1] !== a &&
        (history.pushState(
          {
            depth: this.visibleControls.length,
          },
          ""
        ),
        this.visibleControls.push(a),
        a.show());
    }
    back() {
      var b = OneView.core.getTimeStamp();
      if (this.previousBackTime && b - 500 < this.previousBackTime)
        return (this.previousBackTime = b), false;
      this.previousBackTime = b;
      if (this.visibleControls && 0 < this.visibleControls.length)
        return (
          this.visibleControls[this.visibleControls.length - 1].hide(),
          this.visibleControls.pop(),
          0 < this.visibleControls.length &&
            this.visibleControls[this.visibleControls.length - 1].reshow(),
          true
        );
      navigator && navigator.app && navigator.app.exitApp();
      return false;
    }
    safeBack(a) {
      return this.visibleControls &&
        0 < this.visibleControls.length &&
        this.visibleControls[this.visibleControls.length - 1] === a
        ? this.back()
        : false;
    }
    mainButtonPressed() {
      if (!OneView.core.loadingHandler.isLoading()) {
        var b = OneView.core.zopHandler.dateToZOP(new Date());
        OneView.core.zopHandler.topZOP < b &&
        OneView.core.zopHandler.bottomZOP > b
          ? this.showMainMenu(true)
          : OneView.core.zopHandler.showInitialBounds(true);
      }
    }
    showMainMenu(b) {
      OneView.core.loadingHandler.isLoading() ||
        (OneView.core.appStateHandler.isMainWindowShowing()
          ? ((OneView.core.appStateHandler.isMainMenuShowing = true),
            this.addVisibleControl(OneView.core.mainMenuControl),
            b && OneView.core.mainMenuControl.startOpenAnimation(),
            window.setTimeout(function () {
              return OneView.core.redraw(true);
            }, 100),
            window.setTimeout(function () {
              return OneView.core.redraw(true);
            }, 200))
          : this.back());
    }
    viewCalendars() {
      this.calendarsControlIsShowing = true;
      this.addVisibleControl(this.calendarsControl);
    }
    viewShop() {
      this.shopControlIsShowing = true;
      this.addVisibleControl(this.shopControl);
    }
    viewSettings() {
      this.settingsControlIsShowing = true;
      this.addVisibleControl(this.settingsControl);
    }
    viewAbout() {}
  }

  export class CalendarDateHandler {
    constructor() {
      this.visibleHorizontalDateObjects = [];
      this.visibleTitleBarDateObjects = [];
      this.inVisibleTitle4Objects = [];
      this.visibleLowestLevelObjects = [];
      this.selectedObjects = [];
      this.innerMarginTop2 =
        this.innerMarginTop =
        this.extraTextHeight =
        this.extraTextHeight2 =
        this.horizontalTitleExtraTextHeight =
        this.textHeight =
        this.textHeight2 =
        this.horizontalTitleTextHeight =
          0;
      this.useDividerLine = false;
      this.averageObjectPixelHeight =
        this.nowZOP =
        this.hourWidth2 =
        this.hourWidth =
          0;
      this.showExtraTextToRight = this.showExtraTextBelow = false;
      this.averageObjectPixelHeight2 = 0;
      this.showExtraTextToRight2 = this.showExtraTextBelow2 = false;
      this.horizontalTitleHeight = 0;
      this.rootCalendarDateObjects = [];
      this.weekCalendarDateObjects = [];
      this.counter = 0;
      this.selectedCalendarDateObject = void 0;
      this.showMonthSpecialDetails = false;
      this.lowestLevelCalendarDateObjectType = void 0;
      this.commonDateTimes = [];
      this.weekNumbersVisible = [];
      this.populateDetails_helper = this.populateDetails_helper.bind(this);
      this.reset();
    }
    reset() {
      this.rootCalendarDateObjects = [];
      this.weekCalendarDateObjects = [];
      this.rootCalendarDateObjects.push(
        new OneView.CalendarDateObject(
          OneView.CalendarDateObjectType.Title,
          OneView.core.settings.absoluteMinDate,
          OneView.core.settings.absoluteMaxDate
        )
      );
      var b = OneView.core.zopHandler.dateToZOP(
          OneView.core.settings.absoluteMinDate
        ),
        c = OneView.core.zopHandler.dateToZOP(
          OneView.core.settings.absoluteMaxDate
        );
      OneView.core.zopHandler.setAbsoluteMinMax(b, c);
    }
    clearWeekInfo() {
      this.weekCalendarDateObjects = [];
    }
    selectCalendarDateObjectAt(b, c, e) {
      if (
        c < OneView.core.zopHandler.topPixel ||
        c > OneView.core.zopHandler.bottomPixel
      )
        this.selectedCalendarDateObject = void 0;
      else
        return (
          (c = OneView.core.zopHandler.getZOPFromPixel(c)),
          (e = this.getHitCalendarDateObjectAmong(
            b,
            c,
            this.visibleLowestLevelObjects,
            OneView.core.settings.titleWidth
          )) ||
            (e = this.getHitCalendarDateObjectAmong(
              b,
              c,
              this.visibleTitleBarDateObjects,
              0
            )),
          e ||
            (e = this.getHitCalendarDateObjectAmong(
              b,
              c,
              this.visibleHorizontalDateObjects,
              0
            )),
          (this.selectedCalendarDateObject = e)
        );
    }
    getClosestDetailAt(b, c) {
      if (
        !(
          b < OneView.core.zopHandler.topPixel ||
          b > OneView.core.zopHandler.bottomPixel
        )
      ) {
        b = b - (b % c) + Math.round(c / 2);
        var e = b - c,
          f = e + 2 * c,
          g = OneView.core.zopHandler.getZOPFromPixel(b),
          e = OneView.core.zopHandler.getZOPFromPixel(e),
          d = OneView.core.zopHandler.getZOPFromPixel(f),
          f = this.getHitCalendarDateObjectAmong(
            OneView.core.settings.titleWidth + 1,
            g,
            this.visibleLowestLevelObjects,
            OneView.core.settings.titleWidth
          ),
          e = this.getHitCalendarDateObjectAmong(
            OneView.core.settings.titleWidth + 1,
            e,
            this.visibleLowestLevelObjects,
            OneView.core.settings.titleWidth
          ),
          d = this.getHitCalendarDateObjectAmong(
            OneView.core.settings.titleWidth + 1,
            d,
            this.visibleLowestLevelObjects,
            OneView.core.settings.titleWidth
          );
        if (f && e && d) {
          if (e !== d) return d;
          this.verifyDetailsArePopulatedFor(f);
          return (f = this.getHitCalendarDateObjectAmong(
            OneView.core.settings.titleWidth + 1,
            g,
            f.details,
            OneView.core.settings.titleWidth
          ));
        }
      }
    }
    convertCommonTimesToDates(b) {
      if (b != this.lastCommonTimesStartDate) {
        this.lastCommonTimesStartDate = b;
        this.commonDateTimes = [];
        var c;
        for (
          c = 0;
          c < OneView.core.calendarEventHandler.commonTimeKeys.length;
          c++
        ) {
          var e = OneView.core.calendarEventHandler.commonTimeKeys[c].timeKey,
            f = parseInt(e.substr(0, e.indexOf("-"))),
            e = parseInt(e.substr(e.indexOf("-") + 1)),
            d = new Date(b.getTime());
          d.setHours(f, e);
          this.commonDateTimes.push(d);
        }
      }
    }
    getCalendarDateObject(a, c, e) {
      this.verifyDetailsArePopulatedFor(e);
      for (var b = 0; b < e.details.length; b++) {
        var d = e.details[b];
        if (d.startZOP < a && d.endZOP > a)
          return d.calendarDateObjectType === c
            ? d
            : this.getCalendarDateObject(a, c, d);
      }
    }
    getClosestFakeDetailAt(b, c, e) {
      if (
        this.lowestLevelCalendarDateObjectType ==
          OneView.CalendarDateObjectType.Month &&
        !this.showMonthSpecialDetails
      )
        return this.getHitWeekAt(
          OneView.core.zopHandler.rightPixel - 1,
          b,
          false
        );
      if (
        this.lowestLevelCalendarDateObjectType ==
        OneView.CalendarDateObjectType.Day
      ) {
        if (
          b < OneView.core.zopHandler.topPixel ||
          b > OneView.core.zopHandler.bottomPixel
        )
          return;
        b = b - (b % c) + Math.round(c / 2);
        var f = b - c,
          d = f + 2 * c,
          m = OneView.core.zopHandler.getZOPFromPixel(b),
          f = OneView.core.zopHandler.getZOPFromPixel(f),
          n = OneView.core.zopHandler.getZOPFromPixel(d),
          d = this.getHitCalendarDateObjectAmong(
            OneView.core.settings.titleWidth + 1,
            m,
            this.visibleLowestLevelObjects,
            OneView.core.settings.titleWidth
          ),
          l = this.getHitCalendarDateObjectAmong(
            OneView.core.settings.titleWidth + 1,
            f,
            this.visibleLowestLevelObjects,
            OneView.core.settings.titleWidth
          ),
          h = this.getHitCalendarDateObjectAmong(
            OneView.core.settings.titleWidth + 1,
            n,
            this.visibleLowestLevelObjects,
            OneView.core.settings.titleWidth
          );
        if (!d || !l || !h) return;
        if (l !== h && e) return h;
        e = OneView.core.zopHandler.getDateFromZOP(f);
        m = OneView.core.zopHandler.getDateFromZOP(n);
        this.convertCommonTimesToDates(d.startDateTime);
        for (d = 0; d < this.commonDateTimes.length; d++)
          if (this.commonDateTimes[d] >= e && this.commonDateTimes[d] < m)
            return new OneView.CalendarDateObject(
              OneView.CalendarDateObjectType.Hour,
              this.commonDateTimes[d]
            );
        return this.getClosestDetailAt(b, c);
      }
      if (
        !(
          b < OneView.core.zopHandler.topPixel ||
          b > OneView.core.zopHandler.bottomPixel
        ) &&
        ((b = b - (b % c) + Math.round(c / 2)),
        (f = b - c),
        (d = f + 2 * c),
        (m = OneView.core.zopHandler.getZOPFromPixel(b)),
        (f = OneView.core.zopHandler.getZOPFromPixel(f)),
        (n = OneView.core.zopHandler.getZOPFromPixel(d)),
        (d = this.getHitCalendarDateObjectAmong(
          OneView.core.settings.titleWidth + 1,
          m,
          this.visibleLowestLevelObjects,
          OneView.core.settings.titleWidth
        )),
        (l = this.getHitCalendarDateObjectAmong(
          OneView.core.settings.titleWidth + 1,
          f,
          this.visibleLowestLevelObjects,
          OneView.core.settings.titleWidth
        )),
        (h = this.getHitCalendarDateObjectAmong(
          OneView.core.settings.titleWidth + 1,
          n,
          this.visibleLowestLevelObjects,
          OneView.core.settings.titleWidth
        )),
        d && l && h)
      ) {
        if (l !== h && e) return h;
        this.verifyDetailsArePopulatedFor(d);
        return (d = this.getHitCalendarDateObjectAmong(
          OneView.core.settings.titleWidth + 1,
          m,
          d.details,
          OneView.core.settings.titleWidth
        ));
      }
    }
    getLowestLevelCalendarDateObjectAt(b) {
      b = OneView.core.zopHandler.getZOPFromPixel(b);
      return this.getHitCalendarDateObjectAmong(
        OneView.core.settings.titleWidth + 1,
        b,
        this.visibleLowestLevelObjects,
        OneView.core.settings.titleWidth
      );
    }
    getHitCalendarDateObjectAmong(a, c, e, f): CalendarDateObject {
      var b = e.length,
        d;
      if (a > f)
        for (a = 0; a < b; a++)
          (f = e[a]),
            c >= f.startZOP &&
              c <= f.endZOP &&
              (void 0 === d ||
                d.calendarDateObjectType > f.calendarDateObjectType) &&
              (d = f);
      return d;
    }
    clearSelect() {
      this.selectedObjects = [];
    }
    selectCalendarDateObject(a?: CalendarDateObject) {
      a && this.selectedObjects.push(a);
    }
    getHitWeekAt(b, c, e) {
      if (0 < this.weekNumbersVisible.length) {
        var f = OneView.core.zopHandler.getZOPFromPixel(c),
          d =
            OneView.core.zopHandler.getZOPFromPixelDiff(
              OneView.core.settings.weekCircleDiameter
            ) / 2;
        for (c = 0; c < this.weekCalendarDateObjects.length; c++)
          if (e) {
            if (
              -1 <
              this.weekNumbersVisible.indexOf(
                this.weekCalendarDateObjects[c].shortText
              )
            ) {
              var m = Math.max(
                this.weekCalendarDateObjects[c].startZOP,
                OneView.core.zopHandler.topZOP + d
              );
              if (f >= m - d && f <= m + d)
                return this.weekCalendarDateObjects[c];
            }
          } else if (
            f >= this.weekCalendarDateObjects[c].startZOP &&
            f <= this.weekCalendarDateObjects[c].endZOP &&
            b > OneView.core.settings.titleWidth
          )
            return this.weekCalendarDateObjects[c];
      }
    }
    gotoCalendarDateObjectAt(b, c) {
      var e = this.selectCalendarDateObjectAt(b, c, true);
      if (
        e &&
        e.calendarDateObjectType == this.lowestLevelCalendarDateObjectType &&
        this.showMonthSpecialDetails
      ) {
        var f = Math.max(
          OneView.core.zopHandler.getPixelFromZOP(e.startZOP),
          OneView.core.zopHandler.topPixel
        );
        if (c > f + this.horizontalTitleHeight) {
          e = OneView.core.zopHandler.getZOPFromPixel(
            c - 25 * OneView.core.ratio
          );
          f = OneView.core.zopHandler.getZOPFromPixel(
            c + 25 * OneView.core.ratio
          );
          OneView.core.drawAreaEffects.startAutoZoom(
            e,
            f,
            false,
            function () {}
          );
          return;
        }
      }
      if (
        e &&
        e.calendarDateObjectType == this.lowestLevelCalendarDateObjectType &&
        this.horizontalDateObjectType
      ) {
        var d = this.getHitCalendarDateObjectAmong(
            b,
            OneView.core.zopHandler.getZOPFromPixel(c),
            this.visibleHorizontalDateObjects,
            0
          ),
          f = Math.max(
            OneView.core.zopHandler.getPixelFromZOP(d.startZOP),
            OneView.core.zopHandler.topPixel
          );
        c < f + this.horizontalTitleHeight && (e = d);
      }
      this.gotoCalendarDateObject(e, c);
    }
    gotoCalendarDateObject(b: CalendarDateObject, c) {
      this.selectCalendarDateObject(b);
      if (void 0 !== b)
        if (
          ((this.clearSelect = this.clearSelect.bind(this)),
          this.verifyDetailsArePopulatedFor(b),
          -1 < this.rootCalendarDateObjects.indexOf(b))
        ) {
          var e =
              OneView.core.zopHandler.getZOPFromPixel(c) -
              (b.endZOP - b.startZOP) / 2,
            f = e + (b.endZOP - b.startZOP);
          OneView.core.drawAreaEffects.startAutoZoom(
            e,
            f,
            false,
            this.clearSelect
          );
        } else
          (f = b.startZOP + (b.endZOP - b.startZOP)),
            OneView.core.drawAreaEffects.startAutoZoom(
              b.startZOP,
              f,
              false,
              this.clearSelect
            );
    }
    paintMarker(b) {
      var c = this.fakeLeft + OneView.core.settings.titleWidth;
      b = OneView.core.zopHandler.dateToZOP(b);
      var e = "3" != OneView.core.commonUserSettings.theme;
      OneView.core.zopDrawArea.drawHorizontalLineThick(
        c + 2 * OneView.core.settings.tagHeight,
        b,
        OneView.core.zopHandler.rightPixel -
          c -
          OneView.core.settings.tagHeight,
        OneView.core.settings.theme.colorMarker,
        2 * OneView.core.ratio,
        e
      );
      OneView.core.zopDrawArea.drawFilledCircle(
        c + 2 * OneView.core.settings.tagHeight,
        b,
        6 * OneView.core.ratio,
        OneView.core.settings.theme.colorMarker,
        e
      );
    }
    verifyWeGotEnoughWeekZOPs() {
      if (
        60 <
          (OneView.core.zopHandler.bottomZOP - OneView.core.zopHandler.topZOP) /
            OneView.core.zopHandler.zopSizeOfWeek ||
        200 < this.weekCalendarDateObjects.length
      )
        0 < this.weekCalendarDateObjects.length &&
          (this.weekCalendarDateObjects = []);
      else {
        var b = OneView.core.zopHandler.bottomZOP;
        0 < this.weekCalendarDateObjects.length &&
          (b = this.weekCalendarDateObjects[0].startZOP);
        for (; b > OneView.core.zopHandler.topZOP; ) {
          var c = this.getStartOfWeek(
            OneView.core.zopHandler.getDateFromZOP(b)
          );
          OneView.core.zopHandler.dateToZOP(c.toDate());
          c.add(-1, "week");
          var e = this.getWeekNrForDate(c),
            b = OneView.core.zopHandler.dateToZOP(c.toDate()),
            c = new OneView.CalendarDateObject(
              OneView.CalendarDateObjectType.Week,
              new Date(c.toDate().getTime())
            );
          c.shortText = "" + e;
          c.longText = "Week " + e;
          c.weekIsOdd = 1 == e % 2;
          c.weekIsOddDubble = 1 == e % 4;
          this.weekCalendarDateObjects.unshift(c);
        }
        0 < this.weekCalendarDateObjects.length &&
          (b =
            this.weekCalendarDateObjects[
              this.weekCalendarDateObjects.length - 1
            ].endZOP);
        for (; b < OneView.core.zopHandler.bottomZOP; )
          (b = this.getStartOfWeek(OneView.core.zopHandler.getDateFromZOP(b))),
            OneView.core.zopHandler.dateToZOP(b.toDate()),
            (e = this.getWeekNrForDate(b)),
            (c = new OneView.CalendarDateObject(
              OneView.CalendarDateObjectType.Week,
              new Date(b.toDate().getTime())
            )),
            b.add(1, "week"),
            (b = OneView.core.zopHandler.dateToZOP(b.toDate())),
            (c.shortText = "" + e),
            (c.longText = "Week " + e),
            (c.weekIsOdd = 1 == e % 2),
            (c.weekIsOddDubble = 1 == e % 4),
            this.weekCalendarDateObjects.push(c);
      }
    }
    getWeekNrForDate(b) {
      var c = b.dayOfYear(),
        e =
          ((b.clone().dayOfYear(1).isoWeekday() +
            1 -
            OneView.core.commonUserSettings.firstDayOfWeek) %
            7) +
          1;
      1 > e && (e += 7);
      c = Math.floor((c + e + 5) / 7);
      4 < e && --c;
      0 == c
        ? (c = 53)
        : 53 == c &&
          2 == this.getWeekNrForDate(b.clone().add("weeks", 1)) &&
          (c = 1);
      return c;
    }
    getStartOfWeek(b) {
      b = moment(b).startOf("day");
      b.isoWeekday() != OneView.core.commonUserSettings.firstDayOfWeek &&
        (b = b.isoWeekday(OneView.core.commonUserSettings.firstDayOfWeek));
      b.isoWeekday() < OneView.core.commonUserSettings.firstDayOfWeek &&
        (b = b.add("days", -7));
      return b;
    }
    paintWeeksBackground() {
      this.verifyWeGotEnoughWeekZOPs();
      var b = Math.min(
        255,
        Math.round(
          255 -
            (27 -
              (OneView.core.zopHandler.bottomZOP -
                OneView.core.zopHandler.topZOP) /
                OneView.core.zopHandler.zopSizeOfWeek)
        )
      );
      "3" == OneView.core.commonUserSettings.theme &&
        (b = Math.floor(25 + (255 - b) / 4));
      this.oddWeekColor = "rgb(" + b + ", " + b + ", " + b + ")";
      for (b = 0; b < this.weekCalendarDateObjects.length; b++)
        if (
          this.weekCalendarDateObjects[b].endZOP >
            OneView.core.zopHandler.topZOP &&
          this.weekCalendarDateObjects[b].startZOP <
            OneView.core.zopHandler.bottomZOP
        )
          if (
            "" === OneView.core.commonUserSettings.grayDays ||
            "1234567" === OneView.core.commonUserSettings.grayDays
          ) {
            if (
              this.weekCalendarDateObjects[b].weekIsOdd != this.currentWeekIsOdd
            ) {
              var c = Math.max(
                  OneView.core.zopHandler.getPixelFromZOP(
                    this.weekCalendarDateObjects[b].startZOP
                  ),
                  OneView.core.zopHandler.topPixel
                ),
                e = Math.min(
                  OneView.core.zopHandler.getPixelFromZOP(
                    this.weekCalendarDateObjects[b].endZOP
                  ),
                  OneView.core.zopHandler.bottomPixel
                );
              OneView.core.drawArea.drawFilledRectangle(
                this.fakeLeft + OneView.core.settings.titleWidth,
                c,
                OneView.core.zopHandler.rightPixel - this.fakeLeft,
                e - c,
                this.oddWeekColor,
                false
              );
            }
          } else
            for (
              var c = OneView.core.zopHandler.getPixelFromZOP(
                  this.weekCalendarDateObjects[b].startZOP
                ),
                e = OneView.core.zopHandler.getPixelFromZOP(
                  this.weekCalendarDateObjects[b].endZOP
                ),
                e = (e - c) / 7,
                f = 1;
              7 >= f;
              f++
            ) {
              var d = f + OneView.core.commonUserSettings.firstDayOfWeek - 1;
              7 < d && (d -= 7);
              -1 < OneView.core.commonUserSettings.grayDays.indexOf("" + d) &&
                ((d = Math.max(
                  c + e * (f - 1),
                  OneView.core.zopHandler.topPixel
                )),
                OneView.core.drawArea.drawFilledRectangle(
                  this.fakeLeft + OneView.core.settings.titleWidth,
                  d,
                  OneView.core.zopHandler.rightPixel - this.fakeLeft,
                  Math.min(c + e * f + 1, OneView.core.zopHandler.bottomPixel) -
                    d,
                  this.oddWeekColor,
                  false
                ));
            }
    }
    paintWeekNumbers() {
      if (
        OneView.core.settings.allowWeekNumber &&
        OneView.core.commonUserSettings.showWeekNumbers
      ) {
        var b =
          (OneView.core.zopHandler.bottomZOP - OneView.core.zopHandler.topZOP) /
          OneView.core.zopHandler.zopSizeOfWeek;
        this.weekNumbersVisible = [];
        if (!(60 < b))
          for (var c = 0; c < this.weekCalendarDateObjects.length; c++)
            if (
              !(
                !(
                  this.weekCalendarDateObjects[c].endZOP >
                    OneView.core.zopHandler.topZOP &&
                  this.weekCalendarDateObjects[c].startZOP <
                    OneView.core.zopHandler.bottomZOP
                ) ||
                (15 < b && !this.weekCalendarDateObjects[c].weekIsOdd) ||
                (30 < b && !this.weekCalendarDateObjects[c].weekIsOddDubble)
              )
            ) {
              this.weekNumbersVisible.push(
                this.weekCalendarDateObjects[c].shortText
              );
              var e = OneView.core.zopHandler.getPixelFromZOP(
                this.weekCalendarDateObjects[c].startZOP
              );
              e <
                OneView.core.zopHandler.topPixel +
                  OneView.core.settings.weekCircleDiameter / 2 +
                  2 &&
                (e = Math.min(
                  OneView.core.zopHandler.topPixel +
                    OneView.core.settings.weekCircleDiameter / 2 +
                    2,
                  e +
                    OneView.core.zopHandler.getPixelSizeOfWeek() -
                    OneView.core.settings.weekCircleDiameter -
                    2
                ));
              OneView.core.zopDrawArea.drawFilledCircle2(
                OneView.core.zopHandler.rightPixel +
                  OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
                  OneView.core.settings.weekCircleDiameter / 2 -
                  OneView.core.settings.margin,
                e,
                OneView.core.settings.weekCircleDiameter / 2 +
                  1 * OneView.core.ratio,
                OneView.core.settings.theme.colorWeekNumberShadow,
                false
              );
              OneView.core.zopDrawArea.drawFilledCircle2(
                OneView.core.zopHandler.rightPixel +
                  OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
                  OneView.core.settings.weekCircleDiameter / 2 -
                  OneView.core.settings.margin,
                e,
                OneView.core.settings.weekCircleDiameter / 2,
                OneView.core.settings.theme.colorWeekNumberCircle,
                false
              );
              OneView.core.drawArea.drawCenteredText(
                this.weekCalendarDateObjects[c].shortText,
                OneView.core.zopHandler.rightPixel -
                  OneView.core.settings.weekCircleDiameter +
                  OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
                  OneView.core.settings.margin -
                  0.5,
                e - OneView.core.settings.tagTextHeight / 1.6,
                OneView.core.settings.weekCircleDiameter,
                OneView.core.settings.tagTextHeight,
                OneView.core.settings.theme.colorWeekNumberText,
                false,
                true
              );
            }
      }
    }
    paintCalendarDateObjects() {
      var b;
      this.counter = 0;
      this.visibleHorizontalDateObjects = [];
      this.visibleTitleBarDateObjects = [];
      this.inVisibleTitle4Objects = [];
      this.visibleLowestLevelObjects = [];
      OneView.core.zopDrawArea.clearTextDivs();
      this.decideCalendarDateObjectTypesToShowAtDifferentLevels();
      this.decideFontSizes();
      this.currentWeekIsOdd = 1 == (moment(new Date()).week() - 1) % 2;
      this.fakeLeft =
        OneView.core.zopHandler.leftPixel +
        OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged;
      this.visibleTitleBarDateObjects = this.decideVisibleObjects(
        this.titleBarDateObjectType,
        []
      );
      this.horizontalDateObjectType
        ? ((this.visibleHorizontalDateObjects = this.decideVisibleObjects(
            this.horizontalDateObjectType,
            this.visibleTitleBarDateObjects
          )),
          (this.visibleLowestLevelObjects = this.decideVisibleObjects(
            this.lowestLevelCalendarDateObjectType,
            this.visibleHorizontalDateObjects
          )))
        : (this.visibleLowestLevelObjects = this.decideVisibleObjects(
            this.lowestLevelCalendarDateObjectType,
            this.visibleTitleBarDateObjects
          ));
      OneView.core.zopDrawArea.startTextDelayedDraw();
      this.paintWeeksBackground();
      OneView.core.zopDrawArea.canvasContext.globalAlpha = Math.max(
        0,
        -OneView.core.mainMenuControl.transparency
      );
      b = OneView.core.addButtonControl.getTitleExtraData();
      var c =
        (OneView.core.settings.titleWidth -
          OneView.core.settings.title0FontSize) /
        2;
      b
        ? OneView.core.zopDrawArea.drawVerticalTitle(
            OneView.core.zopHandler.topZOP,
            OneView.core.zopHandler.bottomZOP,
            this.fakeLeft + c,
            b,
            OneView.core.settings.title0FontSize,
            OneView.core.settings.theme.colorTitleText,
            OneView.core.settings.margin,
            true,
            true
          )
        : this.paintVisibleTitleObjects(
            this.visibleTitleBarDateObjects,
            this.fakeLeft,
            c,
            false,
            OneView.core.settings.title0FontSize,
            true
          );
      OneView.core.zopDrawArea.canvasContext.globalAlpha = 1;
      if (this.horizontalDateObjectType) this.paintVisibleHorizontalTitles();
      else if (
        (this.paintVisibleLowestObjects(), 1 == this.showMonthSpecialDetails)
      )
        for (
          c = this.horizontalTitleHeight, b = 0;
          b < this.visibleLowestLevelObjects.length;
          b++
        )
          this.paintMonthSpecialDetails(this.visibleLowestLevelObjects[b], c);
      OneView.core.zopDrawArea.endTextDelayedDraw();
      this.counter = this.counter;
    }
    decideCalendarDateObjectTypesToShowAtDifferentLevels() {
      this.lowestLevelCalendarDateObjectType =
        OneView.CalendarDateObjectType.Year;
      this.title4CalendarDateObjectType = void 0;
      this.titleBarDateObjectType = OneView.CalendarDateObjectType.Title;
      this.horizontalDateObjectType = void 0;
      this.showMonthSpecialDetails =
        OneView.core.zopHandler.getPixelSizeOfYear() >=
        4 * OneView.core.settings.minDateHeight;
      OneView.core.zopHandler.getPixelSizeOfMonth() >=
        OneView.core.settings.minDateHeight &&
        ((this.lowestLevelCalendarDateObjectType =
          OneView.CalendarDateObjectType.Month),
        (this.titleBarDateObjectType =
          OneView.CalendarDateObjectType.Year),
        (this.horizontalDateObjectType = void 0),
        (this.showMonthSpecialDetails =
          OneView.core.zopHandler.getPixelSizeOfMonth() >=
          7 * OneView.core.settings.minDateHeight));
      OneView.core.zopHandler.getPixelSizeOfDay() >=
        OneView.core.settings.minDateHeight &&
        ((this.lowestLevelCalendarDateObjectType =
          OneView.CalendarDateObjectType.Day),
        (this.titleBarDateObjectType =
          OneView.CalendarDateObjectType.Month),
        (this.horizontalDateObjectType = void 0),
        (this.showMonthSpecialDetails =
          OneView.core.zopHandler.getPixelSizeOfDay() >=
          6 * OneView.core.settings.minDateHeight));
      OneView.core.zopHandler.getPixelSizeOfHour() >=
        OneView.core.settings.minDateHeight &&
        ((this.lowestLevelCalendarDateObjectType =
          OneView.CalendarDateObjectType.Hour),
        (this.titleBarDateObjectType =
          OneView.CalendarDateObjectType.Month),
        (this.horizontalDateObjectType =
          OneView.CalendarDateObjectType.Day),
        (this.showMonthSpecialDetails =
          OneView.core.zopHandler.getPixelSizeOfHour() >=
          6 * OneView.core.settings.minDateHeight));
      OneView.core.zopHandler.getPixelSizeOf5Minutes() >=
        OneView.core.settings.minDateHeight &&
        ((this.lowestLevelCalendarDateObjectType =
          OneView.CalendarDateObjectType.Minutes5),
        (this.title4CalendarDateObjectType =
          OneView.CalendarDateObjectType.Hour),
        (this.titleBarDateObjectType =
          OneView.CalendarDateObjectType.Month),
        (this.horizontalDateObjectType =
          OneView.CalendarDateObjectType.Day),
        (this.showMonthSpecialDetails =
          OneView.core.zopHandler.getPixelSizeOf5Minutes() >=
          6 * OneView.core.settings.minDateHeight));
    }
    decideFontSizes() {
      this.averageObjectPixelHeight = 0;
      this.lowestLevelCalendarDateObjectType ===
        OneView.CalendarDateObjectType.Year &&
        ((this.averageObjectPixelHeight =
          OneView.core.zopHandler.getPixelSizeOfYear()),
        (this.averageObjectPixelHeight2 =
          OneView.core.zopHandler.getPixelSizeOfMonth()));
      this.lowestLevelCalendarDateObjectType ===
        OneView.CalendarDateObjectType.Month &&
        ((this.averageObjectPixelHeight =
          OneView.core.zopHandler.getPixelSizeOfMonth()),
        (this.averageObjectPixelHeight2 =
          OneView.core.zopHandler.getPixelSizeOfDay()));
      this.lowestLevelCalendarDateObjectType ===
        OneView.CalendarDateObjectType.Day &&
        ((this.averageObjectPixelHeight =
          OneView.core.zopHandler.getPixelSizeOfDay()),
        (this.averageObjectPixelHeight2 =
          OneView.core.zopHandler.getPixelSizeOfHour()));
      this.lowestLevelCalendarDateObjectType ===
        OneView.CalendarDateObjectType.Hour &&
        ((this.averageObjectPixelHeight =
          OneView.core.zopHandler.getPixelSizeOfHour()),
        (this.averageObjectPixelHeight2 =
          OneView.core.zopHandler.getPixelSizeOf5Minutes()));
      this.lowestLevelCalendarDateObjectType ===
        OneView.CalendarDateObjectType.Minutes5 &&
        ((this.averageObjectPixelHeight =
          OneView.core.zopHandler.getPixelSizeOf5Minutes()),
        (this.averageObjectPixelHeight2 = this.averageObjectPixelHeight / 10));
      this.smallDividerColor =
        OneView.core.settings.theme.colorBigDateDividerStr +
        Math.min(
          1,
          (1.5 * this.averageObjectPixelHeight) /
            OneView.core.zopDrawArea.zopAreaHeight
        ) +
        ")";
      this.bigDividerColor =
        OneView.core.settings.theme.colorBigDateDividerStr + "1 )";
      this.innerMarginTop = OneView.core.settings.innerTopMaxMargin;
      for (var b = 0; 2 > b; b++)
        (this.textHeight = Math.round(
          Math.min(
            this.averageObjectPixelHeight - 2 * this.innerMarginTop,
            OneView.core.settings.dateBigTextSize
          )
        )),
          (this.horizontalTitleTextHeight =
            OneView.core.settings.dateBigTextSize),
          (this.extraTextHeight = Math.round(0.6 * this.textHeight)),
          (this.horizontalTitleExtraTextHeight = Math.round(
            0.6 * this.horizontalTitleTextHeight
          )),
          (this.innerMarginTop = Math.max(
            0,
            Math.min(
              this.innerMarginTop,
              (this.averageObjectPixelHeight -
                this.textHeight -
                this.extraTextHeight) /
                2 -
                2
            )
          ));
      this.innerMarginTop2 =
        this.lowestLevelCalendarDateObjectType ===
        OneView.CalendarDateObjectType.Month
          ? OneView.core.settings.innerTopMaxMargin
          : 0;
      for (b = 0; 2 > b; b++)
        (this.textHeight2 = Math.round(
          Math.min(
            OneView.core.settings.minDateHeight - 2 * this.innerMarginTop2,
            OneView.core.settings.dateBigTextSize
          )
        )),
          (this.textHeight2 = Math.round(
            Math.min(this.textHeight2, 1.1 * this.averageObjectPixelHeight2)
          )),
          (this.extraTextHeight2 = Math.round(
            Math.min(
              0.6 * this.textHeight2,
              OneView.core.settings.dateBigTextSize
            )
          )),
          (this.innerMarginTop2 = Math.max(
            0,
            Math.min(
              this.innerMarginTop2,
              (this.averageObjectPixelHeight2 -
                this.textHeight2 -
                this.extraTextHeight2) /
                2 -
                2
            )
          ));
      this.showExtraTextBelow =
        this.lowestLevelCalendarDateObjectType ===
          OneView.CalendarDateObjectType.Day &&
        this.textHeight >= OneView.core.settings.dateBigTextSize;
      this.showExtraTextBelow2 =
        this.lowestLevelCalendarDateObjectType ===
          OneView.CalendarDateObjectType.Month &&
        this.textHeight2 >= OneView.core.settings.dateBigTextSize;
      this.showExtraTextToRight =
        this.lowestLevelCalendarDateObjectType ===
          OneView.CalendarDateObjectType.Hour ||
        this.lowestLevelCalendarDateObjectType ===
          OneView.CalendarDateObjectType.Minutes5;
      this.showExtraTextToRight2 =
        this.lowestLevelCalendarDateObjectType ===
          OneView.CalendarDateObjectType.Day ||
        this.lowestLevelCalendarDateObjectType ===
          OneView.CalendarDateObjectType.Minutes5;
      this.useDividerLine =
        this.averageObjectPixelHeight > 25 * OneView.core.ratio;
      this.hourWidth = Math.round(
        OneView.core.zopDrawArea.measureTextWidth(
          "22",
          this.textHeight,
          false,
          false
        )
      );
      this.hourWidth2 = Math.round(
        OneView.core.zopDrawArea.measureTextWidth(
          "22",
          this.textHeight2,
          false,
          false
        )
      );
      this.horizontalTitleHeight =
        this.horizontalTitleTextHeight +
        (this.lowestLevelCalendarDateObjectType ==
        OneView.CalendarDateObjectType.Month
          ? 0
          : this.horizontalTitleExtraTextHeight) +
        OneView.core.settings.innerTopMaxMargin +
        OneView.core.settings.margin;
    }
    decideVisibleObjects(b, c) {
      if (0 === c.length) {
        if (b === OneView.CalendarDateObjectType.Title)
          return this.rootCalendarDateObjects;
        if (b === OneView.CalendarDateObjectType.Year)
          return this.getVisibleChildCalendarDateObjects(
            this.rootCalendarDateObjects
          );
        if (b === OneView.CalendarDateObjectType.Month)
          return this.getVisibleChildCalendarDateObjects(
            this.getVisibleChildCalendarDateObjects(
              this.rootCalendarDateObjects
            )
          );
      } else if (b == OneView.CalendarDateObjectType.Minutes5)
        return this.getVisibleChildCalendarDateObjects(
          this.getVisibleChildCalendarDateObjects(c)
        );
      return this.getVisibleChildCalendarDateObjects(c);
    }
    paintVisibleTitleObjects(b, c, e, f, d, m) {
      var g = b.length;
      if (0 !== g) {
        var l, h, k;
        for (l = 0; l < g; l++)
          (h = b[l]),
            this.drawHorizontalLine(h, OneView.core.zopHandler.topZOP),
            this.title4CalendarDateObjectType != h.calendarDateObjectType &&
              ((k = h.longText),
              true === f && (k = k + " (" + h.parentText + ")"),
              OneView.core.zopDrawArea.drawVerticalTitle(
                h.startZOP,
                h.endZOP,
                c + e,
                k,
                d,
                OneView.core.settings.theme.colorTitleText,
                OneView.core.settings.margin,
                true,
                m
              ));
      }
    }
    drawHorizontalLine(b, c) {
      var e =
        OneView.core.zopHandler.leftPixel +
        OneView.core.settings.titleWidth +
        1 * OneView.core.ratio +
        OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged;
      b.endZOP < c ||
        b.calendarDateObjectType < this.lowestLevelCalendarDateObjectType ||
        (b.calendarDateObjectType == this.lowestLevelCalendarDateObjectType
          ? this.useDividerLine &&
            OneView.core.zopDrawArea.drawHorizontalLine(
              e,
              b.endZOP,
              OneView.core.zopHandler.rightPixel - e,
              this.smallDividerColor,
              false
            )
          : b.calendarDateObjectType == this.horizontalDateObjectType
          ? this.useDividerLine &&
            OneView.core.zopDrawArea.drawHorizontalLine(
              e,
              b.endZOP,
              OneView.core.zopHandler.rightPixel - e,
              this.bigDividerColor,
              false
            )
          : OneView.core.zopHandler.getPixelFromZOP(b.endZOP) <=
            OneView.core.settings.menuButtonBottom
          ? OneView.core.zopDrawArea.drawHorizontalLine(
              e,
              b.endZOP,
              OneView.core.zopHandler.rightPixel,
              this.bigDividerColor,
              false
            )
          : OneView.core.zopDrawArea.drawHorizontalLine(
              OneView.core.zopHandler.leftPixel,
              b.endZOP,
              OneView.core.zopHandler.rightPixel,
              this.bigDividerColor,
              false
            ));
    }
    verifyDetailsArePopulatedFor(a: CalendarDateObject) {
      a.detailsArePopulated || this.populateDetails(a);
    }
    prepareThouroughRedraw(a) {
      void 0 == a && (a = this.rootCalendarDateObjects[0]);
      for (var b = a.details.length, e = 0; e < b; e++)
        (a.possibleEventTagsAtThisZoomLevel = []),
          this.prepareThouroughRedraw(a.details[e]);
    }
    getVisibleChildCalendarDateObjects(b) {
      var c,
        e,
        f,
        d = b.length,
        m,
        n,
        l = [];
      for (c = 0; c < d; c++)
        for (
          m = b[c],
            this.verifyDetailsArePopulatedFor(m),
            f = m.details.length,
            e = 0;
          e < f;
          e++
        )
          (n = m.details[e]),
            OneView.core.zopHandler.isObjectBelowExtendedScreen(n.startZOP)
              ? (e = f + 1)
              : OneView.core.zopHandler.isObjectAboveExtendedScreen(n.endZOP) ||
                l.push(n);
      return l;
    }
    paintVisibleLowestObjects() {
      var b,
        c = this.visibleLowestLevelObjects.length,
        e;
      for (b = 0; b < c; b++)
        (e = this.visibleLowestLevelObjects[b]),
          this.paintObject(
            e,
            this.showMonthSpecialDetails,
            OneView.core.zopHandler.topPixel,
            0
          );
      return true;
    }
    paintVisibleHorizontalTitles() {
      var b,
        c = this.visibleHorizontalDateObjects.length,
        e;
      for (b = 0; b < c; b++)
        (e = this.visibleHorizontalDateObjects[b]),
          this.paintObject(e, true, OneView.core.zopHandler.topPixel, 0);
      var f = this.horizontalTitleHeight;
      for (b = 0; b < c; b++)
        (e = this.visibleHorizontalDateObjects[b]),
          this.paintDaySpecialDetails(e, f);
      return true;
    }
    populateDetails(a: CalendarDateObject) {
      this.populateDetails_helper(a);
    }
    populateDetails_helper(b: CalendarDateObject) {
      b.details = [];
      for (var c = new Date(b.startDateTime.getTime()); c < b.endDateTime; ) {
        var e;
        b.calendarDateObjectType === OneView.CalendarDateObjectType.Title &&
          ((e = new OneView.CalendarDateObject(
            OneView.CalendarDateObjectType.Year,
            new Date(c.getTime())
          )),
          c.setFullYear(c.getFullYear() + 1));
        if (
          b.calendarDateObjectType === OneView.CalendarDateObjectType.Year
        )
          (e = new OneView.CalendarDateObject(
            OneView.CalendarDateObjectType.Month,
            new Date(c.getTime())
          )),
            c.setMonth(c.getMonth() + 1);
        else if (
          b.calendarDateObjectType ===
          OneView.CalendarDateObjectType.Month
        )
          (e = new OneView.CalendarDateObject(
            OneView.CalendarDateObjectType.Day,
            new Date(c.getTime())
          )),
            c.setDate(c.getDate() + 1);
        else if (
          b.calendarDateObjectType === OneView.CalendarDateObjectType.Day
        )
          (e = new OneView.CalendarDateObject(
            OneView.CalendarDateObjectType.Hour,
            new Date(c.getTime())
          )),
            (c = this.addHours(c, 1));
        else if (
          b.calendarDateObjectType === OneView.CalendarDateObjectType.Hour
        )
          (e = new OneView.CalendarDateObject(
            OneView.CalendarDateObjectType.Minutes5,
            new Date(c.getTime())
          )),
            (c = this.addMinutes(c, 5));
        else if (
          b.calendarDateObjectType ===
          OneView.CalendarDateObjectType.Minutes5
        )
          break;
        void 0 !== e &&
          null !== e &&
          (b.details.push(e),
          OneView.core.calendarEventHandler.copyEventsFromParent(b, e));
      }
      b.detailsArePopulated = true;
      OneView.core.redraw(false);
    }
    addMinutes(a, c) {
      return new Date(a.getTime() + 6e4 * c);
    }
    addHours(a, c) {
      return new Date(a.getTime() + 36e5 * c);
    }
    paintObject(b, c, e, f) {
      this.counter += 1;
      if (
        !OneView.core.zopHandler.isObjectBelowScreen(b.startZOP) &&
        !OneView.core.zopHandler.isObjectAboveScreen(b.endZOP)
      ) {
        var d =
            this.fakeLeft +
            (OneView.core.settings.titleWidth +
              OneView.core.settings.innerLeftMargin),
          m = Math.max(
            0,
            (c ? this.horizontalTitleTextHeight : this.textHeight) - f
          ),
          n = Math.max(
            0,
            (c ? this.horizontalTitleExtraTextHeight : this.extraTextHeight) - f
          );
        f = this.innerMarginTop + f;
        var l = c ? OneView.core.settings.innerTopMaxMargin : f,
          h = OneView.core.zopHandler.getPixelFromZOP(b.startZOP) + l;
        if (h < e + l)
          if (
            ((h = Math.min(
              e + l,
              OneView.core.zopHandler.getPixelFromZOP(b.endZOP) - m - n - f
            )),
            c)
          )
            this.topDateBottom =
              h +
              m +
              (this.lowestLevelCalendarDateObjectType ===
              OneView.CalendarDateObjectType.Month
                ? 0
                : n) +
              OneView.core.settings.innerTopMaxMargin +
              OneView.core.settings.margin;
          else if (h < e && this.horizontalDateObjectType)
            if (h + this.horizontalTitleHeight > e)
              (f = Math.max(
                0,
                OneView.core.settings.minDateHeight - (h + m + n - e)
              )),
                (m = Math.max(
                  0,
                  (c ? this.horizontalTitleTextHeight : this.textHeight) - f
                )),
                (n = Math.max(
                  0,
                  (c
                    ? this.horizontalTitleExtraTextHeight
                    : this.extraTextHeight) - f
                )),
                (h += f);
            else return;
        this.drawHorizontalLine(b, OneView.core.zopHandler.getZOPFromPixel(e));
        e = OneView.core.zopDrawArea.drawCalendarDateObjectName(
          d,
          h,
          0,
          b.shortText,
          m,
          b.isRed,
          void 0 !== b.ampm && null !== b.ampm,
          c
        );
        this.showExtraTextBelow || (c && b.shortText2)
          ? OneView.core.zopDrawArea.drawCalendarDateObjectName(
              d + 0,
              h,
              m,
              b.shortText2,
              n,
              b.isRed,
              false,
              c
            )
          : this.showExtraTextToRight && !b.ampm && b.shortText2
          ? OneView.core.zopDrawArea.drawCalendarDateObjectName(
              d + 0 + this.hourWidth,
              h,
              2,
              b.shortText2,
              n,
              b.isRed,
              false,
              c
            )
          : b.ampm && !b.shortText2
          ? OneView.core.zopDrawArea.drawCalendarDateObjectName(
              d + 0 + e,
              h,
              2,
              b.ampm,
              n,
              b.isRed,
              false,
              c
            )
          : b.ampm &&
            b.shortText2 &&
            (OneView.core.zopDrawArea.drawCalendarDateObjectName(
              d + 1 + e,
              h,
              2,
              b.shortText2,
              n,
              b.isRed,
              false,
              c
            ),
            OneView.core.zopDrawArea.drawCalendarDateObjectName(
              d + 1 + e,
              h,
              n + (12 > n ? 1 : 0),
              b.ampm,
              0.8 * n,
              b.isRed,
              false,
              c
            ));
      }
    }
    paintMonthSpecialDetails(b: CalendarDateObject, c) {
      this.verifyDetailsArePopulatedFor(b);
      var e,
        f = OneView.core.zopHandler.getPixelFromZOP(b.startZOP),
        d = Math.max(f + c, this.topDateBottom);
      this.useDividerLine = false;
      this.textHeight = this.textHeight2;
      this.extraTextHeight = this.extraTextHeight2;
      this.hourWidth = this.hourWidth2;
      this.averageObjectPixelHeight = this.averageObjectPixelHeight2;
      this.showExtraTextBelow = this.showExtraTextBelow2;
      this.showExtraTextToRight = this.showExtraTextToRight2;
      var m,
        n = Math.floor((d - f) / this.averageObjectPixelHeight2);
      for (e = n; e < b.details.length - 1; e += 1)
        (this.textHeight = this.textHeight2),
          (this.extraTextHeight = this.extraTextHeight2),
          (this.innerMarginTop = this.innerMarginTop2),
          (m =
            0 == e % 2
              ? 0
              : 1.5 *
                (OneView.core.settings.minDateHeight -
                  Math.max(
                    0,
                    2 * this.averageObjectPixelHeight2 -
                      OneView.core.settings.minDateHeight
                  ))),
          e === n &&
            (m +=
              ((d - f) / this.averageObjectPixelHeight2 - n) *
              OneView.core.settings.minDateHeight *
              1.5),
          this.paintObject(
            b.details[e],
            false,
            OneView.core.zopHandler.topPixel,
            m
          );
    }
    paintDaySpecialDetails(b: CalendarDateObject, c) {
      this.verifyDetailsArePopulatedFor(b);
      var e;
      e = OneView.core.zopHandler.getPixelFromZOP(
        Math.max(b.startZOP, this.visibleLowestLevelObjects[0].startZOP)
      );
      var f = Math.max(e + c, this.topDateBottom),
        d = 0,
        m = this.visibleLowestLevelObjects.length;
      for (e = 0; e < this.visibleLowestLevelObjects.length; e++)
        0 === d &&
          this.visibleLowestLevelObjects[e].startZOP > b.startZOP &&
          (d = e),
          e < m &&
            this.visibleLowestLevelObjects[e].startZOP >= b.endZOP &&
            (m = e);
      for (e = d; e < m; e += 1)
        this.paintObject(this.visibleLowestLevelObjects[e], false, f, 0);
    }
  }

  export class CalendarEventHandler {
    constructor() {
      this.rootCalendarDateObjects = [];
      this.visibleEventTagWrappers = [];
      this.visibleFullEventWrappers = [];
      this.visibleTagEventGroups = [];
      this.visibleBadges = [];
      this.lowestLevelCalendarDateObjectType = void 0;
      this.eventsFarRight =
        this.eventsFarLeft =
        this.absoluteMaxZOP =
        this.absoluteMinZOP =
        this.bottomZOP =
        this.topZOP =
        this.minFullEventZOPSize =
        this.counter =
          0;
      this.tagSurfaces = [];
      this.selectedCalendarEvent = void 0;
      this.recalc = true;
      this.commonTimeKeys = [];
      this.commonTimeKeysHelper = [];
      this.rootCalendarDateObjects.push(
        new OneView.CalendarDateObject(
          OneView.CalendarDateObjectType.Title,
          OneView.core.settings.absoluteMinDate,
          OneView.core.settings.absoluteMaxDate
        )
      );
      this.absoluteMinZOP = OneView.core.zopHandler.dateToZOP(
        OneView.core.settings.absoluteMinDate
      );
      this.absoluteMaxZOP = OneView.core.zopHandler.dateToZOP(
        OneView.core.settings.absoluteMaxDate
      );
      OneView.core.zopHandler.setAbsoluteMinMax(
        this.absoluteMinZOP,
        this.absoluteMaxZOP
      );
    }
    canEditEvent(a) {
      a = this.getOwningCalendar(a);
      return void 0 === a ? false : a.canEditCalendarEvents;
    }
    isFullDayEvent(a) {
      return 0 === moment(a.startDateTime).minutes() &&
        0 === moment(a.startDateTime).hours() &&
        0 === moment(a.endDateTime).minutes() &&
        0 === moment(a.endDateTime).hours()
        ? true
        : false;
    }
    getOwningCalendar(b) {
      return OneView.core.getCalendar(b.calendarId);
    }
    gradeCalendarEvents(a) {
      for (var b = 0; b < a.length; b++) this.gradeCalendarEvent(a[b]);
    }
    gradeCalendarEvent(a) {
      a.grade =
        100 * (a.endZOP - a.startZOP) + this.sumLettersInString(a.summary);
      a.isGraded = true;
    }
    sumLettersInString(a) {
      var b = 0,
        e = a.toLowerCase();
      for (a = 0; a < e.length; a++) b += e.charCodeAt(a) - 96;
      return b;
    }
    drawAreaResized() {}
    dataLoadReady() {
      this.somethingChanged();
    }
    somethingChanged() {
      this.zoomLevel = this.getNewZoomLevelString();
      this.prepareDataForPaint();
    }
    getNewZoomLevelString() {
      return OneView.core.calendarDateHandler.visibleLowestLevelObjects &&
        0 < OneView.core.calendarDateHandler.visibleLowestLevelObjects.length
        ? "" +
            OneView.core.calendarDateHandler.visibleLowestLevelObjects[0]
              .startZOP +
            OneView.core.calendarDateHandler.visibleLowestLevelObjects.length
        : "x";
    }
    paintCalendarEvents() {
      this.eventsFarLeft = Math.floor(
        OneView.core.settings.eventsFarLeft +
          OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged
      );
      this.eventsFarRight = Math.ceil(
        OneView.core.zopHandler.rightPixel +
          OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged
      );
      (OneView.core.hardRedraw ||
        this.recalc ||
        this.getNewZoomLevelString() !== this.zoomLevel) &&
        this.somethingChanged();
      this.recalc = !this.recalc;
      this.calculateAllWidths();
      this.visibleBadges = [];
      this.paintVisibleFullEventWrappers();
      this.paintVisibleEventTags();
      this.prepareBadges();
      this.paintBadges();
    }
    prepareDataForPaint() {
      this.visibleTagEventGroups = [];
      this.visibleFullEventWrappers = [];
      this.visibleEventTagWrappers = [];
      this.minFullEventZOPSize = Math.ceil(
        OneView.core.zopHandler.getZOPFromPixel(
          OneView.core.settings.tagHeight + 2
        ) -
          OneView.core.zopHandler.getZOPFromPixel(0) +
          1e-5
      );
      this.topZOP = OneView.core.zopHandler.extendedTopZOP;
      this.bottomZOP = OneView.core.zopHandler.extendedBottomZOP;
      var b = new OneView.TagSurface();
      b.parentCollidingFullEventWrapper = void 0;
      b.minZOP = this.topZOP;
      b.maxZOP = this.bottomZOP;
      this.tagSurfaces = [];
      this.tagSurfaces.push(b);
      this.selectVisibleFullEventsIn();
      this.selectVisibleTags();
    }
    paintSelectedCalendarEvent(a) {
      for (a = 0; a < this.visibleFullEventWrappers.length; a++);
    }
    selectVisibleTags() {
      var a, c, e, f;
      this.tagSurfaces.sort(function (a, b) {
        return a.minZOP - b.minZOP;
      });
      for (a = 0; a < this.tagSurfaces.length; a++)
        (c = this.tagSurfaces[a]),
          this.selectVisibleEventTagsIn(
            c.minZOP,
            c.maxZOP,
            false,
            false,
            c.parentCollidingFullEventWrapper
          );
      for (a = 0; a < this.visibleEventTagWrappers.length; a++)
        for (
          e = this.visibleEventTagWrappers[a], c = a + 1;
          c < this.visibleEventTagWrappers.length;
          c++
        )
          (f = this.visibleEventTagWrappers[c]),
            this.DoEventsCollide(e.calendarEvent, f.calendarEvent) &&
              (e.calendarEvent.grade > f.calendarEvent.grade
                ? (f.visible = false)
                : (e.visible = false));
    }
    prepareBadges() {
      for (
        var b, c, e, f, d = 0, m = 0, n = 0;
        n < this.tagDatasToPaint.length;
        n++
      ) {
        var l = this.tagDatasToPaint[n];
        false === l.visible && (this.tagDatasToPaint.splice(n, 1), n--);
      }
      for (n = 0; n < this.tagDatasToPaint.length; n++) {
        var h = false,
          l = this.tagDatasToPaint[n],
          k = new OneView.Badge();
        f = l.calendarEventTagWrapper.calendarEvent;
        k.textColor = OneView.core.settings.theme.badgeColorIsTagTextColor
          ? OneView.core.helper.getEventTextColor(
              f,
              OneView.core.getCalendar(f.calendarId)
            )
          : OneView.core.helper.getEventColor(
              f,
              OneView.core.getCalendar(f.calendarId)
            );
        k.topZOPForAllEvents = f.startZOP;
        k.bottomZOPForAllEvents = f.endZOP;
        var p = 0;
        c =
          n === this.tagDatasToPaint.length - 1
            ? this.bottomZOP
            : Math.min(
                f.endZOP / 2 +
                  this.tagDatasToPaint[n + 1].calendarEventTagWrapper
                    .calendarEvent.startZOP /
                    2,
                f.endZOP +
                  OneView.core.zopHandler.getZOPFromPixelDiff(
                    2 * OneView.core.settings.tagTextHeight
                  )
              );
        for (
          b =
            0 === n
              ? f.startZOP -
                OneView.core.zopHandler.getZOPFromPixelDiff(
                  2 * OneView.core.settings.tagTextHeight
                )
              : Math.max(
                  f.startZOP / 2 +
                    this.tagDatasToPaint[n - 1].calendarEventTagWrapper
                      .calendarEvent.endZOP /
                      2,
                  f.startZOP -
                    OneView.core.zopHandler.getZOPFromPixelDiff(
                      2 * OneView.core.settings.tagTextHeight
                    )
                );
          false === h &&
          d < OneView.core.calendarDateHandler.visibleLowestLevelObjects.length;

        ) {
          for (
            e = OneView.core.calendarDateHandler.visibleLowestLevelObjects[d];
            m < e.calendarEvents.length;

          ) {
            f = e.calendarEvents[m];
            if (f.startZOP > c) {
              h = true;
              break;
            }
            m++;
            true === this.doesEventStartWithinCalendarDateObject(f, e) &&
              void 0 === this.findFullEventWrapperForEvent(f) &&
              f.startZOP > b &&
              (p++,
              (k.topZOPForAllEvents = Math.min(
                k.topZOPForAllEvents,
                f.startZOP
              )),
              (k.bottomZOPForAllEvents = Math.max(
                k.bottomZOPForAllEvents,
                f.endZOP
              )));
          }
          false === h && ((m = 0), d++);
        }
        k.count = p;
        k.isPartial = l.isPartial;
        k.height = l.height;
        k.topPixel = l.topPixel;
        0 < this.visibleBadges.length &&
          ((b =
            this.visibleBadges[this.visibleBadges.length - 1].topPixel +
              this.visibleBadges[this.visibleBadges.length - 1].height +
              OneView.core.settings.margin +
              10 >=
            k.topPixel),
          this.visibleBadges[this.visibleBadges.length - 1].isPartial &&
            !k.isPartial &&
            ((k.partialBadgeAbove =
              this.visibleBadges[this.visibleBadges.length - 1]),
            (this.visibleBadges[this.visibleBadges.length - 1].closeToBellow =
              b),
            (k.closeToAbove = b)),
          !this.visibleBadges[this.visibleBadges.length - 1].isPartial &&
            k.isPartial &&
            ((this.visibleBadges[
              this.visibleBadges.length - 1
            ].partialBadgeBellow = k),
            (this.visibleBadges[this.visibleBadges.length - 1].closeToBellow =
              b),
            (k.closeToAbove = b)));
        this.visibleBadges.push(k);
      }
    }
    paintBadges() {
      for (var b = 0; b < this.visibleBadges.length; b++) {
        var c = this.visibleBadges[b],
          e = 0,
          f = 0,
          d = c.topPixel,
          e = e + c.count;
        1 < e && (f = c.height);
        !c.isPartial &&
          c.partialBadgeAbove &&
          0.9 > c.partialBadgeAbove.height / OneView.core.settings.tagHeight &&
          ((e =
            c.partialBadgeAbove.closeToBellow &&
            c.partialBadgeAbove.closeToAbove
              ? e + Math.ceil(c.partialBadgeAbove.count / 2)
              : c.partialBadgeAbove.closeToBellow &&
                !c.partialBadgeAbove.closeToAbove
              ? e + c.partialBadgeAbove.count
              : e + 0),
          1 < e &&
            (f = Math.max(
              OneView.core.settings.tagHeight - c.partialBadgeAbove.height,
              f
            )));
        !c.isPartial &&
          c.partialBadgeBellow &&
          0.9 > c.partialBadgeBellow.height / OneView.core.settings.tagHeight &&
          ((e =
            c.partialBadgeBellow.closeToAbove &&
            c.partialBadgeBellow.closeToBellow
              ? e + Math.floor(c.partialBadgeBellow.count / 2)
              : c.partialBadgeBellow.closeToAbove &&
                !c.partialBadgeBellow.closeToBellow
              ? e + c.partialBadgeBellow.count
              : e + 0),
          1 < e &&
            OneView.core.settings.tagHeight - c.partialBadgeBellow.height > f &&
            ((f =
              OneView.core.settings.tagHeight - c.partialBadgeBellow.height),
            (d = d + OneView.core.settings.tagHeight - f)));
        var m = e + "";
        1 < e &&
          OneView.core.zopDrawArea.drawBadge(
            OneView.core.settings.badgesLeft +
              OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
            d,
            f,
            OneView.core.settings.eventsFarLeft +
              OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
              3 * OneView.core.ratio,
            m,
            f / OneView.core.settings.tagHeight,
            c.textColor
          );
      }
    }
    selectBiggestFullEventAndMakeVisibleOld(b, c, e, f, d) {
      var g, n, l, h, k;
      for (
        g = 0;
        g < OneView.core.calendarDateHandler.visibleLowestLevelObjects.length;
        g++
      )
        for (
          k = OneView.core.calendarDateHandler.visibleLowestLevelObjects[g],
            n = 0;
          n < k.possibleFullEvents.length;
          n++
        )
          if (
            ((h = k.possibleFullEvents[n]),
            h.endZOP - h.startZOP >= this.minFullEventZOPSize &&
              !this.IsEventInCollisionList(d, h) &&
              h.startZOP <= c &&
              (!e || h.startZOP >= b) &&
              h.endZOP >= b &&
              (!f || h.endZOP <= c))
          ) {
            if (void 0 === l || h.grade > l.grade) l = h;
            n = k.possibleFullEvents.length;
          }
      if (void 0 !== l)
        return (
          (b = this.findFullEventWrapperForEvent(l)),
          void 0 === b &&
            ((b = new OneView.CalendarFullEventWrapper(l)),
            this.visibleFullEventWrappers.push(b)),
          this.AddTagSurface(b),
          b
        );
    }
    selectBiggestFullEventAndMakeVisible() {
      var b, c, e, f, d;
      for (
        b = 0;
        b < OneView.core.calendarDateHandler.visibleLowestLevelObjects.length;
        b++
      )
        for (
          d = OneView.core.calendarDateHandler.visibleLowestLevelObjects[b],
            c = 0;
          c < d.possibleFullEvents.length;
          c++
        )
          (f = d.possibleFullEvents[c]),
            f.endZOP - f.startZOP >= this.minFullEventZOPSize &&
              void 0 === this.findFullEventWrapperForEvent(f) &&
              this.calendarEventIsOnExtendedScreen(f) &&
              (void 0 === e || f.grade > e.grade) &&
              (e = f);
      if (void 0 !== e)
        return (
          (b = new OneView.CalendarFullEventWrapper(e)),
          this.AddTagSurface(b),
          this.AddVisibleFullEventWrapper(b),
          b
        );
    }
    AddVisibleFullEventWrapper(a) {
      var b, e, f;
      for (b = this.visibleFullEventWrappers.length - 1; 0 <= b; b--) {
        var d = this.visibleFullEventWrappers[b];
        if (this.DoEventsCollide(a.calendarEvent, d.calendarEvent)) {
          f = false;
          if (void 0 !== a.parentCollidingFullEventWrappers)
            for (e = 0; e < a.parentCollidingFullEventWrappers.length; e++)
              this.IsEventInCollisionList(
                a.parentCollidingFullEventWrappers[e],
                d.calendarEvent
              ) && (f = true);
          false === f &&
            (d.childCollidingFullEventWrappers.push(a),
            a.parentCollidingFullEventWrappers.push(d));
        }
      }
      this.visibleFullEventWrappers.push(a);
    }
    DoEventsCollide(a, c) {
      return a.startZOP <= c.endZOP && a.endZOP >= c.startZOP;
    }
    AddTagSurface(b) {
      var c = new OneView.TagSurface();
      c.parentCollidingFullEventWrapper = b;
      c.minZOP = b.calendarEvent.startZOP;
      c.maxZOP = b.calendarEvent.endZOP;
      for (b = 0; b < this.tagSurfaces.length; b++)
        this.SubtractSpaceFromSurface(this.tagSurfaces[b], c.minZOP, c.maxZOP);
      this.tagSurfaces.push(c);
    }
    SubtractSpaceFromSurface(b, c, e) {
      if (b.minZOP >= c && b.maxZOP <= e) b.maxZOP = b.minZOP - 1;
      else if (b.minZOP >= c && b.minZOP < e && b.maxZOP > e) b.minZOP = e + 1;
      else if (b.minZOP < c && b.maxZOP > e) {
        var f = new OneView.TagSurface();
        f.parentCollidingFullEventWrapper = b.parentCollidingFullEventWrapper;
        f.minZOP = e + 1;
        f.maxZOP = b.maxZOP;
        this.tagSurfaces.push(f);
        b.maxZOP = c - 1;
      } else
        b.maxZOP >= c && b.minZOP <= c && b.maxZOP <= e && (b.maxZOP = c - 1);
    }
    IsEventInCollisionList(a, c) {
      var b;
      if (void 0 === a) return false;
      if (a.calendarEvent === c) return true;
      for (b = 0; b < a.parentCollidingFullEventWrappers.length; b++)
        if (
          a.parentCollidingFullEventWrappers[b].calendarEvent === c ||
          this.IsEventInCollisionList(a.parentCollidingFullEventWrappers[b], c)
        )
          return true;
      return false;
    }
    calculateMinAndPrefWidth(a) {
      a.preferredWidth =
        (this.eventsFarRight - this.eventsFarLeft) *
        (0.2 +
          this.minFullEventZOPSize /
            (a.calendarEvent.endZOP - a.calendarEvent.startZOP));
    }
    calculateWhere2CollidingEventsMeet(a, c, e) {
      e.left =
        a === this.eventsFarLeft
          ? a
          : Math.max(
              a,
              this.eventsFarLeft +
                ((c - this.eventsFarLeft) *
                  (this.eventsFarRight - this.eventsFarLeft)) /
                  (c - this.eventsFarLeft + e.preferredWidth)
            );
    }
    selectVisibleFullEventsIn() {
      var a;
      do a = this.selectBiggestFullEventAndMakeVisible();
      while (void 0 !== a);
    }
    selectVisibleEventTagsIn(b, c, e, f, d) {
      var g, n;
      for (
        g = 0;
        g < OneView.core.calendarDateHandler.visibleLowestLevelObjects.length;
        g++
      )
        (n = OneView.core.calendarDateHandler.visibleLowestLevelObjects[g]),
          n.calendarDateObjectType ===
            OneView.core.calendarDateHandler
              .lowestLevelCalendarDateObjectType &&
            n.startZOP <= c &&
            n.endZOP >= b - (n.endZOP - n.startZOP) &&
            this.selectVisibleEventTagsFor(n, b, c, e, f, d);
    }
    paintVisibleFullEventWrappers() {
      var b, c, e, f;
      for (b = 0; b < this.visibleFullEventWrappers.length; b++)
        (c = this.visibleFullEventWrappers[b].calendarEvent),
          (e = this.visibleFullEventWrappers[b].left),
          (f = this.visibleFullEventWrappers[b].right - e),
          true === OneView.core.settings.rightToLeft &&
            ((e = Math.floor(this.eventsFarRight + this.eventsFarLeft - e - f)),
            (this.visibleFullEventWrappers[b].paintedLeft = e),
            (this.visibleFullEventWrappers[b].paintedRight = e + f)),
          (this.visibleFullEventWrappers[b].left = e),
          (this.visibleFullEventWrappers[b].right = e + f),
          0 < f &&
            OneView.core.zopDrawArea.drawFullEvent(
              e,
              c.startZOP,
              c.endZOP,
              f,
              OneView.core.helper.getEventColor(
                c,
                OneView.core.getCalendar(c.calendarId)
              ),
              OneView.core.helper.getEventTextColor(
                c,
                OneView.core.getCalendar(c.calendarId)
              ),
              c.summary
            );
    }
    paintVisibleEventTags() {
      var b,
        c,
        e,
        f = 0,
        d = 0,
        m = 1e4,
        n,
        l,
        h,
        k,
        p;
      this.tagDatasToPaint = [];
      for (b = 0; b < this.visibleTagEventGroups.length; b++)
        if (
          ((e = this.visibleTagEventGroups[b]),
          e.calendarDateObject.calendarDateObjectType ===
            OneView.core.calendarDateHandler.lowestLevelCalendarDateObjectType)
        ) {
          d = f = 0;
          m = 1e4;
          for (c = e.calendarEventTagWrappers.length - 1; 0 <= c; c--)
            (l = e.calendarEventTagWrappers[c]),
              (n =
                OneView.core.zopHandler.getFractionalPixelDistance(
                  l.calendarEvent.startZOP - e.parentTopZOP
                ) -
                OneView.core.settings.tagHeight * c),
              (m = Math.min(
                m,
                (e.availableSpace / e.countDetails) * (l.position + 1) -
                  OneView.core.settings.tagHeight * c
              )),
              (m = Math.min(n, m)),
              (m = Math.max(m, 0)),
              (m = Math.floor(m)),
              (l.wantedPixelShift = m);
          for (c = 0; c < e.calendarEventTagWrappers.length; c++)
            if (
              ((l = e.calendarEventTagWrappers[c]),
              (h = l.calendarEvent),
              (m = h.summary),
              (n = OneView.core.helper.getEventColor(
                h,
                OneView.core.getCalendar(h.calendarId)
              )),
              (h = OneView.core.helper.getEventTextColor(
                h,
                OneView.core.getCalendar(h.calendarId)
              )),
              l.wantedPixelShift > d &&
                ((d = l.wantedPixelShift), (d = Math.min(d, e.extraSpace))),
              (p = l.right - l.left),
              (k = l.left),
              true === OneView.core.settings.rightToLeft &&
                ((k = this.eventsFarLeft),
                (l.paintedLeft = k),
                (l.paintedRight = k + p)),
              true === l.visible)
            ) {
              var q = new OneView.TagDataToPaint();
              q.calendarEventTagWrapper = l;
              q.visible = true;
              q.left = k;
              q.zopHeight = l.calendarEvent.endZOP - l.calendarEvent.startZOP;
              q.topPixel =
                OneView.core.zopHandler.getPixelFromZOP(e.startZOP) +
                OneView.core.settings.tagHeight * c +
                f +
                d;
              q.width = p;
              q.color = n;
              q.textColor = h;
              l.partialHeight
                ? ((q.height = l.partialHeight),
                  (q.isPartial = true),
                  (f = l.partialHeight - OneView.core.settings.tagHeight))
                : ((q.height = OneView.core.settings.tagHeight),
                  (q.isPartial = false));
              q.text = m;
              this.tagDatasToPaint.push(q);
              l.topPixel = q.topPixel;
              l.bottomPixel = q.topPixel + q.height;
            }
        }
      this.tagDatasToPaint.sort(function (a, b) {
        return a.topPixel - b.topPixel;
      });
      var r;
      for (b = 0; b < this.tagDatasToPaint.length - 1; b++)
        (c = this.tagDatasToPaint[b]),
          (e = this.tagDatasToPaint[b + 1]),
          b + 2 < this.tagDatasToPaint.length &&
            (r = this.tagDatasToPaint[b + 2]),
          this.checkForPixelOverlap(c, e),
          this.checkForPixelOverlap(c, r);
      for (b = this.tagDatasToPaint.length - 1; 0 <= b; b--)
        (r = Math.max(
          0,
          OneView.core.zopHandler.getPixelFromZOP(
            this.tagDatasToPaint[b].calendarEventTagWrapper.calendarEvent
              .startZOP
          ) - this.tagDatasToPaint[b].topPixel
        )),
          (r = Math.min(Math.floor(this.tagDatasToPaint[b].height / 2), r)),
          0 < r &&
            ((r = this.getSpaceBellow(
              this.tagDatasToPaint[b].topPixel + this.tagDatasToPaint[b].height,
              this.tagDatasToPaint[b].left,
              this.tagDatasToPaint[b].left + this.tagDatasToPaint[b].width,
              r,
              this.tagDatasToPaint
            )),
            0 < r && (this.tagDatasToPaint[b].topPixel += r));
      for (b = 0; b < this.tagDatasToPaint.length; b++)
        (c = this.tagDatasToPaint[b]),
          true === c.visible &&
            OneView.core.zopDrawArea.drawTag(
              c.left,
              c.topPixel,
              c.width,
              c.color,
              c.textColor,
              c.height,
              c.text,
              c.height / OneView.core.settings.tagHeight
            );
    }
    getSpaceBellow(b, c, e, f, d) {
      var g,
        n = f;
      for (g = 0; g < this.visibleFullEventWrappers.length && 0 < n; g++) {
        var l = this.visibleFullEventWrappers[g];
        OneView.core.zopHandler.getPixelFromZOP(l.calendarEvent.endZOP) > b &&
          l.left < e &&
          (n = Math.min(
            n,
            OneView.core.zopHandler.getPixelFromZOP(l.calendarEvent.startZOP) -
              b
          ));
      }
      for (g = 0; g < d.length && 0 < n; g++)
        (l = d[g]),
          l.topPixel + l.height > b &&
            l.left < e &&
            l.left + l.width > c &&
            (n = Math.min(n, l.topPixel - b));
      return Math.min(f, n);
    }
    checkForPixelOverlap(a, c) {
      if (void 0 !== c) {
        var b = Math.round(a.topPixel + a.height - c.topPixel);
        2 < b &&
          (a.zopHeight >= c.zopHeight
            ? ((c.isPartial = true),
              (c.calendarEventTagWrapper.isPartial = true),
              (c.topPixel += b),
              (c.height -= b),
              2 >= c.height && (c.visible = false))
            : a.zopHeight < c.zopHeight &&
              ((a.isPartial = true),
              (a.calendarEventTagWrapper.isPartial = true),
              (a.height -= b),
              2 >= a.height && (OneView.Visible = false)));
      }
    }
    copyEventsFromParent(a, c) {
      var b;
      if (void 0 !== a.calendarEvents)
        for (b = 0; b < a.calendarEvents.length; b++)
          this.addEventToCalendarDateObjectAndChildren(a.calendarEvents[b], c);
    }
    getTopTagAtThisZoomLevel(a) {
      var b;
      for (b = 0; b < a.possibleFullEvents.length; b++)
        if (
          void 0 ===
            this.findFullEventWrapperForEvent(a.possibleFullEvents[b]) &&
          this.doesEventStartWithinCalendarDateObject(
            a.possibleFullEvents[b],
            a
          )
        )
          return a.possibleFullEvents[b];
      return a.topNonFullEvent;
    }
    doesEventStartWithinCalendarDateObject(a, c) {
      return a.startZOP >= c.startZOP && a.startZOP < c.endZOP;
    }
    selectAndOrderPossibleEventTagsAtThisZoomLevel(b) {
      var c = 0,
        e;
      b.possibleEventTagsAtThisZoomLevel = [];
      this.verifyChildCalendarDateObjectsAreReadyForParentToBeShown(b);
      if (0 < b.details.length)
        for (c = 0; c < b.details.length; c++)
          (e = this.getTopTagAtThisZoomLevel(b.details[c])) &&
            this.addPossibleEventTagsAtThisZoomLevel(b, e, c, b.details[c]);
      else
        for (c = 0; c < b.calendarEvents.length; c++)
          (e = b.calendarEvents[c]),
            void 0 === this.findFullEventWrapperForEvent(e) &&
              this.doesEventStartWithinCalendarDateObject(e, b) &&
              (this.addPossibleEventTagsAtThisZoomLevel(b, e, c, b),
              b.possibleEventTagsAtThisZoomLevel.push(
                new OneView.PossibleEventTagsAtThisZoomLevel(e, b, b, c)
              ));
      b.possibleEventTagsAtThisZoomLevel.sort(function (a, b) {
        return b.calendarEvent.grade - a.calendarEvent.grade;
      });
    }
    addPossibleEventTagsAtThisZoomLevel(b, c, e, f) {
      b.possibleEventTagsAtThisZoomLevelMinZop =
        void 0 === b.possibleEventTagsAtThisZoomLevelMinZop
          ? c.startZOP
          : Math.min(b.possibleEventTagsAtThisZoomLevelMinZop, c.startZOP);
      b.possibleEventTagsAtThisZoomLevelMaxZop =
        void 0 === b.possibleEventTagsAtThisZoomLevelMaxZop
          ? c.endZOP
          : Math.max(b.possibleEventTagsAtThisZoomLevelMaxZop, c.endZOP);
      b.possibleEventTagsAtThisZoomLevel.push(
        new OneView.PossibleEventTagsAtThisZoomLevel(c, b, f, e)
      );
    }
    removeCalendarEvent(b) {
      var c;
      for (
        c = 0;
        c < OneView.core.calendarDateHandler.rootCalendarDateObjects.length;
        c++
      )
        this.removeCalendarEventFromDateObjectandChildren(
          b,
          OneView.core.calendarDateHandler.rootCalendarDateObjects[c]
        );
    }
    removeCalendarEventFromDateObjectandChildren(a, c) {
      var b;
      c.isReadyForParentToBeShown = false;
      for (b = 0; b < c.possibleFullEvents.length; b++)
        if (c.possibleFullEvents[b] == a) {
          c.possibleFullEvents.splice(b, 1);
          break;
        }
      for (b = 0; b < c.calendarEvents.length; b++)
        if (c.calendarEvents[b] == a) {
          c.calendarEvents.splice(b, 1);
          break;
        }
      c.topNonFullEvent = void 0;
      c.possibleEventTagsAtThisZoomLevel = [];
      c.possibleEventTagsAtThisZoomLevelMinZop = void 0;
      c.possibleEventTagsAtThisZoomLevelMaxZop = void 0;
      if (c.details)
        for (b = 0; b < c.details.length; b++)
          this.removeCalendarEventFromDateObjectandChildren(a, c.details[b]);
    }
    getCalendarEventsByIdAndRecurringId(b) {
      var c,
        e,
        f = [];
      for (
        e = 0;
        e < OneView.core.calendarDateHandler.rootCalendarDateObjects.length;
        e++
      ) {
        var d = OneView.core.calendarDateHandler.rootCalendarDateObjects[e];
        for (c = 0; c < d.calendarEvents.length; c++)
          (d.calendarEvents[c].recurringEventId != b &&
            d.calendarEvents[c].id != b) ||
            f.push(d.calendarEvents[c]);
      }
      return f;
    }
    reorderAllEvents() {
      var b;
      for (
        b = 0;
        b < OneView.core.calendarDateHandler.rootCalendarDateObjects.length;
        b++
      )
        this.reorderAllEventsInDateObjectandChildren(
          OneView.core.calendarDateHandler.rootCalendarDateObjects[b]
        );
    }
    reorderAllEventsInDateObjectandChildren(a) {
      var b;
      a.isReadyForParentToBeShown = false;
      a.topNonFullEvent = void 0;
      a.possibleEventTagsAtThisZoomLevel = [];
      a.possibleEventTagsAtThisZoomLevelMinZop = void 0;
      a.possibleEventTagsAtThisZoomLevelMaxZop = void 0;
      if (a.details)
        for (b = 0; b < a.details.length; b++)
          this.reorderAllEventsInDateObjectandChildren(a.details[b]);
    }
    clearAllEvents() {
      var b;
      for (
        b = 0;
        b < OneView.core.calendarDateHandler.rootCalendarDateObjects.length;
        b++
      )
        this.clearAllEventsFromDateObjectandChildren(
          OneView.core.calendarDateHandler.rootCalendarDateObjects[b]
        );
      this.visibleEventTagWrappers = [];
      this.visibleTagEventGroups = [];
    }
    clearAllEventsFromDateObjectandChildren(a) {
      var b;
      a.isReadyForParentToBeShown = false;
      a.possibleFullEvents = [];
      a.calendarEvents = [];
      a.topNonFullEvent = void 0;
      a.possibleEventTagsAtThisZoomLevel = [];
      a.possibleEventTagsAtThisZoomLevelMinZop = void 0;
      a.possibleEventTagsAtThisZoomLevelMaxZop = void 0;
      if (a.details)
        for (b = 0; b < a.details.length; b++)
          this.clearAllEventsFromDateObjectandChildren(a.details[b]);
    }
    addEventToCalendar(b) {
      var c;
      for (
        c = 0;
        c < OneView.core.calendarDateHandler.rootCalendarDateObjects.length;
        c++
      )
        this.addEventToCalendarDateObjectAndChildren(
          b,
          OneView.core.calendarDateHandler.rootCalendarDateObjects[c]
        );
      this.addCommonTimeKey(b.startDateTime, 2);
    }
    addCommonTimeKey(a, c) {
      var b = a.getHours() + "-" + a.getMinutes(),
        f = this.commonTimeKeysHelper.indexOf(b);
      -1 == f
        ? (this.commonTimeKeys.push({
            timeKey: b,
            counter: 1,
          }),
          this.commonTimeKeysHelper.push(b))
        : this.commonTimeKeys[f].counter++;
    }
    findCommonTimes() {
      var a,
        c = new Date();
      c.setHours(0, 0, 0, 0);
      for (a = 0; 24 > a; a++)
        c.setHours(a, 0, 0, 0),
          this.addCommonTimeKey(c, 6),
          c.setHours(a, 5, 0, 0),
          this.addCommonTimeKey(c, 1),
          c.setHours(a, 10, 0, 0),
          this.addCommonTimeKey(c, 6),
          c.setHours(a, 15, 0, 0),
          this.addCommonTimeKey(c, 2),
          c.setHours(a, 20, 0, 0),
          this.addCommonTimeKey(c, 1),
          c.setHours(a, 25, 0, 0),
          this.addCommonTimeKey(c, 1),
          c.setHours(a, 30, 0, 0),
          this.addCommonTimeKey(c, 4),
          c.setHours(a, 35, 0, 0),
          this.addCommonTimeKey(c, 1),
          c.setHours(a, 40, 0, 0),
          this.addCommonTimeKey(c, 1),
          c.setHours(a, 45, 0, 0),
          this.addCommonTimeKey(c, 2),
          c.setHours(a, 50, 0, 0),
          this.addCommonTimeKey(c, 1),
          c.setHours(a, 55, 0, 0),
          this.addCommonTimeKey(c, 1);
      this.commonTimeKeys.sort(function (a, b) {
        return b.counter - a.counter;
      });
    }
    addEventToCalendarDateObjectAndChildren(a, c) {
      var b;
      if (
        a.endZOP >= c.startZOP &&
        a.startZOP < c.endZOP &&
        (c.calendarEvents.push(a),
        a.endZOP - a.startZOP > (c.endZOP - c.startZOP) / 32 &&
          c.possibleFullEvents.push(a),
        (c.isReadyForParentToBeShown = false),
        c.details)
      )
        for (b = 0; b < c.details.length; b++)
          this.addEventToCalendarDateObjectAndChildren(a, c.details[b]);
    }
    getOrCreateEventTagWrapperFor(b) {
      var c = this.findEventTagWrappersForEvent(b);
      void 0 === c &&
        ((c = new OneView.CalendarEventTagWrapper(b)),
        (c.calendarEvent = b),
        this.visibleEventTagWrappers.push(c));
      return c;
    }
    findFullEventWrapperForEvent(a) {
      var b;
      for (b = 0; b < this.visibleFullEventWrappers.length; b++)
        if (this.visibleFullEventWrappers[b].calendarEvent == a)
          return this.visibleFullEventWrappers[b];
    }
    findEventTagWrappersForEvent(a) {
      var b;
      for (b = 0; b < this.visibleEventTagWrappers.length; b++)
        if (this.visibleEventTagWrappers[b].calendarEvent == a)
          return this.visibleEventTagWrappers[b];
    }
    verifyChildCalendarDateObjectsAreReadyForParentToBeShown(
      b: CalendarDateObject
    ) {
      OneView.core.calendarDateHandler.verifyDetailsArePopulatedFor(b);
      var c = b.details.length,
        e,
        f;
      for (e = 0; e < c; e++)
        (f = b.details[e]),
          this.verifyCalendarDateObjectIsReadyForParentToBeShown(f);
    }
    verifyCalendarDateObjectIsReadyForParentToBeShown(a) {
      if (true !== a.isReadyForParentToBeShown) {
        var b;
        a.possibleFullEvents.sort(function (a, b) {
          return b.grade - a.grade;
        });
        a.topNonFullEvent = void 0;
        for (b = 0; b < a.calendarEvents.length; b++)
          -1 === a.possibleFullEvents.indexOf(a.calendarEvents[b]) &&
            (void 0 === a.topNonFullEvent ||
              a.topNonFullEvent.grade < a.calendarEvents[b].grade) &&
            (a.topNonFullEvent = a.calendarEvents[b]);
        a.isReadyForParentToBeShown = true;
      }
    }
    selectVisibleEventTagsFor(b, c, e, f, d, m) {
      OneView.core.debugCounter++;
      f = true;
      this.verifyChildCalendarDateObjectsAreReadyForParentToBeShown(b);
      this.selectAndOrderPossibleEventTagsAtThisZoomLevel(b);
      var g = void 0,
        l = 0,
        h,
        k = 0,
        p = 0,
        q = 0,
        r,
        v,
        t = false,
        l = Math.max(
          c,
          Math.min(b.startZOP, b.possibleEventTagsAtThisZoomLevelMinZop)
        );
      r = Math.min(
        e,
        Math.max(b.endZOP, b.possibleEventTagsAtThisZoomLevelMaxZop)
      );
      for (h = 0; h < b.possibleEventTagsAtThisZoomLevel.length; h++)
        (g = b.possibleEventTagsAtThisZoomLevel[h].calendarEvent),
          ((f && g.startZOP >= c) || (!f && g.endZOP >= c)) &&
            ((d && g.endZOP <= e) || (!d && g.startZOP <= e)) &&
            ((l = Math.min(l, g.startZOP)), (r = Math.max(r, g.endZOP))),
          b.possibleEventTagsAtThisZoomLevel[h].calendarEvent.endZOP >= c &&
            b.possibleEventTagsAtThisZoomLevel[h].calendarEvent.startZOP <= c &&
            void 0 !== m &&
            ((p = this.getOrCreateEventTagWrapperFor(
              b.possibleEventTagsAtThisZoomLevel[h].calendarEvent
            )),
            m.childCollidingEventTagWrappers.push(p),
            p.parentCollidingFullEventWrappers.push(m));
      var w = Math.ceil(
          OneView.core.zopHandler.getFractionalPixelDistance(r - l) - 0.5
        ),
        z = Math.ceil(w / OneView.core.settings.tagHeight),
        x = Math.floor(w / OneView.core.settings.tagHeight),
        A = w - x * OneView.core.settings.tagHeight,
        u = new OneView.CalendarEventTagGroup(b, w),
        g = b.startZOP >= c && b.endZOP <= e,
        y = 0;
      u.startZOP = l;
      u.countDetails = b.details.length;
      false === g &&
        ((y = this.getPositionSubtractionForEventTags(b, c)),
        (u.countDetails = this.countDetailsForPartialCalendarDateObject(
          b,
          c,
          e
        )));
      if (0 < z) {
        u.calendarDateObject = b;
        u.parentTopZOP = l;
        u.parentBottomZOP = r;
        this.visibleTagEventGroups.push(u);
        b.possibleEventTagsAtThisZoomLevel &&
          (q = b.possibleEventTagsAtThisZoomLevel.length - 1);
        for (h = 0; h < z; h++) {
          g = void 0;
          for (l = 0; k <= q && void 0 === g; )
            ((f &&
              b.possibleEventTagsAtThisZoomLevel[k].calendarEvent.startZOP >=
                c) ||
              (!f &&
                b.possibleEventTagsAtThisZoomLevel[k].calendarEvent.endZOP >=
                  c)) &&
              ((d &&
                b.possibleEventTagsAtThisZoomLevel[k].calendarEvent.endZOP <=
                  e) ||
                (!d &&
                  b.possibleEventTagsAtThisZoomLevel[k].calendarEvent
                    .startZOP <= e)) &&
              this.calendarEventIsOnExtendedScreen(
                b.possibleEventTagsAtThisZoomLevel[k].calendarEvent
              ) &&
              ((g = b.possibleEventTagsAtThisZoomLevel[k].calendarEvent),
              (l = b.possibleEventTagsAtThisZoomLevel[k].position)),
              (k += 1);
          void 0 === g &&
            0 === h &&
            b.topNonFullEvent &&
            ((f && b.topNonFullEvent.startZOP >= c) ||
              (!f && b.topNonFullEvent.endZOP >= c)) &&
            ((d && b.topNonFullEvent.endZOP <= e) ||
              (!d && b.topNonFullEvent.startZOP <= e)) &&
            this.calendarEventIsOnExtendedScreen(b.topNonFullEvent) &&
            ((g = b.topNonFullEvent), (l = 100));
          if (g) {
            t = false;
            for (p = 0; p < u.calendarEventTagWrappers.length; p++)
              if (
                ((r = u.calendarEventTagWrappers[p].calendarEvent.startZOP),
                (v = u.calendarEventTagWrappers[p].calendarEvent.endZOP),
                (g.startZOP >= r && g.startZOP <= v) ||
                  (g.endZOP >= r && g.endZOP <= v))
              )
                t = true;
            t
              ? --h
              : ((p = this.getOrCreateEventTagWrapperFor(g)),
                (p.calendarEvent = g),
                (p.position = l - y),
                (p.left = this.eventsFarLeft),
                (p.right = this.eventsFarRight),
                u.calendarEventTagWrappers.push(p),
                void 0 !== m &&
                  (m.childCollidingEventTagWrappers.push(p),
                  p.parentCollidingFullEventWrappers.push(m)));
          }
        }
        u.calendarEventTagWrappers.length > x
          ? ((u.calendarEventTagWrappers[
              u.calendarEventTagWrappers.length - 1
            ].partialHeight = A),
            (u.calendarEventTagWrappers[
              u.calendarEventTagWrappers.length - 1
            ].isPartial = true))
          : (u.extraSpace =
              w -
              u.calendarEventTagWrappers.length *
                OneView.core.settings.tagHeight);
        u.calendarEventTagWrappers.sort(function (a, b) {
          return a.position - b.position;
        });
      }
    }
    calendarEventIsOnExtendedScreen(a) {
      return a.startZOP <= this.bottomZOP && a.endZOP >= this.topZOP;
    }
    getPositionSubtractionForEventTags(a, c) {
      var b;
      for (b = 0; b < a.details.length && !(a.details[b].startZOP >= c); b++);
      return b;
    }
    countDetailsForPartialCalendarDateObject(a, c, e) {
      var b,
        d = 0;
      for (b = 0; b < a.details.length; b++)
        a.details[b].startZOP >= c && a.details[b].endZOP <= e && (d += 1);
      return d;
    }
    calculateAllWidths() {
      var a, c, e, d, g;
      for (a = 0; a < this.visibleFullEventWrappers.length; a++) {
        e = this.visibleFullEventWrappers[a];
        for (c = 0; c < e.childCollidingEventTagWrappers.length; c++)
          (e.childCollidingEventTagWrappers[c].left = void 0),
            (e.childCollidingEventTagWrappers[c].right = void 0);
        e.widthPercent = 0;
        e.widthPercentWhenTagsExist = 0;
        e.left = void 0;
        e.right = void 0;
        e.preferredWidth = void 0;
        e.paintedLeft = void 0;
        e.paintedRight = void 0;
      }
      for (a = 0; a < this.visibleFullEventWrappers.length; a++)
        if (
          ((e = this.visibleFullEventWrappers[a]),
          (c =
            void 0 !== e.childCollidingEventTagWrappers &&
            0 < e.childCollidingEventTagWrappers.length))
        ) {
          for (c = g = 0; c < e.childCollidingEventTagWrappers.length; c++)
            (d = e.childCollidingEventTagWrappers[c]),
              (d = this.calculateOutOfScopeFactor(d.calendarEvent)),
              (g = Math.max(g, d));
          g = this.calculateTagWidthsHelper(e, this.topZOP, this.bottomZOP, g);
          for (c = 0; c < e.childCollidingEventTagWrappers.length; c++)
            if (
              ((e.childCollidingEventTagWrappers[c].right =
                this.eventsFarRight),
              g >= this.eventsFarRight)
            )
              e.childCollidingEventTagWrappers[c].visible = false;
            else if (
              void 0 === e.childCollidingEventTagWrappers[c].left ||
              e.childCollidingEventTagWrappers[c].left < g
            )
              e.childCollidingEventTagWrappers[c].left = g;
        }
      for (a = 0; a < this.visibleFullEventWrappers.length; a++) {
        e = this.visibleFullEventWrappers[a];
        g = this.eventsFarLeft;
        d = this.eventsFarRight;
        if (void 0 !== e.childCollidingEventTagWrappers)
          for (c = 0; c < e.childCollidingEventTagWrappers.length; c++)
            e.childCollidingEventTagWrappers[c].visible &&
              (d = Math.min(e.childCollidingEventTagWrappers[c].left, d));
        this.calculateWidthsHelper(e, g, d, this.topZOP, this.bottomZOP);
        void 0 === e.left && (e.left = this.eventsFarLeft);
        void 0 === e.right && (e.right = this.eventsFarRight);
      }
      for (a = 0; a < this.visibleEventTagWrappers.length; a++) {
        g = this.eventsFarLeft;
        d = this.visibleEventTagWrappers[a];
        if (void 0 !== d.parentCollidingFullEventWrappers)
          for (c = 0; c < d.parentCollidingFullEventWrappers.length; c++)
            g = Math.max(g, d.parentCollidingFullEventWrappers[c].right);
        d.left = g;
      }
    }
    calculateOutOfScopeFactor(b) {
      var c = 1,
        e =
          (OneView.core.zopHandler.bottomZOP - OneView.core.zopHandler.topZOP) /
          10;
      b.endZOP < OneView.core.zopHandler.topZOP - e
        ? (c =
            (b.endZOP - this.topZOP) /
            (OneView.core.zopHandler.topZOP - e - this.topZOP))
        : b.startZOP > OneView.core.zopHandler.bottomZOP + e &&
          (c =
            (b.startZOP - this.bottomZOP) /
            (OneView.core.zopHandler.bottomZOP + e - this.bottomZOP));
      return c;
    }
    calculateTagWidthsHelper(b, c, e, d) {
      c = this.eventsFarRight - this.eventsFarLeft;
      var f, m;
      e = this.eventsFarLeft;
      var n,
        l,
        h = 0,
        k = 0,
        p = 1,
        q;
      b = this.GetFullEventWrapperCollisionPaths(b);
      for (l = 0; l < b.length; l++) {
        f = b[l];
        for (n = 0; n < f.length; n++)
          (m = f[n]),
            (q = this.calculateOutOfScopeFactor(m.calendarEvent)),
            (h += (m.calendarEvent.endZOP - m.calendarEvent.startZOP) * q);
        h += this.minFullEventZOPSize * d * d;
        for (n = 0; n < f.length; n++)
          (m = f[n]),
            (q = this.calculateOutOfScopeFactor(m.calendarEvent)),
            this.calculateFullEventWrapperWidthPercent(m, h, p, q),
            (p = Math.max(
              0,
              Math.min(
                1,
                (m.calendarEvent.endZOP - m.calendarEvent.startZOP) /
                  (this.minFullEventZOPSize / 1.2) -
                  1.2
              )
            )),
            (k += m.widthPercent);
        n = Math.max(0.1, (h - this.minFullEventZOPSize) / h) * p * d * d;
        k += n;
        for (n = 0; n < f.length; n++)
          (m = f[n]),
            (m = Math.floor((m.widthPercent / k) * c)),
            m < OneView.core.settings.tagHeight &&
              ((c += OneView.core.settings.tagHeight - m),
              (m = OneView.core.settings.tagHeight)),
            (e += m);
      }
      e > this.eventsFarRight - 3 && (e = this.eventsFarRight);
      return e;
    }
    calculateFullEventWrapperMaxWidth(b) {
      return Math.max(
        (this.eventsFarRight - this.eventsFarLeft) *
          Math.min(
            1,
            (2 * (this.bottomZOP - this.topZOP)) /
              (b.calendarEvent.endZOP - b.calendarEvent.startZOP)
          ),
        OneView.core.settings.tagHeight +
          OneView.core.settings.tagColorWidth +
          1
      );
    }
    calculateWidthsHelper(b, c, e, d, g) {
      d = e - c;
      var f,
        n,
        l,
        h,
        k,
        p = (g = 0),
        q = 1;
      b = this.GetFullEventWrapperCollisionPaths(b);
      for (k = 0; k < b.length; k++) {
        f = b[k];
        for (h = 0; h < f.length; h++)
          (n = f[h]),
            (l = this.calculateOutOfScopeFactor(n.calendarEvent)),
            (g += (n.calendarEvent.endZOP - n.calendarEvent.startZOP) * l);
        for (h = 0; h < f.length; h++)
          (n = f[h]),
            (l = this.calculateOutOfScopeFactor(n.calendarEvent)),
            this.calculateFullEventWrapperWidthPercent(n, g, q, l),
            (q = Math.max(
              0.05,
              Math.min(
                1,
                (n.calendarEvent.endZOP - n.calendarEvent.startZOP) /
                  this.minFullEventZOPSize -
                  0.95
              )
            )),
            (p += n.widthPercent);
        for (h = 0; h < f.length; h++) {
          n = f[h];
          (void 0 === n.left || n.left > c) &&
            this.SetLeftForFullEventWrapper(n, c);
          l = (n.widthPercent / p) * d;
          var r = this.calculateFullEventWrapperMaxWidth(n);
          r < l && ((d += 2 * (l - r)), (l = r));
          l < OneView.core.settings.tagHeight &&
            ((d += OneView.core.settings.tagHeight - l),
            (l = OneView.core.settings.tagHeight));
          c += l;
          (void 0 === n.right || n.right > c) &&
            this.SetRightForFullEventWrapper(n, Math.floor(c));
        }
        0 < f.length &&
          f[f.length - 1].right > e - 3 &&
          (f[f.length - 1].right = e);
      }
    }
    calculateFullEventWrapperWidthPercent(a, c, e, d) {
      a.widthPercent =
        Math.max(
          0.16,
          (c - (a.calendarEvent.endZOP - a.calendarEvent.startZOP)) / c
        ) *
        e *
        d;
    }
    GetFullEventWrapperCollisionPaths(a) {
      var b,
        e,
        d = [];
      if (
        void 0 === a.parentCollidingFullEventWrappers ||
        0 === a.parentCollidingFullEventWrappers.length
      )
        return [[a]];
      for (b = 0; b < a.parentCollidingFullEventWrappers.length; b++) {
        var g = this.GetFullEventWrapperCollisionPaths(
          a.parentCollidingFullEventWrappers[b]
        );
        for (e = 0; e < g.length; e++) g[e].push(a), d.push(g[e]);
      }
      return d;
    }
    SetRightForFullEventWrapper(a, c) {
      var b;
      if (void 0 === a.right || a.right > c)
        if (((a.right = c), void 0 !== a.childCollidingFullEventWrappers))
          for (b = 0; b < a.childCollidingFullEventWrappers.length; b++)
            this.SetLeftForFullEventWrapper(
              a.childCollidingFullEventWrappers[b],
              c
            );
    }
    SetLeftForFullEventWrapper(a, c) {
      var b;
      if (
        a.left !== c &&
        ((a.left = c), void 0 !== a.parentCollidingFullEventWrappers)
      )
        for (b = 0; b < a.parentCollidingFullEventWrappers.length; b++)
          this.SetRightForFullEventWrapper(
            a.parentCollidingFullEventWrappers[b],
            c
          );
    }
    SetLeftForEventTagWrapper(a, c) {
      var b;
      if (
        a.left !== c &&
        ((a.left = c), void 0 !== a.parentCollidingFullEventWrappers)
      )
        for (b = 0; b < a.parentCollidingFullEventWrappers.length; b++)
          this.SetRightForFullEventWrapper(
            a.parentCollidingFullEventWrappers[b],
            c
          );
    }
    gotoBadgeAt(b, c) {
      if (
        b >= OneView.core.settings.badgesLeft &&
        b <= OneView.core.settings.eventsFarLeft
      )
        for (var e = 0; e < this.visibleBadges.length; e++)
          if (
            c >= this.visibleBadges[e].topPixel &&
            c <=
              this.visibleBadges[e].topPixel + OneView.core.settings.tagHeight
          ) {
            if (0 == this.visibleBadges[e].count) break;
            var d =
              this.visibleBadges[e].bottomZOPForAllEvents -
              this.visibleBadges[e].topZOPForAllEvents;
            OneView.core.drawAreaEffects.startAutoZoom(
              this.visibleBadges[e].topZOPForAllEvents - d,
              this.visibleBadges[e].bottomZOPForAllEvents + d,
              false,
              function () {}
            );
            return true;
          }
      return false;
    }
    selectCalendarEventObjectAt(b, c) {
      var e,
        d,
        g = OneView.core.zopHandler.getZOPFromPixel(c);
      this.selectedCalendarEvent = void 0;
      for (e = 0; e < this.visibleFullEventWrappers.length; e++)
        (d = this.visibleFullEventWrappers[e]),
          g >= d.calendarEvent.startZOP &&
            g <= d.calendarEvent.endZOP &&
            b >= d.paintedLeft &&
            b <= d.paintedRight &&
            (this.selectedCalendarEvent =
              this.visibleFullEventWrappers[e].calendarEvent);
      for (e = 0; e < this.visibleEventTagWrappers.length; e++)
        (d = this.visibleEventTagWrappers[e]),
          c >= d.topPixel &&
            c <= d.bottomPixel &&
            b >= d.paintedLeft &&
            b <= d.paintedRight &&
            (this.selectedCalendarEvent =
              this.visibleEventTagWrappers[e].calendarEvent);
      return this.selectedCalendarEvent;
    }
  }

  export class DateTimeSelectionHandler {
    constructor() {
      this.markerLeft =
        this.markerWidth =
        this.markerHeight =
        this.margin =
        this.topPanelHeight =
        this.topPanelTop =
        this.topPanelWidth =
        this.topPanelLeft =
          0;
      this.textColor = this.markerColor = "";
      this.bottomMarkerY =
        this.topMarkerY =
        this.draggingBottomMarkerOffset =
        this.draggingTopMarkerOffset =
          0;
      this.startDragBottomY =
        this.startDragTopY =
        this.startDragBottomDateTime =
        this.startDragTopDateTime =
        this.originalBottomDateTime =
        this.originalTopDateTime =
          void 0;
      this.bottomText = this.topText = "";
      this.precision = 4;
      this.buttonHeight =
        this.buttonWidth =
        this.cancelButtonLeft =
        this.cancelButtonTop =
        this.okButtonLeft =
        this.okButtonTop =
          0;
      this.pageHtml =
        '<div id="dateTimeSelectionTopBar" class="topBar" style="position:relative; z-index:1000">    <button id="dateTimeSelectionCancel" class="topBarButton" style="width:50%; z-index:1000"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>    <button id="dateTimeSelectionOk" class="topBarButton" style="width:50%; z-index:1000"><img src="images/check.svg" class="topBarImage"/><span>{#Ok#}</span></button></div>';
    }
    init() {
      this.topPanelHeight = OneView.core.settings.titleWidth;
    }
    paint() {
      void 0 !== this.calendarEventObject &&
        true === OneView.core.appStateHandler.isChoosingDateTimeForEvent &&
        ((this.topPanelLeft = OneView.core.zopDrawArea.screenLeft),
        (this.topPanelWidth = OneView.core.domHandler.screenWidth),
        (this.topPanelTop = OneView.core.zopDrawArea.screenTop),
        (this.topPanelHeight = this.getSpaceTakenAtTop()),
        (this.margin = this.topPanelHeight / 6),
        (this.markerHeight = 2 * OneView.core.settings.tagHeight),
        (this.markerWidth = 2 * OneView.core.settings.titleWidth),
        (this.markerLeft =
          OneView.core.zopDrawArea.screenLeft +
          OneView.core.domHandler.screenWidth -
          this.markerWidth),
        (this.markerColor = OneView.core.settings.theme.colorDark),
        (this.textColor = OneView.core.settings.theme.colorLight),
        this.calendarEventObject && this.paintMarkers());
    }
    startEditing(b, c, e) {
      this.callback = e;
      this.editType = c;
      this.calendarEventObject = b;
      this.originalTopDateTime = b.startDateTime;
      this.originalBottomDateTime = b.endDateTime;
      this.topText = "START";
      this.bottomText = "END";
      c = 6 * (b.endZOP - b.startZOP);
      OneView.core.drawAreaEffects.startAutoZoom(
        b.startZOP - c,
        b.endZOP + c,
        false,
        function () {}
      );
    }
    paintMarkers() {
      this.topMarkerY = OneView.core.zopHandler.getPixelFromZOP(
        this.calendarEventObject.startZOP
      );
      this.bottomMarkerY = OneView.core.zopHandler.getPixelFromZOP(
        this.calendarEventObject.endZOP
      );
      OneView.core.appStateHandler.isDraggingTopMarker
        ? (this.paintMarker(this.bottomText, this.bottomMarkerY, false),
          this.paintMarker(this.topText, this.topMarkerY, true))
        : (this.paintMarker(this.topText, this.topMarkerY, true),
          this.paintMarker(this.bottomText, this.bottomMarkerY, false));
    }
    makeNiceTimeToShow(a) {
      return (
        a.getMonth() +
        " " +
        a.getDate() +
        " " +
        a.getHours() +
        " " +
        a.getMinutes()
      );
    }
    makeVisible(b) {
      if (b) {
        this.buttonDiv = OneView.core.domHandler.addDiv(
          "dateTimeSelectionbuttons",
          "",
          "controlsRoot"
        );
        this.buttonDiv.innerHTML = this.pageHtml;
        b = (OneView.core.settings.titleWidth / OneView.core.ratio - 24) / 2;
        var c = document.getElementById("dateTimeSelectionOk"),
          e = document.getElementById("dateTimeSelectionCancel");
        c.style.padding = b + "px";
        e.style.padding = b + "px";
        c.style.backgroundColor = OneView.core.settings.theme.colorDark;
        e.style.backgroundColor = OneView.core.settings.theme.colorDark;
        OneView.core.domHandler.addClickEvent(
          "dateTimeSelectionOk",
          this.saveChanges,
          this
        );
        OneView.core.domHandler.addClickEvent(
          "dateTimeSelectionCancel",
          this.cancelChanges,
          this
        );
      } else OneView.core.domHandler.removeElement(this.buttonDiv.id);
    }
    getSpaceTakenAtTop() {
      return OneView.core.settings.titleWidth;
    }
    getSpaceTakenAtBottom() {
      return OneView.core.settings.titleWidth;
    }
    paintButton(b, c, e, d, g) {
      OneView.core.drawArea.drawFilledRectangle(
        c,
        e,
        d,
        g,
        OneView.core.settings.theme.colorDark,
        false
      );
      g -= 6;
      OneView.core.drawArea.setFont(g, false, false, false);
      var f = OneView.core.zopDrawArea.measureTextWidth(b, g, false, true),
        f = (d - f) / 2;
      OneView.core.zopDrawArea.drawText(
        b,
        c + f,
        e,
        -3,
        g,
        OneView.core.settings.theme.colorLight,
        OneView.core.settings.theme.colorDark,
        false,
        d - f,
        false,
        false
      );
    }
    paintMarker(b, c, e) {
      e
        ? (OneView.core.zopDrawArea.drawHorizontalLineThick(
            OneView.core.settings.eventsFarLeft - 1,
            OneView.core.zopHandler.getZOPFromPixel(c - 1),
            this.markerLeft + this.markerWidth,
            this.markerColor,
            3,
            true
          ),
          (c -= this.markerHeight))
        : OneView.core.zopDrawArea.drawHorizontalLineThick(
            OneView.core.settings.eventsFarLeft - 1,
            OneView.core.zopHandler.getZOPFromPixel(c + 1),
            this.markerLeft + this.markerWidth,
            this.markerColor,
            3,
            true
          );
      OneView.core.drawArea.drawFilledRectangle(
        this.markerLeft,
        c,
        this.markerWidth,
        this.markerHeight,
        this.markerColor,
        true
      );
      e = this.markerHeight / 6;
      var d = this.markerLeft + this.markerWidth - 4 * e,
        g = c + (this.markerHeight - 3 * e) / 2 - 1;
      OneView.core.drawArea.drawFilledRectangle(
        d + 1 * e,
        g + 0 * e,
        2,
        2,
        this.textColor,
        false
      );
      OneView.core.drawArea.drawFilledRectangle(
        d + 1 * e,
        g + 1 * e,
        2,
        2,
        this.textColor,
        false
      );
      OneView.core.drawArea.drawFilledRectangle(
        d + 1 * e,
        g + 2 * e,
        2,
        2,
        this.textColor,
        false
      );
      OneView.core.drawArea.drawFilledRectangle(
        d + 1 * e,
        g + 3 * e,
        2,
        2,
        this.textColor,
        false
      );
      OneView.core.drawArea.drawFilledRectangle(
        d + 2 * e,
        g + 0 * e,
        2,
        2,
        this.textColor,
        false
      );
      OneView.core.drawArea.drawFilledRectangle(
        d + 2 * e,
        g + 1 * e,
        2,
        2,
        this.textColor,
        false
      );
      OneView.core.drawArea.drawFilledRectangle(
        d + 2 * e,
        g + 2 * e,
        2,
        2,
        this.textColor,
        false
      );
      OneView.core.drawArea.drawFilledRectangle(
        d + 2 * e,
        g + 3 * e,
        2,
        2,
        this.textColor,
        false
      );
      e = this.markerHeight / 2 - 4;
      OneView.core.zopDrawArea.drawText(
        b,
        this.markerLeft + 5,
        c + this.markerHeight / 2 - e / 2,
        0,
        e,
        this.textColor,
        this.markerColor,
        false,
        this.markerWidth - 5,
        false,
        false
      );
    }
    click(a, c) {
      return false;
    }
    saveChanges(b) {
      OneView.core.appStateHandler.setChoosingDateTimeForEvent(false);
      this.callback
        ? this.callback()
        : OneView.core.calendarDataProxy.editExistingEvent(
            this.calendarEventObject,
            this.editType
          );
    }
    cancelChanges(b) {
      OneView.core.appStateHandler.setChoosingDateTimeForEvent(false);
      this.calendarEventObject.startDateTime = this.originalTopDateTime;
      this.calendarEventObject.endDateTime = this.originalBottomDateTime;
      OneView.core.zopHandler.updateStartEndZOP(this.calendarEventObject);
      this.callback && this.callback();
    }
    hitTopMarkerAt(a, c) {
      return c >= this.topMarkerY - this.markerHeight &&
        c <= this.topMarkerY &&
        a >= this.markerLeft &&
        a <= this.markerLeft + this.markerWidth
        ? true
        : false;
    }
    hitBottomMarkerAt(a, c) {
      return c >= this.bottomMarkerY &&
        c <= this.bottomMarkerY + this.markerHeight &&
        a >= this.markerLeft &&
        a <= this.markerLeft + this.markerWidth
        ? true
        : false;
    }
    startDraggingTopMarker(b) {
      this.draggingTopMarkerOffset = b;
      OneView.core.appStateHandler.isDraggingTopMarker = true;
      this.startDragTopDateTime = this.calendarEventObject.startDateTime;
      OneView.core.appStateHandler.isDraggingBottomMarker ||
        (this.startDragBottomDateTime = this.calendarEventObject.endDateTime);
    }
    startDraggingBottomMarker(b) {
      this.draggingBottomMarkerOffset = b;
      OneView.core.appStateHandler.isDraggingBottomMarker = true;
      this.startDragBottomDateTime = this.calendarEventObject.endDateTime;
    }
    continueDraggingTopMarker(b) {
      b -= this.draggingTopMarkerOffset;
      this.topMarkerY =
        OneView.core.zopHandler.getPixelFromZOP(
          OneView.core.zopHandler.dateToZOP(this.startDragTopDateTime)
        ) + b;
      if (
        (b = OneView.core.calendarDateHandler.getClosestFakeDetailAt(
          this.topMarkerY,
          this.precision,
          true
        ))
      )
        (this.calendarEventObject.startDateTime = b.startDateTime),
          (this.calendarEventObject.startZOP = b.startZOP),
          (this.topText = b.shortText),
          b.shortText2 && (this.topText += " " + b.shortText2);
      !OneView.core.appStateHandler.isDraggingBottomMarker &&
        ((b =
          this.startDragBottomDateTime.getTime() -
          this.startDragTopDateTime.getTime()),
        (this.calendarEventObject.endDateTime = new Date(
          this.calendarEventObject.startDateTime.getTime() + b
        )),
        OneView.core.zopHandler.updateStartEndZOP(this.calendarEventObject),
        (this.bottomMarkerY = OneView.core.zopHandler.getPixelFromZOP(
          this.calendarEventObject.endZOP
        )),
        (b = OneView.core.calendarDateHandler.getClosestFakeDetailAt(
          this.bottomMarkerY,
          1,
          true
        ))) &&
        ((this.calendarEventObject.endDateTime = b.startDateTime),
        (this.calendarEventObject.endZOP = b.startZOP),
        (this.bottomText = b.shortText),
        b.shortText2 && (this.bottomText += " " + b.shortText2));
    }
    continueDraggingBottomMarker(b) {
      b -= this.draggingBottomMarkerOffset;
      this.bottomMarkerY =
        OneView.core.zopHandler.getPixelFromZOP(
          OneView.core.zopHandler.dateToZOP(this.startDragBottomDateTime)
        ) + b;
      this.bottomMarkerY = Math.max(
        this.bottomMarkerY,
        this.topMarkerY + this.precision + 1
      );
      if (
        (b = OneView.core.calendarDateHandler.getClosestFakeDetailAt(
          this.bottomMarkerY,
          this.precision,
          true
        ))
      )
        (this.calendarEventObject.endDateTime = b.startDateTime),
          (this.calendarEventObject.endZOP = b.startZOP),
          (this.bottomText = b.shortText),
          b.shortText2 && (this.bottomText += " " + b.shortText2);
    }
    endDraggingTopMarker() {
      OneView.core.appStateHandler.isDraggingTopMarker = false;
    }
    endDraggingBottomMarker() {
      OneView.core.appStateHandler.isDraggingBottomMarker = false;
    }
  }

  export class EventHandler {
    constructor() {
      this.touches = [];
      this.mouseWasDraged = this.mouseRightDown = this.mouseLeftDown = false;
      this.canBeAClick = true;
      this.touchOneFingerStarted = this.startedInTitleArea = false;
      this.touchOneFingerStartY = this.touchOneFingerStartX = 0;
      this.toucohEnabledDevice = this.touchTwoFingerStarted = false;
      this.touchSlop = 8;
      this.elementsWithMouseEvents = [];
      this.timeForLastScrollEvent =
        this.fingerLastDraggingBottomMarker =
        this.fingerLastDraggingTopMarker =
          0;
    }
    addBatchEventsTo(b) {
      this.removeBatchElementsFrom(b);
      this.touchEnd = this.touchEnd.bind(this);
      b.addEventListener("touchend", this.touchEnd, false);
      this.touchMove = this.touchMove.bind(this);
      b.addEventListener("touchmove", this.touchMove, false);
      this.touchStart = this.touchStart.bind(this);
      b.addEventListener("touchstart", this.touchStart, false);
      this.touchLeave = this.touchLeave.bind(this);
      b.addEventListener("touchleave", this.touchLeave, false);
      OneView.core.isCordovaApp || this.addMouseEvents(b);
    }
    removeBatchElementsFrom(b) {
      b.removeEventListener("touchend", this.touchEnd, false);
      b.removeEventListener("touchmove", this.touchMove, false);
      b.removeEventListener("touchstart", this.touchStart, false);
      b.removeEventListener("touchleave", this.touchLeave, false);
      OneView.core.isCordovaApp || this.removeMouseEvents(b);
    }
    addMouseEvents(a) {
      this.elementsWithMouseEvents.push(a);
      this.mouseDown = this.mouseDown.bind(this);
      a.addEventListener("mousedown", this.mouseDown, false);
      this.mouseMove = this.mouseMove.bind(this);
      a.addEventListener("mousemove", this.mouseMove, false);
      this.mouseUp = this.mouseUp.bind(this);
      a.addEventListener("mouseup", this.mouseUp, false);
      this.mouseLeave = this.mouseLeave.bind(this);
      a.addEventListener("mouseleave", this.mouseLeave, false);
      this.mouseScroll = this.mouseScroll.bind(this);
      a.addEventListener("mousewheel", this.mouseScroll, false);
      window.addEventListener("DOMMouseScroll", this.mouseScroll, false);
    }
    removeMouseEvents(a) {
      a.removeEventListener("mousedown", this.mouseDown, false);
      a.removeEventListener("mousemove", this.mouseMove, false);
      a.removeEventListener("mouseup", this.mouseUp, false);
      a.removeEventListener("mouseleave", this.mouseLeave, false);
      a.removeEventListener("mousewheel", this.mouseScroll, false);
      window.removeEventListener("DOMMouseScroll", this.mouseScroll, false);
    }
    reAddAllMouseEvents() {
      var a;
      for (a = 0; a < this.elementsWithMouseEvents.length; a++)
        this.addMouseEvents(this.elementsWithMouseEvents[a]);
    }
    removeAllMouseEvents() {
      var a;
      for (a = 0; a < this.elementsWithMouseEvents.length; a++)
        this.removeMouseEvents(this.elementsWithMouseEvents[a]);
    }
    closeAllPagesAndMenus() {
      if (
        OneView.core.appStateHandler.isChoosingDateTimeForEvent ||
        OneView.core.appStateHandler.isMainMenuShowing ||
        OneView.core.appStateHandler.isPopupMainMenuShowing ||
        OneView.core.appStateHandler.isPopupEditRecurringMenuShowing ||
        OneView.core.appStateHandler.viewEventControlIsShowing ||
        OneView.core.appStateHandler.editEventControlIsShowing ||
        OneView.core.appStateHandler.calendarsControlIsShowing ||
        OneView.core.appStateHandler.shopControlIsShowing ||
        OneView.core.appStateHandler.settingsControlIsShowing
      )
        for (; OneView.core.appStateHandler.back(); );
    }
    click(b, c) {
      var e = false,
        d =
          OneView.core.domHandler.screenTopForDOM * OneView.core.ratio +
          OneView.core.zopDrawArea.zopAreaTop,
        g =
          OneView.core.domHandler.screenLeftForDOM * OneView.core.ratio +
          OneView.core.zopDrawArea.zopAreaLeft;
      OneView.core.appStateHandler.isChoosingDateTimeForEvent &&
        (e = OneView.core.dateTimeSelectionHandler.click(b, c));
      e ||
        (OneView.core.appStateHandler.isMainMenuShowing
          ? OneView.core.mainMenuControl.click(b - g, c - d)
          : OneView.core.mainMenuControl.hitMenuButton(b - g, c - d) &&
            !OneView.core.appStateHandler.isChoosingDateTimeForEvent
          ? OneView.core.appStateHandler.mainButtonPressed()
          : (e = OneView.core.calendarDateHandler.getHitWeekAt(
              b - g,
              c - d,
              true
            ))
          ? OneView.core.calendarDateHandler.gotoCalendarDateObject(e, c - d)
          : ((e = OneView.core.calendarEventHandler.selectCalendarEventObjectAt(
              b - g,
              c - d
            )) ||
              (e =
                OneView.core.calendarEventHandler.selectCalendarEventObjectAt(
                  b - g,
                  c - d + 4
                )),
            e ||
              (e =
                OneView.core.calendarEventHandler.selectCalendarEventObjectAt(
                  b - g,
                  c - d - 4
                )),
            e ||
              (e =
                OneView.core.calendarEventHandler.selectCalendarEventObjectAt(
                  b - g + 2,
                  c - d
                )),
            e ||
              (e =
                OneView.core.calendarEventHandler.selectCalendarEventObjectAt(
                  b - g - 2,
                  c - d
                )),
            e ||
              (e =
                OneView.core.calendarEventHandler.selectCalendarEventObjectAt(
                  b - g,
                  c - d + 8
                )),
            e ||
              (e =
                OneView.core.calendarEventHandler.selectCalendarEventObjectAt(
                  b - g,
                  c - d - 8
                )),
            e ||
              (e =
                OneView.core.calendarEventHandler.selectCalendarEventObjectAt(
                  b - g + 4,
                  c - d
                )),
            e ||
              (e =
                OneView.core.calendarEventHandler.selectCalendarEventObjectAt(
                  b - g - 4,
                  c - d
                )),
            e
              ? OneView.core.appStateHandler.viewEvent(e)
              : OneView.core.calendarEventHandler.gotoBadgeAt(b - g, c - d) ||
                OneView.core.calendarDateHandler.gotoCalendarDateObjectAt(
                  b - g,
                  c - d
                )));
      OneView.core.redraw(true);
    }
    testIfStartDraggingMarker(b, c, e) {
      OneView.core.dateTimeSelectionHandler.hitTopMarkerAt(b, c)
        ? (OneView.core.dateTimeSelectionHandler.startDraggingTopMarker(c),
          OneView.core.redraw(false),
          (this.fingerLastDraggingTopMarker = e))
        : OneView.core.dateTimeSelectionHandler.hitBottomMarkerAt(b, c) &&
          (OneView.core.dateTimeSelectionHandler.startDraggingBottomMarker(c),
          OneView.core.redraw(false),
          (this.fingerLastDraggingBottomMarker = e));
    }
    testIfContinueDraggingMarker(b, c) {
      OneView.core.appStateHandler.isDraggingTopMarker &&
      c === this.fingerLastDraggingTopMarker
        ? (OneView.core.dateTimeSelectionHandler.continueDraggingTopMarker(b),
          OneView.core.redraw(false))
        : OneView.core.appStateHandler.isDraggingBottomMarker &&
          c === this.fingerLastDraggingBottomMarker &&
          (OneView.core.dateTimeSelectionHandler.continueDraggingBottomMarker(
            b
          ),
          OneView.core.redraw(false));
    }
    testIfEndDraggingMarker() {
      OneView.core.appStateHandler.isDraggingTopMarker
        ? (OneView.core.dateTimeSelectionHandler.endDraggingTopMarker(),
          OneView.core.redraw(false))
        : OneView.core.appStateHandler.isDraggingBottomMarker &&
          (OneView.core.dateTimeSelectionHandler.endDraggingBottomMarker(),
          OneView.core.redraw(false));
    }
    touchStart(b) {
      b.preventDefault();
      this.canBeAClick = true;
      OneView.core.drawAreaEffects.isScrollingOrZooming() &&
        (this.canBeAClick = false);
      OneView.core.preloadAllImages();
      OneView.core.drawAreaEffects.stopAllEffects();
      OneView.core.touchEnabledDevice = true;
      this.touches = b.touches;
      OneView.core.firstTouchMade = true;
      b =
        this.getTouchX(this.touches[0]) *
        OneView.core.ratio *
        OneView.core.domRatio;
      var c =
        this.getTouchY(this.touches[0]) *
        OneView.core.ratio *
        OneView.core.domRatio;
      this.startedInTitleArea = OneView.core.mainMenuControl.startDragging(
        b,
        c
      );
      OneView.core.appStateHandler.isChoosingDateTimeForEvent &&
        (1 <= this.touches.length &&
          (this.testIfEndDraggingMarker(),
          this.testIfStartDraggingMarker(b, c, 0)),
        2 <= this.touches.length &&
          this.testIfStartDraggingMarker(
            this.getTouchX(this.touches[1]) *
              OneView.core.ratio *
              OneView.core.domRatio,
            this.getTouchY(this.touches[1]) *
              OneView.core.ratio *
              OneView.core.domRatio,
            1
          ));
      1 === this.touches.length &&
        ((this.touchOneFingerStarted = true),
        (this.touchOneFingerStartX = this.getTouchX(this.touches[0])),
        (this.touchOneFingerStartY = this.getTouchY(this.touches[0])),
        (this.currentPressStartedTime = OneView.core.getTimeStamp()),
        (this.longPressStartX = b),
        (this.longPressStartY = c));
      2 <= this.touches.length &&
        ((this.touchOneFingerStarted = false),
        (this.touchTwoFingerStarted = true),
        (this.canBeAClick = false));
      OneView.core.addButtonControl.startDragging(b, c) ||
        OneView.core.appStateHandler.isDraggingTopMarker ||
        OneView.core.appStateHandler.isDraggingBottomMarker ||
        OneView.core.appStateHandler.isMainMenuShowing ||
        OneView.core.appStateHandler.isPopupMainMenuShowing ||
        OneView.core.appStateHandler.isPopupEditRecurringMenuShowing ||
        (1 === this.touches.length && OneView.core.zopHandler.startScroll(c),
        2 <= this.touches.length &&
          OneView.core.zopHandler.startZoom(
            c,
            this.getTouchY(this.touches[1]) *
              OneView.core.ratio *
              OneView.core.domRatio
          ));
      this.timeWhenLastTouchEnded &&
        this.timeWhenLastTouchEnded + 250 > OneView.core.getTimeStamp() &&
        (this.canBeAClick = false);
      OneView.core.redraw(false);
      return false;
    }
    getTouchX(b) {
      return b.pageX - OneView.core.domHandler.screenLeftForDOM;
    }
    getTouchY(b) {
      return b.pageY - OneView.core.domHandler.screenTopForDOM;
    }
    mouseDown(b) {
      b.preventDefault();
      OneView.core.firstTouchMade = true;
      if (true === OneView.core.touchEnabledDevice) this.removeAllMouseEvents();
      else {
        OneView.core.drawAreaEffects.stopAllEffects();
        OneView.core.preloadAllImages();
        this.mouseWasDragged = 0;
        var c = b.pageY * OneView.core.ratio * OneView.core.domRatio,
          e = b.pageX * OneView.core.ratio * OneView.core.domRatio,
          d =
            (b.pageY - OneView.core.domHandler.screenTopForDOM) *
            OneView.core.ratio *
            OneView.core.domRatio,
          g =
            (b.pageX - OneView.core.domHandler.screenLeftForDOM) *
            OneView.core.ratio *
            OneView.core.domRatio;
        this.startedInTitleArea = OneView.core.mainMenuControl.startDragging(
          g,
          d
        );
        if (0 === b.button) {
          this.canBeAClick = this.mouseLeftDown = true;
          this.longPressStartX = e;
          this.longPressStartY = c;
          this.currentPressStartedTime = OneView.core.getTimeStamp();
          OneView.core.appStateHandler.isChoosingDateTimeForEvent &&
            this.testIfStartDraggingMarker(e, c, 0);
          if (OneView.core.addButtonControl.startDragging(g, d)) return;
          OneView.core.appStateHandler.isDraggingTopMarker ||
            OneView.core.appStateHandler.isDraggingBottomMarker ||
            OneView.core.appStateHandler.isMainMenuShowing ||
            OneView.core.appStateHandler.isPopupMainMenuShowing ||
            OneView.core.appStateHandler.isPopupEditRecurringMenuShowing ||
            OneView.core.zopHandler.startScroll(c);
        } else
          OneView.core.appStateHandler.isMainMenuShowing ||
            OneView.core.appStateHandler.isPopupMainMenuShowing ||
            OneView.core.appStateHandler.isPopupEditRecurringMenuShowing ||
            ((this.mouseRightDown = true),
            (this.mouseZoomY = c - 500),
            OneView.core.zopHandler.startZoom(this.mouseZoomY, c));
        OneView.core.redraw(false);
        return false;
      }
    }
    touchMove(b) {
      b.preventDefault();
      this.touches = b.touches;
      b =
        this.getTouchY(this.touches[0]) *
        OneView.core.ratio *
        OneView.core.domRatio;
      var c =
          this.getTouchX(this.touches[0]) *
          OneView.core.ratio *
          OneView.core.domRatio,
        e;
      1 < this.touches.length &&
        ((e =
          this.getTouchY(this.touches[1]) *
          OneView.core.ratio *
          OneView.core.domRatio),
        this.getTouchX(this.touches[1]));
      OneView.core.appStateHandler.isChoosingDateTimeForEvent &&
        (0 < this.touches.length && this.testIfContinueDraggingMarker(b, 0),
        1 < this.touches.length && this.testIfContinueDraggingMarker(e, 1));
      this.currentPressStartedTime < OneView.core.getTimeStamp() - 550 &&
        (this.canBeAClick = false);
      1 === this.touches.length &&
        this.touchOneFingerStarted &&
        Math.abs(this.touchOneFingerStartX - this.getTouchX(this.touches[0])) +
          Math.abs(
            this.touchOneFingerStartY - this.getTouchY(this.touches[0])
          ) >
          this.touchSlop *
            OneView.core.ratio *
            OneView.core.domRatio *
            (this.startedInTitleArea ? 1.5 : 1) &&
        (this.canBeAClick = false);
      !this.canBeAClick && this.startedInTitleArea
        ? OneView.core.mainMenuControl.continueDragging(c, b)
        : OneView.core.appStateHandler.isAddButtonBeingDragged
        ? OneView.core.addButtonControl.continueDragging(c, b)
        : OneView.core.appStateHandler.isDraggingTopMarker ||
          OneView.core.appStateHandler.isDraggingBottomMarker ||
          OneView.core.appStateHandler.isMainMenuShowing ||
          OneView.core.appStateHandler.isPopupMainMenuShowing ||
          OneView.core.appStateHandler.isPopupEditRecurringMenuShowing ||
          (1 === this.touches.length &&
            this.touchOneFingerStarted &&
            (this.canBeAClick ||
              (OneView.core.appStateHandler.isMainMenuShowing &&
                OneView.core.mainMenuControl.hide()),
            OneView.core.zopHandler.continueScroll(b),
            OneView.core.drawAreaEffects.prepareAutoScroll(b)),
          2 <= this.touches.length &&
            this.touchTwoFingerStarted &&
            OneView.core.zopHandler.continueZoom(b, e));
      OneView.core.redraw(false);
      return false;
    }
    mouseMove(b) {
      b.preventDefault();
      if (true === OneView.core.touchEnabledDevice) this.removeAllMouseEvents();
      else {
        var c = b.pageY * OneView.core.ratio * OneView.core.domRatio,
          e = b.pageX * OneView.core.ratio * OneView.core.domRatio,
          d =
            (b.pageY - OneView.core.domHandler.screenTopForDOM) *
            OneView.core.ratio *
            OneView.core.domRatio;
        b =
          (b.pageX - OneView.core.domHandler.screenLeftForDOM) *
          OneView.core.ratio *
          OneView.core.domRatio;
        if (this.mouseLeftDown) {
          this.longPressStartX != e &&
            this.longPressStartY !== c &&
            (this.canBeAClick = false);
          if (OneView.core.appStateHandler.isPopupEditRecurringMenuShowing)
            return;
          this.mouseWasDragged += 1;
          OneView.core.appStateHandler.isChoosingDateTimeForEvent &&
            this.testIfContinueDraggingMarker(c, 0);
          !this.canBeAClick && this.startedInTitleArea
            ? OneView.core.mainMenuControl.continueDragging(b, d)
            : OneView.core.appStateHandler.isAddButtonBeingDragged
            ? OneView.core.addButtonControl.continueDragging(b, d)
            : OneView.core.appStateHandler.isDraggingTopMarker ||
              OneView.core.appStateHandler.isDraggingBottomMarker ||
              OneView.core.appStateHandler.isMainMenuShowing ||
              OneView.core.appStateHandler.isPopupMainMenuShowing ||
              OneView.core.appStateHandler.isAddButtonBeingDragged ||
              (OneView.core.zopHandler.continueScroll(c),
              OneView.core.drawAreaEffects.prepareAutoScroll(c));
          OneView.core.redraw(false);
        }
        !this.mouseRightDown ||
          OneView.core.appStateHandler.isMainMenuShowing ||
          OneView.core.appStateHandler.isPopupMainMenuShowing ||
          OneView.core.appStateHandler.isPopupEditRecurringMenuShowing ||
          (OneView.core.zopHandler.continueZoom(this.mouseZoomY, c),
          OneView.core.redraw(false));
        return false;
      }
    }
    touchEnd(b) {
      b.preventDefault();
      if (!this.touchOneFingerStarted && !this.touchTwoFingerStarted)
        return false;
      var c = b.touches;
      b = b.changedTouches;
      OneView.core.appStateHandler.isChoosingDateTimeForEvent &&
        this.testIfEndDraggingMarker();
      this.currentPressStartedTime < OneView.core.getTimeStamp() - 550 &&
        (this.canBeAClick = false);
      OneView.core.appStateHandler.isMainMenuBeingDragged
        ? OneView.core.mainMenuControl.endDragging()
        : OneView.core.appStateHandler.isAddButtonBeingDragged
        ? OneView.core.addButtonControl.endDragging()
        : !this.touchOneFingerStarted ||
          1 !== b.length ||
          (void 0 !== c && 0 !== c.length) ||
          (false === this.canBeAClick
            ? OneView.core.drawAreaEffects.startAutoScroll(
                this.getTouchY(b[0]) *
                  OneView.core.ratio *
                  OneView.core.domRatio
              )
            : this.click(
                b[0].pageX * OneView.core.ratio * OneView.core.domRatio,
                b[0].pageY * OneView.core.ratio * OneView.core.domRatio
              ));
      OneView.core.zopHandler.endScroll();
      OneView.core.zopHandler.endZoom();
      this.touchTwoFingerStarted =
        this.touchOneFingerStarted =
        this.canBeAClick =
          false;
      this.timeWhenLastTouchEnded = OneView.core.getTimeStamp();
      OneView.core.redraw(false);
      return false;
    }
    mouseUp(b) {
      b.preventDefault();
      if (true === OneView.core.touchEnabledDevice) this.removeAllMouseEvents();
      else
        return (
          OneView.core.appStateHandler.isMainMenuBeingDragged
            ? ((this.mouseLeftDown = false),
              OneView.core.mainMenuControl.endDragging())
            : OneView.core.appStateHandler.isAddButtonBeingDragged
            ? ((this.mouseLeftDown = false),
              OneView.core.addButtonControl.endDragging())
            : this.mouseLeftDown &&
              ((this.mouseLeftDown = false),
              OneView.core.appStateHandler.isDraggingTopMarker ||
                OneView.core.appStateHandler.isDraggingBottomMarker ||
                (OneView.core.zopHandler.endScroll(),
                3 < this.mouseWasDragged ||
                this.currentPressStartedTime < OneView.core.getTimeStamp() - 650
                  ? ((this.mouseWasDragged = 0),
                    OneView.core.drawAreaEffects.prepareAutoScroll(
                      b.pageY * OneView.core.ratio * OneView.core.domRatio,
                      200
                    ),
                    OneView.core.drawAreaEffects.startAutoScroll(
                      b.pageY * OneView.core.ratio * OneView.core.domRatio
                    ))
                  : this.click(
                      b.pageX * OneView.core.ratio * OneView.core.domRatio,
                      b.pageY * OneView.core.ratio * OneView.core.domRatio
                    )),
              OneView.core.appStateHandler.isChoosingDateTimeForEvent &&
                this.testIfEndDraggingMarker()),
          !this.mouseRightDown ||
            OneView.core.appStateHandler.isMainMenuShowing ||
            OneView.core.appStateHandler.isPopupMainMenuShowing ||
            OneView.core.appStateHandler.isPopupEditRecurringMenuShowing ||
            ((this.mouseRightDown = false), OneView.core.zopHandler.endZoom()),
          (this.canBeAClick = false),
          OneView.core.redraw(false),
          false
        );
    }
    mouseScroll(b) {
      b.preventDefault();
      var c = b.wheelDelta ? b.wheelDelta : -b.detail;
      if (
        0 !== c &&
        !(
          550 > OneView.core.getTimeStamp() - this.timeForLastScrollEvent &&
          12 > Math.abs(c)
        )
      ) {
        this.timeForLastScrollEvent = OneView.core.getTimeStamp();
        0 < c && (c = 0.5);
        0 > c && (c = -1);
        var e = OneView.core.zopHandler.topZOP,
          d = OneView.core.zopHandler.bottomZOP;
        OneView.core.drawAreaEffects.azRunning &&
          ((e = (OneView.core.drawAreaEffects.azGoalTopZOP + e) / 2),
          (d = (OneView.core.drawAreaEffects.azGoalBottomZOP + d) / 2));
        b =
          OneView.core.zopHandler.getZOPFromPixel(
            (b.pageY -
              (OneView.core.domHandler.screenTopForDOM * OneView.core.ratio +
                OneView.core.zopDrawArea.zopAreaTop)) *
              OneView.core.ratio *
              OneView.core.domRatio
          ) -
          (d + e) / 2;
        b = 0 < c ? 0.5 * b : -0.5 * b;
        c *= 0.25 * (d - e);
        e = e + b + c;
        d = d + b - c;
        OneView.core.drawAreaEffects.stopAllEffects();
        OneView.core.drawAreaEffects.startAutoZoom(e, d, false, function () {});
        return false;
      }
    }
    mouseLeave(b) {
      if (true === OneView.core.touchEnabledDevice) this.removeAllMouseEvents();
      else {
        OneView.core.appStateHandler.isAddButtonBeingDragged = false;
        if (
          b.pageX * OneView.core.ratio * OneView.core.domRatio >
            OneView.core.domHandler.screenWidth ||
          b.pageY * OneView.core.ratio * OneView.core.domRatio >
            OneView.core.domHandler.screenHeight
        )
          this.mouseLeftDown &&
            ((this.mouseLeftDown = false),
            OneView.core.zopHandler.endScroll(),
            OneView.core.drawAreaEffects.stopAllEffects()),
            this.mouseRightDown &&
              ((this.mouseRightDown = false),
              OneView.core.zopHandler.endZoom()),
            OneView.core.appStateHandler.isMainMenuBeingDragged
              ? ((this.mouseLeftDown = false),
                OneView.core.mainMenuControl.endDragging())
              : OneView.core.appStateHandler.isAddButtonBeingDragged &&
                ((this.mouseLeftDown = false),
                OneView.core.addButtonControl.endDragging());
        OneView.core.redraw(false);
      }
    }
    touchLeave(b) {
      OneView.core.appStateHandler.isAddButtonBeingDragged = false;
      OneView.core.zopHandler.endScroll();
      OneView.core.drawAreaEffects.stopAllEffects();
      OneView.core.zopHandler.endZoom();
      OneView.core.redraw(false);
    }
  }

  export class ZopHandler {
    constructor() {
      this.currentDelta = 0;
      this.currentZoom = 1;
      this.absoluteMinZoom = 0.05;
      this.absoluteMaxZoom = 9e3;
      this.zopSizeOf5Minutes =
        this.zopSizeOfHour =
        this.zopSizeOfDay =
        this.zopSizeOfWeek =
        this.zopSizeOfMonth =
        this.zopSizeOfYear =
        this.originalZOP2 =
        this.originalZOP =
        this.currentYPixel2 =
        this.currentYPixel =
        this.originalYPixel2 =
        this.originalYPixel =
        this.originalZoom =
        this.originalDelta =
        this.absoluteMaxZOP =
        this.absoluteMinZOP =
          0;
      this.maxScrollSpeed = 3;
      this.rightPixel =
        this.leftPixel =
        this.bottomPixel =
        this.topPixel =
        this.extendedBottomZOP =
        this.extendedTopZOP =
        this.bottomZOP =
        this.topZOP =
          0;
      this.scrolling = false;
    }
    setAbsoluteMinMax(a, c) {
      this.absoluteMinZOP = a;
      this.absoluteMaxZOP = c;
      this.zopSizeOfYear =
        this.dateToZOP(new Date(2005, 0, 1, 0, 0, 0)) -
        this.dateToZOP(new Date(2004, 0, 1, 0, 0, 0));
      this.zopSizeOfMonth =
        this.dateToZOP(new Date(2005, 2, 1, 0, 0, 0)) -
        this.dateToZOP(new Date(2005, 1, 1, 0, 0, 0));
      this.zopSizeOfWeek =
        this.dateToZOP(new Date(2005, 2, 8, 0, 0, 0)) -
        this.dateToZOP(new Date(2005, 2, 1, 0, 0, 0));
      this.zopSizeOfDay =
        this.dateToZOP(new Date(2005, 1, 2, 0, 0, 0)) -
        this.dateToZOP(new Date(2005, 1, 1, 0, 0, 0));
      this.zopSizeOfHour =
        this.dateToZOP(new Date(2005, 1, 1, 2, 0, 0)) -
        this.dateToZOP(new Date(2005, 1, 1, 1, 0, 0));
      this.zopSizeOf5Minutes =
        this.dateToZOP(new Date(2005, 1, 1, 2, 10, 0)) -
        this.dateToZOP(new Date(2005, 1, 1, 2, 5, 0));
    }
    initSize(a, c, e, d) {
      this.topPixel = a;
      this.bottomPixel = c;
      this.leftPixel = e;
      this.rightPixel = d;
    }
    getZoom() {
      return this.currentZoom;
    }
    setZoom(a, c, e, d) {
      this.currentZoom = (c - a) / (d - e);
      0 === this.currentZoom && (this.currentZoom = 1e3);
      this.validateZoomValues();
      this.currentDelta = a - (e - this.topPixel) * this.currentZoom;
      this.setZOPBounds(
        this.getZOPFromPixel2(
          this.topPixel,
          this.currentZoom,
          this.currentDelta
        ),
        (this.bottomZOP = this.getZOPFromPixel2(
          this.bottomPixel,
          this.currentZoom,
          this.currentDelta
        ))
      );
    }
    setZOPBounds(a, c) {
      this.topZOP = a;
      this.bottomZOP = c;
      var b = this.bottomZOP - this.topZOP;
      this.extendedTopZOP = this.topZOP - b;
      this.extendedBottomZOP = this.bottomZOP + b;
    }
    isObjectAboveScreen(a) {
      return a < this.topZOP ? true : false;
    }
    isObjectBelowScreen(a) {
      return a > this.bottomZOP ? true : false;
    }
    isObjectAboveExtendedScreen(a) {
      return a < this.extendedTopZOP ? true : false;
    }
    isObjectBelowExtendedScreen(a) {
      return a > this.extendedBottomZOP ? true : false;
    }
    startScroll(a) {
      this.originalDelta = this.currentDelta;
      this.currentYPixel = this.originalYPixel = a;
      this.scrolling = true;
    }
    continueScroll(b) {
      if (this.scrolling) {
        OneView.core.getTimeStamp();
        this.originalYPixel != b && OneView.core.getTimeStamp();
        var c = this.getZOPFromPixel2(
          this.originalYPixel,
          this.currentZoom,
          this.originalDelta
        );
        b = this.getZOPFromPixel2(b, this.currentZoom, this.originalDelta);
        this.currentDelta = this.originalDelta - (b - c);
        this.setZOPBounds(
          this.getZOPFromPixel2(
            this.topPixel,
            this.currentZoom,
            this.currentDelta
          ),
          (this.bottomZOP = this.getZOPFromPixel2(
            this.bottomPixel,
            this.currentZoom,
            this.currentDelta
          ))
        );
        this.validateZoomValues();
      }
    }
    endScroll() {
      this.scrolling = false;
    }
    startZoom(a, c) {
      this.originalDelta = this.currentDelta;
      this.originalZoom = this.currentZoom;
      this.originalYPixel = a;
      this.originalYPixel2 = c;
      if (this.originalYPixel > this.originalYPixel2) {
        var b = this.originalYPixel;
        this.originalYPixel = this.originalYPixel2;
        this.originalYPixel2 = b;
      }
      50 > this.originalYPixel2 - this.originalYPixel &&
        (this.originalYPixel2 = this.originalYPixel + 50);
      this.originalZOP = this.getZOPFromPixel2(
        this.originalYPixel,
        this.originalZoom,
        this.originalDelta
      );
      this.originalZOP2 = this.getZOPFromPixel2(
        this.originalYPixel2,
        this.originalZoom,
        this.originalDelta
      );
    }
    continueZoom(a, c) {
      this.currentYPixel = a;
      this.currentYPixel2 = c;
      if (this.currentYPixel > this.currentYPixel2) {
        var b = this.currentYPixel;
        this.currentYPixel = this.currentYPixel2;
        this.currentYPixel2 = b;
      }
      50 < this.currentYPixel2 - this.currentYPixel &&
        (this.setZoom(
          this.originalZOP,
          this.originalZOP2,
          this.currentYPixel,
          this.currentYPixel2
        ),
        this.validateZoomValues());
    }
    endZoom() {}
    showInitialBounds(b: boolean) {
      var c =
        OneView.core.calendarDataProxy &&
        OneView.core.calendarDataProxy.demoVideoSpecial &&
        500 < this.currentZoom;
      var e = this.dateToZOP(new Date());
      var d = OneView.core.calendarDateHandler.getCalendarDateObject(
        e,
        OneView.CalendarDateObjectType.Day,
        OneView.core.calendarDateHandler.rootCalendarDateObjects[0]
      );
      if (5 > d.calendarEvents.length) {
        d = OneView.core.calendarDateHandler.getCalendarDateObject(
          e,
          OneView.CalendarDateObjectType.Month,
          OneView.core.calendarDateHandler.rootCalendarDateObjects[0]
        );
      }
      4 > d.calendarEvents.length &&
        (d = OneView.core.calendarDateHandler.getCalendarDateObject(
          e,
          OneView.CalendarDateObjectType.Year,
          OneView.core.calendarDateHandler.rootCalendarDateObjects[0]
        ));
      if (0 === d.calendarEvents.length)
        (e = this.dateToZOP(moment().add(-2, "days").toDate())),
          (d = this.dateToZOP(moment().add(8, "days").toDate()));
      else
        var g = (10 * (d.endZOP - d.startZOP)) / d.calendarEvents.length,
          d = e + 0.8 * g,
          e = Math.max(
            e - 0.2 * g,
            this.dateToZOP(moment().add(-7, "days").toDate())
          ),
          d = Math.min(d, this.dateToZOP(moment().add(30, "days").toDate()));
      b
        ? OneView.core.drawAreaEffects.startAutoZoom(e, d, c, function () {})
        : this.setZOPBounds(e, d);
      OneView.core.calendarDataProxy &&
        OneView.core.calendarDataProxy.analyticsValue(
          "Value",
          "Start",
          "Initial Zoom",
          d - e
        );
    }
    validateZoomValues() {
      this.currentZoom < this.absoluteMinZoom &&
        ((this.currentZoom = this.absoluteMinZoom),
        OneView.core.drawAreaEffects.stopAllEffects());
      this.currentZoom > this.absoluteMaxZoom &&
        ((this.currentZoom = this.absoluteMaxZoom),
        OneView.core.drawAreaEffects.stopAllEffects());
      var b = this.currentDelta,
        c = this.getZOPFromPixel2(
          this.bottomPixel,
          this.currentZoom,
          this.currentDelta
        ),
        e = c - b;
      this.currentDelta < this.absoluteMinZOP &&
        ((b = this.currentDelta = this.absoluteMinZOP),
        (c = b + e),
        (this.originalYPixel = this.currentYPixel),
        this.setZoom(b, c, this.topPixel, this.bottomPixel));
      c > this.absoluteMaxZOP &&
        ((c = this.absoluteMaxZOP),
        (b = this.currentDelta = Math.max(this.absoluteMinZOP, c - e)),
        (this.originalYPixel = this.currentYPixel),
        (this.originalYPixel2 = this.currentYPixel2),
        this.setZoom(b, c, this.topPixel, this.bottomPixel));
    }
    getPixelFromZOP(a) {
      return 0 === this.currentZoom
        ? 0
        : Math.floor(
            (a - this.currentDelta) / this.currentZoom + this.topPixel
          );
    }
    get2PixelsFromZOPsForVErticalText(b, c) {
      if (0 === this.currentZoom) return new OneView.NumberPair(0, 0);
      var e = (c - this.currentDelta) / this.currentZoom + this.topPixel,
        d = Math.floor(
          e - ((b - this.currentDelta) / this.currentZoom + this.topPixel)
        ),
        e = Math.floor(e);
      return new OneView.NumberPair(e - d, e);
    }
    getZOPFromPixel2(a, c, e) {
      return (a - this.topPixel) * c + e;
    }
    getZOPFromPixel(a) {
      return this.getZOPFromPixel2(a, this.currentZoom, this.currentDelta);
    }
    getZOPFromPixelDiff(a) {
      return (
        this.getZOPFromPixel2(a, this.currentZoom, this.currentDelta) -
        this.getZOPFromPixel2(0, this.currentZoom, this.currentDelta)
      );
    }
    getFractionalPixelDistance(a) {
      return 0 === this.currentZoom ? 0 : a / this.currentZoom;
    }
    updateStartEndZOP(a) {
      a.startZOP = this.dateToZOP(a.startDateTime);
      a.endZOP = this.dateToZOP(a.endDateTime) - 1;
    }
    dateToZOP(b) {
      return (Number(b) - OneView.core.settings.globalMinDate) / 6e4;
    }
    getDateFromZOP(b) {
      return new Date(6e4 * b + OneView.core.settings.globalMinDate);
    }
    getPixelFromDate(a) {
      return this.getPixelFromZOP(this.dateToZOP(a));
    }
    getDateFromPixel(a) {
      return this.getDateFromZOP(this.getZOPFromPixel(a));
    }
    getZOPSizeOf(b) {
      switch (b) {
        case OneView.CalendarDateObjectType.Minutes5:
          return this.zopSizeOf5Minutes;
        case OneView.CalendarDateObjectType.Hour:
          return this.zopSizeOfHour;
        case OneView.CalendarDateObjectType.Day:
          return this.zopSizeOfDay;
        case OneView.CalendarDateObjectType.Week:
          return this.zopSizeOfWeek;
        case OneView.CalendarDateObjectType.Month:
          return this.zopSizeOfMonth;
        case OneView.CalendarDateObjectType.Year:
          return this.zopSizeOfYear;
        default:
          throw Error("Unhandled CalendarDateObjectType");
      }
    }
    getPixelSizeOf(b) {
      switch (b) {
        case OneView.CalendarDateObjectType.Minutes5:
          return this.getPixelSizeOf5Minutes();
        case OneView.CalendarDateObjectType.Hour:
          return this.getPixelSizeOfHour();
        case OneView.CalendarDateObjectType.Day:
          return this.getPixelSizeOfDay();
        case OneView.CalendarDateObjectType.Week:
          return this.getPixelSizeOfWeek();
        case OneView.CalendarDateObjectType.Month:
          return this.getPixelSizeOfMonth();
        case OneView.CalendarDateObjectType.Year:
          return this.getPixelSizeOfYear();
        default:
          throw Error("Unhandled CalendarDateObjectType");
      }
    }
    getPixelSizeOfYear() {
      return this.zopSizeOfYear / this.currentZoom;
    }
    getPixelSizeOfMonth() {
      return this.zopSizeOfMonth / this.currentZoom;
    }
    getPixelSizeOfWeek() {
      return this.zopSizeOfWeek / this.currentZoom;
    }
    getPixelSizeOfDay() {
      return this.zopSizeOfDay / this.currentZoom;
    }
    getPixelSizeOfHour() {
      return this.zopSizeOfHour / this.currentZoom;
    }
    getPixelSizeOf5Minutes() {
      return this.zopSizeOf5Minutes / this.currentZoom;
    }
  }

  export class SpeedCache {
    constructor() {
      this.cacheKeys = [];
      this.cacheObjects = [];
      this.nextCacheKeys = [];
      this.nextCacheObjects = [];
      this.lastIndex = -1;
    }
    startNewRound() {
      this.lastIndex = -1;
      this.cacheKeys = this.nextCacheKeys;
      this.cacheObjects = this.nextCacheObjects;
      this.nextCacheKeys = [];
      this.nextCacheObjects = [];
    }
    emptyCache() {
      this.lastIndex = -1;
      this.cacheKeys = [];
      this.cacheObjects = [];
      this.nextCacheKeys = [];
      this.nextCacheObjects = [];
    }
    findObject(a) {
      var b = this.lastIndex + 1;
      if (1e4 < this.cacheKeys.length) throw Error("Cache too big!");
      for (; this.cacheKeys[b] !== a && b < this.cacheKeys.length; ) b++;
      if (b < this.cacheKeys.length)
        return (
          this.nextCacheKeys.push(this.cacheKeys[b]),
          this.nextCacheObjects.push(this.cacheObjects[b]),
          (this.lastIndex = b),
          this.cacheObjects[b]
        );
      if (0 < this.lastIndex) return (this.lastIndex = 0), this.findObject(a);
    }
    addObject(a, c) {
      this.nextCacheKeys.push(a);
      this.nextCacheObjects.push(c);
    }
  }

  export class Hashtable {
    constructor() {
      this.keys = [];
      this.values = [];
    }
    put(a, b) {
      this.keys.push(a);
      this.values.push(b);
    }
    find(a) {
      var b;
      for (b = 0; b < this.keys.length; b++)
        if (this.keys[b] == a) return this.values[b];
    }
  }

  export class CalendarEventObject {
    constructor(
      summary,
      description,
      location,
      startDateTime,
      endDateTime,
      calendarId,
      eventId
    ) {
      this.summary = summary || "";
      this.description = description || "";
      this.location = location;
      this.startDateTime = startDateTime;
      this.endDateTime = endDateTime;

      if (endDateTime.getHours() === 0 && endDateTime.getMinutes() === 0) {
        this.endDateTime = OneView.core.calendarDateHandler.addMinutes(
          endDateTime,
          -1
        );
      }

      OneView.core.zopHandler.updateStartEndZOP(this);
      this.isGraded = false;
      this.grade = 0;
      this.calendarId = calendarId;
      this.eventId = eventId;
    }
  }

  export class CalendarObject {
    constructor(a, c, e, d, g, m, n) {
      this.id = a;
      this.name = c;
      this.colorId = d;
      this.visibility = g;
      this.canEditCalendar = m;
      this.canEditCalendarEvents = n;
      this.defaultReminders = e;
      this.allEventsAreFullDay = true;
      this.countEvents = 0;
    }
  }

  export class Reminder {
    constructor(a) {
      this.minutes = +a;
    }
  }

  export class CalendarDateObject {
    constructor(b, c, e) {
      this.details = [];
      this.possibleFullEvents = [];
      this.calendarEvents = [];
      this.calendarDateObjectType = b;
      this.detailsArePopulated = true;
      this.isReadyForParentToBeShown = false;
      this.startDateTime = c;
      this.endDateTime = new Date(this.startDateTime.getTime());
      this.startZOP = OneView.core.zopHandler.dateToZOP(this.startDateTime);
      this.isRed = false;
      b === OneView.CalendarDateObjectType.Minutes5 &&
        (this.endDateTime.setMinutes(this.startDateTime.getMinutes() + 5),
        OneView.core.commonUserSettings.use24hFormat
          ? (this.shortText = moment(this.startDateTime).format("HH"))
          : ((this.shortText = moment(this.startDateTime).format("h")),
            (this.ampm = moment(this.startDateTime).format("A"))),
        (this.shortText2 =
          10 > this.startDateTime.getMinutes()
            ? "0" + this.startDateTime.getMinutes()
            : "" + this.startDateTime.getMinutes()),
        this.startDateTime.getHours(),
        this.startDateTime.getHours(),
        (this.longText = this.shortText),
        (this.detailsArePopulated = true));
      b === OneView.CalendarDateObjectType.Hour &&
        (this.endDateTime.setHours(this.startDateTime.getHours() + 1),
        OneView.core.commonUserSettings.use24hFormat
          ? ((this.shortText = moment(this.startDateTime).format("HH")),
            (this.shortText2 =
              10 > this.startDateTime.getMinutes()
                ? "0" + this.startDateTime.getMinutes()
                : "" + this.startDateTime.getMinutes()),
            (this.longText = this.shortText + ":" + this.shortText2))
          : ((this.shortText = moment(this.startDateTime).format("h")),
            (this.shortText2 =
              10 > this.startDateTime.getMinutes()
                ? "0" + this.startDateTime.getMinutes()
                : "" + this.startDateTime.getMinutes()),
            "00" == this.shortText2 && (this.shortText2 = void 0),
            (this.ampm = moment(this.startDateTime).format("A")),
            (this.longText =
              this.shortText +
              (this.shortText2 ? ":" + this.shortText2 : "") +
              " " +
              this.ampm)),
        (this.detailsArePopulated = false));
      b === OneView.CalendarDateObjectType.Day &&
        (this.endDateTime.setDate(this.startDateTime.getDate() + 1),
        (this.shortText = this.startDateTime.getDate().toString()),
        (this.shortText2 = OneView.core.helper.weekdayShort.find(
          this.startDateTime.getDay()
        )),
        void 0 == this.shortText2 &&
          ((this.shortText2 = moment(this.startDateTime).format("ddd")),
          OneView.core.helper.weekdayShort.put(
            this.startDateTime.getDay(),
            this.shortText2
          ),
          OneView.core.helper.weekdayShort.put(
            this.startDateTime.getDay() + 7,
            this.shortText2
          )),
        (this.longText = OneView.core.helper.weekdayLong.find(
          this.startDateTime.getDay()
        )),
        void 0 == this.longText &&
          ((this.longText = moment(this.startDateTime).format("dddd")),
          OneView.core.helper.weekdayLong.put(
            this.startDateTime.getDay(),
            this.longText
          ),
          OneView.core.helper.weekdayLong.put(
            this.startDateTime.getDay() + 7,
            this.longText
          )),
        (this.longText = this.startDateTime.getDate() + " " + this.longText),
        (this.detailsArePopulated = false),
        this.startDateTime.getDay() === OneView.core.settings.redDay &&
          (this.isRed = true));
      b === OneView.CalendarDateObjectType.Week &&
        (this.endDateTime.setDate(this.endDateTime.getDate() + 7),
        (this.detailsArePopulated = true),
        (this.details = [{}, {}, {}, {}, {}, {}, {}]));
      b === OneView.CalendarDateObjectType.Month &&
        (this.endDateTime.setMonth(this.startDateTime.getMonth() + 1),
        (this.shortText = OneView.core.helper.monthesShort.find(
          this.startDateTime.getMonth()
        )),
        void 0 == this.shortText &&
          ((this.shortText = moment(this.startDateTime).format("MMM")),
          OneView.core.helper.monthesShort.put(
            this.startDateTime.getMonth(),
            this.shortText
          )),
        (this.longText = OneView.core.helper.monthesLong.find(
          this.startDateTime.getTime()
        )),
        void 0 == this.longText &&
          ((this.longText = moment(this.startDateTime).format("MMMM YYYY")),
          OneView.core.helper.monthesLong.put(
            this.startDateTime.getTime(),
            this.longText
          )),
        (this.parentText = ""),
        (this.detailsArePopulated = false));
      b === OneView.CalendarDateObjectType.Year &&
        (this.endDateTime.setFullYear(this.startDateTime.getFullYear() + 1),
        (this.shortText = "" + this.startDateTime.getFullYear()),
        (this.longText = "" + this.startDateTime.getFullYear()),
        (this.detailsArePopulated = false));
      b === OneView.CalendarDateObjectType.Title &&
        ((this.endDateTime = e),
        (this.longText = "OneView Calendar"),
        (this.detailsArePopulated = false));
      this.endZOP = OneView.core.zopHandler.dateToZOP(this.endDateTime);
    }
  }

  export class PossibleEventTagsAtThisZoomLevel {
    constructor(a, c, e, d) {
      this.calendarEvent = a;
      this.calendarDate = c;
      this.calendarDateDetail = e;
      this.position = d;
    }
  }

  export class CalendarEventTagGroup {
    constructor(a, c) {
      this.extraSpace = 0;
      this.calendarEventTagWrappers = [];
      this.parentBottomZOP = this.parentTopZOP = 0;
      this.calendarDateObject = a;
      this.availableSpace = c;
    }
  }

  export class CalendarEventTagWrapper {
    constructor(a) {
      this.wantedPixelShift = this.right = this.left = this.position = 0;
      this.isPartial = false;
      this.parentCollidingFullEventWrappers = [];
      this.visible = true;
      this.calendarEvent = a;
    }
  }

  export class CalendarFullEventWrapper {
    constructor(a) {
      this.widthPercentWhenTagsExist = this.widthPercent = 0;
      this.preferredWidth = this.right = this.left = void 0;
      this.collisionsHaveBeenChecked = false;
      this.parentCollidingFullEventWrappers = [];
      this.childCollidingFullEventWrappers = [];
      this.childCollidingEventTagWrappers = [];
      this.calendarEvent = a;
    }
  }

  export class Badge {
    constructor() {
      this.closeToBellow = this.closeToAbove = false;
    }
  }

  export class OccupiedSpaceObject {
    constructor() {
      this.left = this.maxZOP = this.minZOP = 0;
    }
  }

  export class TagSurface {
    constructor() {
      this.parentCollidingFullEventWrapper = void 0;
      this.maxZOP = this.minZOP = 0;
    }
  }

  export class TagDataToPaint {
    constructor() {}
  }

  export class NumberPair {
    constructor(a, c) {
      this.value1 = a;
      this.value2 = c;
    }
  }

  export class NumberStringPair {
    constructor(a, c) {
      this.valueNumber = a;
      this.valueString = c;
    }
  }

  export class Settings {
    constructor(a) {
      this.absoluteMinDate = moment("1900-01-01 00:00:00").toDate();
      this.absoluteMaxDate = moment("2100-01-01 00:00:00").toDate();
      this.globalMinDate = Number(moment("1900-01-01 00:00:00").toDate());
      this.margin =
        this.redDay =
        this.menuIconHeight =
        this.menuItemHeight =
        this.menuTextHeight =
        this.title2FontSize =
        this.title1FontSize =
        this.title0FontSize =
        this.weekCircleDiameter =
        this.innerTopMaxMargin =
        this.innerLeftMargin =
        this.titleWidth =
        this.dateBigTextSize =
        this.badgeTextHeight =
        this.tagTextHeight =
        this.tagColorWidth =
        this.minDateHeight =
        this.tagHeight =
          0;
      this.rightToLeft = true;
      this.eventsFarLeft = 0;
      this.useMiniBadges = false;
      this.zoom = this.menuButtonBottom = this.badgesLeft = 0;
      this.allowWeekNumber = true;
      this.lineThickness = 2;
      this.reloadThemesSettings(a);
    }
    reloadThemesSettings(e) {
      this.themes = new OneView.Dictionary();
      this.themes.add("0", new FreeTheme());
      e.licenceDarkTheme && this.themes.add("3", new DarkTheme());
      e.licenceCandyTheme && this.themes.add("4", new CandyTheme());
      this.themes.containsKey(e.theme) || (e.theme = "0");
      this.theme = this.themes[e.theme];
    }
    reloadTheme() {
      this.themes.containsKey(OneView.core.commonUserSettings.theme) ||
        (OneView.core.commonUserSettings.theme = "0");
      this.theme = this.themes[OneView.core.commonUserSettings.theme];
    }
  }
  export class OriginalColorTheme {
    constructor() {
      this.themeName = "OneView Calendar Original";
      this.colorBlack = "#000000";
      this.colorTitleBackground = this.colorDark = "#524864";
      this.colorTitleText = "#EFEAE1";
      this.colorGrayText = "#454545";
      this.colorHorizontalTitle = this.colorDarkText = "#000000";
      this.colorBigDateDividerStr = "rgba( 173, 176, 181, ";
      this.colorRedDayText = "#C91E1E";
      this.colorDarkSoft = "#999999";
      this.colorLightSoft = "#BBBBBB";
      this.colorTag2 = this.colorTag = "#E50081";
      this.colorWhite =
        this.colorLight =
        this.colorBackground =
        this.colorTagText =
          "#EFEAE1";
      this.colorRed = "#524864";
      this.colorMarker = "#4C88DB";
      this.colorBlue = "#2890D1";
      this.colorAddButton = "#3E5C87";
      this.colorDim = "rgba(0; 0; 0; 0.5)";
      this.colorLightDim = "rgba(125; 125; 125; 0.9)";
      this.colorToday = [225, 210, 220];
      this.color1 = "#333333";
      this.colorFadeOut = "rgba(125, 125, 125, 0.5)";
      this.colorWeekNumberText = this.colorWeekNumberShadow = "#EFEAE1";
      this.colorWeekNumberCircle = "#524864";
      this.eventColors =
        "#556783 #87547B #5A837C #785A7F #AF9165 #8B5956 #51717D #4D2242 #5E9172 #381C46 #A07466 #B9AD73 #29344D #936F8B #305242 #796E83 #594E45 #7A6B5B #538B8B #813F59 #7C978C #7A3C84 #64302F #785642 #3A3A3A #828282 #484848 #909090 #696969 #565656".split(
          " "
        );
      this.eventTextColors =
        "#EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1 #EFEAE1".split(
          " "
        );
      this.eventColorsForFirstCalendar = [
        "#916181",
        "#916181",
        "#916181",
        "#916181",
        "#916181",
      ];
      this.eventsFarLeft = 0;
      this.tagTextIsBold = false;
      this.titleWidthFactor = 50;
      this.triangleColorStr = "rgba( 39, 49, 66, ";
      this.triangleTextNudgeX = 2;
      this.triangleTextNudgeY = 1;
      this.titleBarFont = "Quicksand";
      this.titleBarFontSize = 28;
      this.titleBarFontBold = "Quicksand";
      this.textFontThin = this.textFontBold = this.textFont = "Arial";
      this.badgeColorIsTagTextColor = false;
      this.addButtonWidthFactor = 0.9;
    }
  }

  export class MaterialColorTheme {
    constructor() {
      this.themeName = "Vivid Material";
      this.colorBlack = "#000000";
      this.colorDark = "#01518E";
      this.colorBigDateDividerStr = "rgba( 173, 176, 181, ";
      this.colorTitleBackground = "#01518E";
      this.colorTitleText = "#FFFFFF";
      this.colorGrayText = "#454545";
      this.colorHorizontalTitle = this.colorDarkText = "#000000";
      this.colorRedDayText = "#C91E1E";
      this.colorDarkSoft = "#999999";
      this.colorLightSoft = "#BBBBBB";
      this.colorTag2 = this.colorTag = "#E50081";
      this.colorWhite =
        this.colorLight =
        this.colorBackground =
        this.colorTagText =
          "#FFFFFF";
      this.colorRed = "#01518E";
      this.colorMarker = "#4C88DB";
      this.colorBlue = "#2890D1";
      this.colorAddButton = "#01518E";
      this.colorDim = "rgba(0; 0; 0; 0.5)";
      this.colorLightDim = "rgba(125; 125; 125; 0.9)";
      this.colorToday = [225, 210, 220];
      this.color1 = "#333333";
      this.colorFadeOut = "rgba(125, 125, 125, 0.5)";
      this.colorWeekNumberShadow = "#E9EAEC";
      this.colorWeekNumberText = "#FFFFFF";
      this.colorWeekNumberCircle = "#707070";
      this.eventColors =
        "#016DD5 #E91E63 #009688 #FF9800 #9C27B0 #70A83C #F23E2B #965F30 #FF3886 #38C0AF #FFA938 #CC43E4 #85C848 #FF543E #BE7E46 #8E1C4E #11635B #A66E1B #830BCD #537200 #FF5513 #63452B #757575 #656565 #555555 #808080 #707070 #606060".split(
          " "
        );
      this.eventTextColors =
        "#FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF".split(
          " "
        );
      this.eventColorsForFirstCalendar = [
        "#303F9F",
        "#3949AB",
        "#3F51B5",
        "#5C6BC0",
        "#7986CB",
      ];
      this.eventsFarLeft = 0;
      this.tagTextIsBold = false;
      this.titleWidthFactor = 50;
      this.triangleColorStr = "rgba( 1, 81, 142, ";
      this.triangleTextNudgeY = this.triangleTextNudgeX = 0;
      this.titleBarFont = "RobotoL";
      this.titleBarFontSize = 16;
      this.titleBarFontBold = "RobotoB";
      this.textFont = "Roboto";
      this.textFontBold = "RobotoB";
      this.textFontThin = "RobotoL";
      this.badgeColorIsTagTextColor = false;
      this.addButtonWidthFactor = 1.1;
    }
  }

  export class FreeTheme {
    constructor() {
      this.themeName = "Free theme";
      this.colorBlack = "#000000";
      this.colorDark = "#233142";
      this.colorBigDateDividerStr = "rgba( 173, 176, 181, ";
      this.colorTitleBackground = "#233142";
      this.colorTitleText = "#FFFFFF";
      this.colorGrayText = "#454545";
      this.colorDarkText = "#7B838E";
      this.colorHorizontalTitle = "#4B5056";
      this.colorRedDayText = "#C91E1E";
      this.colorDarkSoft = "#999999";
      this.colorLightSoft = "#BBBBBB";
      this.colorTag2 = this.colorTag = "#E50081";
      this.colorWhite =
        this.colorLight =
        this.colorBackground =
        this.colorTagText =
          "#FFFFFF";
      this.colorRed = "#233142";
      this.colorMarker = "#E53935";
      this.colorBlue = "#2890D1";
      this.colorAddButton = "#233142";
      this.colorDim = "rgba(0; 0; 0; 0.5)";
      this.colorLightDim = "rgba(125; 125; 125; 0.9)";
      this.colorToday = [225, 210, 220];
      this.color1 = "#333333";
      this.colorFadeOut = "rgba(125, 125, 125, 0.5)";
      this.colorWeekNumberShadow = "#E9EAEC";
      this.colorWeekNumberText = "#233142";
      this.colorWeekNumberCircle = "#FFFFFF";
      this.eventColors =
        "#3878DB #E12FB7 #22B297 #AD45C6 #FF9800 #EF4134 #2291BB #94006C #1ECD63 #620094 #FF6633 #F3C600 #173B91 #D65BBE #00793F #926DB5 #775234 #A5713A #00C1C4 #F4116D #5FBF98 #D905FF #C6110D #C24F05 #394E6B #967292 #7D9673 #454545 #757575 #A0A0A0".split(
          " "
        );
      this.eventTextColors =
        "#FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF".split(
          " "
        );
      this.eventColorsForFirstCalendar = [
        "#303F9F",
        "#3949AB",
        "#3F51B5",
        "#5C6BC0",
        "#7986CB",
      ];
      this.eventsFarLeft = 0;
      this.tagTextIsBold = false;
      this.titleWidthFactor = 50;
      this.triangleColorStr = "rgba( 1, 81, 142, ";
      this.triangleTextNudgeY = this.triangleTextNudgeX = 0;
      this.titleBarFont = "RobotoL";
      this.titleBarFontSize = 16;
      this.titleBarFontBold = "RobotoB";
      this.textFont = "Roboto";
      this.textFontBold = "RobotoB";
      this.textFontThin = "RobotoL";
      this.badgeColorIsTagTextColor = false;
      this.addButtonWidthFactor = 1.1;
    }
  }

  export class DarkTheme {
    constructor() {
      this.themeName = "Dark theme";
      this.colorBlack = "#000000";
      this.colorDark = "#333333";
      this.colorBigDateDividerStr = "rgba( 133, 136, 131, ";
      this.colorTitleBackground = "#333333";
      this.colorTitleText = "#8B8B8B";
      this.colorGrayText = "#808080";
      this.colorDarkText = "#A49C91";
      this.colorHorizontalTitle = "#7C7C7C";
      this.colorRedDayText = "#3BE7EB";
      this.colorDarkSoft = "#999999";
      this.colorLightSoft = "#BBBBBB";
      this.colorTag2 = this.colorTag = "#E50081";
      this.colorTagText = "#FFFFFF";
      this.colorBackground = "#191919";
      this.colorWhite = this.colorLight = "#FFFFFF";
      this.colorRed = "#333333";
      this.colorMarker = "#3BE7EB";
      this.colorBlue = "#2890D1";
      this.colorAddButton = "#333333";
      this.colorDim = "rgba(0; 0; 0; 0.5)";
      this.colorLightDim = "rgba(125; 125; 125; 0.9)";
      this.colorToday = [225, 210, 220];
      this.color1 = "#333333";
      this.colorFadeOut = "rgba(125, 125, 125, 0.5)";
      this.colorWeekNumberShadow = "#2D2B2A";
      this.colorWeekNumberText = "#A49C91";
      this.colorWeekNumberCircle = "#191919";
      this.eventColors =
        "#3878DB #E12FB7 #22B297 #AD45C6 #FF9800 #EF4134 #2291BB #94006C #1ECD63 #620094 #FF6633 #F3C600 #173B91 #D65BBE #00793F #926DB5 #775234 #926DB5 #00C1C4 #F4116D #5FBF98 #D905FF #C6110D #C24F05 #394E6B #967292 #7D9673 #454545 #757575 #A0A0A0".split(
          " "
        );
      this.eventTextColors =
        "#FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF #FFFFFF".split(
          " "
        );
      this.eventColorsForFirstCalendar = [
        "#303F9F",
        "#3949AB",
        "#3F51B5",
        "#5C6BC0",
        "#7986CB",
      ];
      this.eventsFarLeft = 0;
      this.tagTextIsBold = false;
      this.titleWidthFactor = 50;
      this.triangleColorStr = "rgba( 1, 81, 142, ";
      this.triangleTextNudgeY = this.triangleTextNudgeX = 0;
      this.titleBarFont = "RobotoL";
      this.titleBarFontSize = 16;
      this.titleBarFontBold = "RobotoB";
      this.textFont = "Roboto";
      this.textFontBold = "RobotoB";
      this.textFontThin = "RobotoL";
      this.badgeColorIsTagTextColor = true;
      this.addButtonWidthFactor = 1.1;
    }
  }

  export class CandyTheme {
    constructor() {
      this.themeName = "Candy theme";
      this.colorBlack = "#000000";
      this.colorDark = "#AA6990";
      this.colorBigDateDividerStr = "rgba( 173, 176, 181, ";
      this.colorTitleBackground = "#AA6990";
      this.colorTitleText = "#FFFFFF";
      this.colorGrayText = "#454545";
      this.colorDarkText = "#7B838E";
      this.colorHorizontalTitle = "#4B5056";
      this.colorRedDayText = "#E26C8E";
      this.colorDarkSoft = "#999999";
      this.colorLightSoft = "#BBBBBB";
      this.colorTag2 = this.colorTag = "#E50081";
      this.colorWhite =
        this.colorLight =
        this.colorBackground =
        this.colorTagText =
          "#FFFFFF";
      this.colorRed = "#AA6990";
      this.colorMarker = "#E26C8E";
      this.colorBlue = "#2890D1";
      this.colorAddButton = "#AA6990";
      this.colorDim = "rgba(0; 0; 0; 0.5)";
      this.colorLightDim = "rgba(125; 125; 125; 0.9)";
      this.colorToday = [225, 210, 220];
      this.color1 = "#333333";
      this.colorFadeOut = "rgba(125, 125, 125, 0.5)";
      this.colorWeekNumberShadow = "#E9EAEC";
      this.colorWeekNumberText = "#233142";
      this.colorWeekNumberCircle = "#FFFFFF";
      this.eventColors =
        "#AFC9F1 #F3ACE2 #A7E0D5 #DEB5E8 #FFD699 #F9B3AE #A7D3E4 #D499C4 #A5EBC1 #C099D4 #FFC2AD #FAE899 #A2B1D3 #EFBDE5 #99C9B2 #D3C5E1 #C9BAAE #DBC6B0 #99E6E7 #FBA0C5 #BFE5D6 #F09BFF #E8A09E #E7B99B #B0B8C4 #D5C7D3 #CBD5C7 #999999 #BABABA #D9D9D9".split(
          " "
        );
      this.eventTextColors =
        "#234A88 #8C1D71 #156E5E #6B2B7B #9E5E00 #942820 #155A74 #6F0051 #137F3D #4A006F #9E3F20 #816900 #112C6D #853876 #004B27 #4D3A60 #4A3320 #664624 #00787A #970B44 #326551 #87039E #950D0A #783103 #243244 #60495D #50604A #2C2C2C #4B4B4B #666666".split(
          " "
        );
      this.eventColorsForFirstCalendar = [
        "#303F9F",
        "#3949AB",
        "#3F51B5",
        "#5C6BC0",
        "#7986CB",
      ];
      this.eventsFarLeft = 0;
      this.tagTextIsBold = true;
      this.titleWidthFactor = 50;
      this.triangleColorStr = "rgba( 1, 81, 142, ";
      this.triangleTextNudgeY = this.triangleTextNudgeX = 0;
      this.titleBarFont = "RobotoL";
      this.titleBarFontSize = 16;
      this.titleBarFontBold = "RobotoB";
      this.textFont = "Roboto";
      this.textFontBold = "RobotoB";
      this.textFontThin = "RobotoL";
      this.badgeColorIsTagTextColor = true;
      this.addButtonWidthFactor = 1.1;
    }
  }

  export class Core {
    calendars = [];
    debugtext = "";
    touchEnabledDevice = false;
    charCodeReload = "reload";
    charCodeLogin = "cloud-download";
    charCodeLogout = "cloud-upload";
    charCodeCalendars = "layers";
    charCodeShop = "shop";
    charCodeAbout = "help";
    charCodeHeart = "heart";
    charCodeSend = "send";
    charCodeFake = "drop";
    charCodeLogo = "logo";
    charCodeSettings = "cog";
    charCodeBack = "arrow-left";
    charCodeMoveBlack = "clock";
    charCodeMove = "clock";
    charCodeEdit = "pencil";
    charCodeDelete = "trash";
    charCodeOk = "check";
    charCodeCancel = "cross";
    charCodeView = "eye";
    charCodeNew = "circle-plus";
    charCodeMenu = "menu";
    charCodeAdd = "add";
    alreadyRedrawing = false;
    pageLoaded = false;
    readyToGo = false;
    redrawCountdown = 0;
    maxTime = 0;
    totalRedraws = 0;
    totalTime = 0;
    fps = 0;
    lastDrawTime = 0;
    hardRedraw = false;
    debugCounter = 0;
    requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (a) {
          window.setTimeout(a, 1e3 / 60);
        }
      );
    })();
    firstTouchMade = false;
    loadedFiles = [];
    loadingHandler = new OneView.LoadingHandler();
    isCordovaApp = false;
    ratio = window.devicePixelRatio;
    helper = new OneView.Helper();
    commonUserSettings = new OneView.CommonUserSettings();
    zopHandler = new OneView.ZopHandler();
    settings = new OneView.Settings(this.commonUserSettings);
    drawArea = new OneView.DrawArea();
    eventHandler = new OneView.EventHandler();
    domHandler = new OneView.DomHandler();
    zopDrawArea = new OneView.ZopDrawArea();
    appStateHandler = new OneView.AppStateHandler();
    dateTimeSelectionHandler = new OneView.DateTimeSelectionHandler();

    constructor() {
      console.log("core constructor");
    }
    // dynamicallyLoadFile("css/style.css", "css", function () {});
    init() {
      this.setSizeSettings();
      this.domHandler.init();
      this.dateTimeSelectionHandler.init();
      this.commonUserSettings.updateAppWithLang();
      this.debugTexts = [];
      this.redrawCore = this.redrawCore.bind(this);
      this.loadGraphics();
      this.loadDataProxy();
    }
    loadDataProxy() {
      this.populateCalendars();
    }
    redraw(a) {
      this.hardRedraw = a;
      this.redrawCountdown = 1;
    }
    startDrawLoop() {
      this.redrawCountdown = 1;
      this.redrawCore();
    }
    redrawCore() {
      this.debugtextDiv
        ? this.debugtextDiv.innerText !== this.debugtext &&
          (this.debugtextDiv.innerText = this.debugtext)
        : (this.debugtextDiv = document.getElementById("debugtext"));
      var b;
      if (
        !this.alreadyRedrawing &&
        true === this.readyToGo &&
        OneView.core.appStateHandler.sizesInitiated &&
        0 < this.redrawCountdown
      ) {
        this.lastDrawTime = this.getTimeStamp();
        b = this.drawAreaEffects.runEffects();
        this.alreadyRedrawing = true;
        this.appStateHandler.isMainMenuShowing &&
          this.mainMenuControl.setSizes();
        this.zopDrawArea.clearDrawArea();
        this.drawArea.startNewRound();
        this.addButtonControl.isAnimationActive() &&
          ((b = true), this.addButtonControl.doAnimation());
        this.calendarDateHandler &&
          (this.appStateHandler.isMainMenuShowing &&
            this.mainMenuControl.redraw(),
          this.calendarDateHandler.paintCalendarDateObjects(),
          this.calendarEventHandler.paintCalendarEvents());
        this.calendarDateHandler.paintWeekNumbers();
        this.dateTimeSelectionHandler &&
        this.appStateHandler &&
        this.appStateHandler.isChoosingDateTimeForEvent
          ? this.dateTimeSelectionHandler.paint()
          : this.calendarDateHandler.paintMarker(new Date());
        this.mainMenuControl.redrawMenuIcon();
        this.addButtonControl.redrawAddButton();
        var c = this.getTimeStamp(),
          e = Math.round(c - this.lastDrawTime);
        this.totalTime += e;
        this.totalRedraws += 1;
        this.maxTime < e + 20 && (this.maxTime = Math.max(e, this.maxTime));
        100 < this.totalRedraws && (this.totalRedraws = this.totalTime = 0);
        this.loadingHandler && this.loadingHandler.showLoadingSpinnerIfNeeded();
        this.lastDrawTime = c;
        this.zopDrawArea.debugTexts(this.debugTexts);
        this.debugCounter = 0;
        this.alreadyRedrawing = false;
        b ||
          !this.loadingHandler ||
          this.loadingHandler.isLoading() ||
          --this.redrawCountdown;
      }
      this.requestAnimFrame.call(window, this.redrawCore);
    }
    getTimeStamp() {
      return window.performance && window.performance.now
        ? window.performance.now()
        : window.performance && window.performance.webkitNow
        ? window.performance.webkitNow()
        : new Date().getTime();
    }
    reopenApp() {
      OneView.core.helper.canShowDatePicker() &&
        ((this.onSuccessX = this.onSuccessX.bind(this)),
        (this.onErrorX = this.onErrorX.bind(this)),
        datePicker.updateThemeColor(
          this.settings.theme.colorTitleBackground,
          "3" == this.commonUserSettings.theme,
          this.onSuccessX,
          this.onErrorX
        ));
    }
    onSuccessX(a) {
      datePicker.restartApp(
        function () {},
        function () {}
      );
    }
    onErrorX(a) {}
    reloadAllCalendarData() {
      this.calendarDateHandler.reset();
      this.calendarDataProxy
        ? this.calendarDataProxy.reload()
        : this.loadDataProxy();
    }
    persistChangesToCalendars() {
      OneView.core.calendarDataProxy.saveSettings();
    }
    populateCalendars() {
      var b = this;
      if (true || (OneView.core && OneView.core.pageLoaded)) {
        this.calendarDataProxy = new OneView.DemoCalendarDataProxy();
        this.loadingHandler.startLoading();
        this.calendarDataProxy.populateCalendarEvents(function () {
          b.dataLoadReady();
        });
      } else {
        this.populateCalendars = this.populateCalendars.bind(this);
        setTimeout(this.populateCalendars, 100);
      }
    }
    dataLoadReady() {
      this.firstTouchMade || OneView.core.zopHandler.showInitialBounds(true);
      OneView.core.calendarEventHandler.dataLoadReady();
      OneView.core.loadingHandler.stopLoading();
      this.redraw(true);
    }
    dynamicallyLoadFile(a, c, e) {
      var b = this;
      -1 < this.loadedFiles.indexOf(a)
        ? e && e()
        : "js" == c
        ? ((c = document.createElement("script")),
          c.setAttribute("type", "text/javascript"),
          c.setAttribute("src", a),
          e &&
            (c.onload = function () {
              b.loadedFiles.push(a);
              e();
            }),
          document.getElementsByTagName("head")[0].appendChild(c))
        : "css" == c &&
          ((c = document.createElement("link")),
          c.setAttribute("rel", "stylesheet"),
          c.setAttribute("type", "text/css"),
          c.setAttribute("href", a),
          document.getElementsByTagName("head")[0].appendChild(c),
          this.loadedFiles.push(a));
    }
    getCalendar(b) {
      var c;
      for (c = 0; c < this.calendars.length; c++)
        if (this.calendars[c].id === b) return this.calendars[c];
      return new OneView.CalendarObject(
        "NoneZ",
        "None",
        [],
        1,
        OneView.VisibilityType.Hidden,
        true,
        true
      );
    }
    setSizeSettings() {
      var b = Math.max(
        6.67,
        Math.min(
          10,
          Math.min(
            OneView.core.domHandler.screenWidthForDOM,
            OneView.core.domHandler.screenHeightForDOM
          ) / 20
        )
      );
      this.settings.allowWeekNumber = 9 < b;
      this.settings.titleWidth = Math.ceil(
        this.settings.theme.titleWidthFactor * this.ratio * this.settings.zoom
      );
      this.settings.innerLeftMargin = this.settings.titleWidth / 5;
      this.settings.innerTopMaxMargin = this.settings.innerLeftMargin;
      this.settings.badgesLeft = Math.floor(
        9.6 * b * this.ratio * this.settings.zoom
      );
      this.settings.eventsFarLeft = Math.floor(
        11.5 * b * this.ratio * this.settings.zoom
      );
      10 > b &&
        (this.settings.eventsFarLeft =
          this.settings.badgesLeft + 6 * this.ratio * this.settings.zoom);
      this.settings.useMiniBadges = 10 > b;
      this.settings.tagHeight = Math.floor(
        26 * this.ratio * this.settings.zoom
      );
      this.zopHandler.absoluteMinZoom =
        (0.001 * this.settings.tagHeight) / this.ratio;
      this.zopHandler.absoluteMaxZoom = 4e5 / this.settings.tagHeight;
      this.settings.minDateHeight = this.settings.tagHeight + 2;
      this.settings.tagColorWidth = 0;
      this.settings.margin = Math.floor(4 * this.ratio * this.settings.zoom);
      this.settings.tagTextHeight = Math.min(
        14 * this.ratio * this.settings.zoom,
        Math.floor(
          this.settings.tagHeight -
            this.settings.margin -
            Math.floor(this.settings.tagHeight / 4)
        )
      );
      this.settings.weekCircleDiameter = 1.6 * this.settings.tagTextHeight;
      this.settings.badgeTextHeight = Math.min(
        11 * this.ratio * this.settings.zoom,
        Math.floor((this.settings.titleWidth / 2) * 0.8)
      );
      this.settings.dateBigTextSize = Math.min(
        16 * this.ratio * this.settings.zoom,
        Math.ceil((this.settings.tagTextHeight + this.settings.tagHeight) / 2)
      );
      this.settings.title0FontSize = Math.min(
        16 * this.ratio * this.settings.zoom,
        Math.floor((this.settings.titleWidth / 2) * 1.1)
      );
      this.settings.title1FontSize = Math.min(
        16 * this.ratio * this.settings.zoom,
        Math.floor((this.settings.titleWidth / 2) * 0.9)
      );
      this.settings.title2FontSize = Math.min(
        16 * this.ratio * this.settings.zoom,
        Math.floor((this.settings.titleWidth / 2) * 0.8)
      );
      this.settings.menuTextHeight = this.settings.title0FontSize;
      this.settings.menuItemHeight = 3 * this.settings.title0FontSize;
      this.settings.lineThickness = 2 * this.ratio * this.settings.zoom;
      this.settings.menuIconHeight =
        16 > this.settings.menuTextHeight
          ? 1.6 * b
          : 26 > this.settings.menuTextHeight
          ? 2.4 * b
          : 34 > this.settings.menuTextHeight
          ? 3.2 * b
          : 4.8 * b;
    }
    showBackButtons() {
      return !new OneView.Helper().isAndroid() || !OneView.core.isCordovaApp;
    }
    loadGraphics() {
      this.drawAreaEffects = new OneView.DrawAreaEffects();
      this.calendarEventHandler = new OneView.CalendarEventHandler();
      this.calendarDateHandler = new OneView.CalendarDateHandler();
      var b = "onorientationchange" in window ? "orientationchange" : "resize";
      this.domHandler.resetDrawAreaSize_Delayed =
        this.domHandler.resetDrawAreaSize_Delayed.bind(this.domHandler);
      window.addEventListener(
        b,
        this.domHandler.resetDrawAreaSize_Delayed,
        false
      );
      this.domHandler.resetDrawAreaSize_Delayed();
      this.zopHandler.showInitialBounds(false);
      this.readyToGo = true;
      this.redraw(true);
      this.preloadAllImages();
      this.pageLoaded = true;
    }
    preloadAllImages() {
      this.preloadImage(this.charCodeReload);
      this.preloadImage(this.charCodeLogin);
      this.preloadImage(this.charCodeLogout);
      this.preloadImage(this.charCodeCalendars);
      this.preloadImage(this.charCodeAbout);
      this.preloadImage(this.charCodeFake);
      this.preloadImage(this.charCodeSettings);
      this.preloadImage(this.charCodeNew);
      this.preloadImage(this.charCodeView);
      this.preloadImage(this.charCodeEdit);
      this.preloadImage(this.charCodeDelete);
      this.preloadImage(this.charCodeOk);
      this.preloadImage(this.charCodeCancel);
      this.preloadImage(this.charCodeMenu);
      this.preloadImage(this.charCodeAdd);
    }
    preloadImage(b) {
      OneView.core.drawArea.drawIcon(b, -100, -100, 16, 16);
    }
  }
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

  export let core: Core;

  export class Translate {
    constructor(b) {
      this.languages = new OneView.Dictionary();
      var c;
      for (c = 0; c < xLanguageAbbreviations.length; c++)
        this.languages.add(xLanguageAbbreviations[c], xLanguageNames[c]);
      this.defaultLanguageIndex = 0;
      this.currentLanguageIndex = xLanguageAbbreviations.indexOf(b);
      0 > this.currentLanguageIndex &&
        (this.currentLanguageIndex = this.defaultLanguageIndex);
      this.keys = [];
      for (c = 0; c < xTranslations.length; c++)
        this.keys.push(xTranslations[c][this.defaultLanguageIndex]);
    }
    static languageExists(a) {
      return (
        0 <= xLanguageAbbreviations.indexOf(a) || 0 <= xLanguageNames.indexOf(a)
      );
    }
    get(a) {
      var b = this.keys.indexOf(a);
      if (0 > b) return a;
      b = xTranslations[b][this.currentLanguageIndex];
      return void 0 !== b && null !== b && "" != b ? b : a;
    }
  }

  export class Dictionary {
    constructor() {
      this._keys = [];
      this._values = [];
    }
    setup(a, c) {
      for (var b = 0; b < a.length; b++) this.add(a[b], c[b]);
    }
    syncArrays() {
      for (var a = 0; a < this._values.length; a++)
        this._values[a] = this[this._keys[a]];
    }
    add(a, c) {
      this[a] = c;
      this._keys.push(a);
      this._values.push(c);
    }
    remove(a) {
      var b = this._keys.indexOf(a, 0);
      this._keys.splice(b, 1);
      this._values.splice(b, 1);
      delete this[a];
    }
    keys() {
      return this._keys;
    }
    values() {
      return this._values;
    }
    containsKey(a) {
      return "undefined" === typeof this[a] ? false : true;
    }
    toLookup() {
      return this;
    }
  }
  export class CanvasHorizontalCacheObject {
    constructor(a, b) {
      this.cachedTags = [];
      this.cachedDates = [];
      this.cachedDates2 = [];
      this.cachedBadges = [];
      this.badgeRowHeight =
        this.date2RowHeight =
        this.dateRowHeight =
        this.tagRowHeight =
        this.badgeTextHeight =
        this.date2TextHeight =
        this.dateTextHeight =
        this.tagTextHeight =
          0;
      this.previousFont = "";
      this.canvas = a;
      this.canvasContext = b;
    }
    setTagHeight(a) {
      if (this.tagTextHeight !== a) {
        this.tagTextHeight = a;
        this.tagRowHeight = this.tagTextHeight + 2;
        this.cachedTags = [];
        this.canvasContext.clearRect(
          this.tagsLeft,
          this.tagsTop,
          this.tagsWidth,
          this.tagsHeight
        );
        a = Math.floor(this.canvas.height / this.tagRowHeight);
        var b;
        for (b = 0; b < a; b++) this.cachedTags.push(new d());
      }
    }
    setDateHeights(a, b) {
      if (this.dateTextHeight !== a || this.date2TextHeight !== b) {
        this.dateTextHeight = a;
        this.dateRowHeight = this.dateTextHeight + 2;
        this.date2TextHeight = b;
        this.date2RowHeight = this.date2TextHeight + 2;
        this.cachedDates = [];
        this.canvasContext.clearRect(
          this.datesLeft,
          this.datesTop,
          this.datesWidth,
          this.datesHeight
        );
        var c = Math.floor(
            this.canvas.height / (this.dateRowHeight + this.date2RowHeight)
          ),
          e;
        for (e = 0; e < c; e++) this.cachedDates.push(new d());
        this.cachedDates2 = [];
        this.canvasContext.clearRect(
          this.dates2Left,
          this.dates2Top,
          this.dates2Width,
          this.dates2Height
        );
        for (e = 0; e < c; e++) this.cachedDates2.push(new d());
        this.setBoundries();
      }
    }
    setBadgeHeight(a) {
      if (this.badgeTextHeight !== a) {
        this.badgeRowHeight = this.badgeTextHeight = a;
        this.cachedBadges = [];
        this.canvasContext.clearRect(
          this.badgesLeft,
          this.badgesTop,
          this.badgesWidth,
          this.badgesHeight
        );
        a = Math.floor(this.canvas.height / a);
        var b;
        for (b = 0; b < a; b++) this.cachedBadges.push(new d());
      }
    }
    emptyCache() {
      var a;
      for (a = 0; a < this.cachedTags.length; a++)
        this.cachedTags[a].isEmpty = true;
      for (a = 0; a < this.cachedDates.length; a++)
        this.cachedDates[a].isEmpty = true;
      for (a = 0; a < this.cachedDates2.length; a++)
        this.cachedDates2[a].isEmpty = true;
      for (a = 0; a < this.cachedBadges.length; a++)
        this.cachedBadges[a].isEmpty = true;
      this.setBoundries();
    }
    setBoundries() {
      this.tagsLeft = OneView.core.settings.eventsFarLeft;
      this.tagsTop = 0;
      this.tagsWidth = this.canvas.width - this.tagsLeft;
      this.tagsHeight = this.canvas.height;
      this.badgesLeft = OneView.core.settings.badgesLeft;
      this.badgesTop = 0;
      this.badgesWidth = this.tagsLeft - this.badgesLeft;
      this.badgesHeight = this.canvas.height;
      this.datesLeft = OneView.core.settings.titleWidth;
      this.datesTop = 0;
      this.datesWidth = this.badgesLeft - this.datesLeft;
      this.datesHeight =
        Math.floor(
          this.canvas.height / (this.dateTextHeight + this.date2TextHeight)
        ) * this.dateTextHeight;
      this.dates2Left = OneView.core.settings.titleWidth;
      this.dates2Top = this.datesHeight;
      this.dates2Width = this.badgesLeft - this.dates2Left;
      this.dates2Height =
        Math.floor(
          this.canvas.height / (this.dateTextHeight + this.date2TextHeight)
        ) * this.date2TextHeight;
    }
    startRedraw() {
      var a;
      for (a = 0; a < this.cachedTags.length; a++)
        this.cachedTags[a].wasUsedLast = false;
      for (a = 0; a < this.cachedDates.length; a++)
        this.cachedDates[a].wasUsedLast = false;
      for (a = 0; a < this.cachedDates2.length; a++)
        this.cachedDates2[a].wasUsedLast = false;
      for (a = 0; a < this.cachedBadges.length; a++)
        this.cachedBadges[a].wasUsedLast = false;
    }
    endRedraw() {
      var a;
      for (a = 0; a < this.cachedTags.length; a++)
        false === this.cachedTags[a].wasUsedLast &&
          (this.cachedTags[a].isEmpty = true);
      for (a = 0; a < this.cachedDates.length; a++)
        false === this.cachedDates[a].wasUsedLast &&
          (this.cachedDates[a].isEmpty = true);
      for (a = 0; a < this.cachedDates2.length; a++)
        false === this.cachedDates2[a].wasUsedLast &&
          (this.cachedDates2[a].isEmpty = true);
      for (a = 0; a < this.cachedBadges.length; a++)
        false === this.cachedBadges[a].wasUsedLast &&
          (this.cachedBadges[a].isEmpty = true);
    }
    drawTagText(a, b, d, g, m, n, l) {
      this.drawTextHelper(
        this.cachedTags,
        a,
        b,
        d,
        g,
        m,
        n,
        l,
        this.tagTextHeight,
        this.tagRowHeight + 4,
        this.tagsLeft,
        this.tagsWidth,
        this.tagsTop
      );
    }
    drawDateText(a, b, d, g, m, n, l, h) {
      b === this.dateTextHeight
        ? this.drawTextHelper(
            this.cachedDates,
            a,
            d,
            g,
            m,
            n,
            l,
            h,
            this.dateTextHeight,
            this.dateRowHeight,
            this.datesLeft,
            this.datesWidth,
            this.datesTop
          )
        : this.drawTextHelper(
            this.cachedDates2,
            a,
            d,
            g,
            m,
            n,
            l,
            h,
            this.date2TextHeight,
            this.date2RowHeight,
            this.dates2Left,
            this.dates2Width,
            this.dates2Top
          );
    }
    drawBadgeText(a, b, d, g, m, n, l) {
      this.drawTextHelper(
        this.cachedBadges,
        a,
        b,
        d,
        g,
        m,
        n,
        l,
        this.badgeTextHeight,
        this.badgeRowHeight,
        this.badgesLeft,
        this.badgesWidth,
        this.badgesTop
      );
    }
    drawTextHelper(a, b, f, g, m, n, l, h, k, p, q, r, v) {
      h = Math.min(h, r);
      a = new d();
      a.text = b;
      a.textColor = f;
      this.paintImageToCacheCanvas(a, m, k, p, n, h, l);
    }
    paintImageToCacheCanvas(a, b, d, g, m, n, l) {
      b === this.canvasContext && b.clearRect(m, l, n, g);
      this.setFont(d, b);
      b.fillStyle = a.textColor;
      b.fillText(a.text, m, l + d);
    }
    getImageFromCacheCanvas(a, b, d, g, m, n, l, h) {
      b.drawImage(
        this.canvas,
        d,
        Math.ceil(g),
        h,
        m - 1,
        Math.ceil(n),
        Math.floor(l),
        h,
        m - 1
      );
    }
    setFont(a, b) {
      var c = "normal lighter " + a + "px Roboto";
      b !== this.canvasContext
        ? (b.font = c)
        : this.previousFont !== c &&
          ((this.previousFont = c), (b.font = this.previousFont));
    }
  }

  export class ZopDrawArea {
    canvasContext?: CanvasRenderingContext2D = undefined;
    canvas: HTMLCanvasElement = undefined;
    zopAreaWidth = 0;
    zopAreaLeft = 0;
    zopAreaHeight = 0;
    zopAreaTop = 0;
    screenTop = 0;
    screenLeft = 0;

    characterFitCache = new OneView.SpeedCache();
    textMeasuresCache = new OneView.SpeedCache();
    drawInfos = [];
    constructor() {}
    init(canvas: HTMLCanvasElement, c: CanvasRenderingContext2D) {
      this.canvas = canvas;
      this.canvasContext = c;
      OneView.core.eventHandler.addBatchEventsTo(this.canvas);
    }
    setCanvas(b, c) {
      this.canvas = b;
      this.canvasContext = c;
      OneView.core.drawArea = new OneView.DrawArea();
    }
    fillDrawArea(a) {
      this.canvasContext.fillStyle = a;
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    emptyDrawArea() {
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    clearDrawArea() {
      this.characterFitCache.startNewRound();
      this.textMeasuresCache.startNewRound();
      OneView.core.drawArea.drawFilledRectangle(
        OneView.core.zopHandler.leftPixel +
          OneView.core.settings.titleWidth +
          OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
        0,
        OneView.core.zopHandler.rightPixel - OneView.core.zopHandler.leftPixel,
        OneView.core.zopDrawArea.zopAreaHeight,
        OneView.core.settings.theme.colorBackground,
        false
      );
      OneView.core.drawArea.drawFilledRectangle(
        OneView.core.zopHandler.leftPixel,
        0,
        OneView.core.settings.titleWidth +
          OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
        OneView.core.zopDrawArea.zopAreaHeight,
        OneView.core.settings.theme.colorTitleBackground,
        false
      );
    }
    resetDrawAreaSize(b, c) {
      this.zopAreaTop = 0;
      this.zopAreaHeight = b;
      this.zopAreaLeft = 0;
      this.zopAreaWidth = c;
      OneView.core.appStateHandler.isChoosingDateTimeForEvent &&
        ((this.zopAreaTop +=
          OneView.core.dateTimeSelectionHandler.getSpaceTakenAtTop()),
        (this.zopAreaHeight -=
          OneView.core.dateTimeSelectionHandler.getSpaceTakenAtTop() +
          OneView.core.dateTimeSelectionHandler.getSpaceTakenAtBottom()));
      OneView.core.zopHandler.initSize(
        this.zopAreaTop,
        this.zopAreaTop + this.zopAreaHeight,
        this.zopAreaLeft,
        this.zopAreaLeft + this.zopAreaWidth
      );
      OneView.core.zopHandler.setZoom(
        OneView.core.zopHandler.topZOP,
        OneView.core.zopHandler.bottomZOP,
        this.zopAreaTop,
        this.zopAreaTop + this.zopAreaHeight
      );
    }
    setShadow(b) {
      b &&
        ((this.canvasContext.shadowOffsetX = 1 * OneView.core.ratio),
        (this.canvasContext.shadowOffsetY = 2 * OneView.core.ratio),
        (this.canvasContext.shadowBlur = 4 * OneView.core.ratio),
        (this.canvasContext.shadowColor = "#555555"));
    }
    clearTextDivs() {}
    drawCalendarDateObjectName(b, c, e, d, l, h, k, p) {
      if (3 > l) return 0;
      c += e;
      e = OneView.core.settings.theme.colorDarkText;
      h && (e = OneView.core.settings.theme.colorRedDayText);
      return k
        ? this.measureTextWidth(
            this.drawText(
              d,
              b,
              c,
              0,
              l,
              e,
              OneView.core.settings.theme.colorBackground,
              false,
              2e3,
              !p,
              p
            ),
            l,
            false,
            false
          )
        : this.measureTextWidthIfRisky(
            this.drawText(
              d,
              b,
              c,
              0,
              l,
              e,
              OneView.core.settings.theme.colorBackground,
              false,
              2e3,
              !p,
              p
            ),
            l,
            2e3,
            false,
            false
          );
    }
    drawBadge(b, c, e, d, l, h, k) {
      if (OneView.core.settings.useMiniBadges)
        this.drawFilledCircle2(
          b,
          c + e / 2,
          2 * OneView.core.ratio * OneView.core.settings.zoom,
          k,
          false
        );
      else {
        e = e - OneView.core.settings.margin - 1;
        var f = OneView.core.settings.badgeTextHeight;
        OneView.core.drawArea.setFont(f);
        for (
          var g = d - b, m = this.measureTextWidth(l, f, false, true);
          m > g && 6 < f;

        )
          --f, (m = this.measureTextWidth(l, f, false, true));
        e = Math.floor((e - f) / 2);
        m > d - b && (d += (m - d + b) / 2);
        0.5 < h &&
          this.drawText(
            l,
            d - m,
            c,
            e,
            f,
            k,
            OneView.core.settings.theme.colorRed,
            false,
            200,
            false,
            false
          );
      }
    }
    howManyCharactersFit(a, b, e, d) {
      var f = a + "&&" + b,
        g = this.characterFitCache.findObject(f);
      if (void 0 !== g) {
        var k = g.lettersCount;
        if (g.lastMaxPixelWidth !== e) {
          var m = this.measureTextWidth(a.substring(0, k), b, false, d);
          if (g.lastMaxPixelWidth > e)
            for (; 0 < k && m >= e; )
              --k,
                (m = this.measureTextWidth(a.substring(0, k), b, false, true));
          else {
            for (d = m; k < a.length && m < e; )
              (k += 1),
                (d = m),
                (m = this.measureTextWidth(a.substring(0, k), b, false, true));
            (k == a.length && m < e) || ((m = d), --k);
          }
          g.lettersCount = k;
          g.lastMaxPixelWidth = m;
        }
        return k;
      }
      k = a.length;
      for (
        m = this.measureTextWidthIfRisky(a, b, e, false, d);
        0 < k && m >= e;

      )
        --k, (m = this.measureTextWidth(a.substring(0, k), b, false, d));
      this.characterFitCache.addObject(f, new FitCacheEntry(k, e));
      return k;
    }
    measureTextWidth(a, b, c, e) {
      var f = a + "##" + b,
        g = this.textMeasuresCache.findObject(f);
      void 0 === g &&
        ((g = new TextMeasurer(this.canvasContext, a, b, c, e)),
        this.textMeasuresCache.addObject(f, g));
      return g.pixelLength;
    }
    measureTextWidthIfRisky(a, b, c, e, d) {
      var f = a.length * b * 0.85;
      return f > c ? this.measureTextWidth(a, b, e, d) : f;
    }
    drawTag(b, c, e, d, l, h, k, p) {
      var f = c + 1;
      e -= OneView.core.settings.margin;
      var g = Math.min(OneView.core.settings.tagColorWidth, e),
        m = Math.floor(
          (h - OneView.core.settings.tagTextHeight) / 2 -
            OneView.core.settings.margin
        ),
        n = m + OneView.core.settings.margin;
      0 < g &&
        OneView.core.drawArea.drawFilledRectangle(
          b,
          f,
          g,
          h - OneView.core.settings.margin,
          OneView.core.settings.theme.colorBlue,
          false
        );
      0 < e - g &&
        (OneView.core.drawArea.drawFilledRectangle(
          b + g,
          f,
          e - g,
          h - OneView.core.settings.margin,
          d,
          false
        ),
        0.5 < p &&
          (0.95 > p && (l = OneView.core.helper.colorToRGBA(l, 2 * (p - 0.5))),
          this.drawText(
            k,
            b + g + n,
            c,
            m,
            OneView.core.settings.tagTextHeight,
            l,
            d,
            false,
            e - g - n - 2,
            false,
            OneView.core.settings.theme.tagTextIsBold
          )));
    }
    drawFullEvent(b, c, e, d, l, h, k) {
      var f = Math.max(OneView.core.zopHandler.getPixelFromZOP(c) + 1, 0),
        g = Math.max(OneView.core.zopHandler.getPixelFromZOP(e), 0),
        m =
          OneView.core.zopHandler.getPixelFromZOP(e) -
          OneView.core.zopHandler.getPixelFromZOP(c),
        f = Math.min(f, g - OneView.core.settings.tagHeight);
      d -= OneView.core.settings.margin;
      g = g - f - 1;
      if (!(0 >= g)) {
        var n = Math.min(OneView.core.settings.tagColorWidth, d),
          p = Math.floor(
            (OneView.core.settings.tagHeight -
              OneView.core.settings.tagTextHeight) /
              2 -
              OneView.core.settings.margin
          ),
          w = p + OneView.core.settings.margin,
          z = Math.min(OneView.core.settings.tagHeight, d - n);
        0 < n &&
          OneView.core.drawArea.drawFilledRectangle(
            b,
            f,
            n,
            g,
            OneView.core.settings.theme.colorBlue,
            false
          );
        0 < d - n &&
          OneView.core.drawArea.drawFilledRectangle(
            b + n,
            f,
            d - n,
            g,
            l,
            false
          );
        1.6 * d > m || m < 2 * OneView.core.settings.tagHeight
          ? this.drawText(
              k,
              b + n + w,
              f - 1,
              p,
              OneView.core.settings.tagTextHeight,
              h,
              l,
              false,
              d - n - w - 2,
              false,
              OneView.core.settings.theme.tagTextIsBold
            )
          : z > OneView.core.settings.tagTextHeight &&
            ((w = Math.floor(OneView.core.settings.tagHeight / 6)),
            this.drawVerticalTitle(
              c,
              e,
              b + n + w,
              k,
              OneView.core.settings.tagTextHeight,
              h,
              OneView.core.settings.margin,
              false,
              OneView.core.settings.theme.tagTextIsBold
            ));
      }
    }
    drawPartialTag(b, c, e, d, l) {
      e -= OneView.core.settings.margin;
      4 > l ||
        OneView.core.drawArea.drawFilledRectangle(
          b,
          c + 1,
          e,
          l - OneView.core.settings.margin,
          d,
          false
        );
    }
    drawTextDiv(a, b, c, e, d, h, k, p, q, r) {}
    drawFilledRectangle(b, c, e, d, l, h) {
      this.canvasContext.fillStyle = l;
      c = OneView.core.zopHandler.getPixelFromZOP(c);
      d = Math.max(OneView.core.zopHandler.getPixelFromZOP(d) - c, h);
      this.canvasContext.fillRect(b, c, e, d);
    }
    drawTriangle(b, c, e, d, l, h, k, p) {
      this.setShadow(p);
      c = OneView.core.zopHandler.getPixelFromZOP(c);
      d = c + d;
      h = c + h;
      this.canvasContext.fillStyle = k;
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(b, c);
      this.canvasContext.lineTo(b + e, d);
      this.canvasContext.lineTo(b + l, h);
      this.canvasContext.closePath();
      this.canvasContext.fill();
      this.removeShadow(p);
    }
    removeShadow(a) {
      a &&
        ((this.canvasContext.shadowOffsetX = 0),
        (this.canvasContext.shadowOffsetY = 0),
        (this.canvasContext.shadowBlur = 0),
        (this.canvasContext.shadowColor = "#000000"));
    }
    drawHorizontalLine(b, c, e, d, l) {
      this.drawHorizontalLineThick(
        b,
        c,
        e,
        d,
        OneView.core.settings.lineThickness,
        l
      );
    }
    drawFilledCircle(b, c, e, d, l) {
      this.setShadow(l);
      c = Math.floor(OneView.core.zopHandler.getPixelFromZOP(c)) + 0.5;
      this.canvasContext.beginPath();
      this.canvasContext.arc(b, c, e, 0, 2 * Math.PI, false);
      this.canvasContext.fillStyle = d;
      this.canvasContext.fill();
      this.removeShadow(l);
    }
    drawFilledCircle2(a, b, c, e, d) {
      this.setShadow(d);
      this.canvasContext.beginPath();
      this.canvasContext.arc(a, b, c, 0, 2 * Math.PI, false);
      this.canvasContext.fillStyle = e;
      this.canvasContext.fill();
      this.removeShadow(d);
    }
    drawHorizontalLineThick(b, c, e, d, l, h) {
      c = Math.floor(OneView.core.zopHandler.getPixelFromZOP(c));
      OneView.core.drawArea.drawHorizontalLineNotZOP(b, c, e, d, l, h);
    }
    startTextDelayedDraw() {
      this.delayedDraw = true;
    }
    endTextDelayedDraw() {
      this.delayedDraw = false;
      this.drawInfos.sort(function (a, b) {
        return a.textHeight - b.textHeight;
      });
      for (var a = 0; a < this.drawInfos.length; a++) {
        var b = this.drawInfos[a];
        this.drawText(
          b.text,
          b.left,
          b.topPixel,
          b.topPixelShift,
          b.textHeight,
          b.color,
          b.bgColor,
          b.useShadow,
          b.maxWidth,
          b.isThinner,
          b.isBold
        );
      }
      this.drawInfos = [];
    }
    drawText(c, e, d, n, l, h, k, p, q, r, v) {
      if (this.delayedDraw)
        return (
          this.drawInfos.push(new TextDrawer(c, e, d, n, l, h, k, p, q, r, v)),
          c
        );
      d = Math.floor(d + n);
      OneView.core.drawArea.setFont(l, false, r, v);
      c = c.substring(0, this.howManyCharactersFit(c, l, q, true));
      OneView.core.drawArea.drawText(c, e, d, l, h, false, false, r, v);
      return c;
    }
    drawVerticalTitle(b, c, e, d, l, h, k, p, q) {
      OneView.core.drawArea.setFont(l, p, false, q);
      q = OneView.core.zopHandler.get2PixelsFromZOPsForVErticalText(b, c);
      b = q.value1 + k;
      q = q.value2 - k;
      var f = (k = 0),
        g = OneView.core.settings.menuButtonBottom;
      e >
        OneView.core.settings.titleWidth +
          OneView.core.mainMenuControl.nudgeBecauseMenuBeingDragged && (g = 0);
      b < OneView.core.zopHandler.topPixel + g &&
        (k = OneView.core.zopHandler.topPixel + g - b);
      c > OneView.core.zopHandler.bottomZOP &&
        (f = q - OneView.core.zopHandler.bottomPixel);
      c = q - b - k - f;
      q = 0;
      for (
        f = this.measureTextWidth(d, l, p, true) + 5;
        1 < d.length && f >= c;

      )
        (d = d.substring(0, d.length - 1)),
          (f = this.measureTextWidth(d, l, p, true) + 5),
          (q = c - f);
      this.measureTextWidth(d, l, p, true) + 5 < c &&
        (this.canvasContext.save(),
        this.canvasContext.translate(
          Math.floor(e + 0.85 * l),
          Math.floor(c / 2)
        ),
        this.canvasContext.rotate(-Math.PI / 2),
        (this.canvasContext.textAlign = "center"),
        (this.canvasContext.fillStyle = h),
        this.canvasContext.fillText(
          d,
          Math.floor(-b - k - q / 2),
          Math.floor(OneView.core.zopHandler.leftPixel)
        ),
        this.canvasContext.restore());
    }
    debugTexts(b) {
      console.log(b);
      if (void 0 != b) {
        var c = 20 * OneView.core.ratio,
          e;
        for (e = 0; e < b.length; e++)
          OneView.core.drawArea.drawFilledRectangle(
            200,
            c,
            1e3,
            20 * OneView.core.ratio,
            "#000000",
            false
          ),
            OneView.core.drawArea.drawText(
              b[e],
              202,
              c - 1,
              18 * OneView.core.ratio,
              "#FFFFFF",
              false,
              false
            ),
            (c += 22 * OneView.core.ratio);
      }
    }
    debugText(b) {
      console.log(b);
      void 0 != b &&
        0 != b.length &&
        ((this.canvasContext.fillStyle = "#FF0000"),
        OneView.core.drawArea.setFont(14),
        this.canvasContext.fillText(b, 90, 330),
        60 < b.length && this.canvasContext.fillText(b.substring(60), 90, 360),
        120 < b.length &&
          this.canvasContext.fillText(b.substring(120), 90, 420),
        180 < b.length &&
          this.canvasContext.fillText(b.substring(180), 90, 480),
        240 < b.length &&
          this.canvasContext.fillText(b.substring(240), 90, 540));
    }
  }

  export class TextMeasurer {
    constructor(b, c, d, m, n) {
      this.text = c;
      this.textHeight = d;
      n || OneView.core.drawArea.setFont(d, m);
      this.pixelLength = b.measureText(c).width;
    }
  }

  export class TextDrawer {
    constructor(a, b, c, d, n, l, h, k, p, q, r) {
      this.text = a;
      this.left = b;
      this.topPixel = c;
      this.topPixelShift = d;
      this.textHeight = n;
      this.color = l;
      this.bgColor = h;
      this.useShadow = k;
      this.maxWidth = p;
      this.isThinner = q;
      this.isBold = r;
    }
  }

  export class FitCacheEntry {
    constructor(a, b) {
      this.lettersCount = a;
      this.lastMaxPixelWidth = b;
    }
  }
  // (function (a) {
  //   var p = (function (d) {
  //     function b() {
  //       d.call(this);
  //       this.enableReload = true;
  //       this.enableFakeData =
  //         this.enableGoogleLogout =
  //         this.enableGoogleLogin =
  //           false;
  //       this.enableShop = this.enableMultipleCalendars = true;
  //       this.calendarDataProxyType = a.CalendarDataProxyType.Android;
  //       this.demoVideoSpecial = false;
  //       this.rrulesDictionary = new a.Dictionary();
  //       this.analyticsStarted = false;
  //       OneView.core.dynamicallyLoadFile("libs/rrule.js", "js", function () {});
  //     }
  //     __extends(b, d);
  //     connectionOk () {
  //       return true;
  //     };
  //     calendarsLoaded (b) {
  //       if (void 0 === b || void 0 === b[0].name) this.delayedReload();
  //       else {
  //         this.calendarsLoadedMsg = b;
  //         this.eventsLoaded = this.eventsLoaded.bind(this);
  //         this.eventsLoadedFailed = this.eventsLoadedFailed.bind(this);
  //         b = moment()
  //           .add(
  //             -((1 * OneView.core.commonUserSettings.dataAmountToLoad) / 4),
  //             "months"
  //           )
  //           .toDate();
  //         var c = moment()
  //           .add((3 * OneView.core.commonUserSettings.dataAmountToLoad) / 4, "months")
  //           .toDate();
  //         window.plugins.calendar.listEventsInRange(
  //           b,
  //           c,
  //           this.eventsLoaded,
  //           this.eventsLoadedFailed
  //         );
  //       }
  //     };
  //     calendarsLoadedFailed (a) {
  //       this.clearAllData();
  //       this.analyticsEvent("Error", "Load calendars failed");
  //       this.calendarsLoadedCallback();
  //     };
  //     populateCalendarEvents (b) {
  //       this.startLoadingTime = OneView.core.getTimeStamp();
  //       a.DemoCalendarDataProxy.setLastSessionWasInDemoMode(false);
  //       this.calendarsLoaded = this.calendarsLoaded.bind(this);
  //       this.calendarsLoadedFailed = this.calendarsLoadedFailed.bind(this);
  //       this.calendarsLoadedCallback = b;
  //       window.plugins.calendar.listCalendars(
  //         this.calendarsLoaded,
  //         this.calendarsLoadedFailed
  //       );
  //     };
  //     clearAllData () {
  //       this.calendarEvents = [];
  //       OneView.core.calendarEventHandler.clearAllEvents();
  //       OneView.core.calendars = [];
  //       OneView.core.calendarPrimaryId = void 0;
  //     };
  //     handleCalendarsLoadedData () {
  //       var b;
  //       for (b = 0; b < this.calendarsLoadedMsg.length; b++) {
  //         var e = OneView.VisibilityType.Visible;
  //         0 === +this.calendarsLoadedMsg[b].visible &&
  //           (e = OneView.VisibilityType.Hidden);
  //         void 0 != OneView.core.calendarPrimaryId ||
  //           this.calendarsLoadedMsg[b].isReadOnly ||
  //           (OneView.core.calendarPrimaryId = this.calendarsLoadedMsg[b].id);
  //         this.calendarsLoadedMsg[b].isPrimary &&
  //           !this.calendarsLoadedMsg[b].isReadOnly &&
  //           (OneView.core.calendarPrimaryId = this.calendarsLoadedMsg[b].id);
  //         e = new OneView.calendarObject(
  //           this.calendarsLoadedMsg[b].id,
  //           this.calendarsLoadedMsg[b].name,
  //           [],
  //           b,
  //           e,
  //           !this.calendarsLoadedMsg[b].isReadOnly,
  //           !this.calendarsLoadedMsg[b].isReadOnly
  //         );
  //         OneView.core.calendars.push(e);
  //         "molyneux.peter@gmail.com" == e.name &&
  //           ((OneView.core.commonUserSettings.licenceColorPicker = true),
  //           (OneView.core.commonUserSettings.licenceCandyTheme = true),
  //           (OneView.core.commonUserSettings.licenceDarkTheme = true));
  //       }
  //     };
  //     eventsLoaded (a) {
  //       if (
  //         void 0 === a ||
  //         (a.length <= this.calendarsLoadedMsg.length &&
  //           void 0 === a[0].startDate)
  //       )
  //         this.delayedReload();
  //       else {
  //         this.clearAllData();
  //         this.handleCalendarsLoadedData();
  //         var b;
  //         for (b = 0; b < a.length; b++) {
  //           var c = this.convertToEvent(a[b]);
  //           this.calendarEvents.push(c);
  //         }
  //         this.finalizeLoad();
  //       }
  //     };
  //     convertToEvent (b) {
  //       var c = new Date(0 + b.startDate),
  //         d = new Date(0 + b.endDate);
  //       1 == b.allday
  //         ? ((c = new Date(c.getTime() + 6e4 * c.getTimezoneOffset())),
  //           (d = new Date(d.getTime() + 6e4 * d.getTimezoneOffset())))
  //         : ((c = OneView.core.helper.addUserTimeZoneSetting(c)),
  //           (d = OneView.core.helper.addUserTimeZoneSetting(d)));
  //       d.getDate() === c.getDate() &&
  //         (OneView.core.getCalendar(b.calendarId).allEventsAreFullDay = false);
  //       OneView.core.getCalendar(b.calendarId);
  //       var g = b.eventId + "#" + b.id,
  //         c = new OneView.CalendarEventObject(
  //           b.title,
  //           b.description,
  //           b.location,
  //           c,
  //           d,
  //           b.calendarId,
  //           g
  //         );
  //       c.isRecurring =
  //         !OneView.core.helper.isNullOrEmpty(b.rRule) ||
  //         !OneView.core.helper.isNullOrEmpty(b.rDate);
  //       c.recurringEventId = b.eventId;
  //       void 0 != b.color && "" != b.color && (c.androidColorNum = b.color);
  //       c.reminders = [];
  //       for (d = 0; b.reminders && d < b.reminders.length; d++)
  //         c.reminders.push(new a.Reminder(b.reminders[d]));
  //       OneView.core.helper.isNullOrEmpty(b.rRule) ||
  //         this.rrulesDictionary.add(g, b.rRule);
  //       return c;
  //     };
  //     eventsLoadedFailed (a) {
  //       this.clearAllData();
  //       this.analyticsEvent("Error", "Load events failed");
  //       this.calendarsLoadedCallback();
  //     };
  //     finalizeLoad () {
  //       var b;
  //       OneView.core.helper.sortCalendars();
  //       OneView.core.calendarEventHandler.gradeCalendarEvents(this.calendarEvents);
  //       OneView.core.calendarEventHandler.clearAllEvents();
  //       for (b = 0; b < this.calendarEvents.length; b++)
  //         OneView.core.getCalendar(this.calendarEvents[b].calendarId).visibility ==
  //           OneView.VisibilityType.Visible &&
  //           OneView.core.calendarEventHandler.addEventToCalendar(
  //             this.calendarEvents[b]
  //           );
  //       OneView.core.calendarEventHandler.findCommonTimes();
  //       OneView.core.redraw(true);
  //       this.loadSettings();
  //       this.analyticsValue(
  //         "Value",
  //         "Start",
  //         "Events loaded",
  //         this.calendarEvents.length
  //       );
  //       this.analyticsValue(
  //         "Value",
  //         "Start",
  //         "Data amount to load",
  //         OneView.core.commonUserSettings.dataAmountToLoad
  //       );
  //       this.analyticsTiming(
  //         "Loadtime",
  //         OneView.core.getTimeStamp() - this.startLoadingTime
  //       );
  //       this.calendarsLoadedCallback();
  //     };
  //     canEditRecurring (a) {
  //       return this.rrulesDictionary.containsKey(a.id);
  //     };
  //     getRRuleObject (a, b) {
  //       var c;
  //       this.rrulesDictionary.containsKey(a.id) &&
  //         (c = RRule.fromString(this.rrulesDictionary[a.id]));
  //       b(c);
  //     };
  //     login () {};
  //     logout () {};
  //     delayedReload () {
  //       var a = this;
  //       window.setTimeout(function () {
  //         a.reload();
  //       }, 1e3);
  //     };
  //     reload () {
  //       OneView.core.populateCalendars();
  //     };
  //     deleteEvent (b, e, d) {
  //       this.silentSuccessCallback = this.silentSuccessCallback.bind(this);
  //       this.delayedSuccessCallback = this.delayedSuccessCallback.bind(this);
  //       this.successCallback = this.successCallback.bind(this);
  //       this.failedCallback = this.failedCallback.bind(this);
  //       b.isRecurring && e !== a.EventEditType.AllInSeries
  //         ? b.isRecurring && e === a.EventEditType.ThisOnly
  //           ? ((e = b.startDateTime),
  //             (e =
  //               0 == b.startDateTime.getHours() && 0 == b.endDateTime.getHours()
  //                 ? new Date(e.getTime() - 6e4 * e.getTimezoneOffset())
  //                 : OneView.core.helper.removeUserTimeZoneSetting(e)),
  //             OneView.core.calendarEventHandler.removeCalendarEvent(b),
  //             window.plugins.calendar.deleteSingleEventFromRecurring(
  //               +b.recurringEventId,
  //               e,
  //               this.silentSuccessCallback,
  //               this.failedCallback
  //             ))
  //           : this.failedCallback(
  //               "This type of delete is not supported in OneView Calendar."
  //             )
  //         : (OneView.core.calendarEventHandler.removeCalendarEvent(b),
  //           window.plugins.calendar.deleteEvent(
  //             +b.recurringEventId,
  //             b.isRecurring
  //               ? this.delayedSuccessCallback
  //               : this.silentSuccessCallback,
  //             this.failedCallback
  //           ));
  //     };
  //     failedCallback (a) {
  //       console.log(a);
  //       this.reload();
  //     };
  //     silentSuccessCallback (a) {};
  //     returnIdCallback (a) {
  //       this.calendarEventThatNeedsNewId.recurringEventId = a;
  //     };
  //     quickSuccessCallback (a) {
  //       var b = this;
  //       window.setTimeout(function () {
  //         b.reload();
  //       }, 1);
  //     };
  //     successCallback (a) {
  //       var b = this;
  //       window.setTimeout(function () {
  //         b.reload();
  //       }, 1);
  //     };
  //     delayedSuccessCallback (a) {
  //       var b = this;
  //       this.successCallback(a);
  //       window.setTimeout(function () {
  //         b.reload();
  //       }, 1);
  //     };
  //     getAndroidColorNum (b) {
  //       if (null != b.extraColorId) {
  //         if (
  //           b.androidColorNum &&
  //           OneView.core.helper.getColorIdFromAndroidNum(b.androidColorNum) ==
  //             b.extraColorId
  //         )
  //           return +b.androidColorNum;
  //         b = OneView.core.helper.getEventColor2(b);
  //         return OneView.core.helper.getAndroidNumFromColor(b);
  //       }
  //     };
  //     addNewEvent (b, e) {
  //       void 0 === e && (e = false);
  //       for (var c = null, d = [], m = 0; m < b.reminders.length; m++)
  //         d.push(b.reminders[m].minutes);
  //       b.rruleToSave && (c = RRule.optionsToString2(b.rruleToSave.options));
  //       c = {
  //         calendarId: +b.calendarId,
  //         rrule: c,
  //         color: this.getAndroidColorNum(b),
  //       };
  //       this.delayedSuccessCallback = this.delayedSuccessCallback.bind(this);
  //       this.quickSuccessCallback = this.quickSuccessCallback.bind(this);
  //       this.returnIdCallback = this.returnIdCallback.bind(this);
  //       this.failedCallback = this.failedCallback.bind(this);
  //       this.calendarEventThatNeedsNewId = b;
  //       window.plugins.calendar.createEventWithOptions(
  //         b.summary,
  //         b.location,
  //         b.description,
  //         OneView.core.helper.removeUserTimeZoneSetting(b.startDateTime),
  //         OneView.core.helper.removeUserTimeZoneSetting(b.endDateTime),
  //         d,
  //         c,
  //         b.isRecurring || e
  //           ? this.delayedSuccessCallback
  //           : this.returnIdCallback,
  //         this.failedCallback
  //       );
  //       OneView.core.calendarEventHandler.addEventToCalendar(b);
  //     };
  //     getFirstRecurringEvent (a) {
  //       return this.calendarEvents.filter(function (b) {
  //         return b.recurringEventId === a.recurringEventId;
  //       })[0];
  //     };
  //     editExistingEvent (b, e) {
  //       for (var c = null, d = [], m = 0; m < b.reminders.length; m++)
  //         d.push(b.reminders[m].minutes);
  //       b.rruleToSave && (c = RRule.optionsToString2(b.rruleToSave.options));
  //       c = {
  //         calendarId: +b.calendarId,
  //         rrule: c,
  //         color: this.getAndroidColorNum(b),
  //       };
  //       this.silentSuccessCallback = this.silentSuccessCallback.bind(this);
  //       this.delayedSuccessCallback = this.delayedSuccessCallback.bind(this);
  //       this.failedCallback = this.failedCallback.bind(this);
  //       m = b.isRecurring && e !== a.EventEditType.ThisOnly;
  //       b.isRecurring && e !== a.EventEditType.AllInSeries
  //         ? b.isRecurring && e === a.EventEditType.ThisOnly
  //           ? (this.deleteEvent(b, a.EventEditType.ThisOnly, true),
  //             (b.isRecurring = false),
  //             (b.rruleToSave = void 0),
  //             this.addNewEvent(b, false))
  //           : this.failedCallback(
  //               "This type of edit is not supported in OneView Calendar."
  //             )
  //         : (window.plugins.calendar.modifyEventWithOptions(
  //             +b.recurringEventId,
  //             b.summary,
  //             b.location,
  //             b.description,
  //             OneView.core.helper.removeUserTimeZoneSetting(b.startDateTime),
  //             OneView.core.helper.removeUserTimeZoneSetting(b.endDateTime),
  //             d,
  //             c,
  //             m ? this.delayedSuccessCallback : this.silentSuccessCallback,
  //             this.failedCallback
  //           ),
  //           m ||
  //             (OneView.core.calendarEventHandler.removeCalendarEvent(b),
  //             OneView.core.calendarEventHandler.addEventToCalendar(b)));
  //     };
  //     persistCalendarsVisibilitySettings (b) {
  //       for (var c = 0; c < b.length; c++)
  //         b[c].oldVisibility === b[c].newVisibility && (b.splice(c, 1), c--);
  //       for (var d = 0; d < OneView.core.calendars.length; d++)
  //         for (c = 0; c < b.length; c++)
  //           if (b[c].id == OneView.core.calendars[d].id) {
  //             var g = 1;
  //             b[c].newVisibility === OneView.VisibilityType.Hidden && (g = 0);
  //             this.silentSuccessCallback = this.silentSuccessCallback.bind(this);
  //             this.successCallback = this.successCallback.bind(this);
  //             this.failedCallback = this.failedCallback.bind(this);
  //             window.plugins.calendar.updateCalendarVisibility(
  //               +OneView.core.calendars[d].id,
  //               g,
  //               c < b.length - 1
  //                 ? this.silentSuccessCallback
  //                 : this.successCallback,
  //               this.failedCallback
  //             );
  //           }
  //     };
  //     applyCalendarsVisibilitySettings () {};
  //     saveSettings () {};
  //     loadSettings () {
  //       return true;
  //     };
  //     analyticsInit () {
  //       0 == this.analyticsStarted &&
  //         ((this.analyticsStarted = true),
  //         (this.analyticsSuccess = this.analyticsSuccess.bind(this)),
  //         (this.analyticsFail = this.analyticsFail.bind(this)),
  //         analytics.startTrackerWithId(
  //           "UA-69941766-3",
  //           this.analyticsSuccess,
  //           this.analyticsFail
  //         ));
  //     };
  //     analyticsEvent (a, b) {
  //       this.analyticsInit();
  //       analytics.trackEvent(
  //         a,
  //         b,
  //         null,
  //         null,
  //         this.analyticsSuccess,
  //         this.analyticsFail
  //       );
  //     };
  //     analyticsPage (a) {
  //       this.analyticsInit();
  //       analytics.trackView(a, this.analyticsSuccess, this.analyticsFail);
  //     };
  //     analyticsValue (a, b, d, g) {
  //       this.analyticsInit();
  //       analytics.trackEvent(
  //         a,
  //         b,
  //         d,
  //         g,
  //         this.analyticsSuccess,
  //         this.analyticsFail
  //       );
  //     };
  //     analyticsTiming (a, b) {
  //       this.analyticsInit();
  //       analytics.trackTiming(
  //         "Category",
  //         b,
  //         a,
  //         a,
  //         this.analyticsSuccess,
  //         this.analyticsFail
  //       );
  //     };
  //     analyticsSuccess (a) {};
  //     analyticsFail (a) {};
  //     return b;
  //   })(a.LocalStorage);
  //   a.AndroidCalendarDataProxy = p;
  // })(OneView || (OneView = {}));

  export class DemoCalendarDataProxy extends LocalStorage {
    enableMultipleCalendars = true;
    enableReload = true;
    enableShop = false;
    enableFakeData = false;
    enableGoogleLogout = false;
    enableGoogleLogin = false;
    calendarDataProxyType = OneView.CalendarDataProxyType.Demo;
    demoVideoSpecial = true;
    dbVersion = "demo0.52";

    connectionOk() {
      return true;
    }
    login() {}
    logout() {}
    populateCalendarEvents(c) {
      this.loadReadyCallback = c;
      this.calendarEvents = [];
      // OneView.core.calendarEventHandler.clearAllEvents();
      OneView.core.commonUserSettings.licenceColorPicker = true;
      OneView.core.commonUserSettings.licenceCandyTheme = true;
      OneView.core.commonUserSettings.licenceDarkTheme = true;
      OneView.core.settings.reloadThemesSettings(
        OneView.core.commonUserSettings
      );
      OneView.core.calendars = [];
      OneView.core.calendarPrimaryId = void 0;
      (this.loadEventsFromCache() &&
        void 0 != OneView.core.calendars &&
        0 != OneView.core.calendars.length) ||
        (this.fakeData(),
        OneView.core.helper.sortCalendars(),
        OneView.core.calendarEventHandler.gradeCalendarEvents(
          this.calendarEvents
        ),
        this.calendarEvents.sort(function (a, b) {
          return a.startZOP - b.startZOP;
        }),
        this.saveEventsToCache());
      this.finalizeLoad();
      DemoCalendarDataProxy.setLastSessionWasInDemoMode(true);
    }
    saveSettings() {
      this.saveEventsToCache();
    }
    reload() {
      var b = this.dbVersion;
      this.dbVersion = "XXX";
      OneView.core.populateCalendars();
      this.dbVersion = b;
    }
    fakeData() {
      var b;
      OneView.core.calendars.push(
        new OneView.CalendarObject(
          "Work",
          "Work Calendar",
          [],
          0,
          OneView.VisibilityType.Visible,
          true,
          true
        )
      );
      OneView.core.calendars.push(
        new OneView.CalendarObject(
          "My",
          "My Calendar",
          [],
          1,
          OneView.VisibilityType.Visible,
          true,
          true
        )
      );
      OneView.core.calendars.push(
        new OneView.CalendarObject(
          "Other",
          "Partners calendar",
          [],
          2,
          OneView.VisibilityType.Visible,
          true,
          false
        )
      );
      OneView.core.calendarPrimaryId = "My";
      OneView.core.getCalendar("Work").allEventsAreFullDay = false;
      OneView.core.getCalendar("My").allEventsAreFullDay = false;
      OneView.core.getCalendar("Other").allEventsAreFullDay = false;
      this.calendarEvents = [];
      var e = moment().startOf("week"),
        d = e.clone().add(1, "weeks").add(-28, "days"),
        g,
        m;
      for (b = 0; 30 > b; b++)
        (g = d
          .clone()
          .add(-80 + 21 * b, "days")
          .add(17, "hours")
          .toDate()),
          (m = d
            .clone()
            .add(-80 + 21 * b, "days")
            .add(19.5, "hours")
            .toDate()),
          (g = new OneView.CalendarEventObject(
            "Hockey with kids",
            "If you can't make it call Eddies dad: 043-423213",
            "Weaver hall",
            g,
            m,
            "My",
            this.calendarEvents.length.toString()
          )),
          this.calendarEvents.push(g);
      for (b = 0; 20 > b; b++)
        3 === b && b++,
          (g = d
            .clone()
            .add(-100 + 28 * b, "days")
            .add(18, "hours")
            .toDate()),
          (m = d
            .clone()
            .add(-100 + 28 * b, "days")
            .add(22, "hours")
            .toDate()),
          (g = new OneView.CalendarEventObject(
            "Walk n talk with Jim",
            "Time for reflection",
            "The park",
            g,
            m,
            "My",
            this.calendarEvents.length.toString()
          )),
          this.calendarEvents.push(g);
      g = moment().startOf("week").add(-200, "months").toDate();
      m = moment().startOf("week").add(-199, "months").toDate();
      g = new OneView.CalendarEventObject(
        "School starts",
        "",
        "",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = moment().startOf("week").add(-150, "months").toDate();
      m = moment().startOf("week").add(-130, "months").toDate();
      g = new OneView.CalendarEventObject(
        "First girlfriend",
        "",
        "",
        g,
        m,
        "Other",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = moment().startOf("week").add(-100, "months").toDate();
      m = moment().startOf("week").add(-99, "months").toDate();
      g = new OneView.CalendarEventObject(
        "16th birthday",
        "",
        "",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = moment().startOf("week").add(-86, "months").toDate();
      m = moment().startOf("week").add(-50, "months").toDate();
      g = new OneView.CalendarEventObject(
        "University",
        "",
        "",
        g,
        m,
        "Other",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = moment().startOf("week").add(-48, "months").toDate();
      m = moment().startOf("week").add(-36, "months").toDate();
      g = new OneView.CalendarEventObject(
        "Year in London",
        "",
        "",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = moment().startOf("week").add(-32, "months").toDate();
      m = moment().startOf("week").add(-30, "months").toDate();
      g = new OneView.CalendarEventObject(
        "Wedding!!",
        "",
        "",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = moment().startOf("week").add(4, "days").toDate();
      m = moment().startOf("week").add(5, "days").toDate();
      g = new OneView.CalendarEventObject(
        "Jims birthday",
        "",
        "",
        g,
        m,
        "Other",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = moment().startOf("week").add(7, "days").toDate();
      m = moment().startOf("week").add(8, "days").toDate();
      g = new OneView.CalendarEventObject(
        "Release",
        "On the menu there is an option to connect to Google. This will enable you to see your real calendar.",
        "",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = moment().startOf("week").add(9, "days").toDate();
      m = moment().startOf("week").add(10, "days").toDate();
      g = new OneView.CalendarEventObject(
        "Lisas birthday",
        "",
        "",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(1, "weeks").add(-22, "days").toDate();
      m = e.clone().add(1, "weeks").add(10, "days").toDate();
      g = new OneView.CalendarEventObject(
        "On diet",
        "Calorie drought",
        "",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(-63, "weeks").add(-22, "days").toDate();
      m = e.clone().add(-54, "weeks").add(10, "days").toDate();
      g = new OneView.CalendarEventObject(
        "On diet",
        "Calorie drought",
        "",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(1, "weeks").add(13, "days").toDate();
      m = e.clone().add(1, "weeks").add(18, "days").toDate();
      g = new OneView.CalendarEventObject(
        "Rent a car",
        "Abis",
        "",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      for (b = 0; 40 > b; b++)
        5 === b && b++,
          (g = d
            .clone()
            .add(-120 + 14 * b, "days")
            .add(17, "hours")
            .toDate()),
          (m = d
            .clone()
            .add(-120 + 14 * b, "days")
            .add(20, "hours")
            .toDate()),
          (g = new OneView.CalendarEventObject(
            "Gym",
            "",
            "Wassits",
            g,
            m,
            "Other",
            this.calendarEvents.length.toString()
          )),
          this.calendarEvents.push(g);
      for (b = 0; 60 > b; b++)
        5 === b && b++,
          (g = d
            .clone()
            .add(-127 + 14 * b, "days")
            .add(7, "hours")
            .toDate()),
          (m = d
            .clone()
            .add(-127 + 14 * b, "days")
            .add(8, "hours")
            .toDate()),
          (g = new OneView.CalendarEventObject(
            "Morning swim",
            "Be on time",
            "Lake",
            g,
            m,
            "My",
            this.calendarEvents.length.toString()
          )),
          this.calendarEvents.push(g);
      g = e.clone().add(-52, "weeks").add(1, "days").toDate();
      m = e.clone().add(-52, "weeks").add(31, "days").toDate();
      g = new OneView.CalendarEventObject(
        "Family holiday",
        "Double check the hotel booking",
        "Saxapahaw",
        g,
        m,
        "Other",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(1, "weeks").add(10, "days").toDate();
      m = e.clone().add(1, "weeks").add(23, "days").toDate();
      g = new OneView.CalendarEventObject(
        "Family holiday",
        "Double check the hotel booking",
        "Saxapahaw",
        g,
        m,
        "Other",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(30, "weeks").toDate();
      m = e.clone().add(40, "weeks").toDate();
      g = new OneView.CalendarEventObject(
        "Course",
        "Double check the hotel booking",
        "Saxapahaw",
        g,
        m,
        "Work",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(-100, "weeks").toDate();
      m = e.clone().add(-28, "weeks").toDate();
      g = new OneView.CalendarEventObject(
        "Previous job",
        "Double check the hotel booking",
        "Saxapahaw",
        g,
        m,
        "Work",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(-27, "weeks").toDate();
      m = e.clone().add(-18, "weeks").toDate();
      g = new OneView.CalendarEventObject(
        "Intro period",
        "Double check the hotel booking",
        "Saxapahaw",
        g,
        m,
        "My",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(-17, "weeks").toDate();
      m = e.clone().add(-14, "weeks").toDate();
      g = new OneView.CalendarEventObject(
        "IT Course",
        "Double check the hotel booking",
        "Saxapahaw",
        g,
        m,
        "Work",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(-13, "weeks").toDate();
      m = e.clone().add(-8, "weeks").toDate();
      g = new OneView.CalendarEventObject(
        "Smile project",
        "Double check the hotel booking",
        "Saxapahaw",
        g,
        m,
        "Work",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(1, "weeks").add(5, "days").add(18, "hours").toDate();
      m = e.clone().add(1, "weeks").add(8, "days").add(22, "hours").toDate();
      g = new OneView.CalendarEventObject(
        "Visit my parents",
        "",
        "Sutton Bonnington",
        g,
        m,
        "Other",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(1, "weeks").add(14, "days").toDate();
      m = e.clone().add(1, "weeks").add(16, "days").toDate();
      g = new OneView.CalendarEventObject(
        "Trip to mountains",
        "Bring tent",
        "",
        g,
        m,
        "Other",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      for (b = 0; 30 > b; b++)
        (g = e
          .clone()
          .add(-15, "weeks")
          .add(2 + 7 * b - 21, "days")
          .add(9, "hours")
          .toDate()),
          (m = e
            .clone()
            .add(-15, "weeks")
            .add(2 + 7 * b - 21, "days")
            .add(9, "hours")
            .add(20, "minutes")
            .toDate()),
          (g = new OneView.CalendarEventObject(
            "Morning briefing",
            "",
            "Work",
            g,
            m,
            "Work",
            this.calendarEvents.length.toString()
          )),
          this.calendarEvents.push(g);
      for (b = 0; 15 > b; b++)
        (g = e
          .clone()
          .add(1, "weeks")
          .add(4 + 7 * b - 21, "days")
          .add(9, "hours")
          .toDate()),
          (m = e
            .clone()
            .add(1, "weeks")
            .add(4 + 7 * b - 21, "days")
            .add(9, "hours")
            .add(20, "minutes")
            .toDate()),
          (g = new OneView.CalendarEventObject(
            "Morning briefing",
            "",
            "Work",
            g,
            m,
            "Work",
            this.calendarEvents.length.toString()
          )),
          this.calendarEvents.push(g);
      g = e.clone().add(1, "weeks").add(-7, "days").toDate();
      m = e.clone().add(1, "weeks").add(0, "days").toDate();
      g = new OneView.CalendarEventObject(
        "Annual wrap-up",
        "Close all ongoing cases",
        "",
        g,
        m,
        "Work",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(-23, "weeks").add(-7, "days").toDate();
      m = e.clone().add(-23, "weeks").add(0, "days").toDate();
      g = new OneView.CalendarEventObject(
        "Annual wrap-up",
        "Close all ongoing cases",
        "",
        g,
        m,
        "Work",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      for (b = 0; 10 > b; b++)
        7 === b && (b += 2),
          (g = d
            .clone()
            .add(-3 + 7 * b, "days")
            .add(7, "hours")
            .add(30, "minutes")
            .toDate()),
          (m = d
            .clone()
            .add(-3 + 7 * b, "days")
            .add(10, "hours")
            .toDate()),
          (g = new OneView.CalendarEventObject(
            "My breakfast-day",
            "Have everything prepared by 7.30",
            "Work",
            g,
            m,
            "Work",
            this.calendarEvents.length.toString()
          )),
          this.calendarEvents.push(g);
      g = e.clone().add(1, "weeks").add(-4, "days").add(11, "hours").toDate();
      m = e.clone().add(1, "weeks").add(-4, "days").add(13, "hours").toDate();
      g = new OneView.CalendarEventObject(
        "Meeting with R.P",
        "Your turn to take the bill",
        "Jackie's Besty Diner",
        g,
        m,
        "Work",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
      g = e.clone().add(1, "weeks").add(3, "days").add(13, "hours").toDate();
      m = e.clone().add(1, "weeks").add(3, "days").add(16, "hours").toDate();
      g = new OneView.CalendarEventObject(
        "Meeting with R.P",
        "Bring the files",
        "Office on Winfall BLVD",
        g,
        m,
        "Work",
        this.calendarEvents.length.toString()
      );
      this.calendarEvents.push(g);
    }
    getCleanRedirectURI() {
      return window.location.protocol + "//" + window.location.host;
    }
    getRRuleObject(a, b) {
      b(void 0);
    }
    getFirstRecurringEvent(a) {
      return this.calendarEvents.filter(function (b) {
        return b.recurringEventId === a.recurringEventId;
      })[0];
    }
    finalizeLoad() {
      var b;
      this.applyCalendarsVisibilitySettings();
      OneView.core.calendarEventHandler.clearAllEvents();
      for (b = 0; b < this.calendarEvents.length; b++)
        OneView.core.getCalendar(this.calendarEvents[b].calendarId)
          .visibility == OneView.VisibilityType.Visible &&
          OneView.core.calendarEventHandler.addEventToCalendar(
            this.calendarEvents[b]
          );
      OneView.core.calendarEventHandler.findCommonTimes();
      OneView.core.loadingHandler.stopLoading();
      this.loadReadyCallback && this.loadReadyCallback();
      OneView.core.redraw(true);
    }
    canEditRecurring(a) {
      return false;
    }
    deleteEvent(b, d, f) {
      if (b.isRecurring && d === a.EventEditType.AllInSeries)
        for (
          d =
            OneView.core.calendarEventHandler.getCalendarEventsByIdAndRecurringId(
              b.recurringEventId
            ),
            b = 0;
          b < d.length;
          b++
        )
          this.removeEventFromFromDemoData(d[b]),
            OneView.core.calendarEventHandler.removeCalendarEvent(d[b]);
      else
        this.removeEventFromFromDemoData(b),
          OneView.core.calendarEventHandler.removeCalendarEvent(b);
      this.saveEventsToCache();
    }
    removeEventFromFromDemoData(a) {
      var b;
      for (b = 0; b < this.calendarEvents.length; b++)
        if (this.calendarEvents[b] === a) {
          this.calendarEvents.splice(b, 1);
          break;
        }
    }
    addNewEvent(b, d) {
      b.id = "" + Math.random();
      this.calendarEvents.push(b);
      OneView.core.calendarEventHandler.addEventToCalendar(b);
      if (void 0 !== b.rruleToSave && null !== b.rruleToSave) {
        var c = b.endDateTime.getTime() - b.startDateTime.getTime();
        b.isRecurring = true;
        for (var e = b.rruleToSave.all(), m = 1; m < e.length; m++) {
          var n = new Date(e[m].getTime() + c),
            n = new OneView.CalendarEventObject(
              b.summary,
              b.description,
              b.location,
              e[m],
              n,
              b.calendarId,
              "" + Math.random()
            );
          n.isRecurring = true;
          n.recurringEventId = b.id;
          this.calendarEvents.push(n);
          OneView.core.calendarEventHandler.addEventToCalendar(n);
        }
      }
      this.saveEventsToCache();
    }
    editExistingEvent(b, d) {
      OneView.core.calendarEventHandler.removeCalendarEvent(b);
      OneView.core.calendarEventHandler.addEventToCalendar(b);
      this.saveEventsToCache();
    }
    saveEventsToCache() {
      this.localStorageSetItem("oneview_demo_verrsion", this.dbVersion);
      this.localStorageSetItem(
        "oneview_demo_saveComplete",
        JSON.stringify(false)
      );
      this.localStorageSetItem(
        "oneview_demo_allEvents",
        JSON.stringify(this.calendarEvents)
      );
      this.localStorageSetItem(
        "oneview_demo_allCalendars",
        JSON.stringify(OneView.core.calendars)
      );
      this.localStorageSetItem(
        "oneview_demo_primaryCalendarId",
        JSON.stringify(OneView.core.calendarPrimaryId)
      );
      this.localStorageSetItem("oneview_demo_demo", JSON.stringify(true));
      this.localStorageSetItem(
        "oneview_demo_saveComplete",
        JSON.stringify(true)
      );
    }
    static getLastSessionWasInDemoMode() {
      var a = localStorage.getItem(
        "oneview_demo_last_session_was_in_demo_mode"
      );
      return null == a || void 0 == a ? true : JSON.parse(a);
    }
    static setLastSessionWasInDemoMode(b) {
      new OneView.LocalStorage().localStorageSetItem(
        "oneview_demo_last_session_was_in_demo_mode",
        JSON.stringify(b)
      );
    }
    loadEventsFromCache() {
      var b = localStorage.getItem("oneview_demo_verrsion"),
        d = localStorage.getItem("oneview_demo_saveComplete"),
        f = localStorage.getItem("oneview_demo_allEvents"),
        g = localStorage.getItem("oneview_demo_allCalendars"),
        m = localStorage.getItem("oneview_demo_primaryCalendarId"),
        n = localStorage.getItem("oneview_demo_demo");
      if (
        b !== this.dbVersion ||
        "true" != d ||
        null == g ||
        void 0 == g ||
        null == f ||
        void 0 == f ||
        null == m ||
        void 0 == m ||
        null == n ||
        void 0 == n
      )
        return false;
      try {
        (OneView.core.calendarPrimaryId = JSON.parse(m)),
          (this.calendarEvents = JSON.parse(f, this.dateTimeReviver)),
          (OneView.core.calendars = JSON.parse(g, this.dateTimeReviver));
      } catch (l) {
        return false;
      }
      return true;
    }
    persistCalendarsVisibilitySettings(b) {
      this.localStorageSetItem(
        "oneview_demo_visibilitySettings",
        JSON.stringify(b)
      );
      this.saveEventsToCache();
      OneView.core.populateCalendars();
    }
    applyCalendarsVisibilitySettings() {
      var b = localStorage.getItem("oneview_demo_visibilitySettings");
      if (null !== b && void 0 !== b)
        for (
          var b = JSON.parse(b, this.dateTimeReviver), d = 0;
          d < OneView.core.calendars.length;
          d++
        )
          for (var f = 0; f < b.length; f++)
            b[f].id == OneView.core.calendars[d].id &&
              (OneView.core.calendars[d].visibility = b[f].newVisibility);
    }
    analyticsEvent (a, b) {};
    analyticsPage (a) {};
    analyticsValue (a, b, d, g) {};
    analyticsTiming (a, b) {};
  }
  // (function (a) {
  //   var p = (function (d) {
  //     function b() {
  //       d.call(this);
  //       this.clientId = "";
  //       this.scopes =
  //         "https://web.archive.org/web/20190808203716/https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar";
  //       this.okEventCounter = this.eventCounter = this.loadingCalendarCounter = 0;
  //       this.access_token = "";
  //       this.enableGoogleLogout =
  //         this.enableGoogleLogin =
  //         this.enableShop =
  //         this.enableMultipleCalendars =
  //         this.enableReload =
  //           false;
  //       this.enableFakeData = true;
  //       this.calendarDataProxyType = a.CalendarDataProxyType.Google;
  //       this.forceReload = this.demoVideoSpecial = false;
  //       this.retryLogin = true;
  //       this.dbVersion = "google0.52";
  //       this.analyticsStarted = false;
  //       -1 < document.URL.indexOf("grimbo") &&
  //         (this.clientId = "411250339629.apps.googleusercontent.com");
  //       -1 < document.URL.indexOf("oneviewcalendar.com") &&
  //         (this.clientId = "411250339629.apps.googleusercontent.com");
  //       if (
  //         -1 < document.URL.indexOf("50888") ||
  //         -1 < document.URL.indexOf("4400")
  //       )
  //         this.clientId =
  //           "411250339629-42jail8mmh7or403q79j6fcjd53n703s.apps.googleusercontent.com";
  //     }
  //     __extends(b, d);
  //     populateCalendarEvents (b) {
  //       var c = this;
  //       this.loadReadyCallback = b;
  //       this.calendarEvents = [];
  //       OneView.core.calendarEventHandler.clearAllEvents();
  //       OneView.core.calendars = [];
  //       OneView.core.calendarPrimaryId = void 0;
  //       OneView.core.commonUserSettings.licenceColorPicker = true;
  //       OneView.core.commonUserSettings.licenceCandyTheme = true;
  //       OneView.core.commonUserSettings.licenceDarkTheme = true;
  //       OneView.core.settings.reloadThemesSettings(OneView.core.commonUserSettings);
  //       a.DemoCalendarDataProxy.setLastSessionWasInDemoMode(false);
  //       try {
  //         this.loadEventsFromCache()
  //           ? ((this.forceReload = false), this.finalizeLoad())
  //           : (this.forceReload = true),
  //           (this.handleAuthResult1 = this.handleAuthResult1.bind(this)),
  //           gapi.auth.authorize(
  //             {
  //               client_id: this.clientId,
  //               scope: this.scopes,
  //               immediate: true,
  //             },
  //             this.handleAuthResult1
  //           );
  //       } catch (f) {
  //         window.setTimeout(function () {
  //           c.populateCalendarEvents(b);
  //         }, 200);
  //       }
  //     };
  //     saveSettings () {
  //       this.saveEventsToCache();
  //     };
  //     logout () {
  //       var b = this,
  //         d = this;
  //       OneView.core.dynamicallyLoadFile("libs/jquery.js", "js", function () {
  //         $.ajax({
  //           type: "GET",
  //           url:
  //             "https://web.archive.org/web/20190808203716/https://accounts.google.com/o/oauth2/revoke?token=" +
  //             b.access_token,
  //           async: false,
  //           contentType: "application/json",
  //           dataType: "jsonp",
  //           success: function (a) {
  //             d.enableGoogleLogin = true;
  //             d.enableGoogleLogout = false;
  //           },
  //           error: function (a) {},
  //         });
  //       });
  //     };
  //     login () {
  //       a.DemoCalendarDataProxy.setLastSessionWasInDemoMode(false);
  //       if (-1 == document.URL.indexOf("oneviewcalendar.com"))
  //         (this.forceReload = true),
  //           (this.handleAuthResult1 = this.handleAuthResult1.bind(this)),
  //           gapi.auth.authorize(
  //             {
  //               client_id: this.clientId,
  //               scope: this.scopes,
  //               immediate: false,
  //             },
  //             this.handleAuthResult1
  //           );
  //       else {
  //         var b =
  //           "https://web.archive.org/web/20190808203716/http://m.oneviewcalendar.com";
  //         -1 != document.URL.indexOf("www.oneviewcalendar.com") &&
  //           (b =
  //             "https://web.archive.org/web/20190808203716/http://www.oneviewcalendar.com");
  //         -1 != document.URL.indexOf("app.oneviewcalendar.com") &&
  //           (b =
  //             "https://web.archive.org/web/20190808203716/http://app.oneviewcalendar.com");
  //         window.location.assign(
  //           "https://web.archive.org/web/20190808203716/https://accounts.google.com/o/oauth2/auth?" +
  //             ("client_id=" +
  //               this.clientId +
  //               "&scope=" +
  //               this.scopes +
  //               "&immediate=false&include_granted_scopes=true&redirect_uri=" +
  //               b +
  //               "&origin=" +
  //               b +
  //               "&response_type=token&authuser=0")
  //         );
  //       }
  //     };
  //     getCleanRedirectURI () {
  //       return window.location.protocol + "//" + window.location.host;
  //     };
  //     handleAuthResult1 (b) {
  //       b && b.status.signed_in
  //         ? ((this.enableGoogleLogin = false),
  //           (this.enableGoogleLogout =
  //             this.enableReload =
  //             this.enableMultipleCalendars =
  //               true),
  //           (this.enableFakeData = false),
  //           (this.access_token = b.access_token),
  //           this.makeApiCall())
  //         : (OneView.core.loadingHandler.stopLoadingWithError(),
  //           true === this.retryLogin
  //             ? ((this.retryLogin = false), this.login())
  //             : (this.clearCache(),
  //               (this.calendarEvents = []),
  //               OneView.core.calendarEventHandler.clearAllEvents(),
  //               OneView.core.redraw(true)),
  //           (this.enableGoogleLogin = true),
  //           (this.enableGoogleLogout =
  //             this.enableReload =
  //             this.enableMultipleCalendars =
  //               false),
  //           (this.enableFakeData = true));
  //     };
  //     reload () {
  //       this.clearCache();
  //       this.calendarEvents = [];
  //       OneView.core.loadingHandler.startLoading();
  //       OneView.core.calendarEventHandler.clearAllEvents();
  //       OneView.core.redraw(true);
  //       this.forceReload = true;
  //       this.makeApiCall();
  //     };
  //     makeApiCall () {
  //       this.doFullRefresh = false;
  //       this.refetchCalendars(this.forceReload);
  //     };
  //     refetchCalendars (b) {
  //       var c = this;
  //       gapi.client.load("calendar", "v3", function () {
  //         var d;
  //         gapi.client.calendar.calendarList.list(void 0).execute(function (e) {
  //           if (e.error && !b) c.refetchCalendars(true);
  //           else {
  //             c.nextSyncTokenCalendars = e.nextSyncToken;
  //             for (d = 0; d < e.items.length; d++) {
  //               var f = true,
  //                 g = false;
  //               "reader" !== e.items[d].accessRole && (f = false);
  //               "owner" === e.items[d].accessRole && (g = true);
  //               e.items[d].primary && (OneView.core.calendarPrimaryId = e.items[d].id);
  //               var l = [];
  //               if (e.items[d].defaultReminders) {
  //                 var h;
  //                 for (h = 0; h < e.items[d].defaultReminders.length; h++)
  //                   l.push(
  //                     new a.Reminder(e.items[d].defaultReminders[h].minutes)
  //                   );
  //               }
  //               h = OneView.VisibilityType.Visible;
  //               0 == e.items[d].selected && (h = OneView.VisibilityType.Hidden);
  //               var k = OneView.core.getCalendar(e.items[d].id);
  //               if (void 0 == k || "NoneZ" == k.id)
  //                 OneView.core.calendars.push(
  //                   new OneView.calendarObject(
  //                     e.items[d].id,
  //                     e.items[d].summary,
  //                     l,
  //                     OneView.core.calendars.length,
  //                     h,
  //                     g,
  //                     !f
  //                   )
  //                 );
  //               else {
  //                 if (e.items[d].deleted) {
  //                   c.refetchCalendars(true);
  //                   return;
  //                 }
  //                 k.name = e.items[d].summary;
  //                 k.defaultReminders = e.items[d].defaultReminders;
  //                 k.visibility = h;
  //                 k.canEditCalendar = g;
  //                 k.canEditCalendarEvents = !f;
  //               }
  //             }
  //             c.refetchCalendarEvents(b);
  //           }
  //         });
  //       });
  //     };
  //     dateFromString (a) {
  //       var b = a.split(/[-T:+]/g),
  //         c = new Date(parseInt(b[0]), parseInt(b[1]) - 1, parseInt(b[2]));
  //       b[5] = b[5].replace("Z", "");
  //       c.setHours(parseInt(b[3]), parseInt(b[4]), parseInt(b[5]));
  //       6 < b.length &&
  //         ((b = 60 * parseInt(b[6]) + Number(b[7])),
  //         (b = 0 + ("-" == (/\d\d-\d\d:\d\d$/.test(a) ? "-" : "+") ? -1 * b : b)),
  //         c.setMinutes(c.getMinutes() - b - c.getTimezoneOffset()));
  //       return c;
  //     };
  //     refetchCalendarEvents (b) {
  //       this.eventsChanged = b;
  //       this.doFullRefresh = false;
  //       b && (this.calendarEvents = []);
  //       this.loadingCalendarCounter = OneView.core.calendars.length;
  //       for (var c = 0; c < OneView.core.calendars.length; c++)
  //         this.getCalendarEvents(OneView.core.calendars[c].id, null, b);
  //     };
  //     getCalendarEvents (b, d, f) {
  //       var c = this;
  //       gapi.client.load("calendar", "v3", function () {
  //         var e = moment()
  //             .add(
  //               -((1 * OneView.core.commonUserSettings.dataAmountToLoad) / 4),
  //               "months"
  //             )
  //             .toDate()
  //             .toISOString(),
  //           g = moment()
  //             .add((3 * OneView.core.commonUserSettings.dataAmountToLoad) / 4, "months")
  //             .toDate()
  //             .toISOString(),
  //           e = {
  //             calendarId: b,
  //             maxResults: 1e3,
  //             singleEvents: true,
  //             showDeleted: !f,
  //             timeMin: e,
  //             timeMax: g,
  //           };
  //         !f &&
  //           OneView.core.getCalendar(b) &&
  //           ((e = {
  //             calendarId: b,
  //             maxResults: 1e3,
  //             singleEvents: true,
  //             showDeleted: true,
  //           }),
  //           (e.syncToken = OneView.core.getCalendar(b).nextSyncTokenEvents));
  //         void 0 !== d && "" != d && (e.pageToken = d);
  //         var l, h;
  //         gapi.client.calendar.events.list(e).execute(function (e) {
  //           e.error && !f && (c.doFullRefresh = true);
  //           c.oneview_was_connected_to_google = true;
  //           moment().add(3, "years").add(-10, "hours").toDate();
  //           d = e.nextPageToken;
  //           if (e.items && 0 < e.items.length)
  //             for (
  //               c.eventsChanged = true, c.eventCounter += e.items.length, l = 0;
  //               l < e.items.length;
  //               l++
  //             )
  //               if (e.items[l].start && e.items[l].end)
  //                 if (
  //                   (c.okEventCounter++,
  //                   OneView.core.getCalendar(b).countEvents++,
  //                   (h = c.RespItemToCalendarEvent(e.items[l], b)),
  //                   f)
  //                 )
  //                   "cancelled" !== e.items[l].status && c.calendarEvents.push(h);
  //                 else {
  //                   var g = c.calendarEvents.filter(function (a) {
  //                     return a.calendarId == b && a.id == e.items[l].id;
  //                   });
  //                   1 == g.length
  //                     ? "cancelled" == e.items[l].status
  //                       ? c.calendarEvents.splice(
  //                           c.calendarEvents.indexOf(g[0]),
  //                           1
  //                         )
  //                       : (c.calendarEvents[c.calendarEvents.indexOf(g[0])] = h)
  //                     : "cancelled" !== e.items[l].status &&
  //                       c.calendarEvents.push(h);
  //                 }
  //           void 0 !== d && "" != d
  //             ? c.getCalendarEvents(b, d, f)
  //             : ((OneView.core.getCalendar(b).nextSyncTokenEvents = e.nextSyncToken),
  //               c.loadingCalendarCounter--,
  //               0 === c.loadingCalendarCounter &&
  //               (c.eventsChanged || c.doFullRefresh)
  //                 ? (OneView.core.helper.sortCalendars(),
  //                   OneView.core.calendarEventHandler.gradeCalendarEvents(
  //                     c.calendarEvents
  //                   ),
  //                   c.calendarEvents.sort(function (a, b) {
  //                     return a.startZOP - b.startZOP;
  //                   }),
  //                   c.saveEventsToCache(),
  //                   c.finalizeLoad())
  //                 : 0 === c.loadingCalendarCounter && c.finalizeLoad());
  //         });
  //       });
  //     };
  //     finalizeLoad () {
  //       var b;
  //       JSON.stringify(OneView.core.calendars);
  //       JSON.stringify(this.calendarEvents);
  //       this.applyCalendarsVisibilitySettings();
  //       OneView.core.calendarEventHandler.clearAllEvents();
  //       if (this.doFullRefresh) this.reload();
  //       else {
  //         for (b = 0; b < this.calendarEvents.length; b++)
  //           OneView.core.getCalendar(this.calendarEvents[b].calendarId).visibility ==
  //             OneView.VisibilityType.Visible &&
  //             OneView.core.calendarEventHandler.addEventToCalendar(
  //               this.calendarEvents[b]
  //             );
  //         OneView.core.calendarEventHandler.findCommonTimes();
  //       }
  //       OneView.core.loadingHandler.stopLoading();
  //       this.loadReadyCallback && this.loadReadyCallback();
  //       OneView.core.redraw(true);
  //     };
  //     canEditRecurring (a) {
  //       return true;
  //     };
  //     getRRuleObject (b, d) {
  //       if (b.isRecurring) {
  //         var c = this;
  //         OneView.core.dynamicallyLoadFile("libs/rrule.js", "js", function () {
  //           var a = b.calendarId,
  //             e;
  //           gapi.client.load("calendar", "v3", function () {
  //             gapi.client.calendar.events
  //               .get({
  //                 calendarId: a,
  //                 eventId: b.recurringEventId,
  //               })
  //               .execute(function (b) {
  //                 b.result &&
  //                   ((b = b.result),
  //                   c.RespItemToCalendarEvent(b, a),
  //                   (b = b.recurrence[0].substr(6)),
  //                   (e = RRule.fromString(b)));
  //                 d(e);
  //               });
  //           });
  //         });
  //       }
  //     };
  //     connectionOk () {
  //       return navigator.onLine;
  //     };
  //     RespItemToCalendarEvent (b, d) {
  //       var c = b.start.dateTime,
  //         e = b.end.dateTime;
  //       void 0 === c
  //         ? (c = moment(b.start.date).toDate())
  //         : ((OneView.core.getCalendar(d).allEventsAreFullDay = false),
  //           (c = OneView.core.helper.addUserTimeZoneSetting(this.dateFromString(c))));
  //       e =
  //         void 0 === e
  //           ? moment(b.end.date).toDate()
  //           : OneView.core.helper.addUserTimeZoneSetting(this.dateFromString(e));
  //       c = new OneView.CalendarEventObject(
  //         b.summary,
  //         b.description,
  //         b.location,
  //         c,
  //         e,
  //         d,
  //         b.id
  //       );
  //       b.recurringEventId &&
  //         ((c.isRecurring = true), (c.recurringEventId = b.recurringEventId));
  //       b.extendedProperties &&
  //         b.extendedProperties["private"] &&
  //         b.extendedProperties["private"].extraColorId &&
  //         (c.extraColorId = b.extendedProperties["private"].extraColorId);
  //       c.reminders = [];
  //       if (b.reminders && b.reminders.useDefault)
  //         for (
  //           var m = OneView.core.getCalendar(d), e = 0;
  //           e < m.defaultReminders.length;
  //           e++
  //         )
  //           c.reminders.push(m.defaultReminders[e]);
  //       if (b.reminders && b.reminders.overrides)
  //         for (e = 0; e < b.reminders.overrides.length; e++)
  //           c.reminders.push(new a.Reminder(b.reminders.overrides[e].minutes));
  //       c.timeZoneName = b.start.timeZone;
  //       return c;
  //     };
  //     deleteEvent (b, d, f) {
  //       void 0 === f && (f = false);
  //       var c = this,
  //         e = b.calendarId;
  //       gapi.client.load("calendar", "v3", function () {
  //         gapi.client.calendar.events
  //           .get({
  //             calendarId: e,
  //             eventId: b.id,
  //           })
  //           .execute(function (f) {
  //             b.isRecurring &&
  //             d !== a.EventEditType.ThisOnly &&
  //             b.recurringEventId
  //               ? d === a.EventEditType.AllInSeries &&
  //                 3 < b.recurringEventId.length &&
  //                 b.recurringEventId &&
  //                 !(3 >= b.recurringEventId.length) &&
  //                 ((f = googleDelete({
  //                   calendarId: e,
  //                   eventId: b.recurringEventId,
  //                 })),
  //                 f.execute(function (a) {
  //                   c.populateCalendarEvents(void 0);
  //                 }))
  //               : !b.id ||
  //                 3 >= b.id.length ||
  //                 ((f = googleDelete({
  //                   calendarId: e,
  //                   eventId: b.id,
  //                 })),
  //                 f.execute(function (a) {
  //                   c.populateCalendarEvents(void 0);
  //                 }));
  //           });
  //       });
  //     };
  //     addNewEvent (a, b) {
  //       void 0 === b && (b = false);
  //       var c = {};
  //       this.syncCalendarEventToResource(a, c, false);
  //       var d = this;
  //       gapi.client.load("calendar", "v3", function () {
  //         gapi.client.calendar.events
  //           .insert({
  //             calendarId: a.calendarId,
  //             resource: c,
  //           })
  //           .execute(function (a) {
  //             d.populateCalendarEvents(void 0);
  //           });
  //       });
  //     };
  //     getFirstRecurringEvent (a) {
  //       return this.calendarEvents.filter(function (b) {
  //         return b.recurringEventId === a.recurringEventId;
  //       })[0];
  //     };
  //     editExistingEvent (b, d) {
  //       var c = this,
  //         e = b.calendarId;
  //       gapi.client.load("calendar", "v3", function () {
  //         gapi.client.calendar.events
  //           .get({
  //             calendarId: e,
  //             eventId: b.id,
  //           })
  //           .execute(function (f) {
  //             if (b.isRecurring && d !== a.EventEditType.ThisOnly) {
  //               if (d === a.EventEditType.AllInSeries) {
  //                 var g = c.RespItemToCalendarEvent(f.result, e),
  //                   l = b.startDateTime.getTime() - g.startDateTime.getTime(),
  //                   h = b.endDateTime.getTime() - g.endDateTime.getTime();
  //                 gapi.client.load("calendar", "v3", function () {
  //                   gapi.client.calendar.events
  //                     .get({
  //                       calendarId: e,
  //                       eventId: b.recurringEventId,
  //                     })
  //                     .execute(function (a) {
  //                       a = a.result;
  //                       var d = c.RespItemToCalendarEvent(a, e);
  //                       d.startDateTime.setTime(g.startDateTime.getTime() + l);
  //                       d.endDateTime.setTime(g.endDateTime.getTime() + h);
  //                       c.syncCalendarEventToResource(d, a, false);
  //                       c.syncCalendarEventToResource(b, a, true);
  //                       c.editExistingEventHelper(b.recurringEventId, a, e);
  //                     });
  //                 });
  //               }
  //               d === a.EventEditType.ThisAndFuture &&
  //                 (gapi.client.load("calendar", "v3", function () {
  //                   gapi.client.calendar.events
  //                     .get({
  //                       calendarId: e,
  //                       eventId: b.recurringEventId,
  //                     })
  //                     .execute(function (d) {
  //                       d = d.result;
  //                       var f = c.RespItemToCalendarEvent(d, e);
  //                       f.endDateTime = OneView.core.calendarDateHandler.addMinutes(
  //                         f.endDateTime,
  //                         -1
  //                       );
  //                       c.syncCalendarEventToResource(b, d, false);
  //                       c.editExistingEventHelper(b.recurringEventId, d, e);
  //                     });
  //                 }),
  //                 c.addNewEvent(b));
  //             } else (f = f.result), c.syncCalendarEventToResource(b, f, false), c.editExistingEventHelper(b.id, f, e);
  //           });
  //       });
  //     };
  //     editExistingEventHelper (b, d, f) {
  //       var c = this;
  //       gapi.client.calendar.events
  //         .update({
  //           calendarId: f,
  //           eventId: b,
  //           resource: d,
  //         })
  //         .execute(function (b) {
  //           c.populateCalendarEvents(void 0);
  //           b.message && (OneView.core.debugtext = b.message);
  //         });
  //     };
  //     syncCalendarEventToResource (b, d, f) {
  //       d.summary = b.summary;
  //       d.description = b.description;
  //       d.location = b.location;
  //       f ||
  //         (OneView.core.calendarEventHandler.isFullDayEvent(b)
  //           ? ((d.start = {
  //               date: moment(b.startDateTime).format("YYYY-MM-DD"),
  //             }),
  //             (d.end = {
  //               date: moment(b.endDateTime).format("YYYY-MM-DD"),
  //             }))
  //           : ((d.start = {
  //               dateTime: moment(
  //                 OneView.core.helper.removeUserTimeZoneSetting(b.startDateTime)
  //               ).format("YYYY-MM-DDTHH:mm:ssZ"),
  //             }),
  //             (d.end = {
  //               dateTime: moment(
  //                 OneView.core.helper.removeUserTimeZoneSetting(b.endDateTime)
  //               ).format("YYYY-MM-DDTHH:mm:ssZ"),
  //             })),
  //         b.timeZoneName &&
  //           ((d.start.timeZone = b.timeZoneName),
  //           (d.end.timeZone = b.timeZoneName)));
  //       b.extraColorId &&
  //         (d.extendedProperties = {
  //           private: {
  //             extraColorId: b.extraColorId,
  //           },
  //         });
  //       d.reminders = {};
  //       d.reminders.useDefault = false;
  //       d.reminders.overrides = [];
  //       if (b.reminders)
  //         for (f = 0; f < b.reminders.length; f++) {
  //           var c = {
  //             method: "popup",
  //           };
  //           c.minutes = b.reminders[f].minutes;
  //           d.reminders.overrides.push(c);
  //         }
  //     };
  //     clearCache () {
  //       this.localStorageSetItem("oneview_verrsion", void 0);
  //       this.localStorageSetItem("oneview_saveComplete", void 0);
  //       this.localStorageSetItem("oneview_allEvents", void 0);
  //       this.localStorageSetItem("oneview_allCalendars", void 0);
  //       this.localStorageSetItem("oneview_primaryCalendarId", void 0);
  //       this.localStorageSetItem("oneview_lastCalendarId", void 0);
  //       this.localStorageSetItem("oneview_nextSyncTokenCalendars", void 0);
  //       this.localStorageSetItem("oneview_google", void 0);
  //       this.localStorageSetItem("oneview_saveComplete", void 0);
  //     };
  //     saveEventsToCache () {
  //       try {
  //         this.localStorageSetItem("oneview_verrsion", this.dbVersion),
  //           this.localStorageSetItem(
  //             "oneview_saveComplete",
  //             JSON.stringify(false)
  //           ),
  //           this.localStorageSetItem(
  //             "oneview_allEvents",
  //             LZString.compress(JSON.stringify(this.calendarEvents))
  //           ),
  //           this.localStorageSetItem(
  //             "oneview_allCalendars",
  //             JSON.stringify(OneView.core.calendars)
  //           ),
  //           this.localStorageSetItem(
  //             "oneview_primaryCalendarId",
  //             JSON.stringify(OneView.core.calendarPrimaryId)
  //           ),
  //           this.localStorageSetItem(
  //             "oneview_nextSyncTokenCalendars",
  //             JSON.stringify(this.nextSyncTokenCalendars)
  //           ),
  //           this.localStorageSetItem("oneview_google", JSON.stringify(true)),
  //           this.localStorageSetItem(
  //             "oneview_saveComplete",
  //             JSON.stringify(true)
  //           );
  //       } catch (c) {}
  //     };
  //     loadEventsFromCache () {
  //       var b = localStorage.getItem("oneview_verrsion"),
  //         d = localStorage.getItem("oneview_saveComplete"),
  //         f = localStorage.getItem("oneview_allEvents"),
  //         g = localStorage.getItem("oneview_allCalendars"),
  //         m = localStorage.getItem("oneview_primaryCalendarId"),
  //         n = localStorage.getItem("oneview_google"),
  //         l = localStorage.getItem("oneview_nextSyncTokenCalendars");
  //       if (
  //         b !== this.dbVersion ||
  //         "true" != d ||
  //         null == g ||
  //         void 0 == g ||
  //         "undefined" == g ||
  //         null == f ||
  //         void 0 == f ||
  //         "undefined" == f ||
  //         null == m ||
  //         void 0 == m ||
  //         "undefined" == m ||
  //         null == n ||
  //         void 0 == n ||
  //         "undefined" == n
  //       )
  //         return false;
  //       try {
  //         (OneView.core.calendarPrimaryId = JSON.parse(m)),
  //           (this.calendarEvents = JSON.parse(
  //             LZString.decompress(f),
  //             this.dateTimeReviver
  //           )),
  //           (OneView.core.calendars = JSON.parse(g, this.dateTimeReviver)),
  //           (this.nextSyncTokenCalendars = l);
  //       } catch (h) {
  //         return false;
  //       }
  //       return true;
  //     };
  //     persistCalendarsVisibilitySettings (a) {
  //       this.localStorageSetItem("oneview_visibilitySettings", JSON.stringify(a));
  //       this.reload();
  //     };
  //     applyCalendarsVisibilitySettings () {
  //       var b = localStorage.getItem("oneview_visibilitySettings");
  //       if (null !== b && void 0 !== b)
  //         for (
  //           var b = JSON.parse(b, this.dateTimeReviver), d = 0;
  //           d < OneView.core.calendars.length;
  //           d++
  //         )
  //           for (var f = 0; f < b.length; f++)
  //             b[f].id == OneView.core.calendars[d].id &&
  //               (OneView.core.calendars[d].visibility = b[f].newVisibility);
  //     };
  //     analyticsInit () {
  //       0 == this.analyticsStarted &&
  //         ((this.analyticsStarted = true),
  //         -1 < document.URL.indexOf("app.oneviewcalendar.com")
  //           ? ga.create("UA-69941766-2", "auto")
  //           : ga.create("UA-69941766-1", "auto"),
  //         ga("send", "pageview"));
  //     };
  //     analyticsEvent (a, b) {
  //       try {
  //         ga &&
  //           (this.analyticsInit(),
  //           ga("send", {
  //             hitType: "event",
  //             eventCategory: a,
  //             eventAction: b,
  //             eventLabel: b,
  //           }));
  //       } catch (f) {}
  //     };
  //     analyticsPage (a) {
  //       try {
  //         ga && (this.analyticsInit(), ga("send", "pageview", "/" + a));
  //       } catch (e) {}
  //     };
  //     analyticsValue (a, b, d, g) {
  //       try {
  //         ga &&
  //           (this.analyticsInit(),
  //           ga("send", {
  //             hitType: "event",
  //             eventCategory: a,
  //             eventAction: b,
  //             eventLabel: d + "=" + g,
  //           }));
  //       } catch (m) {}
  //     };
  //     analyticsTiming (a, b) {
  //       try {
  //         ga &&
  //           (this.analyticsInit(),
  //           ga("send", "timing", {
  //             timingCategory: "Category",
  //             timingVar: a,
  //             timingValue: b,
  //           }));
  //       } catch (f) {}
  //     };
  //     return b;
  //   })(a.LocalStorage);
  //   a.GoogleCalendarDataProxy = p;
  // })(OneView || (OneView = {}));
  // (function (a) {
  //   var p = (function (d) {
  //     function b() {
  //       d.call(this);
  //       this.enableReload = false;
  //       this.enableMultipleCalendars = true;
  //       this.enableGoogleLogout =
  //         this.enableGoogleLogin =
  //         this.enableShop =
  //           false;
  //       this.enableFakeData = true;
  //       this.calendarDataProxyType = a.CalendarDataProxyType.Google;
  //       this.demoVideoSpecial = false;
  //       this.retryLogin = true;
  //       this.dbVersion = "rio0.52";
  //       this.analyticsStarted = false;
  //     }
  //     __extends(b, d);
  //     populateCalendarEvents (b) {
  //       var c = this;
  //       this.loadReadyCallback = b;
  //       this.calendarEvents = [];
  //       OneView.core.calendarEventHandler.clearAllEvents();
  //       OneView.core.calendars = [];
  //       OneView.core.calendarPrimaryId = void 0;
  //       a.DemoCalendarDataProxy.setLastSessionWasInDemoMode(false);
  //       try {
  //         this.loadEventsFromCache() ? this.finalizeLoad() : this.makeApiCall();
  //       } catch (f) {
  //         window.setTimeout(function () {
  //           c.populateCalendarEvents(b);
  //         }, 200);
  //       }
  //     };
  //     saveSettings () {
  //       this.saveEventsToCache();
  //     };
  //     logout () {};
  //     login () {
  //       a.DemoCalendarDataProxy.setLastSessionWasInDemoMode(false);
  //       this.enableGoogleLogin = false;
  //       this.enableReload = this.enableMultipleCalendars = true;
  //       this.enableFakeData = this.enableGoogleLogout = false;
  //       this.makeApiCall();
  //     };
  //     reload () {
  //       this.clearCache();
  //       this.calendarEvents = [];
  //       OneView.core.loadingHandler.startLoading();
  //       OneView.core.calendarEventHandler.clearAllEvents();
  //       OneView.core.redraw(true);
  //       this.makeApiCall();
  //     };
  //     makeApiCall () {
  //       this.loadCalendars();
  //       this.loadEvents();
  //       this.finalizeLoad();
  //     };
  //     finalizeLoad () {
  //       var b;
  //       this.applyCalendarsVisibilitySettings();
  //       OneView.core.calendarEventHandler.clearAllEvents();
  //       for (b = 0; b < this.calendarEvents.length; b++)
  //         OneView.core.getCalendar(this.calendarEvents[b].calendarId).visibility ==
  //           OneView.VisibilityType.Visible &&
  //           OneView.core.calendarEventHandler.addEventToCalendar(
  //             this.calendarEvents[b]
  //           );
  //       OneView.core.calendarEventHandler.findCommonTimes();
  //       OneView.core.loadingHandler.stopLoading();
  //       this.loadReadyCallback && this.loadReadyCallback();
  //       OneView.core.redraw(true);
  //     };
  //     canEditRecurring (a) {
  //       return false;
  //     };
  //     getRRuleObject (a, b) {};
  //     connectionOk () {
  //       return true;
  //     };
  //     deleteEvent (a, b, d) {};
  //     addNewEvent (a, b) {};
  //     getFirstRecurringEvent (a) {
  //       return this.calendarEvents.filter(function (b) {
  //         return b.recurringEventId === a.recurringEventId;
  //       })[0];
  //     };
  //     editExistingEvent (a, b) {};
  //     clearCache () {
  //       this.localStorageSetItem("oneview_verrsion", void 0);
  //       this.localStorageSetItem("oneview_saveComplete", void 0);
  //       this.localStorageSetItem("oneview_allEvents", void 0);
  //       this.localStorageSetItem("oneview_allCalendars", void 0);
  //       this.localStorageSetItem("oneview_primaryCalendarId", void 0);
  //       this.localStorageSetItem("oneview_lastCalendarId", void 0);
  //       this.localStorageSetItem("oneview_nextSyncTokenCalendars", void 0);
  //       this.localStorageSetItem("oneview_google", void 0);
  //       this.localStorageSetItem("oneview_saveComplete", void 0);
  //     };
  //     saveEventsToCache () {
  //       try {
  //         this.localStorageSetItem("oneview_verrsion", this.dbVersion),
  //           this.localStorageSetItem(
  //             "oneview_saveComplete",
  //             JSON.stringify(false)
  //           ),
  //           this.localStorageSetItem(
  //             "oneview_allCalendars",
  //             JSON.stringify(OneView.core.calendars)
  //           ),
  //           this.localStorageSetItem(
  //             "oneview_primaryCalendarId",
  //             JSON.stringify(OneView.core.calendarPrimaryId)
  //           ),
  //           this.localStorageSetItem(
  //             "oneview_nextSyncTokenCalendars",
  //             JSON.stringify(this.nextSyncTokenCalendars)
  //           ),
  //           this.localStorageSetItem("oneview_google", JSON.stringify(true)),
  //           this.localStorageSetItem(
  //             "oneview_saveComplete",
  //             JSON.stringify(true)
  //           );
  //       } catch (c) {}
  //     };
  //     loadEventsFromCache () {
  //       var b = localStorage.getItem("oneview_verrsion"),
  //         d = localStorage.getItem("oneview_saveComplete"),
  //         f = localStorage.getItem("oneview_allCalendars"),
  //         g = localStorage.getItem("oneview_primaryCalendarId"),
  //         m = localStorage.getItem("oneview_google"),
  //         n = localStorage.getItem("oneview_nextSyncTokenCalendars");
  //       if (
  //         b !== this.dbVersion ||
  //         "true" != d ||
  //         null == f ||
  //         void 0 == f ||
  //         "undefined" == f ||
  //         null == g ||
  //         void 0 == g ||
  //         "undefined" == g ||
  //         null == m ||
  //         void 0 == m ||
  //         "undefined" == m
  //       )
  //         return false;
  //       try {
  //         (OneView.core.calendarPrimaryId = JSON.parse(g)),
  //           this.loadEvents(),
  //           (OneView.core.calendars = JSON.parse(f, this.dateTimeReviver)),
  //           (this.nextSyncTokenCalendars = n);
  //       } catch (l) {
  //         return false;
  //       }
  //       return true;
  //     };
  //     loadCalendars () {
  //       OneView.core.calendars = JSON.parse(rioCalendars, this.dateTimeReviver);
  //     };
  //     loadEvents () {
  //       this.calendarEvents = JSON.parse(rioEvents, this.dateTimeReviver);
  //     };
  //     persistCalendarsVisibilitySettings (a) {
  //       this.localStorageSetItem("oneview_visibilitySettings", JSON.stringify(a));
  //       this.reload();
  //     };
  //     applyCalendarsVisibilitySettings () {
  //       var b = localStorage.getItem("oneview_visibilitySettings");
  //       if (null !== b && void 0 !== b)
  //         for (
  //           var b = JSON.parse(b, this.dateTimeReviver), d = 0;
  //           d < OneView.core.calendars.length;
  //           d++
  //         )
  //           for (var f = 0; f < b.length; f++)
  //             b[f].id == OneView.core.calendars[d].id &&
  //               (OneView.core.calendars[d].visibility = b[f].newVisibility);
  //     };
  //     analyticsInit () {
  //       0 == this.analyticsStarted &&
  //         ((this.analyticsStarted = true),
  //         ga.create("UA-69941766-7", "auto"),
  //         ga("send", "pageview"));
  //     };
  //     analyticsEvent (a, b) {
  //       try {
  //         ga &&
  //           (this.analyticsInit(),
  //           ga("send", {
  //             hitType: "event",
  //             eventCategory: a,
  //             eventAction: b,
  //             eventLabel: b,
  //           }));
  //       } catch (f) {}
  //     };
  //     analyticsPage (a) {
  //       try {
  //         ga && (this.analyticsInit(), ga("send", "pageview", "/" + a));
  //       } catch (e) {}
  //     };
  //     analyticsValue (a, b, d, g) {
  //       try {
  //         ga &&
  //           (this.analyticsInit(),
  //           ga("send", {
  //             hitType: "event",
  //             eventCategory: a,
  //             eventAction: b,
  //             eventLabel: d + "=" + g,
  //           }));
  //       } catch (m) {}
  //     };
  //     analyticsTiming (a, b) {
  //       try {
  //         ga &&
  //           (this.analyticsInit(),
  //           ga("send", "timing", {
  //             timingCategory: "Category",
  //             timingVar: a,
  //             timingValue: b,
  //           }));
  //       } catch (f) {}
  //     };
  //     return b;
  //   })(a.LocalStorage);
  //   a.RioCalendarDataProxy = p;
  // })(OneView || (OneView = {}));

  export class ShopControl {
    colorPickerId = "onview.calendar.color.control";
    darkThemeId = "oneview.calendar.theme.dark.1";
    candyThemeId = "oneview.calendar.theme.candy";
    pageHtml =
      '<div id="calendarsTopBar" class="topBar">    <button id="shopBack" class="topBarButton" style="width:50%"><img src="images/arrow-left.svg" class="topBarImage"/></span><span>{#Back#}</span></button>    <button id="emptyButton" class="topBarButton" style="width:50%"></button>    <div id="shopTitle" class="topBarTitle" style="width:100%">{#Shop#}</div></div><div id="shopArea" class="pageContent pageTopPadding">    <div id="darkThemeArea" class="shopItemArea" >        <div class="shopItemAreaLeft" >            <div id="darkThemeTitle" class="shopItemTitle"></div>            <div id="darkThemeDescription" class="shopItemDescription"></div>            <button id="darkThemePrice" class="shopItemButton"> ? </button>        </div>        <div class="shopItemAreaRight">            <img class="shopImage" src="images/darkTheme_mini.png">        </div>    </div>    <div id="candyThemeArea" class="shopItemArea" >        <div class="shopItemAreaLeft" >            <div id="candyThemeTitle" class="shopItemTitle"></div>            <div id="candyThemeDescription" class="shopItemDescription"></div>            <button id="candyThemePrice" class="shopItemButton"> ? </button>        </div>        <div class="shopItemAreaRight">            <img class="shopImage" src="images/candyTheme_mini.png">        </div>    </div>    <div id="colorPickerArea" class="shopItemArea" >        <div class="shopItemAreaLeft" >            <div id="colorPickerTitle" class="shopItemTitle"></div>            <div id="colorPickerDescription" class="shopItemDescription"></div>            <button id="colorPickerPrice" class="shopItemButton"> ? </button>        </div>        <div class="shopItemAreaRight">            <img class="shopImage" src="images/colorPicker_mini.png">        </div>    </div></div>';
    alreadyRegistered = false;
    timestamp: number = 0;

    reloadShopItems() {
      this.text = "ok";
      this.setupColorPicker = this.setupColorPicker.bind(this);
      this.setupDarkTheme = this.setupDarkTheme.bind(this);
      this.setupCandyTheme = this.setupCandyTheme.bind(this);
      window.store.when(this.colorPickerId).updated(this.setupColorPicker);
      window.store.when(this.darkThemeId).updated(this.setupDarkTheme);
      window.store.when(this.candyThemeId).updated(this.setupCandyTheme);
      this.alreadyRegistered ||
        (window.store.register({
          id: this.colorPickerId,
          alias: "Color picker",
          type: "non consumable",
        }),
        window.store.register({
          id: this.darkThemeId,
          alias: "Dark theme",
          type: "non consumable",
        }),
        window.store.register({
          id: this.candyThemeId,
          alias: "Candy theme",
          type: "non consumable",
        }));
      this.alreadyRegistered = true;
      window.store.refresh();
      this.productColorPicker &&
        this.setupItem(this.productColorPicker, "colorPicker");
      this.productCandyTheme &&
        this.setupItem(this.productDarkTheme, "darkTheme");
      this.productCandyTheme &&
        this.setupItem(this.productCandyTheme, "candyTheme");
      document.getElementById("colorPickerTitle").innerHTML = "Color picker";
      document.getElementById("colorPickerDescription").innerHTML =
        "Change calendar colors and event colors. (30 color palette)";
      document.getElementById("darkThemeTitle").innerHTML = "Dark theme";
      document.getElementById("darkThemeDescription").innerHTML =
        "A beautiful theme on a dark background.";
      document.getElementById("candyThemeTitle").innerHTML = "Candy theme";
      document.getElementById("candyThemeDescription").innerHTML =
        "A playful theme in calm pastel colors.";
      OneView.core.domHandler.addClickEvent(
        "colorPickerPrice",
        this.itemClicked,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "darkThemePrice",
        this.itemClicked,
        this
      );
      OneView.core.domHandler.addClickEvent(
        "candyThemePrice",
        this.itemClicked,
        this
      );
    }
    productOk(a) {
      return (
        a.owned ||
        a.downloading ||
        a.downloaded ||
        "downloading" == a.state ||
        "downloaded" == a.state ||
        "approved" == a.state ||
        "finnished" == a.state ||
        "owned" == a.state
      );
    }
    productNotFinished(a) {
      return "approved" == a.state;
    }
    setupColorPicker(b) {
      this.productColorPicker = b;
      this.setupItem(b, "colorPicker");
      this.productOk(b)
        ? (OneView.core.commonUserSettings.licenceColorPicker = true)
        : (OneView.core.commonUserSettings.licenceColorPicker = false);
      this.productNotFinished(b) && b.finish();
    }
    setupDarkTheme(b) {
      this.productDarkTheme = b;
      this.setupItem(b, "darkTheme");
      this.productOk(b)
        ? (OneView.core.commonUserSettings.licenceDarkTheme = true)
        : (OneView.core.commonUserSettings.licenceDarkTheme = false);
      this.productNotFinished(b) && b.finish();
    }
    setupCandyTheme(b) {
      this.productCandyTheme = b;
      this.setupItem(b, "candyTheme");
      this.productOk(b)
        ? (OneView.core.commonUserSettings.licenceCandyTheme = true)
        : (OneView.core.commonUserSettings.licenceCandyTheme = false);
      this.productNotFinished(b) && b.finish();
    }
    setupItem(a, c) {
      document.getElementById(c + "Title").innerHTML = a.alias;
      document.getElementById(c + "Price").innerHTML = a.price;
      a.owned || !a.canPurchase
        ? document
            .getElementById(c + "Price")
            .classList.contains("shopItemButtonInactive") ||
          document
            .getElementById(c + "Price")
            .classList.add("shopItemButtonInactive")
        : document
            .getElementById(c + "Price")
            .classList.contains("shopItemButtonInactive") &&
          document
            .getElementById(c + "Price")
            .classList.remove("shopItemButtonInactive");
    }
    show() {
      OneView.core.domHandler.hideCanvas();
      this.timestamp = OneView.core.getTimeStamp();
      OneView.core.calendarDataProxy.analyticsPage("Shop page");
      this.shopPage = OneView.core.domHandler.pageHtmlFormatHelper(
        "shopPage",
        this.pageHtml
      );
      this.shopPage.style.display = "block";
      OneView.core.domHandler.resizeDomElements();
      OneView.core.domHandler.resizeDomElements();
      OneView.core.domHandler.resizeDomElements =
        OneView.core.domHandler.resizeDomElements.bind(OneView.core.domHandler);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 0);
      window.setTimeout(OneView.core.domHandler.resizeDomElements, 100);
      this.reloadShopItems();
      var b = (OneView.core.settings.titleWidth / OneView.core.ratio - 24) / 2;
      document.getElementById("shopBack").style.padding = b + "px";
      document.getElementById("emptyButton").style.padding =
        OneView.core.settings.titleWidth / OneView.core.ratio / 2 + 1 + "px";
      document.getElementById("shopArea").style.top = "54px";
      OneView.core.showBackButtons()
        ? (OneView.core.domHandler.addClickEvent(
            "shopBack",
            this.shopBack,
            this
          ),
          (document.getElementById("shopTitle").style.display = "none"))
        : ((document.getElementById("shopBack").style.display = "none"),
          (document.getElementById("emptyButton").style.display = "none"));
    }
    hide() {
      OneView.core.appStateHandler.shopControlIsShowing = false;
      window.store.off(this.setupColorPicker);
      window.store.off(this.setupDarkTheme);
      window.store.off(this.setupCandyTheme);
      OneView.core.domHandler.showCanvas();
      OneView.core.domHandler.removeElement(this.shopPage.id);
    }
    reshow() {
      this.show();
    }
    getEventTarget(a) {
      a = a || window.event;
      return a.target || a.srcElement;
    }
    itemClicked(b) {
      b.preventDefault();
      var c = OneView.core.getTimeStamp();
      (this.lastClickTime && this.lastClickTime + 250 > c) ||
        ((this.lastClickTime = c),
        (b = this.getEventTarget(b)),
        "?" != b.innerHTML &&
          (b == document.getElementById("colorPickerPrice") &&
            window.store.order(this.colorPickerId),
          b == document.getElementById("darkThemePrice") &&
            window.store.order(this.darkThemeId),
          b == document.getElementById("candyThemePrice") &&
            window.store.order(this.candyThemeId)));
    }
    shopBack(b) {
      300 > OneView.core.getTimeStamp() - this.timestamp ||
        OneView.core.appStateHandler.back();
    }
  }
  export const EventEditType = {
    "10": "ThisOnly",
    "20": "AllInSeries",
    "30": "ThisAndFuture",
    "40": "None",
    "50": "DontKnow",
    "51": "New",
    ThisOnly: 10,
    AllInSeries: 20,
    ThisAndFuture: 30,
    None: 40,
    DontKnow: 50,
    New: 51,
  };
  export const CalendarDataProxyType = {
    0: "Google",
    1: "Demo",
    2: "Android",
    Google: 0,
    Demo: 1,
    Android: 2,
  };
  export const VisibilityType = {
    10: "Visible",
    20: "Hidden",
    Hidden: 20,
    Visible: 10,
  };
  export const CalendarDateObjectType = {
    0: "Minutes5",
    1: "Hour",
    2: "Day",
    3: "Week",
    4: "Month",
    5: "Year",
    6: "Title",
    Minutes5: 0,
    Hour: 1,
    Day: 2,
    Week: 3,
    Month: 4,
    Year: 5,
    Title: 6,
  };
  export const RRuleFrequencies = {
    0: "Year",
    1: "Month",
    2: "Week",
    3: "Day",
    4: "Hourly",
    5: "Minutely",
    6: "Secondly",
    Day: 3,
    Week: 2,
    Month: 1,
    Year: 0,
    Title: 6,
    Hourly: 4,
    Minutely: 5,
    Secondly: 6,
  };
  export const RRuleWeekDay = {
    "0": "Monday",
    "1": "Tuesday",
    "2": "Wednesday",
    "3": "Thursday",
    "4": "Friday",
    "5": "Saturday",
    "6": "Sunday",
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };
}
/*
     FILE ARCHIVED ON 20:37:16 Aug 08, 2019 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:12:38 Aug 05, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 60.412
  exclusion.robots: 0.089
  exclusion.robots.policy: 0.08
  RedisCDXSource: 0.613
  esindex: 0.008
  LoadShardBlock: 35.527 (3)
  PetaboxLoader3.datanode: 123.027 (5)
  load_resource: 1000.749 (2)
  PetaboxLoader3.resolve: 267.062 (2)
*/

// type OV = {
//   core: typeof Core;
//   LocalStorage: typeof LocalStorage;
//   CommonUserSettings: typeof CommonUserSettings;
//   DrawArea: typeof DrawArea;
//   CalendarDataProxyType: {
//     0: "Google";
//     1: "Demo";
//     2: "Android";
//     Google: 0;
//     Demo: 1;
//     Android: 2;
//   };
//   DrawAreaEffects: typeof DrawAreaEffects;
//   CalendarsControl: typeof CalendarsControl;
//   CalendarVisibilitySetting: typeof CalendarVisibilitySetting;
//   SettingsControl: typeof SettingsControl;
//   MainMenuControl: typeof MainMenuControl;
//   AddButtonControl: typeof AddButtonControl;
//   PopupMenuControl_Base: typeof PopupMenuControl_Base;
//   MenuItemInfo: typeof MenuItemInfo;
//   EditEventControl: typeof EditEventControl;
//   EditRecurrenceControl: typeof EditRecurrenceControl;
//   ViewEventControl: typeof ViewEventControl;
//   Helper: typeof Helper;
//   DomHandler: typeof DomHandler;
//   LoadingHandler: typeof LoadingHandler;
//   AppStateHandler: typeof AppStateHandler;
//   CalendarDateHandler: typeof CalendarDateHandler;
//   CalendarEventHandler: typeof CalendarEventHandler;
//   DateTimeSelectionHandler: typeof DateTimeSelectionHandler;
//   EventHandler: typeof EventHandler;
//   ZopHandler: typeof ZopHandler;
//   SpeedCache: typeof SpeedCache;
//   Hashtable: typeof Hashtable;
//   CalendarEventObject: typeof CalendarEventObject;
//   CalendarObject: typeof CalendarObject;
//   CalendarDateObject: typeof CalendarDateObject;
//   PossibleEventTagsAtThisZoomLevel: typeof PossibleEventTagsAtThisZoomLevel;
//   Reminder: typeof Reminder;
//   CalendarEventTagGroup: typeof CalendarEventTagGroup;
//   CalendarFullEventWrapper: typeof CalendarFullEventWrapper;
//   CalendarEventTagWrapper: typeof CalendarEventTagWrapper;
//   NumberStringPair: typeof NumberStringPair;
//   NumberPair: typeof NumberPair;
//   TagDataToPaint: typeof TagDataToPaint;
//   TagSurface: typeof TagSurface;
//   OccupiedSpaceObject: typeof OccupiedSpaceObject;
//   Badge: typeof Badge;
//   OriginalColorTheme: typeof OriginalColorTheme;
//   Settings: typeof Settings;
//   MaterialColorTheme: typeof MaterialColorTheme;
//   FreeTheme: typeof FreeTheme;
//   DarkTheme: typeof DarkTheme;
//   CandyTheme: typeof CandyTheme;
//   Core: typeof Core;
//   Translate: typeof Translate;
//   Dictionary: typeof Dictionary;
//   CanvasHorizontalCacheObject: typeof CanvasHorizontalCacheObject;
//   ZopDrawArea: typeof ZopDrawArea;
//   ShopControl: typeof ShopControl;
//   EventEditType: {
//     "10": "ThisOnly";
//     "20": "AllInSeries";
//     "30": "ThisAndFuture";
//     "40": "None";
//     "50": "DontKnow";
//     "51": "New";
//     ThisOnly: 10;
//     AllInSeries: 20;
//     ThisAndFuture: 30;
//     None: 40;
//     DontKnow: 50;
//     New: 51;
//   };
//   VisibilityType: {
//     10: "Visible";
//     20: "Hidden";
//     Hidden: 20;
//     Visible: 10;
//   };
//   CalendarDateObjectType: {
//     "0": "Minutes5";
//     "1": "Hour";
//     "2": "Day";
//     "3": "Week";
//     "4": "Month";
//     "5": "Year";
//     "6": "Title";
//     "10": "ThisOnly";
//     "20": "AllInSeries";
//     "30": "ThisAndFuture";
//     "40": "None";
//     "50": "DontKnow";
//     "51": "New";
//     ThisOnly: 10;
//     AllInSeries: 20;
//     ThisAndFuture: 30;
//     None: 40;
//     DontKnow: 50;
//     New: 51;
//     Minutes5: 0;
//     Hour: 1;
//     Day: 2;
//     Week: 3;
//     Month: 4;
//     Year: 5;
//     Title: 6;
//   };
//   RRuleFrequencies: {
//     "0": "Year";
//     "1": "Month";
//     "2": "Week";
//     "3": "Day";
//     "4": "Hourly";
//     "5": "Minutely";
//     "6": "Secondly";
//     "10": "ThisOnly";
//     "20": "AllInSeries";
//     "30": "ThisAndFuture";
//     "40": "None";
//     "50": "DontKnow";
//     "51": "New";
//     ThisOnly: 10;
//     AllInSeries: 20;
//     ThisAndFuture: 30;
//     None: 40;
//     DontKnow: 50;
//     New: 51;
//     Minutes5: 0;
//     Hour: 1;
//     Day: 3;
//     Week: 2;
//     Month: 1;
//     Year: 0;
//     Title: 6;
//     Hourly: 4;
//     Minutely: 5;
//     Secondly: 6;
//   };
//   RRuleWeekDay: {
//     "0": "Monday";
//     "1": "Tuesday";
//     "2": "Wednesday";
//     "3": "Thursday";
//     "4": "Friday";
//     "5": "Saturday";
//     "6": "Sunday";
//     "10": "ThisOnly";
//     "20": "AllInSeries";
//     "30": "ThisAndFuture";
//     "40": "None";
//     "50": "DontKnow";
//     "51": "New";
//     ThisOnly: 10;
//     AllInSeries: 20;
//     ThisAndFuture: 30;
//     None: 40;
//     DontKnow: 50;
//     New: 51;
//     Minutes5: 0;
//     Hour: 1;
//     Day: 3;
//     Week: 2;
//     Month: 1;
//     Year: 0;
//     Title: 6;
//     Hourly: 4;
//     Minutely: 5;
//     Secondly: 6;
//     Monday: 0;
//     Tuesday: 1;
//     Wednesday: 2;
//     Thursday: 3;
//     Friday: 4;
//     Saturday: 5;
//     Sunday: 6;
//   };
// };

// const OneView: OV = {
//   LocalStorage,
//   CommonUserSettings,
//   DrawArea,
//   DrawAreaEffects,
//   CalendarsControl,
//   CalendarVisibilitySetting,
//   SettingsControl,
//   MainMenuControl,
//   AddButtonControl,
//   PopupMenuControl_Base,
//   MenuItemInfo,
//   EditEventControl,
//   EditRecurrenceControl,
//   ViewEventControl,
//   Helper,
//   DomHandler,
//   LoadingHandler,
//   AppStateHandler,
//   CalendarDateHandler,
//   CalendarEventHandler,
//   DateTimeSelectionHandler,
//   EventHandler,
//   ZopHandler,
//   SpeedCache,
//   Hashtable,
//   CalendarEventObject,
//   CalendarObject,
//   CalendarDateObject,
//   PossibleEventTagsAtThisZoomLevel,
//   Reminder,
//   CalendarEventTagGroup,
//   CalendarFullEventWrapper,
//   CalendarEventTagWrapper,
//   NumberStringPair,
//   NumberPair,
//   TagDataToPaint,
//   TagSurface,
//   OccupiedSpaceObject,
//   Badge,
//   OriginalColorTheme,
//   Settings,
//   MaterialColorTheme,
//   FreeTheme,
//   DarkTheme,
//   CandyTheme,
//   Core,
//   Translate,
//   Dictionary,
//   CanvasHorizontalCacheObject,
//   ZopDrawArea,
//   ShopControl,
//
// };
