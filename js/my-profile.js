let userForm = document.getElementById('formUser');
let fotito = [];//variable a la cual voy a agregar la foto que voy a enviar al localStorage
const fileReader = new FileReader();

//evento de escucha en el form para validar los campos
userForm.addEventListener('submit', (e) => {
//si el formulario no esta validado entonces proporciono
//prevent default y stopPropagation

    if (!userForm.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();

    } else {
        //si esta validado entonces ejecuto la funcion de envio al local y la del feedback al usuario
        alertaUsuarioValidado();
        guardarInfoUsuario();
    }
//valido el formulario con el feedback en sus campos
    userForm.classList.add('was-validated');
    e.preventDefault();
})

function eviarFoto() {
//funcion para cargar el archivo de la foto en un array
    let archivo = document.getElementById("subirArchivo");

    fileReader.readAsDataURL(archivo.files[0]);
    fileReader.onloadend = function (event) {

        let img = event.target.result;


        //condicional para el caso en el que se repita, sobreescribirla
        if (fotito.length === 0) {
            fotito.push(img);
        }
        else {
            fotito.splice(0, 1);
            fotito.push(img);
        }
        console.log('entro la foto');

    }
}

function guardarInfoUsuario() {
    //traigo los campos del almacenamiento local del del input del cargar archivo

    let subirArchivo = document.getElementById('subirArchivo');
    let usuariosGenerales = JSON.parse(localStorage.getItem('usuarios'));
    let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

//la foto solo se enviara solo en caso de que el input tipo archivo contenga valor
    if (subirArchivo.value != "" ) { eviarFoto() } 

//realizo un setTimeout para esperar a que se cargue la foto en el array 

    setTimeout(() => {
        let primerNombre = document.getElementById('primerNombre').value;
        let segundoNombre = document.getElementById('segundoNombre').value
        let primerApellido = document.getElementById('primerApellido').value
        let segundoApellido = document.getElementById('segundoApellido').value
        let telefono = document.getElementById('telefonoContacto').value

//utilizo un for para recorrer toda la lista de usuarios distintos que se registraron
//el que coincida con el que esta activo entonces es en ese objeto en el cual voy a almacenar mi objeto
       for (usuario of usuariosGenerales) {
        if (usuario.nombreUsuario === usuarioActivo) {

       //tomo los valores de los campos de los input llenados y se los paso como atributo a un objeto.
       let informacionUsuario = {
            "primerNombre": primerNombre,
            "segundoNombre": segundoNombre,
            "primerApellido": primerApellido,
            "segundoApellido": segundoApellido,
            "telefono": telefono
        }
    //si el array que contiene la foto contiene valor entonces se lo voy a agregar como propiedad al objeto
        if (fotito.length != "") {
            informacionUsuario.fotoDePerfil = fotito
        }
        //si esto no ocurre, entonces el campo esta vacio,
        // pero si en el almacenamiento local existe un valor antiguamente ingresado 
        //entonces va a ser ese el valor que voy a agregar como propiedad del objeto
        else if (usuario.infoPerfil != null) {
            informacionUsuario.fotoDePerfil = usuario.infoPerfil.fotoDePerfil
        }
        // en cualquier caso envio mi objeto al usuario especifico
            usuario.infoPerfil = informacionUsuario
            localStorage.setItem('usuarios', JSON.stringify(usuariosGenerales))
            console.log('mando al local storage')

        }
    }
      
    }, 400);

    
}

function alertaUsuarioValidado() {
    document.getElementById("alertaPerfil").classList.remove("fade");
    setTimeout(() => {
        document.getElementById("alertaPerfil").classList.add("fade");
        location.reload();
    }, 1500);

}

function MostrarInfoUser() {

    
    let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    let usuariosGenerales = JSON.parse(localStorage.getItem('usuarios'));

    //si lo que se encuentra en el localStorage del usuarioActivo existe 
    //entonces que ese valor tome el valor del input email
    if (usuarioActivo != null) {document.getElementById('email').value = usuarioActivo;}
        
    

    if (usuariosGenerales != null) {
//repito el procedimiento de verificar el usuario en el que me encuentro pero esta vez para traer la informacion
 
        for (usuario of usuariosGenerales) {
            if (usuario.nombreUsuario === usuarioActivo) {

                if(usuario.infoPerfil!=""){
                    //si el usuario contiene valor entonces accedo a sus propiedades 
                    //y las muestro en el valor de los input correspondientes
                document.getElementById('primerNombre').value = usuario.infoPerfil.primerNombre
                document.getElementById('segundoNombre').value = usuario.infoPerfil.segundoNombre;
                document.getElementById('primerApellido').value = usuario.infoPerfil.primerApellido;
                document.getElementById('segundoApellido').value = usuario.infoPerfil.segundoApellido;
                document.getElementById('telefonoContacto').value = usuario.infoPerfil.telefono;

                if (usuario.infoPerfil.fotoDePerfil != "" && usuario.infoPerfil.fotoDePerfil!=null) {
                    document.getElementById('mostrarFoto').src = usuario.infoPerfil.fotoDePerfil;
                }
                }
               
            }
        }
    }



}
document.addEventListener('DOMContentLoaded', () => {
    MostrarInfoUser()
})


