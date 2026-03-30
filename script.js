/* ===========================
CONFIGURACION GENERAL
=========================== */

let precio = 25;
let selecciones = [];

/* ===========================
CARGAR PARTIDOS CLIENTE
=========================== */

function cargar(){

let partidos =
JSON.parse(localStorage.getItem("partidos")) || [

{l:"Equipo 1",v:"Equipo 2"},
{l:"Equipo 3",v:"Equipo 4"},
{l:"Equipo 5",v:"Equipo 6"},
{l:"Equipo 7",v:"Equipo 8"},
{l:"Equipo 9",v:"Equipo 10"},
{l:"Equipo 11",v:"Equipo 12"},
{l:"Equipo 13",v:"Equipo 14"},
{l:"Equipo 15",v:"Equipo 16"},
{l:"Equipo 17",v:"Equipo 18"}

];

localStorage.setItem(
"partidos",
JSON.stringify(partidos)
);

let div =
document.getElementById("lista");

if(!div) return;

div.innerHTML="";

partidos.forEach((p,i)=>{

div.innerHTML += `

<div class="partido">

<div class="equipo">

${p.l}

</div>

<div class="botones">

<button
class="btn"
onclick="toggle(this,${i},'L')">

L

</button>

<button
class="btn"
onclick="toggle(this,${i},'E')">

E

</button>

<button
class="btn"
onclick="toggle(this,${i},'V')">

V

</button>

</div>

<div class="equipo">

${p.v}

</div>

</div>

`;

});

}

/* ===========================
BOTONES L E V
=========================== */

function toggle(btn,i,val){

if(!selecciones[i])
selecciones[i]=[];

/* quitar */

if(btn.classList.contains("activo")){

btn.classList.remove("activo");

selecciones[i] =
selecciones[i].filter(x=>x!=val);

}

/* agregar */

else{

btn.classList.add("activo");

selecciones[i].push(val);

}

calcular();

}

/* ===========================
CALCULAR TOTAL
=========================== */

function calcular(){

let totalComb=1;

selecciones.forEach(s=>{

if(s && s.length>0){

totalComb *= s.length;

}

});

document.getElementById("comb").innerText =
totalComb;

document.getElementById("total").innerText =
"$"+(totalComb*precio);

}

/* ===========================
ENVIAR QUINIELA
=========================== */

function enviar(){

let nombre =
document.getElementById("nombre").value;

if(nombre==""){

alert("Escribe tu nombre");

return;

}

alert("Quiniela enviada");

}

/* ===========================
ADMIN PARTIDOS
=========================== */

function cargarAdmin(){

let partidos =
JSON.parse(localStorage.getItem("partidos"));

let div =
document.getElementById("adminLista");

if(!div) return;

div.innerHTML="";

partidos.forEach((p,i)=>{

div.innerHTML += `

<div class="admin-partido">

<div class="logo-box">

Logo

</div>

<input
class="admin-input"
value="${p.l}"
oninput="editarEquipo(${i},'l',this.value)">

<span>vs</span>

<input
class="admin-input"
value="${p.v}"
oninput="editarEquipo(${i},'v',this.value)">

<div class="logo-box">

Logo

</div>

</div>

`;

});

}

/* ===========================
EDITAR EQUIPOS
=========================== */

function editarEquipo(i,tipo,valor){

let partidos =
JSON.parse(localStorage.getItem("partidos"));

partidos[i][tipo] = valor;

localStorage.setItem(
"partidos",
JSON.stringify(partidos)
);

}

/* ===========================
INICIO GENERAL
=========================== */

window.onload=function(){

cargar();
cargarAdmin();

                 }
