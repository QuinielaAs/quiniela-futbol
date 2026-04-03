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

/* OBTENER PARTIDOS */

let partidos =
JSON.parse(localStorage.getItem("partidos"));

/* VALIDAR QUE TODOS TENGAN PICK */

for(let i=0;i<partidos.length;i++){

if(!selecciones[i] || selecciones[i].length==0){

alert("Debes seleccionar todos los partidos");

return;

}

}

/* CREAR MENSAJE */

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

/* CALCULAR TOTAL */

let totalComb = 1;

selecciones.forEach(s=>{

if(s && s.length>0){

totalComb *= s.length;

}

});

let totalPago =
totalComb * precio;

/* CREAR OBJETO */

let jugador = {

nombre: nombre,
selecciones: selecciones,
combinaciones: totalComb,
total: totalPago,
pagado: false,
fecha: new Date().toLocaleString()

};

/* GUARDAR FIREBASE */

db.ref("jugadores").push(jugador);

/* ENVIAR WHATSAPP */

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

alert("Selecciona una hora");
return;

}

db.ref("config/horaCierre").set(hora);

localStorage.setItem(
"horaCierre",
hora
);

alert("Hora guardada");

}

/* ===========================
BORRAR HORA
=========================== */

function borrarHora(){

db.ref("config/horaCierre").remove();

localStorage.removeItem("horaCierre");

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
.on("value", snapshot => {

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

/* COLOR ESTADO */

let color =
j.pagado ? "green" : "red";

let estado =
j.pagado ? "PAGADO" : "PENDIENTE";

/* CREAR PICKS */

let picksTexto="";

if(j.selecciones){

j.selecciones.forEach((s,i)=>{

if(s){

picksTexto +=
`P${i+1}:${s} `;

}

});

}

/* TARJETA */

div.innerHTML += `

<div class="jugador-card">

<div>
<b>${j.nombre}</b>
</div>

<div style="
font-size:13px;
margin:5px 0;
color:#333">

${picksTexto}

</div>

<div>
💰 $${j.total}
</div>

<span style="
background:${color};
padding:4px 8px;
color:white">

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

pagado: true

});

}

/* ===========================
INICIO GENERAL
=========================== */

window.onload = function(){

/* CARGAR PARTIDOS */

if(document.getElementById("lista")){
cargar();
}

/* ADMIN */

if(document.getElementById("listaJugadores")){
mostrarJugadores();
}

/* CARGAR HORA */

if(typeof cargarHora === "function"){
cargarHora();
}

};

/* ===========================
CARGAR HORA DESDE FIREBASE
=========================== */

function cargarHora(){

db.ref("config/horaCierre")
.on("value", snapshot=>{

let hora =
snapshot.val();

if(hora){

/* GUARDAR LOCAL */

localStorage.setItem(
"horaCierre",
hora
);

}

});

}

/* ===========================
GENERAR EXCEL CON COMBINACIONES
=========================== */

function generarExcel(){

db.ref("jugadores")
.once("value", snapshot=>{

let jugadores = snapshot.val();

let filas = [];

if(jugadores){

Object.values(jugadores)
.forEach(j=>{

if(j.selecciones){

let combinaciones =
generarCombinaciones(j.selecciones);

combinaciones.forEach(combo=>{

filas.push([
j.nombre,
...combo
]);

});

}

});

}

/* CREAR CSV */

let contenido = "Nombre,P1,P2,P3,P4,P5,P6,P7,P8,P9\n";

filas.forEach(fila=>{

contenido += fila.join(",") + "\n";

});

/* DESCARGAR */

let blob =
new Blob([contenido],
{ type:"text/csv" });

let link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"quiniela_combinaciones.csv";

link.click();

});

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

});

}

function borrarJugadores(){

/* CONFIRMAR */

let confirmar = confirm(
"¿Seguro que deseas borrar TODOS los jugadores para iniciar nueva semana?"
);

if(!confirmar) return;

/* BORRAR EN FIREBASE */

db.ref("jugadores")
.remove()
.then(()=>{

/* LIMPIAR PANTALLA */

let div =
document.getElementById("listaJugadores");

if(div){

div.innerHTML =
"No hay jugadores registrados";

}

/* LIMPIAR SELECCIONES */

selecciones = [];

/* MENSAJE */

alert("🗑️ Jugadores eliminados correctamente");

})
.catch(error=>{

alert("Error al borrar jugadores");

console.log(error);

});

      }

/* ===========================
GENERAR COMBINACIONES
=========================== */

function generarCombinaciones(picks){

let resultado = [[]];

picks.forEach(pick=>{

let opciones = pick.split("");

let temp = [];

resultado.forEach(base=>{

opciones.forEach(op=>{

temp.push([...base, op]);

});

});

resultado = temp;

});

return resultado;

}
