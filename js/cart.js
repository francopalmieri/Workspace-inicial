//variable global que me permite trasladar los objetos de mi carrito de un lugar a otro.
let listaElementos = [];

//variable global de la suma de los subtotales individuales
let todoUSD = [];

//variables definidas que funcionan como alternadores
let costoAlternar = [];

//esta variable funciona para alternar entre el nombre 
//que muestro en pantalla del metodo de pago seleccionado
let metodoAlternar = [];

//esta variable funciona para validar 
//la cantidad del producto luego de enviado el formulario
let minimoCantidadProducto = [];


//introducir punto cada tres cifras
function convertir(numero) {
  //se convierte el numero a cadena con +"" en numero 
  numero = numero + "";
  //convertimos la cadena en un array de caracteres con split("")
  //e invertimos el array con reverse() poniendo todo en un nuevo array del numero       
  var numeroArray = numero.split("").reverse();
  //en la cadena vacia nuevoNumero se pondra el nuevo numero convertido
  var nuevoNumero = "";

  //con esto recorremos el array (numeroArray.length = tamaño del numero)
  for (i = 0; i < numeroArray.length; i++) {
    //cada vez que el indice sea multiplo de 3 distinto de 0 agregamos un punto
    if (i % 3 == 0 && i != 0)
      nuevoNumero = "." + nuevoNumero;
    //concatenamos cada elemento a la cadena nuevoNumero para formar el nuevo numero
    nuevoNumero = numeroArray[i] + nuevoNumero;
  }
  //enviar el nuevo numero
  return nuevoNumero;
}

//DESAFIATE 6

function eliminarProdCart(id) {//funcion que toma como parametro la id del producto al cual estoy seleccionando

  let usuariosEnLocal = JSON.parse(localStorage.getItem('usuarios'));
  let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  for (usuario of usuariosEnLocal) {
    if (usuario.nombreUsuario === usuarioActivo) {

  //recorro los elementos del array para que me devuelva la posicion de aquel que incluya el id que le estoy proporcionanado
  //tanto para el array del formato de los productos como para sus propios objetos 

  let eliminarDelArray = listaElementos.findIndex(element => element.includes(id));
  let eliminarDelAlmacenamiento = usuario.enCarrito.findIndex(element => element.id === id);

  //utilizo el metodo splice() para eliminar la posicion ya establecida de mi array en los dos casos 
  listaElementos.splice(eliminarDelArray, 1);
  usuario.enCarrito.splice(eliminarDelAlmacenamiento, 1);

  //actualizo el almacenamiento local mandandole el array de objetos modificado. 
  localStorage.setItem('usuarios', JSON.stringify(usuariosEnLocal));

  //actualizo lo que veo en pantalla con el metodo join para sustituir las comas .

  document.getElementById('verObjetoCarrito').innerHTML = listaElementos.join('');



//condicional para redirigiar al index en caso
  // de que no exista un producto en el carrito
  if (usuario.enCarrito.length === 0) { window.location = 'index.html'; }
 }
}
  
  // llamo a la funcion conversionUSD para verificar si debo convertirlo a usd en el subtotal o no
  conversionUSD();
  //ejecuto el tipo de envio respecto al numero especifico de esa variable general
  alternarCostoEnvio();

  location.reload()
}

//funcion que redirije al producto al apretar en su imagen
function redirigirProductos(id) {
  localStorage.setItem('productID', id);
  window.location.href = "product-info.html";
}

//Recorro el array de objetos y creo la estructura que voy a mostrar en mi pagina

