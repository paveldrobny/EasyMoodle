const electron = window.require("electron");
const URL =
  "https://api.github.com/repos/paveldrobny/EasyMoodle/branches/master";

let SITE_VERSION = "";

const webView = document.getElementById("web-view"),
  webView2 = document.getElementById("web-view2"),
  minBtn = document.getElementById("min-btn"),
  maxBtn = document.getElementById("max-btn"),
  closeBtn = document.getElementById("close-btn"),
  viewBack = document.getElementById("view-back"),
  viewForward = document.getElementById("view-forward"),
  viewRefresh = document.getElementById("view-refresh"),
  viewHome = document.getElementById("view-home"),
  viewDevTools = document.getElementById("view-devTools"),
  viewSplit = document.getElementById("view-split"),
  timerAction = document.getElementById("timer-action"),
  remainingTime = document.getElementById("remaining-time"),
  updateReady = document.getElementsByClassName("update-ready"),
  updateApp = document.getElementById("update-ready-button");

const checkVersion = () => {
  setInterval(function () {
    fetch(URL)
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

window.addEventListener("load", function () {
  fetch(URL)
    .then((res) => res.json())
    .then((out) => {
      SITE_VERSION = out.commit.commit.author.date;
    });

  checkVersion();
});

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

// TIMERS
let isStart = false,
  timer,
  courseTimer;

var isSplit = false;

const TIME_IN_MINUTES = 2;
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

const splitEnable = () => {
  webView.className = "split";
  webView2.className = "split";
};

const splitDisable = () => {
  webView.className = "";
  webView2.className = "";
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
  "http://e.adidonntu.ru/course/view.php?id=594",
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

// const checkCourse = () => {
//   const date = new Date(),
//     day = date.getDay(),
//     mounth = date.getMonth(),
//     _date = date.getDate(),
//     //
//     startFirstPair = new Date(2021, mounth, _date, 7, 55),
//     endFirstPair = new Date(2021, mounth, _date, 9, 30),
//     //
//     startSecondPair = new Date(2021, mounth, _date, 9, 50),
//     endSecondPair = new Date(2021, mounth, _date, 11, 25),
//     //
//     startThirdPair = new Date(2021, mounth, _date, 11, 40),
//     endThirdPair = new Date(2021, mounth, _date, 13, 15),
//     //
//     startFourthPair = new Date(2021, mounth, _date, 13, 30),
//     endFourthPair = new Date(2021, mounth, _date, 15, 0);

//   //////////////////////////////////////////////////////////////
//   if (day == 1) {
//     if (checkTime(date, startFirstPair, endFirstPair)) {
//       loadLink(DAY_1[0]);
//       if (isSplit) {
//         loadLink_2(DAY_1[0]);
//       }
//     } else if (checkTime(date, startSecondPair, endSecondPair)) {
//       loadLink(DAY_1[1]);
//       if (isSplit) {
//         loadLink_2(DAY_1[1]);
//       }
//     } else if (checkTime(date, startThirdPair, endThirdPair)) {
//       loadLink(DAY_1[2]);
//       if (isSplit) {
//         loadLink_2(DAY_1[2]);
//       }
//     } else if (checkTime(date, startFourthPair, endFourthPair)) {
//       loadLink(DAY_1[3]);
//       if (isSplit) {
//         loadLink_2(DAY_1[3]);
//       }
//     }
//   }
//   //////////////////////////////////////////////////////////////
//   else if (day == 2) {
//     if (checkTime(date, startFirstPair, endFirstPair)) {
//       loadLink(DAY_2[0]);
//       if (isSplit) {
//         loadLink_2(DAY_2[0]);
//       }
//     } else if (checkTime(date, startSecondPair, endSecondPair)) {
//       loadLink(DAY_2[1]);
//       if (isSplit) {
//         loadLink_2(DAY_2[1]);
//       }
//     } else if (checkTime(date, startThirdPair, endThirdPair)) {
//       loadLink(DAY_2[2]);
//       if (isSplit) {
//         loadLink_2(DAY_2[2]);
//       }
//     } else if (checkTime(date, startFourthPair, endFourthPair)) {
//       loadLink(DAY_2[3]);
//       if (isSplit) {
//         loadLink_2(DAY_2[3]);
//       }
//     }
//   }
//   //////////////////////////////////////////////////////////////
//   else if (day == 3) {
//     if (checkTime(date, startFirstPair, endFirstPair)) {
//       loadLink(DAY_3[0]);
//       if (isSplit) {
//         loadLink_2(DAY_3[0]);
//       }
//     } else if (checkTime(date, startSecondPair, endSecondPair)) {
//       loadLink(DAY_3[1]);
//       if (isSplit) {
//         loadLink_2(DAY_3[1]);
//       }
//     } else if (checkTime(date, startThirdPair, endThirdPair)) {
//       loadLink(DAY_3[2]);
//       if (isSplit) {
//         loadLink_2(DAY_3[2]);
//       }
//     } else if (checkTime(date, startFourthPair, endFourthPair)) {
//       loadLink(DAY_3[3]);
//       if (isSplit) {
//         loadLink_2(DAY_3[3]);
//       }
//     }
//   }
//   //////////////////////////////////////////////////////////////
//   else if (day == 4) {
//     if (checkTime(date, startFirstPair, endFirstPair)) {
//       loadLink(DAY_4[0]);
//       if (isSplit) {
//         loadLink_2(DAY_4[0]);
//       }
//     } else if (checkTime(date, startSecondPair, endSecondPair)) {
//       loadLink(DAY_4[1]);
//       if (isSplit) {
//         loadLink_2(DAY_4[1]);
//       }
//     } else if (checkTime(date, startThirdPair, endThirdPair)) {
//       loadLink(DAY_4[2]);
//       if (isSplit) {
//         loadLink_2(DAY_4[2]);
//       }
//     } else if (checkTime(date, startFourthPair, endFourthPair)) {
//       loadLink(DAY_4[3]);
//       if (isSplit) {
//         loadLink_2(DAY_4[3]);
//       }
//     }
//   }
//   //////////////////////////////////////////////////////////////
//   else if (day == 5) {
//     if (checkTime(date, startFirstPair, endFirstPair)) {
//       loadLink(DAY_5[0]);
//       if (isSplit) {
//         loadLink_2(DAY_5[0]);
//       }
//     } else if (checkTime(date, startSecondPair, endSecondPair)) {
//       loadLink(DAY_5[1]);
//       if (isSplit) {
//         loadLink2(DAY_5[1]);
//       }
//     } else if (checkTime(date, startThirdPair, endThirdPair)) {
//       loadLink(DAY_5[2]);
//       if (isSplit) {
//         loadLink_2(DAY_5[2]);
//       }
//     } else if (checkTime(date, startFourthPair, endFourthPair)) {
//       loadLink(DAY_5[3]);
//       if (isSplit) {
//         loadLink_2(DAY_5[3]);
//       }
//     }
//   }
// };
