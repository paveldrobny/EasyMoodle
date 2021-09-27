const { ipcRenderer } = require("electron");

const electron = window.require("electron");

const webView = document.querySelector("webview"),
  minBtn = document.getElementById("min-btn"),
  maxBtn = document.getElementById("max-btn"),
  closeBtn = document.getElementById("close-btn"),
  viewBack = document.getElementById("view-back"),
  viewForward = document.getElementById("view-forward"),
  viewRefresh = document.getElementById("view-refresh"),
  viewHome = document.getElementById("view-home"),
  viewDevTools = document.getElementById("view-devTools"),
  viewAppTools = document.getElementById("view-appTools"),
  timerAction = document.getElementById("timer-action"),
  remainingTime = document.getElementById("remaining-time");
// title = document.getElementById("page-title");

// webView.addEventListener("update-target-url", () => {
//   title.innerHTML = webView.getURL();
// });

minBtn.addEventListener("click", function () {
  electron.ipcRenderer.send("app-minimize");
});

maxBtn.addEventListener("click", function () {
  electron.ipcRenderer.send("app-maximize");
});

closeBtn.addEventListener("click", function () {
  electron.ipcRenderer.send("app-close");
});

let isStart = false,
  timer,
  courseTimer;

const TIME_IN_MINUTES = 4;
const TARGET_TIME = TIME_IN_MINUTES * 60;

const startAction = () => {
  timerAction.innerHTML = "СТОП";
  timerAction.classList.add("is-start");
};

const stopAction = () => {
  timerAction.innerHTML = "СТАРТ";
  timerAction.classList.remove("is-start");
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

viewBack.addEventListener("click", function () {
  webView.goBack();
});

viewForward.addEventListener("click", function () {
  webView.goForward();
});

viewRefresh.addEventListener("click", function () {
  webView.reload();
});

viewHome.addEventListener("click", function () {
  loadLink("http://e.adidonntu.ru/");
});

viewDevTools.addEventListener("click", function () {
  webView.openDevTools();
});

viewAppTools.addEventListener("click", function () {
  ipcRenderer.send("app-code");
});

const loadLink = (target) => {
  webView.src = target;
};

const checkTime = (date, start, end) => {
  return date.getTime() > start.getTime() && date.getTime() < end.getTime();
};

const checkCourse = () => {
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
  if (day == 1) {
    if (checkTime(date, startFirstPair, endFirstPair)) {
      loadLink("");
    } else if (checkTime(date, startSecondPair, endSecondPair)) {
      loadLink("");
    } else if (checkTime(date, startThirdPair, endThirdPair)) {
      loadLink("");
    } else if (checkTime(date, startFourthPair, endFourthPair)) {
      loadLink("");
    }
  }
  //////////////////////////////////////////////////////////////
  else if (day == 2) {
    if (checkTime(date, startFirstPair, endFirstPair)) {
      loadLink("");
    } else if (checkTime(date, startSecondPair, endSecondPair)) {
      loadLink("");
    } else if (checkTime(date, startThirdPair, endThirdPair)) {
      loadLink("");
    } else if (checkTime(date, startFourthPair, endFourthPair)) {
      loadLink("");
    }
  }
  //////////////////////////////////////////////////////////////
  else if (day == 3) {
    if (checkTime(date, startFirstPair, endFirstPair)) {
      loadLink("");
    } else if (checkTime(date, startSecondPair, endSecondPair)) {
      loadLink("");
    } else if (checkTime(date, startThirdPair, endThirdPair)) {
      loadLink("");
    } else if (checkTime(date, startFourthPair, endFourthPair)) {
      loadLink("");
    }
  }
  //////////////////////////////////////////////////////////////
  else if (day == 4) {
    if (checkTime(date, startFirstPair, endFirstPair)) {
      loadLink("");
    } else if (checkTime(date, startSecondPair, endSecondPair)) {
      loadLink("");
    } else if (checkTime(date, startThirdPair, endThirdPair)) {
      loadLink("");
    } else if (checkTime(date, startFourthPair, endFourthPair)) {
      loadLink("");
    }
  }
  //////////////////////////////////////////////////////////////
  else if (day == 5) {
    if (checkTime(date, startFirstPair, endFirstPair)) {
      loadLink("");
    } else if (checkTime(date, startSecondPair, endSecondPair)) {
      loadLink("");
    } else if (checkTime(date, startThirdPair, endThirdPair)) {
      loadLink("");
    } else if (checkTime(date, startFourthPair, endFourthPair)) {
      loadLink("");
    }
  }
};
