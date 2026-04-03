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

/* GUARDAR BASE */

if(!localStorage.getItem("partidos")){

localStorage.setItem(
"partidos",
JSON.stringify(partidosBase)
);

}

/* OBTENER */

let partidos =
JSON.parse(localStorage.getItem("partidos"));

let div =
document.getElementById("lista");

if(!div) return;

div.innerHTML="";

/* CREAR PARTIDOS */

partidos.forEach((p,i)=>{

div.innerHTML += `

<div class="partido">

<div class="equipo">

<img src="${p.logoL}" class="logo">
${p.l}

</div>

<div class="botones">

<button class="btn"
onclick="toggle(this,${i},'L')">L</button>

<button class="btn"
onclick="toggle(this,${i},'E')">E</button>

<button class="btn"
onclick="toggle(this,${i},'V')">V</button>

</div>

<div class="equipo">

${p.v}

<img src="${p.logoV}"
class="logo logo-derecha">

</div>

</div>

`;

});

}

/* ===========================
BOTONES L E V
=========================== */

function toggle(btn,i,val){

/* VALIDAR HORA */

let horaGuardada =
localStorage.getItem("horaCierre");

if(horaGuardada){

let ahora = new Date();
let cierre = new Date(horaGuardada);

if(ahora >= cierre){

alert("⛔ Quiniela cerrada");
return;

}

}

/* CREAR ARRAY */

if(!selecciones[i]){

selecciones[i]=[];

}

/* TOGGLE */

if(selecciones[i].includes(val)){

selecciones[i] =
selecciones[i]
.filter(x=>x!==val);

btn.classList.remove("activo");

}else{

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

if(comb)
comb.innerText = totalComb;

if(total)
total.innerText =
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

/* VALIDAR PICKS */

for(let i=0;i<partidos.length;i++){

if(!selecciones[i] ||
selecciones[i].length==0){

alert("Debes seleccionar todos los partidos");
return;

}

}

/* MENSAJE */

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

/* CALCULAR */

let totalComb=1;

selecciones.forEach(s=>{

if(s && s.length>0){

totalComb *= s.length;

}

});

let totalPago =
totalComb*precio;

/* OBJETO */

let jugador = {

nombre:nombre,
selecciones:selecciones,
combinaciones:totalComb,
total:totalPago,
pagado:false,
fecha:new Date().toLocaleString()

};

/* FIREBASE */

db.ref("jugadores")
.push(jugador);

/* WHATSAPP */

let url =
"https://wa.me/"
+numeroWhatsApp
+"?text="
+encodeURIComponent(mensaje);

window.open(url,"_blank");

alert("✅ Quiniela enviada");

}

/* ===========================
GUARDAR HORA
=========================== */

function guardarHora(){

let hora =
document.getElementById("horaCierre").value;

if(!hora){

alert("Selecciona hora");
return;

}

/* CREAR FECHA COMPLETA */

let hoy = new Date();

let fechaCompleta =
hoy.toDateString()
+" "
+hora;

db.ref("config/horaCierre")
.set(fechaCompleta);

localStorage.setItem(
"horaCierre",
fechaCompleta
);

alert("Hora guardada");

}

/* ===========================
BORRAR HORA
=========================== */

function borrarHora(){

db.ref("config/horaCierre")
.remove();

localStorage.removeItem(
"horaCierre"
);

let input =
document.getElementById("horaCierre");

if(input){

input.value="";

}

alert("Hora reiniciada");

}

/* ===========================
MOSTRAR JUGADORES
=========================== */

function mostrarJugadores(){

let div =
document.getElementById("listaJugadores");

if(!div) return;

db.ref("jugadores")
.on("value", snapshot=>{

div.innerHTML="";

let jugadores =
snapshot.val();

if(!jugadores){

div.innerHTML =
"No hay jugadores";

return;

}

Object.entries(jugadores)
.forEach(([id,j])=>{

let color =
j.pagado ? "green" : "red";

let estado =
j.pagado ? "PAGADO" : "PENDIENTE";

/* PICKS */

let picksTexto="";

if(j.selecciones){

j.selecciones
.forEach((s,i)=>{

if(s){

picksTexto +=
"P"+(i+1)+":"
+s.join("")
+" ";

}

});

}

/* TARJETA */

div.innerHTML += `

<div class="jugador-card">

<b>${j.nombre}</b>

<br>

${picksTexto}

<br>

💰 $${j.total}

<br>

<span style="
background:${color};
color:white;
padding:4px 8px">

${estado}

</span>

<br><br>

<button
onclick="confirmarPago('${id}')">

✅ Confirmar Pago

</button>

<button
onclick="borrarJugador('${id}')">

🗑️ Borrar

</button>

<hr>

</div>

`;

});

});

}

/* ===========================
CONFIRMAR PAGO
=========================== */

function confirmarPago(key){

db.ref(
"jugadores/"+key
).update({

pagado:true

});

}

/* ===========================
BORRAR JUGADOR
=========================== */

function borrarJugador(key){

let confirmar =
confirm("¿Borrar jugador?");

if(!confirmar) return;

db.ref(
"jugadores/"+key
).remove();

}

/* ===========================
BORRAR TODOS
=========================== */

function borrarJugadores(){

let confirmar =
confirm(
"¿Borrar TODOS los jugadores?"
);

if(!confirmar) return;

db.ref("jugadores")
.remove();

}

/* ===========================
CARGAR HORA DESDE FIREBASE
=========================== */

function cargarHora(){

db.ref("config/horaCierre")
.on("value",snapshot=>{

let hora =
snapshot.val();

if(hora){

localStorage.setItem(
"horaCierre",
hora
);

}

});

}

/* ===========================
GENERAR COMBINACIONES CSV
=========================== */

function generarExcel(){

db.ref("jugadores")
.once("value",snapshot=>{

let jugadores =
snapshot.val();

let filas=[];

if(jugadores){

Object.values(jugadores)
.forEach(j=>{

if(j.selecciones){

let combinaciones =
generarCombinaciones(
j.selecciones
);

combinaciones
.forEach(combo=>{

filas.push([
j.nombre,
...combo
]);

});

}

});

}

let contenido =
"Nombre,P1,P2,P3,P4,P5,P6,P7,P8,P9\n";

filas.forEach(fila=>{

contenido +=
fila.join(",")
+"\n";

});

let blob =
new Blob(
[contenido],
{type:"text/csv"}
);

let link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"quiniela_combinaciones.csv";

link.click();

});

}

/* ===========================
GENERAR COMBINACIONES
=========================== */

function generarCombinaciones(picks){

let resultado=[[]];

picks.forEach(opciones=>{

let temp=[];

resultado.forEach(base=>{

opciones.forEach(op=>{

temp.push([
...base,
op
]);

});

});

resultado=temp;

});

return resultado;

}

/* ===========================
INICIO GENERAL
=========================== */

window.onload=function(){

if(
document.getElementById("lista")
){
cargar();
}

if(
document.getElementById("listaJugadores")
){
mostrarJugadores();
}

cargarHora();

};
