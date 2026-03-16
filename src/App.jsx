import React, { useState, useEffect } from "react";
import { 
  BookOpen, Terminal, Lock, CheckCircle, Flame, Star, Trophy, 
  ChevronRight, Code2, Play, RotateCcw, Zap, Eye, LockKeyhole, Award 
} from "lucide-react";

// ── CONFIGURAÇÕES E SONS ─────────────────────────────────────────────────────
const SENHA_MESTRE = "prof2026";
const audioSuccess = new Audio("https://cdn.pixabay.com/audio/2022/03/24/audio_34979e2c67.mp3");
const audioError = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_0625624705.mp3");

// ── BANCO DE DADOS PEDAGÓGICO ────────────────────────────────────────────────
const MODULOS = [
  {
    id: 0, sigla: "HTML", emoji: "🌐", titulo: "HTML — Estrutura",
    niveis: [
      {
        id:1, emoji:"🏗️", titulo:"Estrutura Básica", cat:"Fundamentos", xp:100,
        aula:{ intro:"HTML define o esqueleto do site usando tags.", blocos:[{t:"cod",c:"<h1>Título</h1>"}] },
        desafio:{ inst:"Adicione um `<h1>` com 'Minha Página' no `<body>`.", starter:"<body>\n  \n</body>", dica:"<h1>Minha Página</h1>" },
        validacao: [{ regex: /<h1>Minha Página<\/h1>/i, erro: "Tag <h1> incorreta ou texto diferente de 'Minha Página'." }],
        explicacao: "O <h1> é o título principal da página. Motores de busca como o Google usam essa tag para entender o assunto principal do seu site!"
      },
      {
        id:2, emoji:"✍️", titulo:"Parágrafos", cat:"Texto", xp:100,
        aula:{ intro:"Use <p> para blocos de texto.", blocos:[{t:"cod",c:"<p>Texto</p>"}] },
        desafio:{ inst:"Crie um `<h1>` 'Sobre' e um `<p>` com seu nome.", starter:"<body>\n  \n</body>", dica:"<h1>Sobre</h1> <p>Seu nome</p>" },
        validacao: [{ regex: /<h1>Sobre<\/h1>/i, erro: "Faltou o <h1>Sobre</h1>" }, { regex: /<p>.*?<\/p>/i, erro: "Faltou o parágrafo <p>" }],
        explicacao: "Diferenciar títulos (h1) de parágrafos (p) cria uma hierarquia visual, facilitando a leitura para humanos e tecnologias assistivas."
      },
      {
        id:3, emoji:"🔗", titulo:"Links e Mídia", cat:"Mídia", xp:150,
        aula:{ intro:"Links usam a tag <a> com o atributo href.", blocos:[{t:"cod",c:'<a href="url">Texto</a>'}] },
        desafio:{ inst:"Crie um link para `https://google.com` com o texto 'Google'.", starter:"<body>\n  \n</body>", dica:'<a href="https://google.com">Google</a>' },
        validacao: [{ regex: /<a\s+href="https:\/\/google\.com">Google<\/a>/i, erro: "O link deve apontar para o Google com o texto correto." }],
        explicacao: "Links são as 'pontes' da internet. O atributo 'href' (Hypertext Reference) indica o destino exato da navegação."
      },
      {
        id:4, emoji:"📋", titulo:"Listas", cat:"Texto", xp:150,
        aula:{ intro:"<ul> cria listas com marcadores e <li> define cada item.", blocos:[{t:"cod",c:"<ul><li>Item</li></ul>"}] },
        desafio:{ inst:"Crie uma lista `<ul>` com dois itens `<li>`.", starter:"<body>\n  \n</body>", dica:"<ul> <li>A</li> <li>B</li> </ul>" },
        validacao: [{ regex: /<ul>\s*(<li>.*?<\/li>\s*){2,}<\/ul>/is, erro: "Crie uma lista <ul> com pelo menos 2 itens <li>." }],
        explicacao: "Listas são a base de quase todos os menus de navegação profissionais. Elas ajudam a organizar informações relacionadas."
      },
      {
        id:5, emoji:"📦", titulo:"Divs e Classes", cat:"Estrutura", xp:200,
        aula:{ intro:"<div> agrupa elementos e 'class' identifica-os para o CSS.", blocos:[{t:"cod",c:'<div class="caixa"></div>'}] },
        desafio:{ inst:"Crie uma `<div class='perfil'>` com um `<h2>` dentro.", starter:"<body>\n  \n</body>", dica:'<div class="perfil"><h2>...</h2></div>' },
        validacao: [{ regex: /class\s*=\s*["']perfil["'][\s\S]*?<h2/i, erro: "A div deve ter a classe 'perfil' e conter um <h2>." }],
        explicacao: "A tag <div> é um container genérico. Ao usar classes, você cria 'ganchos' para o CSS estilizar blocos específicos."
      }
    ]
  },
  {
    id: 1, sigla: "CSS", emoji: "🎨", titulo: "CSS — O Estilo da Web",
    niveis: [
      {
        id: 1, emoji: "🖌️", titulo: "Cores e Seletores", cat: "Visual", xp: 100,
        aula: { intro: "O CSS controla o visual. 'color' muda o texto e 'background-color' o fundo.", blocos: [{ t: "cod", c: "h1 { color: blue; }" }] },
        desafio: { inst: "Mude a cor do `h1` para `navy` e o fundo do `body` para `aliceblue`.", starter: "<style>\n  /* Estilize aqui */\n</style>\n<body>\n  <h1>Olá Mundo</h1>\n</body>", dica: "h1 { color: navy; } body { background-color: aliceblue; }" },
        validacao: [{ regex: /h1\s*{[^}]*color:\s*navy/i, erro: "O h1 precisa ter a cor 'navy'." }, { regex: /body\s*{[^}]*background-color:\s*aliceblue/i, erro: "O body precisa do fundo 'aliceblue'." }],
        explicacao: "Seletores dizem ao navegador EXATAMENTE qual elemento você quer pintar. O 'body' representa a página inteira!"
      },
      {
        id: 2, emoji: "✍️", titulo: "Tipografia", cat: "Texto", xp: 100,
        aula: { intro: "Controle o texto com 'font-family' (fonte) e 'font-size' (tamanho).", blocos: [{ t: "cod", c: "p { font-size: 20px; }" }] },
        desafio: { inst: "Deixe o `h1` com tamanho `48px` e a fonte do `body` como `Arial`.", starter: "<style>\n\n</style>\n<body>\n  <h1>Título Grande</h1>\n</body>", dica: "h1 { font-size: 48px; } body { font-family: Arial; }" },
        validacao: [{ regex: /font-size:\s*48px/i, erro: "O h1 deve ter 48px." }, { regex: /font-family:\s*Arial/i, erro: "A fonte deve ser Arial." }],
        explicacao: "A tipografia é 90% do design web. Uma fonte bem escolhida garante que o usuário não canse a vista ao navegar."
      },
      {
        id: 3, emoji: "📦", titulo: "Box Model", cat: "Layout", xp: 150,
        aula: { intro: "Padding é o espaço interno. Border é a borda da caixa.", blocos: [{ t: "cod", c: "div { padding: 20px; }" }] },
        desafio: { inst: "Crie uma borda de `5px solid orange` e um padding de `30px` na classe `.caixa`.", starter: "<style>\n  .caixa { }\n</style>\n<div class='caixa'>Oi</div>", dica: ".caixa { border: 5px solid orange; padding: 30px; }" },
        validacao: [{ regex: /border:\s*5px\s+solid\s+orange/i, erro: "A borda deve ser 5px solid orange." }, { regex: /padding:\s*30px/i, erro: "O padding deve ser 30px." }],
        explicacao: "Tudo na web é uma caixa. O preenchimento (padding) cria o 'respiro' interno, essencial para um visual limpo."
      },
      {
        id: 4, emoji: "🔲", titulo: "Flexbox Básico", cat: "Layout", xp: 200,
        aula: { intro: "Flexbox organiza elementos. 'display: flex' ativa o modo e 'justify-content' alinha horizontalmente.", blocos: [{ t: "cod", c: "div { display: flex; justify-content: center; }" }] },
        desafio: { inst: "Alinhe os itens do `.container` no centro usando Flexbox.", starter: "<style>\n  .container { display: block; }\n</style>\n<div class='container'>\n  <div>A</div><div>B</div>\n</div>", dica: "display: flex; justify-content: center;" },
        validacao: [{ regex: /display:\s*flex/i, erro: "Ative o display: flex." }, { regex: /justify-content:\s*center/i, erro: "Use justify-content: center." }],
        explicacao: "O Flexbox acabou com os layouts quebrados. Ele permite organizar elementos em linha ou coluna de forma automática."
      },
      {
        id: 5, emoji: "🎯", titulo: "Centralização Total", cat: "Boss 🔥", xp: 250,
        aula: { intro: "Para centralizar verticalmente, use 'align-items: center' no container com altura.", blocos: [{ t: "cod", c: "align-items: center;" }] },
        desafio: { inst: "Centralize a `.caixa` perfeitamente no meio da tela (horizontal e vertical).", starter: "<style>\n  body {\n    height: 100vh;\n    margin: 0;\n  }\n</style>\n<div class='caixa'>ALVO</div>", dica: "display: flex; justify-content: center; align-items: center;" },
        validacao: [{ regex: /justify-content:\s*center/i, erro: "Faltou a horizontal." }, { regex: /align-items:\s*center/i, erro: "Faltou a vertical." }],
        explicacao: "Parabéns! Você resolveu o maior 'meme' da programação: centralizar uma div. Agora seu conteúdo brilha no centro da tela!"
      }
    ]
  },
  {
    id: 2, sigla: "JS", emoji: "⚡", titulo: "JS — Lógica e Magia",
    niveis: [
      {
        id: 1, emoji: "📝", titulo: "Variáveis", cat: "Lógica", xp: 100,
        aula: { intro: "JS dá vida ao site. 'let' cria variáveis e 'alert' mostra uma mensagem.", blocos: [{ t: "cod", c: "let x = 10; alert(x);" }] },
        desafio: { inst: "Crie `let curso = 'WebLingo'` e mostre-a em um `alert(curso)`.", starter: "<script>\n  // Sua lógica\n</script>", dica: "let curso = 'WebLingo'; alert(curso);" },
        validacao: [{ regex: /let\s+curso\s*=\s*["']WebLingo["']/i, erro: "Variável 'curso' incorreta." }, { regex: /alert\(\s*curso\s*\)/i, erro: "Chame o alert(curso)." }],
        explicacao: "Variáveis são como gavetas na memória. Guardar dados em variáveis permite que você use a mesma informação em vários lugares."
      },
      {
        id: 2, emoji: "⚙️", titulo: "Funções", cat: "Lógica", xp: 150,
        aula: { intro: "Funções são blocos de código que você pode 'chamar' para executar tarefas.", blocos: [{ t: "cod", c: "function acao() { ... }" }] },
        desafio: { inst: "Crie uma função `avisar` que dispara um `alert('Oi')`.", starter: "<script>\n  function avisar() {\n  }\n</script>", dica: "function avisar() { alert('Oi'); }" },
        validacao: [{ regex: /function\s+avisar\s*\(\)/i, erro: "Função 'avisar' não encontrada." }, { regex: /alert\(["']Oi["']\)/i, erro: "Use alert('Oi') na função." }],
        explicacao: "Funções evitam a repetição de código. Você escreve a lógica uma vez e a executa sempre que precisar."
      },
      {
        id: 3, emoji: "🎯", titulo: "DOM", cat: "DOM", xp: 150,
        aula: { intro: "O JS pode mudar o HTML usando 'document.getElementById'.", blocos: [{ t: "cod", c: "document.getElementById('id').innerHTML = '...';" }] },
        desafio: { inst: "Mude o texto do `h1` (id='titulo') para 'DOM Dominado!'.", starter: "<h1 id='titulo'>Texto Antigo</h1>\n<script>\n</script>", dica: "document.getElementById('titulo').innerHTML = 'DOM Dominado!';" },
        validacao: [{ regex: /getElementById\(["']titulo["']\)/i, erro: "Use o ID 'titulo'." }, { regex: /\.innerHTML\s*=\s*["']DOM Dominado!["']/i, erro: "Texto errado." }],
        explicacao: "O DOM é a árvore que representa seu site. Alterar o 'innerHTML' permite mudar o conteúdo sem recarregar a página."
      },
      {
        id: 4, emoji: "🖱️", titulo: "Eventos", cat: "Eventos", xp: 200,
        aula: { intro: "O atributo 'onclick' executa código quando o usuário clica em algo.", blocos: [{ t: "cod", c: "<button onclick='...'>" }] },
        desafio: { inst: "Faça o botão chamar a função `mudarCor` ao ser clicado.", starter: "<button onclick=''>Clique</button>\n<script>\n  function mudarCor() {\n    document.body.style.background = 'yellow';\n  }\n</script>", dica: "Adicione onclick='mudarCor()' no botão." },
        validacao: [{ regex: /onclick=["']mudarCor\(\)["']/i, erro: "Faltou o onclick='mudarCor()'." }],
        explicacao: "Eventos são o que tornam a web interativa. O 'onclick' é o ouvido do seu site, esperando por um comando do usuário."
      },
      {
        id: 5, emoji: "🏆", titulo: "O Contador", cat: "Boss 🔥", xp: 300,
        aula: { intro: "Vamos criar um contador. n = n + 1 aumenta o valor atual.", blocos: [{ t: "cod", c: "n++;" }] },
        desafio: { inst: "Complete a função `somar` para aumentar 'n' e atualizar o span.", starter: "<h3><span id='v'>0</span></h3>\n<button onclick='somar()'>+1</button>\n<script>\n let n=0; function somar() { }\n</script>", dica: "n++; document.getElementById('v').innerHTML = n;" },
        validacao: [{ regex: /n\s*(\+=\s*1|\+\+|= n\s*\+\s*1)/i, erro: "Aumente o n." }, { regex: /innerHTML\s*=\s*n/i, erro: "Atualize o span." }],
        explicacao: "Sensacional! Você criou um estado dinâmico. Esse é o princípio básico de apps modernos como Instagram e WhatsApp!"
      }
    ]
  }
];

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function WebLingoPro() {
  // ── ESTADOS PERSISTENTES (AUTOSAVE) ─────────────────────────────────────────
  const [nomeAluno, setNomeAluno] = useState(() => localStorage.getItem("wl_nome") || "");
  const [appIniciado, setAppIniciado] = useState(() => localStorage.getItem("wl_iniciado") === "true");
  const [finalizado, setFinalizado] = useState(() => localStorage.getItem("wl_finalizado") === "true");
  const [xp, setXp] = useState(() => Number(localStorage.getItem("wl_xp")) || 0);
  const [done, setDone] = useState(() => JSON.parse(localStorage.getItem("wl_done")) || {});
  const [unlockedMods, setUnlockedMods] = useState(() => JSON.parse(localStorage.getItem("wl_unlocked")) || [0]);
  const [modIdx, setModIdx] = useState(() => Number(localStorage.getItem("wl_modIdx")) || 0);
  const [lvlIdx, setLvlIdx] = useState(() => Number(localStorage.getItem("wl_lvlIdx")) || 0);
  const [fase, setFase] = useState(() => localStorage.getItem("wl_fase") || "aula");
  
  // O código do usuário também é salvo em tempo real!
  const [userCode, setUserCode] = useState(() => {
    const savedCode = localStorage.getItem("wl_userCode");
    return savedCode !== null ? savedCode : MODULOS[0].niveis[0].desafio.starter;
  });

  const [feedback, setFeedback] = useState(null);
  const [showPassModal, setShowPassModal] = useState(null);
  const [passInput, setPassInput] = useState("");

  const mod = MODULOS[modIdx];
  const lvl = mod.niveis[lvlIdx];

  // Efeito que salva tudo no localStorage sempre que algo muda
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
      audioSuccess.play().catch(() => console.log("Sem áudio"));
    } else {
      audioError.play().catch(() => console.log("Sem áudio"));
      alert("Senha incorreta!");
    }
  };

  const analisarCodigo = () => {
    for (const regra of lvl.validacao) {
      if (!regra.regex.test(userCode)) {
        setFeedback({ tipo: "err", msg: regra.erro, emoji: "❌" });
        audioError.play().catch(() => console.log("Sem áudio"));
        return;
      }
    }
    const key = `${modIdx}-${lvlIdx}`;
    if (!done[key]) {
      setDone(prev => ({ ...prev, [key]: true }));
      setXp(prev => prev + lvl.xp);
    }
    aaudioSuccess.play().catch(() => console.log("Sem áudio"));
    setFeedback({ tipo: "ok", msg: "Mandou bem!", emoji: "🎉" });
  };

  const proximaFase = () => {
    if (modIdx === 2 && lvlIdx === 4) {
      setFinalizado(true);
      return;
    }
    
    if (lvlIdx < mod.niveis.length - 1) {
      const next = lvlIdx + 1;
      setLvlIdx(next);
      setUserCode(mod.niveis[next].desafio.starter);
      setFase("aula");
      setFeedback(null);
    } else if (modIdx < 2 && unlockedMods.includes(modIdx + 1)) {
      const nextMod = modIdx + 1;
      setModIdx(nextMod);
      setLvlIdx(0);
      setUserCode(MODULOS[nextMod].niveis[0].desafio.starter);
      setFase("aula");
      setFeedback(null);
    }
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
            Concluiu com êxito os desafios de programação na <strong>CEEFMTI ASSISOLINA ASSIS ANDRADE</strong>, 
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
    <div className="min-h-screen bg-slate-950 text-white p-4 font-sans">
      
      {/* MODAL DE SENHA */}
      {showPassModal !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl">
            <LockKeyhole className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Módulo Trancado</h2>
            <p className="text-slate-400 text-sm mb-4 italic">Aguarde a instrução do Professor Fabio Luiz para liberar.</p>
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
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-black">{lvl.titulo}</h2>
            <div className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-mono">Fase {lvlIdx + 1}/5</div>
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

        <section className="space-y-4">
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

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md p-4 no-print border-t border-slate-900">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Award size={20} className="text-orange-500"/>
          <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-orange-600 transition-all duration-1000" style={{width: `${(Object.keys(done).length / 15) * 100}%`}}/>
          </div>
          <span className="text-xs font-black text-slate-500">{Object.keys(done).length}/15</span>
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