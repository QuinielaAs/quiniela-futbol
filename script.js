let numeroWhatsApp =
"527821859759";

let costo = 25;

/* PARTIDOS */

let partidos = [

["América","","Tigres",""],

["Chivas","","Pumas",""],

["Cruz Azul","","León",""],

["Monterrey","","Santos",""],

["Toluca","","Atlas",""],

["Pachuca","","Necaxa",""],

["Mazatlán","","Tijuana",""],

["San Luis","","Querétaro",""],

["Puebla","","Juárez",""]

];

let lista =
document.getElementById("lista");

let selecciones = {};

/* CREAR PARTIDOS */

partidos.forEach((p,i)=>{

let div =
document.createElement("div");

div.className="partido";

div.innerHTML=`

<img src="${p[1]}" class="logo">

<div class="equipo">${p[0]}</div>

<div class="botones">

<button class="btn"
onclick="toggle(this,${i},'L')">L</button>

<button class="btn"
onclick="toggle(this,${i},'E')">E</button>

<button class="btn"
onclick="toggle(this,${i},'V')">V</button>

</div>

<div class="equipo">${p[2]}</div>

<img src="${p[3]}" class="logo">

`;

lista.appendChild(div);

});

/* SELECCIONAR */

function toggle(btn,i,val){

btn.classList.toggle("activo");

if(!selecciones[i])
selecciones[i]=[];

if(btn.classList.contains("activo")){

selecciones[i].push(val);

}else{

selecciones[i]=
selecciones[i].filter(
x=>x!=val
);

}

calcular();

}

/* CALCULAR TOTAL */

function calcular(){

let combinaciones=1;

for(let i in selecciones){

let c =
selecciones[i].length;

if(c>0)
combinaciones*=c;

}

document.getElementById(
"comb"
).innerText =
combinaciones;

document.getElementById(
"total"
).innerText =
"$"+(combinaciones*costo);

}

/* ENVIAR WHATSAPP */

function enviar(){

let nombre =
document.getElementById("nombre").value;

let mensaje =
"📋 QUINIELA\n";

mensaje +=
"Nombre: "
+nombre+
"\n\n";

partidos.forEach((p,i)=>{

let sel =
(selecciones[i]||[])
.join(",");

mensaje +=
p[0]+" vs "
+p[2]
+" = "
+sel+"\n";

});

let url =
"https://wa.me/"
+numeroWhatsApp
+"?text="
+encodeURIComponent(
mensaje
);

window.open(url);

}

/* VERIFICAR HORA (VERSIÓN CORRECTA) */

function verificarHora(){

let hora =
localStorage.getItem(
"horaCierre"
);

if(!hora) return;

let ahora = new Date();

let cierre =
new Date(hora);

let botones =
document.querySelectorAll(".btn");

if(ahora > cierre){

botones.forEach(b=>{
b.disabled = true;
b.style.opacity = "0.5";
});

}else{

botones.forEach(b=>{
b.disabled = false;
b.style.opacity = "1";
});

}

}

/* REVISAR CADA 5 SEGUNDOS */

setInterval(
verificarHora,
5000
);

/* EJECUTAR AL CARGAR */

window.onload = function(){

verificarHora();

}
