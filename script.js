/* ===========================
CONFIGURACION GENERAL
=========================== */

let numeroWhatsApp = "527821859759";
let precio = 25;
let selecciones = [];

/* ===========================
CARGAR PARTIDOS CLIENTE
=========================== */

function cargar(){

let partidosBase = [

{l:"América",v:"Tigres",logoL:"logos/america.png",logoV:"logos/tigres.png"},
{l:"Chivas",v:"Pumas",logoL:"logos/guadalajara.png",logoV:"logos/pumas.png"},
{l:"Cruz Azul",v:"León",logoL:"logos/cruzazul.png",logoV:"logos/leon.png"},
{l:"Toluca",v:"Atlas",logoL:"logos/toluca.png",logoV:"logos/atlas.png"},
{l:"Monterrey",v:"Santos",logoL:"logos/monterrey.png",logoV:"logos/santos.png"},
{l:"Necaxa",v:"Puebla",logoL:"logos/necaxa.png",logoV:"logos/puebla.png"},
{l:"Mazatlán",v:"Juárez",logoL:"logos/mazatlan.png",logoV:"logos/juarez.png"},
{l:"Querétaro",v:"Pachuca",logoL:"logos/queretaro.png",logoV:"logos/pachuca.png"},
{l:"Tijuana",v:"San Luis",logoL:"logos/tijuana.png",logoV:"logos/atleticosl.png"}

];

if(!localStorage.getItem("partidos")){

localStorage.setItem(
"partidos",
JSON.stringify(partidosBase)
);

}

let partidos =
JSON.parse(localStorage.getItem("partidos"));

let div =
document.getElementById("lista");

if(!div) return;

div.innerHTML="";

partidos.forEach((p,i)=>{

div.innerHTML += `

<div class="partido">

<div class="equipo">

<img src="${p.logoL}" class="logo"> ${p.l}

</div>

<div class="botones">

<button class="btn" onclick="toggle(this,${i},'L')">L</button>
<button class="btn" onclick="toggle(this,${i},'E')">E</button>
<button class="btn" onclick="toggle(this,${i},'V')">V</button>

</div>

<div class="equipo">

${p.v}

<img src="${p.logoV}" class="logo logo-derecha">

</div>

</div>

`;

});

}

/* ===========================
BOTONES L E V
=========================== */

function toggle(btn, i, val) {

let horaGuardada =
localStorage.getItem("horaCierre");

if(horaGuardada){

let ahora = new Date();
let cierre = new Date(horaGuardada);

if(ahora >= cierre){

alert("⛔ La quiniela ya está cerrada");
return;

}

}

if (!selecciones[i]) {
selecciones[i] = [];
}

if (selecciones[i].includes(val)) {

selecciones[i] =
selecciones[i].filter(x => x !== val);

btn.classList.remove("activo");

} else {

selecciones[i].push(val);

btn.classList.add("activo");

}

btn.blur();

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

let comb =
document.getElementById("comb");

let total =
document.getElementById("total");

if(comb) comb.innerText = totalComb;
if(total) total.innerText =
"$"+(totalComb*precio);

}

/* ===========================
ENVIAR WHATSAPP + FIREBASE
=========================== */

function enviar(){

let nombre =
document.getElementById("nombre").value;

if(!nombre){

alert("Escribe tu nombre");
return;

}

let partidos =
JSON.parse(localStorage.getItem("partidos"));

for(let i=0;i<partidos.length;i++){

if(!selecciones[i] || selecciones[i].length==0){

alert("Debes seleccionar todos los partidos");

return;

}

}

let mensaje =
"📋 QUINIELA A's\n\n";

mensaje +=
"Nombre: "+nombre+"\n\n";

partidos.forEach((p,i)=>{

let sel =
(selecciones[i]||[])
.join(",");

mensaje +=
p.l+" vs "+p.v
+" = "+sel+"\n";

});

let totalComb = 1;

selecciones.forEach(s=>{

if(s && s.length>0){

totalComb *= s.length;

}

});

let totalPago =
totalComb * precio;

let jugador = {

nombre: nombre,
selecciones: selecciones,
combinaciones: totalComb,
total: totalPago,
pagado: false,
fecha: new Date().toLocaleString()

};

db.ref("jugadores").push(jugador);

let url =
"https://wa.me/"
+numeroWhatsApp
+"?text="
+encodeURIComponent(mensaje);

window.open(url,"_blank");

alert("✅ Quiniela enviada");

}

/* ===========================
FUNCION NUEVA
GENERAR COMBINACIONES
=========================== */

function generarCombinaciones(selecciones){

let resultados = [[]];

for(let i=0;i<selecciones.length;i++){

let nuevas = [];

let opciones = selecciones[i];

if(!opciones || opciones.length==0){
opciones = [""];
}

for(let r of resultados){

for(let op of opciones){

nuevas.push([...r, op]);

}

}

resultados = nuevas;

}

return resultados;

}

/* ===========================
EXCEL GENERAL MEJORADO
=========================== */

function generarExcelGeneral(){

db.ref("jugadores")
.once("value", snapshot=>{

let jugadores =
snapshot.val();

if(!jugadores){

alert("No hay jugadores registrados");
return;

}

let partidos =
JSON.parse(
localStorage.getItem("partidos")
) || [];

let datos = [];

Object.keys(jugadores)
.forEach(key=>{

let j = jugadores[key];

if(j.pagado && j.selecciones){

let combinaciones =
generarCombinaciones(
j.selecciones
);

combinaciones.forEach(c=>{

let fila = {};

fila["Nombre"] =
j.nombre;

let texto = "";

c.forEach((op,i)=>{

let p = partidos[i];

if(op){

texto +=
p.l+"-"+p.v+
":"+op+" | ";

}

});

fila["Combinacion"] =
texto;

datos.push(fila);

});

}

});

if(datos.length == 0){

alert("No hay jugadores PAGADOS");

return;

}

let hoja =
XLSX.utils.json_to_sheet(datos);

let libro =
XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
libro,
hoja,
"Combinaciones"
);

let semana = 1;

let input =
document.getElementById("semana");

if(input){

semana = input.value || 1;

}

XLSX.writeFile(
libro,
"Quiniela_Combinaciones_Semana_"+semana+".xlsx"
);

});

    }
