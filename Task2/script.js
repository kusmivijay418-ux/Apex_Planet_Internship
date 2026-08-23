const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const errorMessage = document.getElementById("errorMessage");
const emptyState = document.getElementById("emptyState");

const clearCompleted = document.getElementById("clearCompleted");

const heroCompleted = document.getElementById("heroCompleted");
const heroProgress = document.getElementById("heroProgress");
const heroMessage = document.getElementById("heroMessage");


// =================================
// LOAD TASKS FROM LOCAL STORAGE
// =================================

let tasks = JSON.parse(localStorage.getItem("skillForgeTasks")) || [];


// =================================
// SAVE TASKS TO LOCAL STORAGE
// =================================

function saveTasks() {
    localStorage.setItem("skillForgeTasks", JSON.stringify(tasks));
}


// =================================
// ADD TASK
// =================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Validation
    if (taskText === "") {

        errorMessage.textContent =
            "Please enter a task before adding it.";

        taskInput.focus();

        return;
    }

    if (taskText.length < 3) {

        errorMessage.textContent =
            "Task must contain at least 3 characters.";

        taskInput.focus();

        return;
    }

    errorMessage.textContent = "";

    // Create task object
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    displayTasks();

    taskInput.value = "";
    taskInput.focus();

});


// =================================
// DISPLAY TASKS
// =================================

function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `

            <div class="task-check">
                <i class="fa-solid fa-check"></i>
            </div>

            <span class="task-text"></span>

            <button class="delete-btn" title="Delete task">
                <i class="fa-solid fa-trash"></i>
            </button>

        `;

        // Prevent HTML injection
        li.querySelector(".task-text").textContent = task.text;


        // =================================
        // COMPLETE TASK
        // =================================

        li.querySelector(".task-check")
            .addEventListener("click", function() {

                task.completed = !task.completed;

                saveTasks();

                displayTasks();

            });


        // =================================
        // DELETE TASK
        // =================================

        li.querySelector(".delete-btn")
            .addEventListener("click", function() {

                tasks = tasks.filter(function(item) {
                    return item.id !== task.id;
                });

                saveTasks();

                displayTasks();

            });


        taskList.appendChild(li);

    });

    updateTaskInformation();

}


// =================================
// UPDATE INFORMATION
// =================================

function updateTaskInformation() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;


    // Task counter

    if (total === 1) {

        taskCount.textContent = "1 task";

    } else {

        taskCount.textContent =
            `${total} tasks`;

    }


    // Empty state

    if (total === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    // Progress percentage

    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round((completed / total) * 100);

    }


    heroCompleted.textContent = completed;

    heroProgress.style.width =
        percentage + "%";


    // Progress message

    if (total === 0) {

        heroMessage.textContent =
            "Start by adding your first task.";

    } else if (completed === total) {

        heroMessage.textContent =
            "Amazing! All tasks completed.";

    } else if (completed > 0) {

        heroMessage.textContent =
            "Great progress! Keep going.";

    } else {

        heroMessage.textContent =
            "You have tasks waiting for you.";

    }

}


// =================================
// CLEAR COMPLETED
// =================================

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();

    displayTasks();

});


// =================================
// INITIAL LOAD
// =================================

displayTasks();