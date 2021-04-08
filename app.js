const formulario = document.getElementById('formulario')
const listaTarea = document.getElementById('lista-tareas')
const templateTarea = document.getElementById('template-tarea').content
const inputNombre = document.getElementById('input-nombre')
const inputDescp = document.getElementById('input-descp')

const fragment = document.createDocumentFragment()

let tareas = {}


formulario.addEventListener('submit', e => {
    e.preventDefault()
    setTarea(e)
})

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('tareas')){
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    pintarTareas()
})

listaTarea.addEventListener('click', e => {
    btnAccion(e)
})

const setTarea = e => {
    if(inputNombre.value.trim() === ''|| inputDescp.value.trim() === ''){
        console.log('Esta vacio')
        return
    }

    const tarea = {
        id: Date.now(),
        texto: inputNombre.value,
        descripcion: inputDescp.value,
        estado: false
    }
    tareas[tarea.id] = tarea
    console.log(tareas)

    formulario.reset()
    inputNombre.focus()
    pintarTareas()
}

const pintarTareas = () => {

    localStorage.setItem('tareas',JSON.stringify(tareas))

    if (Object.values(tareas).length === 0) {
        listaTarea.innerHTML = `
        <div class="alert alert-dark text-center">
        Sin tareas! 
        </div>
        `
        return
    }

    listaTarea.innerHTML = ''
    Object.values(tareas).forEach(tarea => {
        const clone = templateTarea.cloneNode(true)
        clone.querySelector('#nombre').textContent = tarea.texto
        clone.querySelector('#descp').textContent = tarea.descripcion

        if(tarea.estado){
            clone.querySelector('.alert').classList.replace('alert-warning','alert-primary')
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle','fa-redo')
            clone.querySelector('#nombre').style.textDecoration = 'line-through'
            clone.querySelector('#descp').style.textDecoration = 'line-through'

        }
        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id

        fragment.appendChild(clone)
    })
    listaTarea.appendChild(fragment)
}

const btnAccion = e => {
    if(e.target.classList.contains('fa-check-circle')) {
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
    }

    if(e.target.classList.contains('fa-minus-circle')) {
        delete tareas[e.target.dataset.id]
        pintarTareas()
    }

    if(e.target.classList.contains('fa-redo')) {
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
    }

    e.stopPropagation()

}