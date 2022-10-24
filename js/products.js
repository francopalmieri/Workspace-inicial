const ORDER_ASC_BY_COST = "Mayor a menor";
const ORDER_DESC_BY_COST = "Menor a mayor";
const ORDER_BY_PROD_SOLDCOUNT = "Relevancia";
let currentElementsArray = [];
let currentSortCriterio = undefined;
let minCount = undefined;
let maxCount = undefined;
let buscadorF = undefined;

function sortProducts(criterio, array) {
    let result = [];

    if (criterio === ORDER_ASC_BY_COST) {
        result = array.sort(function (a,b) {//Ordeno de mayor a menor los productos vendidos mediante array.sort.
            return b.cost - a.cost;
        });
    } else if (criterio === ORDER_BY_PROD_SOLDCOUNT) {
        result = array.sort(function (a,b) {
            return b.soldCount - a.soldCount;
        });
    } else if (criterio === ORDER_DESC_BY_COST) {
        result = array.sort(function (a,b) {// intercambio parametros para un sentido inverso de menor a mayor
            return a.cost - b.cost;
        });
    }
    return result;
}

function setProductID(id) {
    localStorage.setItem("productID", id); //envio al local el id del producto para ser utilizado posteriormente
    window.location = "product-info.html"
}


function showCart(id){

    if(localStorage.getItem('enCarrito')==null){
        localStorage.setItem('enCarrito',  '[]');
    }
    let productCArt = JSON.parse(localStorage.getItem('enCarrito'));
    productCArt.push(id)
    localStorage.setItem('enCarrito', JSON.stringify(productCArt));
}

function showProductsList() {

    let titulo = `<div class="text-center p-4">
    <h2>Productos</h2>
    <p class="lead">Veras aquí todos los productos de la categoria <b>${currentElementsArray.catName}</b></p>
  </div>`

    document.getElementById("prodt").innerHTML = titulo;
    
    let htmlContentToAppend = "";
    for (let i = 0; i < currentElementsArray.products.length; i++) {
        let categoryP = currentElementsArray.products[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(categoryP.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(categoryP.cost) <= maxCount))) {

            //desafiate 2
            if (categoryP.name.toLowerCase().includes(buscadorF) || categoryP.description.toLowerCase().includes(buscadorF) || categoryP.name.toUpperCase().includes(buscadorF) || categoryP.description.toUpperCase().includes(buscadorF) || buscadorF == undefined ){
            htmlContentToAppend += `
            <div class=" col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 my-2 justify-content-between  cursor-active">
            <div onclick="setProductID(${categoryP.id})">
                <div class="card"  >
                 <img src="${categoryP.image}" class="card-img-top" alt="${categoryP.description}">
                    <div id="containerInfoProd">
                        <h5 class=" py-2" id="products-name">${categoryP.name}</h5>
                        <div class="col">
                            <div class="d-flex justify-content-between">
                                <h4 class="mb-3 mx-3">${categoryP.currency} ${categoryP.cost}</h4>
                                <small class="text-muted mx-2">${categoryP.soldCount} artículos</small>    
                            </div> 
                            
                            <p class="mb-3 mx-2 text-muted"  >${categoryP.description}</p>
                        </div>
                    </div>                    
                    </div>
                    </div>
                </div>
              
            
            `
        }
}
        document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
    }
}
function sortAndShowProducts(sortCriterio, productsArray){

    if (productsArray != undefined) {
        currentElementsArray.products = productsArray;//redundancia donde mi parametro va a pasar a ser mi lista de productos 
    }

    currentElementsArray.products = sortProducts(sortCriterio, currentElementsArray.products);//se aplica la funcion con el array.sort y se modifica el array de los productos.

    showProductsList();
}

document.addEventListener("DOMContentLoaded",()=>{
    getJSONData(PRODUCT_LIST_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentElementsArray = resultObj.data
            showProductsList();
        }
    });

    document.getElementById("sortAsc").addEventListener("click",()=>{//se llama a la funcion para mostrar el filtrado en pantalla
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click",() =>{
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByCount").addEventListener("click",()=>{
        sortAndShowProducts(ORDER_BY_PROD_SOLDCOUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click",()=>{
        document.getElementById("rangeFilterCostMin").value = "";//limpio los input
        document.getElementById("rangeFilterCostMax").value = "";

        minCount = undefined;//limpio el valor de los rangos de precio
        maxCount = undefined;

        showProductsList();//muestro la funcion en formato original
    });

    document.getElementById("rangeFilterCost").addEventListener("click",()=>{

        minCount = document.getElementById("rangeFilterCostMin").value;//tomo el valor del campo minimo y maximo
        maxCount = document.getElementById("rangeFilterCostMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);//paso de un valor de tipo cadena a un numero entero

        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showProductsList();
    });
});

document.getElementById('buscadorF').addEventListener('input', ()=> {//Desafiate 2
    buscadorF = document.getElementById('buscadorF').value;
    showProductsList();
})
