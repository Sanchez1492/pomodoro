const tasksList = [];

let timeCounter = 0;
let timer = null;
let timerBreak = null;
let currentTask = null;

const bAdd = document.querySelector('#addButton')
const itTask = document.querySelector('#itTask')
const form = document.querySelector('.form')
const taskName = document.querySelector('#time #taskName')

renderTime();
renderTasks();

//Funcion para que cuando haga click en el boton de submit, me devuelva el value puesto en el formulario para poder trabajar con la función createTask. Luego de que se cree la tarea con la linea siguiente ponemos que se limpie el formulario por si se quiere asignar una nueva tarea.

form.addEventListener('submit', e => {
    e.preventDefault(); //anulamos el funcionamiento nativo del formulario

    if(itTask.value != '') {
        createTask(itTask.value);
        itTask.value = ''; //Esta linea es para que una vez que pongamos agregar, el formulario quede vacio
        renderTasks(); //renderizar quiere decir generar una salida visual a partir de una entrada de datos. Una vez que ingresamos al arreglo un nuevo elemento, tenemos que renderizar las tareas.
    }
})

//Esta funcion crea un objeto a partir  del valor ingresado por el usuario para poder trabajarlo posteriormente

function createTask (value) {
    const newTask = {
        id: (Math.random() * 1000).toString(36).slice(3),
        title: value,
        completed: false
    };

    tasksList.unshift(newTask) // Agregamos el valor ingresado por el usuario al arreglo de tasksList
}

//Con la siguiente función le inyectamos código al archivo HTML para que se pueda ver en el documento, a partir de los datos obtenidos en la función createTask   

function renderTasks() {
    const html = tasksList.map((task) => {
        return `
            <div class="task">
                <div class="completed">${
                    task.completed
                    ? `<span class="done">Done</span>`
                    :`<button class="start-button" data-id="${task.id}">Start</button>`}</div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });

    const tasksContainer = document.querySelector('#tasks'); //etiqueta vacia de html
    tasksContainer.innerHTML = html.join('')
    //El método map me va a retornar un arreglo de strings con los elementos expresados en la variable html

    const startButtons = document.querySelectorAll('.task .start-button')

    startButtons.forEach(button => {
        button.addEventListener('click', e => {
            if(!timer) {
                const id = button.getAttribute('data-id')
                startButtonHandler(id)
                button.textContent = 'In progress..'
            }
        })
    })
}

//Vamos a calcular los 25 miuntos de la actividad principal
function startButtonHandler(id) {
    timeCounter = 5; //Formato de tiempo
    currentTask = id;
    const taskIndex = tasksList.findIndex(task => task.id === id)
    taskName.textContent = tasksList[taskIndex].title
    renderTime();

    timer = setInterval(() => {
        timerHandler(id)
    }, 1000);

    //setInterval me permite ejecutar una función de manera indefinida, hasta que yo la detenga. setTimeout, por otra parte, solo me permite ejecutar una función después de cierto tiempo.
}

//Ahora definimos la función que va a hacer que time disminuya en 1 segundo

function timerHandler(id) {
    timeCounter--;
    renderTime();

    if(timeCounter === 0) {
        clearInterval(timer);
        isTaskCompleted(id)
        timer = null;
        renderTasks()
        startBreak()
    }
}

function startBreak() {
    timeCounter = 5
    taskName.textContent = 'Break'
    renderTime();
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000)
}

function timerBreakHandler () {
    timeCounter--;
    renderTime();

    if(timeCounter === 0) {
        clearInterval(timerBreak);
        currentTask = null;
        taskName.textContent = '';
        renderTasks();
        timer = null
    }
}

function renderTime() {
    const timeDiv = document.querySelector('#time #value')
    const minutes = parseInt(timeCounter/60);
    const seconds = parseInt(timeCounter%60)

    timeDiv.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

function isTaskCompleted(id) {
    const taskIndex = tasksList.findIndex(task => task.id === id);
    tasksList[taskIndex].completed = true;
}