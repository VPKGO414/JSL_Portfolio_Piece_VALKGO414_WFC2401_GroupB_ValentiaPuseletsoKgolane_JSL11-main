// TASK: import helper functions from utils - solved
import {
  getTasks, 
  createNewTask, 
  patchTask, 
  putTask, 
  deleteTask
} from "/utils/taskFunctions.js";

// TASK: import initialData - solved
import { initialData } from "/initialData.js";

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// localStorage.clear() // clear storage

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true');
  } else {
    console.log('Data already exists in localStorage');
  }
}

// TASK: Get elements from the DOM - solved
const elements = {
  headerBoardName: document.querySelector("#header-board-name"),
  columnDivs: document.querySelectorAll(".column-div"),
  editTaskModal: document.querySelector(".edit-task-modal-window"),
  filterDiv: document.querySelector("#filterDiv"),
  hideSideBarBtn: document.querySelector("#hide-side-bar-btn"),
  showSideBarBtn: document.querySelector("#show-side-bar-btn"),
  themeSwitch: document.querySelector("#switch"),
  createNewTaskBtn: document.querySelector("#add-new-task-btn"),
  modalWindow: document.querySelector(".modal-window")
};
let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; 
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();

  }
}

// Creates different boards in the DOM - solved
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener('click', () => {  // added eventListener, arrow function
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard);
    });
    boardsContainer.appendChild(boardElement);
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName);  // added strictly equal to

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    tasksContainer.setAttribute("class", "tasks-container");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => {  // added strictly equal to
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal - solved
      taskElement.addEventListener('click', () => {   // added evenListener
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}


function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach(btn => { 
    
    if(btn.textContent === boardName) {
      btn.classList.add('active');   // added classList
    }
    else {
      btn.classList.remove('active');  // added classList
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector(`.column-div[data-status="${task.status}"]`); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');

  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.classList.add('task-div');
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);

  
  tasksContainer.appendChild(taskElement);
  refreshTasksUI();  // added

  initialData.push(task); // added
  localStorage.setItem('tasks', JSON.stringify(initialData)); // added

}



function setupEventListeners() {
  // Cancel editing task event listener - solved
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => { // added evnetListener
    toggleModal(false, elements.editTaskModal);
  });

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener('click', () => toggleSidebar(false)); // added eventListener
  elements.showSideBarBtn.addEventListener('click', () => toggleSidebar(true));  // added eventListener

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit',  (event) => {
    addTask(event);
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none';   // changed => to :
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault();

  //Assign user input to the task object - solved
  const task = {
    title: document.getElementById("title-input").value,
    description: document.getElementById("desc-input").value,
    status : document.getElementById("select-status").value,
    board : activeBoard
  };
    
  const newTask = createNewTask(task);
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
    event.target.reset();
    refreshTasksUI();
  }
}

// Sidebar - solved
function toggleSidebar(show) {
  const sidebar = document.querySelector(".side-bar");
  sidebar.style.display = show ? 'block' : 'none';
  elements.showSideBarBtn.style.display = show ? 'none' : 'block';
}

// Theme - solved
function toggleTheme() {
  const logo = document.getElementById("logo");

  if(document.body.classList.toggle('light-theme') === true) {
    logo.setAttribute('src', "./assets/logo-light.svg");
  } else {
    logo.setAttribute('src', "./assets/logo-dark.svg");
  }
}

function openEditTaskModal(task) {
  // Set task details in modal inputs
  document.getElementById("title-input").value = task.title;
  document.getElementById("desc-input").value = task.description;
  document.getElementById("select-status").value = task.status;

  // Get button elements from the task modal
  const saveChangesBtn = document.getElementById('save-task-changes-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const deleteTaskBtn = document.getElementById('delete-task-btn');

  // Call saveTaskChanges upon click of Save Changes button
  saveChangesBtn.addEventListener('click', () => {
    const updatedTask = {
      id: task.id,
      title: document.getElementById("title-input").value,
      description: document.getElementById("desc-input").value,
      status: document.getElementById("select-status").value,
      board: task.board // Assuming board doesn't change during editing
    };
    saveTaskChanges(updatedTask);
    toggleModal(false, elements.editTaskModal);
  });

  // Delete task using a helper function and close the task modal
  deleteTaskBtn.addEventListener('click', () => {
    // Call a function to delete the task using a helper function
    deleteTask(task.id);
    // Then close the modal
    toggleModal(false, elements.editTaskModal);
    refreshTasksUI();
  });

  // Close the modal on click of Cancel button
  cancelEditBtn.addEventListener('click', () => {
    toggleModal(false, elements.editTaskModal);
  });

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

// Task changes - unsolved
function saveTaskChanges(updatedTask) {
  // Update task using a helper function
  patchTask(updatedTask); // Assuming you have a patchTask function to update tasks
  
  // Close the modal and refresh the UI to reflect the changes
  refreshTasksUI();
}

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  initializeData();
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}

