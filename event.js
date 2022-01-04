const electron = window.require("electron");

const os = require("os");
import { USER_KEYS } from "./database.js";

const URL_UPDATE =
  "https://api.github.com/repos/paveldrobny/EasyMoodle/branches/master";

let SITE_VERSION = "";

const webView = document.getElementById("web-view"),
  webView2 = document.getElementById("web-view2"),
  minBtn = document.getElementById("min-btn"),
  maxBtn = document.getElementById("max-btn"),
  closeBtn = document.getElementById("close-btn"),
  titleBarName = document.getElementsByClassName("title-bar-name"),
  viewBack = document.getElementsByClassName("back-btn"),
  viewForward = document.getElementById("view-forward"),
  viewRefresh = document.getElementById("view-refresh"),
  viewAbout = document.getElementById("view-about"),
  viewDevTools = document.getElementById("view-devTools"),
  viewSplit = document.getElementById("view-split"),
  timerAction = document.getElementById("timer-action"),
  remainingTime = document.getElementById("remaining-time"),
  updateReady = document.getElementsByClassName("update-ready"),
  updateApp = document.getElementById("update-ready-button"),
  userIDBtn = document.getElementById("user-id"),
  userCurrentID = document.getElementById("user-current-id"),
  accessBlock = document.getElementById("access-block"),
  loader = document.getElementById("loader"),
  loaderProgress = document.getElementById("loader-progress"),
  aboutApp = document.getElementById("aboutApp");

const checkVersion = () => {
  setInterval(function () {
    fetch(URL_UPDATE)
      .then((res) => res.json())
      .then((out) => {
        if (SITE_VERSION == out.commit.commit.author.date) {
          updateReady[0].classList.remove("is-show");
        } else {
          updateReady[0].classList.add("is-show");
        }
      })
      .catch((err) => {
        return err;
      });
  }, 5000);
};

window.addEventListener("loadeddata", function () {
  getWindowsColors();
});

window.addEventListener("load", function () {
  fetch(URL_UPDATE)
    .then((res) => res.json())
    .then((out) => {
      SITE_VERSION = out.commit.commit.author.date;
    });

  checkVersion();

  getWindowsColors();
  getUserID();
  checkDatabaseID();
});

const getUserID = () => {
  const createID = (
    os.hostname() +
    os.userInfo().username +
    os.cpus()[0].model +
    os.cpus().length
  )
    .replace(/ /g, "")
    .toLocaleLowerCase();

  return createID;
};

const disableLoader = () => {
  setTimeout(function () {
    loader.style.display = "none";
  }, 4000);
};

const checkDatabaseID = () => {
  const userIDInput = document.getElementById("user-id-input");
  const notNowID = document.getElementById("notNow-message-id");

  userIDInput.value = getUserID();
  notNowID.innerHTML = `Ваш уникальный идентификатор: </br> ${getUserID()}`;

  for (let i = 0; i < USER_KEYS.length; i++) {
    if (USER_KEYS[i] == getUserID()) {
      disableLoader();
      userCurrentID.style.display = "none";
      accessBlock.style.display = "none";
    } else {
      disableLoader();
      userCurrentID.style.display = "block";
      accessBlock.style.display = "block";
    }
  }
};

const getWindowsColors = () => {
  electron.ipcRenderer.send("app-windows-color");
  electron.ipcRenderer.on("app-get-windows-color", (event, data) => {
    if (os.release().indexOf("10.", 0) != -1) {
      titleBarName[0].style.background = `#${data}`;
      loaderProgress.style.background = `#${data}`;
    }
  });
};

const getAboutVersion = () => {
  const aboutVersionWindow = document.getElementById("aboutApp-window");
  const aboutVersionUI = document.getElementById("aboutApp-ui");

  aboutVersionUI.innerHTML = `Версия интерфейса: ${SITE_VERSION}`;
};

minBtn.addEventListener("click", function () {
  electron.ipcRenderer.send("app-minimize");
});

maxBtn.addEventListener("click", function () {
  electron.ipcRenderer.send("app-maximize");
});

closeBtn.addEventListener("click", function () {
  electron.ipcRenderer.send("app-close");
});

updateApp.addEventListener("click", function () {
  electron.ipcRenderer.send("app-reload");
});

userIDBtn.addEventListener("click", function () {
  if (aboutApp.style.display == "block") {
    aboutApp.style.display = "none";
    viewAbout.style.background = "transparent";
  }
  if (userCurrentID.style.display == "none") {
    userIDBtn.style.background = "#2f53a8";
    userCurrentID.style.display = "block";
    return;
  }
  userCurrentID.style.display = "none";
  userIDBtn.style.background = "transparent";
});

// TIMERS
let isStart = false,
  timer,
  courseTimer;

var isSplit = false;

const TIME_IN_MINUTES = 2;
const TARGET_TIME = TIME_IN_MINUTES * 60;

const startAction = () => {
  timerAction.classList.add("is-start");
  remainingTime.classList.add("is-active");
};

const stopAction = () => {
  timerAction.classList.remove("is-start");
  remainingTime.classList.remove("is-active");
};

timerAction.addEventListener("click", function () {
  let distance;

  if (!isStart) {
    isStart = true;
    startAction();
    checkCourse();
    distance = TARGET_TIME;

    timer = setInterval(function () {
      distance--;

      let minutes = Math.floor(distance / 60);
      let seconds = Math.floor(distance % 60);

      remainingTime.innerHTML = `0${minutes}:${seconds}`;

      if (distance <= 0) {
        distance = TARGET_TIME;
      }
    }, 1000);

    courseTimer = setInterval(function () {
      checkCourse();
    }, TIME_IN_MINUTES * 60000);
  } else {
    isStart = false;
    stopAction();
    clearInterval(timer);
    clearInterval(courseTimer);
    distance = TARGET_TIME;
    remainingTime.innerHTML = "00:00";
  }
});

