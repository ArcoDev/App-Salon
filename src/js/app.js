//variables globales 
let pagina = 1;
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}
document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    //Resalta el div actual segun el tab al que se presiona
    mostrarSeccion();

    //Oculta o mustra seccion segun el tab al que se presiona
    cambiarSeccion();

    //Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprobar la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //Muestra el resumen de la cita o el mensaje de error en caso de que no pase la validacion
    mostrarResumen();

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
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }
    //console.log(elemento.dataset.idServicio);
    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }
    //elemento.classList.toggle('seleccionado');
}

function mostrarSeccion() {

    //ELiminar mostrar-seccion, de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    //Seccion actual en la aplicacion
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    //Resalta el tab actual 
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        });
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();

    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina == 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina == 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); //Cambia la seccion que se muestra, por la de la pagina actual
}
function mostrarResumen() {
    
    //Destructirung extarer la informacion del objeto
    const { nombre, fecha, hora, servicios } = cita;
    
    //Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');
    //validacion para saber si el objeto esta vacio, extraer los valores del objeto
    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        //Agregar a resuemn div
        resumenDiv.appendChild(noServicios);
    }

}