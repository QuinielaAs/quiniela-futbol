let numeroWhatsApp =
"527821859759";

let costo = 25;

let horaLimite = "2026-04-04T18:00:00"; // hora cierre

/* EJEMPLO PARTIDOS */

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
function verificarHora(){

let ahora = new Date();

let cierre = new Date(horaLimite);

if(ahora > cierre){

document.body.innerHTML = `

<h2 style="text-align:center">

⛔ Quiniela cerrada

</h2>

<p style="text-align:center">

La hora límite ya pasó.

</p>

`;

}

}

verificarHora();
