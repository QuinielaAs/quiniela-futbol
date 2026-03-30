/* ===========================
CONFIG
=========================== */

let numeroWhatsApp = "527821859759";
let costo = 25;

/* ===========================
PARTIDOS
=========================== */

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

/* ===========================
CLIENTE - MOSTRAR PARTIDOS
=========================== */

let lista = document.getElementById("lista");
let selecciones = {};

if(lista){

partidos.forEach((p,i)=>{

let div = document.createElement("div");

div.className = "partido";

div.innerHTML = `
<div class="equipo">${p[0]}</div>

<div class="botones">
<button class="btn" onclick="toggle(this,${i},'L')">L</button>
<button class="btn" onclick="toggle(this,${i},'E')">E</button>
<button class="btn" onclick="toggle(this,${i},'V')">V</button>
</div>

<div class="equipo">${p[2]}</div>
`;

lista.appendChild(div);

});

}

/* ===========================
SELECCION
=========================== */

function toggle(btn,i,val){

btn.classList.toggle("activo");

if(!selecciones[i]) selecciones[i]=[];

if(btn.classList.contains("activo")){
selecciones[i].push(val);
}else{
selecciones[i]=selecciones[i].filter(x=>x!=val);
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
if(c>0) combinaciones *= c;
}

let comb = document.getElementById("comb");
let total = document.getElementById("total");

if(comb) comb.innerText = combinaciones;
if(total) total.innerText = "$"+(combinaciones*costo);
}

/* ===========================
ENVIAR + GUARDAR
=========================== */

function enviar(){

let nombre = document.getElementById("nombre").value;

if(!nombre){
alert("Escribe tu nombre");
return;
}

let mensaje = "📋 QUINIELA\n\n";
mensaje += "Nombre: "+nombre+"\n\n";

partidos.forEach((p,i)=>{
let sel = (selecciones[i]||[]).join(",");
mensaje += p[0]+" vs "+p[2]+" = "+sel+"\n";
});

guardarJugador(nombre);

let url = "https://wa.me/"+numeroWhatsApp+"?text="+encodeURIComponent(mensaje);

window.open(url);
}

function guardarJugador(nombre){

let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

let picks = [];
let combinaciones = 1;

partidos.forEach((p,i)=>{

let sel = (selecciones[i]||[]);

picks.push(sel.join(""));

if(sel.length>0) combinaciones *= sel.length;

});

let total = combinaciones * costo;

jugadores.push({
nombre: nombre,
picks: picks,
pagado: false,
costo: total
});

localStorage.setItem("jugadores", JSON.stringify(jugadores));
}

/* ===========================
ADMIN - RESULTADOS
=========================== */

let resultadosTemp = [];

function mostrarResultados(){

let cont = document.getElementById("resultados");
if(!cont) return;

let guardados = JSON.parse(localStorage.getItem("resultados")) || [];
resultadosTemp = [...guardados];

cont.innerHTML = "";

partidos.forEach((p,i)=>{

let actual = guardados[i] || "";

cont.innerHTML += `
<div style="margin:5px 0">
<b>${p[0]} vs ${p[2]}</b><br>

<button onclick="setResultado(${i},'L')" ${actual=='L'?'style="background:green;color:white"':''}>L</button>

<button onclick="setResultado(${i},'E')" ${actual=='E'?'style="background:green;color:white"':''}>E</button>

<button onclick="setResultado(${i},'V')" ${actual=='V'?'style="background:green;color:white"':''}>V</button>
</div>
`;

});
}

function setResultado(i,val){
resultadosTemp[i] = val;
mostrarResultados();
}

function guardarResultados(){
localStorage.setItem("resultados", JSON.stringify(resultadosTemp));
alert("Resultados guardados");
}

/* ===========================
ACIERTOS
=========================== */

function calcularAciertos(picks, resultados){

let aciertos = 0;

for(let i=0; i<picks.length; i++){
if(picks[i] == resultados[i]){
aciertos++;
}
}

return aciertos;
}

/* ===========================
ADMIN - MOSTRAR JUGADORES
=========================== */

function mostrarJugadores(){

let cont = document.getElementById("listaJugadores");
if(!cont) return;

let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
let resultados = JSON.parse(localStorage.getItem("resultados")) || [];

cont.innerHTML="";

jugadores.forEach((j,i)=>{

let aciertos = calcularAciertos(j.picks, resultados);

cont.innerHTML += `
<div style="border:1px solid #ccc;padding:10px;margin:8px">

<b>${j.nombre}</b><br><br>

Picks:<br>
${j.picks.join(" | ")}<br><br>

Aciertos: <b>${aciertos}</b><br><br>

<button onclick="marcarPagado(${i})"
style="background:${j.pagado?'blue':'green'};color:white;border:none;padding:6px 12px">

${j.pagado?'PAGADO':'Confirmar Pago'}

</button>

</div>
`;
});
}

/* ===========================
PAGOS
=========================== */

function marcarPagado(i){

let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

jugadores[i].pagado = true;

localStorage.setItem("jugadores", JSON.stringify(jugadores));

mostrarJugadores();
}

/* ===========================
BORRAR
=========================== */

function borrarJugadores(){

if(!confirm("¿Borrar todo?")) return;

localStorage.removeItem("jugadores");

mostrarJugadores();
}

/* ===========================
EXCEL
=========================== */

function exportarExcel(){

let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
let resultados = JSON.parse(localStorage.getItem("resultados")) || [];

if(resultados.length == 0){
alert("Primero guarda resultados");
return;
}

let data = jugadores.map(j=>{

let aciertos = calcularAciertos(j.picks, resultados);

let fila = { Nombre: j.nombre };

j.picks.forEach((p,i)=>{
fila["P"+(i+1)] = p;
});

fila["Aciertos"] = aciertos;

return fila;
});

data.sort((a,b)=>b.Aciertos - a.Aciertos);

let ws = XLSX.utils.json_to_sheet(data);
let wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb, ws, "Resultados");

XLSX.writeFile(wb, "quiniela.xlsx");
}

/* ===========================
HORA LIMITE
=========================== */

function guardarHora(){
let h = document.getElementById("horaCierre").value;
localStorage.setItem("horaCierre",h);
alert("Guardado");
}

function borrarHora(){
localStorage.removeItem("horaCierre");
alert("Reiniciado");
}

function verificarHora(){

let hora = localStorage.getItem("horaCierre");
if(!hora) return;

let ahora = new Date();
let cierre = new Date(hora);

let botones = document.querySelectorAll(".btn");

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

setInterval(verificarHora,5000);
