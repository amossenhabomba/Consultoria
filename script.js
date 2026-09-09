// =========================================================
// AMS Consultoria — script.js
// Organizado por secção. Pontos de futura integração com
// backend (Supabase) e calendário estão marcados com "TODO".
// =========================================================

/* ---------- NAV ---------- */
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');
hamburger.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

/* ---------- CLIENTES (usados no marquee) ---------- */
const clients = [
  "Forno Mágico Padaria", "NextLink Service & Supply Chain", "Q Infotech Business, SU, LDA",
  "AFCE — Associação para Formação Centrada no Auto Emprego", "Capulana Eventos & Serviços",
  "SC Transportes & Logística, EI", "Wised Group", "Jardim Infantil dos Anjos", "Urban Grill",
  "Agille Services SU LDA", "Kryos Tech", "Northbridge Labs", "Chesed Colossais Serviços, Lda",
  "Dawuka Construções", "Nivoleki Microcrédito"
];
const marqueeTrack = document.getElementById('marqueeTrack');
[...clients, ...clients].forEach(n => {
  const el = document.createElement('span');
  el.className = 'marquee-item';
  el.textContent = n;
  marqueeTrack.appendChild(el);
});

/* ---------- DADOS DOS SERVIÇOS ---------- */
// Estrutura única de dados: usada tanto para os cartões (Problema → Solução →
// Como funciona → Resultado) como para a "página" de detalhe de cada serviço.
const SERVICES = [
  {
    id: 'registo',
    nome: 'Registo de Empresas',
    problema: 'Precisa abrir uma empresa mas não sabe por onde começar?',
    solucao: 'Tratamos do processo de legalização por si, do início ao fim.',
    comoFunciona: 'Reserva de nome, contrato de sociedade, certidão, NUIT, alvará, início de atividade, INSS, BR e abertura de conta bancária.',
    resultado: 'Empresa formalizada e pronta para operar.',
    paraQuem: 'Empreendedores que querem abrir uma empresa nova, ou negócios informais que quer legalizar-se.',
    etapas: ['Reserva de nome', 'Contrato de sociedade', 'Certidão', 'NUIT da empresa', 'Alvará', 'Início de atividade', 'INSS', 'BR (Boletim da República)', 'Abertura de conta bancária'],
    documentos: ['Documento de identificação dos sócios', 'Comprovativo de morada', 'Definição do objeto social e capital'],
    beneficios: ['Acompanhamento em cada etapa', 'Menos tempo perdido em filas e burocracia', 'Equipa que representa o cliente junto das entidades'],
    faq: [['A AMS trata de todo o processo?', 'Sim, acompanhamos o processo do início ao fim, mas também pode solicitar apenas etapas específicas.'], ['Quanto tempo demora?', 'O prazo varia consoante o tipo de empresa e a documentação disponível. Após uma avaliação inicial indicamos uma estimativa para o seu caso.']]
  },
  {
    id: 'recrutamento',
    nome: 'Recrutamento & Seleção',
    problema: 'Precisa de contratar mas não tem tempo para gerir todo o processo?',
    solucao: 'Encontramos o talento certo para a sua equipa, com rigor e rapidez.',
    comoFunciona: 'Definição do perfil, divulgação da vaga, triagem de candidaturas, entrevistas e apresentação de finalistas.',
    resultado: 'Vaga preenchida com um candidato alinhado às necessidades da empresa.',
    paraQuem: 'Empresas que precisam de contratar uma ou várias posições e querem um processo mais estruturado.',
    etapas: ['Definição do perfil da vaga', 'Divulgação', 'Triagem de currículos', 'Entrevistas', 'Apresentação de finalistas'],
    documentos: ['Descrição da função e requisitos', 'Informação sobre condições da vaga'],
    beneficios: ['Poupa tempo da sua equipa interna', 'Triagem feita por quem tem experiência em RH', 'Processo mais estruturado e imparcial'],
    faq: [['Como funciona a consultoria de RH?', 'Começamos com um levantamento da situação atual da empresa e propomos um plano adaptado à realidade do negócio.']],
    imagem: 'recrutamento-exemplo.jpg'
  },
  {
    id: 'contratos',
    nome: 'Elaboração de Contratos de Trabalho',
    problema: 'Tem dúvidas se os seus contratos de trabalho estão corretos?',
    solucao: 'Elaboramos e revemos contratos de trabalho em conformidade com a legislação moçambicana.',
    comoFunciona: 'Levantamento das condições acordadas, elaboração do contrato e revisão final com a empresa.',
    resultado: 'Contratos claros, que protegem tanto a empresa como os colaboradores.',
    paraQuem: 'Empresas que estão a contratar, ou que querem rever contratos já existentes.',
    etapas: ['Levantamento das condições', 'Elaboração do documento', 'Revisão com a empresa', 'Assinatura'],
    documentos: ['Dados do colaborador', 'Condições acordadas (função, salário, horário)'],
    beneficios: ['Reduz o risco de conflitos laborais', 'Documentação organizada e consistente'],
    faq: [['Posso solicitar apenas uma parte do processo?', 'Sim. Os nossos serviços podem ser contratados de forma completa ou pontual, consoante a sua necessidade.']]
  },
  {
    id: 'rh',
    nome: 'Organização de Processos / Consultoria de RH',
    problema: 'Os processos de RH da sua empresa ainda não estão organizados?',
    solucao: 'Estruturamos os processos internos de Recursos Humanos do seu negócio.',
    comoFunciona: 'Levantamento da situação atual, identificação de lacunas e proposta de organização documental e de processos.',
    resultado: 'Processos de RH mais organizados e um melhor controlo administrativo.',
    paraQuem: 'Empresas já em funcionamento que querem organizar ou profissionalizar a área de RH.',
    etapas: ['Levantamento da situação atual', 'Identificação de prioridades', 'Organização documental', 'Definição de processos'],
    documentos: ['Documentação de RH existente (se aplicável)'],
    beneficios: ['Mais controlo sobre a gestão de pessoas', 'Processos mais claros para toda a equipa'],
    faq: [['A AMS presta serviços a empresas já existentes?', 'Sim, apoiamos tanto a criação de novas empresas como a organização de empresas já em funcionamento.']]
  }
];

