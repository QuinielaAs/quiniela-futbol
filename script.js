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

Object.keys(jugadores)
.forEach(key=>{

let j = jugadores[key];

let color =
j.pagado ? "green" : "red";

let estado =
j.pagado ? "PAGADO" : "PENDIENTE";

/* CREAR PICKS */

let picksTexto = "";

if(j.selecciones){

j.selecciones.forEach((s,i)=>{

if(s && s.length>0){

picksTexto +=
"P"+(i+1)+":"+s.join("")+" ";

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
onclick="confirmarPago('${key}')">

Confirmar Pago

</button>

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
GENERAR COMBINACIONES SEGURAS
=========================== */

function generarCombinaciones(selecciones){

let listas = [];

selecciones.forEach(s=>{

if(s){

if(Array.isArray(s)){

listas.push(s);

}else{

listas.push(Object.values(s));

}

}

});

let resultados = [[]];

listas.forEach(lista=>{

let nuevas = [];

resultados.forEach(r=>{

lista.forEach(opcion=>{

nuevas.push([...r, opcion]);

});

});

resultados = nuevas;

});

return resultados;

}

/* ===========================
EXCEL PROFESIONAL MEJORADO
=========================== */

async function generarExcelGeneral(){

try{

let snapshot =
await db.ref("jugadores").once("value");

let jugadores =
snapshot.val();

if(!jugadores){

alert("No hay jugadores");
return;

}

let partidos =
JSON.parse(
localStorage.getItem("partidos")
) || [];

/* ===========================
CREAR LIBRO
=========================== */

let workbook =
new ExcelJS.Workbook();

let sheet =
workbook.addWorksheet("Quiniela");

    /* ===========================
CONFIGURACION PARA PDF
=========================== */

sheet.pageSetup = {

paperSize: 9, // A4

orientation: 'landscape', // horizontal

horizontalCentered: true,

verticalCentered: true,

fitToPage: true,

fitToWidth: 1,

fitToHeight: 1,

margins: {
left: 0.3,
right: 0.3,
top: 0.5,
bottom: 0.5,
header: 0.3,
footer: 0.3
}

};

/* ===========================
COLUMNAS
=========================== */

let columnas = [];

columnas.push({width:5});  
columnas.push({width:20}); 

for(let i=0;i<partidos.length;i++){

columnas.push({width:5});

}

columnas.push({width:10}); 

sheet.columns = columnas;

/* ===========================
CREAR FILAS 1–4
=========================== */

sheet.addRow([]); // fila 1
sheet.addRow([]); // fila 2
sheet.addRow([]); // fila 3
sheet.addRow([]); // fila 4 RESULTADOS

/* ===========================
ENCABEZADOS
=========================== */

sheet.mergeCells("A1:A3");
sheet.getCell("A1").value = "No.";

sheet.mergeCells("B1:B3");
sheet.getCell("B1").value = "Nombre";

/* PARTIDOS */

for(let i=0;i<partidos.length;i++){

let col = i + 3;

sheet.getCell(2,col).value = "VS";

}

/* ACIERTOS */

let colFinal =
partidos.length + 3;

sheet.mergeCells(
1,colFinal,
3,colFinal
);

sheet.getCell(1,colFinal)
.value = "ACIERTOS";

/* ===========================
FILA RESULTADOS (FILA 4)
=========================== */

sheet.getCell(4,2).value =
"RESULTADOS";

for(let i=0;i<partidos.length;i++){

sheet.getCell(
4,
3 + i
).value = "";

}

/* ===========================
LOGOS
=========================== */

for(let i=0;i<partidos.length;i++){

let col = i + 3;

let p = partidos[i];

try{

let imgLocal =
await fetch(p.logoL)
.then(r=>r.blob())
.then(b=>b.arrayBuffer());

let idLocal =
workbook.addImage({
buffer: imgLocal,
extension: 'png'
});

sheet.addImage(idLocal,{
tl:{col:col-1,row:0},
ext:{width:40,height:40}
});

let imgVisita =
await fetch(p.logoV)
.then(r=>r.blob())
.then(b=>b.arrayBuffer());

let idVisita =
workbook.addImage({
buffer: imgVisita,
extension: 'png'
});

sheet.addImage(idVisita,{
tl:{col:col-1,row:2},
ext:{width:40,height:40}
});

}catch(e){

console.log("Error logo:",p.logoL);

}

}

/* ===========================
JUGADORES (DESDE FILA 5)
=========================== */

let numero = 1;

Object.keys(jugadores)
.forEach(key=>{

let j = jugadores[key];

if(j.pagado && j.selecciones){

let combinaciones =
generarCombinaciones(
j.selecciones
);

combinaciones.forEach(c=>{

let fila = [];

fila.push(numero);
fila.push(j.nombre);

/* PICKS */

c.forEach(v=>{

fila.push(v);

});

/* FORMULA ACIERTOS */

let filaJugador =
sheet.rowCount + 1;

let letraInicio = "C";

let letraFin =
String.fromCharCode(
67 + partidos.length - 1
);

fila.push({
formula:
`(C${filaJugador}=C4)+(D${filaJugador}=D4)+(E${filaJugador}=E4)+(F${filaJugador}=F4)+(G${filaJugador}=G4)+(H${filaJugador}=H4)+(I${filaJugador}=I4)+(J${filaJugador}=J4)+(K${filaJugador}=K4)`,
result: 0
});

/* AGREGAR FILA */

sheet.addRow(fila);

numero++;

});

}

});

/* ===========================
CONGELAR FILAS
=========================== */

sheet.views = [
{
state:'frozen',
ySplit:4
}
];
    
    
/* DESCARGAR */

let semana = 1;

let input =
document.getElementById("semana");

if(input){

semana = input.value || 1;

}

let buffer =
await workbook.xlsx.writeBuffer();

let blob =
new Blob([buffer]);

let link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"Quiniela_Profesional_Semana_"+semana+".xlsx";

link.click();

}catch(error){

console.log(error);

alert("Error generando Excel");

}

    }

function numeroALetra(num){

let letra = "";

while(num > 0){

let mod = (num - 1) % 26;

letra =
String.fromCharCode(65 + mod)
+ letra;

num =
Math.floor((num - mod) / 26);

}

return letra;

}
