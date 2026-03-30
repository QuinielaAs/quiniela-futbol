/* ===========================
CONFIGURACION GENERAL
=========================== */

let numeroWhatsApp = "527821859759";

let costo = 25;

/* ===========================
CARGAR PARTIDOS EN ADMIN (9)
=========================== */

function cargarAdmin(){

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

/* guardar si no existían */

localStorage.setItem(
"partidos",
JSON.stringify(partidos)
);

}

/* ===========================
SELECCION L E V
=========================== */

function toggle(btn,i,val){

if(!selecciones[i])
selecciones[i]=[];

/* SI YA ESTÁ ACTIVO → QUITAR */

if(btn.classList.contains("activo")){

btn.classList.remove("activo");

selecciones[i] =
selecciones[i].filter(x=>x!=val);

}

/* SI NO ESTÁ → AGREGAR */

else{

btn.classList.add("activo");

selecciones[i].push(val);

}

calcular();

}


/* ===========================
CALCULAR COSTO
=========================== */

function calcular(){

let combinaciones = 1;

for(let i in selecciones){

let c = selecciones[i].length;

if(c>0)
combinaciones *= c;

}

let comb = document.getElementById("comb");

let total = document.getElementById("total");

if(comb)
comb.innerText = combinaciones;

if(total)
total.innerText = "$"+(combinaciones*costo);

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

let mensaje =
"📋 QUINIELA A's\n\n";

mensaje +=
"Nombre: "+nombre+"\n\n";

partidos.forEach((p,i)=>{

let sel =
(selecciones[i]||[])
.join(",");

mensaje +=
p[0]+" vs "+p[2]
+" = "+sel+"\n";

});


guardarJugador(nombre);

let url =
"https://wa.me/"
+numeroWhatsApp
+"?text="
+encodeURIComponent(mensaje);

window.open(url);

}


/* ===========================
GUARDAR JUGADOR (con precio)
=========================== */

function guardarJugador(nombre){

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

let picks = [];

let combinaciones = 1;

partidos.forEach((p,i)=>{

let sel =
(selecciones[i]||[]);

picks.push(
sel.join("")
);

if(sel.length>0)
combinaciones *= sel.length;

});

let total =
combinaciones * costo;

jugadores.push({

nombre: nombre,
picks: picks,
pagado: false,
costo: total

});

localStorage.setItem(
"jugadores",
JSON.stringify(jugadores)
);

}


/* ===========================
MOSTRAR JUGADORES ADMIN
(con picks y precio)
=========================== */

function mostrarJugadores(){

let contenedor =
document.getElementById(
"listaJugadores"
);

if(!contenedor) return;

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

contenedor.innerHTML="";

jugadores.forEach((j,i)=>{

/* SI NO EXISTE COSTO (jugadores viejos) */

let costoJugador = j.costo;

if(!costoJugador){

let combinaciones = 1;

if(j.picks){

j.picks.forEach(p=>{

if(p.length>0){

combinaciones *= p.length;

}

});

}

costoJugador =
combinaciones * costo;

}


/* TEXTO PICKS */

let picksTexto = "-";

if(j.picks){

picksTexto =
j.picks.join(" | ");

}


contenedor.innerHTML += `

<div style="
border:1px solid #ccc;
padding:10px;
margin:8px">

<b>Jugador:</b> ${j.nombre}

<br><br>

<b>Picks:</b>

<br>

${picksTexto}

<br><br>

<b>Precio:</b>

<span style="
color:green;
font-weight:bold">

$${costoJugador}

</span>

<br><br>

<button
onclick="marcarPagado(${i})"

style="
background-color:
${j.pagado ? 'blue':'green'};
color:white;
border:none;
padding:6px 12px;
cursor:pointer;
"

${j.pagado ? 'disabled':''}

>

${j.pagado ? 'PAGADO':'Confirmar Pago'}

</button>

</div>

`;

});

}

/* ===========================
CONFIRMAR PAGO
=========================== */

function marcarPagado(index){

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
BORRAR JUGADORES
=========================== */

function borrarJugadores(){

let confirmar =
confirm(
"¿Seguro que deseas borrar todos los jugadores?"
);

if(!confirmar) return;

localStorage.removeItem(
"jugadores"
);

mostrarJugadores();

alert(
"Jugadores borrados correctamente"
);

}


/* ===========================
GENERAR PDF GENERAL
=========================== */

function generarPDFGeneral(){

const { jsPDF } = window.jspdf;

let doc =
new jsPDF("landscape");

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

let pagados =
jugadores.filter(
j=>j.pagado
);

if(pagados.length==0){

alert("No hay jugadores pagados");

return;

}

let semanaInput =
document.getElementById("semana");

let semana =
semanaInput
? semanaInput.value
: "1";

let y = 10;


/* TITULO */

doc.setFontSize(16);

doc.text(
"QUINIELA A's",
10,
y
);

y += 8;

doc.setFontSize(12);

doc.text(
"SEMANA "+semana,
10,
y
);

y += 8;

doc.setFontSize(10);

doc.text(
"Fecha: "+
new Date().toLocaleDateString(),
10,
y
);

y += 10;


/* ENCABEZADOS */

doc.setFontSize(8);

doc.text("No",10,y);

doc.text("Jugador",20,y);

let colX = 60;

partidos.forEach((p,i)=>{

let nombre =
p[0].substring(0,3)
+"-"+
p[2].substring(0,3);

doc.text(
nombre,
colX,
y
);

colX += 25;

});

y += 8;


/* FILAS */

pagados.forEach((j,index)=>{

doc.text(
(index+1).toString(),
10,
y
);

doc.text(
j.nombre,
20,
y
);

let col = 60;

j.picks.forEach(p=>{

doc.text(
p || "-",
col,
y
);

col += 25;

});

y += 8;

if(y > 180){

doc.addPage();

y = 10;

}

});

doc.save(
"quiniela_pagados.pdf"
);

}


/* ===========================
GUARDAR HORA
=========================== */

function guardarHora(){

let horaInput =
document.getElementById(
"horaCierre"
);

if(!horaInput){

alert("No se encontró campo hora");

return;

}

let valor = horaInput.value;

if(!valor){

alert("Selecciona una hora");

return;

}

localStorage.setItem(
"horaCierre",
valor);

alert(
"Hora guardada correctamente"
);

}


/* ===========================
REINICIAR HORA
=========================== */

function borrarHora(){

localStorage.removeItem(
"horaCierre"
);

alert(
"Hora reiniciada correctamente"
);

}


/* ===========================
VERIFICAR HORA
=========================== */

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

setInterval(
verificarHora,
5000
);

function editarEquipo(i,tipo,valor){

let partidos =
JSON.parse(localStorage.getItem("partidos"));

partidos[i][tipo] = valor;

localStorage.setItem(
"partidos",
JSON.stringify(partidos)
);

}
