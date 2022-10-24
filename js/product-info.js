
let infoProductsArray = []; //declaro variables globales para utilizar dentro y fuera de una funcion.
let infoCommentsArray = [];
let arrayCarrito = [];

let MyDate = new Date(); //variable que me proporciona la fecha actual .
let MyDateString = '';

let anioComments = (MyDate.getFullYear())
let mesComments = (MyDate.getMonth() + 1);
let diaComments = (MyDate.getDate());
let horaComments = (MyDate.getHours());
let minutoComments = (MyDate.getMinutes());
let segundoComments = (MyDate.getSeconds());

if (mesComments < 10) mesComments = '0' + mesComments; //condicional para tener el 0 delante de numeros menores a 10
if (diaComments < 10) diaComments = '0' + diaComments;
if (horaComments < 10) horaComments = '0' + horaComments;
if (minutoComments < 10) minutoComments = '0' + minutoComments;
if (segundoComments < 10) segundoComments = '0' + segundoComments;

MyDateString = anioComments + '-' + mesComments + '-' + diaComments + ' ' + horaComments + ':' + minutoComments + ':' + segundoComments;


function setProductRelatedID(id) {
	localStorage.setItem("productID", id);//funcion que toma la id de productos relacionados como parametro y envia al localstorage
	window.location = "product-info.html";//finalmente redirecciona a product-info para que se muestre ese producto especifico
}

function agregarAlCarrito(id) {

	//funcion que toma como parametro la id del producto
	// traigo la variable global para los valores de ese producto
	let datosCarrito = infoProductsArray;
	//si el almacenamiento local esta no existe entonces le paso un array como string
	if (localStorage.getItem('objetosEnCarrito') == null) {
		localStorage.setItem('objetosEnCarrito', '[]');
	}
	//lo traigo a una variable
	let objetosEnCarrito = JSON.parse(localStorage.getItem('objetosEnCarrito'));

	//en ese array utilizo el metodo some el cual retorna verdadero si algun elemento cumple con la condicion establecida
	let estaRepetido = objetosEnCarrito.some(producto => producto.id === id)

	//si en el almacenamiento existe un elemento que contenga la id del producto que quiero agregar
	//entonces itero el array de objetos y el que tenga esa id le sumo la cantidad
	//en caso de no encontrarse ese elemento, transformo sus propiedades en un objeto
	//lo agrego a la lista y lo mando al almacenamiento
	if (estaRepetido) {

		for (let i = 0; i < objetosEnCarrito.length; i++) {
			let dato = objetosEnCarrito[i];
			if (id === dato.id) {
				dato.cantidad++;
				localStorage.setItem('objetosEnCarrito', JSON.stringify(objetosEnCarrito));
			}
		}
	} else {

		let elementoEnCarrito = {
			"id": datosCarrito.id,
			"name": datosCarrito.name,
			"cost": datosCarrito.cost,
			"image": datosCarrito.images[0],
			"currency": datosCarrito.currency,
			"cantidad": 1,
		}
		
		objetosEnCarrito.push(elementoEnCarrito)
		localStorage.setItem('objetosEnCarrito', JSON.stringify(objetosEnCarrito))

	}
}

function showInfoProductsPage() {

	let valor = infoProductsArray;
	let htmlProducts = `
    <div class="justify-content-around">    
            <h1 class="mt-4 mb-2 text-center  tituloInfo">${valor.name}</h1>
            <hr>
            <h5><b>Precio</b><h5>
             <p class="text-muted">${valor.currency} ${valor.cost} <img src="/img/etiqueta-de-ropa.png" alt=""></p>
			 <h5><b>Descripcion</b><h5>
            <p class="text-muted">${valor.description}</p>
            <h5><b>Categoria</b><h5>
            <p class="text-muted">${valor.category}</p>
            <h5><b>Cantidad de vendidos</b><h5>
            <p class="text-muted">${valor.soldCount}</p>
            <div class="col-12 mb-3">
            <a class="btn btn-primary mt-3" onclick="agregarAlCarrito(${valor.id})">Agregar al carrito</a>
            </div> 
			</div>
            ` //creo la estructura de lo que voy a mostar en pantalla pasandole los parametros proporcionados por el json del mismo
	document.getElementById("products-info-container").innerHTML = htmlProducts;//imprimo esos datos
}

function showCarrousel() {
	let valor = infoProductsArray;

	let carrouselImg = "";
	let btnMainCarrousel = "";

	//desafiate 4
	for (let i = 0; i < valor.images.length; i++) {

		if (i == 0) { // Condicional para agregar la primera imagen en modo "activa"
			carrouselImg += `
            <div class="carousel-item active col-3 a">
            <img src="${valor.images[i]}" class="d-block w-100 img-thumbnail" alt="${valor.name}">
            </div>
            `//agregar el primer boton en modo "activo"
			btnMainCarrousel = `<img src="${valor.images[i]}" style="width: 33%; height: 33%"  data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" aria-label="Slide 1" aria-current="true" class="active">`

		} else {
			carrouselImg += `
            <div class="carousel-item col-3 a" >
            <img src="${valor.images[i]}" class="d-block w-100 img-thumbnail" alt="${valor.name}">
            </div>
            `
			btnMainCarrousel += `<img src="${valor.images[i]}" style="width: 33%; height: 33%" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" aria-label="Slide ${i + 1}" class="img-thumbnail botonCarruselInfo">`
		}
	}
	//Estilo en imagen 
	

	document.getElementById('btnMainCarrousel').innerHTML = btnMainCarrousel;
	document.getElementById('carruselImagenes').innerHTML = carrouselImg;
    
}




