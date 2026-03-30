/* ===========================
CONFIGURACION GENERAL
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
RESULTADOS ADMIN
=========================== */

let resultadosTemp = [];

function mostrarResultados(){

let cont = document.getElementById("resultados");
if(!cont) return;

let guardados =
JSON.parse(localStorage.getItem("resultados")) || [];

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
ACERTOS
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
MOSTRAR JUGADORES + ACIERTOS
=========================== */

function mostrarJugadores(){

let cont = document.getElementById("listaJugadores");
if(!cont) return;

let jugadores =
JSON.parse(localStorage.getItem("jugadores")) || [];

let resultados =
JSON.parse(localStorage.getItem("resultados")) || [];

cont.innerHTML="";

jugadores.forEach((j,i)=>{

let aciertos = calcularAciertos(j.picks, resultados);

cont.innerHTML += `
<div style="border:1px solid #ccc;padding:10px;margin:8px">

<b>${j.nombre}</b><br><br>

Picks:<br>
${j.picks.join(" | ")}<br><br>

Aciertos:
<b>${aciertos}</b><br><br>

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

let jugadores =
JSON.parse(localStorage.getItem("jugadores")) || [];

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
EXCEL 🔥
=========================== */

function exportarExcel(){

let jugadores =
JSON.parse(localStorage.getItem("jugadores")) || [];

let resultados =
JSON.parse(localStorage.getItem("resultados")) || [];

if(resultados.length == 0){
alert("Primero guarda resultados");
return;
}

let data = jugadores.map(j=>{

let aciertos =
calcularAciertos(j.picks, resultados);

let fila = {
Nombre: j.nombre
};

j.picks.forEach((p,i)=>{
fila["P"+(i+1)] = p;
});

fila["Aciertos"] = aciertos;

return fila;
});

/* ORDENAR */
data.sort((a,b)=>b.Aciertos - a.Aciertos);

/* CREAR ARCHIVO */
let ws = XLSX.utils.json_to_sheet(data);
let wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb, ws, "Resultados");

XLSX.writeFile(wb, "quiniela.xlsx");
}

/* ===========================
PDF (YA TENIAS)
=========================== */

function generarPDFGeneral(){

const { jsPDF } = window.jspdf;

let doc = new jsPDF("landscape");

let jugadores =
JSON.parse(localStorage.getItem("jugadores")) || [];

let pagados = jugadores.filter(j=>j.pagado);

if(pagados.length==0){
alert("No hay pagados");
return;
}

let y = 10;

doc.text("QUINIELA",10,y);
y+=10;

pagados.forEach((j,i)=>{

doc.text((i+1)+" "+j.nombre,10,y);

let col = 60;

j.picks.forEach(p=>{
doc.text(p,col,y);
col+=20;
});

y+=8;

});

doc.save("quiniela.pdf");
}

/* ===========================
HORA
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