/* ---------- RENDER: CARTÕES DE SERVIÇO (Problema → Solução → Como funciona → Resultado) ---------- */
const servicesList = document.getElementById('servicesList');
SERVICES.forEach(s => {
  const card = document.createElement('article');
  card.className = 'service-card';
  card.innerHTML = `
    <div class="service-card-head">
      <h3>${s.nome}</h3>
    </div>
    <div class="psr-grid">
      <div class="psr-item"><span class="psr-label">Problema</span><p>${s.problema}</p></div>
      <div class="psr-item"><span class="psr-label">Solução AMS</span><p>${s.solucao}</p></div>
      <div class="psr-item"><span class="psr-label">Como funciona</span><p>${s.comoFunciona}</p></div>
      <div class="psr-item"><span class="psr-label">Resultado</span><p>${s.resultado}</p></div>
    </div>
    <div class="service-actions">
      <a class="btn btn-primary btn-sm" href="#contacto" data-preselect="${s.nome}">Solicitar este serviço</a>
      <a class="btn btn-ghost btn-sm" href="#servico-detalhe" data-service="${s.id}">Ver detalhes</a>
    </div>`;
  servicesList.appendChild(card);
});

/* ---------- PÁGINA DE DETALHE DO SERVIÇO ---------- */
const serviceDetailSection = document.getElementById('servico-detalhe');
const serviceDetailContent = document.getElementById('serviceDetailContent');

function renderServiceDetail(id) {
  const s = SERVICES.find(x => x.id === id);
  if (!s) return;
  serviceDetailContent.innerHTML = `
    <div class="eyebrow">Serviço</div>
    <h2>${s.nome}</h2>
    <p style="max-width:70ch;">${s.solucao} ${s.paraQuem}</p>
    ${s.imagem ? `<img src="${s.imagem}" alt="" loading="lazy" style="width:220px; border-radius:12px; box-shadow:var(--shadow-sm); margin-bottom:1.5rem;">` : ''}
    <div class="detail-grid">
      <div class="detail-block">
        <h4>Etapas</h4>
        <ul>${s.etapas.map(e => `<li>${e}</li>`).join('')}</ul>
      </div>
      <div class="detail-block">
        <h4>Documentos habitualmente necessários</h4>
        <ul>${s.documentos.map(d => `<li>${d}</li>`).join('')}</ul>
        <h4 style="margin-top:1.4rem;">Benefícios</h4>
        <ul>${s.beneficios.map(b => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <h4 style="margin-top:1rem;">Perguntas frequentes sobre este serviço</h4>
    ${s.faq.map(([q, a]) => `<details class="detail-faq-item"><summary>${q}</summary><p style="margin-top:.6rem;">${a}</p></details>`).join('')}
    <div style="margin-top:2rem; display:flex; gap:.8rem; flex-wrap:wrap;">
      <a class="btn btn-primary" href="#contacto" data-preselect="${s.nome}">Solicitar este serviço</a>
      <a class="btn btn-ghost" href="https://wa.me/258841030400?text=${encodeURIComponent('Olá, gostaria de saber mais sobre ' + s.nome + '.')}" target="_blank" rel="noopener">Falar no WhatsApp</a>
    </div>`;
}

