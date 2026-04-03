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

/* SOLO GUARDAR SI NO EXISTEN */

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

/* VALIDAR HORA */

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

/* TOGGLE */

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
ENVIAR WHATSAPP
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

/* GUARDAR JUGADOR */

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

let totalComb = 1;

selecciones.forEach(s=>{

if(s && s.length>0){

totalComb *= s.length;

}

});

let totalPago =
totalComb * precio;

jugadores.push({

nombre: nombre,
selecciones:
JSON.parse(JSON.stringify(selecciones)),
combinaciones: totalComb,
total: totalPago,
pagado: false,
fecha: new Date().toLocaleString()

});

localStorage.setItem(
"jugadores",
JSON.stringify(jugadores)
);

/* WHATSAPP */

let url =
"https://wa.me/"
+numeroWhatsApp
+"?text="
+encodeURIComponent(mensaje);

window.open(url,"_blank");

alert("✅ Quiniela guardada correctamente");

}

/* ===========================
ADMIN PARTIDOS
=========================== */

function cargarAdmin(){

let partidos =
JSON.parse(localStorage.getItem("partidos"));

let div =
document.getElementById("adminLista");

if(!div || !partidos) return;

div.innerHTML="";

partidos.forEach((p,i)=>{

div.innerHTML += `

<div class="admin-partido">

<input
class="admin-input"
value="${p.l}"
oninput="editarEquipo(${i},'l',this.value)">

<span>vs</span>

<input
class="admin-input"
value="${p.v}"
oninput="editarEquipo(${i},'v',this.value)">

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
GUARDAR HORA
=========================== */

function guardarHora(){

let input =
document.getElementById("horaCierre");

if(!input) return;

let hora = input.value;

if(!hora){

alert("Selecciona una hora");
return;

}

localStorage.setItem(
"horaCierre",
hora
);

alert("✅ Hora guardada");

}

/* ===========================
CARGAR HORA
=========================== */

function cargarHora(){

let hora =
localStorage.getItem("horaCierre");

let input =
document.getElementById("horaCierre");

if(hora && input){

input.value = hora;

}

}

/* ===========================
MOSTRAR JUGADORES (DISEÑO NUEVO)
=========================== */

function mostrarJugadores(){

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

let div =
document.getElementById(
"listaJugadores"
);

if(!div) return;

div.innerHTML="";

if(jugadores.length==0){

div.innerHTML =
"<p>No hay jugadores registrados</p>";

return;

}

jugadores.forEach((j,i)=>{

/* ARMAR PICKS EN LINEA */

let picksLinea = "";

if(j.selecciones){

j.selecciones.forEach(s=>{

if(s && s.length>0){

picksLinea +=
s.join(" ") + " ";

}

});

}

/* ESTADO */

let color =
j.pagado ? "green" : "red";

let estado =
j.pagado ? "PAGADO" : "PENDIENTE";

/* CREAR TARJETA */

div.innerHTML += `

<div class="jugador-card">

<div class="jugador-nombre">

${j.nombre}

</div>

<div class="jugador-picks">

${picksLinea}

</div>

<div class="jugador-total">

💰 Precio: $${j.total}

</div>

<div class="jugador-botones">

<span class="estado"
style="background:${color}">

${estado}

</span>

<button
class="btn-confirmar"
onclick="confirmarPago(${i})">

Confirmar Pago

</button>

</div>

</div>

`;

});

}

/* ===========================
CONFIRMAR PAGO
=========================== */

function confirmarPago(index){

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

jugadores[index].pagado = true;

localStorage.setItem(
"jugadores",
JSON.stringify(jugadores)
);

mostrarJugadores();

}

/* ===========================
INICIO GENERAL
=========================== */

window.onload = function(){

if(document.getElementById("lista")){
cargar();
}

if(document.getElementById("adminLista")){
cargarAdmin();
}

if(document.getElementById("horaCierre")){
cargarHora();
}

if(document.getElementById("listaJugadores")){
mostrarJugadores();
}

};

/* ===========================
GENERAR EXCEL
=========================== */

function generarExcelGeneral(){

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

let partidos =
JSON.parse(
localStorage.getItem("partidos")
) || [];

if(jugadores.length == 0){

alert("No hay jugadores registrados");
return;

}

let datos = [];

jugadores.forEach(j=>{

/* SOLO PAGADOS */

if(j.pagado){

let fila = {};

fila["Nombre"] =
j.nombre;

fila["Combinaciones"] =
j.combinaciones;

fila["Total"] =
j.total;

/* PICKS */

if(j.selecciones){

j.selecciones.forEach((s,i)=>{

if(s && s.length>0){

let p = partidos[i];

fila[
p.l+" vs "+p.v
] = s.join(",");

}

});

}

datos.push(fila);

}

});

/* VALIDAR PAGADOS */

if(datos.length == 0){

alert("No hay jugadores PAGADOS");

return;

}

/* CREAR EXCEL */

let hoja =
XLSX.utils.json_to_sheet(datos);

let libro =
XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
libro,
hoja,
"Pagados"
);

/* SEMANA */

let semana = 1;

let input =
document.getElementById("semana");

if(input){

semana = input.value || 1;

}

/* DESCARGAR */

XLSX.writeFile(
libro,
"Quiniela_Pagados_Semana_"+semana+".xlsx"
);

}

/* ===========================
BORRAR JUGADORES (NUEVA SEMANA)
=========================== */

function borrarJugadores(){

/* CONFIRMAR */

let confirmar = confirm(
"¿Seguro que deseas borrar TODOS los jugadores para iniciar nueva semana?"
);

if(!confirmar) return;

/* BORRAR STORAGE */

localStorage.removeItem("jugadores");

/* LIMPIAR SELECCIONES */

selecciones = [];

/* ACTUALIZAR PANEL */

let div =
document.getElementById("listaJugadores");

if(div){

div.innerHTML =
"No hay jugadores registrados";

}

/* MENSAJE */

alert("🗑️ Jugadores eliminados correctamente");

}