function similarProducts() {
	let valor = infoProductsArray;

	let similarProducts = "";

	valor.relatedProducts.forEach((product) => { //creo un forEach donde para cada uno de los productos relacionados concateno los atributos en una variable

		similarProducts += ` <div onclick="setProductRelatedID(${product.id})" class="col-12 col-sm-6 12 col-md-4 mt-4 cursor-active similarProducts"> 
                                <img src="${product.image}" class="img-thumbnail"></img>
                                <div class="text-center">${product.name}</div>
                            </div>`
	});
	document.getElementById('productRelated').innerHTML = similarProducts; //imprimo en pantalla
}

function showComments() {

	let commentsArray = infoCommentsArray;
	let htmlComments = "";

	for (let i = 0; i < commentsArray.length; i++) { //recorro el objeto de comentarios 
		let comments = commentsArray[i];

		let calificacion = ""; //declaro variable con calificacion a llenar

		for (let i = 0; i < 5; i++) {
			if (i < comments.score) { //si la iteracion del 1 al 5 es menor al comentario del usuario agregar estrella llena en la variable.   
				calificacion += `<span class="fa fa-star checked"></span>`;
			}
			else { calificacion += `<span class="fa fa-star"></span>`; } //sino, agregar una vacia.
		}
		comments.score = calificacion; //sobrescribo la variable en el score.

		htmlComments += `
                <div class="commentProd my-3 col-sm-12 list-group-item">
                    <p><b>${comments.user}</b> - ${comments.dateTime} - ${comments.score}</p>
                    <p>${comments.description}</p></div> `
	} //creo la estructura de los comentarios que se va a reflejar en mi html pasandole los valores del json por parametro

	document.getElementById("info-comments").innerHTML = htmlComments;

	if (localStorage.getItem('addComment')) { //dado el almacenamiento local de los comentarios. 

		let comentarios = JSON.parse(localStorage.getItem('addComment')); //traigo como objeto lo que tengo alli y lo almaceno en una variable

		for (let comentario of comentarios) { //para cada uno de los elementos de esa lista de comentarios.
			if (comentario.includes(JSON.parse(localStorage.getItem('productID')))) { //si ese comentario incluye la id del producto en el que estoy
				document.getElementById("info-comments").innerHTML += comentario; //entonces lo muestro en mi pagina
			}
		}
	}
}
//evento de escucha para el boton de commentario

document.getElementById('botonComment').addEventListener('click', () => {
	//traigo los valores de los campos a tener en cuenta
	let textArea = document.getElementById('textArea1').value;
	let ratingComment = document.getElementById('rating').value;
	let valorcomment = infoProductsArray;

	let addRating = "";


	//utilizo mismo formato para agregar estrellas que en el utilizado para llamar al json
	for (let i = 0; i < 5; i++) {
		if (i < ratingComment) { addRating += `<span class="fa fa-star checked"></span>`; } else { addRating += `<span class="fa fa-star"></span>`; }
	}

	let agregarComment = "";
	agregarComment += `
    <div class="my-3 col-sm-12 list-group-item addComment">
    <div id="${valorcomment.id}"></div>
        <p><b>${localStorage.getItem('usuario')}</b> - ${MyDateString} - ${addRating}</p>
        <p>${textArea}</p></div> `


	//al comentario que realiza el usuario se le agrega la misma id proporcionada por el producto
	//concateno la fecha actual, la puntuacion y el texto
	let array = [];

	//si no hay nada en este almacenamiento local introduzco un array vacio
	if (localStorage.getItem('addComment') == null) {
		localStorage.setItem('addComment', JSON.stringify(array));
	}

	//almaceno ese array como objeto en una variable
	//mediante push agrego el comentario a mi array
	//vuelvo a enviar al almacenamiento local como string
	//agrego el comentario al espacio donde se encuentran los demas
	//recargo la pagina para que se me actualice la fecha de mi comentario y no me muestre la misma.
	let lista = JSON.parse(localStorage.getItem('addComment'));

	lista.push(agregarComment);
	localStorage.setItem('addComment', JSON.stringify(lista))
	document.getElementById("info-comments").innerHTML += agregarComment;

	window.location.reload()
})

document.addEventListener("DOMContentLoaded", () => {

	getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
		if (resultObj.status === "ok") {
			infoProductsArray = resultObj.data
console.log(infoProductsArray)
			getJSONData(PRODUCT_COMMENTS_URL).then(function (resultObj) {
				if (resultObj.status === "ok") {
					infoCommentsArray = resultObj.data
					showInfoProductsPage();
					showCarrousel()
                    showComments()
                    similarProducts()
					
				}
			})

		}
	})
});

