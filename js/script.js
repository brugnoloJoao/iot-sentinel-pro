"use strict";



/* ── MODELAGEM COM CLASS ────────────────── */

class Sensor {

constructor(nome, tipo, valor) {

this.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

this.nome = nome;

this.tipo = tipo;

this.valor = parseFloat(valor);

this.hora = new Date().toLocaleTimeString("pt-BR");

}



// Método interno para gerenciar a lógica do status do próprio sensor

get status() {

if (this.tipo === "TEMPERATURA" && this.valor > 50) return "CRÍTICO";

if (this.tipo === "PRESSÃO" && this.valor > 100) return "CRÍTICO";

if (this.tipo === "UMIDADE" && (this.valor < 30 || this.valor > 80)) return "CRÍTICO";

return "NORMAL";

}

}



/* ── CONFIGURAÇÕES E MAPAS ────────────────── */

const CHAVE = "sensorwatch_dados";

let sensores = [];

let grafico = null;



const mapaUnidades = { TEMPERATURA: "°C", PRESSÃO: "Bar", UMIDADE: "%" };

const mapaIcones = { TEMPERATURA: "🌡", PRESSÃO: "⊙", UMIDADE: "💧" };



/* ── INICIALIZAÇÃO ──────────────────────── */

document.addEventListener("DOMContentLoaded", () => {

const dadosSalvos = localStorage.getItem(CHAVE);

if (dadosSalvos) {

// Repercute os dados salvos recriando as instâncias da classe

const listaRaw = JSON.parse(dadosSalvos);

sensores = listaRaw.map(s => {

const novo = new Sensor(s.nome, s.tipo, s.valor);

novo.id = s.id; // Mantém o ID original

novo.hora = s.hora; // Mantém a hora original

return novo;

});

}


criarGrafico();

renderizar();

configurarEventosFinais();

});



// LocalStorage

function salvar() {

localStorage.setItem(CHAVE, JSON.stringify(sensores));

}



/* ── ADICIONAR SENSOR ───────────────────── */

function adicionarSensor() {

const nome = document.getElementById("inputNome").value.trim();

const tipo = document.getElementById("selectTipo").value.toUpperCase();

const valorTexto = document.getElementById("inputValor").value.trim();

const valor = parseFloat(valorTexto);



if (!nome || !tipo || valorTexto === "" || isNaN(valor)) {

alert("Preencha todos os campos com valores válidos.");

return;

}



// Instanciando a classe obrigatória

const novoSensor = new Sensor(nome, tipo, valor);



sensores.push(novoSensor);

salvar();

renderizar();



// Limpar formulário

document.getElementById("inputNome").value = "";

document.getElementById("selectTipo").value = "";

document.getElementById("inputValor").value = "";

atualizarUnidade();

}



/* ── REMOVER SENSOR ─────────────────────── */

// Tornando global para os botões inline continuarem funcionando temporariamente

window.removerSensor = function(id) {

sensores = sensores.filter(s => s.id !== id);

salvar();

renderizar();

};



/* ── RENDERIZAÇÃO E CARDS ───────────────── */

function renderizar() {

const grid = document.getElementById("grid");

if (!grid) return;

grid.innerHTML = "";



// Uso obrigatório do .forEach()

sensores.forEach(sensor => {

const critico = sensor.status === "CRÍTICO";

const unidade = mapaUnidades[sensor.tipo] || "";

const icone = mapaIcones[sensor.tipo] || "◎";



const card = document.createElement("div");

card.className = `card ${critico ? "critico" : ""}`;

card.dataset.tipo = sensor.tipo;



card.innerHTML = `

<div class="card-topo">

<span class="card-icone">${icone}</span>

<span class="badge ${critico ? "critico" : "normal"}">

${critico ? "⚠ CRÍTICO" : "● NORMAL"}

</span>

</div>

<div>

<div class="card-nome">${sensor.nome}</div>

<div class="card-tipo">${sensor.tipo}</div>

</div>

<div class="card-valor">

${sensor.valor} <span class="card-unidade">${unidade}</span>

</div>

<div class="card-rodape">

<span class="card-hora">⏱ ${sensor.hora}</span>

<button class="btn-remover" onclick="removerSensor('${sensor.id}')">✕</button>

</div>

`;

grid.appendChild(card);

});



atualizarContadores();

atualizarGrafico();

}



/* ── CONTADORES E MÉDIAS ────────────────── */

function atualizarContadores() {

const total = sensores.length;

// Uso obrigatório do .filter()

const critico = sensores.filter(s => s.status === "CRÍTICO").length;



document.getElementById("ctTotal").textContent = total;

document.getElementById("ctCritico").textContent = critico;

document.getElementById("ctNormal").textContent = total - critico;

}



function calcularMedias() {

return ["TEMPERATURA", "PRESSÃO", "UMIDADE"].map(cat => {

// REQUISITO 4: .filter() e .reduce() encadeados/combinados

const filtrados = sensores.filter(s => s.tipo === cat);

if (filtrados.length === 0) return 0;


const soma = filtrados.reduce((acc, s) => acc + s.valor, 0);

return parseFloat((soma / filtrados.length).toFixed(2));

});

}



/* ── GRÁFICO (Chart.js) ────── */

function criarGrafico() {

const canvas = document.getElementById("grafico");

if (!canvas) return;

const ctx = canvas.getContext("2d");

grafico = new Chart(ctx, {

type: "bar",

data: {

labels: ["🌡 Temperatura (°C)", "⊙ Pressão (Bar)", "💧 Umidade (%)"],

datasets: [{

label: "Média operacional",

data: [0, 0, 0],

backgroundColor: ["#fb923c", "#38bdf8", "#4ade80"]

}]

},

options: {

responsive: true,

maintainAspectRatio: false,

scales: { y: { beginAtZero: true } }

}

});

}



function atualizarGrafico() {

if (!grafico) return;

grafico.data.datasets[0].data = calcularMedias();

grafico.update();

}



/* ── EVENTOS DO DOM E HIGIENIZAÇÃO ── */

function atualizarUnidade() {

const tipo = document.getElementById("selectTipo").value;

document.getElementById("unidadeLabel").textContent = mapaUnidades[tipo] || "—";

document.getElementById("avisoValor").textContent = "";

}



function verificarCritico() {

const tipo = document.getElementById("selectTipo").value;

const valorTexto = document.getElementById("inputValor").value.trim();

const valor = parseFloat(valorTexto);

const aviso = document.getElementById("avisoValor");



if (!aviso) return;



if (tipo && !isNaN(valor)) {

// Usando a lógica da classe temporariamente para o validador

const sensorTemp = new Sensor("Temp", tipo, valor);

if (sensorTemp.status === "CRÍTICO") {

aviso.textContent = "⚠ Valor fora do limite!";

return;

}

}

aviso.textContent = "";

}



function configurarEventosFinais() {

// Vinculando explicitamente o onblur no DOM para validação imediata ao sair do campo

const inputValor = document.getElementById("inputValor");

if (inputValor) {

inputValor.addEventListener("blur", verificarCritico);

inputValor.addEventListener("input", verificarCritico);

}


const selectTipo = document.getElementById("selectTipo");

if (selectTipo) {

selectTipo.addEventListener("change", () => {

atualizarUnidade();

verificarCritico();

});

}

}



// Atalho Enter (keyup)

document.addEventListener("keyup", e => {

if (e.key === "Enter") adicionarSensor();

});