// TASK: import helper functions from utils
// TASK: import initialData

// Importing specific functions from utils.js
import {
  getTasks,
  createNewTask,
  patchTask,
  putTask,
  deleteTask
} from "./utils/taskFunctions.js"

// Importing everything from initialData.js
import initialData from './initialData.js';

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    // Load initial data into local storage
    localStorage.setItem('tasks', JSON.stringify(initialData.tasks)); // Store only the 'tasks' array
    localStorage.setItem('showSideBar', 'true');
  } else {
    console.log('Data already exists in localStorage');
  }
}

// Call initializeData before elements in DOM
initializeData();
// TASK: Get elements from the DOM
/*const elements = {//total 14
  // Sidebar elements
  hideSideBarBtn: document.getElementById('hide-side-bar-btn'),
  showSideBarBtn: document.getElementById('show-side-bar-btn'),
  sideBarDiv: document.getElementById('side-bar-div'),

  // Theme elements
  themeSwitch: document.getElementById('switch'),

  // Add new task modal elements
  createNewTaskBtn: document.getElementById('add-new-task-btn'),
  modalWindow: document.getElementById('new-task-modal-window'),
  filterDiv: document.getElementById('filterDiv'),

  // Edit task modal elements
  editTaskModal: document.querySelector('.edit-task-modal-window'),

  // Other elements you might need
  headerBoardName: document.getElementById('header-board-name'),
  // Add more elements as needed
};*/

//get elements from DOM

const elements = {
  // Sidebar elements
  hideSideBarBtn: document.getElementById('hide-side-bar-btn'),
  showSideBarBtn: document.getElementById('show-side-bar-btn'),
  sideBarDiv: document.getElementById('side-bar-div'),

  // Theme elements
  themeSwitch: document.getElementById('switch'),

  // Add new task modal elements
  createNewTaskBtn: document.getElementById('add-new-task-btn'),
  modalWindow: document.getElementById('new-task-modal-window'),
  filterDiv: document.getElementById('filterDiv'),

  // Edit task modal elements
  editTaskModal: document.querySelector('.edit-task-modal-window'),

  // Other elements
  headerBoardName: document.getElementById('header-board-name'),
  dropdownBtn: document.getElementById('dropdownBtn'),
  editBoardBtn: document.getElementById('edit-board-btn'),
  deleteBoardBtn: document.getElementById('deleteBoardBtn'),
  threeDotsIcon: document.getElementById('three-dots-icon'),
  todoDot: document.getElementById('todo-dot'),
  doingDot: document.getElementById('doing-dot'),
  doneDot: document.getElementById('done-dot'),
};

let activeBoard = ""; // Initialize activeBoard variable with an empty string
// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    // Parse the value of localStorageBoard
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    // Correctly assign activeBoard using ternary operator
    activeBoard = localStorageBoard !== null ? localStorageBoard : boards[0];
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}
// Creates different boards in the DOM
// TASK: Fix Bugs
//there are more bugs 0-0
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener('click', () => { // Changed click() to addEventListener('click', ...)
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; // Assigns active board
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
  const filteredTasks = tasks.filter(task => task.board === boardName); // Use comparison operator (===) instead of assignment operator (=)

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => { // Use comparison operator (===) instead of assignment operator (=)
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener('click', () => { // Corrected syntax for click event listener
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}
// Function to refresh the tasks UI based on the active board
function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard); // Call the filterAndDisplayTasksByBoard function with the active board parameter
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  // Syntax Error: 'forEach' method is misspelled as 'foreach'
  document.querySelectorAll('.board-btn').forEach(btn => { 
    if (btn.textContent === boardName) {
      btn.add('active'); // Syntax Error: Should be btn.classList.add('active')
    } else {
      btn.remove('active'); // Syntax Error: Should be btn.classList.remove('active')
    }
  });
}

function addTaskToUI(task) {
  // Syntax Error: Incorrect usage of string interpolation, should use backticks instead of single quotes
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
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(); // Syntax Error: Should be tasksContainer.appendChild(taskElement);
}

function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => toggleModal(false, elements.editTaskModal)); // Syntax Error: Missing parentheses

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
  elements.hideSideBarBtn.addEventListener('click', () => toggleSidebar(false)); // Syntax Error: Missing parentheses
  elements.showSideBarBtn.addEventListener('click', () => toggleSidebar(true)); // Syntax Error: Missing parentheses

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit',  (event) => {
    addTask(event)
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  // Syntax Error: Incorrect usage of ternary operator, should use '?' and ':' instead of '=>' and ';'
  modal.style.display = show ? 'block' : 'none'; 
}
/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/



function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
    const task = {
      
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


function toggleSidebar(show) {
  const sideBarDiv = document.getElementById('side-bar-div');
  const showSideBarBtn = document.getElementById('show-side-bar-btn');

  if (show) {
    sideBarDiv.style.display = 'block';
    showSideBarBtn.style.display = 'none'; // Hide the button to show sidebar
    localStorage.setItem('showSideBar', 'true');
  } else {
    sideBarDiv.style.display = 'none';
    showSideBarBtn.style.display = 'block'; // Show the button to show sidebar
    localStorage.setItem('showSideBar', 'false');
  }
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle('light-theme');
  const isLightTheme = body.classList.contains('light-theme');
  localStorage.setItem('light-theme', isLightTheme ? 'enabled' : 'disabled');
}


function openEditTaskModal(task) {
  // Set task details in modal inputs
  const editTaskTitleInput = document.getElementById('edit-task-title-input');
  const editTaskDescInput = document.getElementById('edit-task-desc-input');
  const editSelectStatus = document.getElementById('edit-select-status');

  editTaskTitleInput.value = task.title;
  editTaskDescInput.value = task.description;
  editSelectStatus.value = task.status;

  // Get button elements from the task modal
  const saveChangesBtn = document.getElementById('save-task-changes-btn');
  const deleteTaskBtn = document.getElementById('delete-task-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');

  // Call saveTaskChanges upon click of Save Changes button
  saveChangesBtn.addEventListener('click', () => {
    saveTaskChanges(task.id);
    toggleModal(false, elements.editTaskModal); // Close the edit task modal
  });

  // Delete task using a helper function and close the task modal
  deleteTaskBtn.addEventListener('click', () => {
    deleteTask(task.id);
    toggleModal(false, elements.editTaskModal); // Close the edit task modal
  });

  // Close the modal when the cancel button is clicked
  cancelEditBtn.addEventListener('click', () => {
    toggleModal(false, elements.editTaskModal); // Close the edit task modal
  });

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  const editTaskTitleInput = document.getElementById('edit-task-title-input').value;
  const editTaskDescInput = document.getElementById('edit-task-desc-input').value;
  const editSelectStatus = document.getElementById('edit-select-status').value;

  // Create an object with the updated task details
  const updatedTask = {
    id: taskId,
    title: editTaskTitleInput,
    description: editTaskDescInput,
    status: editSelectStatus,
  };

  // Update task using a helper function
  patchTask(taskId, updatedTask);

  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal);
  refreshTasksUI();
}
/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}