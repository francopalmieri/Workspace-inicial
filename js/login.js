const login = document.getElementById('inicio');//traigo los campos que voy a utilizar
const email = document.getElementById('campo-email');
const password = document.getElementById('campo-password');
const contenedor = document.getElementsByTagName('label');


login.addEventListener('click', () => {
	if (password.value == "" ||  email.value == ""){//Creo un condicional donde se va a cumplir tanto si el campo del email o la contraseña estan vacios
	
		let emailAlert = document.createElement('p');//creo una etiqueta p y la almaceno en una variable para el email
		emailAlert.innerText = "Ingresa tu e-mail";//le doy el conenido a esa etiqueta
		emailAlert.style.color = 'red';//le doy un color

		let passAlert = document.createElement('p');//creo una etiqueta p y la almaceno en una variable para la contraseña
		passAlert.innerText = "Ingresa tu contraseña";//repito el mismo procedimiento
		passAlert.style.color = 'red';

		if (contenedor[0].getElementsByTagName('p').length == "" && email.value == "") {//si en la primera posicin del label no hay nada y ademas el valor del email esta vacio
			contenedor[0].appendChild(emailAlert);//entonces agregar la alerta de email
			email.style.border = "solid 1px red";
			moverCampoEmail()
		}
		if (contenedor[1].getElementsByTagName('p').length == "" && password.value == "") {
			contenedor[1].appendChild(passAlert);//lo mismo para la contraseña
			password.style.border = "solid 1px red";
			moverCampoPassword()
		}
		email.addEventListener("keypress", () => {//si presiono una tecla en ese contenedor se me va a remover la alerta
			contenedor[0].removeChild(emailAlert);
			email.style.border = "solid 1px #0088f7";
		})
		password.addEventListener("keypress", () => {//lo mismo par la contraseña
			contenedor[1].removeChild(passAlert);
			password.style.border = "solid 1px #0088f7";
		})
	}

	else {// si la condicion no se cumple entonces envio el dato del email al almacenamiento local y redirijo a la pagina principal
		localStorage.setItem("usuario",email.value);
		window.location.href= "index.html";
	}
});




function onSignIn(googleUser){
    let profile = googleUser.getBasicProfile();
    let usuario = profile.getName();
	console.log('hola')
    localStorage.setItem("usuario", usuario);
    window.location.href="index.html";       
}



function moverCampoEmail() {
	document.getElementById('campo-email').id="moverEmailAlert"
}
function moverCampoPassword() {
	document.getElementById('campo-password').id="moverPasswordAlert"
}
