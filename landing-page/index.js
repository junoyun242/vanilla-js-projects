const setNameBtn = document.querySelector(".profile .username");
const newTodoInput = document.querySelector(".new-todo input");
const newTodoBtn = document.querySelector(".new-todo button");
const newBookmarkForm = document.querySelector(".new-bookmark");

const getUserName = () => {
  const usernameElem = document.querySelector(".name .username");
  const username = localStorage.getItem("username");
  if (username) {
    usernameElem.innerHTML = username + " ✅";
  }
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

  const abortChange = (e) => {
    e.preventDefault();
    if (!e.target.classList.contains("username")) {
      staticMode.style.display = "flex";
      changeMode.style.display = "none";
      getUserName();
      window.removeEventListener("click", abortChange);
    }
  };

  input.value = "";

  window.addEventListener("click", abortChange);
};

const getTodos = () => {
  const todosElem = document.querySelector(".todos");
  const todos = localStorage.getItem("todos");
  const previousTodos = document.querySelectorAll(".todo");

  try {
    previousTodos.forEach((elem) => {
      elem.remove();
    });
    const html = JSON.parse(todos).data.map((elem) => `${elem}`);
    if (html.length === 0) {
      throw new Error("0 elem");
    }
    html.forEach((elem, index) => {
      const newDiv = document.createElement("div");
      const newElem = document.createElement("span");
      const newBtn = document.createElement("button");
      newDiv.className = "todo";
      newBtn.id = index + elem;
      newElem.innerHTML = `${index + 1}. ${elem}`;
      newBtn.innerHTML = "X";
      newBtn.className = "delete-btn";
      newBtn.onclick = () => deleteTodo(index);
      newDiv.appendChild(newElem);
      newDiv.appendChild(newBtn);
      todosElem.appendChild(newDiv);
    });
  } catch (err) {
    previousTodos.forEach((elem) => {
      elem.remove();
    });
    const newDiv = document.createElement("div");
    newDiv.className = "todo";
    newDiv.innerHTML = "Write down your todos for today";
    todosElem.appendChild(newDiv);
    return;
  }
};

const newTodos = () => {
  const newTodoElem = document.querySelector(".new-todo");
  const inputElem = newTodoElem.querySelector("input");
  const todos = localStorage.getItem("todos");

  if (!todos) {
    const newTodos = { data: [inputElem.value] };
    localStorage.setItem("todos", JSON.stringify(newTodos));
    getTodos();
    return;
  }

  const todoList = JSON.parse(todos);
  todoList.data.push(inputElem.value);
  localStorage.setItem("todos", JSON.stringify(todoList));

  getTodos();

  newTodoInput.focus();
  newTodoInput.value = "";
};

const deleteTodo = (index) => {
  const todos = localStorage.getItem("todos");
  const todoList = JSON.parse(todos);
  todoList.data.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todoList));
  getTodos();
};

const displayTime = () => {
  const profile = document.querySelector(".profile");
  const daySelector = profile.querySelector(".day");
  const time = profile.querySelector(".time");

  setInterval(() => {
    const currentTime = new Date();
    const month = calculateMonth(currentTime.getMonth());
    const date = addZero(currentTime.getDate());
    const day = calculateDay(currentTime.getDay());
    const hours = calculateHours(currentTime.getHours());
    const minutes = addZero(currentTime.getMinutes());
    const seconds = addZero(currentTime.getSeconds());

    daySelector.innerHTML = `${month} ${date} ${day}`;
    time.innerHTML = `${hours.hours}:${minutes}:${seconds} ${hours.indicator}`;
  }, 100);
};

const addZero = (number) => {
  if (number >= 10) return number;
  return "0" + String(number);
};

const calculateMonth = (month) => {
  switch (month) {
    case 0:
      return "Jan.";
    case 1:
      return "Feb.";
    case 2:
      return "Mar.";
    case 3:
      return "Apr.";
    case 4:
      return "May.";
    case 5:
      return "Jun.";
    case 6:
      return "Jul.";
    case 7:
      return "Aug.";
    case 8:
      return "Sept.";
    case 9:
      return "Oct.";
    case 10:
      return "Nov.";
    case 11:
      return "Dec.";
    default:
      break;
  }
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

const addNewBookmark = async (e) => {
  e.preventDefault();
  const inputURLElem = newBookmarkForm.querySelector("input");
  const inputURL = inputURLElem.value;
  const urlList = JSON.parse(localStorage.getItem("bookmarks"));

  const addData = (title) => {
    const newUrlList = {
      data: [
        {
          title,
          url: inputURL,
        },
      ],
    };
    if (!urlList) {
      localStorage.setItem("bookmarks", JSON.stringify(newUrlList));
    } else {
      urlList.data.push({ title, url: inputURL });
      localStorage.setItem("bookmarks", JSON.stringify(urlList));
    }
  };

  try {
    const dataRes = await fetch(inputURL);
    const data = await dataRes.text();
    const parsedResponse = new window.DOMParser().parseFromString(
      data,
      "text/html"
    );
    const siteTitle = parsedResponse.title;
    addData(siteTitle);
  } catch (err) {
    const title = window.prompt("What is the name of the site?");
    addData(title);
  }
  inputURLElem.value = "";

  getBookmarks();
};

const getBookmarks = () => {
  const bookmarksElem = document.querySelector(".bookmarks");
  const bookmarks = localStorage.getItem("bookmarks");
  const previousBookmarks = document.querySelectorAll(".bookmark");

  try {
    previousBookmarks.forEach((elem) => {
      elem.remove();
    });
    const html = JSON.parse(bookmarks).data.map((elem) => ({
      title: elem.title,
      url: elem.url,
    }));
    if (html.length === 0) {
      throw new Error("0 elem");
    }

    html.forEach((elem, index) => {
      const newDiv = document.createElement("div");
      const newElem = document.createElement("a");
      const newBtn = document.createElement("button");
      newDiv.className = "bookmark";
      newBtn.id = index + elem.title;
      newElem.innerHTML = `${elem.title}`;
      newElem.href = elem.url;
      newBtn.innerHTML = "X";
      newBtn.className = "delete-btn";
      newBtn.onclick = () => deleteBookmark(index);
      newDiv.appendChild(newElem);
      newDiv.appendChild(newBtn);
      bookmarksElem.appendChild(newDiv);
    });
  } catch (err) {
    previousBookmarks.forEach((elem) => {
      elem.remove();
    });
  }
};

const deleteBookmark = (index) => {
  const bookmarks = localStorage.getItem("bookmarks");
  const bookmarksList = JSON.parse(bookmarks);
  bookmarksList.data.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarksList));
  getBookmarks();
};

displayTime();
getUserName();
getTodos();
getBookmarks();

setNameBtn.addEventListener("click", setUserName);
newTodoBtn.addEventListener("click", newTodos);
newTodoInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") newTodos();
});
newBookmarkForm.addEventListener("submit", addNewBookmark);