document.addEventListener('click', (e) => {
  const detailLink = e.target.closest('[data-service]');
  if (detailLink) {
    e.preventDefault();
    renderServiceDetail(detailLink.dataset.service);
    document.querySelectorAll('main > *').forEach(el => el.style.display = (el.id === 'servico-detalhe') ? '' : 'none');
    serviceDetailSection.classList.add('active');
    window.scrollTo(0, 0);
    history.pushState(null, '', '#servico-detalhe-' + detailLink.dataset.service);
  }
  const preselect = e.target.closest('[data-preselect]');
  if (preselect && preselect.getAttribute('href') === '#contacto') {
    // Marca o serviço no formulário de contacto assim que a secção estiver visível
    window.__preselectService = preselect.dataset.preselect;
  }
});

document.getElementById('backToServices').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelectorAll('main > *').forEach(el => el.style.display = '');
  serviceDetailSection.classList.remove('active');
  history.pushState(null, '', '#servicos');
  document.getElementById('servicos').scrollIntoView();
});

/* ---------- DIAGNÓSTICO EMPRESARIAL ---------- */
const diagForm = document.getElementById('diagForm');
const diagSteps = [...diagForm.querySelectorAll('.diag-step')];
const diagProgress = [...document.querySelectorAll('#diagProgress span')];
const diagPrev = document.getElementById('diagPrev');
const diagNext = document.getElementById('diagNext');
let diagCurrent = 1;

diagForm.querySelectorAll('.diag-pill input').forEach(input => {
  input.addEventListener('change', () => {
    const pill = input.closest('.diag-pill');
    if (input.type === 'radio') {
      document.querySelectorAll(`input[name="${input.name}"]`).forEach(r => r.closest('.diag-pill').classList.remove('checked'));
    }
    pill.classList.toggle('checked', input.checked);
  });
});

function diagShowStep(n) {
  diagSteps.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === n));
  diagProgress.forEach((el, i) => el.classList.toggle('done', i < n));
  diagPrev.style.visibility = n === 1 ? 'hidden' : 'visible';
  diagNext.textContent = n === 3 ? 'Ver resultado' : 'Seguinte';
  diagNext.style.display = n === 4 ? 'none' : 'inline-flex';
  if (n === 3) populateUrgentOptions();
  if (n === 4) buildDiagResult();
}

function populateUrgentOptions() {
  const chosen = [...diagForm.querySelectorAll('input[name="desafios"]:checked')].map(c => c.value);
  const wrap = document.getElementById('urgenteOptions');
  wrap.innerHTML = '';
  const options = chosen.length ? chosen : ['Registo/legalização', 'Recursos Humanos'];
  options.forEach(opt => {
    const label = document.createElement('label');
    label.className = 'diag-pill';
    label.innerHTML = `<input type="radio" name="urgente" value="${opt}">${opt}`;
    label.querySelector('input').addEventListener('change', (e) => {
      wrap.querySelectorAll('.diag-pill').forEach(p => p.classList.remove('checked'));
      label.classList.add('checked');
    });
    wrap.appendChild(label);
  });
}

// Mapa simples de necessidade -> serviço recomendado (regras determinísticas, sem inventar dados)
function mapNecessidadeParaServico(necessidade) {
  const map = {
    'Registo/legalização': 'Registo de Empresas',
    'Recrutamento': 'Recrutamento & Seleção',
    'Contratos de trabalho': 'Elaboração de Contratos de Trabalho',
    'Recursos Humanos': 'Organização de Processos / Consultoria de RH',
    'Organização administrativa': 'Organização de Processos / Consultoria de RH',
    'Gestão de colaboradores': 'Organização de Processos / Consultoria de RH',
    'Processos internos': 'Organização de Processos / Consultoria de RH'
  };
  return map[necessidade] || 'Consultoria geral com a nossa equipa';
}

