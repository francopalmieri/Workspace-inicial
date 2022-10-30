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

function eliminarProdCart(id) {//funcion que toma como parametro la id del producto al cual estoy seleccionando

  let productosEnCarrito = JSON.parse(localStorage.getItem('objetosEnCarrito'));

  //recorro los elementos del array para que me devuelva la posicion de aquel que incluya el id que le estoy proporcionanado
  //tanto para el array del formato de los productos como para sus propios objetos 

  let eliminarDelArray = listaElementos.findIndex(element => element.includes(id));
  let eliminarDelAlmacenamiento = productosEnCarrito.findIndex(element => element.id === id);

  //utilizo el metodo splice() para eliminar la posicion ya establecida de mi array en los dos casos 
  listaElementos.splice(eliminarDelArray, 1);
  productosEnCarrito.splice(eliminarDelAlmacenamiento, 1);


  //actualizo el almacenamiento local mandandole el array de objetos modificado. 
  localStorage.setItem('objetosEnCarrito', JSON.stringify(productosEnCarrito));

  //actualizo lo que veo en pantalla con el metodo join para sustituir las comas .

  document.getElementById('verObjetoCarrito').innerHTML = listaElementos.join('');

  conversionUSD()
  alternarCostoEnvio()

  if (listaElementos == "") {
    document.getElementById('SubtotalGeneral').innerHTML = "USD" + ' ' + 0;
  }

  if (productosEnCarrito.length === 0) {
    window.location = 'index.html';
  }

}
//funcion que redirije al producto al apretar en su imagen
function redirigirProductos(id) {
  localStorage.setItem('productID', id);
  window.location.href = "product-info.html";
}

//Recorro el array de objetos y creo la estructura que voy a mostrar en mi pagina

function verMiObjetoCarrito() {

  let objetosDeCarrito = JSON.parse(localStorage.getItem('objetosEnCarrito'));

  // Para cada elemento del carrito
  // Multiplico el precio por la cantidad 
  // Lo almaceno para insertarlo en el subtotal dirigido al producto y en el total dirigido al general
  // Introduzco el formato html a una variable concatenado los atributos del objeto
  // Agrego ese elemento a una lista
  // imprimo la lista en pantalla
  // imprimo el total en pantalla

  for (let elemento of objetosDeCarrito) {

    let subtotal = elemento.cost * elemento.cantidad;

    let elementoCarrito = `
    <div class="mt-3 list-group-item contenedor-carrito">
    <div class="row justify-content-around subtitulosCartProd align-items-center">  
    <div class="col-2">
        <a onclick="redirigirProductos(${elemento.id})"><img width="150" height="100" class="img-thumbnail cursor-active" src="${elemento.image}" alt=""></a>
    </div>
    <div class="col-2"><a href="#" class="btn-product" onclick="redirigirProductos(${elemento.id})">${elemento.name}</a></div>
    <div class="col-2 lugarPrecio"> ${elemento.currency} ${elemento.cost}</div>
    <div class="col-2"><input type="number" class="cantidad-producto cantidadDelProducto p-0 m-0" oninput="subtotalProducto(${elemento.id})"
     value="${elemento.cantidad}" step="1" onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" min="1" autocomplete="off" required></div>
    <div class="col-2 subtotalProducto"> ${elemento.currency} ${subtotal}</div>
    <div class="col-2"><a onclick="eliminarProdCart(${elemento.id})"><i class="text-danger fas fa-trash fa-lg cursor-active"></i></a></div>
    </div>
    </div>`;

    listaElementos.push(elementoCarrito);
  }

  document.getElementById('verObjetoCarrito').innerHTML += listaElementos.join(' ');
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
  let productosEnCarrito = JSON.parse(localStorage.getItem('objetosEnCarrito'));

  for (let i = 0; i < productosEnCarrito.length; i++) {
    let producto = productosEnCarrito[i];
    if (producto.id === id) {
      producto.cantidad = document.getElementsByClassName('cantidadDelProducto')[i].value;
      if (producto.cantidad < 1 || producto.cantidad == '' || producto.cantidad == null || producto.cantidad == undefined) {
        minimoCantidadProducto = 2;} else {minimoCantidadProducto = 1;}

      localStorage.setItem('objetosEnCarrito', JSON.stringify(productosEnCarrito));
      document.getElementsByClassName('subtotalProducto')[i].innerHTML = producto.currency + ' ' + producto.cantidad * producto.cost;
    }
  }

  conversionUSD();
  alternarCostoEnvio();
}


