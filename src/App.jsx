import React, { useState, useEffect } from "react";
import { 
  BookOpen, Terminal, Lock, CheckCircle, Flame, Star, Trophy, 
  ChevronRight, Code2, Play, RotateCcw, Zap, Eye, LockKeyhole, Award 
} from "lucide-react";

// ── CONFIGURAÇÕES E SONS ─────────────────────────────────────────────────────
const SENHA_MESTRE = "prof2026";
const audioSuccess = new Audio("https://cdn.pixabay.com/audio/2022/03/24/audio_34979e2c67.mp3");
const audioError = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_0625624705.mp3");

const playSuccess = () => audioSuccess.play().catch(() => console.log("Áudio bloqueado"));
const playError = () => audioError.play().catch(() => console.log("Áudio bloqueado"));

// ── BANCO DE DADOS PEDAGÓGICO (30 FASES) ─────────────────────────────────────
const MODULOS = [
  {
    id: 0, sigla: "HTML", emoji: "🌐", titulo: "HTML — Estrutura",
    niveis: [
      { id:1, emoji:"🏗️", titulo:"Estrutura", cat:"Base", xp:100, aula:{ intro:"HTML define o esqueleto. O <h1> é o título.", blocos:[{t:"cod",c:"<h1>Título</h1>"}] }, desafio:{ inst:"Crie um `<h1>` com 'Minha Página'.", starter:"<body>\n  \n</body>", dica:"<h1>Minha Página</h1>" }, validacao: [{ regex: /<h1>Minha Página<\/h1>/i, erro: "Faltou o <h1>Minha Página</h1>" }], explicacao: "Tags dão significado ao texto." },
      { id:2, emoji:"✍️", titulo:"Parágrafos", cat:"Texto", xp:100, aula:{ intro:"Use <p> para textos longos.", blocos:[{t:"cod",c:"<p>Texto</p>"}] }, desafio:{ inst:"Crie um `<p>` com a palavra 'Bem-vindo'.", starter:"<body>\n  \n</body>", dica:"<p>Bem-vindo</p>" }, validacao: [{ regex: /<p>Bem-vindo<\/p>/i, erro: "Faltou o <p>Bem-vindo</p>" }], explicacao: "Diferencia títulos de textos comuns." },
      { id:3, emoji:"🔗", titulo:"Links", cat:"Navegação", xp:150, aula:{ intro:"O <a> cria links. O href diz para onde ir.", blocos:[{t:"cod",c:'<a href="url">Link</a>'}] }, desafio:{ inst:"Faça um link para 'https://google.com' com o texto 'Google'.", starter:"<body>\n  \n</body>", dica:'<a href="https://google.com">Google</a>' }, validacao: [{ regex: /<a\s+href=["']https:\/\/google\.com["']>Google<\/a>/i, erro: "Link incorreto." }], explicacao: "A base da internet: conectar páginas!" },
      { id:4, emoji:"📋", titulo:"Listas", cat:"Texto", xp:150, aula:{ intro:"<ul> agrupa itens (<li>).", blocos:[{t:"cod",c:"<ul><li>A</li></ul>"}] }, desafio:{ inst:"Crie uma `<ul>` com dois itens `<li>` (A e B).", starter:"<body>\n  \n</body>", dica:"<ul> <li>A</li> <li>B</li> </ul>" }, validacao: [{ regex: /<ul>[\s\S]*?(<li>.*?<\/li>[\s\S]*?){2,}<\/ul>/i, erro: "Precisa de uma <ul> com 2 <li>." }], explicacao: "Ótimo para menus de navegação." },
      { id:5, emoji:"📦", titulo:"Divs", cat:"Estrutura", xp:200, aula:{ intro:"<div> agrupa elementos em caixas.", blocos:[{t:"cod",c:'<div class="caixa"></div>'}] }, desafio:{ inst:"Crie uma `<div class='perfil'>` com um `<h2>` dentro.", starter:"<body>\n  \n</body>", dica:'<div class="perfil">\n  <h2>Nome</h2>\n</div>' }, validacao: [{ regex: /class\s*=\s*["']perfil["'][\s\S]*?<h2/i, erro: "Crie a div perfil contendo um h2." }], explicacao: "O bloco de montar mais usado na web." },
      { id:6, emoji:"🖼️", titulo:"Imagens", cat:"Mídia", xp:200, aula:{ intro:"A tag <img> carrega fotos. Use 'src' para o link.", blocos:[{t:"cod",c:'<img src="foto.jpg">'}] }, desafio:{ inst:"Adicione uma `<img>` com src 'foto.png'.", starter:"<body>\n  \n</body>", dica:'<img src="foto.png">' }, validacao: [{ regex: /<img\s+src=["']foto\.png["']\s*\/?>/i, erro: "A tag img deve ter o src='foto.png'." }], explicacao: "Imagens não têm tag de fechamento!" },
      { id:7, emoji:"🔘", titulo:"Botões", cat:"Interação", xp:200, aula:{ intro:"O <button> cria áreas clicáveis.", blocos:[{t:"cod",c:"<button>Ação</button>"}] }, desafio:{ inst:"Crie um `<button>` escrito 'Enviar'.", starter:"<body>\n  \n</body>", dica:"<button>Enviar</button>" }, validacao: [{ regex: /<button.*?>Enviar<\/button>/i, erro: "O botão deve ter o texto Enviar." }], explicacao: "Botões iniciam ações do usuário." },
      { id:8, emoji:"⌨️", titulo:"Inputs", cat:"Formulários", xp:250, aula:{ intro:"O <input> cria campos de texto.", blocos:[{t:"cod",c:'<input type="text">'}] }, desafio:{ inst:"Crie um `<input type='password'>`.", starter:"<body>\n  \n</body>", dica:'<input type="password">' }, validacao: [{ regex: /<input\s+type=["']password["']\s*\/?>/i, erro: "Faltou o input type='password'." }], explicacao: "Campos de senha escondem o texto digitado." },
      { id:9, emoji:"📝", titulo:"Forms", cat:"Formulários", xp:300, aula:{ intro:"O <form> envia dados de inputs.", blocos:[{t:"cod",c:"<form><input></form>"}] }, desafio:{ inst:"Crie um `<form>` contendo um `<input>` e um `<button>`.", starter:"<body>\n  \n</body>", dica:"<form>\n  <input type='text'>\n  <button>Ir</button>\n</form>" }, validacao: [{ regex: /<form>[\s\S]*?<input[\s\S]*?<button[\s\S]*?<\/form>/i, erro: "O form precisa conter input e button." }], explicacao: "A base dos sistemas de login." },
      { id:10, emoji:"👑", titulo:"Semântica", cat:"Boss 🔥", xp:400, aula:{ intro:"Tags como <header> e <footer> organizam o site para o Google.", blocos:[{t:"cod",c:"<header></header>"}] }, desafio:{ inst:"Crie um `<header>` com um `<h1>` e um `<footer>` com um `<p>`.", starter:"<body>\n  \n</body>", dica:"<header><h1>Topo</h1></header>\n<footer><p>Fim</p></footer>" }, validacao: [{ regex: /<header>[\s\S]*?<h1[\s\S]*?<\/header>[\s\S]*?<footer>[\s\S]*?<p[\s\S]*?<\/footer>/i, erro: "Crie o header com h1 e o footer com p." }], explicacao: "HTML semântico deixa a web mais acessível!" }
    ]
  },
  {
    id: 1, sigla: "CSS", emoji: "🎨", titulo: "CSS — O Estilo",
    niveis: [
      { id: 1, emoji: "🖌️", titulo: "Cores", cat: "Visual", xp: 100, aula: { intro: "'color' muda texto, 'background' o fundo.", blocos: [{ t: "cod", c: "h1 { color: red; }" }] }, desafio: { inst: "Mude o fundo do `body` para `black` e a cor do `h1` para `white`.", starter: "<style>\n\n</style>\n<body>\n  <h1>Oi</h1>\n</body>", dica: "body { background: black; } h1 { color: white; }" }, validacao: [{ regex: /body\s*{[^}]*background(-color)?:\s*black/i, erro: "Fundo black no body." }, { regex: /h1\s*{[^}]*color:\s*white/i, erro: "Texto white no h1." }], explicacao: "As cores dão vida ao site." },
      { id: 2, emoji: "✍️", titulo: "Fontes", cat: "Texto", xp: 100, aula: { intro: "Controle tamanho com 'font-size'.", blocos: [{ t: "cod", c: "p { font-size: 20px; }" }] }, desafio: { inst: "Deixe o `h1` com tamanho `48px`.", starter: "<style>\n  h1 { }\n</style>\n<h1>Título</h1>", dica: "h1 { font-size: 48px; }" }, validacao: [{ regex: /font-size:\s*48px/i, erro: "O h1 deve ter 48px." }], explicacao: "Tamanhos guiam os olhos do usuário." },
      { id: 3, emoji: "📦", titulo: "Box Model", cat: "Layout", xp: 150, aula: { intro: "Padding é o respiro interno da caixa.", blocos: [{ t: "cod", c: "div { padding: 20px; }" }] }, desafio: { inst: "Crie um padding de `30px` na `.caixa`.", starter: "<style>\n  .caixa { border: 1px solid red; }\n</style>\n<div class='caixa'>Oi</div>", dica: ".caixa { padding: 30px; }" }, validacao: [{ regex: /padding:\s*30px/i, erro: "Adicione padding: 30px;" }], explicacao: "O espaço vazio é essencial no design." },
      { id: 4, emoji: "🔲", titulo: "Flexbox", cat: "Layout", xp: 200, aula: { intro: "Flexbox alinha itens facilmente.", blocos: [{ t: "cod", c: "display: flex;" }] }, desafio: { inst: "Use `display: flex;` e `justify-content: space-between;` no menu.", starter: "<style>\n  .menu { }\n</style>\n<div class='menu'>\n  <b>Logo</b> <b>Sair</b>\n</div>", dica: "display: flex; justify-content: space-between;" }, validacao: [{ regex: /display:\s*flex/i, erro: "Use display flex." }, { regex: /justify-content:\s*space-between/i, erro: "Use justify-content: space-between;" }], explicacao: "A base dos menus modernos." },
      { id: 5, emoji: "🎯", titulo: "Centralizar", cat: "Layout", xp: 200, aula: { intro: "Alinhe no centro com 'center'.", blocos: [{ t: "cod", c: "align-items: center;" }] }, desafio: { inst: "Centralize verticalmente com `align-items: center`.", starter: "<style>\n  .tela { display: flex; height: 100vh; }\n</style>\n<div class='tela'>\n  <button>Botão</button>\n</div>", dica: "align-items: center; justify-content: center;" }, validacao: [{ regex: /align-items:\s*center/i, erro: "Faltou a vertical." }], explicacao: "Você dominou o centro da tela." },
      { id: 6, emoji: "🟢", titulo: "Bordas", cat: "Design", xp: 200, aula: { intro: "'border-radius' arredonda as pontas.", blocos: [{ t: "cod", c: "border-radius: 10px;" }] }, desafio: { inst: "Arredonde a `.caixa` com `border-radius: 50%`.", starter: "<style>\n  .caixa { width: 50px; height: 50px; background: red; }\n</style>\n<div class='caixa'></div>", dica: "border-radius: 50%;" }, validacao: [{ regex: /border-radius:\s*50%/i, erro: "Use border-radius: 50% para criar um círculo." }], explicacao: "50% transforma um quadrado em um círculo perfeito!" },
      { id: 7, emoji: "🖱️", titulo: "Hover", cat: "Efeitos", xp: 250, aula: { intro: "O `:hover` muda o estilo ao passar o mouse.", blocos: [{ t: "cod", c: "button:hover { background: blue; }" }] }, desafio: { inst: "Faça o `a:hover` ficar com `color: red`.", starter: "<style>\n  a { color: blue; }\n</style>\n<a>Link</a>", dica: "a:hover { color: red; }" }, validacao: [{ regex: /a:hover\s*{[^}]*color:\s*red/i, erro: "Crie a regra a:hover { color: red; }" }], explicacao: "Feedback visual é vital para a experiência do usuário." },
      { id: 8, emoji: "👻", titulo: "Sombras", cat: "Design", xp: 250, aula: { intro: "Sombras dão profundidade (X Y Blur Cor).", blocos: [{ t: "cod", c: "box-shadow: 2px 2px 5px black;" }] }, desafio: { inst: "Adicione `box-shadow: 5px 5px 10px gray;` no `.card`.", starter: "<style>\n  .card { width: 100px; height: 100px; border: 1px solid black; }\n</style>\n<div class='card'></div>", dica: "box-shadow: 5px 5px 10px gray;" }, validacao: [{ regex: /box-shadow:\s*5px\s+5px\s+10px\s+gray/i, erro: "Sombra incorreta." }], explicacao: "Elementos ganham aspecto 3D." },
      { id: 9, emoji: "⏱️", titulo: "Transição", cat: "Efeitos", xp: 300, aula: { intro: "Transições suavizam as mudanças.", blocos: [{ t: "cod", c: "transition: 0.3s;" }] }, desafio: { inst: "Adicione `transition: 0.5s;` no `button`.", starter: "<style>\n  button { background: gray; }\n  button:hover { background: black; }\n</style>\n<button>Suave</button>", dica: "button { transition: 0.5s; }" }, validacao: [{ regex: /button\s*{[^}]*transition:\s*0\.5s/i, erro: "Coloque a transition no bloco do botão principal." }], explicacao: "A web fica elegante com animações suaves." },
      { id: 10, emoji: "🍱", titulo: "Grid Básico", cat: "Boss 🔥", xp: 400, aula: { intro: "CSS Grid divide o layout em colunas.", blocos: [{ t: "cod", c: "display: grid; grid-template-columns: 1fr 1fr;" }] }, desafio: { inst: "Crie um grid no `.mural` com `grid-template-columns: 1fr 1fr;`.", starter: "<style>\n  .mural { display: grid; }\n</style>\n<div class='mural'>\n  <p>1</p><p>2</p>\n</div>", dica: "grid-template-columns: 1fr 1fr;" }, validacao: [{ regex: /grid-template-columns:\s*1fr\s+1fr/i, erro: "Faltou definir as colunas com 1fr 1fr." }], explicacao: "Você acaba de construir a fundação de sites como Pinterest e Instagram!" }
    ]
  },
  {
    id: 2, sigla: "JS", emoji: "⚡", titulo: "JS — Lógica",
    niveis: [
      { id: 1, emoji: "📝", titulo: "Variáveis", cat: "Lógica", xp: 100, aula: { intro: "'let' guarda dados.", blocos: [{ t: "cod", c: "let x = 10;" }] }, desafio: { inst: "Crie `let nome = 'WebLingo'` e dê um `alert(nome)`.", starter: "<script>\n</script>", dica: "let nome = 'WebLingo'; alert(nome);" }, validacao: [{ regex: /let\s+nome\s*=\s*["']WebLingo["']/i, erro: "Variável 'nome' errada." }, { regex: /alert\(\s*nome\s*\)/i, erro: "Chame alert(nome)." }], explicacao: "Memória básica da programação." },
      { id: 2, emoji: "⚙️", titulo: "Funções", cat: "Lógica", xp: 150, aula: { intro: "Funções agrupam códigos.", blocos: [{ t: "cod", c: "function oi() { }" }] }, desafio: { inst: "Crie `function avisar() { alert('Oi'); }`.", starter: "<script>\n</script>", dica: "function avisar() { alert('Oi'); }" }, validacao: [{ regex: /function\s+avisar\s*\(\)/i, erro: "Faltou a função avisar()." }, { regex: /alert\(["']Oi["']\)/i, erro: "O alert('Oi') deve estar dentro." }], explicacao: "Blocos reutilizáveis de código." },
      { id: 3, emoji: "🎯", titulo: "DOM", cat: "Navegador", xp: 150, aula: { intro: "O JS modifica o HTML.", blocos: [{ t: "cod", c: "document.getElementById('id').innerHTML = 'X';" }] }, desafio: { inst: "Mude o texto do `h1` (id='titulo') para 'DOM'.", starter: "<h1 id='titulo'>X</h1>\n<script>\n</script>", dica: "document.getElementById('titulo').innerHTML = 'DOM';" }, validacao: [{ regex: /getElementById\(["']titulo["']\)/i, erro: "Use getElementById no 'titulo'." }, { regex: /\.innerHTML\s*=\s*["']DOM["']/i, erro: "Texto deve ser 'DOM'." }], explicacao: "Interação dinâmica." },
      { id: 4, emoji: "🖱️", titulo: "Eventos", cat: "Interação", xp: 200, aula: { intro: "O usuário aciona o código.", blocos: [{ t: "cod", c: "<button onclick='...'>" }] }, desafio: { inst: "Adicione `onclick='mudar()'` no botão.", starter: "<button>Clique</button>\n<script>\n  function mudar() {}\n</script>", dica: "Adicione onclick no botão." }, validacao: [{ regex: /<button[\s\S]*?onclick=["']mudar\(\)["']/i, erro: "Faltou o onclick='mudar()'." }], explicacao: "O site reage a cliques." },
      { id: 5, emoji: "➕", titulo: "Contador", cat: "Estado", xp: 250, aula: { intro: "Variáveis mudam com o tempo.", blocos: [{ t: "cod", c: "n++;" }] }, desafio: { inst: "Na função, some 1 a `n` e atualize o `innerHTML`.", starter: "<span id='v'>0</span>\n<button onclick='s()'>+1</button>\n<script>\n let n=0; function s() { \n }\n</script>", dica: "n++; document.getElementById('v').innerHTML = n;" }, validacao: [{ regex: /n\s*(\+=\s*1|\+\+|= n\s*\+\s*1)/i, erro: "Aumente o n." }, { regex: /innerHTML\s*=\s*n/i, erro: "Atualize a tela com n." }], explicacao: "Lógica de Likes e Carrinhos de Compra." },
      { id: 6, emoji: "📚", titulo: "Arrays", cat: "Lógica", xp: 250, aula: { intro: "Arrays guardam listas de coisas.", blocos: [{ t: "cod", c: "let carros = ['Fusca', 'Gol'];" }] }, desafio: { inst: "Crie `let alunos = ['Ana', 'Bruno']`.", starter: "<script>\n  \n</script>", dica: "let alunos = ['Ana', 'Bruno'];" }, validacao: [{ regex: /let\s+alunos\s*=\s*\[["']Ana["']\s*,\s*["']Bruno["']\]/i, erro: "A lista deve conter 'Ana' e 'Bruno'." }], explicacao: "Bancos de dados inteiros cabem em listas." },
      { id: 7, emoji: "🔀", titulo: "Condicionais", cat: "Lógica", xp: 300, aula: { intro: "If/Else fazem o código tomar decisões.", blocos: [{ t: "cod", c: "if (n > 5) { }" }] }, desafio: { inst: "Se `nota` for maior que 5, dê um `alert('Passou')`.", starter: "<script>\n  let nota = 8;\n  if (  ) {\n    \n  }\n</script>", dica: "if (nota > 5) { alert('Passou'); }" }, validacao: [{ regex: /if\s*\(\s*nota\s*>\s*5\s*\)/i, erro: "A condição deve ser nota > 5." }, { regex: /alert\(["']Passou["']\)/i, erro: "Deve dar alert('Passou')." }], explicacao: "A inteligência dos sistemas." },
      { id: 8, emoji: "🔁", titulo: "Loops", cat: "Lógica", xp: 300, aula: { intro: "O laço `for` repete ações.", blocos: [{ t: "cod", c: "for(let i=0; i<3; i++) { }" }] }, desafio: { inst: "Crie um `for` repetindo 3 vezes (`i<3`) e rodando `n++`.", starter: "<script>\n  let n = 0;\n  for(let i=0; ; ) {\n    \n  }\n</script>", dica: "for(let i=0; i<3; i++) { n++; }" }, validacao: [{ regex: /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*3\s*;\s*i\+\+\s*\)/i, erro: "A estrutura do for deve ser let i=0; i<3; i++" }, { regex: /n\+\+/i, erro: "Rode n++ dentro do loop." }], explicacao: "Máquinas não cansam de repetir tarefas." },
      { id: 9, emoji: "📝", titulo: "Estilos via JS", cat: "DOM", xp: 350, aula: { intro: "O JS pode mudar o CSS (style).", blocos: [{ t: "cod", c: "el.style.color = 'red';" }] }, desafio: { inst: "Mude a `style.color` do id 'texto' para `red`.", starter: "<p id='texto'>Alerta!</p>\n<script>\n  // Seu código\n</script>", dica: "document.getElementById('texto').style.color = 'red';" }, validacao: [{ regex: /\.style\.color\s*=\s*["']red["']/i, erro: "Aplique a cor vermelha via style.color" }], explicacao: "Interfaces dinâmicas usam muito isso." },
      { id: 10, emoji: "🌙", titulo: "Dark Mode", cat: "Boss 🔥", xp: 500, aula: { intro: "ClassList adiciona/remove classes do CSS.", blocos: [{ t: "cod", c: "document.body.classList.toggle('dark');" }] }, desafio: { inst: "Ao clicar, acione `document.body.classList.toggle('darkMode')`.", starter: "<style>\n .darkMode { background: black; color: white; }\n</style>\n<button onclick=''>Tema</button>\n<script>\n function tema() {\n \n }\n</script>", dica: "Adicione onclick='tema()' e classList.toggle('darkMode')" }, validacao: [{ regex: /classList\.toggle\(["']darkMode["']\)/i, erro: "Use o toggle com a classe darkMode." }, { regex: /onclick=["']tema\(\)["']/i, erro: "Vincule o botão à função tema()." }], explicacao: "Você acaba de programar o botão de Tema Escuro mais usado no mundo!" }
    ]
  }
];

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function WebLingoPro() {
  const [nomeAluno, setNomeAluno] = useState(() => localStorage.getItem("wl_nome") || "");
  const [appIniciado, setAppIniciado] = useState(() => localStorage.getItem("wl_iniciado") === "true");
  const [finalizado, setFinalizado] = useState(() => localStorage.getItem("wl_finalizado") === "true");
  const [showModuleComplete, setShowModuleComplete] = useState(false); // NOVO ESTADO!
  
  const [xp, setXp] = useState(() => Number(localStorage.getItem("wl_xp")) || 0);
  const [done, setDone] = useState(() => JSON.parse(localStorage.getItem("wl_done")) || {});
  const [unlockedMods, setUnlockedMods] = useState(() => JSON.parse(localStorage.getItem("wl_unlocked")) || [0]);
  const [modIdx, setModIdx] = useState(() => Number(localStorage.getItem("wl_modIdx")) || 0);
  const [lvlIdx, setLvlIdx] = useState(() => Number(localStorage.getItem("wl_lvlIdx")) || 0);
  const [fase, setFase] = useState(() => localStorage.getItem("wl_fase") || "aula");
  
  const [userCode, setUserCode] = useState(() => {
    const savedCode = localStorage.getItem("wl_userCode");
    return savedCode !== null ? savedCode : MODULOS[0].niveis[0].desafio.starter;
  });

  const [feedback, setFeedback] = useState(null);
  const [showPassModal, setShowPassModal] = useState(null);
  const [passInput, setPassInput] = useState("");

  const mod = MODULOS[modIdx];
  const lvl = mod.niveis[lvlIdx];

  useEffect(() => {
    localStorage.setItem("wl_nome", nomeAluno);
    localStorage.setItem("wl_iniciado", appIniciado);
    localStorage.setItem("wl_finalizado", finalizado);
    localStorage.setItem("wl_xp", xp);
    localStorage.setItem("wl_done", JSON.stringify(done));
    localStorage.setItem("wl_unlocked", JSON.stringify(unlockedMods));
    localStorage.setItem("wl_modIdx", modIdx);
    localStorage.setItem("wl_lvlIdx", lvlIdx);
    localStorage.setItem("wl_fase", fase);
    localStorage.setItem("wl_userCode", userCode);
  }, [nomeAluno, appIniciado, finalizado, xp, done, unlockedMods, modIdx, lvlIdx, fase, userCode]);

  const tentarDesbloquear = () => {
    if (passInput === SENHA_MESTRE) {
      setUnlockedMods([...unlockedMods, showPassModal]);
      setModIdx(showPassModal);
      setLvlIdx(0);
      setUserCode(MODULOS[showPassModal].niveis[0].desafio.starter);
      setShowPassModal(null);
      setPassInput("");
      playSuccess();
    } else {
      playError();
      alert("Senha incorreta!");
    }
  };

  const analisarCodigo = () => {
    for (const regra of lvl.validacao) {
      if (!regra.regex.test(userCode)) {
        setFeedback({ tipo: "err", msg: regra.erro, emoji: "❌" });
        playError();
        return;
      }
    }
    const key = `${modIdx}-${lvlIdx}`;
    if (!done[key]) {
      setDone(prev => ({ ...prev, [key]: true }));
      setXp(prev => prev + lvl.xp);
    }
    playSuccess();
    setFeedback({ tipo: "ok", msg: "Mandou bem!", emoji: "🎉" });
  };

  const proximaFase = () => {
    // 1. Se for a FASE 10 do JAVASCRIPT -> FIM DE JOGO (Certificado)
    if (modIdx === 2 && lvlIdx === mod.niveis.length - 1) {
      setFinalizado(true);
      return;
    }
    
    // 2. Se for a ÚLTIMA fase do módulo (HTML ou CSS) -> Janela de Parabéns e Senha
    if (lvlIdx === mod.niveis.length - 1) {
      setShowModuleComplete(true);
      return;
    }

    // 3. Fase normal (Apenas avança para a próxima)
    const next = lvlIdx + 1;
    setLvlIdx(next);
    setUserCode(mod.niveis[next].desafio.starter);
    setFase("aula");
    setFeedback(null);
  };

  // 1. TELA DE INÍCIO
  if (!appIniciado) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white font-sans">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
          <Code2 className="w-16 h-16 text-orange-600 mx-auto mb-6" />
          <h1 className="text-3xl font-black mb-2 italic">WebLingo<span className="text-orange-600">.</span></h1>
          <p className="text-slate-400 mb-8">Bem-vindo à jornada de desenvolvimento web na **CEEFMTI ASSISOLINA ASSIS ANDRADE**!</p>
          <input 
            type="text" placeholder="Seu nome completo..." 
            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl mb-4 text-center outline-none focus:border-orange-500"
            value={nomeAluno} onChange={(e) => setNomeAluno(e.target.value)}
          />
          <button 
            disabled={nomeAluno.length < 3} onClick={() => setAppIniciado(true)}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded-2xl font-black transition-all"
          >
            INICIAR DESAFIO 🚀
          </button>
        </div>
      </div>
    );
  }

  // 2. TELA DE CERTIFICADO
  if (finalizado) {
    return (
      <div className="min-h-screen bg-white text-slate-900 p-8 flex flex-col items-center justify-center font-sans">
        <div className="border-[12px] border-double border-slate-200 p-12 max-w-3xl w-full text-center relative">
          <div className="absolute top-6 right-6 flex flex-col items-center opacity-80 rotate-12">
            <div className="w-16 h-16 border-4 border-orange-500 rounded-full flex items-center justify-center font-black text-orange-500 text-[10px] text-center p-1 leading-tight">
              SELO MAYA DE QUALIDADE
            </div>
          </div>
          <h3 className="text-orange-600 font-black uppercase tracking-[0.3em] mb-4 text-sm">Certificado de Conclusão</h3>
          <h1 className="text-5xl font-serif mb-8 italic">WebLingo Pro</h1>
          <p className="text-xl mb-2 text-slate-500">Certificamos que</p>
          <h2 className="text-4xl font-black mb-8 underline decoration-orange-500 underline-offset-8">{nomeAluno}</h2>
          <p className="max-w-md mx-auto leading-relaxed text-slate-600 mb-8 font-medium">
            Concluiu com êxito todos os 30 desafios de programação na <strong>CEEFMTI ASSISOLINA ASSIS ANDRADE</strong>, 
            dominando as bases de HTML, CSS e JavaScript.
          </p>
          <div className="flex justify-between items-end mt-16 border-t pt-8 border-slate-100">
            <div className="text-left">
              <p className="text-xs uppercase text-slate-400 font-bold">XP TOTAL CONQUISTADO</p>
              <p className="font-mono text-xl font-bold text-orange-600">{xp}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-slate-400 font-bold">Professor Titular</p>
              <p className="font-bold italic">Prof. Fábio Luiz</p>
            </div>
          </div>
        </div>
        <button onClick={() => window.print()} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black shadow-xl no-print">
           SALVAR CERTIFICADO (PDF)
        </button>
      </div>
    );
  }

  // 3. INTERFACE DO APP
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 font-sans relative">
      
      {/* MODAL DE FIM DE MÓDULO (NOVO) */}
      {showModuleComplete && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-sm text-center shadow-[0_0_50px_rgba(234,88,12,0.3)] animate-in zoom-in-95">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 drop-shadow-lg" />
            <h2 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Módulo Vencido!</h2>
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Incrível, {nomeAluno}! Você destruiu nos 10 desafios de <strong className="text-white">{MODULOS[modIdx].titulo}</strong>.<br/><br/>
              A etapa de {MODULOS[modIdx + 1]?.sigla || "Conclusão"} está trancada. <br/><span className="italic text-orange-400">Levante a mão e peça ao Professor Fábio Luiz para liberar a sua senha!</span>
            </p>
            <button 
              onClick={() => {
                setShowModuleComplete(false);
                setFeedback(null); // Limpa o feedback para não ficar na tela
              }} 
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-black transition-all active:scale-95"
            >
              CÓPIADO, PROFESSOR! 🚀
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE SENHA */}
      {showPassModal !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl">
            <LockKeyhole className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Módulo Trancado</h2>
            <p className="text-slate-400 text-sm mb-4 italic">Aguarde a instrução do Professor Fábio Luiz para liberar.</p>
            <input 
              type="password" placeholder="Senha de acesso..." 
              className="w-full bg-slate-800 border border-slate-600 p-3 rounded-xl mb-4 text-center focus:border-orange-500 outline-none"
              value={passInput} onChange={e => setPassInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && tentarDesbloquear()}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowPassModal(null)} className="flex-1 py-3 text-sm text-slate-400">Voltar</button>
              <button onClick={tentarDesbloquear} className="flex-1 py-3 bg-orange-600 rounded-xl font-bold">Liberar</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Code2 className="text-orange-500" size={32} />
          <h1 className="text-2xl font-black italic tracking-tighter">WebLingo<span className="text-orange-600">.</span></h1>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-4 shadow-inner">
          <div className="flex items-center gap-2 text-yellow-500 font-bold"><Star size={18} fill="currentColor"/> {xp} XP</div>
        </div>
      </header>

      {/* SELETOR DE MÓDULOS */}
      <nav className="max-w-5xl mx-auto flex gap-3 mb-8">
        {MODULOS.map((m, idx) => {
          const isUnlocked = unlockedMods.includes(idx);
          return (
            <button 
              key={idx}
              onClick={() => {
                if(isUnlocked) {
                  setModIdx(idx);
                  setLvlIdx(0);
                  setFase("aula");
                  setUserCode(MODULOS[idx].niveis[0].desafio.starter);
                  setFeedback(null);
                } else {
                  setShowPassModal(idx);
                }
              }}
              className={`flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${modIdx === idx ? 'bg-orange-600 border-orange-400 shadow-lg shadow-orange-900/20' : 'bg-slate-900 border-slate-800'}`}
            >
              <span className="text-2xl">{isUnlocked ? m.emoji : <Lock size={20} className="text-slate-600"/>}</span>
              <span className="font-bold text-[10px] uppercase tracking-widest">{m.sigla}</span>
            </button>
          );
        })}
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit shadow-xl relative z-10">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-black">{lvl.titulo}</h2>
            <div className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-mono">Fase {lvlIdx + 1}/10</div>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setFase("aula")} className={`px-6 py-2 rounded-xl font-bold text-sm ${fase === "aula" ? "bg-white text-black" : "bg-slate-800"}`}>Aula</button>
            <button onClick={() => setFase("desafio")} className={`px-6 py-2 rounded-xl font-bold text-sm ${fase === "desafio" ? "bg-orange-600" : "bg-slate-800"}`}>Desafio</button>
          </div>

          {fase === "aula" ? (
            <div className="text-slate-300 space-y-4 animate-in fade-in">
              <p className="leading-relaxed">{lvl.aula.intro}</p>
              <div className="bg-black p-4 rounded-xl border border-slate-800"><code className="text-orange-400 text-sm">{lvl.aula.blocos[0].c}</code></div>
              <button onClick={() => setFase("desafio")} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">Começar Missão <ChevronRight size={18}/></button>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="bg-orange-600/10 border border-orange-600/20 p-4 rounded-2xl">
                <p className="text-sm leading-relaxed"><Zap size={16} className="inline mr-2 text-orange-500"/>{lvl.desafio.inst}</p>
              </div>
              
              {feedback && (
                <div className={`p-5 rounded-2xl border-2 animate-in zoom-in-95 ${feedback.tipo === 'ok' ? 'bg-green-600/10 border-green-500' : 'bg-red-600/10 border-red-500'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{feedback.emoji}</span>
                    <span className={`font-black uppercase tracking-tight ${feedback.tipo === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
                      {feedback.tipo === 'ok' ? 'Mandou bem!' : 'Quase lá!'}
                    </span>
                  </div>
                  {feedback.tipo === 'ok' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-green-100 italic leading-relaxed">"{lvl.explicacao}"</p>
                      <button onClick={proximaFase} className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2">PRÓXIMA FASE <ChevronRight size={14}/></button>
                    </div>
                  ) : <p className="text-xs text-red-200">{feedback.msg}</p>}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-4 relative z-0">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 py-3 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">Editor Code</span>
              <div className="flex gap-2">
                <button onClick={() => setUserCode(lvl.desafio.starter)} className="p-1.5 hover:bg-slate-700 rounded text-slate-500"><RotateCcw size={14}/></button>
                <button onClick={analisarCodigo} className="bg-orange-600 px-6 py-1.5 rounded-lg text-xs font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all"><Play size={14} fill="currentColor"/> TESTAR</button>
              </div>
            </div>
            <textarea 
              className="w-full h-56 bg-black p-5 font-mono text-sm text-green-400 outline-none resize-none leading-relaxed"
              value={userCode} onChange={e => setUserCode(e.target.value)} spellCheck={false}
            />
          </div>
          <div className="bg-white rounded-3xl overflow-hidden h-44 border-8 border-slate-900 shadow-inner">
             <iframe srcDoc={userCode} className="w-full h-full border-none" title="preview" sandbox="allow-scripts"/>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md p-4 no-print border-t border-slate-900 z-50">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Award size={20} className="text-orange-500"/>
          <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-orange-600 transition-all duration-1000" style={{width: `${(Object.keys(done).length / 30) * 100}%`}}/>
          </div>
          <span className="text-xs font-black text-slate-500">{Object.keys(done).length}/30</span>
        </div>
      </footer>

      <style>{`
        @media print { .no-print { display: none !important; } }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}