function buildDiagResult() {
  const data = new FormData(diagForm);
  const temEmpresa = data.get('temEmpresa') || '—';
  const registada = data.get('registada') || '—';
  const colaboradores = data.get('colaboradores') || '—';
  const urgente = data.get('urgente') || (data.getAll('desafios')[0] || '—');
  const quando = data.get('quando') || '—';
  const acompanhamento = data.get('acompanhamento') || '—';
  const servicoRecomendado = mapNecessidadeParaServico(urgente);
  const prioridade = quando === 'Imediatamente' ? 'Alta' : (quando === 'Este mês' ? 'Média' : 'A avaliar');

  document.getElementById('diagResult').innerHTML = `
    <h3>Diagnóstico AMS</h3>
    <dl>
      <dt>Situação</dt><dd>Empresa ${temEmpresa === 'Sim' ? (registada === 'Sim' ? 'já registada' : 'ainda não registada') : 'por criar'}, com ${colaboradores} colaborador(es).</dd>
      <dt>Necessidade principal</dt><dd>${urgente}</dd>
      <dt>Prioridade</dt><dd>${prioridade}</dd>
      <dt>Acompanhamento</dt><dd>${acompanhamento}</dd>
      <dt>Serviço recomendado</dt><dd>${servicoRecomendado}</dd>
    </dl>
    <p style="font-size:.82rem; margin-bottom:0;"><em>Esta é uma avaliação preliminar automática, não um parecer jurídico ou diagnóstico definitivo. O próximo passo é uma reunião de diagnóstico com um consultor AMS.</em></p>
    <div class="diag-result-actions">
      <a class="btn btn-primary btn-sm" href="#contacto" data-preselect="${servicoRecomendado}">Solicitar consultoria</a>
      <a class="btn btn-ghost btn-sm" href="https://wa.me/258841030400?text=${encodeURIComponent('Olá, fiz o diagnóstico no site e a necessidade principal é: ' + urgente)}" target="_blank" rel="noopener">Falar no WhatsApp</a>
      <a class="btn btn-ghost btn-sm" href="#agendamento">Agendar reunião</a>
    </div>`;
}

diagNext.addEventListener('click', () => { diagCurrent = Math.min(4, diagCurrent + 1); diagShowStep(diagCurrent); });
diagPrev.addEventListener('click', () => { diagCurrent = Math.max(1, diagCurrent - 1); diagShowStep(diagCurrent); });
diagShowStep(1);

/* ---------- RECURSOS (conteúdo informativo geral) ---------- */
const RESOURCES = [
  ['Como registar uma empresa em Moçambique', 'Visão geral das etapas típicas: reserva de nome, contrato de sociedade, certidão, NUIT, alvará, início de atividade, INSS e publicação no Boletim da República.'],
  ['Documentos necessários para abrir uma empresa', 'Em geral são pedidos documentos de identificação dos sócios, comprovativo de morada e definição do objeto social — a lista exata varia consoante o tipo de sociedade.'],
  ['Obrigações básicas de uma empresa', 'Depois de constituída, uma empresa tem obrigações fiscais e de segurança social periódicas, além da manutenção de registos e documentação organizada.'],
  ['Gestão de Recursos Humanos: por onde começar', 'Organizar processos de RH costuma começar por mapear a situação atual da equipa, os contratos existentes e os processos administrativos ligados aos colaboradores.'],
  ['Contratos de trabalho: o que deve constar', 'Um contrato de trabalho define habitualmente função, remuneração, horário e condições da relação laboral, em conformidade com a legislação aplicável.'],
  ['O que é o NUIT e para que serve', 'O NUIT (Número Único de Identificação Tributária) identifica o contribuinte junto das Finanças e é necessário para diversas operações empresariais.'],
  ['O que é o INSS e porque é obrigatório', 'O INSS é o Instituto Nacional de Segurança Social, ao qual as empresas e os seus colaboradores estão normalmente vinculados por via de contribuições.'],
  ['Boletim da República: o que é e quando é necessário', 'É a publicação oficial onde são divulgados atos legais, incluindo a constituição de sociedades, consoante a legislação em vigor.']
];
const resourcesGrid = document.getElementById('resourcesGrid');
RESOURCES.forEach(([title, desc]) => {
  const card = document.createElement('article');
  card.className = 'resource-card';
  card.innerHTML = `<h4>${title}</h4><p>${desc}</p>`;
  resourcesGrid.appendChild(card);
});

