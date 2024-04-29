// TASK: import initialData

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true');
  } else {
    console.log('Data already exists in localStorage');
  }
}

// TASK: Get elements from the DOM
const elements = {
  headerBoardName: document.getElementById('header-board-name')
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
    activeBoard = localStorageBoard ? localStorageBoard : boards[0]; 
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => {
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; // assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard);
    });
    boardsContainer.appendChild(boardElement);
  });
}

function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Adds a task to the UI
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
}
  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  tasksContainer.appendChild(taskElement);

// Sets up event listeners for the application
function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => {
    toggleModal(false, elements.editTaskModal);
  });

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', (event) => {
    if (event.target === elements.filterDiv) {
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
    }
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener('click', () => {
    toggleSidebar(false);
  });
  elements.showSideBarBtn.addEventListener('click', () => {
    toggleSidebar(true);
  });

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit', (event) => {
    addTask(event);
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none';
}


/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

// Adds a new task to the application
function addTask(event) {
  event.preventDefault();

  // Assign user input to the task object
  const task = {
    title: event.target.elements.title.value,
    description: event.target.elements.description.value,
    status: 'todo',
    board: JSON.parse(localStorage.getItem('activeBoard'))
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

// Toggles the sidebar visibility
function toggleSidebar(show) {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.display = show ? 'block' : 'none';
}

// Toggles the theme between light and dark
function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
}




// Opens the edit task modal and sets task details
function openEditTaskModal(task) {
  // Set task details in modal inputs
  elements.editTaskModal.elements.title.value = task.title;
  elements.editTaskModal.elements.description.value = task.description;

  // Get button elements from the task modal
  const saveChangesBtn = elements.editTaskModal.querySelector('#save-changes-btn');
  const deleteTaskBtn = elements.editTaskModal.querySelector('#delete-task-btn');

  // Call saveTaskChanges upon click of Save Changes button
  saveChangesBtn.addEventListener('click', () => {
    const updatedTask = {
      id: task.id,
      title: elements.editTaskModal.elements.title.value,
      description: elements.editTaskModal.elements.description.value,
      status: task.status,
      board: task.board
    };
    saveTaskChanges(updatedTask);
    toggleModal(false, elements.editTaskModal); // Close the edit task modal
  });

  // Delete task using a helper function and close the task modal
  deleteTaskBtn.addEventListener('click', () => {
    deleteTask(task.id);
    toggleModal(false, elements.editTaskModal); // Close the edit task modal
  });

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}


// Saves changes to a task
function saveTaskChanges(updatedTask) {
  // Get new user inputs
  const newTitle = elements.editTaskModal.elements.title.value;
  const newDescription = elements.editTaskModal.elements.description.value;

  // Create an object with the updated task details
  const updatedTaskDetails = {
    id: updatedTask.id,
    title: newTitle,
    description: newDescription,
    status: updatedTask.status,
    board: updatedTask.board
  };

  // Update task using a helper function
  updateTask(updatedTaskDetails);

  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal); // Close the edit task modal
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
