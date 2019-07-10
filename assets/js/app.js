class Todo {
  constructor() {
    this.newTask = document.querySelector(".todo-container__add-input");
    this.ul = document.querySelector(".list-group");
    this.addBtn = document.querySelector("#addTask");
    this.todoBody = document.querySelector(".todo-container__body");
    this.toggleTodo = Array.from(document.getElementsByClassName("label"));
    this.deleteBtn = "delete-todo";
  }

  addNewTask() {
    let task = this.newTask.value;
    const li = document.createElement("li");
    li.className = "list-group-item";

    let id = new Date().getTime();

    li.innerHTML = `
        <div>
          <input name="l" class="input-checkbox" id="${id}" type="checkbox" />
          <label for="${id}" class="label">
            <span class="inner-circle"></span>
          </label>
          <span class="task">${task}</span>
        </div>
        <button class="delete-todo">-</button>
      `;

    this.ul.prepend(li);

    let newTask = {
      task: task,
      id: id,
      completed: false
    };

    this.addNewTaskToLS(newTask);

    this.clearInput();
  }

  clearInput() {
    this.newTask.value = "";
  }

  removeTaskFromDOM(DOM) {
    DOM.target.parentElement.remove();
  }

  removeFromLS(id) {
    let tasks = this.getTasksFromLS();

    let taskIndex = tasks.findIndex(task => {
      if (task.id == id) {
        return true;
      }
    });

    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  getTasksToDOM() {
    let tasks = this.getTasksFromLS();
    if (tasks.length > 0) {
      tasks.forEach(task => {
        this.ul.innerHTML += `
          <li class="list-group-item">
            <div>
              <input ${
                task.completed ? 'checked="true"' : ""
              } class="input-checkbox" id="${task.id}" type="checkbox">
              <label for="${task.id}" class="label">
                <span class="inner-circle"></span>
              </label>
              <span class="task">${task.task}</span>
            </div>
            <button class="delete-todo">-</button>
          </li>
        `;
      });
    }
  }

  getTasksFromLS() {
    let tasks;
    if (
      localStorage.getItem("tasks") == undefined ||
      localStorage.getItem("tasks") == null
    ) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    return tasks;
  }

  addNewTaskToLS(task) {
    let tasks = this.getTasksFromLS();
    tasks.unshift(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  checkUncheck(id, bool) {
    let tasks = this.getTasksFromLS();
    let taskIndex = tasks.findIndex(task => {
      if (task.id == id) {
        return true;
      }
    });

    let getBoolean = tasks[taskIndex];
    getBoolean.completed = bool;

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let todo = new Todo();
  todo.getTasksToDOM();

  todo.addBtn.addEventListener("submit", e => {
    e.preventDefault();
    todo.addNewTask();
  });

  todo.ul.addEventListener("click", e => {
    if (e.target.classList.contains(todo.deleteBtn)) {
      todo.removeTaskFromDOM(e);
      todo.removeFromLS(e.target.previousElementSibling.children[0].id);
    }

    if (e.target.className == "inner-circle") {
      if (e.target.parentElement.previousElementSibling.checked == true) {
        todo.checkUncheck(
          e.target.parentElement.previousElementSibling.id,
          false
        );
      } else {
        todo.checkUncheck(
          e.target.parentElement.previousElementSibling.id,
          true
        );
      }
    }
  });
});
