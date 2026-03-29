let numeroWhatsApp =
"527821859759";

let costo = 25;

/* EJEMPLO PARTIDOS */

let partidos = [

["América",
"https://upload.wikimedia.org/wikipedia/en/7/79/Club_Am%C3%A9rica_logo.svg",
"Tigres",
"https://upload.wikimedia.org/wikipedia/en/9/9c/UANL_Tigres_logo.svg"],

["Chivas",
"https://upload.wikimedia.org/wikipedia/en/4/4a/Chivas_logo.svg",
"Pumas",
"https://upload.wikimedia.org/wikipedia/en/f/f7/Club_Universidad_Nacional_logo.svg"],

["Cruz Azul",
"https://upload.wikimedia.org/wikipedia/en/7/79/Cruz_Azul_logo.svg",
"León",
"https://upload.wikimedia.org/wikipedia/en/5/59/Club_Le%C3%B3n_logo.svg"],

["Monterrey",
"https://upload.wikimedia.org/wikipedia/en/7/7e/Monterrey_logo.svg",
"Santos",
"https://upload.wikimedia.org/wikipedia/en/0/07/Santos_Laguna_logo.svg"],

["Toluca",
"https://upload.wikimedia.org/wikipedia/en/7/72/Toluca_FC_logo.svg",
"Atlas",
"https://upload.wikimedia.org/wikipedia/en/8/86/Atlas_FC_logo.svg"]

];

let lista =
document.getElementById("lista");

let selecciones = {};

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

window.open(url);

}
