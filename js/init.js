const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PRODUCT_LIST_URL = "https://japceibal.github.io/emercado-api/cats_products/"+localStorage.getItem("catID")+EXT_TYPE;
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/"+localStorage.getItem("productID")+EXT_TYPE;
const PRODUCT_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/"+localStorage.getItem("productID")+EXT_TYPE;
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_INFO_PEUGEOUT = "https://japceibal.github.io/emercado-api/user_cart/25801.json";



let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

document.addEventListener('DOMContentLoaded',()=>{
 if(localStorage.getItem("usuario")!=null){//si hay algo en el almacenamiento local con la clave usuario entonces lo traemos y lo introducimos en el espacio de la navbar
  document.getElementById("navSesion").innerHTML = localStorage.getItem("usuario");
 }else{
  window.location.href="login.html"// si no esta registrado redirigir al login
 } 
 
   }) 

   document.getElementById('CerrarSesion').addEventListener('click',()=>{
    localStorage.removeItem('usuario');
    window.location.reload()
   })
   















                                        

