const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

loadEventListeners();

function loadEventListeners(){
    document.addEventListener('DOMContentLoaded', getExistingTasks);//Get existing tasks
    form.addEventListener('submit', addTask);
    taskList.addEventListener('click', removeTask);
    clearBtn.addEventListener('click', clearAllTasks);
    filter.addEventListener('keyup', filterTasks);
}

function addTask(e){
    if(taskInput.value === ''){
        alert('Please add a task');
    }else{
        createLiElement(taskInput.value);
        storeTaskInLocalStorage(taskInput.value);//Store task in local storage
        taskInput.value = '';//Clear input
    }

    e.preventDefault();
}
function createLiElement(textContentValue = ''){
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.appendChild(document.createTextNode(textContentValue));
    const link = document.createElement('a');
    link.className = 'delete-item secondary-content';
    link.innerHTML = '<i class="fa fa-remove"></i>';
    li.appendChild(link);
    taskList.appendChild(li);
}

function removeTask(e){
    if(e.target.parentElement.classList.contains('delete-item')){
        if(confirm('Are you sure?')){
            e.target.parentElement.parentElement.remove();
            removeATaskFromLocalStorage(e.target.parentElement.parentElement);
        }
    }
}

function removeATaskFromLocalStorage(taskItem){
    let tasks = getLocalStorageValue('tasks');
    tasks.forEach(function(task, index){
        if(taskItem.textContent === task){
            tasks.splice(index, 1);
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearAllTasks(){
    while(taskList.firstChild){
        taskList.removeChild(taskList.firstChild);
    }
    localStorage.clear();
}

function filterTasks(e){
    const text = e.target.value.toLowerCase();
    
    document.querySelectorAll('.collection-item').forEach(function(task){
        const itemText = task.firstChild.textContent.toLowerCase();
        if(itemText.indexOf(text) === -1){
            task.style.display = 'none';
        }else{
            task.style.display = 'block';
        }
    });
}

function storeTaskInLocalStorage(task){
    let tasks = getLocalStorageValue('tasks');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
}

function getExistingTasks(){
    let tasks = getLocalStorageValue('tasks');
    tasks.forEach(function(task){
        createLiElement(task);
    });
}

function getLocalStorageValue(itemKey){
    let itemValue = [];
    const localItemValue = localStorage.getItem(itemKey);
    if(localItemValue){
        itemValue = JSON.parse(localItemValue);
    }
    return itemValue;
}

//Handle duplicate task condition