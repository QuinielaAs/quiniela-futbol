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

${p.v} <img src="${p.logoV}" class="logo logo-derecha">

</div>

</div>

`;

});

}

/* ===========================
BOTONES L E V
=========================== */

function toggle(btn, i, val) {

    // Crear array si no existe
    if (!selecciones[i]) {
        selecciones[i] = [];
    }

    // Verificar si ya existe el valor
    if (selecciones[i].includes(val)) {

        // Quitar selección
        selecciones[i] = selecciones[i].filter(x => x !== val);
        btn.classList.remove("activo");

    } else {

        // Agregar selección
        selecciones[i].push(val);
        btn.classList.add("activo");

    }

    // Quitar enfoque visual (MUY IMPORTANTE)
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
document.getElementById(
"nombre"
).value;

let mensaje =
"📋 QUINIELA\n";

mensaje +=
"Nombre: "
+ nombre +
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

window.open(url);

}

</script>

</body>
</html>
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

<!-- LOGO LOCAL -->

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

<!-- EQUIPO LOCAL -->

<input
class="admin-input"
value="${p.l}"
oninput="editarEquipo(${i},'l',this.value)">

<span>vs</span>

<!-- EQUIPO VISITA -->

<input
class="admin-input"
value="${p.v}"
oninput="editarEquipo(${i},'v',this.value)">

<!-- LOGO VISITA -->

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
INICIO GENERAL
=========================== */

window.onload=function(){

cargar();
cargarAdmin();

                 }

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
