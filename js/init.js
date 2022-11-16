const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";
const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PRODUCT_LIST_URL = "https://japceibal.github.io/emercado-api/cats_products/" + localStorage.getItem("catID") + EXT_TYPE;
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/" + localStorage.getItem("productID") + EXT_TYPE;
const PRODUCT_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/" + localStorage.getItem("productID") + EXT_TYPE;

const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_INFO_PEUGEOUT = "https://japceibal.github.io/emercado-api/user_cart/25801.json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
   if(usuarioActivo==null){location.href="login.html" }
  document.getElementById('navSesion').innerHTML = usuarioActivo;
})

document.getElementById('CerrarSesion').addEventListener('click', () => {
  localStorage.removeItem('usuarioActivo')
  window.location.href='login.html'
})




















