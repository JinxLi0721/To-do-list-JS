const todoBtn = document.querySelector(".todo-btn");
const todoInput = document.querySelector(".todo-input");
const filterTodo = document.querySelector(".filter-todo");
const todoList = document.querySelector(".todo-list");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoBtn.addEventListener("click", addTask);
filterTodo.addEventListener("change", filterTask);
todoList.addEventListener("click", deleteCheck);

function addTask(event) {
   event.preventDefault();
   let todos = JSON.parse(localStorage.getItem("todos")) ? JSON.parse(localStorage.getItem("todos")) : [];
   appendTask(todoInput.value, todos.length != 0 ? todos[todos.length - 1].sel + 1 : 1);
   saveLocalTodos(todoInput.value, false, todos.length != 0 ? todos[todos.length - 1].sel + 1 : 1);

   todoInput.value = "";
   filterTodo.value = "all";
   filterTodo.dispatchEvent(new Event("change"));
}

function filterTask(e) {
   const allTask = todoList.childNodes;
   allTask.forEach(function (todo) {
      switch (e.target.value) {
         case "all":
            todo.style.display = "flex";
            break;
         case "completed":
            if (todo.classList.contains("completed")) {
               todo.style.display = "flex";
            } else {
               todo.style.display = "none";
            }
            break;
         case "incomplete":
            if (todo.classList.contains("completed")) {
               todo.style.display = "none";
            } else {
               todo.style.display = "flex";
            }
            break;
      }
   });
}

function deleteCheck(e) {
   const item = e.target;
   const todo = item.parentElement;

   if (item.classList[0] === "trash-btn") {
      todo.classList.add("slide");

      removeLocalTodos(todo);
      todo.addEventListener("transitionend", function () {
         todo.remove();
      });
   } else if (item.classList[0] === "complete-btn") {
      todo.classList.toggle("completed");
      let localData = JSON.parse(localStorage.getItem("todos"));
      let data = localData.find(value => value.sel == todo.children[0].getAttribute("id"));
      data.completed = data.completed ? false : true;
      localStorage.setItem("todos", JSON.stringify(localData));
   }
}

//{sel: num, name: String, completed: Boolean}
function saveLocalTodos(value, isCompleted, index) {
   let todos;
   let todo = {
      name: value,
      completed: isCompleted,
      sel: index
   };
   if (localStorage.getItem("todos") === null) {
      todo.sel = 1;
      todos = [];
   } else {
      todos = JSON.parse(localStorage.getItem("todos"));
   }
   todos.push(todo);
   localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
   let todos;
   if (localStorage.getItem("todos") === null) {
      todos = [];
   } else {
      todos = JSON.parse(localStorage.getItem("todos"));
   }

   todos.forEach(element => {
      appendTask(element.name, element.sel, element.completed);
   });
}

function removeLocalTodos(todoEle) {
   let todos;
   if (localStorage.getItem("todos") === null) {
      todos = [];
   } else {
      todos = JSON.parse(localStorage.getItem("todos"));
   }

   let index = todoEle.children[0].getAttribute("id");
   let modify = todos.filter(ele => {
      return ele.sel != index;
   });
   localStorage.setItem("todos", JSON.stringify(modify));
}

function appendTask(inputValue, index, completed) {
   const todoDiv = document.createElement("div");
   todoDiv.classList.add("todo");
   if (completed) {
      todoDiv.classList.add("completed");
   }
   const newTask = document.createElement("li");
   newTask.setAttribute("id", index);
   newTask.innerText = inputValue;
   newTask.classList.add("todo-item");
   todoDiv.appendChild(newTask);

   const completeButton = document.createElement("button");
   completeButton.innerHTML = '<i class="fas fa-check-circle"></li>';
   completeButton.classList.add("complete-btn");
   todoDiv.appendChild(completeButton);

   const trashButton = document.createElement("button");
   trashButton.innerHTML = '<i class="fas fa-trash"></li>';
   trashButton.classList.add("trash-btn");
   todoDiv.appendChild(trashButton);

   todoList.appendChild(todoDiv);
}
