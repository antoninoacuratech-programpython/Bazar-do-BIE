/* =====================================================================
   BAZAR DO BIÉ — lógica da aplicação
   Uma página, dezoito ecrãs. Sem servidor: os dados vivem aqui e o
   estado (carrinho, favoritos) fica em memória durante a sessão.
   ===================================================================== */
(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const ic = (nome, cls) => `<svg class="ic ${cls || ''}"><use href="#i-${nome}"/></svg>`;
  const kz = (n) => 'Kz ' + String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  /* ------------------------------------------------------------------
     1. DADOS
     ------------------------------------------------------------------ */
  const CATEGORIAS = [
    { id: 'eletronicos', nome: 'Eletrónicos',      sub: 'Celulares, TVs, computadores…',          icone: 'telemovel' },
    { id: 'moda',        nome: 'Moda',              sub: 'Roupas, calçados, acessórios…',           icone: 'roupa' },
    { id: 'casa',        nome: 'Casa e Decoração',  sub: 'Móveis, utensílios, decoração…',          icone: 'sofa' },
    { id: 'beleza',      nome: 'Beleza e Saúde',    sub: 'Cosméticos, cuidados pessoais…',          icone: 'brilho' },
    { id: 'alimentos',   nome: 'Alimentos',         sub: 'Produtos alimentares, bebidas…',          icone: 'talheres' },
    { id: 'tecnologia',  nome: 'Tecnologia',        sub: 'Acessórios, smartwatch, gadgets…',        icone: 'portatil' },
    { id: 'esportes',    nome: 'Esportes',          sub: 'Fitness, desporto, camping…',             icone: 'bola' },
    { id: 'automoveis',  nome: 'Automóveis',        sub: 'Peças, acessórios, serviços…',            icone: 'carro' },
  ];

  const SUBCATEGORIAS = {
    eletronicos: [['todos', 'Todos'], ['celulares', 'Celulares'], ['tvs', 'TVs'], ['computadores', 'Computadores'], ['audio', 'Áudio']],
    tecnologia:  [['todos', 'Todos'], ['wearables', 'Wearables'], ['audio', 'Áudio']],
    esportes:    [['todos', 'Todos'], ['calcado', 'Calçado']],
    todos:       [['todos', 'Todos'], ['celulares', 'Celulares'], ['tvs', 'TVs'], ['computadores', 'Computadores'], ['audio', 'Áudio'], ['calcado', 'Calçado'], ['wearables', 'Wearables']],
  };

  const PRODUTOS = [
    { id: 1, nome: 'iPhone 15 128GB',      preco: 1250000, nota: 4.8, votos: 120, cat: 'eletronicos', sub: 'celulares',   icone: 'telemovel',     cor: 'linear-gradient(135deg,#4C3A6B,#2A2340)', estado: 'activo',
      caracteristicas: [['armazenamento', '128GB de armazenamento'], ['camara', 'Câmara de 48MP'], ['ecra', 'Ecrã Super Retina XDR'], ['bateria', 'Bateria de longa duração']] },
    { id: 2, nome: 'Samsung Galaxy A54',   preco: 650000,  nota: 4.6, votos: 98,  cat: 'eletronicos', sub: 'celulares',   icone: 'telemovel',     cor: 'linear-gradient(135deg,#5B6B7A,#2E3A46)', estado: 'activo',
      caracteristicas: [['armazenamento', '256GB de armazenamento'], ['camara', 'Câmara tripla de 50MP'], ['ecra', 'Ecrã AMOLED 120Hz'], ['bateria', 'Bateria de 5000mAh']] },
    { id: 3, nome: 'Smart TV 43"',          preco: 780000,  nota: 4.7, votos: 76,  cat: 'eletronicos', sub: 'tvs',         icone: 'tv',            cor: 'linear-gradient(135deg,#2C5F8A,#14304A)', estado: 'activo',
      caracteristicas: [['ecra', 'Ecrã 4K UHD de 43"'], ['portatil', 'Sistema smart com aplicações'], ['auscultadores', 'Som estéreo 20W'], ['cadeado', 'Garantia de 2 anos']] },
    { id: 4, nome: 'Auriculares Bluetooth', preco: 120000,  nota: 4.5, votos: 64,  cat: 'eletronicos', sub: 'audio',       icone: 'auscultadores', cor: 'linear-gradient(135deg,#8A8F98,#4B5058)', estado: 'inactivo',
      caracteristicas: [['auscultadores', 'Cancelamento de ruído'], ['bateria', '30 horas de autonomia'], ['telemovel', 'Bluetooth 5.3'], ['cadeado', 'Resistentes à água']] },
    { id: 5, nome: 'Ténis de corrida',      preco: 450000,  nota: 4.4, votos: 52,  cat: 'esportes',    sub: 'calcado',     icone: 'tenis',         cor: 'linear-gradient(135deg,#4A5568,#1F2733)', estado: 'activo',
      caracteristicas: [['bola', 'Sola com amortecimento'], ['brilho', 'Malha respirável'], ['roupa', 'Tamanhos 38 a 45'], ['cadeado', 'Troca em 30 dias']] },
    { id: 6, nome: 'Smartwatch',            preco: 280000,  nota: 4.3, votos: 41,  cat: 'tecnologia',  sub: 'wearables',   icone: 'relogio-pulso', cor: 'linear-gradient(135deg,#2B2F36,#0F1114)', estado: 'activo',
      caracteristicas: [['relogio', 'Monitor de ritmo cardíaco'], ['bateria', '7 dias de bateria'], ['telemovel', 'Notificações do telemóvel'], ['cadeado', 'Resistente à água 5ATM']] },
    { id: 7, nome: 'Portátil 14"',           preco: 950000,  nota: 4.6, votos: 33,  cat: 'eletronicos', sub: 'computadores', icone: 'portatil',     cor: 'linear-gradient(135deg,#6B7280,#374151)', estado: 'activo',
      caracteristicas: [['armazenamento', 'SSD de 512GB'], ['ecra', 'Ecrã Full HD de 14"'], ['bateria', '10 horas de bateria'], ['cadeado', 'Garantia de 1 ano']] },
  ];

  const VENDAS = [
    { produto: 1, data: '20/08 · 14:32' },
    { produto: 5, data: '20/08 · 12:15' },
    { produto: 6, data: '20/08 · 09:40' },
  ];

  const NOTIFICACOES = [
    { icone: 'saco',     cor: 'azul',    titulo: 'Novo pedido',           texto: 'O seu produto iPhone 15 foi comprado!',                 data: '20/08 · 14:32', nova: true },
    { icone: 'estrela',  cor: 'amarela', titulo: 'Cliente avaliou',       texto: 'Maria Silva avaliou a sua loja com 5 estrelas!',        data: '20/08 · 12:15', nova: true },
    { icone: 'crescer',  cor: 'verde',   titulo: 'Produto em destaque',   texto: 'O seu produto está em destaque no Bazar do Bié!',       data: '19/08 · 10:20', nova: false },
    { icone: 'check',    cor: 'verde',   titulo: 'Pagamento confirmado',  texto: 'O pagamento do pedido #BZD1258 foi confirmado!',        data: '18/08 · 16:45', nova: false },
    { icone: 'utilizadores', cor: 'azul', titulo: 'Novo seguidor',        texto: 'A sua loja recebeu um novo seguidor!',                  data: '18/08 · 11:30', nova: false },
  ];

  const NAV = {
    cliente: [
      ['inicio', 'inicio', 'Início'], ['categorias', 'grelha', 'Categorias'], ['favoritos', 'coracao', 'Favoritos'],
      ['carrinho', 'carrinho', 'Carrinho'], ['perfil', 'utilizador', 'Perfil'],
    ],
    comerciante: [
      ['painel', 'inicio', 'Início'], ['meusprodutos', 'caixa', 'Produtos'], ['pedido', 'lista', 'Pedidos'], ['perfil', 'utilizador', 'Perfil'],
    ],
  };

  /* ------------------------------------------------------------------
     2. ESTADO
     ------------------------------------------------------------------ */
  const estado = {
    carrinho: [{ id: 1, qtd: 1 }, { id: 5, qtd: 1 }, { id: 6, qtd: 1 }],
    favoritos: new Set([1, 6]),
    entrega: 300000,
    lista: { cat: 'eletronicos', sub: 'todos', texto: '' },
    produto: 1,
    aSeguir: false,
    filtroMeus: 'todos',
  };

  const produto = (id) => PRODUTOS.find(p => p.id === Number(id));
  const categoria = (id) => CATEGORIAS.find(c => c.id === id);

  /* ------------------------------------------------------------------
     3. NAVEGAÇÃO
     ------------------------------------------------------------------ */
  const pilha = [];
  let actual = 'splash';

  function ir(id, dados, substituir) {
    if (!$('#' + id)) return;
    if (!substituir && actual && actual !== id && actual !== 'splash') pilha.push(actual);
    if (pilha.length > 30) pilha.shift();
    $$('.ecra').forEach(e => e.classList.toggle('activo', e.id === id));
    actual = id;
    const c = $('#' + id + ' .conteudo');
    if (c) c.scrollTop = 0;
    const antes = { inicio: desenharInicio, categorias: desenharCategorias, lista: () => desenharLista(dados), produto: () => desenharProduto(dados),
      carrinho: desenharCarrinho, checkout: desenharCheckout, painel: desenharPainel, meusprodutos: desenharMeusProdutos,
      notificacoes: desenharNotificacoes, adicionar: prepararFormulario }[id];
    if (antes) antes();
    desenharNavs();
  }
  function voltar() { ir(pilha.pop() || 'inicio', null, true); }

  function desenharNavs() {
    $$('.nav-inferior').forEach(nav => {
      const tipo = nav.dataset.nav;
      const activo = nav.closest('.ecra').id;
      const qtd = estado.carrinho.reduce((s, i) => s + i.qtd, 0);
      nav.innerHTML = NAV[tipo].map(([id, icone, rotulo]) => {
        const alvo = id === 'favoritos' ? 'lista' : id;
        const eActivo = id === activo || (id === 'favoritos' && activo === 'lista' && estado.lista.cat === 'favoritos');
        const contador = id === 'carrinho' && qtd ? `<span class="contador">${qtd}</span>` : '';
        return `<button class="${eActivo ? 'activo' : ''}" data-ir="${alvo}" ${id === 'favoritos' ? 'data-cat="favoritos"' : ''}>${contador}${ic(icone)}<span>${rotulo}</span></button>`;
      }).join('');
    });
  }

  /* ------------------------------------------------------------------
     4. COMPONENTES
     ------------------------------------------------------------------ */
  function cartaoProduto(p) {
    const fav = estado.favoritos.has(p.id);
    return `
      <div class="produto-cartao">
        <button class="favorito ${fav ? 'activo' : ''}" data-fav="${p.id}" aria-label="Favorito">${ic('coracao')}</button>
        <button data-ir="produto" data-id="${p.id}" style="display:block;width:100%;text-align:left">
          <div class="imagem" style="background:${p.cor}">${ic(p.icone)}</div>
          <div class="nome">${p.nome}</div>
          <div class="preco">${kz(p.preco)}</div>
          <div class="avaliacao">${ic('estrela', 'p estrela cheio')} ${p.nota.toFixed(1)} (${p.votos})</div>
        </button>
      </div>`;
  }

  function aviso(texto) {
    const a = $('#aviso');
    a.querySelector('span').textContent = texto;
    a.classList.add('visivel');
    clearTimeout(aviso.t);
    aviso.t = setTimeout(() => a.classList.remove('visivel'), 2200);
  }

  /* ------------------------------------------------------------------
     5. ECRÃS
     ------------------------------------------------------------------ */
  function desenharInicio() {
    $('#categorias-inicio').innerHTML = CATEGORIAS.slice(0, 7).map(c =>
      `<button data-ir="lista" data-cat="${c.id}"><span class="pastilha">${ic(c.icone)}</span>${c.nome}</button>`).join('') +
      `<button data-ir="categorias"><span class="pastilha">${ic('pontos')}</span>Mais</button>`;
    $('#destaques').innerHTML = PRODUTOS.filter(p => p.estado === 'activo').slice(0, 5).map(cartaoProduto).join('');
  }

  function desenharCategorias(filtro) {
    const t = (filtro || $('#pesquisa-categorias').value || '').trim().toLowerCase();
    const lista = CATEGORIAS.filter(c => !t || c.nome.toLowerCase().includes(t) || c.sub.toLowerCase().includes(t));
    $('#lista-categorias').innerHTML = lista.length ? lista.map(c =>
      `<button data-ir="lista" data-cat="${c.id}"><span class="pastilha">${ic(c.icone)}</span><div class="txt"><strong>${c.nome}</strong><span>${c.sub}</span></div>${ic('seta', 'seta')}</button>`).join('')
      : `<div class="vazio">${ic('pesquisa')}<strong>Nenhuma categoria encontrada</strong>Tente outra palavra.</div>`;
  }

  function desenharLista(dados) {
    if (dados) Object.assign(estado.lista, { sub: 'todos', texto: '' }, dados);
    const { cat, sub, texto } = estado.lista;
    const titulo = cat === 'favoritos' ? 'Favoritos' : cat === 'todos' ? (texto ? `Resultados: "${texto}"` : 'Todos os produtos') : categoria(cat).nome;
    $('#lista-titulo').textContent = titulo;

    const subs = cat === 'favoritos' ? [] : (SUBCATEGORIAS[cat] || [['todos', 'Todos']]);
    $('#lista-filtros').innerHTML = subs.map(([id, nome]) => `<button class="filtro ${id === sub ? 'activo' : ''}" data-sub="${id}">${nome}</button>`).join('');
    $('#lista-filtros').style.display = subs.length > 1 ? '' : 'none';

    let itens = PRODUTOS.filter(p => p.estado === 'activo');
    if (cat === 'favoritos') itens = PRODUTOS.filter(p => estado.favoritos.has(p.id));
    else if (cat !== 'todos') itens = itens.filter(p => p.cat === cat);
    if (sub !== 'todos') itens = itens.filter(p => p.sub === sub);
    if (texto) itens = itens.filter(p => p.nome.toLowerCase().includes(texto.toLowerCase()));

    $('#lista-produtos').innerHTML = itens.length ? itens.map(cartaoProduto).join('')
      : `<div class="vazio" style="grid-column:1/-1">${ic(cat === 'favoritos' ? 'coracao' : 'caixa')}<strong>${cat === 'favoritos' ? 'Ainda não tem favoritos' : 'Nenhum produto por aqui'}</strong>${cat === 'favoritos' ? 'Toque no coração de um produto para o guardar.' : 'Experimente outra categoria ou pesquisa.'}</div>`;
  }

  function desenharProduto(id) {
    if (id) estado.produto = Number(id);
    const p = produto(estado.produto);
    $('#produto-imagem').style.background = p.cor;
    $('#produto-imagem').innerHTML = ic(p.icone);
    $('#produto-nome').textContent = p.nome;
    $('#produto-preco').textContent = kz(p.preco);
    $('#produto-avaliacao').innerHTML = `<strong>${p.nota.toFixed(1)}</strong> (${p.votos} avaliações)`;
    $('#produto-caracteristicas').innerHTML = p.caracteristicas.map(([i, t]) => `<li><span class="pastilha">${ic(i)}</span>${t}</li>`).join('');
    $('#produto-favorito').classList.toggle('activo', estado.favoritos.has(p.id));
  }

  function desenharCarrinho() {
    const cont = $('#carrinho-itens');
    if (!estado.carrinho.length) {
      cont.innerHTML = `<div class="vazio">${ic('carrinho')}<strong>O carrinho está vazio</strong>Explore as categorias e adicione produtos.</div>`;
      $('#carrinho-resumo').innerHTML = '';
      $('#carrinho-finalizar').disabled = true; $('#carrinho-finalizar').style.opacity = .5;
      return;
    }
    $('#carrinho-finalizar').disabled = false; $('#carrinho-finalizar').style.opacity = 1;
    cont.innerHTML = estado.carrinho.map(i => {
      const p = produto(i.id);
      return `<div class="item-carrinho">
        <div class="imagem" style="background:${p.cor}">${ic(p.icone)}</div>
        <div class="txt">
          <div class="nome">${p.nome}</div><div class="preco">${kz(p.preco)}</div>
          <div class="baixo">
            <div class="quantidade"><button data-qtd="-1" data-id="${p.id}" aria-label="Menos">${ic('menos', 'p')}</button><span>${i.qtd}</span><button data-qtd="1" data-id="${p.id}" aria-label="Mais">${ic('mais', 'p')}</button></div>
            <button class="apagar" data-remover="${p.id}" aria-label="Remover">${ic('lixo', 'p')}</button>
          </div>
        </div></div>`;
    }).join('');
    $('#carrinho-resumo').innerHTML = resumoHTML();
  }

  const subtotal = () => estado.carrinho.reduce((s, i) => s + produto(i.id).preco * i.qtd, 0);
  function resumoHTML() {
    return `<div><span>Subtotal</span><strong>${kz(subtotal())}</strong></div>
            <div><span>Taxa de entrega</span><strong>${kz(estado.entrega)}</strong></div>
            <div class="total"><span>Total</span><span>${kz(subtotal() + estado.entrega)}</span></div>`;
  }

  function desenharCheckout() { $('#checkout-resumo').innerHTML = resumoHTML(); }

  function desenharPainel() {
    $('#vendas-recentes').innerHTML = VENDAS.map(v => {
      const p = produto(v.produto);
      return `<li><span class="mini" style="background:${p.cor}">${ic(p.icone)}</span><span class="nome">${p.nome}</span><span class="valor">${kz(p.preco)}</span><span class="data">${v.data}</span></li>`;
    }).join('');
  }

  function desenharMeusProdutos() {
    $$('#meus-filtros .filtro').forEach(b => b.classList.toggle('activo', b.dataset.estado === estado.filtroMeus));
    const itens = PRODUTOS.filter(p => estado.filtroMeus === 'todos' || p.estado === estado.filtroMeus);
    $('#meus-produtos').innerHTML = itens.length ? itens.map(p => `
      <li><span class="imagem" style="background:${p.cor}">${ic(p.icone)}</span>
        <div class="txt"><strong>${p.nome}</strong><span>${kz(p.preco)}</span></div>
        <button class="etiqueta ${p.estado === 'activo' ? 'verde' : 'cinza'}" data-alternar="${p.id}" title="Alternar estado">${p.estado === 'activo' ? 'Ativo' : 'Inativo'}</button>
      </li>`).join('')
      : `<div class="vazio">${ic('caixa')}<strong>Sem produtos ${estado.filtroMeus === 'activo' ? 'ativos' : 'inativos'}</strong>Toque em + para adicionar.</div>`;
  }

  function desenharNotificacoes() {
    $('#lista-notificacoes').innerHTML = NOTIFICACOES.map(n => `
      <li class="${n.nova ? 'nova' : ''}"><span class="pastilha ${n.cor}">${ic(n.icone)}</span>
        <div class="txt"><strong>${n.titulo}</strong><p>${n.texto}</p><span>${n.data}</span></div></li>`).join('');
    const novas = NOTIFICACOES.filter(n => n.nova).length;
    const c = $('#perfil-notificacoes'); c.textContent = novas; c.style.display = novas ? '' : 'none';
  }

  function prepararFormulario() {
    const sel = $('#np-categoria');
    if (sel.options.length === 1) CATEGORIAS.forEach(c => sel.add(new Option(c.nome, c.id)));
  }

  /* ------------------------------------------------------------------
     6. ACÇÕES
     ------------------------------------------------------------------ */
  function adicionarAoCarrinho(id, silencioso) {
    const item = estado.carrinho.find(i => i.id === id);
    if (item) item.qtd += 1; else estado.carrinho.push({ id, qtd: 1 });
    desenharNavs();
    if (!silencioso) aviso('Adicionado ao carrinho');
  }

  function alternarFavorito(id) {
    if (estado.favoritos.has(id)) { estado.favoritos.delete(id); aviso('Removido dos favoritos'); }
    else { estado.favoritos.add(id); aviso('Guardado nos favoritos'); }
    $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle('activo', estado.favoritos.has(id)));
    if (actual === 'produto') $('#produto-favorito').classList.toggle('activo', estado.favoritos.has(id));
    if (actual === 'lista' && estado.lista.cat === 'favoritos') desenharLista();
  }

  function guardarProduto() {
    const nome = $('#np-nome'), cat = $('#np-categoria'), preco = $('#np-preco');
    const valor = Number(String(preco.value).replace(/\./g, '').replace(',', '.'));
    let ok = true;
    [[nome, nome.value.trim().length >= 2], [cat, !!cat.value], [preco, valor > 0]].forEach(([el, valido]) => {
      el.closest('.campo').classList.toggle('invalido', !valido); if (!valido) ok = false;
    });
    if (!ok) return;
    const c = categoria(cat.value);
    PRODUTOS.unshift({ id: Date.now(), nome: nome.value.trim(), preco: valor, nota: 5, votos: 0, cat: c.id, sub: 'todos', icone: c.icone,
      cor: 'linear-gradient(135deg,#F7B500,#B45309)', estado: 'activo',
      caracteristicas: [['caixa', $('#np-descricao').value.trim() || 'Sem descrição'], ['pin', 'Vendido pela Loja do João'], ['camiao', 'Entrega em todo o Bié'], ['cadeado', 'Compra protegida']] });
    nome.value = ''; cat.selectedIndex = 0; preco.value = ''; $('#np-descricao').value = '';
    aviso('Produto guardado');
    ir('meusprodutos', null, true);
  }

  /* ------------------------------------------------------------------
     7. EVENTOS (delegação num único ouvinte)
     ------------------------------------------------------------------ */
  $('#app').addEventListener('click', (e) => {
    const alvo = e.target.closest('[data-ir],[data-voltar],[data-fav],[data-qtd],[data-remover],[data-sub],[data-estado],[data-alternar],[data-aviso],.opcao,#produto-adicionar,#produto-comprar,#pagar,#np-guardar,#seguir-loja,#marcar-lidas,#produto-favorito');
    if (!alvo) return;

    if (alvo.dataset.fav)      { e.stopPropagation(); return alternarFavorito(Number(alvo.dataset.fav)); }
    if (alvo.id === 'produto-favorito') return alternarFavorito(estado.produto);
    if (alvo.dataset.aviso)    return aviso(alvo.dataset.aviso);
    if (alvo.hasAttribute('data-voltar')) return voltar();

    if (alvo.dataset.qtd) {
      const item = estado.carrinho.find(i => i.id === Number(alvo.dataset.id));
      item.qtd = Math.max(1, item.qtd + Number(alvo.dataset.qtd));
      desenharCarrinho(); desenharNavs(); return;
    }
    if (alvo.dataset.remover) {
      estado.carrinho = estado.carrinho.filter(i => i.id !== Number(alvo.dataset.remover));
      desenharCarrinho(); desenharNavs(); aviso('Produto removido'); return;
    }
    if (alvo.dataset.sub)    { estado.lista.sub = alvo.dataset.sub; return desenharLista(); }
    if (alvo.dataset.estado) { estado.filtroMeus = alvo.dataset.estado; return desenharMeusProdutos(); }
    if (alvo.dataset.alternar) {
      const p = produto(alvo.dataset.alternar); p.estado = p.estado === 'activo' ? 'inactivo' : 'activo';
      desenharMeusProdutos(); return aviso(p.estado === 'activo' ? 'Produto ativado' : 'Produto desativado');
    }
    if (alvo.classList.contains('opcao')) {
      $$('.opcao', alvo.parentElement).forEach(o => o.classList.remove('activa')); alvo.classList.add('activa');
      if (alvo.dataset.valor) { estado.entrega = Number(alvo.dataset.valor); desenharCheckout(); }
      return;
    }
    if (alvo.id === 'produto-adicionar') return adicionarAoCarrinho(estado.produto);
    if (alvo.id === 'produto-comprar')   { adicionarAoCarrinho(estado.produto, true); return ir('checkout'); }
    if (alvo.id === 'pagar') {
      const total = kz(subtotal() + estado.entrega);
      estado.carrinho = []; desenharNavs();
      aviso('Pagamento de ' + total + ' confirmado');
      return ir('pedido', null, true);
    }
    if (alvo.id === 'np-guardar')  return guardarProduto();
    if (alvo.id === 'seguir-loja') {
      estado.aSeguir = !estado.aSeguir;
      alvo.textContent = estado.aSeguir ? 'A seguir' : 'Seguir';
      alvo.classList.toggle('amarelo', !estado.aSeguir); alvo.classList.toggle('contorno', estado.aSeguir);
      return aviso(estado.aSeguir ? 'Passou a seguir a Loja do João' : 'Deixou de seguir a loja');
    }
    if (alvo.id === 'marcar-lidas') { NOTIFICACOES.forEach(n => n.nova = false); return desenharNotificacoes(); }

    if (alvo.dataset.ir) {
      const id = alvo.dataset.ir;
      if (id === 'lista')   return ir('lista', { cat: alvo.dataset.cat || 'todos' });
      if (id === 'produto') return ir('produto', alvo.dataset.id);
      ir(id);
    }
  });

  /* pesquisa no início: Enter abre a lista com o texto */
  $('#pesquisa-inicio').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) { ir('lista', { cat: 'todos', texto: e.target.value.trim() }); e.target.value = ''; }
  });
  $('#pesquisa-categorias').addEventListener('input', () => desenharCategorias());
  $('#np-preco').addEventListener('input', (e) => {
    const d = e.target.value.replace(/\D/g, '');
    e.target.value = d ? d.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
  });

  /* ------------------------------------------------------------------
     8. ARRANQUE — splash de 2,5 s (toque para saltar)
     ------------------------------------------------------------------ */
  desenharNotificacoes();
  const t = setTimeout(() => ir('boasvindas', null, true), 2500);
  $('#splash').addEventListener('click', () => { clearTimeout(t); ir('boasvindas', null, true); });
})();
