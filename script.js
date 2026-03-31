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

{l:"America",v:"Toluca"},
{l:"Cruz Azul",v:"Guadalajara"},
{l:"Queretaro",v:"Santos"},
{l:"Tijuana",v:"Mazatlán"},
{l:"Liverpool",v:"Arsenal"},
{l:"Ac Milan",v:"Inter Milan"},
{l:"Wolves",v:"Leverkusen"},
{l:"Chelsea",v:"Roma"},
{l:"Tigres",v:"San Luis"}

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

<!-- LOGO LOCAL -->

<div class="logo-box">

<input
type="file"
accept="image/*"
onchange="subirLogo(${i},'l',this)"
style="display:none"
id="logoL${i}">

<label for="logoL${i}">

<img
id="imgL${i}"
src="${p.logoL || ''}"
style="width:100%;height:100%;object-fit:contain">

</label>

</div>

<!-- EQUIPO LOCAL -->

<input
class="admin-input"
value="${p.l}"
oninput="editarEquipo(${i},'l',this.value)">

<span>vs</span>

<!-- EQUIPO VISITA -->

<input
class="admin-input"
value="${p.v}"
oninput="editarEquipo(${i},'v',this.value)">

<!-- LOGO VISITA -->

<div class="logo-box">

<input
type="file"
accept="image/*"
onchange="subirLogo(${i},'v',this)"
style="display:none"
id="logoV${i}">

<label for="logoV${i}">

<img
id="imgV${i}"
src="${p.logoV || ''}"
style="width:100%;height:100%;object-fit:contain">

</label>

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
