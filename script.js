let numeroWhatsApp =
"527821859759";

let costo = 25;

/* PARTIDOS */

let partidos = [

["América","","Tigres",""],

["Chivas","","Pumas",""],

["Cruz Azul","","León",""],

["Monterrey","","Santos",""],

["Toluca","","Atlas",""],

["Pachuca","","Necaxa",""],

["Mazatlán","","Tijuana",""],

["San Luis","","Querétaro",""],

["Puebla","","Juárez",""]

];

let lista =
document.getElementById("lista");

let selecciones = {};

/* CREAR PARTIDOS */

partidos.forEach((p,i)=>{

let div =
document.createElement("div");

div.className="partido";

div.innerHTML=`

<img src="${p[1]}" class="logo">

<div class="equipo">${p[0]}</div>

<div class="botones">

<button class="btn"
onclick="toggle(this,${i},'L')">L</button>

<button class="btn"
onclick="toggle(this,${i},'E')">E</button>

<button class="btn"
onclick="toggle(this,${i},'V')">V</button>

</div>

<div class="equipo">${p[2]}</div>

<img src="${p[3]}" class="logo">

`;

lista.appendChild(div);

});

/* SELECCIONAR */

function toggle(btn,i,val){

btn.classList.toggle("activo");

if(!selecciones[i])
selecciones[i]=[];

if(btn.classList.contains("activo")){

selecciones[i].push(val);

}else{

selecciones[i]=
selecciones[i].filter(
x=>x!=val
);

}

calcular();

}

/* CALCULAR TOTAL */

function calcular(){

let combinaciones=1;

for(let i in selecciones){

let c =
selecciones[i].length;

if(c>0)
combinaciones*=c;

}

document.getElementById(
"comb"
).innerText =
combinaciones;

document.getElementById(
"total"
).innerText =
"$"+(combinaciones*costo);

}

/* ENVIAR WHATSAPP */

function enviar(){

let nombre =
document.getElementById("nombre").value;

let mensaje =
"📋 QUINIELA\n";

mensaje +=
"Nombre: "
+nombre+
"\n\n";

partidos.forEach((p,i)=>{

let sel =
(selecciones[i]||[])
.join(",");

mensaje +=
p[0]+" vs "
+p[2]
+" = "
+sel+"\n";

});

let url =
"https://wa.me/"
+numeroWhatsApp
+"?text="
+encodeURIComponent(
mensaje
);

  guardarJugador(nombre);

window.open(url);

}

/* VERIFICAR HORA (VERSIÓN CORRECTA) */

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

/* REVISAR CADA 5 SEGUNDOS */

setInterval(
verificarHora,
5000
);

/* EJECUTAR AL CARGAR */

window.onload = function(){

verificarHora();

}

function guardarHora(){

let horaInput =
document.getElementById(
"horaCierre"
);

if(!horaInput){

alert("No se encontró el campo hora");

return;

}

let valor = horaInput.value;

if(!valor){

alert("Selecciona una hora");

return;

}

localStorage.setItem(
"horaCierre",
valor
);

alert(
"Hora guardada correctamente"
);

  }

function guardarJugador(nombre){

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

let picksFila = [];

partidos.forEach((p,i)=>{

let sel =
(selecciones[i]||[])
.join("");

picksFila.push(sel);

});

jugadores.push({

nombre: nombre,

picks: picksFila

});

localStorage.setItem(
"jugadores",
JSON.stringify(jugadores)
);

}

function generarPDFGeneral(){

const { jsPDF } = window.jspdf;

let doc =
new jsPDF("landscape");

let jugadores =
JSON.parse(
localStorage.getItem("jugadores")
) || [];

let x = 10;

let y = 10;

/* TITULO */

doc.setFontSize(14);

doc.text(
"QUINIELA GENERAL",
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

jugadores.forEach((j,index)=>{

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
"quiniela_general.pdf"
);

  }
