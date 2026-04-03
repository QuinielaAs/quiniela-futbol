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

let partidos = [

{ l:"América", v:"Tigres" },
{ l:"Chivas", v:"Atlas" },
{ l:"Cruz Azul", v:"Pumas" },
{ l:"Toluca", v:"León" },
{ l:"Monterrey", v:"Santos" },
{ l:"Necaxa", v:"Mazatlán" },
{ l:"Pachuca", v:"Puebla" },
{ l:"Tijuana", v:"Querétaro" },
{ l:"San Luis", v:"Juárez" }

];

let lista =
document.getElementById("lista");

if(!lista) return;

lista.innerHTML="";

partidos.forEach((p,i)=>{

selecciones[i]="";

lista.innerHTML+=`

<div class="partido">

<div>

<b>P${i+1}</b>
<br>

${p.l}
vs
${p.v}

</div>

<div>

<button onclick="toggle(${i},'L',this)">
L
</button>

<button onclick="toggle(${i},'E',this)">
E
</button>

<button onclick="toggle(${i},'V',this)">
V
</button>

</div>

</div>

`;

});

/* CARGAR HORA */

verificarHora();

}

/* ===========================
SELECCION PICKS
=========================== */

function toggle(i,opcion,btn){

let valor =
selecciones[i] || "";

if(valor.includes(opcion)){

valor =
valor.replace(opcion,"");

btn.style.background="";

}else{

valor += opcion;

btn.style.background="green";

}

selecciones[i]=valor;

calcularTotal();

}

/* ===========================
CALCULAR TOTAL
=========================== */

function calcularTotal(){

let combinaciones = 1;

selecciones.forEach(s=>{

if(s.length>0){

combinaciones *= s.length;

}

});

document.getElementById("comb").innerText =
combinaciones;

document.getElementById("total").innerText =
"$"+(combinaciones*precio);

}

/* ===========================
VALIDAR PICKS
=========================== */

function validarPicks(){

for(let i=0;i<9;i++){

if(!selecciones[i] ||
selecciones[i].length==0){

alert(
"Debes seleccionar todos los partidos"
);

return false;

}

}

return true;

}

/* ===========================
ENVIAR QUINIELA
=========================== */

function enviar(){

if(!validarPicks()) return;

let nombre =
document.getElementById("nombre").value;

if(nombre==""){

alert("Escribe tu nombre");

return;

}

let combinaciones =
document.getElementById("comb").innerText;

let total =
document.getElementById("total")
.innerText.replace("$","");

/* GUARDAR EN FIREBASE */

let id =
Date.now();

db.ref("jugadores/"+id)
.set({

nombre:nombre,
selecciones:selecciones,
total:total,
pagado:false

});

/* MENSAJE WHATSAPP */

let mensaje =
"Quiniela %0A";

selecciones.forEach((s,i)=>{

mensaje +=
"P"+(i+1)+":"+s+"%0A";

});

mensaje +=
"Total:$"+total;

window.open(

"https://wa.me/"+
numeroWhatsApp+
"?text="+mensaje

);

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
j.pagado ? "green":"red";

let estado =
j.pagado ? "PAGADO":"PENDIENTE";

let picksTexto="";

if(j.selecciones){

j.selecciones.forEach((s,i)=>{

picksTexto +=
`P${i+1}:${s} `;

});

}

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
padding:4px 8px;">

${estado}

</span>

<br><br>

<button onclick="confirmarPago('${id}')">
✅ Confirmar Pago
</button>

<button onclick="borrarJugador('${id}')">
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

function confirmarPago(id){

db.ref("jugadores/"+id)
.update({

pagado:true

});

}

/* ===========================
BORRAR JUGADOR
=========================== */

function borrarJugador(id){

if(confirm("¿Borrar jugador?")){

db.ref("jugadores/"+id)
.remove();

}

}

/* ===========================
GUARDAR HORA CIERRE
=========================== */

function guardarHora(){

let hora =
document.getElementById("horaCierre").value;

db.ref("horaCierre")
.set(hora);

}

/* ===========================
VERIFICAR HORA
=========================== */

function verificarHora(){

db.ref("horaCierre")
.on("value", snapshot=>{

let hora =
snapshot.val();

if(!hora) return;

let ahora =
new Date();

let cierre =
new Date();

let partes =
hora.split(":");

cierre.setHours(partes[0]);
cierre.setMinutes(partes[1]);

if(ahora>=cierre){

bloquear();

}

});

}

/* ===========================
BLOQUEAR QUINIELA
=========================== */

function bloquear(){

let botones =
document.querySelectorAll("button");

botones.forEach(b=>{

b.disabled=true;

});

}

/* ===========================
GENERAR EXCEL (ESTABLE)
=========================== */

function generarExcel(){

db.ref("jugadores")
.once("value", snapshot=>{

let jugadores =
snapshot.val();

let contenido =
"Nombre,P1,P2,P3,P4,P5,P6,P7,P8,P9,Total,Estado\n";

if(jugadores){

Object.entries(jugadores)
.forEach(([id,j])=>{

let estado =
j.pagado ? "PAGADO":"PENDIENTE";

let fila=[

j.nombre,
...(j.selecciones || []),
j.total,
estado

];

contenido +=
fila.join(",")+"\n";

});

}

let blob =
new Blob([contenido],
{type:"text/csv"});

let link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"quiniela_jugadores.csv";

link.click();

});

}

/* ===========================
INICIAR
=========================== */

window.onload = function(){

cargar();
mostrarJugadores();

};