function verMiObjetoCarrito() {

  let usuariosEnLocal = JSON.parse(localStorage.getItem('usuarios'));
  let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  for (usuario of usuariosEnLocal) {
    if (usuario.nombreUsuario === usuarioActivo) {

      if (usuario.enCarrito.length === 0) { window.location = 'index.html'; }

      // Para cada elemento del carrito
      // Multiplico el precio por la cantidad 
      // Lo almaceno para insertarlo en el subtotal dirigido al producto y en el total dirigido al general
      // Introduzco el formato html a una variable concatenado los atributos del objeto
      // Agrego ese elemento a una lista
      // imprimo la lista en pantalla
      // imprimo el total en pantalla

      for (let elemento of usuario.enCarrito) {

        let subtotal = elemento.cost * elemento.cantidad;

        let elementoCarrito = `
    <div class="mt-3 list-group-item contenedor-carrito">
    <div class="row justify-content-around align-items-center" id="valoresProductos">  
    <div class="col-2">
        <a onclick="redirigirProductos(${elemento.id})"><img width="150" height="100" class="img-thumbnail cursor-active" src="${elemento.image}" alt=""></a>
    </div>
    <div class="col-2"><a href="#" class="btn-product" onclick="redirigirProductos(${elemento.id})">${elemento.name}</a></div>
    <div class="col-2 lugarPrecio"> ${elemento.currency} ${convertir(elemento.cost)}</div>
    <div class="col-2"><input type="number" class="cantidad-producto cantidadDelProducto p-0 m-0" oninput="subtotalProducto(${elemento.id})"
     value="${elemento.cantidad}" step="1" onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" min="1" autocomplete="off" required></div>
    <div class="col-2 subtotalProducto"> ${elemento.currency} ${convertir(subtotal)}</div>
    <div class="col-2"><a onclick="eliminarProdCart(${elemento.id})"><i class="text-danger fas fa-trash fa-lg cursor-active"></i></a></div>
    </div>
    </div>`;

        listaElementos.push(elementoCarrito);
      }

      document.getElementById('verObjetoCarrito').innerHTML += listaElementos.join(' ');


    }
  }
}

//funcion que se ejecuta cuando pulso sobre el campo de cantidad del producto.
// esta funcion trae la id de ese producto.
// luego trae el contenido del carrito.
function subtotalProducto(id) {

  /*
   Recorro los elementos,
   si la id proporcionada coincide con la del de elemento, 
   entonces sobreescribo el valor de la cantidad del objeto
   por el valor del input.
   Lo actualizo en el almacenamiento
   Multiplico cantidad del valor del input por la del precio del objeto 
   en el que estoy y lo imprimo en pantalla
   verifico que la cantidad de ese campo no sea menor a 1 
   y modifico una variable a un numero para usarla como alternador 
   para validar ese campo proximamente
   */
  let usuariosEnLocal = JSON.parse(localStorage.getItem('usuarios'));
  let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  for (usuario of usuariosEnLocal) {
    if (usuario.nombreUsuario === usuarioActivo) {
      console.log('hola')

      for (let i = 0; i < usuario.enCarrito.length; i++) {
        let producto = usuario.enCarrito[i];
        if (producto.id === id) {
          producto.cantidad = document.getElementsByClassName('cantidadDelProducto')[i].value;

          localStorage.setItem('usuarios', JSON.stringify(usuariosEnLocal));
          if (producto.cantidad < 1 || producto.cantidad == '' || producto.cantidad == null || producto.cantidad == undefined) {
            minimoCantidadProducto = 2;
          } else { minimoCantidadProducto = 1; }

          let subtotalProducto = producto.cantidad * producto.cost;
          document.getElementsByClassName('subtotalProducto')[i].innerHTML = producto.currency + ' ' + convertir(subtotalProducto)
        }
      }

    }
  }
  conversionUSD();
  alternarCostoEnvio();
}

// SECCION TIPO DE ENVIO

//convierto mis objetos que tienen la moneda en UYU a USD
// haciendo la conversion
// ejecuto convertir para fijar un punto cada 3 cifras en el valor
function conversionUSD() {


  let usuariosEnLocal = JSON.parse(localStorage.getItem('usuarios'));
  let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  for (usuario of usuariosEnLocal) {
    if (usuario.nombreUsuario === usuarioActivo) {
      todoUSD = 0;

      for (let i = 0; i < usuario.enCarrito.length; i++) {
        let producto = usuario.enCarrito[i];
        if (producto.currency === "UYU") {

          todoUSD += Math.floor(producto.cantidad * (producto.cost / 41));
          document.getElementById('SubtotalGeneral').innerHTML = `USD ${convertir(todoUSD)}`

        } else {

          todoUSD += producto.cantidad * producto.cost;
          document.getElementById('SubtotalGeneral').innerHTML = `${producto.currency} ${convertir(todoUSD)}`
        }
      }
    }
  }
}

