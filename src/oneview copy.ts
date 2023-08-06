var __extends =
    (this && this.__extends) ||
    function (a, p) {
      function d() {
        this.constructor = a;
      }
      for (var b in p) p.hasOwnProperty(b) && (a[b] = p[b]);
      a.prototype =
        null === p ? Object.create(p) : ((d.prototype = p.prototype), new d());
    },
  oneview9;

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

const OneView: any = {};

// LocalStorage class
class LocalStorage {
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
OneView.LocalStorage = LocalStorage
class CommonUserSettings extends LocalStorage {
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
    a.Translate.languageExists(b) || (b = "-");
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
      var b = JSON.stringify(new a.Dictionary());
      this.cachedSavedCalendarColors = new a.Dictionary();
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
OneView.CommonUserSettings = CommonUserSettings
class DrawArea {
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
    OneView.core.zopDrawArea.canvasContext.drawImage(b, d, n, f, g, c, e, f, g);
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
OneView.DrawArea = DrawArea

OneView.CalendarDataProxyType = {
  0: "Google",
  1: "Demo",
  2: "Android",
  Google: 0,
  Demo: 1,
  Android: 2,
};

class DrawAreaEffects {
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
      this.azGoalTopZOP > a.core.zopHandler.topZOP
        ? this.azTopZOPSpeed / 2e3
        : this.azTopZOPSpeed / 20;
    this.azBottomZOPSpeed_Linear =
      this.azGoalBottomZOP < a.core.zopHandler.bottomZOP
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
      (this.azGoalTopZOP - OneView.core.zopHandler.topZOP) / this.speedModifier
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
      this.speedSlowDown = (c * OneView.core.zopHandler.maxScrollSpeed) / 2200;
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

OneView.DrawAreaEffects = DrawAreaEffects;

(function (a) {
  var p = (function () {
    function b() {
      this.pageHtml =
        '<div id="noColorPickerWindow" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItem" style="text-align:center">{#Color picker?#}</div>    <div>        <button id="gotoShopCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>        <button id="gotoShopOk" class="topBarButton" style="width:50%"><img src="images/shop.svg" class="topBarImage"/><span>{#Shop#}</span></button>    </div></div></div></div><div id="calendarsTopBar" class="topBar">    <button id="calendarsBack" class="topBarButton" style="width:50%"><img src="images/arrow-left.svg" class="topBarImage"/></span><span>{#Back#}</span></button>    <button id="emptyButton" class="topBarButton" style="width:50%"></button>    <div id="calendarsTitle" class="topBarTitle" style="width:100%">{#Calendars#}</div></div><div id="calendarsArea" class="pageContent">    <ul class="calendarsPopupList" id="calendarsPopupList"></ul></div>';
      this.visibilitySettings = [];
    }
    b.prototype.show = function () {
      a.core.domHandler.hideCanvas();
      this.timestamp = a.core.getTimeStamp();
      a.core.calendarDataProxy.analyticsPage("Calendars page");
      this.calendarsPage = a.core.domHandler.pageHtmlFormatHelper(
        "calendarsPage",
        this.pageHtml
      );
      this.calendarsPage.style.display = "block";
      a.core.domHandler.resizeDomElements();
      a.core.domHandler.resizeDomElements();
      a.core.domHandler.resizeDomElements =
        a.core.domHandler.resizeDomElements.bind(a.core.domHandler);
      window.setTimeout(a.core.domHandler.resizeDomElements, 0);
      window.setTimeout(a.core.domHandler.resizeDomElements, 100);
      var b = (a.core.settings.titleWidth / a.core.ratio - 24) / 2;
      document.getElementById("calendarsBack").style.padding = b + "px";
      document.getElementById("emptyButton").style.padding =
        a.core.settings.titleWidth / a.core.ratio / 2 + 1 + "px";
      document.getElementById("calendarsArea").style.top = "54px";
      a.core.showBackButtons()
        ? (a.core.domHandler.addClickEvent(
            "calendarsBack",
            this.calendarsBack,
            this
          ),
          (document.getElementById("calendarsTitle").style.display = "none"))
        : ((document.getElementById("calendarsBack").style.display = "none"),
          (document.getElementById("emptyButton").style.display = "none"));
      this.visibilitySettings = [];
      for (b = 0; b < a.core.calendars.length; b++)
        this.visibilitySettings.push(
          new d(a.core.calendars[b].id, a.core.calendars[b].visibility)
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
      for (b = 0; b < a.core.calendars.length; b++) {
        var f = document.createElement("li"),
          g = document.createTextNode(a.core.calendars[b].name),
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
        l.style.maxWidth = a.core.domHandler.screenWidthForDOM - 130 + "px";
        l.appendChild(g);
        f.appendChild(l);
        this.spanElements.push(l);
        this.colorBoxElements.push(m);
        m.className = "colorBox";
        m.id = "colorBox" + b;
        m.style.cssFloat = "right";
        f.appendChild(m);
        this.styleBasedOnVisibility(f, n, m, a.core.calendars[b], null);
        if (a.core.commonUserSettings.licenceColorPicker) {
          g = document.createElement("div");
          g.id = "colorPicker" + b;
          f.appendChild(g);
          n = new Piklor();
          n.init(
            g,
            a.core.settings.theme.eventColors,
            {
              open: m,
              closeOnBlur: false,
            },
            "" + b
          );
          var h = this;
          n.colorChosen(function (b, c) {
            var e = +c,
              f = a.core.settings.theme.eventColors.indexOf(b);
            document.getElementById("colorBox" + e);
            var g = a.core.commonUserSettings.savedCalendarColors;
            a.core.commonUserSettings.savedCalendarColors.containsKey(
              a.core.calendars[e].id
            )
              ? (g[a.core.calendars[e].id] = f)
              : g.add(a.core.calendars[e].id, f);
            a.core.commonUserSettings.savedCalendarColors = g;
            a.core.calendars[e].colorId = f;
            a.core.calendars[e].visibility = a.VisibilityType.Visible;
            a.core.calendarDataProxy.saveSettings();
            h.styleBasedOnVisibility(
              h.liElements[e],
              h.checkBoxElements[e],
              h.colorBoxElements[e],
              a.core.calendars[e],
              null
            );
          });
        } else
          (this.showNoColorPickerWindow =
            this.showNoColorPickerWindow.bind(this)),
            m.addEventListener("click", this.showNoColorPickerWindow, false);
        f.id = "calendarsPopupList" + b;
        e.appendChild(f);
        a.core.domHandler.addClickEvent(f.id, this.calendarClicked, this);
      }
    };
    b.prototype.showNoColorPickerWindow = function () {
      document.getElementById("noColorPickerWindow").style.display = "table";
      a.core.domHandler.addClickEvent("gotoShopOk", this.gotoShop, this);
      a.core.domHandler.addClickEvent(
        "gotoShopCancel",
        this.hideNoColorPickerWindow,
        this
      );
    };
    b.prototype.hideNoColorPickerWindow = function () {
      document.getElementById("noColorPickerWindow").style.display = "none";
    };
    b.prototype.gotoShop = function () {
      a.core.appStateHandler.viewShop();
    };
    b.prototype.hide = function () {
      a.core.appStateHandler.calendarsControlIsShowing = false;
      for (var b = 0; b < a.core.calendars.length; b++)
        this.visibilitySettings[b].newVisibility =
          a.core.calendars[b].visibility;
      a.core.calendarDataProxy.persistCalendarsVisibilitySettings(
        this.visibilitySettings
      );
      a.core.domHandler.showCanvas();
      a.core.domHandler.removeElement(this.calendarsPage.id);
    };
    b.prototype.reshow = function () {
      this.show();
    };
    b.prototype.styleBasedOnVisibility = function (b, e, f, g, d) {
      b.style.backgroundColor = a.core.settings.theme.colorBackground;
      d = a.core.helper.getEventColor(d, g);
      f.style.backgroundColor = d;
      f.style.borderColor = d;
      g.visibility == a.VisibilityType.Visible
        ? ((e.src = "images/checkbox-checked.svg"),
          (b.style.color = a.core.settings.theme.colorHorizontalTitle))
        : ((e.src = "images/checkbox-unchecked.svg"),
          (b.style.color = a.core.helper.colorToRGBA(
            a.core.settings.theme.colorHorizontalTitle,
            0.5
          )));
    };
    b.prototype.getEventTarget = function (a) {
      a = a || window.event;
      return a.target || a.srcElement;
    };
    b.prototype.calendarClicked = function (b) {
      b.preventDefault();
      var c = a.core.getTimeStamp();
      (this.lastClickTime && this.lastClickTime + 250 > c) ||
        ((this.lastClickTime = c),
        (b = this.getEventTarget(b)),
        (c = this.liElements.indexOf(b)),
        0 > c && (c = this.checkBoxElements.indexOf(b)),
        0 <= c &&
          ((a.core.calendars[c].visibility =
            a.core.calendars[c].visibility == a.VisibilityType.Visible
              ? a.VisibilityType.Hidden
              : a.VisibilityType.Visible),
          this.styleBasedOnVisibility(
            this.liElements[c],
            this.checkBoxElements[c],
            this.colorBoxElements[c],
            a.core.calendars[c],
            null
          )));
    };
    b.prototype.calendarsBack = function (b) {
      300 > a.core.getTimeStamp() - this.timestamp ||
        a.core.appStateHandler.back();
    };
    return b;
  })();
  a.CalendarsControl = p;
  var d = (function () {
    return function (a, c) {
      this.id = a;
      this.oldVisibility = c;
    };
  })();
  a.CalendarVisibilitySetting = d;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
      this.pageHtml =
        '<div id="noThemesWindow" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItem" style="text-align:center">{#More themes?#}</div>    <div>        <button id="gotoShopCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>        <button id="gotoShopOk" class="topBarButton" style="width:50%"><img src="images/shop.svg" class="topBarImage"/><span>{#Shop#}</span></button>    </div></div></div></div><div id="settingsTopBar" class="topBar">    <button id="settingsBack" class="topBarButton" style="width:50%"><img src="images/arrow-left.svg" class="topBarImage"/></span><span>{#Back#}</span></button>    <button id="emptyButton" class="topBarButton" style="width:50%"></button>    <div id="settingsTitle" class="topBarTitle" style="width:100%">{#Settings#}</div></div><div id="settingsArea" class="pageContent pageTopPadding" style="float:left; background-color: #E9E9E9;">    <div class="miniTitle sizedTitle" id="themeTitle">{#Theme#}</div>        <div style="position: relative"><div class="inputBox"><select id="settingsTheme" class="base inputBase" ></select></div>    </div>        <div class="miniTitle sizedTitle" id="timezoneTitle">{#Time zone#}</div>            <div style="position: relative"><div class="inputBox"><select id="settingsTimeZone" class="base inputBase" >                <option class="inputOption" value="-">{#Auto#}</option>                <option class="inputOption" value="-12">-12</option>                <option class="inputOption" value="-11">-11</option>                <option class="inputOption" value="-10">-10</option>                <option class="inputOption" value="-9.5">-9:30</option>                <option class="inputOption" value="-9">-9</option>                <option class="inputOption" value="-8">-8</option>                <option class="inputOption" value="-7">-7</option>                <option class="inputOption" value="-6">-6</option>                <option class="inputOption" value="-5">-5</option>                <option class="inputOption" value="-4">-4</option>                <option class="inputOption" value="-3.5">-3:30</option>                <option class="inputOption" value="-3">-3</option>                <option class="inputOption" value="-2">-2</option>                <option class="inputOption" value="-1">-1</option>                <option class="inputOption" value="0" >0</option>                <option class="inputOption" value="+1">+1</option>                <option class="inputOption" value="+2">+2</option>                <option class="inputOption" value="+3">+3</option>                <option class="inputOption" value="+3.5">+3:30</option>                <option class="inputOption" value="+4">+4</option>                <option class="inputOption" value="+4.5">+4:30</option>                <option class="inputOption" value="+5">+5</option>                <option class="inputOption" value="+5.5">+5:30</option>                <option class="inputOption" value="+5.75">+5:45</option>                <option class="inputOption" value="+6">+6</option>                <option class="inputOption" value="+6.5">+6:30</option>                <option class="inputOption" value="+7">+7</option>                <option class="inputOption" value="+8">+8</option>                <option class="inputOption" value="+8.5">+8:30</option>                <option class="inputOption" value="+8.75">+8:45</option>                <option class="inputOption" value="+9">+9</option>                <option class="inputOption" value="+9.5">+9:30</option>                <option class="inputOption" value="+10">+10</option>                <option class="inputOption" value="+10.5">+10:30</option>                <option class="inputOption" value="+11">+11</option>                <option class="inputOption" value="+12">+12</option>                <option class="inputOption" value="+12.75">+12:45</option>                <option class="inputOption" value="+13">+13</option>                <option class="inputOption" value="+14">+14</option>            </select></div></div>        <div class="miniTitle sizedTitle" id="firstDayTitle">{#First day of week#}</div>            <div style="position: relative"><div class="inputBox"><select id="settingsFirstDay" class="base inputBase" >            </select></div></div>    <div class="miniTitle sizedTitle">{#Show week numbers#}</div>    <div style="position: relative"><div class="inputBox transparent"><input id="checkBoxShowWeeks" type="checkbox" class="base inputBase inputCheckBox"></input></div></div>    <div class="miniTitle sizedTitle">{#Use 24-hour format#}</div>    <div style="position: relative"><div class="inputBox transparent"><input id="checkBox24h" type="checkbox" class="base inputBase inputCheckBox"></input></div></div>    <div class="miniTitle sizedTitle" id="grayDaysTitle">{#Gray days#}</div>        <div style="position: relative"><div class="inputBox"><select id="settingsGrayDays" class="base inputBase maybeBig" multiple="multiple"></select></div>    </div>    <div class="miniTitle sizedTitle" id="languageTitle">{#Language#}</div>        <div style="position: relative"><div class="inputBox"><select id="settingsLanguage" class="base inputBase" ></select></div>    </div>    <div class="miniTitle sizedTitle" id="daatAmountTitle">{#Data amount (startup speed)#}</div>        <div style="position: relative"><div class="inputBox"><select id="settingsDataAmount" class="base inputBase" >            <option class="inputOption" value="4800">{#All#}</option>            <option class="inputOption" value="48">{#4 Years#}</option>            <option class="inputOption" value="4">{#4 months#}</option>        </select></div>     </div></div>';
      this.visibilitySettings = [];
    }
    d.prototype.show = function () {
      a.core.domHandler.hideCanvas();
      a.core.calendarDataProxy.analyticsPage("Settings page");
      this.timestamp = a.core.getTimeStamp();
      this.settingsPage = a.core.domHandler.pageHtmlFormatHelper(
        "settingsPage",
        this.pageHtml
      );
      this.settingsPage.style.display = "block";
      a.core.domHandler.resizeDomElements();
      a.core.domHandler.resizeDomElements();
      a.core.domHandler.resizeDomElements =
        a.core.domHandler.resizeDomElements.bind(a.core.domHandler);
      window.setTimeout(a.core.domHandler.resizeDomElements, 0);
      window.setTimeout(a.core.domHandler.resizeDomElements, 100);
      var b = (a.core.settings.titleWidth / a.core.ratio - 24) / 2;
      document.getElementById("settingsBack").style.padding = b + "px";
      document.getElementById("emptyButton").style.padding =
        a.core.settings.titleWidth / a.core.ratio / 2 + 1 + "px";
      document.getElementById("settingsArea").style.top = "54px";
      a.core.showBackButtons()
        ? (a.core.domHandler.addClickEvent(
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
      a.core.domHandler.addWeekDaysToSelectNode(this.firstDaySelectElement);
      a.core.domHandler.addWeekDaysToSelectNode(this.grayDaysSelectElement);
      this.showWeekCheckBox.checked = a.core.commonUserSettings.showWeekNumbers;
      this.use24hCheckBox.checked = a.core.commonUserSettings.use24hFormat;
      this.timeZoneSelectElement.value =
        a.core.commonUserSettings.timeZoneForSettingsPage;
      a.Translate.languageExists(moment.locale()) ||
        ((b = new Option(
          "-",
          a.core.translate.get("Auto(partially English)"),
          false,
          false
        )),
        (b.className = "inputOption"),
        this.languageSelectElement.appendChild(b));
      for (var c = 0; c < a.core.translate.languages.keys().length; c++)
        (b = new Option(
          a.core.translate.languages.values()[c],
          a.core.translate.languages.keys()[c],
          false,
          false
        )),
          (b.className = "inputOption"),
          this.languageSelectElement.appendChild(b);
      this.languageSelectElement.value =
        a.core.commonUserSettings.language.toString();
      for (c = 0; c < a.core.settings.themes.keys().length; c++)
        (b = new Option(
          a.core.translate.get(a.core.settings.themes.values()[c].themeName),
          a.core.settings.themes.keys()[c],
          false,
          false
        )),
          (b.className = "inputOption"),
          this.themeSelectElement.appendChild(b);
      this.themeSelectElement.value =
        a.core.commonUserSettings.theme.toString();
      1 == a.core.settings.themes.keys().length &&
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
        a.core.commonUserSettings.dataAmountToLoad.toString();
      a.core.domHandler.selectWeekDays(
        this.firstDaySelectElement,
        "" + a.core.commonUserSettings.firstDayOfWeek
      );
      a.core.domHandler.selectWeekDays(
        this.grayDaysSelectElement,
        "" + a.core.commonUserSettings.grayDays
      );
    };
    d.prototype.preventOptions = function (a) {
      a.preventDefault();
      this.themeSelectElement.blur();
      window.focus();
      this.showNoThemesWindow();
    };
    d.prototype.showNoThemesWindow = function () {
      document.getElementById("noThemesWindow").style.display = "table";
      a.core.domHandler.addClickEvent("gotoShopOk", this.gotoShop, this);
      a.core.domHandler.addClickEvent(
        "gotoShopCancel",
        this.hideNoThemesWindow,
        this
      );
    };
    d.prototype.hideNoThemesWindow = function () {
      document.getElementById("noThemesWindow").style.display = "none";
    };
    d.prototype.gotoShop = function () {
      a.core.appStateHandler.viewShop();
    };
    d.prototype.hide = function () {
      var b = false;
      a.core.appStateHandler.settingsControlIsShowing = false;
      a.core.commonUserSettings.showWeekNumbers = this.showWeekCheckBox.checked;
      a.core.commonUserSettings.use24hFormat != this.use24hCheckBox.checked &&
        ((a.core.commonUserSettings.use24hFormat = this.use24hCheckBox.checked),
        a.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Use 24h",
          1 == a.core.commonUserSettings.use24hFormat ? 1 : 0
        ),
        (b = true));
      a.core.commonUserSettings.timeZoneForSettingsPage !=
        this.timeZoneSelectElement.value &&
        ((a.core.commonUserSettings.timeZoneForSettingsPage =
          this.timeZoneSelectElement.value),
        a.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Time zone",
          a.core.helper.getNumberFromString(
            a.core.commonUserSettings.timeZoneForSettingsPage,
            1e3
          )
        ),
        (b = true));
      a.core.commonUserSettings.dataAmountToLoad.toString() !=
        this.dataAmountSelectElement.value &&
        ((a.core.commonUserSettings.dataAmountToLoad = Number(
          this.dataAmountSelectElement.value
        )),
        a.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Data amount to load",
          a.core.commonUserSettings.dataAmountToLoad
        ),
        (b = true));
      a.core.commonUserSettings.firstDayOfWeek + "" !=
        a.core.domHandler.getSelectOptions(this.firstDaySelectElement) &&
        ((a.core.commonUserSettings.firstDayOfWeek = Number(
          a.core.domHandler.getSelectOptions(this.firstDaySelectElement)
        )),
        a.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "First Day Of Week",
          a.core.commonUserSettings.firstDayOfWeek
        ),
        a.core.calendarDateHandler.clearWeekInfo());
      a.core.commonUserSettings.grayDays + "" !=
        a.core.domHandler.getSelectOptions(this.grayDaysSelectElement) &&
        ((a.core.commonUserSettings.grayDays =
          a.core.domHandler.getSelectOptions(this.grayDaysSelectElement)),
        a.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Gray days",
          a.core.helper.getNumberFromString(
            a.core.commonUserSettings.grayDays,
            1e3
          )
        ),
        a.core.calendarDateHandler.clearWeekInfo());
      a.core.commonUserSettings.language.toString() !==
        this.languageSelectElement.value &&
        ((a.core.commonUserSettings.language =
          this.languageSelectElement.value),
        a.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Language " + this.languageSelectElement.value,
          1
        ),
        a.core.reopenApp(),
        (b = true));
      a.core.commonUserSettings.theme.toString() !==
        this.themeSelectElement.value &&
        ((a.core.commonUserSettings.theme = this.themeSelectElement.value),
        a.core.calendarDataProxy.analyticsValue(
          "Value",
          "Settings",
          "Theme " + this.themeSelectElement.value,
          1
        ),
        a.core.settings.reloadTheme(),
        a.core.reopenApp(),
        (b = true));
      a.core.domHandler.showCanvas();
      a.core.domHandler.removeElement(this.settingsPage.id);
      b && a.core.reloadAllCalendarData();
    };
    d.prototype.reshow = function () {
      this.show();
    };
    d.prototype.getEventTarget = function (a) {
      a = a || window.event;
      return a.target || a.srcElement;
    };
    d.prototype.settingsBack = function (b) {
      300 > a.core.getTimeStamp() - this.timestamp ||
        a.core.appStateHandler.back();
    };
    return d;
  })();
  a.SettingsControl = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function b() {
      this.nudgeBecauseMenuBeingDragged = 0;
      this.menuItems = [];
      this.transparency = -1;
      this.animationDuration = 600;
      this.lastDragDirection = this.currentMaxRight = 0;
      this.movingMenuWidth = a.core.settings.titleWidth;
    }
    b.prototype.resetDrawAreaSize = function (b, e) {
      this.movingMenuWidth = a.core.settings.titleWidth;
    };
    b.prototype.reshow = function () {
      this.safeBack();
    };
    b.prototype.show = function () {
      this.menuItemLogin = new d(
        a.core.translate.get("Connect Google calendar"),
        a.core.charCodeLogin
      );
      this.menuItemFake = new d(
        a.core.translate.get("Show demo calendar"),
        a.core.charCodeFake
      );
      this.menuItemLogout = new d(
        a.core.translate.get("Disconnect from Google"),
        a.core.charCodeLogout
      );
      this.menuItemCalendars = new d(
        a.core.translate.get("Calendars"),
        a.core.charCodeCalendars
      );
      this.menuItemShop = new d(
        a.core.translate.get("Shop"),
        a.core.charCodeShop
      );
      this.menuItemReload = new d(
        a.core.translate.get("Refresh"),
        a.core.charCodeReload
      );
      this.menuItemSettings = new d(
        a.core.translate.get("Settings"),
        a.core.charCodeSettings
      );
      this.menuItemAbout = new d(
        a.core.translate.get("About"),
        a.core.charCodeAbout
      );
      this.menuItemRate = new d(
        a.core.translate.get("Rate"),
        a.core.charCodeHeart
      );
      this.menuItemFeedback = new d(
        a.core.translate.get("Send feedback"),
        a.core.charCodeSend
      );
      this.showTime = a.core.getTimeStamp();
      this.menuItems = [];
      a.core.enableGoogle &&
        a.core.calendarDataProxy &&
        (a.core.calendarDataProxy.calendarDataProxyType !==
          a.CalendarDataProxyType.Google ||
          a.core.calendarDataProxy.enableGoogleLogin) &&
        this.menuItems.push(this.menuItemLogin);
      a.core.calendarDataProxy &&
        a.core.calendarDataProxy.enableMultipleCalendars &&
        this.menuItems.push(this.menuItemCalendars);
      a.core.calendarDataProxy &&
        a.core.calendarDataProxy.enableShop &&
        this.menuItems.push(this.menuItemShop);
      a.core.calendarDataProxy &&
        a.core.calendarDataProxy.enableReload &&
        this.menuItems.push(this.menuItemReload);
      this.menuItems.push(this.menuItemSettings);
      a.core.helper.isAndroid() &&
        (this.menuItems.push(this.menuItemRate),
        this.menuItems.push(this.menuItemFeedback));
      a.core.calendarDataProxy &&
        a.core.calendarDataProxy.enableGoogleLogout &&
        this.menuItems.push(this.menuItemLogout);
      this.redraw();
    };
    b.prototype.safeBack = function () {
      a.core.appStateHandler.safeBack(this) || this.startCloseAnimation();
    };
    b.prototype.click = function (b, e) {
      500 > a.core.getTimeStamp() - this.showTime
        ? (this.showTime = a.core.getTimeStamp())
        : ((this.showTime = a.core.getTimeStamp()),
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
    };
    b.prototype.hide = function () {
      this.startCloseAnimation();
    };
    b.prototype.setSizes = function () {
      this.menuLeft = this.menuTop = 1;
      var b = 0;
      this.textSize = a.core.settings.menuTextHeight;
      this.logoTextSize = Math.floor(2.2 * this.textSize);
      this.logoSize = Math.floor(3 * a.core.settings.menuIconHeight);
      this.logoTextSubSize = Math.floor(1.4 * this.textSize);
      for (
        var e = a.core.zopDrawArea.measureTextWidth(
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
          (b += a.core.settings.menuItemHeight),
          (this.menuItems[f].bottom = b),
          (e = Math.max(
            e,
            a.core.zopDrawArea.measureTextWidth(
              this.menuItems[f].text,
              this.textSize,
              true,
              false
            )
          ));
      this.expandedMenuWidth = Math.floor(
        Math.min(
          e + a.core.settings.menuItemHeight + a.core.settings.menuIconHeight,
          Math.min(
            a.core.domHandler.screenWidth,
            a.core.domHandler.screenHeight
          )
        )
      );
      this.movingMenuWidth = Math.floor(
        Math.max(
          a.core.settings.titleWidth,
          Math.min(this.currentMaxRight, this.expandedMenuWidth)
        )
      );
      this.menuHeight = a.core.domHandler.screenHeight;
      this.nudgeBecauseMenuBeingDragged = Math.floor(
        Math.max(
          0,
          a.core.mainMenuControl.movingMenuWidth - a.core.settings.titleWidth
        )
      );
      this.transparency = Math.max(
        -1,
        Math.min(
          1,
          (2 * Math.min(this.currentMaxRight, this.movingMenuWidth) -
            this.expandedMenuWidth -
            a.core.settings.titleWidth) /
            (this.expandedMenuWidth - a.core.settings.titleWidth)
        )
      );
      this.logoSizeGrowing = Math.floor(
        0.85 * this.logoSize +
          0.15 * this.logoSize * Math.max(0, this.transparency)
      );
      this.textColor = a.core.settings.theme.colorTitleText;
    };
    b.prototype.drawAreaResized = function () {
      a.core.appStateHandler.isMainMenuShowing && this.redraw();
    };
    b.prototype.redrawMenuIcon = function () {
      a.core.zopDrawArea.canvasContext.globalAlpha = Math.max(
        0,
        -this.transparency
      );
      var b = a.core.zopHandler.dateToZOP(new Date()),
        e = Math.min(
          0.6 * a.core.settings.titleWidth,
          20 * a.core.ratio * a.core.settings.zoom
        ),
        f = (a.core.settings.titleWidth - e) / 2,
        g = a.core.zopDrawArea.zopAreaTop + f,
        d = this.movingMenuWidth - a.core.settings.titleWidth + f,
        f = a.core.zopHandler.bottomZOP - a.core.zopHandler.topZOP,
        b = Math.max(
          0,
          (Math.abs(b - (a.core.zopHandler.topZOP + f / 2)) - 0.45 * f) /
            (0.1 * f)
        ),
        n = 1 - Math.min(1, b),
        l = 1 - 3 * Math.max(0, Math.min(1.333, b) - 1),
        b = a.core.settings.lineThickness,
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
      a.core.drawArea.startLines(
        (d + b) * n + d * (1 - n),
        h * n + q * (1 - n),
        b,
        a.core.settings.theme.colorTitleText
      );
      a.core.drawArea.continueLines(t, w);
      a.core.drawArea.continueLines(z, x);
      a.core.drawArea.endLines();
      1 <= l &&
        (a.core.drawArea.drawLine2(
          f,
          A,
          r,
          k,
          b,
          a.core.settings.theme.colorTitleText,
          false
        ),
        a.core.drawArea.drawLine2(
          u,
          g,
          v,
          p,
          b,
          a.core.settings.theme.colorTitleText,
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
        a.core.drawArea.startLines(
          r,
          k,
          b,
          a.core.settings.theme.colorTitleText
        );
        a.core.drawArea.continueLines(f, A);
        a.core.drawArea.continueLines(e, d);
        a.core.drawArea.continueLines(q, t);
        a.core.drawArea.continueLines(x, C);
        a.core.drawArea.endLines();
        a.core.drawArea.startLines(
          v,
          p,
          b,
          a.core.settings.theme.colorTitleText
        );
        a.core.drawArea.continueLines(u, g);
        a.core.drawArea.continueLines(n, h);
        a.core.drawArea.continueLines(w, z);
        a.core.drawArea.continueLines(y, l);
        a.core.drawArea.endLines();
      }
      a.core.zopDrawArea.canvasContext.globalAlpha = 1;
    };
    b.prototype.hitMenuButton = function (b, e) {
      return 0 < b &&
        b < a.core.settings.titleWidth &&
        0 < e &&
        e < a.core.settings.titleWidth
        ? true
        : false;
    };
    b.prototype.redraw = function () {
      this.setSizes();
      if (
        0.1 < this.movingMenuWidth / this.expandedMenuWidth &&
        0 < this.transparency
      ) {
        a.core.zopDrawArea.canvasContext.save();
        a.core.zopDrawArea.canvasContext.rect(
          this.menuLeft - 1,
          this.menuTop,
          this.movingMenuWidth,
          this.menuHeight + 2
        );
        a.core.zopDrawArea.canvasContext.clip();
        var b = this.expandedMenuWidth / 20;
        this.menuTop = b;
        a.core.drawArea.drawIcon(
          a.core.charCodeLogo,
          this.menuLeft + (this.expandedMenuWidth - this.logoSizeGrowing) / 2,
          this.menuTop + (this.logoSize - this.logoSizeGrowing) / 2,
          this.logoSizeGrowing,
          this.logoSizeGrowing
        );
        this.menuTop += this.logoSize;
        a.core.drawArea.drawCenteredText(
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
        a.core.drawArea.drawCenteredText(
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
        a.core.zopDrawArea.canvasContext.globalAlpha = Math.min(
          1,
          Math.max(0, 1 - this.transparency)
        );
        a.core.drawArea.drawFilledRectangle(
          a.core.zopHandler.leftPixel,
          0,
          a.core.settings.titleWidth +
            a.core.mainMenuControl.nudgeBecauseMenuBeingDragged +
            2 * a.core.ratio,
          a.core.zopDrawArea.zopAreaHeight,
          a.core.settings.theme.colorTitleBackground,
          false
        );
        a.core.zopDrawArea.canvasContext.globalAlpha = 1;
        a.core.zopDrawArea.canvasContext.restore();
      }
    };
    b.prototype.paintMenuItem = function (b) {
      var c = a.core.settings.menuItemHeight - 1;
      a.core.drawArea.drawHorizontalLineNotZOP(
        this.menuLeft,
        this.menuTop + b.top,
        this.expandedMenuWidth - 4,
        this.textColor,
        1,
        false
      );
      a.core.drawArea.drawHorizontalLineNotZOP(
        this.menuLeft,
        this.menuTop + b.top + 1 + a.core.settings.menuItemHeight - 1,
        this.expandedMenuWidth - 4,
        this.textColor,
        1,
        false
      );
      a.core.drawArea.drawText(
        b.text,
        this.menuLeft + c,
        this.menuTop +
          b.top +
          (a.core.settings.menuItemHeight - this.textSize) / 2.5,
        this.textSize,
        this.textColor,
        false,
        true,
        false,
        false
      );
      a.core.drawArea.drawIcon(
        b.charCode,
        this.menuLeft + c / 2 - a.core.settings.menuIconHeight / 2,
        this.menuTop + b.top + c / 2 - a.core.settings.menuIconHeight / 2,
        a.core.settings.menuIconHeight,
        a.core.settings.menuIconHeight
      );
    };
    b.prototype.hitTest = function (a, b, f) {
      return -1 < this.menuItems.indexOf(a) &&
        b > this.menuLeft &&
        b < this.menuLeft + this.expandedMenuWidth &&
        f > this.menuTop + a.top &&
        f < this.menuTop + a.bottom
        ? true
        : false;
    };
    b.prototype.menuItemLogin_Click = function () {
      a.core.calendarDataProxy.analyticsEvent("Event", "Login Clicked");
      a.core.calendarDataProxy
        ? ((a.core.calendarDataProxy = new a.GoogleCalendarDataProxy()),
          a.core.calendarDataProxy.login())
        : a.core.loadDataProxy();
    };
    b.prototype.menuItemReload_Click = function () {
      a.core.calendarDataProxy.analyticsEvent("Event", "Reload Clicked");
      a.core.reloadAllCalendarData();
    };
    b.prototype.menuItemLogout_Click = function () {
      a.core.calendarDataProxy.logout();
      a.core.calendarDataProxy.analyticsEvent("Event", "Logout Clicked");
      a.core.calendarDataProxy = new a.DemoCalendarDataProxy();
      a.core.calendarDataProxy.populateCalendarEvents(function () {
        a.core.dataLoadReady();
      });
    };
    b.prototype.menuItemFake_Click = function () {
      a.core.calendarDataProxy = new a.DemoCalendarDataProxy();
      a.core.calendarDataProxy.populateCalendarEvents(function () {
        a.core.dataLoadReady();
      });
    };
    b.prototype.menuItemCalendars_Click = function () {
      a.core.appStateHandler.viewCalendars();
    };
    b.prototype.menuItemShop_Click = function () {
      a.core.appStateHandler.viewShop();
    };
    b.prototype.menuItemSettings_Click = function () {
      a.core.appStateHandler.viewSettings();
    };
    b.prototype.menuItemAbout_Click = function () {
      a.core.appStateHandler.viewAbout();
    };
    b.prototype.menuItemRate_Click = function () {
      a.core.helper.isAndroid()
        ? window.open("market://details?id=com.oneviewcalendar.app")
        : window.open(
            "https://web.archive.org/web/20190808203716/https://play.google.com/store/apps/details?id=com.oneviewcalendar.app"
          );
    };
    b.prototype.menuItemFeedback_Click = function () {
      window.open(
        "mailto:support@oneviewcalendar.com?body=%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A-------------------%0D%0ASent from OneView Calendar version: 1.1.8"
      );
    };
    b.prototype.getAnimationProgress = function () {
      var b = a.core.getTimeStamp(),
        b =
          Math.min(
            this.animationDuration,
            Math.max(10, b - this.animationStartTime)
          ) / this.animationDuration;
      return 1 - (1 - b) * (1 - b) * (1 - b) * (1 - b);
    };
    b.prototype.startOpenAnimation = function () {
      this.animationAborted = false;
      a.core.appStateHandler.isMainMenuBeingDragged = false;
      this.animationStartTime = a.core.getTimeStamp() - 20;
      this.animationStartPos = this.currentMaxRight;
      this.animationGoalDistance =
        this.expandedMenuWidth - this.animationStartPos;
      this.doOpenAnimation();
    };
    b.prototype.doOpenAnimation = function () {
      var b = this;
      this.animationAborted ||
        ((this.currentMaxRight =
          this.animationStartPos +
          this.animationGoalDistance * this.getAnimationProgress()),
        this.isFullyExpanded() ||
          window.setTimeout(function () {
            b.doOpenAnimation();
          }, 30),
        a.core.redraw(true));
    };
    b.prototype.isFullyExpanded = function () {
      return this.movingMenuWidth >= this.expandedMenuWidth - 5;
    };
    b.prototype.startCloseAnimation = function () {
      this.animationAborted = false;
      a.core.appStateHandler.isMainMenuBeingDragged = false;
      this.animationStartTime = a.core.getTimeStamp() - 20;
      this.animationStartPos = this.currentMaxRight;
      this.animationGoalDistance = -this.animationStartPos;
      this.doCloseAnimation();
    };
    b.prototype.doCloseAnimation = function () {
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
            (a.core.appStateHandler.isMainMenuBeingDragged = false),
            (this.movingMenuWidth = a.core.settings.titleWidth),
            (a.core.appStateHandler.isMainMenuShowing = false),
            this.redraw()));
      a.core.redraw(true);
    };
    b.prototype.startDragging = function (b, e) {
      a.core.appStateHandler.isMainMenuBeingDragged = false;
      return (b >= a.core.zopDrawArea.zopAreaLeft &&
        b <=
          a.core.zopDrawArea.zopAreaLeft +
            Math.max(a.core.settings.titleWidth, this.currentMaxRight)) ||
        (a.core.appStateHandler.isMainMenuShowing && this.isFullyExpanded())
        ? (this.animationAborted = true)
        : false;
    };
    b.prototype.continueDragging = function (b, e) {
      this.animationAborted = a.core.appStateHandler.isMainMenuBeingDragged =
        true;
      b = Math.max(b, a.core.settings.titleWidth);
      this.lastDragDirection = b - this.currentMaxRight;
      this.currentMaxRight = b;
      a.core.appStateHandler.isMainMenuShowing ||
        (a.core.appStateHandler.showMainMenu(false),
        (this.currentMaxRight = b));
    };
    b.prototype.endDragging = function () {
      a.core.appStateHandler.isMainMenuBeingDragged = false;
      0 < this.lastDragDirection
        ? (a.core.appStateHandler.addVisibleControl(a.core.mainMenuControl),
          this.startOpenAnimation())
        : this.safeBack();
    };
    return b;
  })();
  a.MainMenuControl = p;
  var d = (function () {
    return function (a, c) {
      this.isHighlited = false;
      this.text = a;
      this.charCode = c;
    };
  })();
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
      this.animationLength = 2e3;
      this.precision = 4;
      this.animationActive = false;
    }
    d.prototype.drawAreaResized = function () {
      a.core.appStateHandler.isAddButtonBeingDragged && this.redraw();
      this.width = Math.floor(
        a.core.settings.titleWidth * a.core.settings.theme.addButtonWidthFactor
      );
      this.halfWidth = Math.floor(this.width / 2);
      this.radius = Math.floor(this.width / 2);
      this.defaultCenterY =
        a.core.zopDrawArea.zopAreaTop +
        a.core.zopDrawArea.zopAreaHeight -
        2 * a.core.settings.margin -
        this.radius;
      this.currentCenterX = this.defaultCenterX =
        a.core.zopDrawArea.zopAreaLeft +
        a.core.zopDrawArea.zopAreaWidth -
        2 * a.core.settings.margin -
        this.radius;
      this.currentCenterY = this.defaultCenterY;
      this.leftForDetailedSelection =
        (a.core.zopHandler.rightPixel - a.core.settings.titleWidth) / 2 +
        a.core.settings.titleWidth;
    };
    d.prototype.redrawAddButton = function () {
      a.core.appStateHandler.isAddButtonBeingDragged || this.isAnimationActive()
        ? (this.passedMinDistance() &&
            this.selectedStartTime &&
            a.core.zopDrawArea.drawFilledRectangle(
              a.core.settings.titleWidth +
                a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
              a.core.zopHandler.dateToZOP(this.selectedStartTime),
              a.core.zopDrawArea.zopAreaWidth -
                a.core.settings.titleWidth -
                a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
              a.core.zopHandler.dateToZOP(this.selectedEndTime),
              a.core.settings.theme.colorFadeOut,
              5
            ),
          this.passedMinDistance() &&
            a.core.drawArea.drawVerticalLineNotZOP(
              this.leftForDetailedSelection,
              0,
              a.core.zopDrawArea.zopAreaHeight,
              a.core.settings.theme.colorMarker,
              3
            ),
          a.core.zopDrawArea.drawFilledCircle2(
            this.defaultCenterX +
              a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
            this.defaultCenterY,
            this.radius + 1,
            a.core.settings.theme.colorDarkSoft,
            false
          ),
          a.core.zopDrawArea.drawFilledCircle2(
            this.defaultCenterX +
              a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
            this.defaultCenterY,
            this.radius - 1,
            a.core.settings.theme.colorLightSoft,
            false
          ))
        : ((this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY));
      a.core.zopDrawArea.drawFilledCircle2(
        this.currentCenterX +
          a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
        this.currentCenterY,
        this.radius,
        a.core.settings.theme.colorAddButton,
        false
      );
      var b = a.core.settings.lineThickness,
        c = 0;
      1 === b && (c = 0.5);
      this.isAnimationActive()
        ? ((b = this.radius / 2.2),
          a.core.drawArea.drawCenteredText(
            "Drag me",
            this.currentCenterX -
              this.radius +
              a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
            this.currentCenterY - b / 1.5,
            2 * this.radius,
            b,
            a.core.settings.theme.colorTagText,
            false,
            false,
            false
          ))
        : (a.core.drawArea.drawLine2(
            this.currentCenterX +
              a.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
              c,
            Math.floor(this.currentCenterY - this.width / 7) - c,
            this.currentCenterX +
              a.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
              c,
            Math.floor(this.currentCenterY + this.width / 7) - c,
            b,
            a.core.settings.theme.colorTitleText,
            false
          ),
          a.core.drawArea.drawLine2(
            Math.floor(
              this.currentCenterX -
                this.width / 7 +
                a.core.mainMenuControl.nudgeBecauseMenuBeingDragged
            ) - c,
            this.currentCenterY - c,
            Math.floor(
              this.currentCenterX +
                this.width / 7 +
                a.core.mainMenuControl.nudgeBecauseMenuBeingDragged
            ) - c,
            this.currentCenterY - c,
            b,
            a.core.settings.theme.colorTitleText,
            false
          ));
    };
    d.prototype.startDragging = function (b, c) {
      this.passefMinDistanceEver = false;
      return b >
        this.currentCenterX +
          a.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
          1.5 * this.radius &&
        b <
          this.currentCenterX +
            a.core.mainMenuControl.nudgeBecauseMenuBeingDragged +
            1.5 * this.radius &&
        c >
          this.currentCenterY +
            a.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
            1.5 * this.radius &&
        c <
          this.currentCenterY +
            a.core.mainMenuControl.nudgeBecauseMenuBeingDragged +
            1.5 * this.radius
        ? (a.core.appStateHandler.isAddButtonBeingDragged = true)
        : (a.core.appStateHandler.isAddButtonBeingDragged = false);
    };
    d.prototype.getTitleExtraData = function () {
      if (
        a.core.appStateHandler.isAddButtonBeingDragged &&
        this.detailedTimeInfo
      )
        return this.detailedTimeInfo;
    };
    d.prototype.continueDragging = function (b, c) {
      this.currentCenterX = b;
      this.currentCenterY = c;
      if (this.passedMinDistance()) {
        this.passefMinDistanceEver = true;
        var e;
        b >= this.leftForDetailedSelection &&
          (e = a.core.calendarDateHandler.getClosestFakeDetailAt(
            c,
            this.precision,
            false
          ));
        if (!e) {
          this.detailedTimeInfo = void 0;
          e = a.core.calendarDateHandler.selectCalendarDateObjectAt(b, c, true);
          for (
            var f = 10;
            e && e.calendarDateObjectType === a.CalendarDateObjectType.Title;

          )
            (e = a.core.calendarDateHandler.selectCalendarDateObjectAt(
              b + f,
              c,
              true
            )),
              (f += 10);
        }
        e &&
          e.calendarDateObjectType === a.CalendarDateObjectType.Week &&
          (this.detailedTimeInfo = e.longText);
        e &&
          (e.calendarDateObjectType < a.CalendarDateObjectType.Hour &&
            (e = new a.CalendarDateObject(
              a.CalendarDateObjectType.Hour,
              e.startDateTime
            )),
          this.selectedStartTime !== e.startDateTime &&
            ((this.previousSelectedStartTime = this.selectedStartTime),
            (this.previousSelectedEndTime = this.selectedEndTime),
            (this.selectedTimeStamp = a.core.getTimeStamp())),
          (this.selectedStartTime = e.startDateTime),
          (this.selectedEndTime = e.endDateTime));
        e &&
          ((this.detailedTimeInfo = e.longText),
          e.calendarDateObjectType <= a.CalendarDateObjectType.Hour &&
            (this.detailedTimeInfo =
              moment(e.startDateTime).format("dddd ") + e.longText));
      } else
        this.detailedTimeInfo =
          this.selectedEndTime =
          this.selectedStartTime =
            void 0;
    };
    d.prototype.endDragging = function () {
      a.core.appStateHandler.isAddButtonBeingDragged = false;
      this.selectedTimeStamp + 200 > a.core.getTimeStamp() &&
        void 0 !== this.previousSelectedEndTime &&
        ((this.selectedStartTime = this.previousSelectedStartTime),
        (this.selectedEndTime = this.previousSelectedEndTime));
      this.passedMinDistance()
        ? this.selectedStartTime &&
          (a.core.zopDrawArea.drawFilledRectangle(
            a.core.settings.titleWidth,
            a.core.zopHandler.dateToZOP(this.selectedStartTime),
            a.core.zopDrawArea.zopAreaWidth - a.core.settings.titleWidth,
            a.core.zopHandler.dateToZOP(this.selectedEndTime),
            a.core.settings.theme.colorFadeOut,
            5
          ),
          (this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY),
          a.core.appStateHandler.startAddCalendarEventObject(
            this.selectedStartTime,
            this.selectedEndTime
          ))
        : this.passefMinDistanceEver
        ? ((this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY))
        : ((this.animationStartTime = a.core.getTimeStamp()),
          (this.animationActive = true));
      this.detailedTimeInfo =
        this.selectedEndTime =
        this.selectedStartTime =
          void 0;
    };
    d.prototype.isAnimationActive = function () {
      a.core.appStateHandler.isAddButtonBeingDragged &&
        (this.animationActive = false);
      return this.animationActive;
    };
    d.prototype.passedMinDistance = function () {
      return (
        Math.abs(this.currentCenterX - this.defaultCenterX) +
          Math.abs(this.currentCenterY - this.defaultCenterY) >=
        this.width
      );
    };
    d.prototype.doAnimation = function () {
      var b = a.core.getTimeStamp() - this.animationStartTime;
      b > this.animationLength &&
        ((this.currentCenterX = this.defaultCenterX),
        (this.currentCenterY = this.defaultCenterY));
      if (b > 2 * this.animationLength)
        (this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY),
          (this.animationActive = false);
      else {
        var c = a.core.zopDrawArea.zopAreaHeight / 8,
          e =
            Math.PI / 2 -
            ((b / this.animationLength) * Math.PI + (2 * Math.PI) / 8),
          b = ((b / this.animationLength) * Math.PI) / 2;
        this.currentCenterX = this.defaultCenterX + Math.sin(e) * c - 0.706 * c;
        this.currentCenterY = this.defaultCenterY + Math.cos(e) * c - 0.708 * c;
        this.currentCenterX -= Math.sin(b) * c * 1;
        this.currentCenterY -= Math.sin(b) * c * 1.5;
        this.continueDragging(this.currentCenterX, this.currentCenterY);
        a.core.redraw(false);
      }
    };
    d.prototype.doAnimation2 = function () {
      var b = a.core.getTimeStamp() - this.animationStartTime;
      b > this.animationLength &&
        ((this.currentCenterX = this.defaultCenterX),
        (this.currentCenterY = this.defaultCenterY));
      if (b > 2 * this.animationLength)
        (this.currentCenterX = this.defaultCenterX),
          (this.currentCenterY = this.defaultCenterY),
          (this.animationActive = false);
      else {
        var c = a.core.zopDrawArea.zopAreaHeight / 8,
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
        a.core.redraw(false);
      }
    };
    d.prototype.newPosHelper = function (a, c, e) {
      return a * e + c * (1 - e);
    };
    d.prototype.redraw = function () {};
    return d;
  })();
  a.AddButtonControl = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d(a) {
      this.menuItems = [];
      this.menuItems = a;
    }
    d.prototype.resetDrawAreaSize = function (a, c) {};
    d.prototype.showMenuFor = function (b, c) {
      this.x = b;
      this.y = c;
      this.tryShiftPixels = c - a.core.domHandler.screenHeight / 2;
      this.redraw();
    };
    d.prototype.click = function (a, c) {
      for (var b = 0; b < this.menuItems.length; b++)
        if (this.hitTest(this.menuItems[b], a, c)) {
          this.menuItems[b].onMenuItemClicked();
          return;
        }
      history.back();
    };
    d.prototype.drawAreaResized = function () {
      this.redraw();
    };
    d.prototype.redraw = function () {
      for (var b = 0, c = 0, e = 0; e < this.menuItems.length; e++)
        this.menuItems[e].isVisible &&
          ((this.menuItems[e].top = b),
          (b += a.core.settings.menuItemHeight),
          (this.menuItems[e].bottom = b),
          (c = Math.max(
            c,
            a.core.zopDrawArea.measureTextWidth(
              this.menuItems[e].text,
              a.core.settings.menuTextHeight,
              true,
              false
            )
          )));
      this.menuWidth = Math.min(
        c + a.core.settings.menuItemHeight + a.core.settings.menuIconHeight,
        Math.min(a.core.domHandler.screenWidth, a.core.domHandler.screenHeight)
      );
      this.menuHeight = b + 1;
      this.menuLeft = (a.core.domHandler.screenWidth - this.menuWidth) / 2;
      this.menuTop =
        (a.core.domHandler.screenHeight - this.menuHeight) / 2 +
        this.tryShiftPixels;
      this.menuTop = Math.max(20, this.menuTop);
      this.menuTop = Math.min(
        a.core.domHandler.screenHeight - 20 - this.menuHeight,
        this.menuTop
      );
      a.core.drawArea.drawFilledRectangle(
        this.menuLeft - 1,
        this.menuTop - 1,
        this.menuWidth + 2,
        this.menuHeight + 2,
        a.core.settings.theme.colorWhite,
        false
      );
      a.core.drawArea.drawFilledRectangle(
        this.menuLeft,
        this.menuTop,
        this.menuWidth,
        this.menuHeight,
        a.core.settings.theme.colorDarkSoft,
        false
      );
      for (e = 0; e < this.menuItems.length; e++)
        this.paintMenuItem(this.menuItems[e]);
    };
    d.prototype.paintMenuItem = function (b) {
      if (b.isVisible) {
        var c = a.core.settings.menuItemHeight - 1;
        a.core.drawArea.drawFilledRectangle(
          this.menuLeft + 1,
          this.menuTop + b.top + 1,
          this.menuWidth - 2,
          a.core.settings.menuItemHeight - 1,
          a.core.settings.theme.colorDark,
          false
        );
        a.core.drawArea.drawText(
          b.text,
          this.menuLeft + c + 1,
          this.menuTop +
            b.top +
            (a.core.settings.menuItemHeight - a.core.settings.menuTextHeight) /
              2.5,
          a.core.settings.menuTextHeight,
          a.core.settings.theme.colorWhite,
          false,
          true,
          false,
          false
        );
        a.core.drawArea.drawIcon(
          b.charCode,
          this.menuLeft + c / 2 - a.core.settings.menuIconHeight / 2,
          this.menuTop + b.top + c / 2 - a.core.settings.menuIconHeight / 2,
          a.core.settings.menuIconHeight,
          a.core.settings.menuIconHeight
        );
      }
    };
    d.prototype.hitTest = function (a, c, e) {
      return c > this.menuLeft &&
        c < this.menuLeft + this.menuWidth &&
        e > this.menuTop + a.top &&
        e < this.menuTop + a.bottom
        ? true
        : false;
    };
    return d;
  })();
  a.PopupMenuControl_Base = p;
  p = (function () {
    return function (a, b, c) {
      this.isHighlited = false;
      this.isVisible = true;
      this.text = a;
      this.charCode = b;
      this.onMenuItemClicked = c;
    };
  })();
  a.MenuItemInfo = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
      this.pageHtml =
        '<div id="message" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div id="messageText" class="base menuItem" style="text-align:center">{#Error#}</div>    <div>        <button id="messageOk" class="topBarButton" style="width:100%"><img src="images/check.svg" height="24px" style="vertical-align: text-bottom"/><span>{#Ok#}</span></button>    </div></div></div></div><div id="noColorPickerWindow" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItem" style="text-align:center">{#Color picker?#}</div>    <div>        <button id="gotoShopCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>        <button id="gotoShopOk" class="topBarButton" style="width:50%"><img src="images/shop.svg" class="topBarImage"/><span>{#Shop#}</span></button>    </div></div></div></div><div id="colorPickerWindow" class="outer" style="display: none" > <div class="middle" > <div class="inner" >          <div id="colorPickerArea" style="padding: 20px; padding-top: 12px;"></div></div></div></div><div id="editEventTopBar" class="topBar">    <button id="editEventCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>    <button id="editEventOk" class="topBarButton" style="width:50%"><img src="images/check.svg" class="topBarImage"/><span>{#Ok#}</span></button></div><div class="pageContent" id="editEventArea" style="float:left; background-color: #E9E9E9;">        <div class="editEventPopupContent pageTopPadding" id="editEventPopupContent">            <div class="miniTitle sizedTitle">{#Title#}</div>            <div style="position: relative"><div class="inputBox"><input type="text" class="base inputBase inputOneLiner" name="task" id="editEventTitle" required /></div></div>            <div class="miniTitle sizedTitle">{#Start#}</div>            <div style="position: relative"><div class="inputBox lessSpace"><input type="date" class="base inputBase inputDate" id="editEventDateStart" min="0001-01-01" max="4000-01-01" /><span id="fakeDateStart" class="base inputBase dateFake" ></span></div></div>            <div style="position: relative"><div class="inputBox"><input type="time" class="base inputBase inputDate androidDown" id="editEventTimeStart" step="60"></div></div>            <div class="miniTitle sizedTitle">{#End#}</div>            <div style="position: relative"><div class="inputBox lessSpace"><select id="editEventDuration" class="base inputBase">            </select></div></div>            <div style="position: relative"><div class="inputBox lessSpace"><input type="date" class="base inputBase inputDate" id="editEventDateEnd" min="0001-01-01" max="4000-01-01" ><span id="fakeDateEnd" class="base inputBase dateFake"></span></div></div>            <div style="position: relative"><div class="inputBox"><input type="time" class="base inputBase inputDate androidDown" id="editEventTimeEnd"  step="60"/></div></div>            <div class="miniTitle sizedTitle" id="remindersTitle">{#Reminders#}</div>            <div style="position: relative"><div class="inputBox"><select id="editEventReminders" class="base inputBase maybeBig" multiple="multiple" >            </select></div></div>            <div class="miniTitle sizedTitle">{#Where#}</div>            <div style="position: relative"><div class="inputBox"><input type="text" class="base inputBase inputOneLiner" name="task" id="editEventLocation" ></div></div>            <div class="miniTitle sizedTitle">{#Details#}</div>            <div style="position: relative"><div class="inputBox"><textarea class="base inputBase inputTwoLiner" name="task" id="editEventDetails" ></textarea></div></div>            <div id="spaceForColors"></div>                        <div class="miniTitle sizedTitle">{#Calendar#}</div>                        <div style="position: relative"><div id="calendarSelWrapper" class="inputBox"><select id="editEventCalendar" class="base inputBase inputOneLiner" >                        </select></div><div id="editEventColor" class="square"></div>            <table style ="width:100%">                <tr>                    <td style="white-space: nowrap">                        <div class="miniTitle sizedTitle">{#Recurrence#}</div>                        <div><div class="inputBox"><div class="base inputBase inputOneLiner" id="editEventRecurrenceWrapper"><span class="pageContentText" id="editEventRecurrence" style="cursor: pointer" style="float:left" taborder="10"></span></div></div></div>                    </td><td style="width:80%"></td>                 </tr>            </table>            </div> </div>         </div></div>';
      this.isShowingDatePickerForStartTime = false;
      this.canEditReccur = true;
    }
    d.prototype.reshow = function () {
      a.core.appStateHandler.editEventControlIsShowing = true;
      this.updateRecurrenceHtml();
      this.timestamp = a.core.getTimeStamp();
    };
    d.prototype.init = function (b, c) {
      this.calendarEvent =
        c === a.EventEditType.AllInSeries && b.isRecurring
          ? a.core.calendarDataProxy.getFirstRecurringEvent(b)
          : b;
      this.editType = c;
      this.originalStartDate = this.calendarEvent.startDateTime;
      this.originalEndDate = this.calendarEvent.endDateTime;
      this.originalIsRecurring = this.calendarEvent.isRecurring;
      this.rruleFetched = this.rruleFetched.bind(this);
      a.core.calendarDataProxy.getRRuleObject(
        this.calendarEvent,
        this.rruleFetched
      );
    };
    d.prototype.show = function () {
      a.core.domHandler.hideCanvas();
      a.core.calendarDataProxy.analyticsPage("Edit event page");
      this.editPage = a.core.domHandler.pageHtmlFormatHelper(
        "editEvent",
        this.pageHtml
      );
      this.editPage.style.display = "block";
      a.core.domHandler.resizeDomElements();
      a.core.domHandler.resizeDomElements();
      this.setByDuration(null);
      a.core.domHandler.resizeDomElements =
        a.core.domHandler.resizeDomElements.bind(a.core.domHandler);
      window.setTimeout(a.core.domHandler.resizeDomElements, 0);
      window.setTimeout(a.core.domHandler.resizeDomElements, 100);
      this.durationSelectElement = document.getElementById("editEventDuration");
      this.updateDuration();
      this.remindersSelectElement =
        document.getElementById("editEventReminders");
      this.updateReminders();
      var b = (a.core.settings.titleWidth / a.core.ratio - 24) / 2;
      document.getElementById("editEventOk").style.padding = b + "px";
      document.getElementById("editEventCancel").style.padding = b + "px";
      document.getElementById("editEventArea").style.top = "54px";
      a.core.domHandler.addClickEvent("editEventOk", this.editEventOk, this);
      a.core.domHandler.addClickEvent(
        "editEventCancel",
        this.editEventCancel,
        this
      );
      a.core.domHandler.addClickEvent(
        "editEventRecurrence",
        this.editRecurrency,
        this
      );
      a.core.domHandler.addClickEvent("editEventArea", this.doNothing, this);
      a.core.helper.canShowDatePicker() &&
        (a.core.domHandler.addClickEvent(
          "editEventTimeStart",
          this.showDatePickerForStartTime,
          this
        ),
        a.core.domHandler.addClickEvent(
          "editEventTimeEnd",
          this.showDatePickerForEndTime,
          this
        ));
      a.core.domHandler.addEvent(
        "editEventDateStart",
        "change",
        this.startChanged,
        this
      );
      a.core.domHandler.addEvent(
        "editEventDateEnd",
        "change",
        this.endChanged,
        this
      );
      a.core.domHandler.addEvent(
        "editEventTimeStart",
        "change",
        this.startChanged,
        this
      );
      a.core.domHandler.addEvent(
        "editEventTimeEnd",
        "change",
        this.endChanged,
        this
      );
      a.core.domHandler.addEvent(
        "editEventDuration",
        "change",
        this.editEventDurationChanged,
        this
      );
      a.core.domHandler.addEvent(
        "editEventTimeStart",
        "blur",
        this.showFakeTimeStart,
        this
      );
      a.core.domHandler.addEvent(
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
      new a.Helper().isMobile() ||
        (document.getElementById("remindersTitle").innerHTML +=
          "  (" +
          a.core.translate.get(
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
      for (e = 0; e < a.core.calendars.length; e++)
        1 == a.core.calendars[e].canEditCalendarEvents &&
          (c +=
            "<option value='" +
            a.core.calendars[e].id +
            "' > " +
            a.core.calendars[e].name +
            " </option > ");
      b.innerHTML = c;
      b.value = this.calendarEvent.calendarId;
      a.core.domHandler.addClickEvent(
        "editEventColor",
        this.showColorPickerWindow,
        this
      );
      document.getElementById("colorPickerArea").style.backgroundColor =
        a.core.settings.theme.colorBackground;
      document.getElementById("editEventColor").style.backgroundColor =
        a.core.helper.getEventColor2(this.calendarEvent);
      b = new Piklor();
      b.init(
        document.getElementById("colorPickerArea"),
        a.core.settings.theme.eventColors,
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
            a.core.settings.theme.eventColors.indexOf(b)),
          f.calendarEvent.extraColorId ==
            a.core.getCalendar(f.calendarEvent.calendarId).colorId &&
            (f.calendarEvent.extraColorId = void 0),
          (document.getElementById("editEventColor").style.backgroundColor =
            a.core.helper.getEventColor2(f.calendarEvent)));
        f.hideColorPickerWindow();
      });
    };
    d.prototype.calendarChanged = function (b) {
      b = document.getElementById("editEventCalendar").value;
      document.getElementById("editEventColor").style.backgroundColor =
        a.core.helper.getCalendarColor(a.core.getCalendar(b));
      this.calendarEvent.extraColorId = void 0;
    };
    d.prototype.onSuccess = function (a) {
      this.isShowingDatePickerForStartTime
        ? ((document.getElementById("editEventTimeStart").value =
            this.timeToValue(a)),
          (this.calendarEvent.startDateTime = a),
          this.startChanged(null))
        : ((document.getElementById("editEventTimeEnd").value =
            this.timeToValue(a)),
          (this.calendarEvent.endDateTime = a),
          this.endChanged(null));
    };
    d.prototype.onError = function (a) {};
    d.prototype.showDatePicker = function (b) {
      this.isShowingDatePickerForStartTime = b;
      b = {
        date: b
          ? this.calendarEvent.startDateTime
          : this.calendarEvent.endDateTime,
        mode: "time",
        androidTheme: 1,
        is24Hour: a.core.commonUserSettings.use24hFormat,
      };
      this.onSuccess = this.onSuccess.bind(this);
      this.onError = this.onError.bind(this);
      datePicker.show(b, this.onSuccess, this.onError);
    };
    d.prototype.showDatePickerForStartTime = function (a) {
      a.preventDefault();
      this.showDatePicker(true);
    };
    d.prototype.showDatePickerForEndTime = function (a) {
      a.preventDefault();
      this.showDatePicker(false);
    };
    d.prototype.showMessage = function (b, c) {
      var e = this;
      document.getElementById("message").style.display = "table";
      document.getElementById("messageText").innerText = b;
      a.core.domHandler.addClickEvent(
        "messageOk",
        function () {
          e.hideMessage(c);
        },
        this
      );
    };
    d.prototype.hideMessage = function (b) {
      document.getElementById("message").style.display = "none";
      b && a.core.appStateHandler.back();
    };
    d.prototype.showColorPickerWindow = function () {
      a.core.commonUserSettings.licenceColorPicker
        ? (document.getElementById("colorPickerWindow").style.display = "table")
        : ((document.getElementById("noColorPickerWindow").style.display =
            "table"),
          a.core.domHandler.addClickEvent("gotoShopOk", this.gotoShop, this),
          a.core.domHandler.addClickEvent(
            "gotoShopCancel",
            this.hideNoColorPickerWindow,
            this
          ));
    };
    d.prototype.hideColorPickerWindow = function () {
      document.getElementById("colorPickerWindow").style.display = "none";
    };
    d.prototype.hideNoColorPickerWindow = function () {
      document.getElementById("noColorPickerWindow").style.display = "none";
    };
    d.prototype.gotoShop = function () {
      a.core.appStateHandler.viewShop();
    };
    d.prototype.updateRecurrenceHtml = function () {
      this.canEditReccur = true;
      this.calendarEvent.isRecurring &&
        this.editType != a.EventEditType.ThisOnly &&
        (document.getElementById("editEventRecurrence").innerHTML =
          "YES (Press to edit)");
      this.calendarEvent.isRecurring &&
        this.editType == a.EventEditType.ThisOnly &&
        ((this.canEditReccur = false),
        (document.getElementById("editEventRecurrence").innerHTML =
          a.core.translate.get("Not possible")),
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
    };
    d.prototype.autoAdjustSoNotNegativeTime = function () {
      this.calendarEvent.startDateTime >= this.calendarEvent.endDateTime &&
        ((this.calendarEvent.endDateTime = moment(
          this.calendarEvent.startDateTime
        )
          .add(1, "hours")
          .toDate()),
        this.updateRealDateInputs(),
        this.updateFakes());
    };
    d.prototype.showFakeTimeStart = function () {
      this.autoAdjustSoNotNegativeTime();
    };
    d.prototype.showFakeTimeEnd = function () {
      this.calendarEvent.startDateTime >= this.calendarEvent.endDateTime &&
        ((this.calendarEvent.startDateTime = moment(
          this.calendarEvent.endDateTime
        )
          .add(-1, "hours")
          .toDate()),
        this.updateRealDateInputs(),
        this.updateFakes());
    };
    d.prototype.dateToValue = function (a) {
      this.timezoneOffset = 6e4 * a.getTimezoneOffset();
      return new Date(a.getTime() - this.timezoneOffset)
        .toISOString()
        .replace("Z", "")
        .split("T")[0];
    };
    d.prototype.timeToValue = function (a) {
      this.timezoneOffset = 6e4 * a.getTimezoneOffset();
      return new Date(a.getTime() - this.timezoneOffset)
        .toISOString()
        .replace("Z", "")
        .split("T")[1];
    };
    d.prototype.valueToDate = function (a) {
      return new Date(new Date(a).getTime() + this.timezoneOffset);
    };
    d.prototype.rruleFetched = function (a) {
      a && (this.originalRRule = this.calendarEvent.rruleToSave = a);
    };
    d.prototype.hide = function () {
      a.core.appStateHandler.editEventControlIsShowing = false;
      a.core.domHandler.showCanvas();
      a.core.domHandler.removeElement(this.editPage.id);
    };
    d.prototype.startChanged = function (b) {
      var c = this;
      new a.Helper().isAndroid()
        ? (this.readDateTimeToCalendarEvent(),
          this.updateEndBasedOnDuration(),
          this.autoAdjustSoNotNegativeTime(),
          b.target.blur())
        : ((this.lastStartChangedOnWeb = a.core.getTimeStamp()),
          (this.startChangedOnWeb = this.startChangedOnWeb.bind(this)),
          window.setTimeout(function () {
            c.startChangedOnWeb(b);
          }, 700));
    };
    d.prototype.startChangedOnWeb = function (b) {
      a.core.getTimeStamp() < this.lastStartChangedOnWeb + 600 ||
        (this.readDateTimeToCalendarEvent(),
        this.updateEndBasedOnDuration(),
        this.autoAdjustSoNotNegativeTime(),
        window.setTimeout(b.target.focus, 50));
    };
    d.prototype.endChanged = function (b) {
      var c = this;
      new a.Helper().isAndroid()
        ? (this.readDateTimeToCalendarEvent(),
          this.autoAdjustSoNotNegativeTime(),
          this.updateFakes(),
          this.updateDuration(),
          b.target.blur())
        : ((this.lastEndChangedOnWeb = a.core.getTimeStamp()),
          (this.endChangedOnWeb = this.endChangedOnWeb.bind(this)),
          window.setTimeout(function () {
            c.endChangedOnWeb(b);
          }, 700));
    };
    d.prototype.endChangedOnWeb = function (b) {
      a.core.getTimeStamp() < this.lastEndChangedOnWeb + 600 ||
        (this.readDateTimeToCalendarEvent(),
        this.autoAdjustSoNotNegativeTime(),
        this.updateFakes(),
        this.updateDuration(),
        window.setTimeout(b.target.focus, 50));
    };
    d.prototype.updateFakes = function () {
      document.getElementById("fakeDateStart").innerText =
        a.core.helper.GetDateWithWeekDay(this.calendarEvent.startDateTime);
      document.getElementById("fakeDateEnd").innerText =
        a.core.helper.GetDateWithWeekDay(this.calendarEvent.endDateTime);
    };
    d.prototype.updateRealDateInputs = function () {
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
    };
    d.prototype.validateStartAndEnd = function () {
      return this.calendarEvent.startDateTime >= this.calendarEvent.endDateTime
        ? (this.showMessage("Please enter a valid end time.", false), false)
        : true;
    };
    d.prototype.validateTitle = function (a) {
      return null == a || 0 == a.length
        ? (this.showMessage("Please enter a title.", false), false)
        : true;
    };
    d.prototype.editEventOk = function (b) {
      b.preventDefault();
      b = document.getElementById("editEventTitle").value;
      if (
        this.validateTitle(b) &&
        (this.readDateTimeToCalendarEvent(),
        this.validateStartAndEnd() &&
          !(300 > a.core.getTimeStamp() - this.timestamp))
      ) {
        var c;
        this.calendarEvent.reminders = [];
        for (c = 0; c < this.remindersSelectElement.options.length; c++)
          this.remindersSelectElement.options[c].selected &&
            this.calendarEvent.reminders.push(
              new a.Reminder(+this.remindersSelectElement.options[c].value)
            );
        this.calendarEvent.summary = b;
        this.calendarEvent.location =
          document.getElementById("editEventLocation").value;
        this.calendarEvent.description =
          document.getElementById("editEventDetails").value;
        b = this.calendarEvent.calendarId;
        c = document.getElementById("editEventCalendar").value;
        a.core.commonUserSettings.calendarIdLastAddedTo = c;
        a.core.persistChangesToCalendars();
        this.editType != a.EventEditType.New && b != c
          ? (a.core.calendarDataProxy.deleteEvent(
              this.calendarEvent,
              this.editType,
              true
            ),
            (this.calendarEvent.calendarId = c),
            a.core.calendarDataProxy.addNewEvent(this.calendarEvent, true))
          : ((this.calendarEvent.calendarId = c),
            this.editType == a.EventEditType.New
              ? a.core.calendarDataProxy.addNewEvent(this.calendarEvent, false)
              : (this.editType == a.EventEditType.DontKnow &&
                  (this.editType = a.EventEditType.AllInSeries),
                a.core.calendarDataProxy.editExistingEvent(
                  this.calendarEvent,
                  this.editType
                )));
        void 0 !== this.calendarEvent.reminders &&
        0 < this.calendarEvent.reminders.length &&
        !a.core.commonUserSettings.hasShownRemindersInfo
          ? (this.showMessage(
              "You have set reminders. Please note that this app relies on your default calendar to show the reminders.",
              true
            ),
            (a.core.commonUserSettings.hasShownRemindersInfo = true))
          : a.core.appStateHandler.back();
      }
    };
    d.prototype.readDateTimeToCalendarEvent = function () {
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
      a.core.zopHandler.updateStartEndZOP(this.calendarEvent);
      a.core.calendarEventHandler.gradeCalendarEvent(this.calendarEvent);
      a.core.calendarEventHandler.reorderAllEvents();
    };
    d.prototype.addMiliseconds = function (a) {
      return 5 == a.length ? a + ":00.000" : 8 == a.length ? a + ".000" : a;
    };
    d.prototype.editEventCancel = function (b) {
      b.preventDefault();
      this.calendarEvent.startDateTime = this.originalStartDate;
      this.calendarEvent.endDateTime = this.originalEndDate;
      this.calendarEvent.rruleToSave = this.originalRRule;
      this.calendarEvent.isRecurring = this.originalIsRecurring;
      a.core.zopHandler.updateStartEndZOP(this.calendarEvent);
      a.core.calendarEventHandler.gradeCalendarEvent(this.calendarEvent);
      a.core.calendarEventHandler.reorderAllEvents();
      a.core.appStateHandler.back();
    };
    d.prototype.doNothing = function (a) {};
    d.prototype.editEventDurationChanged = function (b) {
      b = a.core.domHandler.getSelectOptions(this.durationSelectElement);
      this.calendarEvent.endDateTime = moment(this.calendarEvent.startDateTime)
        .add("milliseconds", b)
        .toDate();
      this.updateRealDateInputs();
      this.updateFakes();
    };
    d.prototype.updateEndBasedOnDuration = function () {
      this.calendarEvent.endDateTime = moment(this.calendarEvent.startDateTime)
        .add("milliseconds", this.previousDuration)
        .toDate();
      this.updateRealDateInputs();
      this.updateFakes();
    };
    d.prototype.updateDuration = function () {
      this.previousDuration =
        this.calendarEvent.endDateTime.getTime() -
        this.calendarEvent.startDateTime.getTime();
      a.core.domHandler.addDurationsToSelectNode(
        this.durationSelectElement,
        this.calendarEvent.startDateTime,
        this.calendarEvent.endDateTime
      );
    };
    d.prototype.updateReminders = function () {
      void 0 == this.calendarEvent.reminders &&
        (this.calendarEvent.reminders = []);
      a.core.domHandler.addRemindersToSelectNode(
        this.remindersSelectElement,
        this.calendarEvent.reminders
      );
    };
    d.prototype.setByDuration = function (a) {};
    d.prototype.setByTime = function (a) {};
    d.prototype.editRecurrency = function (b) {
      this.canEditReccur &&
        a.core.appStateHandler.editRecurrence(this.calendarEvent);
    };
    d.prototype.moveEvent = function (b) {
      this.readDateTimeToCalendarEvent();
      this.hide();
      a.core.appStateHandler.startMoveCalendarEventObject(
        this.calendarEvent,
        a.core.domHandler.screenWidth / 2,
        a.core.domHandler.screenHeight / 2,
        a.EventEditType.DontKnow
      );
    };
    return d;
  })();
  a.EditEventControl = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
      this.pageHtml =
        '<div id="editRecurrenceTopBar" class="topBar">    <button id="editRecurrenceCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/></span><span>{#Cancel#}</span></button>    <button id="editRecurrenceOk" class="topBarButton" style="width:50%"><img src="images/check.svg" class="topBarImage"/></span><span>{#Ok#}</span></button></div><div class="pageContent" id="editRecurrenceArea" style="float:left; background-color: #E9E9E9;">        <div class="editRecurrencePopupContent pageTopPadding" id="editRecurrencePopupContent">            <div class="miniTitle sizedTitle">{#Frequency#}</div>            <div style="position: relative"><div class="inputBox">                <select class="base inputBase" id="editRecurrenceFrequency">                    <option class="inputOption" value="none">{#Not repeated#}</option>                    <option class="inputOption" value="day">{#Day#}</option>                    <option class="inputOption" value="week">{#Week#}</option>                    <option class="inputOption" value="month">{#Month#}</option>                    <option class="inputOption" value="year">{#Year#}</option>                </select>            </div></div>            <div id="daySelectionArea">                <div class="miniTitle sizedTitle">{#Every X day(s)#}</div>                <div style="position: relative"><div class="inputBox">                    <input type="number" class="base inputBase" name="task" id="dayInterval">                </div></div>            </div>            <div id="weekSelectionArea">                <div class="miniTitle sizedTitle">{#Every X week(s)#}</div>                <div style="position: relative"><div class="inputBox">                    <input type="number" class="base inputBase" name="task" id="weekInterval">                </div></div>                <div class="miniTitle sizedTitle">{#Week days#}</div>                <div style="position: relative"><div class="inputBox">                    <select id="weekDays" class="base inputBase maybeBig" multiple="multiple">                    </select>                </div></div>            </div>            <div id="monthSelectionArea">                <div class="miniTitle sizedTitle">{#Every X month(s)#}</div>                <div style="position: relative"><div class="inputBox">                    <input type="number" class="base inputBase" name="task" id="monthInterval">                </div></div>                <div class="miniTitle sizedTitle">{#Type#}</div>                <div style="position: relative"> <div class="inputBox">                     <select class="base inputBase" id="editRecurrenceMonthType">                        <option class="inputOption" value="date">?</option>                        <option class="inputOption" value="weekday">?</option>                    </select>                </div></div>            </div>            <div id="yearSelectionArea">                <div class="miniTitle sizedTitle">{#Every X year(s)#}</div>                <div style="position: relative"><div class="inputBox">                    <input type="number" class="base inputBase" name="task" id="yearInterval">                </div></div>            </div>            <div class="miniTitle sizedTitle">{#End#}</div>                <div style="position: relative"><div class="inputBox">                     <select class="base inputBase" id="editRecurrenceEnd">                         <option class="inputOption" value="forever">{#Forever#}</option>                         <option class="inputOption" value="untildate">{#End before a date#}</option>                         <option class="inputOption" value="numberoftimes">{#Repeat X times#}</option>                    </select>                </div></div>                <div class="miniTitle sizedTitle" id="numberoftimes_input_title">{#Repeat X times#}</div>                <div style="position: relative"><div class="inputBox">                     <input type="number" class="base inputBase" name="task" id="numberoftimes_input">                </div></div>                <div class="miniTitle sizedTitle" id="untildate_input_title">{#End before#}</div>                <div style="position: relative"><div class="inputBox">                     <input type="date" class="base inputBase inputDate" name="task" id="untildate_input">                </div></div>            </div>        </div></div><br/><br/>';
    }
    d.prototype.reshow = function () {
      this.show();
    };
    d.prototype.init = function (a) {
      this.calendarEvent = a;
    };
    d.prototype.show = function () {
      var b = this;
      a.core.calendarDataProxy.analyticsPage("Edit recurrence page");
      this.editPage = a.core.domHandler.pageHtmlFormatHelper(
        "editRecurrence",
        this.pageHtml
      );
      this.editPage.style.display = "block";
      a.core.domHandler.resizeDomElements();
      a.core.domHandler.resizeDomElements();
      a.core.domHandler.resizeDomElements =
        a.core.domHandler.resizeDomElements.bind(a.core.domHandler);
      window.setTimeout(a.core.domHandler.resizeDomElements, 0);
      window.setTimeout(a.core.domHandler.resizeDomElements, 100);
      var c = (a.core.settings.titleWidth / a.core.ratio - 24) / 2;
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
      a.core.domHandler.addWeekDaysToSelectNode(this.weekDays);
      a.core.domHandler.addEvent(
        "editRecurrenceFrequency",
        "change",
        this.editRecurrenceFrequencyChanged,
        this
      );
      a.core.domHandler.addEvent(
        "editRecurrenceEnd",
        "change",
        this.editRecurrenceEndChanged,
        this
      );
      a.core.domHandler.addClickEvent(
        "editRecurrenceOk",
        this.editRecurrenceOk,
        this
      );
      a.core.domHandler.addClickEvent(
        "editRecurrenceCancel",
        this.editRecurrenceCancel,
        this
      );
      this.loadSettings = this.loadSettings.bind(this);
      c = a.core.translate
        .get("On day %1 of each month")
        .replace("%1", "" + this.calendarEvent.startDateTime.getDate());
      this.editRecurrenceMonthType[0].text = c;
      var c = a.core.translate.get("On %1, week %2 of each month"),
        e = Math.floor(this.calendarEvent.startDateTime.getDate() / 7) + 1,
        c = c.replace(
          "%1",
          "" + moment(this.calendarEvent.startDateTime).format("dddd")
        ),
        c = c.replace("%2", "" + e);
      this.editRecurrenceMonthType[1].text = c;
      var f = this;
      a.core.dynamicallyLoadFile("libs/rrule.js", "js", function () {
        void 0 === b.calendarEvent.rruleToSave &&
          ((b.calendarEvent.rruleToSave = new RRule()),
          (b.calendarEvent.rruleToSave.options.count = 10),
          (b.calendarEvent.rruleToSave.options.freq = a.RRuleFrequencies.Week),
          (b.calendarEvent.rruleToSave.options.interval = 1),
          (b.calendarEvent.rruleToSave.options.byweekday = [
            b.calendarEvent.startDateTime.getDay() - 1,
          ]));
        f.loadSettings(b.calendarEvent.rruleToSave);
      });
      this.editPage.style.display = "block";
    };
    d.prototype.loadSettings = function (b) {
      this.yearInterval.value = b.options.interval.toString();
      this.monthInterval.value = b.options.interval.toString();
      this.weekInterval.value = b.options.interval.toString();
      this.dayInterval.value = b.options.interval.toString();
      if (b.options.freq == a.RRuleFrequencies.Year)
        this.editRecurrenceFrequency.value = "year";
      else if (b.options.freq == a.RRuleFrequencies.Month)
        (this.editRecurrenceFrequency.value = "month"),
          (this.editRecurrenceMonthType.value =
            void 0 == b.options.bynweekday || 0 == b.options.bynweekday.length
              ? "date"
              : "weekday");
      else if (b.options.freq == a.RRuleFrequencies.Week) {
        this.editRecurrenceFrequency.value = "week";
        for (var c = 0; c < this.weekDays.options.length; c++)
          this.weekDays.options[c].selected = false;
        this.weekDays.options[0].selected =
          -1 < b.options.byweekday.indexOf(a.RRuleWeekDay.Monday);
        this.weekDays.options[1].selected =
          -1 < b.options.byweekday.indexOf(a.RRuleWeekDay.Tuesday);
        this.weekDays.options[2].selected =
          -1 < b.options.byweekday.indexOf(a.RRuleWeekDay.Wednesday);
        this.weekDays.options[3].selected =
          -1 < b.options.byweekday.indexOf(a.RRuleWeekDay.Thursday);
        this.weekDays.options[4].selected =
          -1 < b.options.byweekday.indexOf(a.RRuleWeekDay.Friday);
        this.weekDays.options[5].selected =
          -1 < b.options.byweekday.indexOf(a.RRuleWeekDay.Saturday);
        this.weekDays.options[6].selected =
          -1 < b.options.byweekday.indexOf(a.RRuleWeekDay.Sunday);
      } else
        b.options.freq == a.RRuleFrequencies.Day &&
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
    };
    d.prototype.hide = function () {
      a.core.domHandler.removeElement(this.editPage.id);
    };
    d.prototype.editRecurrenceFrequencyChanged = function (a) {
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
    };
    d.prototype.editRecurrenceEndChanged = function (a) {
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
    };
    d.prototype.editRecurrenceOk = function (b) {
      b = new RRule();
      if ("year" == this.editRecurrenceFrequency.value)
        (b.options.freq = a.RRuleFrequencies.Year),
          (b.options.interval = this.yearInterval.valueAsNumber);
      else if ("month" == this.editRecurrenceFrequency.value) {
        if (
          ((b.options.freq = a.RRuleFrequencies.Month),
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
          ? ((b.options.freq = a.RRuleFrequencies.Week),
            (b.options.byweekday = []),
            (b.options.interval = this.weekInterval.valueAsNumber),
            this.weekDays.options[0].selected &&
              b.options.byweekday.push(a.RRuleWeekDay.Monday),
            this.weekDays.options[1].selected &&
              b.options.byweekday.push(a.RRuleWeekDay.Tuesday),
            this.weekDays.options[2].selected &&
              b.options.byweekday.push(a.RRuleWeekDay.Wednesday),
            this.weekDays.options[3].selected &&
              b.options.byweekday.push(a.RRuleWeekDay.Thursday),
            this.weekDays.options[4].selected &&
              b.options.byweekday.push(a.RRuleWeekDay.Friday),
            this.weekDays.options[5].selected &&
              b.options.byweekday.push(a.RRuleWeekDay.Saturday),
            this.weekDays.options[6].selected &&
              b.options.byweekday.push(a.RRuleWeekDay.Sunday))
          : "day" == this.editRecurrenceFrequency.value &&
            ((b.options.freq = a.RRuleFrequencies.Day),
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
    };
    d.prototype.editRecurrenceCancel = function (a) {
      this.hide();
      history.back();
    };
    return d;
  })();
  a.EditRecurrenceControl = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
      this.pageHtml =
        '<div id="editRecurrenceMenu" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div id="editRecurrenceOnlyOne" class="base menuItem">{#Only edit this event#}</div>    <div id="editRecurrenceAll" class="base menuItem">{#Edit the whole series#}</div>    \x3c!--<div id="editRecurrenceFuture" class="base menuItem">{#Edit this and future events#}</div>--\x3e    <div id="editRecurrenceCancel" class="base menuItem">{#Cancel#}</div></div></div></div><div id="noEditMenu" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItemInfo">{#Sorry, this event can\'t be edited#}</div>    <div id="noEditOk" class="base menuItem">{#Ok#}</div></div></div></div><div id="deleteConfirmPopup" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div class="base menuItem" style="text-align:center">{#Delete?#}</div>    <div>        <button id="deleteConfirmCancel" class="topBarButton" style="width:50%"><img src="images/cross.svg" class="topBarImage"/><span>{#Cancel#}</span></button>        <button id="deleteConfirmOk" class="topBarButton" style="width:50%"><img src="images/check.svg" class="topBarImage"/><span>{#Ok#}</span></button>    </div></div></div></div><div id="deleteRecurrenceMenu" class="outer" style="display: none" > <div class="middle" > <div class="inner menu" >    <div id="deleteRecurrenceOnlyOne" class="base menuItem">{#Only delete this event#}</div>    <div id="deleteRecurrenceAll" class="base menuItem">{#Delete the whole series#}</div>    \x3c!--<div id="deleteRecurrenceFuture" class="base menuItem">{#Delete this and future events#}</div>--\x3e    <div id="deleteRecurrenceCancel" class="base menuItem">{#Cancel#}</div></div></div></div><div id="viewEventTopBar" class="topBar">    <button id="viewEventBack" class="topBarButton" style="width:39%">        _insertBackButtonImage        <span id="viewEventBackText" style="color: _buttonImageColor">{#Back#}</span>    </button>    \x3c!--<button id="viewEventMove" class="topBarButton" style="width:?%"><img src="images/clock.svg" class="topBarImage"/><span id="viewEventMoveText">{#Move#}</span></button>--\x3e    <button id="viewEventDelete" class="topBarButton" style="width:23%">        _insertTrashButtonImage    </button>    <button id="viewEventEdit" class="topBarButton" style="width:38%">        _insertPencilButtonImage        <span id="viewEventEditText" style="color: _buttonImageColor">{#Edit#}</span>    </button></div><div class="pageContent" id="viewEventArea" style="float:left">    <div id="viewEventTitle" class="topBarTitleX" style="width:100%"></div>    <div class="pagePadding pageTopPadding" style="padding-left:20px;padding-right:20px;">        <div class="editEventPopupContent" id="editEventPopupContent">            <br>            <br>            <div>                <div class="miniTitle">{#When#}</div>                <div class="pageContentText" id="viewEventTime1"></div>                <div class="pageContentText" id="viewEventTime2"></div>                <br>            </div>            <div id="viewEventBoxWhere">                <div class="miniTitle" id="viewEventTitleWhere">{#Where#}</div>                <div class="pageContentText" id="viewEventLocation"></div>                <br>            </div>            <div id="viewEventBoxDetails">                <div class="miniTitle" id="viewEventTitleDetails">{#Details#}</div>                <div class="pageContentText" id="viewEventDetails" style="white-space: pre-wrap;"></div>                <br>            </div>            <div>                <div class="miniTitle">{#Calendar#}</div>                <div class="pageContentText" id="viewEventCalendar"></div>                <br>            </div>            <div id="viewEventBoxReminders">                <div class="miniTitle">{#Reminders#}</div>                <div class="pageContentText" id="viewEventReminders"></div>                <br>            </div>            <div id="viewEventBoxInvited">                <div class="miniTitle">{#Invited#}</div>                <div class="pageContentText" id="viewEventInvited"></div>                <br>            </div>        </div>    </div></div><br/><br/>';
    }
    d.prototype.init = function (a) {
      this.calendarEvent = a;
    };
    d.prototype.reshow = function () {
      this.show();
    };
    d.prototype.show = function () {
      a.core.domHandler.hideCanvas();
      a.core.calendarDataProxy.analyticsPage("View event page");
      var b = a.core.domHandler.insertImages(
        this.pageHtml,
        a.core.helper.getEventTextColor(
          this.calendarEvent,
          a.core.getCalendar(this.calendarEvent.calendarId)
        )
      );
      this.viewPage = a.core.domHandler.pageHtmlFormatHelper("viewEvent", b);
      a.core.domHandler.resizeDomElements(
        a.core.helper.getEventColor2(this.calendarEvent)
      );
      a.core.domHandler.resizeDomElements(
        a.core.helper.getEventColor2(this.calendarEvent)
      );
      b = (a.core.settings.titleWidth / a.core.ratio - 24) / 2;
      document.getElementById("viewEventBack").style.padding = b + "px";
      document.getElementById("viewEventEdit").style.padding = b + "px";
      document.getElementById("viewEventDelete").style.padding = b + "px";
      document.getElementById("viewEventArea").style.top = "54px";
      a.core.showBackButtons()
        ? a.core.domHandler.addClickEvent(
            "viewEventBack",
            this.viewEventBack,
            this
          )
        : (a.core.domHandler.removeElement("viewEventBack"),
          (document.getElementById("viewEventEdit").style.width = "50%"),
          (document.getElementById("viewEventDelete").style.width = "50%"));
      a.core.calendarEventHandler.canEditEvent(this.calendarEvent)
        ? (a.core.domHandler.addClickEvent(
            "viewEventEdit",
            this.viewEventEdit,
            this
          ),
          a.core.domHandler.addClickEvent(
            "viewEventDelete",
            this.viewEventDelete,
            this
          ))
        : (a.core.domHandler.removeElement("viewEventEdit"),
          a.core.domHandler.removeElement("viewEventDelete"),
          a.core.showBackButtons() &&
            (document.getElementById("viewEventBack").style.width = "100%"));
      b = document.createElement("a");
      b.href =
        "https://web.archive.org/web/20190808203716/http://maps.google.com/?q=" +
        this.calendarEvent.location;
      b.className = "blueLink";
      a.core.domHandler.addElement(b, "viewEventLocation");
      this.viewPage.style.display = "block";
      document.getElementById("viewEventTitle").textContent =
        this.calendarEvent.summary;
      document.getElementById("viewEventTitle").style.color =
        a.core.helper.getEventTextColor(
          this.calendarEvent,
          a.core.getCalendar(this.calendarEvent.calendarId)
        );
      b.textContent = this.calendarEvent.location;
      document.getElementById("viewEventTime1").textContent =
        a.core.helper.GetDateTimeLine1(
          this.calendarEvent.startDateTime,
          this.calendarEvent.endDateTime
        );
      document.getElementById("viewEventTime2").textContent =
        a.core.helper.GetDateTimeLine2(
          this.calendarEvent.startDateTime,
          this.calendarEvent.endDateTime
        );
      document.getElementById("viewEventDetails").textContent =
        this.calendarEvent.description;
      document.getElementById("viewEventCalendar").textContent =
        a.core.getCalendar(this.calendarEvent.calendarId).name;
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
    };
    d.prototype.resize = function () {
      var a;
      a = this.verifySize("Back", false);
      a = this.verifySize("Edit", a);
      a = this.verifySize("Back", a);
      this.verifySize("Edit", a);
    };
    d.prototype.remindersToString = function () {
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
    };
    d.prototype.reminderToString = function (a) {
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
    };
    d.prototype.verifySize = function (b, c) {
      if (document.getElementById("viewEvent" + b)) {
        var e = document.getElementById("viewEvent" + b),
          f = document.getElementById("viewEvent" + b + "Text"),
          g = e.offsetWidth,
          g = g - (e.offsetHeight - 10),
          e = a.core.domHandler.getTextLength(f.textContent, f.style.fontSize);
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
    };
    d.prototype.hide = function () {
      a.core.appStateHandler.viewEventControlIsShowing = false;
      a.core.domHandler.showCanvas();
      a.core.domHandler.removeElement(this.viewPage.id);
    };
    d.prototype.viewEventBack = function (b) {
      a.core.appStateHandler.back();
    };
    d.prototype.viewEventDelete = function (b) {
      a.core.calendarEventHandler.canEditEvent(this.calendarEvent) &&
        (this.calendarEvent.isRecurring && this.calendarEvent.recurringEventId
          ? this.showDeleteRecurrenceMenu()
          : this.showDeleteConfirm());
    };
    d.prototype.deleteEvent = function () {
      a.core.appStateHandler.back();
      a.core.appStateHandler.deleteEvent(
        this.calendarEvent,
        a.EventEditType.DontKnow
      );
    };
    d.prototype.viewEventEdit = function (b) {
      a.core.calendarEventHandler.canEditEvent(this.calendarEvent) &&
        (this.calendarEvent.isRecurring && this.calendarEvent.recurringEventId
          ? a.core.calendarDataProxy.canEditRecurring(this.calendarEvent)
            ? this.showEditRecurrenceMenu()
            : this.showNoEditMenu()
          : (a.core.appStateHandler.back(),
            a.core.appStateHandler.editEvent(
              this.calendarEvent,
              a.EventEditType.DontKnow
            )));
    };
    d.prototype.showNoEditMenu = function () {
      document.getElementById("noEditMenu").style.display = "table";
      a.core.domHandler.addClickEvent("noEditOk", this.hideNoEditMenu, this);
    };
    d.prototype.hideNoEditMenu = function () {
      document.getElementById("noEditMenu").style.display = "none";
    };
    d.prototype.showDeleteConfirm = function () {
      document.getElementById("deleteConfirmPopup").style.display = "table";
      a.core.domHandler.addClickEvent(
        "deleteConfirmOk",
        this.deleteEvent,
        this
      );
      a.core.domHandler.addClickEvent(
        "deleteConfirmCancel",
        this.hideDeleteConfirm,
        this
      );
    };
    d.prototype.showEditRecurrenceMenu = function () {
      document.getElementById("editRecurrenceMenu").style.display = "table";
      a.core.domHandler.addClickEvent(
        "editRecurrenceOnlyOne",
        this.editRecurrenceOnlyOne,
        this
      );
      a.core.domHandler.addClickEvent(
        "editRecurrenceAll",
        this.editRecurrenceAll,
        this
      );
      a.core.domHandler.addClickEvent(
        "editRecurrenceCancel",
        this.hideEditRecurrenceMenu,
        this
      );
    };
    d.prototype.editRecurrenceOnlyOne = function () {
      this.hideEditRecurrenceMenu();
      a.core.appStateHandler.back();
      a.core.appStateHandler.editEvent(
        this.calendarEvent,
        a.EventEditType.ThisOnly
      );
    };
    d.prototype.editRecurrenceAll = function () {
      this.hideEditRecurrenceMenu();
      a.core.appStateHandler.back();
      a.core.appStateHandler.editEvent(
        this.calendarEvent,
        a.EventEditType.AllInSeries
      );
    };
    d.prototype.editRecurrenceFuture = function () {
      this.hideEditRecurrenceMenu();
      a.core.appStateHandler.back();
      a.core.appStateHandler.editEvent(
        this.calendarEvent,
        a.EventEditType.ThisAndFuture
      );
    };
    d.prototype.hideEditRecurrenceMenu = function () {
      document.getElementById("editRecurrenceMenu").style.display = "none";
    };
    d.prototype.hideDeleteConfirm = function () {
      document.getElementById("deleteConfirmPopup").style.display = "none";
    };
    d.prototype.showDeleteRecurrenceMenu = function () {
      document.getElementById("deleteRecurrenceMenu").style.display = "table";
      a.core.domHandler.addClickEvent(
        "deleteRecurrenceOnlyOne",
        this.deleteRecurrenceOnlyOne,
        this
      );
      a.core.domHandler.addClickEvent(
        "deleteRecurrenceAll",
        this.deleteRecurrenceAll,
        this
      );
      a.core.domHandler.addClickEvent(
        "deleteRecurrenceCancel",
        this.hideDeleteRecurrenceMenu,
        this
      );
    };
    d.prototype.deleteRecurrenceOnlyOne = function () {
      this.hideDeleteRecurrenceMenu();
      a.core.appStateHandler.back();
      a.core.appStateHandler.deleteEvent(
        this.calendarEvent,
        a.EventEditType.ThisOnly
      );
    };
    d.prototype.deleteRecurrenceAll = function () {
      this.hideDeleteRecurrenceMenu();
      a.core.appStateHandler.back();
      a.core.appStateHandler.deleteEvent(
        this.calendarEvent,
        a.EventEditType.AllInSeries
      );
    };
    d.prototype.deleteRecurrenceFuture = function () {
      this.hideDeleteRecurrenceMenu();
      a.core.appStateHandler.back();
      a.core.appStateHandler.deleteEvent(
        this.calendarEvent,
        a.EventEditType.ThisAndFuture
      );
    };
    d.prototype.hideDeleteRecurrenceMenu = function () {
      document.getElementById("deleteRecurrenceMenu").style.display = "none";
    };
    d.prototype.viewEventMove = function (b) {
      this.hide();
      a.core.calendarEventHandler.canEditEvent(this.calendarEvent) &&
        a.core.appStateHandler.startMoveCalendarEventObject(
          this.calendarEvent,
          a.core.domHandler.screenWidth / 2,
          a.core.domHandler.screenHeight / 2,
          a.EventEditType.DontKnow
        );
    };
    return d;
  })();
  a.ViewEventControl = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
      this.monthesShort = new a.Hashtable();
      this.monthesLong = new a.Hashtable();
      this.weekdayShort = new a.Hashtable();
      this.weekdayLong = new a.Hashtable();
    }
    d.prototype.colorToRGBA = function (a, c) {
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
    };
    d.prototype.GetDateTimeLine1 = function (a, c) {
      var b = moment(a),
        f = moment(c);
      return this.IsSameDay(b, f)
        ? b.format("dddd") + ", " + b.format("LL")
        : 0 == b.hours() && b.minutes()
        ? b.format("dddd") + ", " + b.format("LL") + " - "
        : b.format("dddd") + ", " + b.format("LLL") + " - ";
    };
    d.prototype.GetDateTimeLine2 = function (a, c) {
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
    };
    d.prototype.IsSameDay = function (a, c) {
      return a.format("L") == c.clone().subtract(1, "minutes").format("L");
    };
    d.prototype.GetDateWithWeekDay = function (a) {
      a = moment(a);
      return a.format("dddd") + ", " + a.format("LL");
    };
    d.prototype.GetTime = function (a) {
      return moment(a).format("LT");
    };
    d.prototype.isNullOrEmpty = function (a) {
      return !a || 0 === a.length;
    };
    d.prototype.isAndroid = function () {
      return navigator.userAgent.match(/Android/i);
    };
    d.prototype.isBlackBerry = function () {
      return navigator.userAgent.match(/BlackBerry/i);
    };
    d.prototype.isiOS = function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    };
    d.prototype.isOpera = function () {
      return navigator.userAgent.match(/Opera Mini/i);
    };
    d.prototype.isWindows = function () {
      return navigator.userAgent.match(/IEMobile/i);
    };
    d.prototype.isMobile = function () {
      return (
        this.isAndroid() ||
        this.isBlackBerry() ||
        this.isiOS() ||
        this.isOpera() ||
        this.isWindows()
      );
    };
    d.prototype.sortCalendars = function () {
      a.core.calendars.sort(function (b, c) {
        return c.id == a.core.calendarPrimaryId
          ? 1
          : b.id == a.core.calendarPrimaryId
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
        var b = 0, c = a.core.settings.theme.eventColors.length - 1, e = 0;
        e < a.core.calendars.length;
        e++
      )
        if (
          (a.core.calendars[e].allEventsAreFullDay &&
          !a.core.calendars[e].canEditCalendarEvents
            ? ((a.core.calendars[e].colorId = c), c--)
            : ((a.core.calendars[e].colorId = b), b++),
          0 > a.core.calendars[e].colorId && (a.core.calendars[e].colorId = 0),
          a.core.calendars[e].colorId >
            a.core.settings.theme.eventColors.length &&
            (a.core.calendars[e].colorId =
              a.core.settings.theme.eventColors.length - 1),
          a.core.commonUserSettings.licenceColorPicker &&
            a.core.commonUserSettings.savedCalendarColors &&
            a.core.commonUserSettings.savedCalendarColors.containsKey(
              a.core.calendars[e].id
            ))
        ) {
          var f =
            a.core.commonUserSettings.savedCalendarColors[
              a.core.calendars[e].id
            ];
          -1 < Number(f) &&
            100 > Number(f) &&
            (a.core.calendars[e].colorId = f);
        }
    };
    d.prototype.replaceAll = function (a, c, e) {
      return a.split(c).join(e);
    };
    d.prototype.canShowDatePicker = function () {
      return a.core.isCordovaApp ? true : false;
    };
    d.prototype.setCalendarColorId = function (b, c) {
      var e = a.core.commonUserSettings.savedCalendarColors;
      a.core.commonUserSettings.licenceColorPicker && e && e.containsKey(b)
        ? (e[b] = c)
        : e.add(b, c);
      a.core.commonUserSettings.savedCalendarColors = e;
    };
    d.prototype.getEventColor2 = function (b) {
      return this.getEventColor(b, a.core.getCalendar(b.calendarId));
    };
    d.prototype.getEventTextColor = function (b, c) {
      var e =
        a.core.settings.theme.eventTextColors[
          c.colorId % a.core.settings.theme.eventColors.length
        ];
      b &&
        void 0 != b.androidColorNum &&
        void 0 == b.extraColorId &&
        (b.extraColorId = this.getColorIdFromAndroidNum(b.androidColorNum));
      return b && b.extraColorId
        ? a.core.settings.theme.eventTextColors[
            b.extraColorId % a.core.settings.theme.eventTextColors.length
          ]
        : e;
    };
    d.prototype.getCalendarColor = function (b) {
      return a.core.settings.theme.eventColors[
        b.colorId % a.core.settings.theme.eventColors.length
      ];
    };
    d.prototype.getEventColor = function (b, c) {
      var e =
        a.core.settings.theme.eventColors[
          c.colorId % a.core.settings.theme.eventColors.length
        ];
      b &&
        void 0 != b.androidColorNum &&
        void 0 == b.extraColorId &&
        (b.extraColorId = this.getColorIdFromAndroidNum(b.androidColorNum));
      if (b && b.extraColorId)
        return a.core.settings.theme.eventColors[
          b.extraColorId % a.core.settings.theme.eventColors.length
        ];
      "" === e &&
        0 === c.colorId &&
        (null == b
          ? (e = a.core.settings.theme.eventColorsForFirstCalendar[3])
          : ((e = b.endZOP - b.startZOP),
            (e =
              e <
              a.core.zopHandler.zopSizeOfHour -
                a.core.zopHandler.zopSizeOf5Minutes
                ? a.core.settings.theme.eventColorsForFirstCalendar[4]
                : e <
                  a.core.zopHandler.zopSizeOfHour +
                    a.core.zopHandler.zopSizeOf5Minutes
                ? a.core.settings.theme.eventColorsForFirstCalendar[3]
                : e <
                  a.core.zopHandler.zopSizeOfDay -
                    a.core.zopHandler.zopSizeOf5Minutes
                ? a.core.settings.theme.eventColorsForFirstCalendar[2]
                : e <
                  a.core.zopHandler.zopSizeOfDay +
                    a.core.zopHandler.zopSizeOf5Minutes
                ? a.core.settings.theme.eventColorsForFirstCalendar[1]
                : a.core.settings.theme.eventColorsForFirstCalendar[0])));
      return e;
    };
    d.prototype.getAndroidNumFromColor = function (a) {
      a = this.hexToRgb(a);
      return -16777216 + (a[0] << 16) + (a[1] << 8) + a[2];
    };
    d.prototype.fillLeadingZeros = function (a, c) {
      var b = "000000000" + a;
      return b.substr(b.length - c);
    };
    d.prototype.getColorIdFromAndroidNum = function (b) {
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
        g < a.core.settings.theme.eventColors.length;
        g++
      )
        (f = this.getColorDistance(b, a.core.settings.theme.eventColors[g])),
          f < e && ((e = f), (c = g));
      return c;
    };
    d.prototype.getColorDistance = function (a, c) {
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
    };
    d.prototype.hexToRgb = function (a) {
      return [
        parseInt(a.substr(1, 2), 16),
        parseInt(a.substr(3, 2), 16),
        parseInt(a.substr(5, 2), 16),
      ];
    };
    d.prototype.addUserTimeZoneSetting = function (b) {
      var c = a.core.commonUserSettings.getCachedTimeZoneDiffInMinutes();
      b = new Date(b.getTime());
      b.setMinutes(b.getMinutes() + c);
      return b;
    };
    d.prototype.removeUserTimeZoneSetting = function (b) {
      var c = a.core.commonUserSettings.getCachedTimeZoneDiffInMinutes();
      b = new Date(b.getTime());
      b.setMinutes(b.getMinutes() - c);
      return b;
    };
    d.prototype.getNumberFromString = function (a, c) {
      return isNaN(+a) ? c : +a;
    };
    return d;
  })();
  a.Helper = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
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
    d.prototype.init = function () {
      a.core.mainMenuControl = new a.MainMenuControl();
      a.core.addButtonControl = new a.AddButtonControl();
      a.core.zopDrawArea.init(this.canvas, this.canvasContext);
    };
    d.prototype.getElement = function (a) {
      return document.getElementById(a);
    };
    d.prototype.addElement = function (a, c) {
      return this.getElement(a.id) ? a : this.getElement(c).appendChild(a);
    };
    d.prototype.addDiv = function (a, c, e) {
      if (this.getElement(a)) return this.getElement(a);
      var b = document.createElement("div");
      b.id = a;
      b.className = c;
      return this.addElement(b, e);
    };
    d.prototype.showCanvas = function () {
      a.core.calendarDataProxy.analyticsPage("Main page");
      this.addElement(this.canvas, document.body.id);
      this.resetDrawAreaSize_Delayed();
      a.core.redraw(true);
      window.setTimeout(function () {
        return a.core.redraw(true);
      }, 100);
    };
    d.prototype.insertImages = function (b, c) {
      var e = a.core.helper.replaceAll(
          b,
          "_insertBackButtonImage",
          this.backButtonImage
        ),
        e = a.core.helper.replaceAll(
          e,
          "_insertPencilButtonImage",
          this.pencilButtonImage
        ),
        e = a.core.helper.replaceAll(
          e,
          "_insertTrashButtonImage",
          this.trashButtonImage
        );
      return (e = a.core.helper.replaceAll(e, "_buttonImageColor", c));
    };
    d.prototype.hideCanvas = function () {
      this.removeElement(this.canvas.id);
    };
    d.prototype.pageHtmlFormatHelper = function (b, c) {
      for (
        var e = a.core.domHandler.addDiv(b, "page", "pageRoot"),
          f = a.core.domHandler.addDiv(b + "inner", "pageInner", b),
          g = 0;
        g < a.core.translate.keys.length;
        g++
      )
        c = this.replaceMultiple(
          c,
          "{#" + a.core.translate.keys[g] + "#}",
          a.core.translate.get(a.core.translate.keys[g])
        );
      f.innerHTML = c;
      return e;
    };
    d.prototype.replaceMultiple = function (a, c, e) {
      return a.split(c).join(e);
    };
    d.prototype.removeElement = function (a) {
      (a = this.getElement(a)) && a.parentNode && a.parentNode.removeChild(a);
    };
    d.prototype.addEvent = function (a, c, e, f) {
      e = e.bind(f);
      this.getElement(a).addEventListener(c, e, false);
    };
    d.prototype.addClickEvent = function (a, c, e) {
      this.addEvent(a, "click", c, e);
    };
    d.prototype.touchClickDown = function (a) {};
    d.prototype.touchClickUp = function (a) {};
    d.prototype.tryCreateHtmlElements = function () {
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
    };
    d.prototype.resetDrawAreaSize_Delayed = function () {
      this.resetDrawAreaSize = this.resetDrawAreaSize.bind(this);
      window.setTimeout(this.resetDrawAreaSize, 100);
      window.setTimeout(this.resetDrawAreaSize, 300);
    };
    d.prototype.resetDrawAreaSize = function () {
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
        a.core.ratio !== window.devicePixelRatio &&
        (a.core.ratio = window.devicePixelRatio);
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
          a.core.domRatio !== b / this.screenWidthForDOM
            ? (a.core.domRatio = b / this.screenWidthForDOM)
            : 1 !== a.core.domRatio && (a.core.domRatio = 1))
        : (a.core.domRatio = 1);
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
          (a.core.settings.zoom = Math.max(
            0.67,
            Math.min(
              1,
              Math.min(
                a.core.domHandler.screenWidthForDOM,
                a.core.domHandler.screenHeightForDOM
              ) / 300
            )
          )))
        : (a.core.settings.zoom = 1);
      this.tryCreateHtmlElements();
      this.screenWidth = Math.round(
        this.screenWidthForDOM * a.core.ratio * a.core.domRatio
      );
      this.screenHeight = Math.round(
        this.screenHeightForDOM * a.core.ratio * a.core.domRatio
      );
      a.core.setSizeSettings();
      this.canvas.style.width = this.screenWidthForDOM + "px";
      this.canvas.style.height = this.screenHeightForDOM + "px";
      this.canvas.style.position = "absolute";
      this.canvas.style.top = this.screenTopForDOM + "px";
      this.canvas.style.left = this.screenLeftForDOM + "px";
      this.canvas.style.zIndex = "2";
      this.canvas.width = this.screenWidth;
      this.canvas.height = this.screenHeight;
      a.core.settings.menuButtonBottom = 0.875 * a.core.settings.titleWidth;
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
      a.core.zopDrawArea.resetDrawAreaSize(this.screenHeight, this.screenWidth);
      a.core.mainMenuControl.resetDrawAreaSize(
        this.screenHeight,
        this.screenWidth
      );
      a.core.calendarEventHandler.drawAreaResized();
      a.core.mainMenuControl.drawAreaResized();
      a.core.addButtonControl.drawAreaResized();
      a.core.appStateHandler.viewEventControl.resize();
      a.core.appStateHandler.sizesInitiated = true;
      this.resizeDomElements();
      a.core.preloadAllImages();
      a.core.redraw(true);
      this.fadeInIfWebPage();
    };
    d.prototype.fadeInIfWebPage = function () {
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
    };
    d.prototype.resizeDomElements = function (b) {
      void 0 === b && (b = "");
      var c = Math.min(
          24,
          Math.max(
            11,
            Math.min(
              a.core.domHandler.screenWidthForDOM,
              a.core.domHandler.screenHeightForDOM
            ) / 19
          )
        ),
        e = Math.min(
          16,
          Math.max(
            10,
            Math.min(
              a.core.domHandler.screenWidthForDOM,
              a.core.domHandler.screenHeightForDOM
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
        b = a.core.settings.theme.colorTitleBackground;
      for (var k = 0; k < h.length; k++)
        h[k].style.backgroundColor = a.core.settings.theme.colorBackground;
      h = document.querySelectorAll(".pageContent");
      for (k = 0; k < h.length; k++)
        (h[k].style.fontFamily =
          '"' + a.core.settings.theme.textFont + '", arial, sans-serif'),
          (h[k].style.backgroundColor = "rgba(125, 125, 125, 0.08)");
      h = document.querySelectorAll(".topBarTitleX");
      for (k = 0; k < h.length; k++)
        h[k].style.fontFamily =
          '"' + a.core.settings.theme.titleBarFontBold + '", arial, sans-serif';
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
          (h[k].style.borderTopColor = a.core.settings.theme.colorWhite),
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
          (h[k].style.backgroundColor = a.core.settings.theme.colorBackground),
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
          (h[k].style.color = a.core.settings.theme.colorGrayText),
          (h[k].style.whiteSpace = "nowrap");
      h = document.querySelectorAll(".inputBase");
      for (k = 0; k < h.length; k++)
        (h[k].style.backgroundColor = "transparent"),
          (h[k].style.width = l - 2 * g + "px");
      h = document.querySelectorAll(".inputTab");
      for (k = 0; k < h.length; k++)
        (h[k].style.backgroundColor = a.core.settings.theme.colorBackground),
          (h[k].style.lineHeight = "0"),
          (h[k].style.width = l / 2 - 1 * g + "px"),
          (h[k].style.display = "inline-block"),
          (h[k].style.position = "absolute"),
          (h[k].style.textAlign = "center");
      h = document.querySelectorAll(".right");
      for (k = 0; k < h.length; k++) h[k].style.right = "0";
      h = document.querySelectorAll(".menuItem");
      for (k = 0; k < h.length; k++)
        (h[k].style.borderTopColor = a.core.settings.theme.colorWhite),
          (h[k].style.color = a.core.settings.theme.colorTagText),
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
      if (!new a.Helper().isMobile())
        for (k = 0; k < h.length; k++)
          (h[k].style.height = 6 * f + "px"),
            (h[k].style.lineHeight = 1.3 * c + "px"),
            (h[k].style.width = "100%"),
            (h[k].style.backgroundColor =
              a.core.settings.theme.colorBackground);
      h = document.querySelectorAll(".inputDate");
      for (k = 0; k < h.length; k++)
        (h[k].style.left = d + "px"), (h[k].style.width = l - 2 * g + "px");
      h = document.querySelectorAll(".tableWithMargin");
      for (k = 0; k < h.length; k++) h[k].style.marginRight = d + "px";
      h = document.querySelectorAll(".inputCheckBox");
      for (k = 0; k < h.length; k++)
        (h[k].style.width = f + "px"),
          (h[k].style.backgroundColor = "transparent"),
          "3" == a.core.commonUserSettings.theme
            ? (h[k].style.webkitAppearance = "none")
            : (h[k].style.fontSize = "0");
      h = document.querySelectorAll(".androidDown");
      if (new a.Helper().isAndroid())
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
          (h[k].style.background = a.core.settings.theme.colorBackground),
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
        h[k].style.color = a.core.settings.theme.colorHorizontalTitle;
      h = document.querySelectorAll(".miniTitle");
      for (k = 0; k < h.length; k++)
        h[k].style.color = a.core.helper.colorToRGBA(
          a.core.settings.theme.colorHorizontalTitle,
          0.5
        );
      h = document.querySelectorAll(".pageContentText");
      for (k = 0; k < h.length; k++)
        h[k].style.color = a.core.settings.theme.colorHorizontalTitle;
      h = document.querySelectorAll(".inputOption");
      for (k = 0; k < h.length; k++)
        (h[k].style.paddingTop = g + "px"),
          (h[k].style.backgroundColor = a.core.settings.theme.colorBackground);
    };
    d.prototype.overrideEnter = function (a) {
      if (
        13 == a.which &&
        "textarea" != a.target.type &&
        "button" != a.target.type
      )
        return a.target.blur(), false;
    };
    d.prototype.getSelectOptions = function (a) {
      for (var b = "", e = 0; e < a.options.length; e++)
        a.options[e].selected && (b += a.options[e].value);
      return b;
    };
    d.prototype.selectWeekDays = function (a, c) {
      for (var b = 0; b < a.options.length; b++)
        a.options[b].selected = -1 < c.indexOf(a.options[b].value);
    };
    d.prototype.addWeekDaysToSelectNode = function (b) {
      for (var c, e = 1; 7 >= e; e++)
        (c = new Option(
          a.core.helper.weekdayLong.find(e),
          "" + e,
          false,
          false
        )),
          (c.className = "inputOption"),
          b.appendChild(c);
    };
    d.prototype.addRemindersToSelectNode = function (b, c) {
      var e = [],
        f = moment(),
        g = f.clone().add("minutes", 0);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("minutes", 1);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("minutes", 5);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("minutes", 10);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("minutes", 15);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("minutes", 20);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("minutes", 25);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("minutes", 30);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("minutes", 45);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("hours", 1);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("minutes", 90);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("hours", 2);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("hours", 3);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("hours", 6);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("hours", 12);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("days", 1);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("days", 2);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      g = f.clone().add("days", 7);
      e.push(new a.NumberStringPair(g.diff(f, "minutes"), g.from(f, true)));
      for (var d = 0; d < c.length; d++)
        (g = f.clone().add("minutes", c[d].minutes)),
          this.addSortedIfNotExists(
            e,
            new a.NumberStringPair(c[d].minutes, g.from(f, true))
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
    };
    d.prototype.selectDuration = function (a, c, e) {};
    d.prototype.addDurationsToSelectNode = function (b, c, e) {
      var f = [];
      c = moment(c);
      var g = c.clone().add("minutes", 1),
        d = c.clone().add("minutes", 15);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 30);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 45);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 60);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 75);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 90);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 105);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 120);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("minutes", 150);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 3);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 4);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 6);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 8);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("hours", 12);
      f.push(new a.NumberStringPair(d.diff(c), d.from(c, true)));
      d = c.clone().add("days", 1);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 2);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 3);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 4);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 5);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 6);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 7);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 8);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 9);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 10);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 14);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("days", 21);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 1);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 2);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 3);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 4);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 6);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = c.clone().add("months", 12);
      f.push(new a.NumberStringPair(d.diff(g), d.from(c, true)));
      d = moment(e);
      this.addSortedIfNotExists(
        f,
        new a.NumberStringPair(d.diff(c), d.from(c, true))
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
    };
    d.prototype.addSortedIfNotExists = function (a, c) {
      for (var b = a.length, f = false, g = 0; g < b && 0 == f; g++)
        c.valueNumber < a[g].valueNumber && (a.splice(g, 0, c), (f = true)),
          c.valueNumber === a[g].valueNumber && (f = true);
      false === f && a.push(c);
    };
    return d;
  })();
  a.DomHandler = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
      this.showMessage = false;
      this.loadingCounter = 0;
    }
    d.prototype.showLoadingSpinnerIfNeeded = function () {
      if (0 < this.loadingCounter)
        if (
          !a.core.calendarDataProxy.connectionOk() ||
          (2e4 < a.core.getTimeStamp() - this.loadStartTime &&
            24e3 > a.core.getTimeStamp() - this.loadStartTime)
        )
          (this.loadingCounter = 0),
            (this.showMessage = true),
            (this.messageStartTime = a.core.getTimeStamp());
        else {
          if (a.core.drawArea && a.core.zopDrawArea) {
            var b = ((a.core.getTimeStamp() % 1e3) / 1e3) * 2 * Math.PI;
            a.core.drawArea.drawLoader(b);
          }
        }
      else 0 > this.loadingCounter && (this.loadingCounter = 0);
      this.showMessage &&
        (5e3 > a.core.getTimeStamp() - this.messageStartTime
          ? (a.core.drawArea.drawFilledRectangle(
              0,
              0,
              a.core.zopDrawArea.zopAreaWidth,
              a.core.settings.titleWidth +
                a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
              a.core.settings.theme.colorRed,
              false
            ),
            a.core.drawArea.drawCenteredText(
              a.core.translate.get("Connection failed"),
              0,
              (a.core.settings.titleWidth +
                a.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
                a.core.settings.menuTextHeight) /
                2,
              a.core.zopDrawArea.zopAreaWidth,
              a.core.settings.menuTextHeight,
              a.core.settings.theme.colorWhite,
              false,
              false
            ),
            a.core.redraw(true))
          : (this.showMessage = false));
    };
    d.prototype.isLoading = function () {
      return 0 < this.loadingCounter;
    };
    d.prototype.startLoading = function () {
      this.showMessage = false;
      a.core.eventHandler.closeAllPagesAndMenus();
      0 > this.loadingCounter
        ? (this.loadingCounter = 1)
        : this.loadingCounter++;
      a.core &&
        ((this.loadStartTime = a.core.getTimeStamp()), a.core.redraw(true));
    };
    d.prototype.stopLoadingWithError = function () {
      this.showMessage = true;
      this.stopLoading();
    };
    d.prototype.stopLoading = function () {
      this.loadingCounter = 0;
      a.core.redraw(true);
    };
    return d;
  })();
  a.LoadingHandler = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
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
      this.settingsControl = new a.SettingsControl();
      this.calendarsControl = new a.CalendarsControl();
      this.shopControl = new a.ShopControl();
      this.viewEventControl = new a.ViewEventControl();
      this.editEventControl = new a.EditEventControl();
      this.editRecurrenceControl = new a.EditRecurrenceControl();
    }
    d.prototype.isMainWindowShowing = function () {
      return (
        !this.isMainMenuShowing &&
        !this.editEventControlIsShowing &&
        !this.isChoosingDateTimeForEvent &&
        !this.isPopupEditRecurringMenuShowing &&
        !this.viewEventControlIsShowing
      );
    };
    d.prototype.setChoosingDateTimeForEvent = function (b) {
      (this.isChoosingDateTimeForEvent = b)
        ? (this.isPopupDissabled++,
          a.core.zopDrawArea &&
            (a.core.dateTimeSelectionHandler.makeVisible(true),
            a.core.redraw(true)))
        : (this.isPopupDissabled--,
          a.core.zopDrawArea &&
            (a.core.dateTimeSelectionHandler.makeVisible(false),
            a.core.redraw(true)));
    };
    d.prototype.viewEvent = function (b) {
      a.core.loadingHandler.isLoading() ||
        ((this.viewEventControlIsShowing = true),
        this.viewEventControl.init(b),
        this.addVisibleControl(this.viewEventControl));
    };
    d.prototype.editEvent = function (b, c) {
      a.core.loadingHandler.isLoading() ||
        ((this.editEventControlIsShowing = true),
        this.editEventControl.init(b, c),
        this.addVisibleControl(this.editEventControl));
    };
    d.prototype.deleteEvent = function (b, c) {
      a.core.calendarDataProxy.deleteEvent(b, c, false);
    };
    d.prototype.editRecurrence = function (a) {
      this.editRecurrenceControl.init(a);
      this.addVisibleControl(this.editRecurrenceControl);
    };
    d.prototype.startMoveCalendarEventObject = function (a, c, e, f) {};
    d.prototype.startAddCalendarEventObject = function (b, c) {
      var e = new a.CalendarEventObject(
        "",
        "",
        "",
        b,
        c,
        this.getDefaultCalendarId(),
        "-1"
      );
      this.editEvent(e, a.EventEditType.New);
    };
    d.prototype.getDefaultCalendarId = function () {
      var b = a.core.commonUserSettings.calendarIdLastAddedTo;
      if (
        a.core.getCalendar(b).visibility === a.VisibilityType.Visible &&
        a.core.getCalendar(b).canEditCalendarEvents
      )
        return b;
      for (var b = void 0, c = 0; c < a.core.calendars.length; c++)
        if (
          a.core.calendars[c].visibility === a.VisibilityType.Visible &&
          a.core.calendars[c].canEditCalendarEvents
        ) {
          b = a.core.calendars[c].id;
          break;
        }
      return void 0 == b ||
        a.core.getCalendar(a.core.calendarPrimaryId).visibility ===
          a.VisibilityType.Visible
        ? a.core.calendarPrimaryId
        : b;
    };
    d.prototype.addVisibleControl = function (a) {
      this.visibleControls[this.visibleControls.length - 1] !== a &&
        (history.pushState(
          {
            depth: this.visibleControls.length,
          },
          ""
        ),
        this.visibleControls.push(a),
        a.show());
    };
    d.prototype.back = function () {
      var b = a.core.getTimeStamp();
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
    };
    d.prototype.safeBack = function (a) {
      return this.visibleControls &&
        0 < this.visibleControls.length &&
        this.visibleControls[this.visibleControls.length - 1] === a
        ? this.back()
        : false;
    };
    d.prototype.mainButtonPressed = function () {
      if (!a.core.loadingHandler.isLoading()) {
        var b = a.core.zopHandler.dateToZOP(new Date());
        a.core.zopHandler.topZOP < b && a.core.zopHandler.bottomZOP > b
          ? this.showMainMenu(true)
          : a.core.zopHandler.showInitialBounds(true);
      }
    };
    d.prototype.showMainMenu = function (b) {
      a.core.loadingHandler.isLoading() ||
        (a.core.appStateHandler.isMainWindowShowing()
          ? ((a.core.appStateHandler.isMainMenuShowing = true),
            this.addVisibleControl(a.core.mainMenuControl),
            b && a.core.mainMenuControl.startOpenAnimation(),
            window.setTimeout(function () {
              return a.core.redraw(true);
            }, 100),
            window.setTimeout(function () {
              return a.core.redraw(true);
            }, 200))
          : this.back());
    };
    d.prototype.viewCalendars = function () {
      this.calendarsControlIsShowing = true;
      this.addVisibleControl(this.calendarsControl);
    };
    d.prototype.viewShop = function () {
      this.shopControlIsShowing = true;
      this.addVisibleControl(this.shopControl);
    };
    d.prototype.viewSettings = function () {
      this.settingsControlIsShowing = true;
      this.addVisibleControl(this.settingsControl);
    };
    d.prototype.viewAbout = function () {};
    return d;
  })();
  a.AppStateHandler = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
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
    d.prototype.reset = function () {
      this.rootCalendarDateObjects = [];
      this.weekCalendarDateObjects = [];
      this.rootCalendarDateObjects.push(
        new a.CalendarDateObject(
          a.CalendarDateObjectType.Title,
          a.core.settings.absoluteMinDate,
          a.core.settings.absoluteMaxDate
        )
      );
      var b = a.core.zopHandler.dateToZOP(a.core.settings.absoluteMinDate),
        c = a.core.zopHandler.dateToZOP(a.core.settings.absoluteMaxDate);
      a.core.zopHandler.setAbsoluteMinMax(b, c);
    };
    d.prototype.clearWeekInfo = function () {
      this.weekCalendarDateObjects = [];
    };
    d.prototype.selectCalendarDateObjectAt = function (b, c, e) {
      if (c < a.core.zopHandler.topPixel || c > a.core.zopHandler.bottomPixel)
        this.selectedCalendarDateObject = void 0;
      else
        return (
          (c = a.core.zopHandler.getZOPFromPixel(c)),
          (e = this.getHitCalendarDateObjectAmong(
            b,
            c,
            this.visibleLowestLevelObjects,
            a.core.settings.titleWidth
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
    };
    d.prototype.getClosestDetailAt = function (b, c) {
      if (
        !(b < a.core.zopHandler.topPixel || b > a.core.zopHandler.bottomPixel)
      ) {
        b = b - (b % c) + Math.round(c / 2);
        var e = b - c,
          f = e + 2 * c,
          g = a.core.zopHandler.getZOPFromPixel(b),
          e = a.core.zopHandler.getZOPFromPixel(e),
          d = a.core.zopHandler.getZOPFromPixel(f),
          f = this.getHitCalendarDateObjectAmong(
            a.core.settings.titleWidth + 1,
            g,
            this.visibleLowestLevelObjects,
            a.core.settings.titleWidth
          ),
          e = this.getHitCalendarDateObjectAmong(
            a.core.settings.titleWidth + 1,
            e,
            this.visibleLowestLevelObjects,
            a.core.settings.titleWidth
          ),
          d = this.getHitCalendarDateObjectAmong(
            a.core.settings.titleWidth + 1,
            d,
            this.visibleLowestLevelObjects,
            a.core.settings.titleWidth
          );
        if (f && e && d) {
          if (e !== d) return d;
          this.verifyDetailsArePopulatedFor(f);
          return (f = this.getHitCalendarDateObjectAmong(
            a.core.settings.titleWidth + 1,
            g,
            f.details,
            a.core.settings.titleWidth
          ));
        }
      }
    };
    d.prototype.convertCommonTimesToDates = function (b) {
      if (b != this.lastCommonTimesStartDate) {
        this.lastCommonTimesStartDate = b;
        this.commonDateTimes = [];
        var c;
        for (
          c = 0;
          c < a.core.calendarEventHandler.commonTimeKeys.length;
          c++
        ) {
          var e = a.core.calendarEventHandler.commonTimeKeys[c].timeKey,
            f = parseInt(e.substr(0, e.indexOf("-"))),
            e = parseInt(e.substr(e.indexOf("-") + 1)),
            d = new Date(b.getTime());
          d.setHours(f, e);
          this.commonDateTimes.push(d);
        }
      }
    };
    d.prototype.getCalendarDateObject = function (a, c, e) {
      this.verifyDetailsArePopulatedFor(e);
      for (var b = 0; b < e.details.length; b++) {
        var d = e.details[b];
        if (d.startZOP < a && d.endZOP > a)
          return d.calendarDateObjectType === c
            ? d
            : this.getCalendarDateObject(a, c, d);
      }
    };
    d.prototype.getClosestFakeDetailAt = function (b, c, e) {
      if (
        this.lowestLevelCalendarDateObjectType ==
          a.CalendarDateObjectType.Month &&
        !this.showMonthSpecialDetails
      )
        return this.getHitWeekAt(a.core.zopHandler.rightPixel - 1, b, false);
      if (
        this.lowestLevelCalendarDateObjectType == a.CalendarDateObjectType.Day
      ) {
        if (b < a.core.zopHandler.topPixel || b > a.core.zopHandler.bottomPixel)
          return;
        b = b - (b % c) + Math.round(c / 2);
        var f = b - c,
          d = f + 2 * c,
          m = a.core.zopHandler.getZOPFromPixel(b),
          f = a.core.zopHandler.getZOPFromPixel(f),
          n = a.core.zopHandler.getZOPFromPixel(d),
          d = this.getHitCalendarDateObjectAmong(
            a.core.settings.titleWidth + 1,
            m,
            this.visibleLowestLevelObjects,
            a.core.settings.titleWidth
          ),
          l = this.getHitCalendarDateObjectAmong(
            a.core.settings.titleWidth + 1,
            f,
            this.visibleLowestLevelObjects,
            a.core.settings.titleWidth
          ),
          h = this.getHitCalendarDateObjectAmong(
            a.core.settings.titleWidth + 1,
            n,
            this.visibleLowestLevelObjects,
            a.core.settings.titleWidth
          );
        if (!d || !l || !h) return;
        if (l !== h && e) return h;
        e = a.core.zopHandler.getDateFromZOP(f);
        m = a.core.zopHandler.getDateFromZOP(n);
        this.convertCommonTimesToDates(d.startDateTime);
        for (d = 0; d < this.commonDateTimes.length; d++)
          if (this.commonDateTimes[d] >= e && this.commonDateTimes[d] < m)
            return new a.CalendarDateObject(
              a.CalendarDateObjectType.Hour,
              this.commonDateTimes[d]
            );
        return this.getClosestDetailAt(b, c);
      }
      if (
        !(
          b < a.core.zopHandler.topPixel || b > a.core.zopHandler.bottomPixel
        ) &&
        ((b = b - (b % c) + Math.round(c / 2)),
        (f = b - c),
        (d = f + 2 * c),
        (m = a.core.zopHandler.getZOPFromPixel(b)),
        (f = a.core.zopHandler.getZOPFromPixel(f)),
        (n = a.core.zopHandler.getZOPFromPixel(d)),
        (d = this.getHitCalendarDateObjectAmong(
          a.core.settings.titleWidth + 1,
          m,
          this.visibleLowestLevelObjects,
          a.core.settings.titleWidth
        )),
        (l = this.getHitCalendarDateObjectAmong(
          a.core.settings.titleWidth + 1,
          f,
          this.visibleLowestLevelObjects,
          a.core.settings.titleWidth
        )),
        (h = this.getHitCalendarDateObjectAmong(
          a.core.settings.titleWidth + 1,
          n,
          this.visibleLowestLevelObjects,
          a.core.settings.titleWidth
        )),
        d && l && h)
      ) {
        if (l !== h && e) return h;
        this.verifyDetailsArePopulatedFor(d);
        return (d = this.getHitCalendarDateObjectAmong(
          a.core.settings.titleWidth + 1,
          m,
          d.details,
          a.core.settings.titleWidth
        ));
      }
    };
    d.prototype.getLowestLevelCalendarDateObjectAt = function (b) {
      b = a.core.zopHandler.getZOPFromPixel(b);
      return this.getHitCalendarDateObjectAmong(
        a.core.settings.titleWidth + 1,
        b,
        this.visibleLowestLevelObjects,
        a.core.settings.titleWidth
      );
    };
    d.prototype.getHitCalendarDateObjectAmong = function (a, c, e, f) {
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
    };
    d.prototype.clearSelect = function () {
      this.selectedObjects = [];
    };
    d.prototype.selectCalendarDateObject = function (a) {
      a && this.selectedObjects.push(a);
    };
    d.prototype.getHitWeekAt = function (b, c, e) {
      if (0 < this.weekNumbersVisible.length) {
        var f = a.core.zopHandler.getZOPFromPixel(c),
          d =
            a.core.zopHandler.getZOPFromPixelDiff(
              a.core.settings.weekCircleDiameter
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
                a.core.zopHandler.topZOP + d
              );
              if (f >= m - d && f <= m + d)
                return this.weekCalendarDateObjects[c];
            }
          } else if (
            f >= this.weekCalendarDateObjects[c].startZOP &&
            f <= this.weekCalendarDateObjects[c].endZOP &&
            b > a.core.settings.titleWidth
          )
            return this.weekCalendarDateObjects[c];
      }
    };
    d.prototype.gotoCalendarDateObjectAt = function (b, c) {
      var e = this.selectCalendarDateObjectAt(b, c, true);
      if (
        e &&
        e.calendarDateObjectType == this.lowestLevelCalendarDateObjectType &&
        this.showMonthSpecialDetails
      ) {
        var f = Math.max(
          a.core.zopHandler.getPixelFromZOP(e.startZOP),
          a.core.zopHandler.topPixel
        );
        if (c > f + this.horizontalTitleHeight) {
          e = a.core.zopHandler.getZOPFromPixel(c - 25 * a.core.ratio);
          f = a.core.zopHandler.getZOPFromPixel(c + 25 * a.core.ratio);
          a.core.drawAreaEffects.startAutoZoom(e, f, false, function () {});
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
            a.core.zopHandler.getZOPFromPixel(c),
            this.visibleHorizontalDateObjects,
            0
          ),
          f = Math.max(
            a.core.zopHandler.getPixelFromZOP(d.startZOP),
            a.core.zopHandler.topPixel
          );
        c < f + this.horizontalTitleHeight && (e = d);
      }
      this.gotoCalendarDateObject(e, c);
    };
    d.prototype.gotoCalendarDateObject = function (b, c) {
      this.selectCalendarDateObject(b);
      if (void 0 !== b)
        if (
          ((this.clearSelect = this.clearSelect.bind(this)),
          this.verifyDetailsArePopulatedFor(b),
          -1 < this.rootCalendarDateObjects.indexOf(b))
        ) {
          var e =
              a.core.zopHandler.getZOPFromPixel(c) -
              (b.endZOP - b.startZOP) / 2,
            f = e + (b.endZOP - b.startZOP);
          a.core.drawAreaEffects.startAutoZoom(e, f, false, this.clearSelect);
        } else
          (f = b.startZOP + (b.endZOP - b.startZOP)),
            a.core.drawAreaEffects.startAutoZoom(
              b.startZOP,
              f,
              false,
              this.clearSelect
            );
    };
    d.prototype.paintMarker = function (b) {
      var c = this.fakeLeft + a.core.settings.titleWidth;
      b = a.core.zopHandler.dateToZOP(b);
      var e = "3" != a.core.commonUserSettings.theme;
      a.core.zopDrawArea.drawHorizontalLineThick(
        c + 2 * a.core.settings.tagHeight,
        b,
        a.core.zopHandler.rightPixel - c - a.core.settings.tagHeight,
        a.core.settings.theme.colorMarker,
        2 * a.core.ratio,
        e
      );
      a.core.zopDrawArea.drawFilledCircle(
        c + 2 * a.core.settings.tagHeight,
        b,
        6 * a.core.ratio,
        a.core.settings.theme.colorMarker,
        e
      );
    };
    d.prototype.verifyWeGotEnoughWeekZOPs = function () {
      if (
        60 <
          (a.core.zopHandler.bottomZOP - a.core.zopHandler.topZOP) /
            a.core.zopHandler.zopSizeOfWeek ||
        200 < this.weekCalendarDateObjects.length
      )
        0 < this.weekCalendarDateObjects.length &&
          (this.weekCalendarDateObjects = []);
      else {
        var b = a.core.zopHandler.bottomZOP;
        0 < this.weekCalendarDateObjects.length &&
          (b = this.weekCalendarDateObjects[0].startZOP);
        for (; b > a.core.zopHandler.topZOP; ) {
          var c = this.getStartOfWeek(a.core.zopHandler.getDateFromZOP(b));
          a.core.zopHandler.dateToZOP(c.toDate());
          c.add(-1, "week");
          var e = this.getWeekNrForDate(c),
            b = a.core.zopHandler.dateToZOP(c.toDate()),
            c = new a.CalendarDateObject(
              a.CalendarDateObjectType.Week,
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
        for (; b < a.core.zopHandler.bottomZOP; )
          (b = this.getStartOfWeek(a.core.zopHandler.getDateFromZOP(b))),
            a.core.zopHandler.dateToZOP(b.toDate()),
            (e = this.getWeekNrForDate(b)),
            (c = new a.CalendarDateObject(
              a.CalendarDateObjectType.Week,
              new Date(b.toDate().getTime())
            )),
            b.add(1, "week"),
            (b = a.core.zopHandler.dateToZOP(b.toDate())),
            (c.shortText = "" + e),
            (c.longText = "Week " + e),
            (c.weekIsOdd = 1 == e % 2),
            (c.weekIsOddDubble = 1 == e % 4),
            this.weekCalendarDateObjects.push(c);
      }
    };
    d.prototype.getWeekNrForDate = function (b) {
      var c = b.dayOfYear(),
        e =
          ((b.clone().dayOfYear(1).isoWeekday() +
            1 -
            a.core.commonUserSettings.firstDayOfWeek) %
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
    };
    d.prototype.getStartOfWeek = function (b) {
      b = moment(b).startOf("day");
      b.isoWeekday() != a.core.commonUserSettings.firstDayOfWeek &&
        (b = b.isoWeekday(a.core.commonUserSettings.firstDayOfWeek));
      b.isoWeekday() < a.core.commonUserSettings.firstDayOfWeek &&
        (b = b.add("days", -7));
      return b;
    };
    d.prototype.paintWeeksBackground = function () {
      this.verifyWeGotEnoughWeekZOPs();
      var b = Math.min(
        255,
        Math.round(
          255 -
            (27 -
              (a.core.zopHandler.bottomZOP - a.core.zopHandler.topZOP) /
                a.core.zopHandler.zopSizeOfWeek)
        )
      );
      "3" == a.core.commonUserSettings.theme &&
        (b = Math.floor(25 + (255 - b) / 4));
      this.oddWeekColor = "rgb(" + b + ", " + b + ", " + b + ")";
      for (b = 0; b < this.weekCalendarDateObjects.length; b++)
        if (
          this.weekCalendarDateObjects[b].endZOP > a.core.zopHandler.topZOP &&
          this.weekCalendarDateObjects[b].startZOP < a.core.zopHandler.bottomZOP
        )
          if (
            "" === a.core.commonUserSettings.grayDays ||
            "1234567" === a.core.commonUserSettings.grayDays
          ) {
            if (
              this.weekCalendarDateObjects[b].weekIsOdd != this.currentWeekIsOdd
            ) {
              var c = Math.max(
                  a.core.zopHandler.getPixelFromZOP(
                    this.weekCalendarDateObjects[b].startZOP
                  ),
                  a.core.zopHandler.topPixel
                ),
                e = Math.min(
                  a.core.zopHandler.getPixelFromZOP(
                    this.weekCalendarDateObjects[b].endZOP
                  ),
                  a.core.zopHandler.bottomPixel
                );
              a.core.drawArea.drawFilledRectangle(
                this.fakeLeft + a.core.settings.titleWidth,
                c,
                a.core.zopHandler.rightPixel - this.fakeLeft,
                e - c,
                this.oddWeekColor,
                false
              );
            }
          } else
            for (
              var c = a.core.zopHandler.getPixelFromZOP(
                  this.weekCalendarDateObjects[b].startZOP
                ),
                e = a.core.zopHandler.getPixelFromZOP(
                  this.weekCalendarDateObjects[b].endZOP
                ),
                e = (e - c) / 7,
                f = 1;
              7 >= f;
              f++
            ) {
              var d = f + a.core.commonUserSettings.firstDayOfWeek - 1;
              7 < d && (d -= 7);
              -1 < a.core.commonUserSettings.grayDays.indexOf("" + d) &&
                ((d = Math.max(c + e * (f - 1), a.core.zopHandler.topPixel)),
                a.core.drawArea.drawFilledRectangle(
                  this.fakeLeft + a.core.settings.titleWidth,
                  d,
                  a.core.zopHandler.rightPixel - this.fakeLeft,
                  Math.min(c + e * f + 1, a.core.zopHandler.bottomPixel) - d,
                  this.oddWeekColor,
                  false
                ));
            }
    };
    d.prototype.paintWeekNumbers = function () {
      if (
        a.core.settings.allowWeekNumber &&
        a.core.commonUserSettings.showWeekNumbers
      ) {
        var b =
          (a.core.zopHandler.bottomZOP - a.core.zopHandler.topZOP) /
          a.core.zopHandler.zopSizeOfWeek;
        this.weekNumbersVisible = [];
        if (!(60 < b))
          for (var c = 0; c < this.weekCalendarDateObjects.length; c++)
            if (
              !(
                !(
                  this.weekCalendarDateObjects[c].endZOP >
                    a.core.zopHandler.topZOP &&
                  this.weekCalendarDateObjects[c].startZOP <
                    a.core.zopHandler.bottomZOP
                ) ||
                (15 < b && !this.weekCalendarDateObjects[c].weekIsOdd) ||
                (30 < b && !this.weekCalendarDateObjects[c].weekIsOddDubble)
              )
            ) {
              this.weekNumbersVisible.push(
                this.weekCalendarDateObjects[c].shortText
              );
              var e = a.core.zopHandler.getPixelFromZOP(
                this.weekCalendarDateObjects[c].startZOP
              );
              e <
                a.core.zopHandler.topPixel +
                  a.core.settings.weekCircleDiameter / 2 +
                  2 &&
                (e = Math.min(
                  a.core.zopHandler.topPixel +
                    a.core.settings.weekCircleDiameter / 2 +
                    2,
                  e +
                    a.core.zopHandler.getPixelSizeOfWeek() -
                    a.core.settings.weekCircleDiameter -
                    2
                ));
              a.core.zopDrawArea.drawFilledCircle2(
                a.core.zopHandler.rightPixel +
                  a.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
                  a.core.settings.weekCircleDiameter / 2 -
                  a.core.settings.margin,
                e,
                a.core.settings.weekCircleDiameter / 2 + 1 * a.core.ratio,
                a.core.settings.theme.colorWeekNumberShadow,
                false
              );
              a.core.zopDrawArea.drawFilledCircle2(
                a.core.zopHandler.rightPixel +
                  a.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
                  a.core.settings.weekCircleDiameter / 2 -
                  a.core.settings.margin,
                e,
                a.core.settings.weekCircleDiameter / 2,
                a.core.settings.theme.colorWeekNumberCircle,
                false
              );
              a.core.drawArea.drawCenteredText(
                this.weekCalendarDateObjects[c].shortText,
                a.core.zopHandler.rightPixel -
                  a.core.settings.weekCircleDiameter +
                  a.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
                  a.core.settings.margin -
                  0.5,
                e - a.core.settings.tagTextHeight / 1.6,
                a.core.settings.weekCircleDiameter,
                a.core.settings.tagTextHeight,
                a.core.settings.theme.colorWeekNumberText,
                false,
                true
              );
            }
      }
    };
    d.prototype.paintCalendarDateObjects = function () {
      var b;
      this.counter = 0;
      this.visibleHorizontalDateObjects = [];
      this.visibleTitleBarDateObjects = [];
      this.inVisibleTitle4Objects = [];
      this.visibleLowestLevelObjects = [];
      a.core.zopDrawArea.clearTextDivs();
      this.decideCalendarDateObjectTypesToShowAtDifferentLevels();
      this.decideFontSizes();
      this.currentWeekIsOdd = 1 == (moment(new Date()).week() - 1) % 2;
      this.fakeLeft =
        a.core.zopHandler.leftPixel +
        a.core.mainMenuControl.nudgeBecauseMenuBeingDragged;
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
      a.core.zopDrawArea.startTextDelayedDraw();
      this.paintWeeksBackground();
      a.core.zopDrawArea.canvasContext.globalAlpha = Math.max(
        0,
        -a.core.mainMenuControl.transparency
      );
      b = a.core.addButtonControl.getTitleExtraData();
      var c = (a.core.settings.titleWidth - a.core.settings.title0FontSize) / 2;
      b
        ? a.core.zopDrawArea.drawVerticalTitle(
            a.core.zopHandler.topZOP,
            a.core.zopHandler.bottomZOP,
            this.fakeLeft + c,
            b,
            a.core.settings.title0FontSize,
            a.core.settings.theme.colorTitleText,
            a.core.settings.margin,
            true,
            true
          )
        : this.paintVisibleTitleObjects(
            this.visibleTitleBarDateObjects,
            this.fakeLeft,
            c,
            false,
            a.core.settings.title0FontSize,
            true
          );
      a.core.zopDrawArea.canvasContext.globalAlpha = 1;
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
      a.core.zopDrawArea.endTextDelayedDraw();
      this.counter = this.counter;
    };
    d.prototype.decideCalendarDateObjectTypesToShowAtDifferentLevels =
      function () {
        this.lowestLevelCalendarDateObjectType = a.CalendarDateObjectType.Year;
        this.title4CalendarDateObjectType = void 0;
        this.titleBarDateObjectType = a.CalendarDateObjectType.Title;
        this.horizontalDateObjectType = void 0;
        this.showMonthSpecialDetails =
          a.core.zopHandler.getPixelSizeOfYear() >=
          4 * a.core.settings.minDateHeight;
        a.core.zopHandler.getPixelSizeOfMonth() >=
          a.core.settings.minDateHeight &&
          ((this.lowestLevelCalendarDateObjectType =
            a.CalendarDateObjectType.Month),
          (this.titleBarDateObjectType = a.CalendarDateObjectType.Year),
          (this.horizontalDateObjectType = void 0),
          (this.showMonthSpecialDetails =
            a.core.zopHandler.getPixelSizeOfMonth() >=
            7 * a.core.settings.minDateHeight));
        a.core.zopHandler.getPixelSizeOfDay() >=
          a.core.settings.minDateHeight &&
          ((this.lowestLevelCalendarDateObjectType =
            a.CalendarDateObjectType.Day),
          (this.titleBarDateObjectType = a.CalendarDateObjectType.Month),
          (this.horizontalDateObjectType = void 0),
          (this.showMonthSpecialDetails =
            a.core.zopHandler.getPixelSizeOfDay() >=
            6 * a.core.settings.minDateHeight));
        a.core.zopHandler.getPixelSizeOfHour() >=
          a.core.settings.minDateHeight &&
          ((this.lowestLevelCalendarDateObjectType =
            a.CalendarDateObjectType.Hour),
          (this.titleBarDateObjectType = a.CalendarDateObjectType.Month),
          (this.horizontalDateObjectType = a.CalendarDateObjectType.Day),
          (this.showMonthSpecialDetails =
            a.core.zopHandler.getPixelSizeOfHour() >=
            6 * a.core.settings.minDateHeight));
        a.core.zopHandler.getPixelSizeOf5Minutes() >=
          a.core.settings.minDateHeight &&
          ((this.lowestLevelCalendarDateObjectType =
            a.CalendarDateObjectType.Minutes5),
          (this.title4CalendarDateObjectType = a.CalendarDateObjectType.Hour),
          (this.titleBarDateObjectType = a.CalendarDateObjectType.Month),
          (this.horizontalDateObjectType = a.CalendarDateObjectType.Day),
          (this.showMonthSpecialDetails =
            a.core.zopHandler.getPixelSizeOf5Minutes() >=
            6 * a.core.settings.minDateHeight));
      };
    d.prototype.decideFontSizes = function () {
      this.averageObjectPixelHeight = 0;
      this.lowestLevelCalendarDateObjectType ===
        a.CalendarDateObjectType.Year &&
        ((this.averageObjectPixelHeight =
          a.core.zopHandler.getPixelSizeOfYear()),
        (this.averageObjectPixelHeight2 =
          a.core.zopHandler.getPixelSizeOfMonth()));
      this.lowestLevelCalendarDateObjectType ===
        a.CalendarDateObjectType.Month &&
        ((this.averageObjectPixelHeight =
          a.core.zopHandler.getPixelSizeOfMonth()),
        (this.averageObjectPixelHeight2 =
          a.core.zopHandler.getPixelSizeOfDay()));
      this.lowestLevelCalendarDateObjectType === a.CalendarDateObjectType.Day &&
        ((this.averageObjectPixelHeight =
          a.core.zopHandler.getPixelSizeOfDay()),
        (this.averageObjectPixelHeight2 =
          a.core.zopHandler.getPixelSizeOfHour()));
      this.lowestLevelCalendarDateObjectType ===
        a.CalendarDateObjectType.Hour &&
        ((this.averageObjectPixelHeight =
          a.core.zopHandler.getPixelSizeOfHour()),
        (this.averageObjectPixelHeight2 =
          a.core.zopHandler.getPixelSizeOf5Minutes()));
      this.lowestLevelCalendarDateObjectType ===
        a.CalendarDateObjectType.Minutes5 &&
        ((this.averageObjectPixelHeight =
          a.core.zopHandler.getPixelSizeOf5Minutes()),
        (this.averageObjectPixelHeight2 = this.averageObjectPixelHeight / 10));
      this.smallDividerColor =
        a.core.settings.theme.colorBigDateDividerStr +
        Math.min(
          1,
          (1.5 * this.averageObjectPixelHeight) /
            a.core.zopDrawArea.zopAreaHeight
        ) +
        ")";
      this.bigDividerColor =
        a.core.settings.theme.colorBigDateDividerStr + "1 )";
      this.innerMarginTop = a.core.settings.innerTopMaxMargin;
      for (var b = 0; 2 > b; b++)
        (this.textHeight = Math.round(
          Math.min(
            this.averageObjectPixelHeight - 2 * this.innerMarginTop,
            a.core.settings.dateBigTextSize
          )
        )),
          (this.horizontalTitleTextHeight = a.core.settings.dateBigTextSize),
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
        a.CalendarDateObjectType.Month
          ? a.core.settings.innerTopMaxMargin
          : 0;
      for (b = 0; 2 > b; b++)
        (this.textHeight2 = Math.round(
          Math.min(
            a.core.settings.minDateHeight - 2 * this.innerMarginTop2,
            a.core.settings.dateBigTextSize
          )
        )),
          (this.textHeight2 = Math.round(
            Math.min(this.textHeight2, 1.1 * this.averageObjectPixelHeight2)
          )),
          (this.extraTextHeight2 = Math.round(
            Math.min(0.6 * this.textHeight2, a.core.settings.dateBigTextSize)
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
          a.CalendarDateObjectType.Day &&
        this.textHeight >= a.core.settings.dateBigTextSize;
      this.showExtraTextBelow2 =
        this.lowestLevelCalendarDateObjectType ===
          a.CalendarDateObjectType.Month &&
        this.textHeight2 >= a.core.settings.dateBigTextSize;
      this.showExtraTextToRight =
        this.lowestLevelCalendarDateObjectType ===
          a.CalendarDateObjectType.Hour ||
        this.lowestLevelCalendarDateObjectType ===
          a.CalendarDateObjectType.Minutes5;
      this.showExtraTextToRight2 =
        this.lowestLevelCalendarDateObjectType ===
          a.CalendarDateObjectType.Day ||
        this.lowestLevelCalendarDateObjectType ===
          a.CalendarDateObjectType.Minutes5;
      this.useDividerLine = this.averageObjectPixelHeight > 25 * a.core.ratio;
      this.hourWidth = Math.round(
        a.core.zopDrawArea.measureTextWidth("22", this.textHeight, false, false)
      );
      this.hourWidth2 = Math.round(
        a.core.zopDrawArea.measureTextWidth(
          "22",
          this.textHeight2,
          false,
          false
        )
      );
      this.horizontalTitleHeight =
        this.horizontalTitleTextHeight +
        (this.lowestLevelCalendarDateObjectType ==
        a.CalendarDateObjectType.Month
          ? 0
          : this.horizontalTitleExtraTextHeight) +
        a.core.settings.innerTopMaxMargin +
        a.core.settings.margin;
    };
    d.prototype.decideVisibleObjects = function (b, c) {
      if (0 === c.length) {
        if (b === a.CalendarDateObjectType.Title)
          return this.rootCalendarDateObjects;
        if (b === a.CalendarDateObjectType.Year)
          return this.getVisibleChildCalendarDateObjects(
            this.rootCalendarDateObjects
          );
        if (b === a.CalendarDateObjectType.Month)
          return this.getVisibleChildCalendarDateObjects(
            this.getVisibleChildCalendarDateObjects(
              this.rootCalendarDateObjects
            )
          );
      } else if (b == a.CalendarDateObjectType.Minutes5)
        return this.getVisibleChildCalendarDateObjects(
          this.getVisibleChildCalendarDateObjects(c)
        );
      return this.getVisibleChildCalendarDateObjects(c);
    };
    d.prototype.paintVisibleTitleObjects = function (b, c, e, f, d, m) {
      var g = b.length;
      if (0 !== g) {
        var l, h, k;
        for (l = 0; l < g; l++)
          (h = b[l]),
            this.drawHorizontalLine(h, a.core.zopHandler.topZOP),
            this.title4CalendarDateObjectType != h.calendarDateObjectType &&
              ((k = h.longText),
              true === f && (k = k + " (" + h.parentText + ")"),
              a.core.zopDrawArea.drawVerticalTitle(
                h.startZOP,
                h.endZOP,
                c + e,
                k,
                d,
                a.core.settings.theme.colorTitleText,
                a.core.settings.margin,
                true,
                m
              ));
      }
    };
    d.prototype.drawHorizontalLine = function (b, c) {
      var e =
        a.core.zopHandler.leftPixel +
        a.core.settings.titleWidth +
        1 * a.core.ratio +
        a.core.mainMenuControl.nudgeBecauseMenuBeingDragged;
      b.endZOP < c ||
        b.calendarDateObjectType < this.lowestLevelCalendarDateObjectType ||
        (b.calendarDateObjectType == this.lowestLevelCalendarDateObjectType
          ? this.useDividerLine &&
            a.core.zopDrawArea.drawHorizontalLine(
              e,
              b.endZOP,
              a.core.zopHandler.rightPixel - e,
              this.smallDividerColor,
              false
            )
          : b.calendarDateObjectType == this.horizontalDateObjectType
          ? this.useDividerLine &&
            a.core.zopDrawArea.drawHorizontalLine(
              e,
              b.endZOP,
              a.core.zopHandler.rightPixel - e,
              this.bigDividerColor,
              false
            )
          : a.core.zopHandler.getPixelFromZOP(b.endZOP) <=
            a.core.settings.menuButtonBottom
          ? a.core.zopDrawArea.drawHorizontalLine(
              e,
              b.endZOP,
              a.core.zopHandler.rightPixel,
              this.bigDividerColor,
              false
            )
          : a.core.zopDrawArea.drawHorizontalLine(
              a.core.zopHandler.leftPixel,
              b.endZOP,
              a.core.zopHandler.rightPixel,
              this.bigDividerColor,
              false
            ));
    };
    d.prototype.verifyDetailsArePopulatedFor = function (a) {
      a.detailsArePopulated || this.populateDetails(a);
    };
    d.prototype.prepareThouroughRedraw = function (a) {
      void 0 == a && (a = this.rootCalendarDateObjects[0]);
      for (var b = a.details.length, e = 0; e < b; e++)
        (a.possibleEventTagsAtThisZoomLevel = []),
          this.prepareThouroughRedraw(a.details[e]);
    };
    d.prototype.getVisibleChildCalendarDateObjects = function (b) {
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
            a.core.zopHandler.isObjectBelowExtendedScreen(n.startZOP)
              ? (e = f + 1)
              : a.core.zopHandler.isObjectAboveExtendedScreen(n.endZOP) ||
                l.push(n);
      return l;
    };
    d.prototype.paintVisibleLowestObjects = function () {
      var b,
        c = this.visibleLowestLevelObjects.length,
        e;
      for (b = 0; b < c; b++)
        (e = this.visibleLowestLevelObjects[b]),
          this.paintObject(
            e,
            this.showMonthSpecialDetails,
            a.core.zopHandler.topPixel,
            0
          );
      return true;
    };
    d.prototype.paintVisibleHorizontalTitles = function () {
      var b,
        c = this.visibleHorizontalDateObjects.length,
        e;
      for (b = 0; b < c; b++)
        (e = this.visibleHorizontalDateObjects[b]),
          this.paintObject(e, true, a.core.zopHandler.topPixel, 0);
      var f = this.horizontalTitleHeight;
      for (b = 0; b < c; b++)
        (e = this.visibleHorizontalDateObjects[b]),
          this.paintDaySpecialDetails(e, f);
      return true;
    };
    d.prototype.populateDetails = function (a) {
      this.populateDetails_helper(a);
    };
    d.prototype.populateDetails_helper = function (b) {
      b.details = [];
      for (var c = new Date(b.startDateTime.getTime()); c < b.endDateTime; ) {
        var e;
        b.calendarDateObjectType === a.CalendarDateObjectType.Title &&
          ((e = new a.CalendarDateObject(
            a.CalendarDateObjectType.Year,
            new Date(c.getTime())
          )),
          c.setFullYear(c.getFullYear() + 1));
        if (b.calendarDateObjectType === a.CalendarDateObjectType.Year)
          (e = new a.CalendarDateObject(
            a.CalendarDateObjectType.Month,
            new Date(c.getTime())
          )),
            c.setMonth(c.getMonth() + 1);
        else if (b.calendarDateObjectType === a.CalendarDateObjectType.Month)
          (e = new a.CalendarDateObject(
            a.CalendarDateObjectType.Day,
            new Date(c.getTime())
          )),
            c.setDate(c.getDate() + 1);
        else if (b.calendarDateObjectType === a.CalendarDateObjectType.Day)
          (e = new a.CalendarDateObject(
            a.CalendarDateObjectType.Hour,
            new Date(c.getTime())
          )),
            (c = this.addHours(c, 1));
        else if (b.calendarDateObjectType === a.CalendarDateObjectType.Hour)
          (e = new a.CalendarDateObject(
            a.CalendarDateObjectType.Minutes5,
            new Date(c.getTime())
          )),
            (c = this.addMinutes(c, 5));
        else if (b.calendarDateObjectType === a.CalendarDateObjectType.Minutes5)
          break;
        void 0 !== e &&
          null !== e &&
          (b.details.push(e),
          a.core.calendarEventHandler.copyEventsFromParent(b, e));
      }
      b.detailsArePopulated = true;
      a.core.redraw(false);
    };
    d.prototype.addMinutes = function (a, c) {
      return new Date(a.getTime() + 6e4 * c);
    };
    d.prototype.addHours = function (a, c) {
      return new Date(a.getTime() + 36e5 * c);
    };
    d.prototype.paintObject = function (b, c, e, f) {
      this.counter += 1;
      if (
        !a.core.zopHandler.isObjectBelowScreen(b.startZOP) &&
        !a.core.zopHandler.isObjectAboveScreen(b.endZOP)
      ) {
        var d =
            this.fakeLeft +
            (a.core.settings.titleWidth + a.core.settings.innerLeftMargin),
          m = Math.max(
            0,
            (c ? this.horizontalTitleTextHeight : this.textHeight) - f
          ),
          n = Math.max(
            0,
            (c ? this.horizontalTitleExtraTextHeight : this.extraTextHeight) - f
          );
        f = this.innerMarginTop + f;
        var l = c ? a.core.settings.innerTopMaxMargin : f,
          h = a.core.zopHandler.getPixelFromZOP(b.startZOP) + l;
        if (h < e + l)
          if (
            ((h = Math.min(
              e + l,
              a.core.zopHandler.getPixelFromZOP(b.endZOP) - m - n - f
            )),
            c)
          )
            this.topDateBottom =
              h +
              m +
              (this.lowestLevelCalendarDateObjectType ===
              a.CalendarDateObjectType.Month
                ? 0
                : n) +
              a.core.settings.innerTopMaxMargin +
              a.core.settings.margin;
          else if (h < e && this.horizontalDateObjectType)
            if (h + this.horizontalTitleHeight > e)
              (f = Math.max(
                0,
                a.core.settings.minDateHeight - (h + m + n - e)
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
        this.drawHorizontalLine(b, a.core.zopHandler.getZOPFromPixel(e));
        e = a.core.zopDrawArea.drawCalendarDateObjectName(
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
          ? a.core.zopDrawArea.drawCalendarDateObjectName(
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
          ? a.core.zopDrawArea.drawCalendarDateObjectName(
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
          ? a.core.zopDrawArea.drawCalendarDateObjectName(
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
            (a.core.zopDrawArea.drawCalendarDateObjectName(
              d + 1 + e,
              h,
              2,
              b.shortText2,
              n,
              b.isRed,
              false,
              c
            ),
            a.core.zopDrawArea.drawCalendarDateObjectName(
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
    };
    d.prototype.paintMonthSpecialDetails = function (b, c) {
      this.verifyDetailsArePopulatedFor(b);
      var e,
        f = a.core.zopHandler.getPixelFromZOP(b.startZOP),
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
                (a.core.settings.minDateHeight -
                  Math.max(
                    0,
                    2 * this.averageObjectPixelHeight2 -
                      a.core.settings.minDateHeight
                  ))),
          e === n &&
            (m +=
              ((d - f) / this.averageObjectPixelHeight2 - n) *
              a.core.settings.minDateHeight *
              1.5),
          this.paintObject(b.details[e], false, a.core.zopHandler.topPixel, m);
    };
    d.prototype.paintDaySpecialDetails = function (b, c) {
      this.verifyDetailsArePopulatedFor(b);
      var e;
      e = a.core.zopHandler.getPixelFromZOP(
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
    };
    return d;
  })();
  a.CalendarDateHandler = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
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
        new a.CalendarDateObject(
          a.CalendarDateObjectType.Title,
          a.core.settings.absoluteMinDate,
          a.core.settings.absoluteMaxDate
        )
      );
      this.absoluteMinZOP = a.core.zopHandler.dateToZOP(
        a.core.settings.absoluteMinDate
      );
      this.absoluteMaxZOP = a.core.zopHandler.dateToZOP(
        a.core.settings.absoluteMaxDate
      );
      a.core.zopHandler.setAbsoluteMinMax(
        this.absoluteMinZOP,
        this.absoluteMaxZOP
      );
    }
    d.prototype.canEditEvent = function (a) {
      a = this.getOwningCalendar(a);
      return void 0 === a ? false : a.canEditCalendarEvents;
    };
    d.prototype.isFullDayEvent = function (a) {
      return 0 === moment(a.startDateTime).minutes() &&
        0 === moment(a.startDateTime).hours() &&
        0 === moment(a.endDateTime).minutes() &&
        0 === moment(a.endDateTime).hours()
        ? true
        : false;
    };
    d.prototype.getOwningCalendar = function (b) {
      return a.core.getCalendar(b.calendarId);
    };
    d.prototype.gradeCalendarEvents = function (a) {
      for (var b = 0; b < a.length; b++) this.gradeCalendarEvent(a[b]);
    };
    d.prototype.gradeCalendarEvent = function (a) {
      a.grade =
        100 * (a.endZOP - a.startZOP) + this.sumLettersInString(a.summary);
      a.isGraded = true;
    };
    d.prototype.sumLettersInString = function (a) {
      var b = 0,
        e = a.toLowerCase();
      for (a = 0; a < e.length; a++) b += e.charCodeAt(a) - 96;
      return b;
    };
    d.prototype.drawAreaResized = function () {};
    d.prototype.dataLoadReady = function () {
      this.somethingChanged();
    };
    d.prototype.somethingChanged = function () {
      this.zoomLevel = this.getNewZoomLevelString();
      this.prepareDataForPaint();
    };
    d.prototype.getNewZoomLevelString = function () {
      return a.core.calendarDateHandler.visibleLowestLevelObjects &&
        0 < a.core.calendarDateHandler.visibleLowestLevelObjects.length
        ? "" +
            a.core.calendarDateHandler.visibleLowestLevelObjects[0].startZOP +
            a.core.calendarDateHandler.visibleLowestLevelObjects.length
        : "x";
    };
    d.prototype.paintCalendarEvents = function () {
      this.eventsFarLeft = Math.floor(
        a.core.settings.eventsFarLeft +
          a.core.mainMenuControl.nudgeBecauseMenuBeingDragged
      );
      this.eventsFarRight = Math.ceil(
        a.core.zopHandler.rightPixel +
          a.core.mainMenuControl.nudgeBecauseMenuBeingDragged
      );
      (a.core.hardRedraw ||
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
    };
    d.prototype.prepareDataForPaint = function () {
      this.visibleTagEventGroups = [];
      this.visibleFullEventWrappers = [];
      this.visibleEventTagWrappers = [];
      this.minFullEventZOPSize = Math.ceil(
        a.core.zopHandler.getZOPFromPixel(a.core.settings.tagHeight + 2) -
          a.core.zopHandler.getZOPFromPixel(0) +
          1e-5
      );
      this.topZOP = a.core.zopHandler.extendedTopZOP;
      this.bottomZOP = a.core.zopHandler.extendedBottomZOP;
      var b = new a.TagSurface();
      b.parentCollidingFullEventWrapper = void 0;
      b.minZOP = this.topZOP;
      b.maxZOP = this.bottomZOP;
      this.tagSurfaces = [];
      this.tagSurfaces.push(b);
      this.selectVisibleFullEventsIn();
      this.selectVisibleTags();
    };
    d.prototype.paintSelectedCalendarEvent = function (a) {
      for (a = 0; a < this.visibleFullEventWrappers.length; a++);
    };
    d.prototype.selectVisibleTags = function () {
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
    };
    d.prototype.prepareBadges = function () {
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
          k = new a.Badge();
        f = l.calendarEventTagWrapper.calendarEvent;
        k.textColor = a.core.settings.theme.badgeColorIsTagTextColor
          ? a.core.helper.getEventTextColor(f, a.core.getCalendar(f.calendarId))
          : a.core.helper.getEventColor(f, a.core.getCalendar(f.calendarId));
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
                  a.core.zopHandler.getZOPFromPixelDiff(
                    2 * a.core.settings.tagTextHeight
                  )
              );
        for (
          b =
            0 === n
              ? f.startZOP -
                a.core.zopHandler.getZOPFromPixelDiff(
                  2 * a.core.settings.tagTextHeight
                )
              : Math.max(
                  f.startZOP / 2 +
                    this.tagDatasToPaint[n - 1].calendarEventTagWrapper
                      .calendarEvent.endZOP /
                      2,
                  f.startZOP -
                    a.core.zopHandler.getZOPFromPixelDiff(
                      2 * a.core.settings.tagTextHeight
                    )
                );
          false === h &&
          d < a.core.calendarDateHandler.visibleLowestLevelObjects.length;

        ) {
          for (
            e = a.core.calendarDateHandler.visibleLowestLevelObjects[d];
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
              a.core.settings.margin +
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
    };
    d.prototype.paintBadges = function () {
      for (var b = 0; b < this.visibleBadges.length; b++) {
        var c = this.visibleBadges[b],
          e = 0,
          f = 0,
          d = c.topPixel,
          e = e + c.count;
        1 < e && (f = c.height);
        !c.isPartial &&
          c.partialBadgeAbove &&
          0.9 > c.partialBadgeAbove.height / a.core.settings.tagHeight &&
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
              a.core.settings.tagHeight - c.partialBadgeAbove.height,
              f
            )));
        !c.isPartial &&
          c.partialBadgeBellow &&
          0.9 > c.partialBadgeBellow.height / a.core.settings.tagHeight &&
          ((e =
            c.partialBadgeBellow.closeToAbove &&
            c.partialBadgeBellow.closeToBellow
              ? e + Math.floor(c.partialBadgeBellow.count / 2)
              : c.partialBadgeBellow.closeToAbove &&
                !c.partialBadgeBellow.closeToBellow
              ? e + c.partialBadgeBellow.count
              : e + 0),
          1 < e &&
            a.core.settings.tagHeight - c.partialBadgeBellow.height > f &&
            ((f = a.core.settings.tagHeight - c.partialBadgeBellow.height),
            (d = d + a.core.settings.tagHeight - f)));
        var m = e + "";
        1 < e &&
          a.core.zopDrawArea.drawBadge(
            a.core.settings.badgesLeft +
              a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
            d,
            f,
            a.core.settings.eventsFarLeft +
              a.core.mainMenuControl.nudgeBecauseMenuBeingDragged -
              3 * a.core.ratio,
            m,
            f / a.core.settings.tagHeight,
            c.textColor
          );
      }
    };
    d.prototype.selectBiggestFullEventAndMakeVisibleOld = function (
      b,
      c,
      e,
      f,
      d
    ) {
      var g, n, l, h, k;
      for (
        g = 0;
        g < a.core.calendarDateHandler.visibleLowestLevelObjects.length;
        g++
      )
        for (
          k = a.core.calendarDateHandler.visibleLowestLevelObjects[g], n = 0;
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
            ((b = new a.CalendarFullEventWrapper(l)),
            this.visibleFullEventWrappers.push(b)),
          this.AddTagSurface(b),
          b
        );
    };
    d.prototype.selectBiggestFullEventAndMakeVisible = function () {
      var b, c, e, f, d;
      for (
        b = 0;
        b < a.core.calendarDateHandler.visibleLowestLevelObjects.length;
        b++
      )
        for (
          d = a.core.calendarDateHandler.visibleLowestLevelObjects[b], c = 0;
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
          (b = new a.CalendarFullEventWrapper(e)),
          this.AddTagSurface(b),
          this.AddVisibleFullEventWrapper(b),
          b
        );
    };
    d.prototype.AddVisibleFullEventWrapper = function (a) {
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
    };
    d.prototype.DoEventsCollide = function (a, c) {
      return a.startZOP <= c.endZOP && a.endZOP >= c.startZOP;
    };
    d.prototype.AddTagSurface = function (b) {
      var c = new a.TagSurface();
      c.parentCollidingFullEventWrapper = b;
      c.minZOP = b.calendarEvent.startZOP;
      c.maxZOP = b.calendarEvent.endZOP;
      for (b = 0; b < this.tagSurfaces.length; b++)
        this.SubtractSpaceFromSurface(this.tagSurfaces[b], c.minZOP, c.maxZOP);
      this.tagSurfaces.push(c);
    };
    d.prototype.SubtractSpaceFromSurface = function (b, c, e) {
      if (b.minZOP >= c && b.maxZOP <= e) b.maxZOP = b.minZOP - 1;
      else if (b.minZOP >= c && b.minZOP < e && b.maxZOP > e) b.minZOP = e + 1;
      else if (b.minZOP < c && b.maxZOP > e) {
        var f = new a.TagSurface();
        f.parentCollidingFullEventWrapper = b.parentCollidingFullEventWrapper;
        f.minZOP = e + 1;
        f.maxZOP = b.maxZOP;
        this.tagSurfaces.push(f);
        b.maxZOP = c - 1;
      } else
        b.maxZOP >= c && b.minZOP <= c && b.maxZOP <= e && (b.maxZOP = c - 1);
    };
    d.prototype.IsEventInCollisionList = function (a, c) {
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
    };
    d.prototype.calculateMinAndPrefWidth = function (a) {
      a.preferredWidth =
        (this.eventsFarRight - this.eventsFarLeft) *
        (0.2 +
          this.minFullEventZOPSize /
            (a.calendarEvent.endZOP - a.calendarEvent.startZOP));
    };
    d.prototype.calculateWhere2CollidingEventsMeet = function (a, c, e) {
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
    };
    d.prototype.selectVisibleFullEventsIn = function () {
      var a;
      do a = this.selectBiggestFullEventAndMakeVisible();
      while (void 0 !== a);
    };
    d.prototype.selectVisibleEventTagsIn = function (b, c, e, f, d) {
      var g, n;
      for (
        g = 0;
        g < a.core.calendarDateHandler.visibleLowestLevelObjects.length;
        g++
      )
        (n = a.core.calendarDateHandler.visibleLowestLevelObjects[g]),
          n.calendarDateObjectType ===
            a.core.calendarDateHandler.lowestLevelCalendarDateObjectType &&
            n.startZOP <= c &&
            n.endZOP >= b - (n.endZOP - n.startZOP) &&
            this.selectVisibleEventTagsFor(n, b, c, e, f, d);
    };
    d.prototype.paintVisibleFullEventWrappers = function () {
      var b, c, e, f;
      for (b = 0; b < this.visibleFullEventWrappers.length; b++)
        (c = this.visibleFullEventWrappers[b].calendarEvent),
          (e = this.visibleFullEventWrappers[b].left),
          (f = this.visibleFullEventWrappers[b].right - e),
          true === a.core.settings.rightToLeft &&
            ((e = Math.floor(this.eventsFarRight + this.eventsFarLeft - e - f)),
            (this.visibleFullEventWrappers[b].paintedLeft = e),
            (this.visibleFullEventWrappers[b].paintedRight = e + f)),
          (this.visibleFullEventWrappers[b].left = e),
          (this.visibleFullEventWrappers[b].right = e + f),
          0 < f &&
            a.core.zopDrawArea.drawFullEvent(
              e,
              c.startZOP,
              c.endZOP,
              f,
              a.core.helper.getEventColor(c, a.core.getCalendar(c.calendarId)),
              a.core.helper.getEventTextColor(
                c,
                a.core.getCalendar(c.calendarId)
              ),
              c.summary
            );
    };
    d.prototype.paintVisibleEventTags = function () {
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
            a.core.calendarDateHandler.lowestLevelCalendarDateObjectType)
        ) {
          d = f = 0;
          m = 1e4;
          for (c = e.calendarEventTagWrappers.length - 1; 0 <= c; c--)
            (l = e.calendarEventTagWrappers[c]),
              (n =
                a.core.zopHandler.getFractionalPixelDistance(
                  l.calendarEvent.startZOP - e.parentTopZOP
                ) -
                a.core.settings.tagHeight * c),
              (m = Math.min(
                m,
                (e.availableSpace / e.countDetails) * (l.position + 1) -
                  a.core.settings.tagHeight * c
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
              (n = a.core.helper.getEventColor(
                h,
                a.core.getCalendar(h.calendarId)
              )),
              (h = a.core.helper.getEventTextColor(
                h,
                a.core.getCalendar(h.calendarId)
              )),
              l.wantedPixelShift > d &&
                ((d = l.wantedPixelShift), (d = Math.min(d, e.extraSpace))),
              (p = l.right - l.left),
              (k = l.left),
              true === a.core.settings.rightToLeft &&
                ((k = this.eventsFarLeft),
                (l.paintedLeft = k),
                (l.paintedRight = k + p)),
              true === l.visible)
            ) {
              var q = new a.TagDataToPaint();
              q.calendarEventTagWrapper = l;
              q.visible = true;
              q.left = k;
              q.zopHeight = l.calendarEvent.endZOP - l.calendarEvent.startZOP;
              q.topPixel =
                a.core.zopHandler.getPixelFromZOP(e.startZOP) +
                a.core.settings.tagHeight * c +
                f +
                d;
              q.width = p;
              q.color = n;
              q.textColor = h;
              l.partialHeight
                ? ((q.height = l.partialHeight),
                  (q.isPartial = true),
                  (f = l.partialHeight - a.core.settings.tagHeight))
                : ((q.height = a.core.settings.tagHeight),
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
          a.core.zopHandler.getPixelFromZOP(
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
            a.core.zopDrawArea.drawTag(
              c.left,
              c.topPixel,
              c.width,
              c.color,
              c.textColor,
              c.height,
              c.text,
              c.height / a.core.settings.tagHeight
            );
    };
    d.prototype.getSpaceBellow = function (b, c, e, f, d) {
      var g,
        n = f;
      for (g = 0; g < this.visibleFullEventWrappers.length && 0 < n; g++) {
        var l = this.visibleFullEventWrappers[g];
        a.core.zopHandler.getPixelFromZOP(l.calendarEvent.endZOP) > b &&
          l.left < e &&
          (n = Math.min(
            n,
            a.core.zopHandler.getPixelFromZOP(l.calendarEvent.startZOP) - b
          ));
      }
      for (g = 0; g < d.length && 0 < n; g++)
        (l = d[g]),
          l.topPixel + l.height > b &&
            l.left < e &&
            l.left + l.width > c &&
            (n = Math.min(n, l.topPixel - b));
      return Math.min(f, n);
    };
    d.prototype.checkForPixelOverlap = function (a, c) {
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
              2 >= a.height && (a.visible = false)));
      }
    };
    d.prototype.copyEventsFromParent = function (a, c) {
      var b;
      if (void 0 !== a.calendarEvents)
        for (b = 0; b < a.calendarEvents.length; b++)
          this.addEventToCalendarDateObjectAndChildren(a.calendarEvents[b], c);
    };
    d.prototype.getTopTagAtThisZoomLevel = function (a) {
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
    };
    d.prototype.doesEventStartWithinCalendarDateObject = function (a, c) {
      return a.startZOP >= c.startZOP && a.startZOP < c.endZOP;
    };
    d.prototype.selectAndOrderPossibleEventTagsAtThisZoomLevel = function (b) {
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
                new a.PossibleEventTagsAtThisZoomLevel(e, b, b, c)
              ));
      b.possibleEventTagsAtThisZoomLevel.sort(function (a, b) {
        return b.calendarEvent.grade - a.calendarEvent.grade;
      });
    };
    d.prototype.addPossibleEventTagsAtThisZoomLevel = function (b, c, e, f) {
      b.possibleEventTagsAtThisZoomLevelMinZop =
        void 0 === b.possibleEventTagsAtThisZoomLevelMinZop
          ? c.startZOP
          : Math.min(b.possibleEventTagsAtThisZoomLevelMinZop, c.startZOP);
      b.possibleEventTagsAtThisZoomLevelMaxZop =
        void 0 === b.possibleEventTagsAtThisZoomLevelMaxZop
          ? c.endZOP
          : Math.max(b.possibleEventTagsAtThisZoomLevelMaxZop, c.endZOP);
      b.possibleEventTagsAtThisZoomLevel.push(
        new a.PossibleEventTagsAtThisZoomLevel(c, b, f, e)
      );
    };
    d.prototype.removeCalendarEvent = function (b) {
      var c;
      for (
        c = 0;
        c < a.core.calendarDateHandler.rootCalendarDateObjects.length;
        c++
      )
        this.removeCalendarEventFromDateObjectandChildren(
          b,
          a.core.calendarDateHandler.rootCalendarDateObjects[c]
        );
    };
    d.prototype.removeCalendarEventFromDateObjectandChildren = function (a, c) {
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
    };
    d.prototype.getCalendarEventsByIdAndRecurringId = function (b) {
      var c,
        e,
        f = [];
      for (
        e = 0;
        e < a.core.calendarDateHandler.rootCalendarDateObjects.length;
        e++
      ) {
        var d = a.core.calendarDateHandler.rootCalendarDateObjects[e];
        for (c = 0; c < d.calendarEvents.length; c++)
          (d.calendarEvents[c].recurringEventId != b &&
            d.calendarEvents[c].id != b) ||
            f.push(d.calendarEvents[c]);
      }
      return f;
    };
    d.prototype.reorderAllEvents = function () {
      var b;
      for (
        b = 0;
        b < a.core.calendarDateHandler.rootCalendarDateObjects.length;
        b++
      )
        this.reorderAllEventsInDateObjectandChildren(
          a.core.calendarDateHandler.rootCalendarDateObjects[b]
        );
    };
    d.prototype.reorderAllEventsInDateObjectandChildren = function (a) {
      var b;
      a.isReadyForParentToBeShown = false;
      a.topNonFullEvent = void 0;
      a.possibleEventTagsAtThisZoomLevel = [];
      a.possibleEventTagsAtThisZoomLevelMinZop = void 0;
      a.possibleEventTagsAtThisZoomLevelMaxZop = void 0;
      if (a.details)
        for (b = 0; b < a.details.length; b++)
          this.reorderAllEventsInDateObjectandChildren(a.details[b]);
    };
    d.prototype.clearAllEvents = function () {
      var b;
      for (
        b = 0;
        b < a.core.calendarDateHandler.rootCalendarDateObjects.length;
        b++
      )
        this.clearAllEventsFromDateObjectandChildren(
          a.core.calendarDateHandler.rootCalendarDateObjects[b]
        );
      this.visibleEventTagWrappers = [];
      this.visibleTagEventGroups = [];
    };
    d.prototype.clearAllEventsFromDateObjectandChildren = function (a) {
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
    };
    d.prototype.addEventToCalendar = function (b) {
      var c;
      for (
        c = 0;
        c < a.core.calendarDateHandler.rootCalendarDateObjects.length;
        c++
      )
        this.addEventToCalendarDateObjectAndChildren(
          b,
          a.core.calendarDateHandler.rootCalendarDateObjects[c]
        );
      this.addCommonTimeKey(b.startDateTime, 2);
    };
    d.prototype.addCommonTimeKey = function (a, c) {
      var b = a.getHours() + "-" + a.getMinutes(),
        f = this.commonTimeKeysHelper.indexOf(b);
      -1 == f
        ? (this.commonTimeKeys.push({
            timeKey: b,
            counter: 1,
          }),
          this.commonTimeKeysHelper.push(b))
        : this.commonTimeKeys[f].counter++;
    };
    d.prototype.findCommonTimes = function () {
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
    };
    d.prototype.addEventToCalendarDateObjectAndChildren = function (a, c) {
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
    };
    d.prototype.getOrCreateEventTagWrapperFor = function (b) {
      var c = this.findEventTagWrappersForEvent(b);
      void 0 === c &&
        ((c = new a.CalendarEventTagWrapper(b)),
        (c.calendarEvent = b),
        this.visibleEventTagWrappers.push(c));
      return c;
    };
    d.prototype.findFullEventWrapperForEvent = function (a) {
      var b;
      for (b = 0; b < this.visibleFullEventWrappers.length; b++)
        if (this.visibleFullEventWrappers[b].calendarEvent == a)
          return this.visibleFullEventWrappers[b];
    };
    d.prototype.findEventTagWrappersForEvent = function (a) {
      var b;
      for (b = 0; b < this.visibleEventTagWrappers.length; b++)
        if (this.visibleEventTagWrappers[b].calendarEvent == a)
          return this.visibleEventTagWrappers[b];
    };
    d.prototype.verifyChildCalendarDateObjectsAreReadyForParentToBeShown =
      function (b) {
        a.core.calendarDateHandler.verifyDetailsArePopulatedFor(b);
        var c = b.details.length,
          e,
          f;
        for (e = 0; e < c; e++)
          (f = b.details[e]),
            this.verifyCalendarDateObjectIsReadyForParentToBeShown(f);
      };
    d.prototype.verifyCalendarDateObjectIsReadyForParentToBeShown = function (
      a
    ) {
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
    };
    d.prototype.selectVisibleEventTagsFor = function (b, c, e, f, d, m) {
      a.core.debugCounter++;
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
          a.core.zopHandler.getFractionalPixelDistance(r - l) - 0.5
        ),
        z = Math.ceil(w / a.core.settings.tagHeight),
        x = Math.floor(w / a.core.settings.tagHeight),
        A = w - x * a.core.settings.tagHeight,
        u = new a.CalendarEventTagGroup(b, w),
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
              u.calendarEventTagWrappers.length * a.core.settings.tagHeight);
        u.calendarEventTagWrappers.sort(function (a, b) {
          return a.position - b.position;
        });
      }
    };
    d.prototype.calendarEventIsOnExtendedScreen = function (a) {
      return a.startZOP <= this.bottomZOP && a.endZOP >= this.topZOP;
    };
    d.prototype.getPositionSubtractionForEventTags = function (a, c) {
      var b;
      for (b = 0; b < a.details.length && !(a.details[b].startZOP >= c); b++);
      return b;
    };
    d.prototype.countDetailsForPartialCalendarDateObject = function (a, c, e) {
      var b,
        d = 0;
      for (b = 0; b < a.details.length; b++)
        a.details[b].startZOP >= c && a.details[b].endZOP <= e && (d += 1);
      return d;
    };
    d.prototype.calculateAllWidths = function () {
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
    };
    d.prototype.calculateOutOfScopeFactor = function (b) {
      var c = 1,
        e = (a.core.zopHandler.bottomZOP - a.core.zopHandler.topZOP) / 10;
      b.endZOP < a.core.zopHandler.topZOP - e
        ? (c =
            (b.endZOP - this.topZOP) /
            (a.core.zopHandler.topZOP - e - this.topZOP))
        : b.startZOP > a.core.zopHandler.bottomZOP + e &&
          (c =
            (b.startZOP - this.bottomZOP) /
            (a.core.zopHandler.bottomZOP + e - this.bottomZOP));
      return c;
    };
    d.prototype.calculateTagWidthsHelper = function (b, c, e, d) {
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
            m < a.core.settings.tagHeight &&
              ((c += a.core.settings.tagHeight - m),
              (m = a.core.settings.tagHeight)),
            (e += m);
      }
      e > this.eventsFarRight - 3 && (e = this.eventsFarRight);
      return e;
    };
    d.prototype.calculateFullEventWrapperMaxWidth = function (b) {
      return Math.max(
        (this.eventsFarRight - this.eventsFarLeft) *
          Math.min(
            1,
            (2 * (this.bottomZOP - this.topZOP)) /
              (b.calendarEvent.endZOP - b.calendarEvent.startZOP)
          ),
        a.core.settings.tagHeight + a.core.settings.tagColorWidth + 1
      );
    };
    d.prototype.calculateWidthsHelper = function (b, c, e, d, g) {
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
          l < a.core.settings.tagHeight &&
            ((d += a.core.settings.tagHeight - l),
            (l = a.core.settings.tagHeight));
          c += l;
          (void 0 === n.right || n.right > c) &&
            this.SetRightForFullEventWrapper(n, Math.floor(c));
        }
        0 < f.length &&
          f[f.length - 1].right > e - 3 &&
          (f[f.length - 1].right = e);
      }
    };
    d.prototype.calculateFullEventWrapperWidthPercent = function (a, c, e, d) {
      a.widthPercent =
        Math.max(
          0.16,
          (c - (a.calendarEvent.endZOP - a.calendarEvent.startZOP)) / c
        ) *
        e *
        d;
    };
    d.prototype.GetFullEventWrapperCollisionPaths = function (a) {
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
    };
    d.prototype.SetRightForFullEventWrapper = function (a, c) {
      var b;
      if (void 0 === a.right || a.right > c)
        if (((a.right = c), void 0 !== a.childCollidingFullEventWrappers))
          for (b = 0; b < a.childCollidingFullEventWrappers.length; b++)
            this.SetLeftForFullEventWrapper(
              a.childCollidingFullEventWrappers[b],
              c
            );
    };
    d.prototype.SetLeftForFullEventWrapper = function (a, c) {
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
    };
    d.prototype.SetLeftForEventTagWrapper = function (a, c) {
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
    };
    d.prototype.gotoBadgeAt = function (b, c) {
      if (b >= a.core.settings.badgesLeft && b <= a.core.settings.eventsFarLeft)
        for (var e = 0; e < this.visibleBadges.length; e++)
          if (
            c >= this.visibleBadges[e].topPixel &&
            c <= this.visibleBadges[e].topPixel + a.core.settings.tagHeight
          ) {
            if (0 == this.visibleBadges[e].count) break;
            var d =
              this.visibleBadges[e].bottomZOPForAllEvents -
              this.visibleBadges[e].topZOPForAllEvents;
            a.core.drawAreaEffects.startAutoZoom(
              this.visibleBadges[e].topZOPForAllEvents - d,
              this.visibleBadges[e].bottomZOPForAllEvents + d,
              false,
              function () {}
            );
            return true;
          }
      return false;
    };
    d.prototype.selectCalendarEventObjectAt = function (b, c) {
      var e,
        d,
        g = a.core.zopHandler.getZOPFromPixel(c);
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
    };
    return d;
  })();
  a.CalendarEventHandler = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
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
    d.prototype.init = function () {
      this.topPanelHeight = a.core.settings.titleWidth;
    };
    d.prototype.paint = function () {
      void 0 !== this.calendarEventObject &&
        true === a.core.appStateHandler.isChoosingDateTimeForEvent &&
        ((this.topPanelLeft = a.core.zopDrawArea.screenLeft),
        (this.topPanelWidth = a.core.domHandler.screenWidth),
        (this.topPanelTop = a.core.zopDrawArea.screenTop),
        (this.topPanelHeight = this.getSpaceTakenAtTop()),
        (this.margin = this.topPanelHeight / 6),
        (this.markerHeight = 2 * a.core.settings.tagHeight),
        (this.markerWidth = 2 * a.core.settings.titleWidth),
        (this.markerLeft =
          a.core.zopDrawArea.screenLeft +
          a.core.domHandler.screenWidth -
          this.markerWidth),
        (this.markerColor = a.core.settings.theme.colorDark),
        (this.textColor = a.core.settings.theme.colorLight),
        this.calendarEventObject && this.paintMarkers());
    };
    d.prototype.startEditing = function (b, c, e) {
      this.callback = e;
      this.editType = c;
      this.calendarEventObject = b;
      this.originalTopDateTime = b.startDateTime;
      this.originalBottomDateTime = b.endDateTime;
      this.topText = "START";
      this.bottomText = "END";
      c = 6 * (b.endZOP - b.startZOP);
      a.core.drawAreaEffects.startAutoZoom(
        b.startZOP - c,
        b.endZOP + c,
        false,
        function () {}
      );
    };
    d.prototype.paintMarkers = function () {
      this.topMarkerY = a.core.zopHandler.getPixelFromZOP(
        this.calendarEventObject.startZOP
      );
      this.bottomMarkerY = a.core.zopHandler.getPixelFromZOP(
        this.calendarEventObject.endZOP
      );
      a.core.appStateHandler.isDraggingTopMarker
        ? (this.paintMarker(this.bottomText, this.bottomMarkerY, false),
          this.paintMarker(this.topText, this.topMarkerY, true))
        : (this.paintMarker(this.topText, this.topMarkerY, true),
          this.paintMarker(this.bottomText, this.bottomMarkerY, false));
    };
    d.prototype.makeNiceTimeToShow = function (a) {
      return (
        a.getMonth() +
        " " +
        a.getDate() +
        " " +
        a.getHours() +
        " " +
        a.getMinutes()
      );
    };
    d.prototype.makeVisible = function (b) {
      if (b) {
        this.buttonDiv = a.core.domHandler.addDiv(
          "dateTimeSelectionbuttons",
          "",
          "controlsRoot"
        );
        this.buttonDiv.innerHTML = this.pageHtml;
        b = (a.core.settings.titleWidth / a.core.ratio - 24) / 2;
        var c = document.getElementById("dateTimeSelectionOk"),
          e = document.getElementById("dateTimeSelectionCancel");
        c.style.padding = b + "px";
        e.style.padding = b + "px";
        c.style.backgroundColor = a.core.settings.theme.colorDark;
        e.style.backgroundColor = a.core.settings.theme.colorDark;
        a.core.domHandler.addClickEvent(
          "dateTimeSelectionOk",
          this.saveChanges,
          this
        );
        a.core.domHandler.addClickEvent(
          "dateTimeSelectionCancel",
          this.cancelChanges,
          this
        );
      } else a.core.domHandler.removeElement(this.buttonDiv.id);
    };
    d.prototype.getSpaceTakenAtTop = function () {
      return a.core.settings.titleWidth;
    };
    d.prototype.getSpaceTakenAtBottom = function () {
      return a.core.settings.titleWidth;
    };
    d.prototype.paintButton = function (b, c, e, d, g) {
      a.core.drawArea.drawFilledRectangle(
        c,
        e,
        d,
        g,
        a.core.settings.theme.colorDark,
        false
      );
      g -= 6;
      a.core.drawArea.setFont(g, false, false, false);
      var f = a.core.zopDrawArea.measureTextWidth(b, g, false, true),
        f = (d - f) / 2;
      a.core.zopDrawArea.drawText(
        b,
        c + f,
        e,
        -3,
        g,
        a.core.settings.theme.colorLight,
        a.core.settings.theme.colorDark,
        false,
        d - f,
        false,
        false
      );
    };
    d.prototype.paintMarker = function (b, c, e) {
      e
        ? (a.core.zopDrawArea.drawHorizontalLineThick(
            a.core.settings.eventsFarLeft - 1,
            a.core.zopHandler.getZOPFromPixel(c - 1),
            this.markerLeft + this.markerWidth,
            this.markerColor,
            3,
            true
          ),
          (c -= this.markerHeight))
        : a.core.zopDrawArea.drawHorizontalLineThick(
            a.core.settings.eventsFarLeft - 1,
            a.core.zopHandler.getZOPFromPixel(c + 1),
            this.markerLeft + this.markerWidth,
            this.markerColor,
            3,
            true
          );
      a.core.drawArea.drawFilledRectangle(
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
      a.core.drawArea.drawFilledRectangle(
        d + 1 * e,
        g + 0 * e,
        2,
        2,
        this.textColor,
        false
      );
      a.core.drawArea.drawFilledRectangle(
        d + 1 * e,
        g + 1 * e,
        2,
        2,
        this.textColor,
        false
      );
      a.core.drawArea.drawFilledRectangle(
        d + 1 * e,
        g + 2 * e,
        2,
        2,
        this.textColor,
        false
      );
      a.core.drawArea.drawFilledRectangle(
        d + 1 * e,
        g + 3 * e,
        2,
        2,
        this.textColor,
        false
      );
      a.core.drawArea.drawFilledRectangle(
        d + 2 * e,
        g + 0 * e,
        2,
        2,
        this.textColor,
        false
      );
      a.core.drawArea.drawFilledRectangle(
        d + 2 * e,
        g + 1 * e,
        2,
        2,
        this.textColor,
        false
      );
      a.core.drawArea.drawFilledRectangle(
        d + 2 * e,
        g + 2 * e,
        2,
        2,
        this.textColor,
        false
      );
      a.core.drawArea.drawFilledRectangle(
        d + 2 * e,
        g + 3 * e,
        2,
        2,
        this.textColor,
        false
      );
      e = this.markerHeight / 2 - 4;
      a.core.zopDrawArea.drawText(
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
    };
    d.prototype.click = function (a, c) {
      return false;
    };
    d.prototype.saveChanges = function (b) {
      a.core.appStateHandler.setChoosingDateTimeForEvent(false);
      this.callback
        ? this.callback()
        : a.core.calendarDataProxy.editExistingEvent(
            this.calendarEventObject,
            this.editType
          );
    };
    d.prototype.cancelChanges = function (b) {
      a.core.appStateHandler.setChoosingDateTimeForEvent(false);
      this.calendarEventObject.startDateTime = this.originalTopDateTime;
      this.calendarEventObject.endDateTime = this.originalBottomDateTime;
      a.core.zopHandler.updateStartEndZOP(this.calendarEventObject);
      this.callback && this.callback();
    };
    d.prototype.hitTopMarkerAt = function (a, c) {
      return c >= this.topMarkerY - this.markerHeight &&
        c <= this.topMarkerY &&
        a >= this.markerLeft &&
        a <= this.markerLeft + this.markerWidth
        ? true
        : false;
    };
    d.prototype.hitBottomMarkerAt = function (a, c) {
      return c >= this.bottomMarkerY &&
        c <= this.bottomMarkerY + this.markerHeight &&
        a >= this.markerLeft &&
        a <= this.markerLeft + this.markerWidth
        ? true
        : false;
    };
    d.prototype.startDraggingTopMarker = function (b) {
      this.draggingTopMarkerOffset = b;
      a.core.appStateHandler.isDraggingTopMarker = true;
      this.startDragTopDateTime = this.calendarEventObject.startDateTime;
      a.core.appStateHandler.isDraggingBottomMarker ||
        (this.startDragBottomDateTime = this.calendarEventObject.endDateTime);
    };
    d.prototype.startDraggingBottomMarker = function (b) {
      this.draggingBottomMarkerOffset = b;
      a.core.appStateHandler.isDraggingBottomMarker = true;
      this.startDragBottomDateTime = this.calendarEventObject.endDateTime;
    };
    d.prototype.continueDraggingTopMarker = function (b) {
      b -= this.draggingTopMarkerOffset;
      this.topMarkerY =
        a.core.zopHandler.getPixelFromZOP(
          a.core.zopHandler.dateToZOP(this.startDragTopDateTime)
        ) + b;
      if (
        (b = a.core.calendarDateHandler.getClosestFakeDetailAt(
          this.topMarkerY,
          this.precision,
          true
        ))
      )
        (this.calendarEventObject.startDateTime = b.startDateTime),
          (this.calendarEventObject.startZOP = b.startZOP),
          (this.topText = b.shortText),
          b.shortText2 && (this.topText += " " + b.shortText2);
      !a.core.appStateHandler.isDraggingBottomMarker &&
        ((b =
          this.startDragBottomDateTime.getTime() -
          this.startDragTopDateTime.getTime()),
        (this.calendarEventObject.endDateTime = new Date(
          this.calendarEventObject.startDateTime.getTime() + b
        )),
        a.core.zopHandler.updateStartEndZOP(this.calendarEventObject),
        (this.bottomMarkerY = a.core.zopHandler.getPixelFromZOP(
          this.calendarEventObject.endZOP
        )),
        (b = a.core.calendarDateHandler.getClosestFakeDetailAt(
          this.bottomMarkerY,
          1,
          true
        ))) &&
        ((this.calendarEventObject.endDateTime = b.startDateTime),
        (this.calendarEventObject.endZOP = b.startZOP),
        (this.bottomText = b.shortText),
        b.shortText2 && (this.bottomText += " " + b.shortText2));
    };
    d.prototype.continueDraggingBottomMarker = function (b) {
      b -= this.draggingBottomMarkerOffset;
      this.bottomMarkerY =
        a.core.zopHandler.getPixelFromZOP(
          a.core.zopHandler.dateToZOP(this.startDragBottomDateTime)
        ) + b;
      this.bottomMarkerY = Math.max(
        this.bottomMarkerY,
        this.topMarkerY + this.precision + 1
      );
      if (
        (b = a.core.calendarDateHandler.getClosestFakeDetailAt(
          this.bottomMarkerY,
          this.precision,
          true
        ))
      )
        (this.calendarEventObject.endDateTime = b.startDateTime),
          (this.calendarEventObject.endZOP = b.startZOP),
          (this.bottomText = b.shortText),
          b.shortText2 && (this.bottomText += " " + b.shortText2);
    };
    d.prototype.endDraggingTopMarker = function () {
      a.core.appStateHandler.isDraggingTopMarker = false;
    };
    d.prototype.endDraggingBottomMarker = function () {
      a.core.appStateHandler.isDraggingBottomMarker = false;
    };
    return d;
  })();
  a.DateTimeSelectionHandler = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
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
    d.prototype.addBatchEventsTo = function (b) {
      this.removeBatchElementsFrom(b);
      this.touchEnd = this.touchEnd.bind(this);
      b.addEventListener("touchend", this.touchEnd, false);
      this.touchMove = this.touchMove.bind(this);
      b.addEventListener("touchmove", this.touchMove, false);
      this.touchStart = this.touchStart.bind(this);
      b.addEventListener("touchstart", this.touchStart, false);
      this.touchLeave = this.touchLeave.bind(this);
      b.addEventListener("touchleave", this.touchLeave, false);
      a.core.isCordovaApp || this.addMouseEvents(b);
    };
    d.prototype.removeBatchElementsFrom = function (b) {
      b.removeEventListener("touchend", this.touchEnd, false);
      b.removeEventListener("touchmove", this.touchMove, false);
      b.removeEventListener("touchstart", this.touchStart, false);
      b.removeEventListener("touchleave", this.touchLeave, false);
      a.core.isCordovaApp || this.removeMouseEvents(b);
    };
    d.prototype.addMouseEvents = function (a) {
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
    };
    d.prototype.removeMouseEvents = function (a) {
      a.removeEventListener("mousedown", this.mouseDown, false);
      a.removeEventListener("mousemove", this.mouseMove, false);
      a.removeEventListener("mouseup", this.mouseUp, false);
      a.removeEventListener("mouseleave", this.mouseLeave, false);
      a.removeEventListener("mousewheel", this.mouseScroll, false);
      window.removeEventListener("DOMMouseScroll", this.mouseScroll, false);
    };
    d.prototype.reAddAllMouseEvents = function () {
      var a;
      for (a = 0; a < this.elementsWithMouseEvents.length; a++)
        this.addMouseEvents(this.elementsWithMouseEvents[a]);
    };
    d.prototype.removeAllMouseEvents = function () {
      var a;
      for (a = 0; a < this.elementsWithMouseEvents.length; a++)
        this.removeMouseEvents(this.elementsWithMouseEvents[a]);
    };
    d.prototype.closeAllPagesAndMenus = function () {
      if (
        a.core.appStateHandler.isChoosingDateTimeForEvent ||
        a.core.appStateHandler.isMainMenuShowing ||
        a.core.appStateHandler.isPopupMainMenuShowing ||
        a.core.appStateHandler.isPopupEditRecurringMenuShowing ||
        a.core.appStateHandler.viewEventControlIsShowing ||
        a.core.appStateHandler.editEventControlIsShowing ||
        a.core.appStateHandler.calendarsControlIsShowing ||
        a.core.appStateHandler.shopControlIsShowing ||
        a.core.appStateHandler.settingsControlIsShowing
      )
        for (; a.core.appStateHandler.back(); );
    };
    d.prototype.click = function (b, c) {
      var e = false,
        d =
          a.core.domHandler.screenTopForDOM * a.core.ratio +
          a.core.zopDrawArea.zopAreaTop,
        g =
          a.core.domHandler.screenLeftForDOM * a.core.ratio +
          a.core.zopDrawArea.zopAreaLeft;
      a.core.appStateHandler.isChoosingDateTimeForEvent &&
        (e = a.core.dateTimeSelectionHandler.click(b, c));
      e ||
        (a.core.appStateHandler.isMainMenuShowing
          ? a.core.mainMenuControl.click(b - g, c - d)
          : a.core.mainMenuControl.hitMenuButton(b - g, c - d) &&
            !a.core.appStateHandler.isChoosingDateTimeForEvent
          ? a.core.appStateHandler.mainButtonPressed()
          : (e = a.core.calendarDateHandler.getHitWeekAt(b - g, c - d, true))
          ? a.core.calendarDateHandler.gotoCalendarDateObject(e, c - d)
          : ((e = a.core.calendarEventHandler.selectCalendarEventObjectAt(
              b - g,
              c - d
            )) ||
              (e = a.core.calendarEventHandler.selectCalendarEventObjectAt(
                b - g,
                c - d + 4
              )),
            e ||
              (e = a.core.calendarEventHandler.selectCalendarEventObjectAt(
                b - g,
                c - d - 4
              )),
            e ||
              (e = a.core.calendarEventHandler.selectCalendarEventObjectAt(
                b - g + 2,
                c - d
              )),
            e ||
              (e = a.core.calendarEventHandler.selectCalendarEventObjectAt(
                b - g - 2,
                c - d
              )),
            e ||
              (e = a.core.calendarEventHandler.selectCalendarEventObjectAt(
                b - g,
                c - d + 8
              )),
            e ||
              (e = a.core.calendarEventHandler.selectCalendarEventObjectAt(
                b - g,
                c - d - 8
              )),
            e ||
              (e = a.core.calendarEventHandler.selectCalendarEventObjectAt(
                b - g + 4,
                c - d
              )),
            e ||
              (e = a.core.calendarEventHandler.selectCalendarEventObjectAt(
                b - g - 4,
                c - d
              )),
            e
              ? a.core.appStateHandler.viewEvent(e)
              : a.core.calendarEventHandler.gotoBadgeAt(b - g, c - d) ||
                a.core.calendarDateHandler.gotoCalendarDateObjectAt(
                  b - g,
                  c - d
                )));
      a.core.redraw(true);
    };
    d.prototype.testIfStartDraggingMarker = function (b, c, e) {
      a.core.dateTimeSelectionHandler.hitTopMarkerAt(b, c)
        ? (a.core.dateTimeSelectionHandler.startDraggingTopMarker(c),
          a.core.redraw(false),
          (this.fingerLastDraggingTopMarker = e))
        : a.core.dateTimeSelectionHandler.hitBottomMarkerAt(b, c) &&
          (a.core.dateTimeSelectionHandler.startDraggingBottomMarker(c),
          a.core.redraw(false),
          (this.fingerLastDraggingBottomMarker = e));
    };
    d.prototype.testIfContinueDraggingMarker = function (b, c) {
      a.core.appStateHandler.isDraggingTopMarker &&
      c === this.fingerLastDraggingTopMarker
        ? (a.core.dateTimeSelectionHandler.continueDraggingTopMarker(b),
          a.core.redraw(false))
        : a.core.appStateHandler.isDraggingBottomMarker &&
          c === this.fingerLastDraggingBottomMarker &&
          (a.core.dateTimeSelectionHandler.continueDraggingBottomMarker(b),
          a.core.redraw(false));
    };
    d.prototype.testIfEndDraggingMarker = function () {
      a.core.appStateHandler.isDraggingTopMarker
        ? (a.core.dateTimeSelectionHandler.endDraggingTopMarker(),
          a.core.redraw(false))
        : a.core.appStateHandler.isDraggingBottomMarker &&
          (a.core.dateTimeSelectionHandler.endDraggingBottomMarker(),
          a.core.redraw(false));
    };
    d.prototype.touchStart = function (b) {
      b.preventDefault();
      this.canBeAClick = true;
      a.core.drawAreaEffects.isScrollingOrZooming() &&
        (this.canBeAClick = false);
      a.core.preloadAllImages();
      a.core.drawAreaEffects.stopAllEffects();
      a.core.touchEnabledDevice = true;
      this.touches = b.touches;
      a.core.firstTouchMade = true;
      b = this.getTouchX(this.touches[0]) * a.core.ratio * a.core.domRatio;
      var c = this.getTouchY(this.touches[0]) * a.core.ratio * a.core.domRatio;
      this.startedInTitleArea = a.core.mainMenuControl.startDragging(b, c);
      a.core.appStateHandler.isChoosingDateTimeForEvent &&
        (1 <= this.touches.length &&
          (this.testIfEndDraggingMarker(),
          this.testIfStartDraggingMarker(b, c, 0)),
        2 <= this.touches.length &&
          this.testIfStartDraggingMarker(
            this.getTouchX(this.touches[1]) * a.core.ratio * a.core.domRatio,
            this.getTouchY(this.touches[1]) * a.core.ratio * a.core.domRatio,
            1
          ));
      1 === this.touches.length &&
        ((this.touchOneFingerStarted = true),
        (this.touchOneFingerStartX = this.getTouchX(this.touches[0])),
        (this.touchOneFingerStartY = this.getTouchY(this.touches[0])),
        (this.currentPressStartedTime = a.core.getTimeStamp()),
        (this.longPressStartX = b),
        (this.longPressStartY = c));
      2 <= this.touches.length &&
        ((this.touchOneFingerStarted = false),
        (this.touchTwoFingerStarted = true),
        (this.canBeAClick = false));
      a.core.addButtonControl.startDragging(b, c) ||
        a.core.appStateHandler.isDraggingTopMarker ||
        a.core.appStateHandler.isDraggingBottomMarker ||
        a.core.appStateHandler.isMainMenuShowing ||
        a.core.appStateHandler.isPopupMainMenuShowing ||
        a.core.appStateHandler.isPopupEditRecurringMenuShowing ||
        (1 === this.touches.length && a.core.zopHandler.startScroll(c),
        2 <= this.touches.length &&
          a.core.zopHandler.startZoom(
            c,
            this.getTouchY(this.touches[1]) * a.core.ratio * a.core.domRatio
          ));
      this.timeWhenLastTouchEnded &&
        this.timeWhenLastTouchEnded + 250 > a.core.getTimeStamp() &&
        (this.canBeAClick = false);
      a.core.redraw(false);
      return false;
    };
    d.prototype.getTouchX = function (b) {
      return b.pageX - a.core.domHandler.screenLeftForDOM;
    };
    d.prototype.getTouchY = function (b) {
      return b.pageY - a.core.domHandler.screenTopForDOM;
    };
    d.prototype.mouseDown = function (b) {
      b.preventDefault();
      a.core.firstTouchMade = true;
      if (true === a.core.touchEnabledDevice) this.removeAllMouseEvents();
      else {
        a.core.drawAreaEffects.stopAllEffects();
        a.core.preloadAllImages();
        this.mouseWasDragged = 0;
        var c = b.pageY * a.core.ratio * a.core.domRatio,
          e = b.pageX * a.core.ratio * a.core.domRatio,
          d =
            (b.pageY - a.core.domHandler.screenTopForDOM) *
            a.core.ratio *
            a.core.domRatio,
          g =
            (b.pageX - a.core.domHandler.screenLeftForDOM) *
            a.core.ratio *
            a.core.domRatio;
        this.startedInTitleArea = a.core.mainMenuControl.startDragging(g, d);
        if (0 === b.button) {
          this.canBeAClick = this.mouseLeftDown = true;
          this.longPressStartX = e;
          this.longPressStartY = c;
          this.currentPressStartedTime = a.core.getTimeStamp();
          a.core.appStateHandler.isChoosingDateTimeForEvent &&
            this.testIfStartDraggingMarker(e, c, 0);
          if (a.core.addButtonControl.startDragging(g, d)) return;
          a.core.appStateHandler.isDraggingTopMarker ||
            a.core.appStateHandler.isDraggingBottomMarker ||
            a.core.appStateHandler.isMainMenuShowing ||
            a.core.appStateHandler.isPopupMainMenuShowing ||
            a.core.appStateHandler.isPopupEditRecurringMenuShowing ||
            a.core.zopHandler.startScroll(c);
        } else
          a.core.appStateHandler.isMainMenuShowing ||
            a.core.appStateHandler.isPopupMainMenuShowing ||
            a.core.appStateHandler.isPopupEditRecurringMenuShowing ||
            ((this.mouseRightDown = true),
            (this.mouseZoomY = c - 500),
            a.core.zopHandler.startZoom(this.mouseZoomY, c));
        a.core.redraw(false);
        return false;
      }
    };
    d.prototype.touchMove = function (b) {
      b.preventDefault();
      this.touches = b.touches;
      b = this.getTouchY(this.touches[0]) * a.core.ratio * a.core.domRatio;
      var c = this.getTouchX(this.touches[0]) * a.core.ratio * a.core.domRatio,
        e;
      1 < this.touches.length &&
        ((e = this.getTouchY(this.touches[1]) * a.core.ratio * a.core.domRatio),
        this.getTouchX(this.touches[1]));
      a.core.appStateHandler.isChoosingDateTimeForEvent &&
        (0 < this.touches.length && this.testIfContinueDraggingMarker(b, 0),
        1 < this.touches.length && this.testIfContinueDraggingMarker(e, 1));
      this.currentPressStartedTime < a.core.getTimeStamp() - 550 &&
        (this.canBeAClick = false);
      1 === this.touches.length &&
        this.touchOneFingerStarted &&
        Math.abs(this.touchOneFingerStartX - this.getTouchX(this.touches[0])) +
          Math.abs(
            this.touchOneFingerStartY - this.getTouchY(this.touches[0])
          ) >
          this.touchSlop *
            a.core.ratio *
            a.core.domRatio *
            (this.startedInTitleArea ? 1.5 : 1) &&
        (this.canBeAClick = false);
      !this.canBeAClick && this.startedInTitleArea
        ? a.core.mainMenuControl.continueDragging(c, b)
        : a.core.appStateHandler.isAddButtonBeingDragged
        ? a.core.addButtonControl.continueDragging(c, b)
        : a.core.appStateHandler.isDraggingTopMarker ||
          a.core.appStateHandler.isDraggingBottomMarker ||
          a.core.appStateHandler.isMainMenuShowing ||
          a.core.appStateHandler.isPopupMainMenuShowing ||
          a.core.appStateHandler.isPopupEditRecurringMenuShowing ||
          (1 === this.touches.length &&
            this.touchOneFingerStarted &&
            (this.canBeAClick ||
              (a.core.appStateHandler.isMainMenuShowing &&
                a.core.mainMenuControl.hide()),
            a.core.zopHandler.continueScroll(b),
            a.core.drawAreaEffects.prepareAutoScroll(b)),
          2 <= this.touches.length &&
            this.touchTwoFingerStarted &&
            a.core.zopHandler.continueZoom(b, e));
      a.core.redraw(false);
      return false;
    };
    d.prototype.mouseMove = function (b) {
      b.preventDefault();
      if (true === a.core.touchEnabledDevice) this.removeAllMouseEvents();
      else {
        var c = b.pageY * a.core.ratio * a.core.domRatio,
          e = b.pageX * a.core.ratio * a.core.domRatio,
          d =
            (b.pageY - a.core.domHandler.screenTopForDOM) *
            a.core.ratio *
            a.core.domRatio;
        b =
          (b.pageX - a.core.domHandler.screenLeftForDOM) *
          a.core.ratio *
          a.core.domRatio;
        if (this.mouseLeftDown) {
          this.longPressStartX != e &&
            this.longPressStartY !== c &&
            (this.canBeAClick = false);
          if (a.core.appStateHandler.isPopupEditRecurringMenuShowing) return;
          this.mouseWasDragged += 1;
          a.core.appStateHandler.isChoosingDateTimeForEvent &&
            this.testIfContinueDraggingMarker(c, 0);
          !this.canBeAClick && this.startedInTitleArea
            ? a.core.mainMenuControl.continueDragging(b, d)
            : a.core.appStateHandler.isAddButtonBeingDragged
            ? a.core.addButtonControl.continueDragging(b, d)
            : a.core.appStateHandler.isDraggingTopMarker ||
              a.core.appStateHandler.isDraggingBottomMarker ||
              a.core.appStateHandler.isMainMenuShowing ||
              a.core.appStateHandler.isPopupMainMenuShowing ||
              a.core.appStateHandler.isAddButtonBeingDragged ||
              (a.core.zopHandler.continueScroll(c),
              a.core.drawAreaEffects.prepareAutoScroll(c));
          a.core.redraw(false);
        }
        !this.mouseRightDown ||
          a.core.appStateHandler.isMainMenuShowing ||
          a.core.appStateHandler.isPopupMainMenuShowing ||
          a.core.appStateHandler.isPopupEditRecurringMenuShowing ||
          (a.core.zopHandler.continueZoom(this.mouseZoomY, c),
          a.core.redraw(false));
        return false;
      }
    };
    d.prototype.touchEnd = function (b) {
      b.preventDefault();
      if (!this.touchOneFingerStarted && !this.touchTwoFingerStarted)
        return false;
      var c = b.touches;
      b = b.changedTouches;
      a.core.appStateHandler.isChoosingDateTimeForEvent &&
        this.testIfEndDraggingMarker();
      this.currentPressStartedTime < a.core.getTimeStamp() - 550 &&
        (this.canBeAClick = false);
      a.core.appStateHandler.isMainMenuBeingDragged
        ? a.core.mainMenuControl.endDragging()
        : a.core.appStateHandler.isAddButtonBeingDragged
        ? a.core.addButtonControl.endDragging()
        : !this.touchOneFingerStarted ||
          1 !== b.length ||
          (void 0 !== c && 0 !== c.length) ||
          (false === this.canBeAClick
            ? a.core.drawAreaEffects.startAutoScroll(
                this.getTouchY(b[0]) * a.core.ratio * a.core.domRatio
              )
            : this.click(
                b[0].pageX * a.core.ratio * a.core.domRatio,
                b[0].pageY * a.core.ratio * a.core.domRatio
              ));
      a.core.zopHandler.endScroll();
      a.core.zopHandler.endZoom();
      this.touchTwoFingerStarted =
        this.touchOneFingerStarted =
        this.canBeAClick =
          false;
      this.timeWhenLastTouchEnded = a.core.getTimeStamp();
      a.core.redraw(false);
      return false;
    };
    d.prototype.mouseUp = function (b) {
      b.preventDefault();
      if (true === a.core.touchEnabledDevice) this.removeAllMouseEvents();
      else
        return (
          a.core.appStateHandler.isMainMenuBeingDragged
            ? ((this.mouseLeftDown = false),
              a.core.mainMenuControl.endDragging())
            : a.core.appStateHandler.isAddButtonBeingDragged
            ? ((this.mouseLeftDown = false),
              a.core.addButtonControl.endDragging())
            : this.mouseLeftDown &&
              ((this.mouseLeftDown = false),
              a.core.appStateHandler.isDraggingTopMarker ||
                a.core.appStateHandler.isDraggingBottomMarker ||
                (a.core.zopHandler.endScroll(),
                3 < this.mouseWasDragged ||
                this.currentPressStartedTime < a.core.getTimeStamp() - 650
                  ? ((this.mouseWasDragged = 0),
                    a.core.drawAreaEffects.prepareAutoScroll(
                      b.pageY * a.core.ratio * a.core.domRatio,
                      200
                    ),
                    a.core.drawAreaEffects.startAutoScroll(
                      b.pageY * a.core.ratio * a.core.domRatio
                    ))
                  : this.click(
                      b.pageX * a.core.ratio * a.core.domRatio,
                      b.pageY * a.core.ratio * a.core.domRatio
                    )),
              a.core.appStateHandler.isChoosingDateTimeForEvent &&
                this.testIfEndDraggingMarker()),
          !this.mouseRightDown ||
            a.core.appStateHandler.isMainMenuShowing ||
            a.core.appStateHandler.isPopupMainMenuShowing ||
            a.core.appStateHandler.isPopupEditRecurringMenuShowing ||
            ((this.mouseRightDown = false), a.core.zopHandler.endZoom()),
          (this.canBeAClick = false),
          a.core.redraw(false),
          false
        );
    };
    d.prototype.mouseScroll = function (b) {
      b.preventDefault();
      var c = b.wheelDelta ? b.wheelDelta : -b.detail;
      if (
        0 !== c &&
        !(
          550 > a.core.getTimeStamp() - this.timeForLastScrollEvent &&
          12 > Math.abs(c)
        )
      ) {
        this.timeForLastScrollEvent = a.core.getTimeStamp();
        0 < c && (c = 0.5);
        0 > c && (c = -1);
        var e = a.core.zopHandler.topZOP,
          d = a.core.zopHandler.bottomZOP;
        a.core.drawAreaEffects.azRunning &&
          ((e = (a.core.drawAreaEffects.azGoalTopZOP + e) / 2),
          (d = (a.core.drawAreaEffects.azGoalBottomZOP + d) / 2));
        b =
          a.core.zopHandler.getZOPFromPixel(
            (b.pageY -
              (a.core.domHandler.screenTopForDOM * a.core.ratio +
                a.core.zopDrawArea.zopAreaTop)) *
              a.core.ratio *
              a.core.domRatio
          ) -
          (d + e) / 2;
        b = 0 < c ? 0.5 * b : -0.5 * b;
        c *= 0.25 * (d - e);
        e = e + b + c;
        d = d + b - c;
        a.core.drawAreaEffects.stopAllEffects();
        a.core.drawAreaEffects.startAutoZoom(e, d, false, function () {});
        return false;
      }
    };
    d.prototype.mouseLeave = function (b) {
      if (true === a.core.touchEnabledDevice) this.removeAllMouseEvents();
      else {
        a.core.appStateHandler.isAddButtonBeingDragged = false;
        if (
          b.pageX * a.core.ratio * a.core.domRatio >
            a.core.domHandler.screenWidth ||
          b.pageY * a.core.ratio * a.core.domRatio >
            a.core.domHandler.screenHeight
        )
          this.mouseLeftDown &&
            ((this.mouseLeftDown = false),
            a.core.zopHandler.endScroll(),
            a.core.drawAreaEffects.stopAllEffects()),
            this.mouseRightDown &&
              ((this.mouseRightDown = false), a.core.zopHandler.endZoom()),
            a.core.appStateHandler.isMainMenuBeingDragged
              ? ((this.mouseLeftDown = false),
                a.core.mainMenuControl.endDragging())
              : a.core.appStateHandler.isAddButtonBeingDragged &&
                ((this.mouseLeftDown = false),
                a.core.addButtonControl.endDragging());
        a.core.redraw(false);
      }
    };
    d.prototype.touchLeave = function (b) {
      a.core.appStateHandler.isAddButtonBeingDragged = false;
      a.core.zopHandler.endScroll();
      a.core.drawAreaEffects.stopAllEffects();
      a.core.zopHandler.endZoom();
      a.core.redraw(false);
    };
    return d;
  })();
  a.EventHandler = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
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
    d.prototype.setAbsoluteMinMax = function (a, c) {
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
    };
    d.prototype.initSize = function (a, c, e, d) {
      this.topPixel = a;
      this.bottomPixel = c;
      this.leftPixel = e;
      this.rightPixel = d;
    };
    d.prototype.getZoom = function () {
      return this.currentZoom;
    };
    d.prototype.setZoom = function (a, c, e, d) {
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
    };
    d.prototype.setZOPBounds = function (a, c) {
      this.topZOP = a;
      this.bottomZOP = c;
      var b = this.bottomZOP - this.topZOP;
      this.extendedTopZOP = this.topZOP - b;
      this.extendedBottomZOP = this.bottomZOP + b;
    };
    d.prototype.isObjectAboveScreen = function (a) {
      return a < this.topZOP ? true : false;
    };
    d.prototype.isObjectBelowScreen = function (a) {
      return a > this.bottomZOP ? true : false;
    };
    d.prototype.isObjectAboveExtendedScreen = function (a) {
      return a < this.extendedTopZOP ? true : false;
    };
    d.prototype.isObjectBelowExtendedScreen = function (a) {
      return a > this.extendedBottomZOP ? true : false;
    };
    d.prototype.startScroll = function (a) {
      this.originalDelta = this.currentDelta;
      this.currentYPixel = this.originalYPixel = a;
      this.scrolling = true;
    };
    d.prototype.continueScroll = function (b) {
      if (this.scrolling) {
        a.core.getTimeStamp();
        this.originalYPixel != b && a.core.getTimeStamp();
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
    };
    d.prototype.endScroll = function () {
      this.scrolling = false;
    };
    d.prototype.startZoom = function (a, c) {
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
    };
    d.prototype.continueZoom = function (a, c) {
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
    };
    d.prototype.endZoom = function () {};
    d.prototype.showInitialBounds = function (b) {
      var c =
          a.core.calendarDataProxy &&
          a.core.calendarDataProxy.demoVideoSpecial &&
          500 < this.currentZoom,
        e = this.dateToZOP(new Date()),
        d = a.core.calendarDateHandler.getCalendarDateObject(
          e,
          a.CalendarDateObjectType.Day,
          a.core.calendarDateHandler.rootCalendarDateObjects[0]
        );
      5 > d.calendarEvents.length &&
        (d = a.core.calendarDateHandler.getCalendarDateObject(
          e,
          a.CalendarDateObjectType.Month,
          a.core.calendarDateHandler.rootCalendarDateObjects[0]
        ));
      4 > d.calendarEvents.length &&
        (d = a.core.calendarDateHandler.getCalendarDateObject(
          e,
          a.CalendarDateObjectType.Year,
          a.core.calendarDateHandler.rootCalendarDateObjects[0]
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
        ? a.core.drawAreaEffects.startAutoZoom(e, d, c, function () {})
        : this.setZOPBounds(e, d);
      a.core.calendarDataProxy &&
        a.core.calendarDataProxy.analyticsValue(
          "Value",
          "Start",
          "Initial Zoom",
          d - e
        );
    };
    d.prototype.validateZoomValues = function () {
      this.currentZoom < this.absoluteMinZoom &&
        ((this.currentZoom = this.absoluteMinZoom),
        a.core.drawAreaEffects.stopAllEffects());
      this.currentZoom > this.absoluteMaxZoom &&
        ((this.currentZoom = this.absoluteMaxZoom),
        a.core.drawAreaEffects.stopAllEffects());
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
    };
    d.prototype.getPixelFromZOP = function (a) {
      return 0 === this.currentZoom
        ? 0
        : Math.floor(
            (a - this.currentDelta) / this.currentZoom + this.topPixel
          );
    };
    d.prototype.get2PixelsFromZOPsForVErticalText = function (b, c) {
      if (0 === this.currentZoom) return new a.NumberPair(0, 0);
      var e = (c - this.currentDelta) / this.currentZoom + this.topPixel,
        d = Math.floor(
          e - ((b - this.currentDelta) / this.currentZoom + this.topPixel)
        ),
        e = Math.floor(e);
      return new a.NumberPair(e - d, e);
    };
    d.prototype.getZOPFromPixel2 = function (a, c, e) {
      return (a - this.topPixel) * c + e;
    };
    d.prototype.getZOPFromPixel = function (a) {
      return this.getZOPFromPixel2(a, this.currentZoom, this.currentDelta);
    };
    d.prototype.getZOPFromPixelDiff = function (a) {
      return (
        this.getZOPFromPixel2(a, this.currentZoom, this.currentDelta) -
        this.getZOPFromPixel2(0, this.currentZoom, this.currentDelta)
      );
    };
    d.prototype.getFractionalPixelDistance = function (a) {
      return 0 === this.currentZoom ? 0 : a / this.currentZoom;
    };
    d.prototype.updateStartEndZOP = function (a) {
      a.startZOP = this.dateToZOP(a.startDateTime);
      a.endZOP = this.dateToZOP(a.endDateTime) - 1;
    };
    d.prototype.dateToZOP = function (b) {
      return (Number(b) - a.core.settings.globalMinDate) / 6e4;
    };
    d.prototype.getDateFromZOP = function (b) {
      return new Date(6e4 * b + a.core.settings.globalMinDate);
    };
    d.prototype.getPixelFromDate = function (a) {
      return this.getPixelFromZOP(this.dateToZOP(a));
    };
    d.prototype.getDateFromPixel = function (a) {
      return this.getDateFromZOP(this.getZOPFromPixel(a));
    };
    d.prototype.getZOPSizeOf = function (b) {
      switch (b) {
        case a.CalendarDateObjectType.Minutes5:
          return this.zopSizeOf5Minutes;
        case a.CalendarDateObjectType.Hour:
          return this.zopSizeOfHour;
        case a.CalendarDateObjectType.Day:
          return this.zopSizeOfDay;
        case a.CalendarDateObjectType.Week:
          return this.zopSizeOfWeek;
        case a.CalendarDateObjectType.Month:
          return this.zopSizeOfMonth;
        case a.CalendarDateObjectType.Year:
          return this.zopSizeOfYear;
        default:
          throw Error("Unhandled CalendarDateObjectType");
      }
    };
    d.prototype.getPixelSizeOf = function (b) {
      switch (b) {
        case a.CalendarDateObjectType.Minutes5:
          return this.getPixelSizeOf5Minutes();
        case a.CalendarDateObjectType.Hour:
          return this.getPixelSizeOfHour();
        case a.CalendarDateObjectType.Day:
          return this.getPixelSizeOfDay();
        case a.CalendarDateObjectType.Week:
          return this.getPixelSizeOfWeek();
        case a.CalendarDateObjectType.Month:
          return this.getPixelSizeOfMonth();
        case a.CalendarDateObjectType.Year:
          return this.getPixelSizeOfYear();
        default:
          throw Error("Unhandled CalendarDateObjectType");
      }
    };
    d.prototype.getPixelSizeOfYear = function () {
      return this.zopSizeOfYear / this.currentZoom;
    };
    d.prototype.getPixelSizeOfMonth = function () {
      return this.zopSizeOfMonth / this.currentZoom;
    };
    d.prototype.getPixelSizeOfWeek = function () {
      return this.zopSizeOfWeek / this.currentZoom;
    };
    d.prototype.getPixelSizeOfDay = function () {
      return this.zopSizeOfDay / this.currentZoom;
    };
    d.prototype.getPixelSizeOfHour = function () {
      return this.zopSizeOfHour / this.currentZoom;
    };
    d.prototype.getPixelSizeOf5Minutes = function () {
      return this.zopSizeOf5Minutes / this.currentZoom;
    };
    return d;
  })();
  a.ZopHandler = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function a() {
      this.cacheKeys = [];
      this.cacheObjects = [];
      this.nextCacheKeys = [];
      this.nextCacheObjects = [];
      this.lastIndex = -1;
    }
    a.prototype.startNewRound = function () {
      this.lastIndex = -1;
      this.cacheKeys = this.nextCacheKeys;
      this.cacheObjects = this.nextCacheObjects;
      this.nextCacheKeys = [];
      this.nextCacheObjects = [];
    };
    a.prototype.emptyCache = function () {
      this.lastIndex = -1;
      this.cacheKeys = [];
      this.cacheObjects = [];
      this.nextCacheKeys = [];
      this.nextCacheObjects = [];
    };
    a.prototype.findObject = function (a) {
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
    };
    a.prototype.addObject = function (a, c) {
      this.nextCacheKeys.push(a);
      this.nextCacheObjects.push(c);
    };
    return a;
  })();
  a.SpeedCache = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function a() {
      this.keys = [];
      this.values = [];
    }
    a.prototype.put = function (a, b) {
      this.keys.push(a);
      this.values.push(b);
    };
    a.prototype.find = function (a) {
      var b;
      for (b = 0; b < this.keys.length; b++)
        if (this.keys[b] == a) return this.values[b];
    };
    return a;
  })();
  a.Hashtable = p;
  (function (a) {
    a[(a.ThisOnly = 10)] = "ThisOnly";
    a[(a.AllInSeries = 20)] = "AllInSeries";
    a[(a.ThisAndFuture = 30)] = "ThisAndFuture";
    a[(a.None = 40)] = "None";
    a[(a.DontKnow = 50)] = "DontKnow";
    a[(a.New = 51)] = "New";
  })(a.EventEditType || (a.EventEditType = {}));
  (function (a) {
    a[(a.Visible = 10)] = "Visible";
    a[(a.Hidden = 20)] = "Hidden";
  })(a.VisibilityType || (a.VisibilityType = {}));
  (function (a) {
    a[(a.Minutes5 = 0)] = "Minutes5";
    a[(a.Hour = 1)] = "Hour";
    a[(a.Day = 2)] = "Day";
    a[(a.Week = 3)] = "Week";
    a[(a.Month = 4)] = "Month";
    a[(a.Year = 5)] = "Year";
    a[(a.Title = 6)] = "Title";
  })(a.CalendarDateObjectType || (a.CalendarDateObjectType = {}));
  var d = a.CalendarDateObjectType,
    p = (function () {
      return function (b, c, e, d, g, m, n) {
        this.summary = b ? b : "";
        this.description = c ? c : "";
        this.location = e;
        this.startDateTime = d;
        this.endDateTime = g;
        0 === g.getHours() &&
          0 === g.getMinutes() &&
          (this.endDateTime = a.core.calendarDateHandler.addMinutes(g, -1));
        a.core.zopHandler.updateStartEndZOP(this);
        this.isGraded = false;
        this.grade = 0;
        this.calendarId = m;
        this.id = n;
      };
    })();
  a.CalendarEventObject = p;
  p = (function () {
    return function (a, c, e, d, g, m, n) {
      this.id = a;
      this.name = c;
      this.colorId = d;
      this.visibility = g;
      this.canEditCalendar = m;
      this.canEditCalendarEvents = n;
      this.defaultReminders = e;
      this.allEventsAreFullDay = true;
      this.countEvents = 0;
    };
  })();
  a.CalendarObject = p;
  p = (function () {
    return function (a) {
      this.minutes = +a;
    };
  })();
  a.Reminder = p;
  p = (function () {
    return function (b, c, e) {
      this.details = [];
      this.possibleFullEvents = [];
      this.calendarEvents = [];
      this.calendarDateObjectType = b;
      this.detailsArePopulated = true;
      this.isReadyForParentToBeShown = false;
      this.startDateTime = c;
      this.endDateTime = new Date(this.startDateTime.getTime());
      this.startZOP = a.core.zopHandler.dateToZOP(this.startDateTime);
      this.isRed = false;
      b === d.Minutes5 &&
        (this.endDateTime.setMinutes(this.startDateTime.getMinutes() + 5),
        a.core.commonUserSettings.use24hFormat
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
      b === d.Hour &&
        (this.endDateTime.setHours(this.startDateTime.getHours() + 1),
        a.core.commonUserSettings.use24hFormat
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
      b === d.Day &&
        (this.endDateTime.setDate(this.startDateTime.getDate() + 1),
        (this.shortText = this.startDateTime.getDate().toString()),
        (this.shortText2 = a.core.helper.weekdayShort.find(
          this.startDateTime.getDay()
        )),
        void 0 == this.shortText2 &&
          ((this.shortText2 = moment(this.startDateTime).format("ddd")),
          a.core.helper.weekdayShort.put(
            this.startDateTime.getDay(),
            this.shortText2
          ),
          a.core.helper.weekdayShort.put(
            this.startDateTime.getDay() + 7,
            this.shortText2
          )),
        (this.longText = a.core.helper.weekdayLong.find(
          this.startDateTime.getDay()
        )),
        void 0 == this.longText &&
          ((this.longText = moment(this.startDateTime).format("dddd")),
          a.core.helper.weekdayLong.put(
            this.startDateTime.getDay(),
            this.longText
          ),
          a.core.helper.weekdayLong.put(
            this.startDateTime.getDay() + 7,
            this.longText
          )),
        (this.longText = this.startDateTime.getDate() + " " + this.longText),
        (this.detailsArePopulated = false),
        this.startDateTime.getDay() === a.core.settings.redDay &&
          (this.isRed = true));
      b === d.Week &&
        (this.endDateTime.setDate(this.endDateTime.getDate() + 7),
        (this.detailsArePopulated = true),
        (this.details = [{}, {}, {}, {}, {}, {}, {}]));
      b === d.Month &&
        (this.endDateTime.setMonth(this.startDateTime.getMonth() + 1),
        (this.shortText = a.core.helper.monthesShort.find(
          this.startDateTime.getMonth()
        )),
        void 0 == this.shortText &&
          ((this.shortText = moment(this.startDateTime).format("MMM")),
          a.core.helper.monthesShort.put(
            this.startDateTime.getMonth(),
            this.shortText
          )),
        (this.longText = a.core.helper.monthesLong.find(
          this.startDateTime.getTime()
        )),
        void 0 == this.longText &&
          ((this.longText = moment(this.startDateTime).format("MMMM YYYY")),
          a.core.helper.monthesLong.put(
            this.startDateTime.getTime(),
            this.longText
          )),
        (this.parentText = ""),
        (this.detailsArePopulated = false));
      b === d.Year &&
        (this.endDateTime.setFullYear(this.startDateTime.getFullYear() + 1),
        (this.shortText = "" + this.startDateTime.getFullYear()),
        (this.longText = "" + this.startDateTime.getFullYear()),
        (this.detailsArePopulated = false));
      b === d.Title &&
        ((this.endDateTime = e),
        (this.longText = "OneView Calendar"),
        (this.detailsArePopulated = false));
      this.endZOP = a.core.zopHandler.dateToZOP(this.endDateTime);
    };
  })();
  a.CalendarDateObject = p;
  p = (function () {
    return function (a, c, e, d) {
      this.calendarEvent = a;
      this.calendarDate = c;
      this.calendarDateDetail = e;
      this.position = d;
    };
  })();
  a.PossibleEventTagsAtThisZoomLevel = p;
  p = (function () {
    return function (a, c) {
      this.extraSpace = 0;
      this.calendarEventTagWrappers = [];
      this.parentBottomZOP = this.parentTopZOP = 0;
      this.calendarDateObject = a;
      this.availableSpace = c;
    };
  })();
  a.CalendarEventTagGroup = p;
  p = (function () {
    return function (a) {
      this.wantedPixelShift = this.right = this.left = this.position = 0;
      this.isPartial = false;
      this.parentCollidingFullEventWrappers = [];
      this.visible = true;
      this.calendarEvent = a;
    };
  })();
  a.CalendarEventTagWrapper = p;
  p = (function () {
    return function (a) {
      this.widthPercentWhenTagsExist = this.widthPercent = 0;
      this.preferredWidth = this.right = this.left = void 0;
      this.collisionsHaveBeenChecked = false;
      this.parentCollidingFullEventWrappers = [];
      this.childCollidingFullEventWrappers = [];
      this.childCollidingEventTagWrappers = [];
      this.calendarEvent = a;
    };
  })();
  a.CalendarFullEventWrapper = p;
  p = (function () {
    return function () {
      this.closeToBellow = this.closeToAbove = false;
    };
  })();
  a.Badge = p;
  p = (function () {
    return function () {
      this.left = this.maxZOP = this.minZOP = 0;
    };
  })();
  a.OccupiedSpaceObject = p;
  p = (function () {
    return function () {
      this.parentCollidingFullEventWrapper = void 0;
      this.maxZOP = this.minZOP = 0;
    };
  })();
  a.TagSurface = p;
  p = (function () {
    return function () {};
  })();
  a.TagDataToPaint = p;
  p = (function () {
    return function (a, c) {
      this.value1 = a;
      this.value2 = c;
    };
  })();
  a.NumberPair = p;
  p = (function () {
    return function (a, c) {
      this.valueNumber = a;
      this.valueString = c;
    };
  })();
  a.NumberStringPair = p;
  (function (a) {
    a[(a.Year = 0)] = "Year";
    a[(a.Month = 1)] = "Month";
    a[(a.Week = 2)] = "Week";
    a[(a.Day = 3)] = "Day";
    a[(a.Hourly = 4)] = "Hourly";
    a[(a.Minutely = 5)] = "Minutely";
    a[(a.Secondly = 6)] = "Secondly";
  })(a.RRuleFrequencies || (a.RRuleFrequencies = {}));
  (function (a) {
    a[(a.Monday = 0)] = "Monday";
    a[(a.Tuesday = 1)] = "Tuesday";
    a[(a.Wednesday = 2)] = "Wednesday";
    a[(a.Thursday = 3)] = "Thursday";
    a[(a.Friday = 4)] = "Friday";
    a[(a.Saturday = 5)] = "Saturday";
    a[(a.Sunday = 6)] = "Sunday";
  })(a.RRuleWeekDay || (a.RRuleWeekDay = {}));
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function e(a) {
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
    e.prototype.reloadThemesSettings = function (e) {
      this.themes = new a.Dictionary();
      this.themes.add("0", new d());
      e.licenceDarkTheme && this.themes.add("3", new b());
      e.licenceCandyTheme && this.themes.add("4", new c());
      this.themes.containsKey(e.theme) || (e.theme = "0");
      this.theme = this.themes[e.theme];
    };
    e.prototype.reloadTheme = function () {
      this.themes.containsKey(a.core.commonUserSettings.theme) ||
        (a.core.commonUserSettings.theme = "0");
      this.theme = this.themes[a.core.commonUserSettings.theme];
    };
    return e;
  })();
  a.Settings = p;
  p = (function () {
    return function () {
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
    };
  })();
  a.OriginalColorTheme = p;
  p = (function () {
    return function () {
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
    };
  })();
  a.MaterialColorTheme = p;
  var d = (function () {
    return function () {
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
    };
  })();
  a.FreeTheme = d;
  var b = (function () {
    return function () {
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
    };
  })();
  a.DarkTheme = b;
  var c = (function () {
    return function () {
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
    };
  })();
  a.CandyTheme = c;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function d() {
      this.calendars = [];
      this.debugtext = "";
      this.touchEnabledDevice = this.isCordovaApp = false;
      this.charCodeReload = "reload";
      this.charCodeLogin = "cloud-download";
      this.charCodeLogout = "cloud-upload";
      this.charCodeCalendars = "layers";
      this.charCodeShop = "shop";
      this.charCodeAbout = "help";
      this.charCodeHeart = "heart";
      this.charCodeSend = "send";
      this.charCodeFake = "drop";
      this.charCodeLogo = "logo";
      this.charCodeSettings = "cog";
      this.charCodeBack = "arrow-left";
      this.charCodeMoveBlack = this.charCodeMove = "clock";
      this.charCodeEdit = "pencil";
      this.charCodeDelete = "trash";
      this.charCodeOk = "check";
      this.charCodeCancel = "cross";
      this.charCodeView = "eye";
      this.charCodeNew = "circle-plus";
      this.charCodeMenu = "menu";
      this.charCodeAdd = "add";
      this.alreadyRedrawing = this.pageLoaded = this.readyToGo = false;
      this.redrawCountdown =
        this.maxTime =
        this.totalRedraws =
        this.totalTime =
        this.fps =
        this.lastDrawTime =
          0;
      this.hardRedraw = false;
      this.debugCounter = 0;
      this.requestAnimFrame = (function () {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (a) {
            window.setTimeout(a, 1e3 / 60);
          }
        );
      })();
      this.firstTouchMade = false;
      this.loadedFiles = [];
      this.loadingHandler = new a.LoadingHandler();
      this.isCordovaApp =
        -1 === document.URL.indexOf("http://") &&
        -1 === document.URL.indexOf("https://") &&
        -1 ===
          document.URL.indexOf(
            "file:///web.archive.org/web/20190808203716/http://c/Users/Peter/Documents/dev"
          );
      this.loadDataProxy();
      this.dynamicallyLoadFile("css/style.css", "css", function () {});
      window.devicePixelRatio &&
        0 !== window.devicePixelRatio &&
        (this.ratio = window.devicePixelRatio);
      this.helper = new a.Helper();
      this.commonUserSettings = new a.CommonUserSettings();
      this.zopHandler = new a.ZopHandler();
      this.settings = new a.Settings(this.commonUserSettings);
      this.drawArea = new a.DrawArea();
      this.eventHandler = new a.EventHandler();
      this.domHandler = new a.DomHandler();
      this.zopDrawArea = new a.ZopDrawArea();
      this.appStateHandler = new a.AppStateHandler();
      this.dateTimeSelectionHandler = new a.DateTimeSelectionHandler();
    }
    d.prototype.init = function () {
      this.setSizeSettings();
      this.domHandler.init();
      this.dateTimeSelectionHandler.init();
      // this.commonUserSettings.updateAppWithLang();
      this.debugTexts = [];
      this.redrawCore = this.redrawCore.bind(this);
      this.loadGraphics();
    };
    d.prototype.loadDataProxy = function () {
      this.isCordovaApp
        ? ((this.populateCalendars = this.populateCalendars.bind(this)),
          this.populateCalendars())
        : (this.dynamicallyLoadFile("libs/analytics.js", "js", function () {}),
          this.dynamicallyLoadFile(
            "https://web.archive.org/web/20190808203716/https://apis.google.com/js/client.js?onload=populateCalendars",
            "js",
            function () {}
          ));
    };
    d.prototype.redraw = function (a) {
      this.hardRedraw = a;
      this.redrawCountdown = 1;
    };
    d.prototype.startDrawLoop = function () {
      this.redrawCountdown = 1;
      this.redrawCore();
    };
    d.prototype.redrawCore = function () {
      this.debugtextDiv
        ? this.debugtextDiv.innerText !== this.debugtext &&
          (this.debugtextDiv.innerText = this.debugtext)
        : (this.debugtextDiv = document.getElementById("debugtext"));
      var b;
      if (
        !this.alreadyRedrawing &&
        true === this.readyToGo &&
        a.core.appStateHandler.sizesInitiated &&
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
    };
    d.prototype.getTimeStamp = function () {
      return window.performance && window.performance.now
        ? window.performance.now()
        : window.performance && window.performance.webkitNow
        ? window.performance.webkitNow()
        : new Date().getTime();
    };
    d.prototype.reopenApp = function () {
      a.core.helper.canShowDatePicker() &&
        ((this.onSuccessX = this.onSuccessX.bind(this)),
        (this.onErrorX = this.onErrorX.bind(this)),
        datePicker.updateThemeColor(
          this.settings.theme.colorTitleBackground,
          "3" == this.commonUserSettings.theme,
          this.onSuccessX,
          this.onErrorX
        ));
    };
    d.prototype.onSuccessX = function (a) {
      datePicker.restartApp(
        function () {},
        function () {}
      );
    };
    d.prototype.onErrorX = function (a) {};
    d.prototype.reloadAllCalendarData = function () {
      this.calendarDateHandler.reset();
      this.calendarDataProxy
        ? this.calendarDataProxy.reload()
        : this.loadDataProxy();
    };
    d.prototype.persistChangesToCalendars = function () {
      a.core.calendarDataProxy.saveSettings();
    };
    d.prototype.populateCalendars = function () {
      var b = this;
      a.core && a.core.pageLoaded
        ? (this.calendarDataProxy ||
            (this.isCordovaApp
              ? ((this.calendarDataProxy = new a.AndroidCalendarDataProxy()),
                this.calendarDataProxy.analyticsEvent("Event", "App started"))
              : -1 < document.URL.indexOf("rio2016")
              ? ((this.enableGoogle = this.enableDemoMode = false),
                (this.calendarDataProxy = new a.RioCalendarDataProxy()),
                this.calendarDataProxy.analyticsEvent("Event", "Rio started"))
              : ((this.enableGoogle = this.enableDemoMode = true),
                a.DemoCalendarDataProxy.getLastSessionWasInDemoMode()
                  ? (this.calendarDataProxy = new a.DemoCalendarDataProxy())
                  : (this.calendarDataProxy =
                      new a.GoogleCalendarDataProxy()))),
          this.loadingHandler.startLoading(),
          this.calendarDataProxy.populateCalendarEvents(function () {
            b.dataLoadReady();
          }))
        : ((this.populateCalendars = this.populateCalendars.bind(this)),
          window.setTimeout(this.populateCalendars, 100));
    };
    d.prototype.dataLoadReady = function () {
      this.firstTouchMade || a.core.zopHandler.showInitialBounds(true);
      a.core.calendarEventHandler.dataLoadReady();
      a.core.loadingHandler.stopLoading();
      this.redraw(true);
    };
    d.prototype.dynamicallyLoadFile = function (a, c, e) {
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
    };
    d.prototype.getCalendar = function (b) {
      var c;
      for (c = 0; c < this.calendars.length; c++)
        if (this.calendars[c].id === b) return this.calendars[c];
      return new a.CalendarObject(
        "NoneZ",
        "None",
        [],
        1,
        a.VisibilityType.Hidden,
        true,
        true
      );
    };
    d.prototype.setSizeSettings = function () {
      var b = Math.max(
        6.67,
        Math.min(
          10,
          Math.min(
            a.core.domHandler.screenWidthForDOM,
            a.core.domHandler.screenHeightForDOM
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
    };
    d.prototype.showBackButtons = function () {
      return !new a.Helper().isAndroid() || !a.core.isCordovaApp;
    };
    d.prototype.loadGraphics = function () {
      this.drawAreaEffects = new a.DrawAreaEffects();
      this.calendarEventHandler = new a.CalendarEventHandler();
      this.calendarDateHandler = new a.CalendarDateHandler();
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
    };
    d.prototype.preloadAllImages = function () {
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
    };
    d.prototype.preloadImage = function (b) {
      a.core.drawArea.drawIcon(b, -100, -100, 16, 16);
    };
    return d;
  })();
  a.Core = p;
})(OneView || (OneView = {}));
window.populateCalendars = function () {
  OneView.core.populateCalendars();
};
function bob() {
  OneView.core = new OneView.Core();
  OneView.core.init();
  OneView.core.startDrawLoop();
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
(function (a) {
  var p = (function () {
    function d(b) {
      this.languages = new a.Dictionary();
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
    d.languageExists = function (a) {
      return (
        0 <= xLanguageAbbreviations.indexOf(a) || 0 <= xLanguageNames.indexOf(a)
      );
    };
    d.prototype.get = function (a) {
      var b = this.keys.indexOf(a);
      if (0 > b) return a;
      b = xTranslations[b][this.currentLanguageIndex];
      return void 0 !== b && null !== b && "" != b ? b : a;
    };
    return d;
  })();
  a.Translate = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function a() {
      this._keys = [];
      this._values = [];
    }
    a.prototype.setup = function (a, c) {
      for (var b = 0; b < a.length; b++) this.add(a[b], c[b]);
    };
    a.prototype.syncArrays = function () {
      for (var a = 0; a < this._values.length; a++)
        this._values[a] = this[this._keys[a]];
    };
    a.prototype.add = function (a, c) {
      this[a] = c;
      this._keys.push(a);
      this._values.push(c);
    };
    a.prototype.remove = function (a) {
      var b = this._keys.indexOf(a, 0);
      this._keys.splice(b, 1);
      this._values.splice(b, 1);
      delete this[a];
    };
    a.prototype.keys = function () {
      return this._keys;
    };
    a.prototype.values = function () {
      return this._values;
    };
    a.prototype.containsKey = function (a) {
      return "undefined" === typeof this[a] ? false : true;
    };
    a.prototype.toLookup = function () {
      return this;
    };
    return a;
  })();
  a.Dictionary = p;
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function b(a, b) {
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
    b.prototype.setTagHeight = function (a) {
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
    };
    b.prototype.setDateHeights = function (a, b) {
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
    };
    b.prototype.setBadgeHeight = function (a) {
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
    };
    b.prototype.emptyCache = function () {
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
    };
    b.prototype.setBoundries = function () {
      this.tagsLeft = a.core.settings.eventsFarLeft;
      this.tagsTop = 0;
      this.tagsWidth = this.canvas.width - this.tagsLeft;
      this.tagsHeight = this.canvas.height;
      this.badgesLeft = a.core.settings.badgesLeft;
      this.badgesTop = 0;
      this.badgesWidth = this.tagsLeft - this.badgesLeft;
      this.badgesHeight = this.canvas.height;
      this.datesLeft = a.core.settings.titleWidth;
      this.datesTop = 0;
      this.datesWidth = this.badgesLeft - this.datesLeft;
      this.datesHeight =
        Math.floor(
          this.canvas.height / (this.dateTextHeight + this.date2TextHeight)
        ) * this.dateTextHeight;
      this.dates2Left = a.core.settings.titleWidth;
      this.dates2Top = this.datesHeight;
      this.dates2Width = this.badgesLeft - this.dates2Left;
      this.dates2Height =
        Math.floor(
          this.canvas.height / (this.dateTextHeight + this.date2TextHeight)
        ) * this.date2TextHeight;
    };
    b.prototype.startRedraw = function () {
      var a;
      for (a = 0; a < this.cachedTags.length; a++)
        this.cachedTags[a].wasUsedLast = false;
      for (a = 0; a < this.cachedDates.length; a++)
        this.cachedDates[a].wasUsedLast = false;
      for (a = 0; a < this.cachedDates2.length; a++)
        this.cachedDates2[a].wasUsedLast = false;
      for (a = 0; a < this.cachedBadges.length; a++)
        this.cachedBadges[a].wasUsedLast = false;
    };
    b.prototype.endRedraw = function () {
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
    };
    b.prototype.drawTagText = function (a, b, d, g, m, n, l) {
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
    };
    b.prototype.drawDateText = function (a, b, d, g, m, n, l, h) {
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
    };
    b.prototype.drawBadgeText = function (a, b, d, g, m, n, l) {
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
    };
    b.prototype.drawTextHelper = function (
      a,
      b,
      f,
      g,
      m,
      n,
      l,
      h,
      k,
      p,
      q,
      r,
      v
    ) {
      h = Math.min(h, r);
      a = new d();
      a.text = b;
      a.textColor = f;
      this.paintImageToCacheCanvas(a, m, k, p, n, h, l);
    };
    b.prototype.paintImageToCacheCanvas = function (a, b, d, g, m, n, l) {
      b === this.canvasContext && b.clearRect(m, l, n, g);
      this.setFont(d, b);
      b.fillStyle = a.textColor;
      b.fillText(a.text, m, l + d);
    };
    b.prototype.getImageFromCacheCanvas = function (a, b, d, g, m, n, l, h) {
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
    };
    b.prototype.setFont = function (a, b) {
      var c = "normal lighter " + a + "px Roboto";
      b !== this.canvasContext
        ? (b.font = c)
        : this.previousFont !== c &&
          ((this.previousFont = c), (b.font = this.previousFont));
    };
    return b;
  })();
  a.CanvasHorizontalCacheObject = p;
  var d = (function () {
    return function () {
      this.wasUsedLast = false;
      this.isEmpty = true;
      this.textColor = this.text = "";
    };
  })();
})(OneView || (OneView = {}));
(function (a) {
  var p = (function () {
    function e() {
      this.canvasContext = this.canvas = void 0;
      this.zopAreaWidth =
        this.zopAreaLeft =
        this.zopAreaHeight =
        this.zopAreaTop =
        this.screenTop =
        this.screenLeft =
          0;
      this.characterFitCache = new a.SpeedCache();
      this.textMeasuresCache = new a.SpeedCache();
      this.drawInfos = [];
    }
    e.prototype.init = function (b, c) {
      this.canvas = b;
      this.canvasContext = c;
      a.core.eventHandler.addBatchEventsTo(this.canvas);
    };
    e.prototype.setCanvas = function (b, c) {
      this.canvas = b;
      this.canvasContext = c;
      a.core.drawArea = new a.DrawArea();
    };
    e.prototype.fillDrawArea = function (a) {
      this.canvasContext.fillStyle = a;
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    e.prototype.emptyDrawArea = function () {
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    e.prototype.clearDrawArea = function () {
      this.characterFitCache.startNewRound();
      this.textMeasuresCache.startNewRound();
      a.core.drawArea.drawFilledRectangle(
        a.core.zopHandler.leftPixel +
          a.core.settings.titleWidth +
          a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
        0,
        a.core.zopHandler.rightPixel - a.core.zopHandler.leftPixel,
        a.core.zopDrawArea.zopAreaHeight,
        a.core.settings.theme.colorBackground,
        false
      );
      a.core.drawArea.drawFilledRectangle(
        a.core.zopHandler.leftPixel,
        0,
        a.core.settings.titleWidth +
          a.core.mainMenuControl.nudgeBecauseMenuBeingDragged,
        a.core.zopDrawArea.zopAreaHeight,
        a.core.settings.theme.colorTitleBackground,
        false
      );
    };
    e.prototype.resetDrawAreaSize = function (b, c) {
      this.zopAreaTop = 0;
      this.zopAreaHeight = b;
      this.zopAreaLeft = 0;
      this.zopAreaWidth = c;
      a.core.appStateHandler.isChoosingDateTimeForEvent &&
        ((this.zopAreaTop +=
          a.core.dateTimeSelectionHandler.getSpaceTakenAtTop()),
        (this.zopAreaHeight -=
          a.core.dateTimeSelectionHandler.getSpaceTakenAtTop() +
          a.core.dateTimeSelectionHandler.getSpaceTakenAtBottom()));
      a.core.zopHandler.initSize(
        this.zopAreaTop,
        this.zopAreaTop + this.zopAreaHeight,
        this.zopAreaLeft,
        this.zopAreaLeft + this.zopAreaWidth
      );
      a.core.zopHandler.setZoom(
        a.core.zopHandler.topZOP,
        a.core.zopHandler.bottomZOP,
        this.zopAreaTop,
        this.zopAreaTop + this.zopAreaHeight
      );
    };
    e.prototype.setShadow = function (b) {
      b &&
        ((this.canvasContext.shadowOffsetX = 1 * a.core.ratio),
        (this.canvasContext.shadowOffsetY = 2 * a.core.ratio),
        (this.canvasContext.shadowBlur = 4 * a.core.ratio),
        (this.canvasContext.shadowColor = "#555555"));
    };
    e.prototype.clearTextDivs = function () {};
    e.prototype.drawCalendarDateObjectName = function (b, c, e, d, l, h, k, p) {
      if (3 > l) return 0;
      c += e;
      e = a.core.settings.theme.colorDarkText;
      h && (e = a.core.settings.theme.colorRedDayText);
      return k
        ? this.measureTextWidth(
            this.drawText(
              d,
              b,
              c,
              0,
              l,
              e,
              a.core.settings.theme.colorBackground,
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
              a.core.settings.theme.colorBackground,
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
    };
    e.prototype.drawBadge = function (b, c, e, d, l, h, k) {
      if (a.core.settings.useMiniBadges)
        this.drawFilledCircle2(
          b,
          c + e / 2,
          2 * a.core.ratio * a.core.settings.zoom,
          k,
          false
        );
      else {
        e = e - a.core.settings.margin - 1;
        var f = a.core.settings.badgeTextHeight;
        a.core.drawArea.setFont(f);
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
            a.core.settings.theme.colorRed,
            false,
            200,
            false,
            false
          );
      }
    };
    e.prototype.howManyCharactersFit = function (a, b, e, d) {
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
      this.characterFitCache.addObject(f, new c(k, e));
      return k;
    };
    e.prototype.measureTextWidth = function (a, b, c, e) {
      var f = a + "##" + b,
        g = this.textMeasuresCache.findObject(f);
      void 0 === g &&
        ((g = new d(this.canvasContext, a, b, c, e)),
        this.textMeasuresCache.addObject(f, g));
      return g.pixelLength;
    };
    e.prototype.measureTextWidthIfRisky = function (a, b, c, e, d) {
      var f = a.length * b * 0.85;
      return f > c ? this.measureTextWidth(a, b, e, d) : f;
    };
    e.prototype.drawTag = function (b, c, e, d, l, h, k, p) {
      var f = c + 1;
      e -= a.core.settings.margin;
      var g = Math.min(a.core.settings.tagColorWidth, e),
        m = Math.floor(
          (h - a.core.settings.tagTextHeight) / 2 - a.core.settings.margin
        ),
        n = m + a.core.settings.margin;
      0 < g &&
        a.core.drawArea.drawFilledRectangle(
          b,
          f,
          g,
          h - a.core.settings.margin,
          a.core.settings.theme.colorBlue,
          false
        );
      0 < e - g &&
        (a.core.drawArea.drawFilledRectangle(
          b + g,
          f,
          e - g,
          h - a.core.settings.margin,
          d,
          false
        ),
        0.5 < p &&
          (0.95 > p && (l = a.core.helper.colorToRGBA(l, 2 * (p - 0.5))),
          this.drawText(
            k,
            b + g + n,
            c,
            m,
            a.core.settings.tagTextHeight,
            l,
            d,
            false,
            e - g - n - 2,
            false,
            a.core.settings.theme.tagTextIsBold
          )));
    };
    e.prototype.drawFullEvent = function (b, c, e, d, l, h, k) {
      var f = Math.max(a.core.zopHandler.getPixelFromZOP(c) + 1, 0),
        g = Math.max(a.core.zopHandler.getPixelFromZOP(e), 0),
        m =
          a.core.zopHandler.getPixelFromZOP(e) -
          a.core.zopHandler.getPixelFromZOP(c),
        f = Math.min(f, g - a.core.settings.tagHeight);
      d -= a.core.settings.margin;
      g = g - f - 1;
      if (!(0 >= g)) {
        var n = Math.min(a.core.settings.tagColorWidth, d),
          p = Math.floor(
            (a.core.settings.tagHeight - a.core.settings.tagTextHeight) / 2 -
              a.core.settings.margin
          ),
          w = p + a.core.settings.margin,
          z = Math.min(a.core.settings.tagHeight, d - n);
        0 < n &&
          a.core.drawArea.drawFilledRectangle(
            b,
            f,
            n,
            g,
            a.core.settings.theme.colorBlue,
            false
          );
        0 < d - n &&
          a.core.drawArea.drawFilledRectangle(b + n, f, d - n, g, l, false);
        1.6 * d > m || m < 2 * a.core.settings.tagHeight
          ? this.drawText(
              k,
              b + n + w,
              f - 1,
              p,
              a.core.settings.tagTextHeight,
              h,
              l,
              false,
              d - n - w - 2,
              false,
              a.core.settings.theme.tagTextIsBold
            )
          : z > a.core.settings.tagTextHeight &&
            ((w = Math.floor(a.core.settings.tagHeight / 6)),
            this.drawVerticalTitle(
              c,
              e,
              b + n + w,
              k,
              a.core.settings.tagTextHeight,
              h,
              a.core.settings.margin,
              false,
              a.core.settings.theme.tagTextIsBold
            ));
      }
    };
    e.prototype.drawPartialTag = function (b, c, e, d, l) {
      e -= a.core.settings.margin;
      4 > l ||
        a.core.drawArea.drawFilledRectangle(
          b,
          c + 1,
          e,
          l - a.core.settings.margin,
          d,
          false
        );
    };
    e.prototype.drawTextDiv = function (a, b, c, e, d, h, k, p, q, r) {};
    e.prototype.drawFilledRectangle = function (b, c, e, d, l, h) {
      this.canvasContext.fillStyle = l;
      c = a.core.zopHandler.getPixelFromZOP(c);
      d = Math.max(a.core.zopHandler.getPixelFromZOP(d) - c, h);
      this.canvasContext.fillRect(b, c, e, d);
    };
    e.prototype.drawTriangle = function (b, c, e, d, l, h, k, p) {
      this.setShadow(p);
      c = a.core.zopHandler.getPixelFromZOP(c);
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
    };
    e.prototype.removeShadow = function (a) {
      a &&
        ((this.canvasContext.shadowOffsetX = 0),
        (this.canvasContext.shadowOffsetY = 0),
        (this.canvasContext.shadowBlur = 0),
        (this.canvasContext.shadowColor = "#000000"));
    };
    e.prototype.drawHorizontalLine = function (b, c, e, d, l) {
      this.drawHorizontalLineThick(
        b,
        c,
        e,
        d,
        a.core.settings.lineThickness,
        l
      );
    };
    e.prototype.drawFilledCircle = function (b, c, e, d, l) {
      this.setShadow(l);
      c = Math.floor(a.core.zopHandler.getPixelFromZOP(c)) + 0.5;
      this.canvasContext.beginPath();
      this.canvasContext.arc(b, c, e, 0, 2 * Math.PI, false);
      this.canvasContext.fillStyle = d;
      this.canvasContext.fill();
      this.removeShadow(l);
    };
    e.prototype.drawFilledCircle2 = function (a, b, c, e, d) {
      this.setShadow(d);
      this.canvasContext.beginPath();
      this.canvasContext.arc(a, b, c, 0, 2 * Math.PI, false);
      this.canvasContext.fillStyle = e;
      this.canvasContext.fill();
      this.removeShadow(d);
    };
    e.prototype.drawHorizontalLineThick = function (b, c, e, d, l, h) {
      c = Math.floor(a.core.zopHandler.getPixelFromZOP(c));
      a.core.drawArea.drawHorizontalLineNotZOP(b, c, e, d, l, h);
    };
    e.prototype.startTextDelayedDraw = function () {
      this.delayedDraw = true;
    };
    e.prototype.endTextDelayedDraw = function () {
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
    };
    e.prototype.drawText = function (c, e, d, n, l, h, k, p, q, r, v) {
      if (this.delayedDraw)
        return this.drawInfos.push(new b(c, e, d, n, l, h, k, p, q, r, v)), c;
      d = Math.floor(d + n);
      a.core.drawArea.setFont(l, false, r, v);
      c = c.substring(0, this.howManyCharactersFit(c, l, q, true));
      a.core.drawArea.drawText(c, e, d, l, h, false, false, r, v);
      return c;
    };
    e.prototype.drawVerticalTitle = function (b, c, e, d, l, h, k, p, q) {
      a.core.drawArea.setFont(l, p, false, q);
      q = a.core.zopHandler.get2PixelsFromZOPsForVErticalText(b, c);
      b = q.value1 + k;
      q = q.value2 - k;
      var f = (k = 0),
        g = a.core.settings.menuButtonBottom;
      e >
        a.core.settings.titleWidth +
          a.core.mainMenuControl.nudgeBecauseMenuBeingDragged && (g = 0);
      b < a.core.zopHandler.topPixel + g &&
        (k = a.core.zopHandler.topPixel + g - b);
      c > a.core.zopHandler.bottomZOP &&
        (f = q - a.core.zopHandler.bottomPixel);
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
          Math.floor(a.core.zopHandler.leftPixel)
        ),
        this.canvasContext.restore());
    };
    e.prototype.debugTexts = function (b) {
      if (void 0 != b) {
        var c = 20 * a.core.ratio,
          e;
        for (e = 0; e < b.length; e++)
          a.core.drawArea.drawFilledRectangle(
            200,
            c,
            1e3,
            20 * a.core.ratio,
            "#000000",
            false
          ),
            a.core.drawArea.drawText(
              b[e],
              202,
              c - 1,
              18 * a.core.ratio,
              "#FFFFFF",
              false,
              false
            ),
            (c += 22 * a.core.ratio);
      }
    };
    e.prototype.debugText = function (b) {
      void 0 != b &&
        0 != b.length &&
        ((this.canvasContext.fillStyle = "#FF0000"),
        a.core.drawArea.setFont(14),
        this.canvasContext.fillText(b, 90, 330),
        60 < b.length && this.canvasContext.fillText(b.substring(60), 90, 360),
        120 < b.length &&
          this.canvasContext.fillText(b.substring(120), 90, 420),
        180 < b.length &&
          this.canvasContext.fillText(b.substring(180), 90, 480),
        240 < b.length &&
          this.canvasContext.fillText(b.substring(240), 90, 540));
    };
    return e;
  })();
  a.ZopDrawArea = p;
  var d = (function () {
      return function (b, c, d, m, n) {
        this.text = c;
        this.textHeight = d;
        n || a.core.drawArea.setFont(d, m);
        this.pixelLength = b.measureText(c).width;
      };
    })(),
    b = (function () {
      return function (a, b, c, d, n, l, h, k, p, q, r) {
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
      };
    })(),
    c = (function () {
      return function (a, b) {
        this.lettersCount = a;
        this.lastMaxPixelWidth = b;
      };
    })();
})(OneView || (OneView = {}));
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
//       a.core.dynamicallyLoadFile("libs/rrule.js", "js", function () {});
//     }
//     __extends(b, d);
//     b.prototype.connectionOk = function () {
//       return true;
//     };
//     b.prototype.calendarsLoaded = function (b) {
//       if (void 0 === b || void 0 === b[0].name) this.delayedReload();
//       else {
//         this.calendarsLoadedMsg = b;
//         this.eventsLoaded = this.eventsLoaded.bind(this);
//         this.eventsLoadedFailed = this.eventsLoadedFailed.bind(this);
//         b = moment()
//           .add(
//             -((1 * a.core.commonUserSettings.dataAmountToLoad) / 4),
//             "months"
//           )
//           .toDate();
//         var c = moment()
//           .add((3 * a.core.commonUserSettings.dataAmountToLoad) / 4, "months")
//           .toDate();
//         window.plugins.calendar.listEventsInRange(
//           b,
//           c,
//           this.eventsLoaded,
//           this.eventsLoadedFailed
//         );
//       }
//     };
//     b.prototype.calendarsLoadedFailed = function (a) {
//       this.clearAllData();
//       this.analyticsEvent("Error", "Load calendars failed");
//       this.calendarsLoadedCallback();
//     };
//     b.prototype.populateCalendarEvents = function (b) {
//       this.startLoadingTime = a.core.getTimeStamp();
//       a.DemoCalendarDataProxy.setLastSessionWasInDemoMode(false);
//       this.calendarsLoaded = this.calendarsLoaded.bind(this);
//       this.calendarsLoadedFailed = this.calendarsLoadedFailed.bind(this);
//       this.calendarsLoadedCallback = b;
//       window.plugins.calendar.listCalendars(
//         this.calendarsLoaded,
//         this.calendarsLoadedFailed
//       );
//     };
//     b.prototype.clearAllData = function () {
//       this.calendarEvents = [];
//       a.core.calendarEventHandler.clearAllEvents();
//       a.core.calendars = [];
//       a.core.calendarPrimaryId = void 0;
//     };
//     b.prototype.handleCalendarsLoadedData = function () {
//       var b;
//       for (b = 0; b < this.calendarsLoadedMsg.length; b++) {
//         var e = a.VisibilityType.Visible;
//         0 === +this.calendarsLoadedMsg[b].visible &&
//           (e = a.VisibilityType.Hidden);
//         void 0 != a.core.calendarPrimaryId ||
//           this.calendarsLoadedMsg[b].isReadOnly ||
//           (a.core.calendarPrimaryId = this.calendarsLoadedMsg[b].id);
//         this.calendarsLoadedMsg[b].isPrimary &&
//           !this.calendarsLoadedMsg[b].isReadOnly &&
//           (a.core.calendarPrimaryId = this.calendarsLoadedMsg[b].id);
//         e = new a.CalendarObject(
//           this.calendarsLoadedMsg[b].id,
//           this.calendarsLoadedMsg[b].name,
//           [],
//           b,
//           e,
//           !this.calendarsLoadedMsg[b].isReadOnly,
//           !this.calendarsLoadedMsg[b].isReadOnly
//         );
//         a.core.calendars.push(e);
//         "molyneux.peter@gmail.com" == e.name &&
//           ((a.core.commonUserSettings.licenceColorPicker = true),
//           (a.core.commonUserSettings.licenceCandyTheme = true),
//           (a.core.commonUserSettings.licenceDarkTheme = true));
//       }
//     };
//     b.prototype.eventsLoaded = function (a) {
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
//     b.prototype.convertToEvent = function (b) {
//       var c = new Date(0 + b.startDate),
//         d = new Date(0 + b.endDate);
//       1 == b.allday
//         ? ((c = new Date(c.getTime() + 6e4 * c.getTimezoneOffset())),
//           (d = new Date(d.getTime() + 6e4 * d.getTimezoneOffset())))
//         : ((c = a.core.helper.addUserTimeZoneSetting(c)),
//           (d = a.core.helper.addUserTimeZoneSetting(d)));
//       d.getDate() === c.getDate() &&
//         (a.core.getCalendar(b.calendarId).allEventsAreFullDay = false);
//       a.core.getCalendar(b.calendarId);
//       var g = b.eventId + "#" + b.id,
//         c = new a.CalendarEventObject(
//           b.title,
//           b.description,
//           b.location,
//           c,
//           d,
//           b.calendarId,
//           g
//         );
//       c.isRecurring =
//         !a.core.helper.isNullOrEmpty(b.rRule) ||
//         !a.core.helper.isNullOrEmpty(b.rDate);
//       c.recurringEventId = b.eventId;
//       void 0 != b.color && "" != b.color && (c.androidColorNum = b.color);
//       c.reminders = [];
//       for (d = 0; b.reminders && d < b.reminders.length; d++)
//         c.reminders.push(new a.Reminder(b.reminders[d]));
//       a.core.helper.isNullOrEmpty(b.rRule) ||
//         this.rrulesDictionary.add(g, b.rRule);
//       return c;
//     };
//     b.prototype.eventsLoadedFailed = function (a) {
//       this.clearAllData();
//       this.analyticsEvent("Error", "Load events failed");
//       this.calendarsLoadedCallback();
//     };
//     b.prototype.finalizeLoad = function () {
//       var b;
//       a.core.helper.sortCalendars();
//       a.core.calendarEventHandler.gradeCalendarEvents(this.calendarEvents);
//       a.core.calendarEventHandler.clearAllEvents();
//       for (b = 0; b < this.calendarEvents.length; b++)
//         a.core.getCalendar(this.calendarEvents[b].calendarId).visibility ==
//           a.VisibilityType.Visible &&
//           a.core.calendarEventHandler.addEventToCalendar(
//             this.calendarEvents[b]
//           );
//       a.core.calendarEventHandler.findCommonTimes();
//       a.core.redraw(true);
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
//         a.core.commonUserSettings.dataAmountToLoad
//       );
//       this.analyticsTiming(
//         "Loadtime",
//         a.core.getTimeStamp() - this.startLoadingTime
//       );
//       this.calendarsLoadedCallback();
//     };
//     b.prototype.canEditRecurring = function (a) {
//       return this.rrulesDictionary.containsKey(a.id);
//     };
//     b.prototype.getRRuleObject = function (a, b) {
//       var c;
//       this.rrulesDictionary.containsKey(a.id) &&
//         (c = RRule.fromString(this.rrulesDictionary[a.id]));
//       b(c);
//     };
//     b.prototype.login = function () {};
//     b.prototype.logout = function () {};
//     b.prototype.delayedReload = function () {
//       var a = this;
//       window.setTimeout(function () {
//         a.reload();
//       }, 1e3);
//     };
//     b.prototype.reload = function () {
//       a.core.populateCalendars();
//     };
//     b.prototype.deleteEvent = function (b, e, d) {
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
//                 : a.core.helper.removeUserTimeZoneSetting(e)),
//             a.core.calendarEventHandler.removeCalendarEvent(b),
//             window.plugins.calendar.deleteSingleEventFromRecurring(
//               +b.recurringEventId,
//               e,
//               this.silentSuccessCallback,
//               this.failedCallback
//             ))
//           : this.failedCallback(
//               "This type of delete is not supported in OneView Calendar."
//             )
//         : (a.core.calendarEventHandler.removeCalendarEvent(b),
//           window.plugins.calendar.deleteEvent(
//             +b.recurringEventId,
//             b.isRecurring
//               ? this.delayedSuccessCallback
//               : this.silentSuccessCallback,
//             this.failedCallback
//           ));
//     };
//     b.prototype.failedCallback = function (a) {
//       console.log(a);
//       this.reload();
//     };
//     b.prototype.silentSuccessCallback = function (a) {};
//     b.prototype.returnIdCallback = function (a) {
//       this.calendarEventThatNeedsNewId.recurringEventId = a;
//     };
//     b.prototype.quickSuccessCallback = function (a) {
//       var b = this;
//       window.setTimeout(function () {
//         b.reload();
//       }, 1);
//     };
//     b.prototype.successCallback = function (a) {
//       var b = this;
//       window.setTimeout(function () {
//         b.reload();
//       }, 1);
//     };
//     b.prototype.delayedSuccessCallback = function (a) {
//       var b = this;
//       this.successCallback(a);
//       window.setTimeout(function () {
//         b.reload();
//       }, 1);
//     };
//     b.prototype.getAndroidColorNum = function (b) {
//       if (null != b.extraColorId) {
//         if (
//           b.androidColorNum &&
//           a.core.helper.getColorIdFromAndroidNum(b.androidColorNum) ==
//             b.extraColorId
//         )
//           return +b.androidColorNum;
//         b = a.core.helper.getEventColor2(b);
//         return a.core.helper.getAndroidNumFromColor(b);
//       }
//     };
//     b.prototype.addNewEvent = function (b, e) {
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
//         a.core.helper.removeUserTimeZoneSetting(b.startDateTime),
//         a.core.helper.removeUserTimeZoneSetting(b.endDateTime),
//         d,
//         c,
//         b.isRecurring || e
//           ? this.delayedSuccessCallback
//           : this.returnIdCallback,
//         this.failedCallback
//       );
//       a.core.calendarEventHandler.addEventToCalendar(b);
//     };
//     b.prototype.getFirstRecurringEvent = function (a) {
//       return this.calendarEvents.filter(function (b) {
//         return b.recurringEventId === a.recurringEventId;
//       })[0];
//     };
//     b.prototype.editExistingEvent = function (b, e) {
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
//             a.core.helper.removeUserTimeZoneSetting(b.startDateTime),
//             a.core.helper.removeUserTimeZoneSetting(b.endDateTime),
//             d,
//             c,
//             m ? this.delayedSuccessCallback : this.silentSuccessCallback,
//             this.failedCallback
//           ),
//           m ||
//             (a.core.calendarEventHandler.removeCalendarEvent(b),
//             a.core.calendarEventHandler.addEventToCalendar(b)));
//     };
//     b.prototype.persistCalendarsVisibilitySettings = function (b) {
//       for (var c = 0; c < b.length; c++)
//         b[c].oldVisibility === b[c].newVisibility && (b.splice(c, 1), c--);
//       for (var d = 0; d < a.core.calendars.length; d++)
//         for (c = 0; c < b.length; c++)
//           if (b[c].id == a.core.calendars[d].id) {
//             var g = 1;
//             b[c].newVisibility === a.VisibilityType.Hidden && (g = 0);
//             this.silentSuccessCallback = this.silentSuccessCallback.bind(this);
//             this.successCallback = this.successCallback.bind(this);
//             this.failedCallback = this.failedCallback.bind(this);
//             window.plugins.calendar.updateCalendarVisibility(
//               +a.core.calendars[d].id,
//               g,
//               c < b.length - 1
//                 ? this.silentSuccessCallback
//                 : this.successCallback,
//               this.failedCallback
//             );
//           }
//     };
//     b.prototype.applyCalendarsVisibilitySettings = function () {};
//     b.prototype.saveSettings = function () {};
//     b.prototype.loadSettings = function () {
//       return true;
//     };
//     b.prototype.analyticsInit = function () {
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
//     b.prototype.analyticsEvent = function (a, b) {
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
//     b.prototype.analyticsPage = function (a) {
//       this.analyticsInit();
//       analytics.trackView(a, this.analyticsSuccess, this.analyticsFail);
//     };
//     b.prototype.analyticsValue = function (a, b, d, g) {
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
//     b.prototype.analyticsTiming = function (a, b) {
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
//     b.prototype.analyticsSuccess = function (a) {};
//     b.prototype.analyticsFail = function (a) {};
//     return b;
//   })(a.LocalStorage);
//   a.AndroidCalendarDataProxy = p;
// })(OneView || (OneView = {}));
// (function (a) {
//   var p = (function (d) {
//     function b() {
//       d.call(this);
//       this.enableMultipleCalendars = this.enableReload = true;
//       this.enableShop =
//         this.enableFakeData =
//         this.enableGoogleLogout =
//         this.enableGoogleLogin =
//           false;
//       this.calendarDataProxyType = a.CalendarDataProxyType.Demo;
//       this.demoVideoSpecial = true;
//       this.dbVersion = "demo0.52";
//     }
//     __extends(b, d);
//     b.prototype.connectionOk = function () {
//       return true;
//     };
//     b.prototype.login = function () {};
//     b.prototype.logout = function () {};
//     b.prototype.populateCalendarEvents = function (c) {
//       this.loadReadyCallback = c;
//       this.calendarEvents = [];
//       a.core.calendarEventHandler.clearAllEvents();
//       a.core.commonUserSettings.licenceColorPicker = true;
//       a.core.commonUserSettings.licenceCandyTheme = true;
//       a.core.commonUserSettings.licenceDarkTheme = true;
//       a.core.settings.reloadThemesSettings(a.core.commonUserSettings);
//       a.core.calendars = [];
//       a.core.calendarPrimaryId = void 0;
//       (this.loadEventsFromCache() &&
//         void 0 != a.core.calendars &&
//         0 != a.core.calendars.length) ||
//         (this.fakeData(),
//         a.core.helper.sortCalendars(),
//         a.core.calendarEventHandler.gradeCalendarEvents(this.calendarEvents),
//         this.calendarEvents.sort(function (a, b) {
//           return a.startZOP - b.startZOP;
//         }),
//         this.saveEventsToCache());
//       this.finalizeLoad();
//       b.setLastSessionWasInDemoMode(true);
//     };
//     b.prototype.saveSettings = function () {
//       this.saveEventsToCache();
//     };
//     b.prototype.reload = function () {
//       var b = this.dbVersion;
//       this.dbVersion = "XXX";
//       a.core.populateCalendars();
//       this.dbVersion = b;
//     };
//     b.prototype.fakeData = function () {
//       var b;
//       a.core.calendars.push(
//         new a.CalendarObject(
//           "Work",
//           "Work Calendar",
//           [],
//           0,
//           a.VisibilityType.Visible,
//           true,
//           true
//         )
//       );
//       a.core.calendars.push(
//         new a.CalendarObject(
//           "My",
//           "My Calendar",
//           [],
//           1,
//           a.VisibilityType.Visible,
//           true,
//           true
//         )
//       );
//       a.core.calendars.push(
//         new a.CalendarObject(
//           "Other",
//           "Partners calendar",
//           [],
//           2,
//           a.VisibilityType.Visible,
//           true,
//           false
//         )
//       );
//       a.core.calendarPrimaryId = "My";
//       a.core.getCalendar("Work").allEventsAreFullDay = false;
//       a.core.getCalendar("My").allEventsAreFullDay = false;
//       a.core.getCalendar("Other").allEventsAreFullDay = false;
//       this.calendarEvents = [];
//       var e = moment().startOf("week"),
//         d = e.clone().add(1, "weeks").add(-28, "days"),
//         g,
//         m;
//       for (b = 0; 30 > b; b++)
//         (g = d
//           .clone()
//           .add(-80 + 21 * b, "days")
//           .add(17, "hours")
//           .toDate()),
//           (m = d
//             .clone()
//             .add(-80 + 21 * b, "days")
//             .add(19.5, "hours")
//             .toDate()),
//           (g = new a.CalendarEventObject(
//             "Hockey with kids",
//             "If you can't make it call Eddies dad: 043-423213",
//             "Weaver hall",
//             g,
//             m,
//             "My",
//             this.calendarEvents.length.toString()
//           )),
//           this.calendarEvents.push(g);
//       for (b = 0; 20 > b; b++)
//         3 === b && b++,
//           (g = d
//             .clone()
//             .add(-100 + 28 * b, "days")
//             .add(18, "hours")
//             .toDate()),
//           (m = d
//             .clone()
//             .add(-100 + 28 * b, "days")
//             .add(22, "hours")
//             .toDate()),
//           (g = new a.CalendarEventObject(
//             "Walk n talk with Jim",
//             "Time for reflection",
//             "The park",
//             g,
//             m,
//             "My",
//             this.calendarEvents.length.toString()
//           )),
//           this.calendarEvents.push(g);
//       g = moment().startOf("week").add(-200, "months").toDate();
//       m = moment().startOf("week").add(-199, "months").toDate();
//       g = new a.CalendarEventObject(
//         "School starts",
//         "",
//         "",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = moment().startOf("week").add(-150, "months").toDate();
//       m = moment().startOf("week").add(-130, "months").toDate();
//       g = new a.CalendarEventObject(
//         "First girlfriend",
//         "",
//         "",
//         g,
//         m,
//         "Other",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = moment().startOf("week").add(-100, "months").toDate();
//       m = moment().startOf("week").add(-99, "months").toDate();
//       g = new a.CalendarEventObject(
//         "16th birthday",
//         "",
//         "",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = moment().startOf("week").add(-86, "months").toDate();
//       m = moment().startOf("week").add(-50, "months").toDate();
//       g = new a.CalendarEventObject(
//         "University",
//         "",
//         "",
//         g,
//         m,
//         "Other",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = moment().startOf("week").add(-48, "months").toDate();
//       m = moment().startOf("week").add(-36, "months").toDate();
//       g = new a.CalendarEventObject(
//         "Year in London",
//         "",
//         "",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = moment().startOf("week").add(-32, "months").toDate();
//       m = moment().startOf("week").add(-30, "months").toDate();
//       g = new a.CalendarEventObject(
//         "Wedding!!",
//         "",
//         "",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = moment().startOf("week").add(4, "days").toDate();
//       m = moment().startOf("week").add(5, "days").toDate();
//       g = new a.CalendarEventObject(
//         "Jims birthday",
//         "",
//         "",
//         g,
//         m,
//         "Other",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = moment().startOf("week").add(7, "days").toDate();
//       m = moment().startOf("week").add(8, "days").toDate();
//       g = new a.CalendarEventObject(
//         "Release",
//         "On the menu there is an option to connect to Google. This will enable you to see your real calendar.",
//         "",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = moment().startOf("week").add(9, "days").toDate();
//       m = moment().startOf("week").add(10, "days").toDate();
//       g = new a.CalendarEventObject(
//         "Lisas birthday",
//         "",
//         "",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(1, "weeks").add(-22, "days").toDate();
//       m = e.clone().add(1, "weeks").add(10, "days").toDate();
//       g = new a.CalendarEventObject(
//         "On diet",
//         "Calorie drought",
//         "",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(-63, "weeks").add(-22, "days").toDate();
//       m = e.clone().add(-54, "weeks").add(10, "days").toDate();
//       g = new a.CalendarEventObject(
//         "On diet",
//         "Calorie drought",
//         "",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(1, "weeks").add(13, "days").toDate();
//       m = e.clone().add(1, "weeks").add(18, "days").toDate();
//       g = new a.CalendarEventObject(
//         "Rent a car",
//         "Abis",
//         "",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       for (b = 0; 40 > b; b++)
//         5 === b && b++,
//           (g = d
//             .clone()
//             .add(-120 + 14 * b, "days")
//             .add(17, "hours")
//             .toDate()),
//           (m = d
//             .clone()
//             .add(-120 + 14 * b, "days")
//             .add(20, "hours")
//             .toDate()),
//           (g = new a.CalendarEventObject(
//             "Gym",
//             "",
//             "Wassits",
//             g,
//             m,
//             "Other",
//             this.calendarEvents.length.toString()
//           )),
//           this.calendarEvents.push(g);
//       for (b = 0; 60 > b; b++)
//         5 === b && b++,
//           (g = d
//             .clone()
//             .add(-127 + 14 * b, "days")
//             .add(7, "hours")
//             .toDate()),
//           (m = d
//             .clone()
//             .add(-127 + 14 * b, "days")
//             .add(8, "hours")
//             .toDate()),
//           (g = new a.CalendarEventObject(
//             "Morning swim",
//             "Be on time",
//             "Lake",
//             g,
//             m,
//             "My",
//             this.calendarEvents.length.toString()
//           )),
//           this.calendarEvents.push(g);
//       g = e.clone().add(-52, "weeks").add(1, "days").toDate();
//       m = e.clone().add(-52, "weeks").add(31, "days").toDate();
//       g = new a.CalendarEventObject(
//         "Family holiday",
//         "Double check the hotel booking",
//         "Saxapahaw",
//         g,
//         m,
//         "Other",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(1, "weeks").add(10, "days").toDate();
//       m = e.clone().add(1, "weeks").add(23, "days").toDate();
//       g = new a.CalendarEventObject(
//         "Family holiday",
//         "Double check the hotel booking",
//         "Saxapahaw",
//         g,
//         m,
//         "Other",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(30, "weeks").toDate();
//       m = e.clone().add(40, "weeks").toDate();
//       g = new a.CalendarEventObject(
//         "Course",
//         "Double check the hotel booking",
//         "Saxapahaw",
//         g,
//         m,
//         "Work",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(-100, "weeks").toDate();
//       m = e.clone().add(-28, "weeks").toDate();
//       g = new a.CalendarEventObject(
//         "Previous job",
//         "Double check the hotel booking",
//         "Saxapahaw",
//         g,
//         m,
//         "Work",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(-27, "weeks").toDate();
//       m = e.clone().add(-18, "weeks").toDate();
//       g = new a.CalendarEventObject(
//         "Intro period",
//         "Double check the hotel booking",
//         "Saxapahaw",
//         g,
//         m,
//         "My",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(-17, "weeks").toDate();
//       m = e.clone().add(-14, "weeks").toDate();
//       g = new a.CalendarEventObject(
//         "IT Course",
//         "Double check the hotel booking",
//         "Saxapahaw",
//         g,
//         m,
//         "Work",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(-13, "weeks").toDate();
//       m = e.clone().add(-8, "weeks").toDate();
//       g = new a.CalendarEventObject(
//         "Smile project",
//         "Double check the hotel booking",
//         "Saxapahaw",
//         g,
//         m,
//         "Work",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(1, "weeks").add(5, "days").add(18, "hours").toDate();
//       m = e.clone().add(1, "weeks").add(8, "days").add(22, "hours").toDate();
//       g = new a.CalendarEventObject(
//         "Visit my parents",
//         "",
//         "Sutton Bonnington",
//         g,
//         m,
//         "Other",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(1, "weeks").add(14, "days").toDate();
//       m = e.clone().add(1, "weeks").add(16, "days").toDate();
//       g = new a.CalendarEventObject(
//         "Trip to mountains",
//         "Bring tent",
//         "",
//         g,
//         m,
//         "Other",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       for (b = 0; 30 > b; b++)
//         (g = e
//           .clone()
//           .add(-15, "weeks")
//           .add(2 + 7 * b - 21, "days")
//           .add(9, "hours")
//           .toDate()),
//           (m = e
//             .clone()
//             .add(-15, "weeks")
//             .add(2 + 7 * b - 21, "days")
//             .add(9, "hours")
//             .add(20, "minutes")
//             .toDate()),
//           (g = new a.CalendarEventObject(
//             "Morning briefing",
//             "",
//             "Work",
//             g,
//             m,
//             "Work",
//             this.calendarEvents.length.toString()
//           )),
//           this.calendarEvents.push(g);
//       for (b = 0; 15 > b; b++)
//         (g = e
//           .clone()
//           .add(1, "weeks")
//           .add(4 + 7 * b - 21, "days")
//           .add(9, "hours")
//           .toDate()),
//           (m = e
//             .clone()
//             .add(1, "weeks")
//             .add(4 + 7 * b - 21, "days")
//             .add(9, "hours")
//             .add(20, "minutes")
//             .toDate()),
//           (g = new a.CalendarEventObject(
//             "Morning briefing",
//             "",
//             "Work",
//             g,
//             m,
//             "Work",
//             this.calendarEvents.length.toString()
//           )),
//           this.calendarEvents.push(g);
//       g = e.clone().add(1, "weeks").add(-7, "days").toDate();
//       m = e.clone().add(1, "weeks").add(0, "days").toDate();
//       g = new a.CalendarEventObject(
//         "Annual wrap-up",
//         "Close all ongoing cases",
//         "",
//         g,
//         m,
//         "Work",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(-23, "weeks").add(-7, "days").toDate();
//       m = e.clone().add(-23, "weeks").add(0, "days").toDate();
//       g = new a.CalendarEventObject(
//         "Annual wrap-up",
//         "Close all ongoing cases",
//         "",
//         g,
//         m,
//         "Work",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       for (b = 0; 10 > b; b++)
//         7 === b && (b += 2),
//           (g = d
//             .clone()
//             .add(-3 + 7 * b, "days")
//             .add(7, "hours")
//             .add(30, "minutes")
//             .toDate()),
//           (m = d
//             .clone()
//             .add(-3 + 7 * b, "days")
//             .add(10, "hours")
//             .toDate()),
//           (g = new a.CalendarEventObject(
//             "My breakfast-day",
//             "Have everything prepared by 7.30",
//             "Work",
//             g,
//             m,
//             "Work",
//             this.calendarEvents.length.toString()
//           )),
//           this.calendarEvents.push(g);
//       g = e.clone().add(1, "weeks").add(-4, "days").add(11, "hours").toDate();
//       m = e.clone().add(1, "weeks").add(-4, "days").add(13, "hours").toDate();
//       g = new a.CalendarEventObject(
//         "Meeting with R.P",
//         "Your turn to take the bill",
//         "Jackie's Besty Diner",
//         g,
//         m,
//         "Work",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//       g = e.clone().add(1, "weeks").add(3, "days").add(13, "hours").toDate();
//       m = e.clone().add(1, "weeks").add(3, "days").add(16, "hours").toDate();
//       g = new a.CalendarEventObject(
//         "Meeting with R.P",
//         "Bring the files",
//         "Office on Winfall BLVD",
//         g,
//         m,
//         "Work",
//         this.calendarEvents.length.toString()
//       );
//       this.calendarEvents.push(g);
//     };
//     b.prototype.getCleanRedirectURI = function () {
//       return window.location.protocol + "//" + window.location.host;
//     };
//     b.prototype.getRRuleObject = function (a, b) {
//       b(void 0);
//     };
//     b.prototype.getFirstRecurringEvent = function (a) {
//       return this.calendarEvents.filter(function (b) {
//         return b.recurringEventId === a.recurringEventId;
//       })[0];
//     };
//     b.prototype.finalizeLoad = function () {
//       var b;
//       this.applyCalendarsVisibilitySettings();
//       a.core.calendarEventHandler.clearAllEvents();
//       for (b = 0; b < this.calendarEvents.length; b++)
//         a.core.getCalendar(this.calendarEvents[b].calendarId).visibility ==
//           a.VisibilityType.Visible &&
//           a.core.calendarEventHandler.addEventToCalendar(
//             this.calendarEvents[b]
//           );
//       a.core.calendarEventHandler.findCommonTimes();
//       a.core.loadingHandler.stopLoading();
//       this.loadReadyCallback && this.loadReadyCallback();
//       a.core.redraw(true);
//     };
//     b.prototype.canEditRecurring = function (a) {
//       return false;
//     };
//     b.prototype.deleteEvent = function (b, d, f) {
//       if (b.isRecurring && d === a.EventEditType.AllInSeries)
//         for (
//           d = a.core.calendarEventHandler.getCalendarEventsByIdAndRecurringId(
//             b.recurringEventId
//           ),
//             b = 0;
//           b < d.length;
//           b++
//         )
//           this.removeEventFromFromDemoData(d[b]),
//             a.core.calendarEventHandler.removeCalendarEvent(d[b]);
//       else
//         this.removeEventFromFromDemoData(b),
//           a.core.calendarEventHandler.removeCalendarEvent(b);
//       this.saveEventsToCache();
//     };
//     b.prototype.removeEventFromFromDemoData = function (a) {
//       var b;
//       for (b = 0; b < this.calendarEvents.length; b++)
//         if (this.calendarEvents[b] === a) {
//           this.calendarEvents.splice(b, 1);
//           break;
//         }
//     };
//     b.prototype.addNewEvent = function (b, d) {
//       b.id = "" + Math.random();
//       this.calendarEvents.push(b);
//       a.core.calendarEventHandler.addEventToCalendar(b);
//       if (void 0 !== b.rruleToSave && null !== b.rruleToSave) {
//         var c = b.endDateTime.getTime() - b.startDateTime.getTime();
//         b.isRecurring = true;
//         for (var e = b.rruleToSave.all(), m = 1; m < e.length; m++) {
//           var n = new Date(e[m].getTime() + c),
//             n = new a.CalendarEventObject(
//               b.summary,
//               b.description,
//               b.location,
//               e[m],
//               n,
//               b.calendarId,
//               "" + Math.random()
//             );
//           n.isRecurring = true;
//           n.recurringEventId = b.id;
//           this.calendarEvents.push(n);
//           a.core.calendarEventHandler.addEventToCalendar(n);
//         }
//       }
//       this.saveEventsToCache();
//     };
//     b.prototype.editExistingEvent = function (b, d) {
//       a.core.calendarEventHandler.removeCalendarEvent(b);
//       a.core.calendarEventHandler.addEventToCalendar(b);
//       this.saveEventsToCache();
//     };
//     b.prototype.saveEventsToCache = function () {
//       this.localStorageSetItem("oneview_demo_verrsion", this.dbVersion);
//       this.localStorageSetItem(
//         "oneview_demo_saveComplete",
//         JSON.stringify(false)
//       );
//       this.localStorageSetItem(
//         "oneview_demo_allEvents",
//         JSON.stringify(this.calendarEvents)
//       );
//       this.localStorageSetItem(
//         "oneview_demo_allCalendars",
//         JSON.stringify(a.core.calendars)
//       );
//       this.localStorageSetItem(
//         "oneview_demo_primaryCalendarId",
//         JSON.stringify(a.core.calendarPrimaryId)
//       );
//       this.localStorageSetItem("oneview_demo_demo", JSON.stringify(true));
//       this.localStorageSetItem(
//         "oneview_demo_saveComplete",
//         JSON.stringify(true)
//       );
//     };
//     b.getLastSessionWasInDemoMode = function () {
//       var a = localStorage.getItem(
//         "oneview_demo_last_session_was_in_demo_mode"
//       );
//       return null == a || void 0 == a ? true : JSON.parse(a);
//     };
//     b.setLastSessionWasInDemoMode = function (b) {
//       new a.LocalStorage().localStorageSetItem(
//         "oneview_demo_last_session_was_in_demo_mode",
//         JSON.stringify(b)
//       );
//     };
//     b.prototype.loadEventsFromCache = function () {
//       var b = localStorage.getItem("oneview_demo_verrsion"),
//         d = localStorage.getItem("oneview_demo_saveComplete"),
//         f = localStorage.getItem("oneview_demo_allEvents"),
//         g = localStorage.getItem("oneview_demo_allCalendars"),
//         m = localStorage.getItem("oneview_demo_primaryCalendarId"),
//         n = localStorage.getItem("oneview_demo_demo");
//       if (
//         b !== this.dbVersion ||
//         "true" != d ||
//         null == g ||
//         void 0 == g ||
//         null == f ||
//         void 0 == f ||
//         null == m ||
//         void 0 == m ||
//         null == n ||
//         void 0 == n
//       )
//         return false;
//       try {
//         (a.core.calendarPrimaryId = JSON.parse(m)),
//           (this.calendarEvents = JSON.parse(f, this.dateTimeReviver)),
//           (a.core.calendars = JSON.parse(g, this.dateTimeReviver));
//       } catch (l) {
//         return false;
//       }
//       return true;
//     };
//     b.prototype.persistCalendarsVisibilitySettings = function (b) {
//       this.localStorageSetItem(
//         "oneview_demo_visibilitySettings",
//         JSON.stringify(b)
//       );
//       this.saveEventsToCache();
//       a.core.populateCalendars();
//     };
//     b.prototype.applyCalendarsVisibilitySettings = function () {
//       var b = localStorage.getItem("oneview_demo_visibilitySettings");
//       if (null !== b && void 0 !== b)
//         for (
//           var b = JSON.parse(b, this.dateTimeReviver), d = 0;
//           d < a.core.calendars.length;
//           d++
//         )
//           for (var f = 0; f < b.length; f++)
//             b[f].id == a.core.calendars[d].id &&
//               (a.core.calendars[d].visibility = b[f].newVisibility);
//     };
//     b.prototype.analyticsEvent = function (a, b) {};
//     b.prototype.analyticsPage = function (a) {};
//     b.prototype.analyticsValue = function (a, b, d, g) {};
//     b.prototype.analyticsTiming = function (a, b) {};
//     return b;
//   })(a.LocalStorage);
//   a.DemoCalendarDataProxy = p;
// })(OneView || (OneView = {}));
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
//     b.prototype.populateCalendarEvents = function (b) {
//       var c = this;
//       this.loadReadyCallback = b;
//       this.calendarEvents = [];
//       a.core.calendarEventHandler.clearAllEvents();
//       a.core.calendars = [];
//       a.core.calendarPrimaryId = void 0;
//       a.core.commonUserSettings.licenceColorPicker = true;
//       a.core.commonUserSettings.licenceCandyTheme = true;
//       a.core.commonUserSettings.licenceDarkTheme = true;
//       a.core.settings.reloadThemesSettings(a.core.commonUserSettings);
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
//     b.prototype.saveSettings = function () {
//       this.saveEventsToCache();
//     };
//     b.prototype.logout = function () {
//       var b = this,
//         d = this;
//       a.core.dynamicallyLoadFile("libs/jquery.js", "js", function () {
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
//     b.prototype.login = function () {
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
//     b.prototype.getCleanRedirectURI = function () {
//       return window.location.protocol + "//" + window.location.host;
//     };
//     b.prototype.handleAuthResult1 = function (b) {
//       b && b.status.signed_in
//         ? ((this.enableGoogleLogin = false),
//           (this.enableGoogleLogout =
//             this.enableReload =
//             this.enableMultipleCalendars =
//               true),
//           (this.enableFakeData = false),
//           (this.access_token = b.access_token),
//           this.makeApiCall())
//         : (a.core.loadingHandler.stopLoadingWithError(),
//           true === this.retryLogin
//             ? ((this.retryLogin = false), this.login())
//             : (this.clearCache(),
//               (this.calendarEvents = []),
//               a.core.calendarEventHandler.clearAllEvents(),
//               a.core.redraw(true)),
//           (this.enableGoogleLogin = true),
//           (this.enableGoogleLogout =
//             this.enableReload =
//             this.enableMultipleCalendars =
//               false),
//           (this.enableFakeData = true));
//     };
//     b.prototype.reload = function () {
//       this.clearCache();
//       this.calendarEvents = [];
//       a.core.loadingHandler.startLoading();
//       a.core.calendarEventHandler.clearAllEvents();
//       a.core.redraw(true);
//       this.forceReload = true;
//       this.makeApiCall();
//     };
//     b.prototype.makeApiCall = function () {
//       this.doFullRefresh = false;
//       this.refetchCalendars(this.forceReload);
//     };
//     b.prototype.refetchCalendars = function (b) {
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
//               e.items[d].primary && (a.core.calendarPrimaryId = e.items[d].id);
//               var l = [];
//               if (e.items[d].defaultReminders) {
//                 var h;
//                 for (h = 0; h < e.items[d].defaultReminders.length; h++)
//                   l.push(
//                     new a.Reminder(e.items[d].defaultReminders[h].minutes)
//                   );
//               }
//               h = a.VisibilityType.Visible;
//               0 == e.items[d].selected && (h = a.VisibilityType.Hidden);
//               var k = a.core.getCalendar(e.items[d].id);
//               if (void 0 == k || "NoneZ" == k.id)
//                 a.core.calendars.push(
//                   new a.CalendarObject(
//                     e.items[d].id,
//                     e.items[d].summary,
//                     l,
//                     a.core.calendars.length,
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
//     b.prototype.dateFromString = function (a) {
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
//     b.prototype.refetchCalendarEvents = function (b) {
//       this.eventsChanged = b;
//       this.doFullRefresh = false;
//       b && (this.calendarEvents = []);
//       this.loadingCalendarCounter = a.core.calendars.length;
//       for (var c = 0; c < a.core.calendars.length; c++)
//         this.getCalendarEvents(a.core.calendars[c].id, null, b);
//     };
//     b.prototype.getCalendarEvents = function (b, d, f) {
//       var c = this;
//       gapi.client.load("calendar", "v3", function () {
//         var e = moment()
//             .add(
//               -((1 * a.core.commonUserSettings.dataAmountToLoad) / 4),
//               "months"
//             )
//             .toDate()
//             .toISOString(),
//           g = moment()
//             .add((3 * a.core.commonUserSettings.dataAmountToLoad) / 4, "months")
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
//           a.core.getCalendar(b) &&
//           ((e = {
//             calendarId: b,
//             maxResults: 1e3,
//             singleEvents: true,
//             showDeleted: true,
//           }),
//           (e.syncToken = a.core.getCalendar(b).nextSyncTokenEvents));
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
//                   a.core.getCalendar(b).countEvents++,
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
//             : ((a.core.getCalendar(b).nextSyncTokenEvents = e.nextSyncToken),
//               c.loadingCalendarCounter--,
//               0 === c.loadingCalendarCounter &&
//               (c.eventsChanged || c.doFullRefresh)
//                 ? (a.core.helper.sortCalendars(),
//                   a.core.calendarEventHandler.gradeCalendarEvents(
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
//     b.prototype.finalizeLoad = function () {
//       var b;
//       JSON.stringify(a.core.calendars);
//       JSON.stringify(this.calendarEvents);
//       this.applyCalendarsVisibilitySettings();
//       a.core.calendarEventHandler.clearAllEvents();
//       if (this.doFullRefresh) this.reload();
//       else {
//         for (b = 0; b < this.calendarEvents.length; b++)
//           a.core.getCalendar(this.calendarEvents[b].calendarId).visibility ==
//             a.VisibilityType.Visible &&
//             a.core.calendarEventHandler.addEventToCalendar(
//               this.calendarEvents[b]
//             );
//         a.core.calendarEventHandler.findCommonTimes();
//       }
//       a.core.loadingHandler.stopLoading();
//       this.loadReadyCallback && this.loadReadyCallback();
//       a.core.redraw(true);
//     };
//     b.prototype.canEditRecurring = function (a) {
//       return true;
//     };
//     b.prototype.getRRuleObject = function (b, d) {
//       if (b.isRecurring) {
//         var c = this;
//         a.core.dynamicallyLoadFile("libs/rrule.js", "js", function () {
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
//     b.prototype.connectionOk = function () {
//       return navigator.onLine;
//     };
//     b.prototype.RespItemToCalendarEvent = function (b, d) {
//       var c = b.start.dateTime,
//         e = b.end.dateTime;
//       void 0 === c
//         ? (c = moment(b.start.date).toDate())
//         : ((a.core.getCalendar(d).allEventsAreFullDay = false),
//           (c = a.core.helper.addUserTimeZoneSetting(this.dateFromString(c))));
//       e =
//         void 0 === e
//           ? moment(b.end.date).toDate()
//           : a.core.helper.addUserTimeZoneSetting(this.dateFromString(e));
//       c = new a.CalendarEventObject(
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
//           var m = a.core.getCalendar(d), e = 0;
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
//     b.prototype.deleteEvent = function (b, d, f) {
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
//     b.prototype.addNewEvent = function (a, b) {
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
//     b.prototype.getFirstRecurringEvent = function (a) {
//       return this.calendarEvents.filter(function (b) {
//         return b.recurringEventId === a.recurringEventId;
//       })[0];
//     };
//     b.prototype.editExistingEvent = function (b, d) {
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
//                       f.endDateTime = a.core.calendarDateHandler.addMinutes(
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
//     b.prototype.editExistingEventHelper = function (b, d, f) {
//       var c = this;
//       gapi.client.calendar.events
//         .update({
//           calendarId: f,
//           eventId: b,
//           resource: d,
//         })
//         .execute(function (b) {
//           c.populateCalendarEvents(void 0);
//           b.message && (a.core.debugtext = b.message);
//         });
//     };
//     b.prototype.syncCalendarEventToResource = function (b, d, f) {
//       d.summary = b.summary;
//       d.description = b.description;
//       d.location = b.location;
//       f ||
//         (a.core.calendarEventHandler.isFullDayEvent(b)
//           ? ((d.start = {
//               date: moment(b.startDateTime).format("YYYY-MM-DD"),
//             }),
//             (d.end = {
//               date: moment(b.endDateTime).format("YYYY-MM-DD"),
//             }))
//           : ((d.start = {
//               dateTime: moment(
//                 a.core.helper.removeUserTimeZoneSetting(b.startDateTime)
//               ).format("YYYY-MM-DDTHH:mm:ssZ"),
//             }),
//             (d.end = {
//               dateTime: moment(
//                 a.core.helper.removeUserTimeZoneSetting(b.endDateTime)
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
//     b.prototype.clearCache = function () {
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
//     b.prototype.saveEventsToCache = function () {
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
//             JSON.stringify(a.core.calendars)
//           ),
//           this.localStorageSetItem(
//             "oneview_primaryCalendarId",
//             JSON.stringify(a.core.calendarPrimaryId)
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
//     b.prototype.loadEventsFromCache = function () {
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
//         (a.core.calendarPrimaryId = JSON.parse(m)),
//           (this.calendarEvents = JSON.parse(
//             LZString.decompress(f),
//             this.dateTimeReviver
//           )),
//           (a.core.calendars = JSON.parse(g, this.dateTimeReviver)),
//           (this.nextSyncTokenCalendars = l);
//       } catch (h) {
//         return false;
//       }
//       return true;
//     };
//     b.prototype.persistCalendarsVisibilitySettings = function (a) {
//       this.localStorageSetItem("oneview_visibilitySettings", JSON.stringify(a));
//       this.reload();
//     };
//     b.prototype.applyCalendarsVisibilitySettings = function () {
//       var b = localStorage.getItem("oneview_visibilitySettings");
//       if (null !== b && void 0 !== b)
//         for (
//           var b = JSON.parse(b, this.dateTimeReviver), d = 0;
//           d < a.core.calendars.length;
//           d++
//         )
//           for (var f = 0; f < b.length; f++)
//             b[f].id == a.core.calendars[d].id &&
//               (a.core.calendars[d].visibility = b[f].newVisibility);
//     };
//     b.prototype.analyticsInit = function () {
//       0 == this.analyticsStarted &&
//         ((this.analyticsStarted = true),
//         -1 < document.URL.indexOf("app.oneviewcalendar.com")
//           ? ga.create("UA-69941766-2", "auto")
//           : ga.create("UA-69941766-1", "auto"),
//         ga("send", "pageview"));
//     };
//     b.prototype.analyticsEvent = function (a, b) {
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
//     b.prototype.analyticsPage = function (a) {
//       try {
//         ga && (this.analyticsInit(), ga("send", "pageview", "/" + a));
//       } catch (e) {}
//     };
//     b.prototype.analyticsValue = function (a, b, d, g) {
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
//     b.prototype.analyticsTiming = function (a, b) {
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
//     b.prototype.populateCalendarEvents = function (b) {
//       var c = this;
//       this.loadReadyCallback = b;
//       this.calendarEvents = [];
//       a.core.calendarEventHandler.clearAllEvents();
//       a.core.calendars = [];
//       a.core.calendarPrimaryId = void 0;
//       a.DemoCalendarDataProxy.setLastSessionWasInDemoMode(false);
//       try {
//         this.loadEventsFromCache() ? this.finalizeLoad() : this.makeApiCall();
//       } catch (f) {
//         window.setTimeout(function () {
//           c.populateCalendarEvents(b);
//         }, 200);
//       }
//     };
//     b.prototype.saveSettings = function () {
//       this.saveEventsToCache();
//     };
//     b.prototype.logout = function () {};
//     b.prototype.login = function () {
//       a.DemoCalendarDataProxy.setLastSessionWasInDemoMode(false);
//       this.enableGoogleLogin = false;
//       this.enableReload = this.enableMultipleCalendars = true;
//       this.enableFakeData = this.enableGoogleLogout = false;
//       this.makeApiCall();
//     };
//     b.prototype.reload = function () {
//       this.clearCache();
//       this.calendarEvents = [];
//       a.core.loadingHandler.startLoading();
//       a.core.calendarEventHandler.clearAllEvents();
//       a.core.redraw(true);
//       this.makeApiCall();
//     };
//     b.prototype.makeApiCall = function () {
//       this.loadCalendars();
//       this.loadEvents();
//       this.finalizeLoad();
//     };
//     b.prototype.finalizeLoad = function () {
//       var b;
//       this.applyCalendarsVisibilitySettings();
//       a.core.calendarEventHandler.clearAllEvents();
//       for (b = 0; b < this.calendarEvents.length; b++)
//         a.core.getCalendar(this.calendarEvents[b].calendarId).visibility ==
//           a.VisibilityType.Visible &&
//           a.core.calendarEventHandler.addEventToCalendar(
//             this.calendarEvents[b]
//           );
//       a.core.calendarEventHandler.findCommonTimes();
//       a.core.loadingHandler.stopLoading();
//       this.loadReadyCallback && this.loadReadyCallback();
//       a.core.redraw(true);
//     };
//     b.prototype.canEditRecurring = function (a) {
//       return false;
//     };
//     b.prototype.getRRuleObject = function (a, b) {};
//     b.prototype.connectionOk = function () {
//       return true;
//     };
//     b.prototype.deleteEvent = function (a, b, d) {};
//     b.prototype.addNewEvent = function (a, b) {};
//     b.prototype.getFirstRecurringEvent = function (a) {
//       return this.calendarEvents.filter(function (b) {
//         return b.recurringEventId === a.recurringEventId;
//       })[0];
//     };
//     b.prototype.editExistingEvent = function (a, b) {};
//     b.prototype.clearCache = function () {
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
//     b.prototype.saveEventsToCache = function () {
//       try {
//         this.localStorageSetItem("oneview_verrsion", this.dbVersion),
//           this.localStorageSetItem(
//             "oneview_saveComplete",
//             JSON.stringify(false)
//           ),
//           this.localStorageSetItem(
//             "oneview_allCalendars",
//             JSON.stringify(a.core.calendars)
//           ),
//           this.localStorageSetItem(
//             "oneview_primaryCalendarId",
//             JSON.stringify(a.core.calendarPrimaryId)
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
//     b.prototype.loadEventsFromCache = function () {
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
//         (a.core.calendarPrimaryId = JSON.parse(g)),
//           this.loadEvents(),
//           (a.core.calendars = JSON.parse(f, this.dateTimeReviver)),
//           (this.nextSyncTokenCalendars = n);
//       } catch (l) {
//         return false;
//       }
//       return true;
//     };
//     b.prototype.loadCalendars = function () {
//       a.core.calendars = JSON.parse(rioCalendars, this.dateTimeReviver);
//     };
//     b.prototype.loadEvents = function () {
//       this.calendarEvents = JSON.parse(rioEvents, this.dateTimeReviver);
//     };
//     b.prototype.persistCalendarsVisibilitySettings = function (a) {
//       this.localStorageSetItem("oneview_visibilitySettings", JSON.stringify(a));
//       this.reload();
//     };
//     b.prototype.applyCalendarsVisibilitySettings = function () {
//       var b = localStorage.getItem("oneview_visibilitySettings");
//       if (null !== b && void 0 !== b)
//         for (
//           var b = JSON.parse(b, this.dateTimeReviver), d = 0;
//           d < a.core.calendars.length;
//           d++
//         )
//           for (var f = 0; f < b.length; f++)
//             b[f].id == a.core.calendars[d].id &&
//               (a.core.calendars[d].visibility = b[f].newVisibility);
//     };
//     b.prototype.analyticsInit = function () {
//       0 == this.analyticsStarted &&
//         ((this.analyticsStarted = true),
//         ga.create("UA-69941766-7", "auto"),
//         ga("send", "pageview"));
//     };
//     b.prototype.analyticsEvent = function (a, b) {
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
//     b.prototype.analyticsPage = function (a) {
//       try {
//         ga && (this.analyticsInit(), ga("send", "pageview", "/" + a));
//       } catch (e) {}
//     };
//     b.prototype.analyticsValue = function (a, b, d, g) {
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
//     b.prototype.analyticsTiming = function (a, b) {
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
(function (a) {
  var p = (function () {
    function d() {
      this.colorPickerId = "onview.calendar.color.control";
      this.darkThemeId = "oneview.calendar.theme.dark.1";
      this.candyThemeId = "oneview.calendar.theme.candy";
      this.pageHtml =
        '<div id="calendarsTopBar" class="topBar">    <button id="shopBack" class="topBarButton" style="width:50%"><img src="images/arrow-left.svg" class="topBarImage"/></span><span>{#Back#}</span></button>    <button id="emptyButton" class="topBarButton" style="width:50%"></button>    <div id="shopTitle" class="topBarTitle" style="width:100%">{#Shop#}</div></div><div id="shopArea" class="pageContent pageTopPadding">    <div id="darkThemeArea" class="shopItemArea" >        <div class="shopItemAreaLeft" >            <div id="darkThemeTitle" class="shopItemTitle"></div>            <div id="darkThemeDescription" class="shopItemDescription"></div>            <button id="darkThemePrice" class="shopItemButton"> ? </button>        </div>        <div class="shopItemAreaRight">            <img class="shopImage" src="images/darkTheme_mini.png">        </div>    </div>    <div id="candyThemeArea" class="shopItemArea" >        <div class="shopItemAreaLeft" >            <div id="candyThemeTitle" class="shopItemTitle"></div>            <div id="candyThemeDescription" class="shopItemDescription"></div>            <button id="candyThemePrice" class="shopItemButton"> ? </button>        </div>        <div class="shopItemAreaRight">            <img class="shopImage" src="images/candyTheme_mini.png">        </div>    </div>    <div id="colorPickerArea" class="shopItemArea" >        <div class="shopItemAreaLeft" >            <div id="colorPickerTitle" class="shopItemTitle"></div>            <div id="colorPickerDescription" class="shopItemDescription"></div>            <button id="colorPickerPrice" class="shopItemButton"> ? </button>        </div>        <div class="shopItemAreaRight">            <img class="shopImage" src="images/colorPicker_mini.png">        </div>    </div></div>';
      this.alreadyRegistered = false;
    }
    d.prototype.reloadShopItems = function () {
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
      a.core.domHandler.addClickEvent(
        "colorPickerPrice",
        this.itemClicked,
        this
      );
      a.core.domHandler.addClickEvent("darkThemePrice", this.itemClicked, this);
      a.core.domHandler.addClickEvent(
        "candyThemePrice",
        this.itemClicked,
        this
      );
    };
    d.prototype.productOk = function (a) {
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
    };
    d.prototype.productNotFinished = function (a) {
      return "approved" == a.state;
    };
    d.prototype.setupColorPicker = function (b) {
      this.productColorPicker = b;
      this.setupItem(b, "colorPicker");
      this.productOk(b)
        ? (a.core.commonUserSettings.licenceColorPicker = true)
        : (a.core.commonUserSettings.licenceColorPicker = false);
      this.productNotFinished(b) && b.finish();
    };
    d.prototype.setupDarkTheme = function (b) {
      this.productDarkTheme = b;
      this.setupItem(b, "darkTheme");
      this.productOk(b)
        ? (a.core.commonUserSettings.licenceDarkTheme = true)
        : (a.core.commonUserSettings.licenceDarkTheme = false);
      this.productNotFinished(b) && b.finish();
    };
    d.prototype.setupCandyTheme = function (b) {
      this.productCandyTheme = b;
      this.setupItem(b, "candyTheme");
      this.productOk(b)
        ? (a.core.commonUserSettings.licenceCandyTheme = true)
        : (a.core.commonUserSettings.licenceCandyTheme = false);
      this.productNotFinished(b) && b.finish();
    };
    d.prototype.setupItem = function (a, c) {
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
    };
    d.prototype.show = function () {
      a.core.domHandler.hideCanvas();
      this.timestamp = a.core.getTimeStamp();
      a.core.calendarDataProxy.analyticsPage("Shop page");
      this.shopPage = a.core.domHandler.pageHtmlFormatHelper(
        "shopPage",
        this.pageHtml
      );
      this.shopPage.style.display = "block";
      a.core.domHandler.resizeDomElements();
      a.core.domHandler.resizeDomElements();
      a.core.domHandler.resizeDomElements =
        a.core.domHandler.resizeDomElements.bind(a.core.domHandler);
      window.setTimeout(a.core.domHandler.resizeDomElements, 0);
      window.setTimeout(a.core.domHandler.resizeDomElements, 100);
      this.reloadShopItems();
      var b = (a.core.settings.titleWidth / a.core.ratio - 24) / 2;
      document.getElementById("shopBack").style.padding = b + "px";
      document.getElementById("emptyButton").style.padding =
        a.core.settings.titleWidth / a.core.ratio / 2 + 1 + "px";
      document.getElementById("shopArea").style.top = "54px";
      a.core.showBackButtons()
        ? (a.core.domHandler.addClickEvent("shopBack", this.shopBack, this),
          (document.getElementById("shopTitle").style.display = "none"))
        : ((document.getElementById("shopBack").style.display = "none"),
          (document.getElementById("emptyButton").style.display = "none"));
    };
    d.prototype.hide = function () {
      a.core.appStateHandler.shopControlIsShowing = false;
      window.store.off(this.setupColorPicker);
      window.store.off(this.setupDarkTheme);
      window.store.off(this.setupCandyTheme);
      a.core.domHandler.showCanvas();
      a.core.domHandler.removeElement(this.shopPage.id);
    };
    d.prototype.reshow = function () {
      this.show();
    };
    d.prototype.getEventTarget = function (a) {
      a = a || window.event;
      return a.target || a.srcElement;
    };
    d.prototype.itemClicked = function (b) {
      b.preventDefault();
      var c = a.core.getTimeStamp();
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
    };
    d.prototype.shopBack = function (b) {
      300 > a.core.getTimeStamp() - this.timestamp ||
        a.core.appStateHandler.back();
    };
    return d;
  })();
  a.ShopControl = p;
})(OneView || (OneView = {}));

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
