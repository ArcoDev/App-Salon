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

    //Almacena el nombre de la ciat del objeto
    nombreCita();

    //Almacena el nombre de la ciat del objeto
    fechaCita();

    // Almacena la hora de la cita en el objeto
    horaCita();

    //Deshabilita dias pasados en el calendario
    deshabilitarFechaAnterior();

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


    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');
        //travesint del dom (recorrer el dom)
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        //console.log(servicioObj);
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const {
        servicios
    } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj) {
    const {
        servicios
    } = cita;
    //con los 3 puntos, copiamos el arreglo y le pasamos la informacion al nuevo objeto
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);

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

    if (pagina == 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina == 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen(); //Se mostrar resumen con los datos almacenados en el objeto cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); //Cambia la seccion que se muestra, por la de la pagina actual
}

function mostrarResumen() {

    //Destructirung extarer la informacion del objeto
    const {
        nombre,
        fecha,
        hora,
        servicios
    } = cita;

    //Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpia el html previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //validacion para saber si el objeto esta vacio, extraer los valores del objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        //Agregar a resumen div
        resumenDiv.appendChild(noServicios);
    } else {
        //Mostrar en el html los datos guardados en el onjeto cita
        const nombreCita = document.createElement('P');
        nombreCita.innerHTML = `<span>Nombre: </span>${nombre}`;
        const fechaCita = document.createElement('P');
        fechaCita.innerHTML = `<span>Fecha: </span>${fecha}`;
        const horaCita = document.createElement('P');
        horaCita.innerHTML = `<span>Hora: </span>${hora}`;
        
        const headingCita = document.createElement('H3');
        headingCita.textContent = 'Resumen de Cita';

        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');

        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen de servicios';

        serviciosCita.appendChild(headingServicios);

        let cantidad = 0;

        //Iterar sobre al arreglo de servicios
        servicios.forEach(servicio => {
            const {nombre, precio} = servicio
            
            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');
            
            const textoServicio = document.createElement('P');
            textoServicio.textContent = nombre;
            
            const precioServicio = document.createElement('P');
            precioServicio.textContent = precio;
            precioServicio.classList.add('precio-servicio');
            
            //separar el signo de pesos y convertir el string a numerico
            const totalServicio = precio.split('$');
            cantidad += parseInt(totalServicio[1].trim());

            //colocar nombre y precio en el div
            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);
            serviciosCita.appendChild(contenedorServicio);
        });

        resumenDiv.appendChild(headingCita);
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);
        resumenDiv.appendChild(serviciosCita);

        const cantidadPagar = document.createElement('P');
        cantidadPagar.classList.add('total');
        cantidadPagar.innerHTML = `<span>Total a pagar: </span>$ ${cantidad}`;
        
        resumenDiv.appendChild(cantidadPagar);
    }
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', evento => {
        //trim elimina los espacios en blanco de inicio y final
        const nombreTexto = evento.target.value.trim();
        //validacion de que el nombre no este validacion
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('No valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {
    //Si hay una alerta previa, no crear mas alertas
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }
    //Creacion del div con sus clases y mensjae de error
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    //Insertar en el formulario el div con la alerta 
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if ([0].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Domingo no se trabaja', 'error');
        } else {
            cita.fecha = fechaInput.value;
        }

        /* Con esta opcion, nos permite traducir el nombre de la fecha en español
        const opciones = {
            weekday: 'long',
            year: 'numeric',
            month: 'long'
        }
        console.log(dia.toLocaleDateString('es-ES', opciones));*/
    });
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');


    fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    let mes = fechaAhora.getMonth() + 1;
    let dia = fechaAhora.getDate() + 1;

    //formato deseado 2021-02-22 (AAAA-MM-DD)
    let fechaDehabilitar = `${year}-${mes}-${dia}`;

    if (mes < 10) {

        fechaDehabilitar = `${year}-0${mes}-${dia}`;
    }
    if (dia < 10) {

        fechaDehabilitar = `${year}-${mes}-0${dia}`;
    }

    inputFecha.min = fechaDehabilitar;

}

function horaCita() {
    // Recuperamos la Hora
    const inputHora = document.querySelector('#hora');

    // Escuchamos cuando se modifica la hora
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        // Creamos un Array hora[0]= Hora, hora[1] = Minutos
        const hora = horaCita.split(':');

        // Validación, solo se permiten citas entre las 10h y las 18h
        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            // Guardamos la Hora en el objeto Cita
            cita.hora = horaCita;
            console.log(cita);
        }
    });
}