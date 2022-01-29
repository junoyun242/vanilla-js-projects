const setNameBtn = document.querySelector(".profile .username");

const getUserName = () => {
  const usernameElem = document.querySelector(".name .username");
  const username = localStorage.getItem("username");
  if (username) {
    usernameElem.innerHTML = username;
  }
};

const displayTime = () => {
  const profile = document.querySelector(".profile");
  const daySelector = profile.querySelector(".day");
  const time = profile.querySelector(".time");

  setInterval(() => {
    const currentTime = new Date();
    const month = addZero(currentTime.getMonth() + 1);
    const date = currentTime.getDate();
    const day = calculateDay(currentTime.getDay());
    const hours = calculateHours(currentTime.getHours());
    const minutes = addZero(currentTime.getMinutes());
    const seconds = addZero(currentTime.getSeconds());

    daySelector.innerHTML = `${month}/${date} ${day}`;
    time.innerHTML = `${hours.hours}:${minutes}:${seconds} ${hours.indicator}`;
  }, 100);
};

const addZero = (number) => {
  if (number >= 10) return number;
  return "0" + String(number);
};

const calculateDay = (day) => {
  switch (day) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
    default:
      break;
  }
};

const calculateHours = (hours) => {
  if (hours < 12) return { hours, indicator: "AM" };
  if (hours === 12) return { hours, indicator: "PM" };

  return { hours: addZero(hours - 12), indicator: "PM" };
};

const setUserName = () => {
  const staticMode = document.querySelector(".static-mode");
  const changeMode = document.querySelector(".change-mode");
  const input = changeMode.querySelector("input");

  staticMode.style.display = "none";
  changeMode.style.display = "flex";

  input.focus();

  changeMode.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("username", input.value);
    staticMode.style.display = "flex";
    changeMode.style.display = "none";
    getUserName();
  });
};

displayTime();
getUserName();

setNameBtn.addEventListener("click", setUserName);
