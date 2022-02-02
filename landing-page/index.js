const setNameBtn = document.querySelector(".profile .username");
const newTodoInput = document.querySelector(".new-todo input");
const newTodoBtn = document.querySelector(".new-todo button");

const getUserName = () => {
  const usernameElem = document.querySelector(".name .username");
  const username = localStorage.getItem("username");
  if (username) {
    usernameElem.innerHTML = username;
  }
};

const getTodos = () => {
  const todosElem = document.querySelector(".todos");
  const todos = localStorage.getItem("todos");
  const previousTodos = document.querySelectorAll(".todo");
  const html = JSON.parse(todos).data.map((elem) => `${elem}`);

  if (html.length === 0) {
    previousTodos.forEach((elem) => {
      elem.remove();
    });
    const newDiv = document.createElement("div");
    newDiv.className = "todo";
    newDiv.innerHTML = "Write down your todos for today";
    todosElem.appendChild(newDiv);
    return;
  }

  previousTodos.forEach((elem) => {
    elem.remove();
  });

  if (todos) {
    html.forEach((elem, index) => {
      const newDiv = document.createElement("div");
      const newElem = document.createElement("span");
      const newBtn = document.createElement("button");
      newDiv.className = "todo";
      newBtn.id = index;
      newElem.innerHTML = `${index + 1}. ${elem}`;
      newBtn.innerHTML = "❌";
      newBtn.onclick = () => deleteTodo(index);
      newDiv.appendChild(newElem);
      newDiv.appendChild(newBtn);
      todosElem.appendChild(newDiv);
    });
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
    const month = addZero(currentTime.getMonth() + 1);
    const date = addZero(currentTime.getDate());
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
getTodos();

setNameBtn.addEventListener("click", setUserName);
newTodoBtn.addEventListener("click", newTodos);
newTodoInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") newTodos();
});
