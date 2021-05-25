document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();
}
async function mostrarServicios() {
    try {
        //Utilizar fecth API para extraer informacion de los servicios del json
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {
            servicios
        } = db;

        //Generar el HTML 
        servicios.forEach(servicios => {
            const {
                id,
                nombre,
                precio
            } = servicios;

            //DOM scripting

            //Nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Precio del servicio 
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`; //Template string
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor del servicio
            const servicioDIV = document.createElement('DIV');
            servicioDIV.classList.add('servicio');
            servicioDIV.dataset.idServicio = id;
            
            
            //Seleccionar un servicio para la cita y marcarlo con event handler
            servicioDIV.onclick = seleccionarServicio;

            //inyectar nombre y precio al div
            servicioDIV.appendChild(nombreServicio);
            servicioDIV.appendChild(precioServicio);

            //Inyectar en el HTML los servicios 
            document.querySelector('#servicios').appendChild(servicioDIV);
            
        });
    } catch (error) {
        console.log(error);
    }
}
function seleccionarServicio(e) {
    let elemento;
    //Forzar que el elemento al cual le damos click sea el div
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }
    //console.log(elemento.dataset.idServicio);
    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }
    //elemento.classList.toggle('seleccionado');
}