/* ---------- FAQ ---------- */
const FAQS = [
  ['Quanto tempo demora o registo de uma empresa?', 'O prazo varia consoante o tipo de empresa, a documentação disponível e as entidades envolvidas. Após uma avaliação inicial, a nossa equipa indica uma estimativa mais precisa para o seu caso.'],
  ['Que documentos são necessários?', 'Os documentos variam consoante o tipo de sociedade e a atividade. Contacte-nos para recebermos uma lista adaptada à sua situação.'],
  ['A AMS trata de todo o processo?', 'Sim, acompanhamos o processo do início ao fim, mas também pode solicitar apenas etapas específicas.'],
  ['Posso solicitar apenas uma parte do processo?', 'Sim. Os nossos serviços podem ser contratados de forma completa ou pontual, consoante a sua necessidade.'],
  ['A AMS presta serviços a empresas já existentes?', 'Sim, apoiamos tanto a criação de novas empresas como a organização e regularização de empresas já em funcionamento.'],
  ['Como funciona a consultoria de RH?', 'Começamos com um levantamento da situação atual da empresa e propomos um plano de organização de processos de Recursos Humanos adaptado à realidade do negócio.']
];
const faqList = document.getElementById('faqList');
FAQS.forEach(([q, a], i) => {
  const item = document.createElement('div');
  item.className = 'faq-item';
  item.innerHTML = `
    <button type="button" aria-expanded="false" aria-controls="faqA${i}" id="faqQ${i}">
      <span>${q}</span><span class="plus" aria-hidden="true">+</span>
    </button>
    <div class="faq-answer" id="faqA${i}" role="region" aria-labelledby="faqQ${i}"><p>${a}</p></div>`;
  const btn = item.querySelector('button');
  const answer = item.querySelector('.faq-answer');
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
  });
  faqList.appendChild(item);
});

/* ---------- AGENDAMENTO ---------- */
const scheduleForm = document.getElementById('scheduleForm');
const scheduleSuccess = document.getElementById('scheduleSuccess');
const scheduleWaBtn = document.getElementById('scheduleWaBtn');

// TODO (futuro): substituir por chamada real a uma API (ex.: Supabase) e/ou
// integração com Google Calendar. Por agora, apenas confirma no ecrã e
// prepara a mensagem de WhatsApp com os dados recolhidos.
async function scheduleAppointment(data) {
  return new Promise(resolve => setTimeout(() => resolve({ ok: true }), 300));
}

scheduleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(scheduleForm).entries());
  await scheduleAppointment(data);
  const msg = `Olá, gostaria de confirmar um agendamento:\nTipo: ${data.schType}\nModalidade: ${data.schMode}\nData: ${data.schDate}\nHorário: ${data.schTime}\nNome: ${data.schName}\nEmpresa: ${data.schCompany || '—'}\nTelefone: ${data.schPhone}`;
  scheduleWaBtn.href = 'https://wa.me/258841030400?text=' + encodeURIComponent(msg);
  scheduleForm.style.display = 'none';
  scheduleSuccess.classList.add('show');
});

/* ---------- FORMULÁRIO DE CONTACTO (multi-etapas) ---------- */
const form = document.getElementById('leadForm');
const stepEls = [...form.querySelectorAll('.form-step')];
const progressSteps = [...document.querySelectorAll('.progress-step')];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitButtons = document.getElementById('submitButtons');
const submitBtn = document.getElementById('submitBtn');
const waBtn = document.getElementById('waBtn');
const formSuccess = document.getElementById('formSuccess');
let current = 1;

form.querySelectorAll('.option-pill input').forEach(input => {
  input.addEventListener('change', () => {
    const pill = input.closest('.option-pill');
    if (input.type === 'radio') document.querySelectorAll(`input[name="${input.name}"]`).forEach(r => r.closest('.option-pill').classList.remove('checked'));
    pill.classList.toggle('checked', input.checked);
  });
});