//funcion que alterna entre una funcion u otra dependiendo de una variable global
//cuando presiono subre el input de cantidad en el producto.
// esta funcion se ejecuta.
//dependiedo a que numero este igualada esa variable 
// es la funcion de tipo de envio que se va a ejecutar
function alternarCostoEnvio() {

  let usuariosEnLocal = JSON.parse(localStorage.getItem('usuarios'));
  let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  for (usuario of usuariosEnLocal) {
    if (usuario.nombreUsuario === usuarioActivo) {
      if (costoAlternar === 1) { costoEnvioPremium(); }
      else if (costoAlternar === 2) { costoEnvioExpress(); }
      else if (costoAlternar === 3) { costoEnvioStandard(); };
    }
  }
}

// cada una de estas funciones se ejecuta cuando presiono sobre su respectivo input radio
// mando al almacenamiento una id especifica de para guardar la posicion del campo seleccionado
// alterno esa posicion en una variable
// almaceno el precio del subtotal
// le saco el porcentaje especifico que require ese campo
// lo muestra en el pantalla al igual que la suma de ese porcentaje con el subtotal original.
function costoEnvioPremium() {
  localStorage.setItem('metodoEnvio', 1);
  costoAlternar = 1
  let subtotal = todoUSD;
  let costoEnvio = Math.floor((subtotal * 15) / 100);
  let total = (subtotal + Math.floor((subtotal * 15) / 100));
  document.getElementById('costoEnvio').innerHTML = 'USD' + ' ' + convertir(costoEnvio);
  document.getElementById('totalGeneral').innerHTML = 'USD' + ' ' + convertir(total);
}

function costoEnvioExpress() {
  localStorage.setItem('metodoEnvio', 2)
  costoAlternar = 2;
  let subtotal = todoUSD;
  let costoEnvio = Math.floor((subtotal * 7) / 100);
  let total = (subtotal + Math.floor((subtotal * 7) / 100));
  document.getElementById('costoEnvio').innerHTML = 'USD' + ' ' + convertir(costoEnvio);
  document.getElementById('totalGeneral').innerHTML = 'USD' + ' ' + convertir(total);
}

function costoEnvioStandard() {
  localStorage.setItem('metodoEnvio', 3)
  costoAlternar = 3;
  let subtotal = todoUSD;
  let costoEnvio = Math.floor((subtotal * 5) / 100);
  let total = (subtotal + Math.floor((subtotal * 5) / 100));
  document.getElementById('costoEnvio').innerHTML = 'USD' + ' ' + convertir(costoEnvio);
  document.getElementById('totalGeneral').innerHTML = 'USD' + ' ' + convertir(total);
}

// traigo la variable con el numero en el localstorage
// creo una condicional donde para cada numero especifico
// se ejecute esa funcion que guarde antes.
// le doy un checked a ese campo
function tipoEnvioLocalStorage() {
  let metodoSeleccionado = JSON.parse(localStorage.getItem('metodoEnvio'));

  if (metodoSeleccionado === 1) { costoEnvioPremium(), document.getElementById('cartPremium').checked = true }
  else if (metodoSeleccionado === 2) { costoEnvioExpress(), document.getElementById('cartExpress').checked = true }
  else if (metodoSeleccionado === 3) { costoEnvioStandard(), document.getElementById('cartStandard').checked = true }

}


//funcion que mediante una variable global muestra un tipo de pago u otro
function mostrarMetodoDePago() {

  if (metodoAlternar == 1) { document.getElementById('metodoSeleccionado').innerHTML = 'Tarjeta de Credito' }
  else if (metodoAlternar == 2) { document.getElementById('metodoSeleccionado').innerHTML = 'Transferencia Bancaria' };
}

// ------------------------------       SECCION VALIDACION DE CARRITO      ------------------------------------------ //

// si la cantidad de los productos es igual a 0 redirijo al index
// sino, valido que esa cantidad sea mayor a 1 para enviar el formulario
function validarCantProdCart() {

  let alertaCantidadProducto = document.getElementById('alertaCantidadProducto')

  let usuariosEnLocal = JSON.parse(localStorage.getItem('usuarios'));
  let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  for (usuario of usuariosEnLocal) {
    if (usuario.nombreUsuario === usuarioActivo) {

      if (usuario.enCarrito.length === 0) {
        window.location = "index.html";
        alert('primero debes agregar un producto');
        return false;
      }

      else if (minimoCantidadProducto == 2) {
        alertaCantidadProducto.innerHTML = 'La cantidad del producto debe ser valida';
        alertaCantidadProducto.style.color = 'red';
        return false;

      } else { alertaCantidadProducto.innerHTML = ''; return true };

    }
  }
}