//convierto mis objetos que tienen la moneda en UYU a USD
// haciendo la conversion
function conversionUSD() {
  let productosEnCarrito = JSON.parse(localStorage.getItem('objetosEnCarrito'));

  todoUSD = 0;

  for (let i = 0; i < productosEnCarrito.length; i++) {
    let producto = productosEnCarrito[i];
    if (producto.currency === "UYU") {

      todoUSD += Math.floor(producto.cantidad * (producto.cost / 41));
      document.getElementById('SubtotalGeneral').innerHTML = `USD ${todoUSD}`

    } else {

      todoUSD += producto.cantidad * producto.cost;
      document.getElementById('SubtotalGeneral').innerHTML = `${producto.currency} ${todoUSD}`
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
  document.getElementById('costoEnvio').innerHTML = 'USD' + ' ' + Math.floor((subtotal * 15) / 100);
  document.getElementById('totalGeneral').innerHTML = 'USD' + ' ' + (subtotal + Math.floor((subtotal * 15) / 100));
}

function costoEnvioExpress() {
  localStorage.setItem('metodoEnvio', 2)
  costoAlternar = 2;
  let subtotal = todoUSD;
  document.getElementById('costoEnvio').innerHTML = 'USD' + ' ' + Math.floor((subtotal * 7) / 100);
  document.getElementById('totalGeneral').innerHTML = 'USD' + ' ' + (subtotal + Math.floor((subtotal * 7) / 100));
}

function costoEnvioStandard() {
  localStorage.setItem('metodoEnvio', 3)
  costoAlternar = 3;
  let subtotal = todoUSD;
  document.getElementById('costoEnvio').innerHTML = 'USD' + ' ' + Math.floor((subtotal * 5) / 100)
  document.getElementById('totalGeneral').innerHTML = 'USD' + ' ' + (subtotal + Math.floor((subtotal * 5) / 100))
}

//funcion que alterna entre una funcion u otra dependiendo de una variable global
//cuando presiono subre el input de cantidad en el producto.
// esta funcion se ejecuta.
//dependiedo a que numero este igualada esa variable 
// es la funcion de tipo de envio que se va a ejecutar
function alternarCostoEnvio() {
  if (costoAlternar === 1) {
    costoEnvioPremium()
  } else if (costoAlternar === 2) {
    costoEnvioExpress()
  } else if (costoAlternar === 3) {
    costoEnvioStandard()
  }
}


// traigo la variable con el numero en el localstorage
// creo una condicional donde para cada numero especifico
// se ejecute esa funcion que guarde antes.
// le doy un checked a ese campo
function tipoEnvioLocalStorage() {
  let metodoSeleccionado = JSON.parse(localStorage.getItem('metodoEnvio'))
  if (metodoSeleccionado === 1) {
    costoEnvioPremium()
    document.getElementById('cartPremium').checked = true
  } else if (metodoSeleccionado === 2) {
    costoEnvioExpress()
    document.getElementById('cartExpress').checked = true
  } else if (metodoSeleccionado === 3) {
    document.getElementById('cartStandard').checked = true
    costoEnvioStandard()
  }
}



function mostrarMetodoDePago() {
  if (metodoAlternar == 1) {
    document.getElementById('metodoSeleccionado').innerHTML = 'Tarjeta de Credito'
  } else if (metodoAlternar == 2) {
    document.getElementById('metodoSeleccionado').innerHTML = 'Transferencia Bancaria'
  }
}


//                                       SECCION METODO DE PAGO                     


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

//muestro en pantalla el metodo seleccionado en el modal

function validarFormularioModal() {

  let modalForm = document.getElementById('modalForm');

  if (!modalForm.checkValidity()) {
    let alertaMetodoPago = document.getElementById('alertaFormaDePago')
    alertaMetodoPago.innerHTML = 'El metodo de pago no esta validado';
    alertaMetodoPago.style.color = 'red';
    return false
  }else{
    modalForm.classList.add('was-validated');
    return true;
  }

}

// valido que la cantidad de los productos 
function validarCantProdCart() {
  let productosEnCarrito = JSON.parse(localStorage.getItem('objetosEnCarrito'));
  let alertaCantidadProducto = document.getElementById('alertaCantidadProducto')

  if (productosEnCarrito.length === 0) {

    alertaCantidadProducto.innerHTML = 'Debes agregar un producto a tu carrito';
    alertaCantidadProducto.style.color = 'red'
    window.location="index.html"
    return false;

  } else if (minimoCantidadProducto == 2) {
    alertaCantidadProducto.innerHTML = 'La cantidad del producto debe ser valida';
    alertaCantidadProducto.style.color = 'red';
    return false;

  } else {
    alertaCantidadProducto.innerHTML='';
    return true;
  }
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

//valido todo el formualrio de mi pagina 
//incluyendo los campos de cantidad de los productos
function validarCarrito() {
  document.getElementById('botonCompra').addEventListener('click', (e) => {

    let formCart = document.getElementById('formularioCarrito');

    if (!validarFormularioModal() || !validarCantProdCart() || !formCart.checkValidity()) {
      e.stopPropagation();
      e.preventDefault();

    } else {
      setTimeout(() => {
        mostrarAlertaDeCompra();
      }, 1000);
    }

    formCart.classList.add('was-validated');
    e.preventDefault();
  })
}

// alerta para mostrar una vez que el formulario este validado
function mostrarAlertaDeCompra() {

  document.getElementById("alert-success").classList.add("show");
  setTimeout(() => {
    document.getElementById("alert-success").classList.remove("show");
  }, 2000);


}




//EJECUTO MI CODIGO

document.addEventListener('DOMContentLoaded', () => {
  verMiObjetoCarrito()
  conversionUSD()
  tipoEnvioLocalStorage()
  habilitarCampoModal()
  validarCarrito()
  validarModal()
  validarCantProdCart()
})