viewBack[0].addEventListener("click", function () {
  webView.goBack();
});

webView.addEventListener("did-navigate", function () {
  if (webView.canGoBack()) {
    viewBack[0].classList.add("is-active");
  } else {
    viewBack[0].classList.remove("is-active");
  }
});

viewRefresh.addEventListener("click", function () {
  electron.ipcRenderer.send("app-reload");
});

viewAbout.addEventListener("click", function () {
  if (userCurrentID.style.display == "block") {
    userCurrentID.style.display = "none";
    userIDBtn.style.background = "transparent";
  }
  if (aboutApp.style.display == "block") {
    aboutApp.style.display = "none";
    viewAbout.style.background = "transparent";
    return;
  }
  aboutApp.style.display = "block";
  viewAbout.style.background = "#2f53a8";
  getAboutVersion();
});

viewDevTools.addEventListener("click", function () {
  webView.openDevTools();
});

viewSplit.addEventListener("click", function () {
  if (isSplit) {
    isSplit = false;
    viewSplit.classList.remove("is-split");
    splitDisable();
    return;
  }
  isSplit = true;
  viewSplit.classList.add("is-split");
  splitEnable();
});

const faColumns = document.getElementsByClassName("fa-columns");
const splitEnable = () => {
  webView.className = "split";
  webView2.className = "split";
  faColumns[0].style.transform = "rotate(45deg) scale(1.1)";
};

const splitDisable = () => {
  webView.className = "";
  webView2.className = "";
  faColumns[0].style.transform = "rotate(0deg) scale(1)";
};

const loadLink = (target) => {
  webView.src = target;
};

const loadLink_2 = (target) => {
  webView2.src = target;
};

const checkTime = (date, start, end) => {
  return date.getTime() > start.getTime() && date.getTime() < end.getTime();
};

const DAY_1 = [
  "http://e.adidonntu.ru/course/view.php?id=377",
  "http://e.adidonntu.ru/course/view.php?id=377",
  "http://e.adidonntu.ru/course/view.php?id=536",
  "http://e.adidonntu.ru/course/view.php?id=667",
];

const DAY_2 = [
  "http://e.adidonntu.ru/course/view.php?id=442",
  "http://e.adidonntu.ru/course/view.php?id=427",
  "http://e.adidonntu.ru/course/view.php?id=667",
  "http://e.adidonntu.ru/course/view.php?id=427",
];

const DAY_3 = [
  "http://e.adidonntu.ru/course/view.php?id=442",
  "http://e.adidonntu.ru/course/view.php?id=594",
  "http://e.adidonntu.ru/course/view.php?id=594",
  "http://e.adidonntu.ru/course/view.php?id=594",
];

const DAY_4 = [
  "http://e.adidonntu.ru/course/view.php?id=442",
  "http://e.adidonntu.ru/course/view.php?id=498",
  "http://e.adidonntu.ru/course/view.php?id=461",
  "http://e.adidonntu.ru/course/view.php?id=498",
];

const DAY_5 = [
  "http://e.adidonntu.ru/course/view.php?id=203",
  "http://e.adidonntu.ru/course/view.php?id=203",
  "http://e.adidonntu.ru/course/view.php?id=461",
  "http://e.adidonntu.ru/course/view.php?id=203",
];

const dayTemplate = (numDay, subject) => {
  const date = new Date(),
    day = date.getDay(),
    mounth = date.getMonth(),
    _date = date.getDate(),
    //
    startFirstPair = new Date(2021, mounth, _date, 7, 55),
    endFirstPair = new Date(2021, mounth, _date, 9, 30),
    //
    startSecondPair = new Date(2021, mounth, _date, 9, 50),
    endSecondPair = new Date(2021, mounth, _date, 11, 25),
    //
    startThirdPair = new Date(2021, mounth, _date, 11, 40),
    endThirdPair = new Date(2021, mounth, _date, 13, 15),
    //
    startFourthPair = new Date(2021, mounth, _date, 13, 30),
    endFourthPair = new Date(2021, mounth, _date, 15, 0);

  //////////////////////////////////////////////////////////////
  if (day == numDay) {
    if (checkTime(date, startFirstPair, endFirstPair)) {
      loadLink(subject[0]);
      if (isSplit) {
        loadLink_2(subject[0]);
      }
    } else if (checkTime(date, startSecondPair, endSecondPair)) {
      loadLink(subject[1]);
      if (isSplit) {
        loadLink_2(subject[1]);
      }
    } else if (checkTime(date, startThirdPair, endThirdPair)) {
      loadLink(subject[2]);
      if (isSplit) {
        loadLink_2(subject[2]);
      }
    } else if (checkTime(date, startFourthPair, endFourthPair)) {
      loadLink(subject[3]);
      if (isSplit) {
        loadLink_2(subject[3]);
      }
    }
  }
  //////////////////////////////////////////////////////////////
};

const checkCourse = () => {
  dayTemplate(1, DAY_1);
  dayTemplate(2, DAY_2);
  dayTemplate(3, DAY_3);
  dayTemplate(4, DAY_4);
  dayTemplate(5, DAY_5);
};
