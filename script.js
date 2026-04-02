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

{
l:"América",
v:"Tigres",
logoL:"logos/america.png",
logoV:"logos/tigres.png"
},

{
l:"Chivas",
v:"Pumas",
logoL:"logos/guadalajara.png",
logoV:"logos/pumas.png"
},

{
l:"Cruz Azul",
v:"León",
logoL:"logos/cruzazul.png",
logoV:"logos/leon.png"
},

{
l:"Toluca",
v:"Atlas",
logoL:"logos/toluca.png",
logoV:"logos/atlas.png"
},

{
l:"Monterrey",
v:"Santos",
logoL:"logos/monterrey.png",
logoV:"logos/santos.png"
},

{
l:"Necaxa",
v:"Puebla",
logoL:"logos/necaxa.png",
logoV:"logos/puebla.png"
},

{
l:"Mazatlán",
v:"Juárez",
logoL:"logos/mazatlan.png",
logoV:"logos/juarez.png"
},

{
l:"Querétaro",
v:"Pachuca",
logoL:"logos/queretaro.png",
logoV:"logos/pachuca.png"
},

{
l:"Tijuana",
v:"San Luis",
logoL:"logos/tijuana.png",
logoV:"logos/atleticosl.png"
}

];

// Guardar partidos
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

/* ===========================
VALIDAR HORA CIERRE
=========================== */

let horaGuardada =
localStorage.getItem("horaCierre");

if(horaGuardada){

let ahora = new Date();

let cierre =
new Date(horaGuardada);

if(ahora >= cierre){

alert("⛔ La quiniela ya está cerrada");

return;

}

}

/* ===========================
TOGGLE NORMAL
=========================== */

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

document.getElementById("comb").innerText =
totalComb;

document.getElementById("total").innerText =
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

// Obtener partidos
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


/* ===========================
GUARDAR JUGADOR MEJORADO
=========================== */

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

// calcular combinaciones

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

selecciones: JSON.parse(
JSON.stringify(selecciones)
),

combinaciones: totalComb,

total: totalPago,

pagado: false,

fecha: new Date().toLocaleString()

});

localStorage.setItem(
"jugadores",
JSON.stringify(jugadores)
);

/* ===========================
ENVIAR WHATSAPP
=========================== */

let url =
"https://wa.me/"
+numeroWhatsApp
+"?text="
+encodeURIComponent(mensaje);

window.open(url,"_blank");

alert("Quiniela guardada correctamente");

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
SUBIR LOGOS
=========================== */

function subirLogo(i,tipo,input){

let file = input.files[0];

if(!file) return;

let reader = new FileReader();

reader.onload=function(e){

let partidos =
JSON.parse(localStorage.getItem("partidos"));

if(tipo=="l"){

partidos[i].logoL = e.target.result;

document.getElementById(
"imgL"+i
).src = e.target.result;

}

if(tipo=="v"){

partidos[i].logoV = e.target.result;

document.getElementById(
"imgV"+i
).src = e.target.result;

}

localStorage.setItem(
"partidos",
JSON.stringify(partidos)
);

};

reader.readAsDataURL(file);

}

/* ===========================
INICIO GENERAL
=========================== */

window.onload=function(){

cargar();
cargarAdmin();

}

/* ===========================
GUARDAR HORA CIERRE
=========================== */

function guardarHora(){

let hora =
document.getElementById("horaCierre").value;

if(!hora){

alert("Selecciona una hora");

return;

}

localStorage.setItem(
"horaCierre",
hora
);

alert("Hora guardada correctamente✅");

}

/* ===========================
REINICIAR HORA
=========================== */

function borrarHora(){

localStorage.removeItem(
"horaCierre"
);

document.getElementById(
"horaCierre"
).value="";

alert("Hora reiniciada");

}

/* ===========================
MOSTRAR JUGADORES
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

div.innerHTML=
"No hay jugadores registrados";

return;

}

jugadores.forEach((j,i)=>{

div.innerHTML += `

<div style="
border:1px solid #ccc;
padding:8px;
margin:5px 0">

<b>${j.nombre}</b>

</div>

`;

});

}

/* ===========================
BORRAR JUGADORES
=========================== */

function borrarJugadores(){

if(
!confirm(
"¿Seguro que deseas borrar todos los jugadores?"
)
) return;

localStorage.removeItem(
"jugadores"
);

mostrarJugadores();

alert("Jugadores eliminados");

}

/* ===========================
GENERAR EXCEL
=========================== */

function generarExcelGeneral(){

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

if(jugadores.length==0){

alert("No hay jugadores");

return;

}

let datos = [];

jugadores.forEach(j=>{

let fila = {};

fila["Nombre"] =
j.nombre;

if(j.selecciones){

j.selecciones.forEach((s,i)=>{

fila[
"Partido "+(i+1)
] = s.join(",");

});

}

datos.push(fila);

});

let hoja =
XLSX.utils.json_to_sheet(datos);

let libro =
XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
libro,
hoja,
"Quiniela"
);

let semana =
document.getElementById(
"semana"
).value || 1;

XLSX.writeFile(
libro,
"Quiniela_Semana_"+semana+".xlsx"
);

}
