let moverCantArticulos = [];
let listaObjetos = [];

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

function valorCantidad(id) {

    let usuariosEnLocal = JSON.parse(localStorage.getItem('usuarios'));
    let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    for (usuario of usuariosEnLocal) {
        if (usuario.nombreUsuario === usuarioActivo) {

            for (let i = 0; i < usuario.enCarrito.length; i++) {
                let producto = usuario.enCarrito[i];
                if (producto.id === id) {
                    producto.cantidad = document.getElementsByClassName('campoValorCarritoGeneral')[i].value;

                    localStorage.setItem('usuarios', JSON.stringify(usuariosEnLocal));

                    document.getElementsByClassName('mostrarPrecio')[i].innerHTML = producto.currency + ' ' + producto.cantidad * producto.cost;

                    document.getElementById('numArticulos').innerHTML = `ARTÍCULOS ( ${moverCantArticulos} )`;

                    document.getElementById('contadorArticulos').innerHTML = moverCantArticulos;

                }
            }
        }
    }
    mostrarCarritogeneral()
}

function mostrarCarritogeneral() {

    let usuariosEnLocal = JSON.parse(localStorage.getItem('usuarios'));
    let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    for (usuario of usuariosEnLocal) {
        if (usuario.nombreUsuario === usuarioActivo) {

            if (usuario.enCarrito.length === 0) {
                document.getElementById('contadorArticulos').style.display = 'none';

                document.getElementById('titulocant').innerHTML = ""
                document.getElementById('tituloprecio').innerHTML = ""
                document.getElementById('finalizarCompra').disabled = true;

                let carritoSinProductos = `
        <div class="row my-5 text-center" >
        <h2>Agregue un producto al carrito</h2>
        </div>`


                document.getElementById('carritoVacio').innerHTML = carritoSinProductos
            }

            let mostrarObjeto = "";
            let cantidadDeArticulos = 0;
            let importeTotal = 0;

            for (let objeto of usuario.enCarrito) {

                cantidadDeArticulos += parseInt(objeto.cantidad);

                let precio = objeto.cantidad * objeto.cost;

                mostrarObjeto += `<hr>
            <div class="row text-center align-items-center ">

                <div class="col-3"><a onclick="redirigirAlProducto(${objeto.id})"><img  class="cursor-active img-thumbnail" 
                src="${objeto.image}" style="width:100%"></a></div>
                <div class="col-3">${objeto.name}</div>

                <div class="col-2 cursor-active"><input type="number" step="1" class="text-center campoValorCarritoGeneral" oninput="valorCantidad(${objeto.id})" style="width:80%; border-radius:5px" value="${objeto.cantidad}" min="1">
                </div>

                <div class="col-3 mostrarPrecio" style="font-size:15px"> ${objeto.currency} ${convertir(precio)}</div>

                <div class="col-1 cursor-active basura" onclick="eliminarProdCartGeneral(${objeto.id})"><img src="img/basura.png"></div> 
            </div> 

 `;

                document.getElementById('CarritoDesplegable').innerHTML = mostrarObjeto;
                document.getElementById('numArticulos').innerHTML = `<b>ARTÍCULOS ( ${cantidadDeArticulos} ) </b>`;
                document.getElementById('contadorArticulos').innerHTML = cantidadDeArticulos;

                if (objeto.currency === "UYU") { importeTotal += Math.floor(objeto.cantidad * (objeto.cost / 40)) }

                else { importeTotal += objeto.cantidad * objeto.cost; }

                document.getElementById('ImporteTotal').innerHTML = "USD" + " " + convertir(importeTotal)

            }
            moverCantArticulos.push(cantidadDeArticulos)
        }
    }

}

function redirigirAlProducto(id) {
    localStorage.setItem('productID', id);
    window.location.href = "product-info.html";
}

function eliminarProdCartGeneral(id) {//funcion que toma como parametro la id del producto al cual estoy seleccionando
    //recorro los elementos del array para que me devuelva la posicion de aquel que incluya el id que le estoy proporcionanado 


    let usuariosEnLocal = JSON.parse(localStorage.getItem('usuarios'));
    let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    for (usuario of usuariosEnLocal) {
        if (usuario.nombreUsuario === usuarioActivo) {

            let eliminarDelAlmacenamiento = usuario.enCarrito.findIndex(element => element.id === id);

            //utilizo el metodo splice() para eliminar la posicion ya establecida de mi array en los dos casos 
            usuario.enCarrito.splice(eliminarDelAlmacenamiento, 1);
             console.log(usuario.enCarrito)
            //actualizo el almacenamiento local mandandole el array de objetos modificado. 
            localStorage.setItem('usuarios', JSON.stringify(usuariosEnLocal));

            //actualizo lo que veo en pantalla.

             mostrarCarritogeneral();
             
            if (usuario.enCarrito.length === 0) {
                location.reload()
            }
        }
    }
      
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarCarritogeneral();

})

document.getElementById("finalizarCompra").addEventListener("click", function () {
    window.location = "cart.html";
});