//cuando presiono el boton del modal 
//mediante disable deshabilito todos los campos
document.getElementById('metodoDePago').addEventListener('click', () => {

  if (document.getElementById('tarjetaCredito').checked) {
    document.getElementById('numCuenta').disabled = true;

  } else if (document.getElementById('transferenciaBancaria').checked) {
    document.getElementById('numeroTarjeta').disabled = true;
    document.getElementById('codigoSeg').disabled = true;
    document.getElementById('tarjetaVencimiento').disabled = true;
  }

})

//cuando pulso sobre el campo de tarjeta de credito
//se me habilitan sus campos correspondientes
//se deshabilitan y se limpian los opuestos
//sucede lo mismo en la transferencia bancaria

function habilitarCampoModal() {

  document.getElementById('tarjetaCredito').addEventListener('click', () => {
    metodoAlternar = 1;
    document.getElementById('numeroTarjeta').disabled = false;
    document.getElementById('codigoSeg').disabled = false;
    document.getElementById('tarjetaVencimiento').disabled = false;
    document.getElementById('numCuenta').disabled = true;
    document.getElementById('numCuenta').value = '';
  })

  document.getElementById('transferenciaBancaria').addEventListener('click', () => {
    metodoAlternar = 2;
    document.getElementById('numeroTarjeta').value = '';
    document.getElementById('codigoSeg').value = '';
    document.getElementById('tarjetaVencimiento').value = '';
    document.getElementById('numeroTarjeta').disabled = true;
    document.getElementById('codigoSeg').disabled = true;
    document.getElementById('tarjetaVencimiento').disabled = true;

    document.getElementById('numCuenta').disabled = false;
  })
}

//cuando el modal se cierre se valida el formulario contenido
function validarModal() {
  document.getElementById('modal-metodoDePago').addEventListener('hidden.bs.modal', () => {

    let modalForm = document.getElementById('modalForm');
    let alertaMetodoPago = document.getElementById('alertaFormaDePago');

    if (!modalForm.checkValidity()) {
      alertaMetodoPago.innerHTML = 'El metodo de pago no esta validado';
      alertaMetodoPago.style.color = 'red';
      return false;
    } else {
      alertaMetodoPago.innerHTML = 'Metodo de pago valido';
      alertaMetodoPago.style.color = 'green';
      return true;

    }

  })
}
//muestro en pantalla el metodo seleccionado en el modal
// si este no esta validado mostrar una alerta
// y si lo esta entonces validarlo 
function validarModalEnFormulario() {

  let modalForm = document.getElementById('modalForm');

  if (!modalForm.checkValidity()) {
    let alertaMetodoPago = document.getElementById('alertaFormaDePago')
    alertaMetodoPago.innerHTML = 'El metodo de pago no esta validado';
    alertaMetodoPago.style.color = 'red';
    return false
  } else {
    modalForm.classList.add('was-validated');
    return true;
  }

}

// alerta para mostrar una vez que el formulario este validado
function mostrarAlertaDeCompra() {

  document.getElementById("alert-success").classList.remove("fade");

  setTimeout(() => { document.getElementById("alert-success").classList.add("fade") }, 1500);

}

//valido todo el formualrio de mi pagina 
//incluyendo los campos de cantidad de los productos
function validarCarrito() {

  document.getElementById('botonCompra').addEventListener('click', (e) => {

    let formCart = document.getElementById('formularioCarrito');

    if (!validarModalEnFormulario() || !validarCantProdCart() || !formCart.checkValidity()) {
      e.stopPropagation();
      e.preventDefault();

    } else { setTimeout(() => { mostrarAlertaDeCompra() }, 1000); }

    formCart.classList.add('was-validated');
    e.preventDefault();
  })
}



//EJECUTO MI CODIGO

document.addEventListener('DOMContentLoaded', () => {
  validarCantProdCart()
  verMiObjetoCarrito()
  conversionUSD()
  tipoEnvioLocalStorage()
  habilitarCampoModal()
  validarCarrito()
  validarModal()
})