function showStep(n) {
  stepEls.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === n));
  progressSteps.forEach(p => {
    const s = parseInt(p.dataset.step);
    p.classList.toggle('current', s === n);
    p.classList.toggle('done', s < n);
  });
  prevBtn.style.visibility = n === 1 ? 'hidden' : 'visible';
  nextBtn.style.display = n === 4 ? 'none' : 'inline-flex';
  submitButtons.style.display = n === 4 ? 'inline-flex' : 'none';
  if (n === 4) buildReview();
  if (n === 1 && window.__preselectService) {
    form.querySelectorAll('input[name="services"]').forEach(cb => {
      if (cb.value === window.__preselectService) { cb.checked = true; cb.closest('.option-pill').classList.add('checked'); }
    });
  }
}

function validateStep(n) {
  let ok = true;
  stepEls.find(s => parseInt(s.dataset.step) === n).querySelectorAll('[required]').forEach(inp => {
    const errEl = inp.parentElement.querySelector('.error-text');
    if (!inp.value.trim()) { ok = false; if (errEl) errEl.style.display = 'block'; inp.style.borderColor = '#C0392B'; }
    else { if (errEl) errEl.style.display = 'none'; inp.style.borderColor = ''; }
  });
  return ok;
}

nextBtn.addEventListener('click', () => { if (!validateStep(current)) return; current = Math.min(4, current + 1); showStep(current); });
prevBtn.addEventListener('click', () => { current = Math.max(1, current - 1); showStep(current); });
progressSteps.forEach(p => p.addEventListener('click', () => { const t = parseInt(p.dataset.step); if (t < current) { current = t; showStep(current); } }));

function getValues() {
  const data = new FormData(form);
  return {
    fullName: data.get('fullName') || '', companyName: data.get('companyName') || '', phone: data.get('phone') || '',
    email: data.get('email') || '', services: data.getAll('services'), registered: data.get('registered') || '',
    team: data.get('team') || '', need: data.get('need') || '', urgency: data.get('urgency') || '', contactPref: data.get('contactPref') || ''
  };
}

function buildReview() {
  const v = getValues();
  const rows = [
    ['Nome', v.fullName], ['Empresa', v.companyName || '—'], ['Contacto', v.phone], ['E-mail', v.email || '—'],
    ['Serviços', v.services.length ? v.services.join(', ') : '—'], ['Empresa registada', v.registered || '—'],
    ['Colaboradores', v.team || '—'], ['Necessidade', v.need || '—'], ['Urgência', v.urgency || '—'], ['Contacto preferido', v.contactPref || '—']
  ];
  document.getElementById('reviewList').innerHTML = rows.map(([k, val]) => `<div class="review-row"><dt>${k}</dt><dd>${val}</dd></div>`).join('');
}

// TODO (futuro): substituir por chamada real a uma API (ex.: Supabase) para
// persistir o pedido numa base de dados e alimentar o futuro painel administrativo.
async function submitLead(data) {
  return new Promise(resolve => setTimeout(() => resolve({ ok: true, id: 'local-' + Date.now() }), 300));
}

async function finishForm(openWhatsapp) {
  const v = getValues();
  await submitLead(v);
  if (openWhatsapp) {
    const msgLines = [
      'Olá, gostaria de solicitar um serviço à AMS.', `Nome: ${v.fullName}`, `Empresa: ${v.companyName || 'Ainda não tenho'}`,
      `Contacto: ${v.phone}`, v.email ? `E-mail: ${v.email}` : null, v.services.length ? `Serviço(s): ${v.services.join(', ')}` : null,
      v.registered ? `Empresa já registada: ${v.registered}` : null, v.team ? `Nº colaboradores: ${v.team}` : null,
      v.need ? `Necessidade: ${v.need}` : null, v.urgency ? `Urgência: ${v.urgency}` : null,
      v.contactPref ? `Prefere ser contactado por: ${v.contactPref}` : null
    ].filter(Boolean).join('\n');
    window.open('https://wa.me/258841030400?text=' + encodeURIComponent(msgLines), '_blank', 'noopener');
  }
  form.style.display = 'none';
  document.getElementById('progressBar').style.display = 'none';
  formSuccess.classList.add('show');
}

submitBtn.addEventListener('click', () => finishForm(false));
waBtn.addEventListener('click', () => finishForm(true));

showStep(1);
