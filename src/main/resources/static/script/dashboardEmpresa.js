/**
 * INITLANCE — EMPRESA DASHBOARD · script.js
 * Dados fictícios + lógica de interação completa
 */

// ============================================================
// DADOS FICTÍCIOS
// ============================================================

const DATA = {
  projects: [
    { id: 1, title: 'Redesign App Mobile', category: 'Design UI/UX', status: 'in-progress', progress: 75, freelancer: 'Ana Rodrigues', freelancerInitials: 'AN', value: 'R$ 4.800', deadline: '30/05/2026', description: 'Reestruturação completa da experiência visual do aplicativo mobile, com novos fluxos de usuário e componentes reutilizáveis.' },
    { id: 2, title: 'API REST de Pagamentos', category: 'Backend', status: 'delayed', progress: 40, freelancer: 'Carlos Mendes', freelancerInitials: 'CM', value: 'R$ 7.200', deadline: '15/04/2026', description: 'Desenvolvimento de API para integração com gateways de pagamento (Stripe, Pix, Boleto) com documentação Swagger.' },
    { id: 3, title: 'Landing Page Campanha', category: 'Front-end', status: 'completed', progress: 100, freelancer: 'Mariana Silva', freelancerInitials: 'MS', value: 'R$ 2.500', deadline: '10/04/2026', description: 'Criação de landing page responsiva para campanha de lançamento do produto, com formulário de captura e animações.' },
    { id: 4, title: 'E-commerce B2B', category: 'Desenvolvimento Web', status: 'in-progress', progress: 28, freelancer: 'Rafael Pinto', freelancerInitials: 'RP', value: 'R$ 11.000', deadline: '20/07/2026', description: 'Plataforma de e-commerce para vendas entre empresas, com painel administrativo, gestão de estoque e multi-usuário.' },
  ],

  proposals: [
    { id: 1, name: 'João Oliveira', initials: 'JO', job: 'Chatbot com IA', value: 'R$ 3.200', deadline: '25 dias', status: 'pending', rating: 4.9, skills: ['Python', 'LangChain', 'React'] },
    { id: 2, name: 'Fernanda Bastos', initials: 'FB', job: 'Identidade Visual', value: 'R$ 1.800', deadline: '15 dias', status: 'pending', rating: 4.7, skills: ['Figma', 'Illustrator', 'Branding'] },
    { id: 3, name: 'Rafael Pinto', initials: 'RP', job: 'E-commerce B2B', value: 'R$ 5.600', deadline: '45 dias', status: 'accepted', rating: 4.8, skills: ['Vue.js', 'Node.js', 'MongoDB'] },
    { id: 4, name: 'Lucas Freitas', initials: 'LF', job: 'Automação de Marketing', value: 'R$ 2.900', deadline: '20 dias', status: 'refused', rating: 4.5, skills: ['HubSpot', 'Make', 'Email'] },
    { id: 5, name: 'Patricia Alves', initials: 'PA', job: 'App iOS Fitness', value: 'R$ 8.400', deadline: '60 dias', status: 'pending', rating: 5.0, skills: ['Swift', 'UIKit', 'Firebase'] },
    { id: 6, name: 'Diego Santos', initials: 'DS', job: 'Dashboard BI', value: 'R$ 4.100', deadline: '30 dias', status: 'pending', rating: 4.6, skills: ['Power BI', 'Python', 'SQL'] },
    { id: 7, name: 'Camila Torres', initials: 'CT', job: 'Redação SEO', value: 'R$ 1.200', deadline: '10 dias', status: 'refused', rating: 4.4, skills: ['SEO', 'Copywriting', 'WordPress'] },
  ],

  jobs: [
    { id: 1, title: 'Desenvolvedor React Senior', category: 'Desenvolvimento Web', budget: 'R$ 8.000', deadline: '15/05/2026', proposals: 7 },
    { id: 2, title: 'Designer UI/UX Pleno', category: 'Design', budget: 'R$ 5.500', deadline: '20/05/2026', proposals: 12 },
    { id: 3, title: 'DevOps / AWS', category: 'DevOps', budget: 'R$ 6.000', deadline: '30/05/2026', proposals: 4 },
  ],

  conversations: [
    { id: 1, name: 'Ana Rodrigues', initials: 'AN', online: true, preview: 'Vou mandar o protótipo amanhã!', time: '09:42', unread: 2 },
    { id: 2, name: 'Carlos Mendes', initials: 'CM', online: false, preview: 'Preciso de mais 3 dias no prazo...', time: 'Ontem', unread: 1 },
    { id: 3, name: 'Mariana Silva', initials: 'MS', online: true, preview: 'Projeto entregue! 🎉', time: 'Ontem', unread: 0 },
    { id: 4, name: 'Rafael Pinto', initials: 'RP', online: false, preview: 'Confirmado o início na semana que vem', time: 'Seg', unread: 0 },
  ],

  chatMessages: {
    1: [
      { who: 'them', text: 'Oi! Estou finalizando os últimos ajustes no protótipo.', time: '09:20' },
      { who: 'me', text: 'Ótimo! Qual a previsão de entrega?', time: '09:35' },
      { who: 'them', text: 'Vou mandar o protótipo amanhã até as 18h!', time: '09:42' },
    ],
    2: [
      { who: 'them', text: 'Tive um imprevisto na integração com o Pix.', time: 'Ontem 14:10' },
      { who: 'me', text: 'Ok, qual o problema exato?', time: 'Ontem 14:15' },
      { who: 'them', text: 'Preciso de mais 3 dias no prazo, pode ser?', time: 'Ontem 14:20' },
    ],
    3: [
      { who: 'them', text: 'Landing page entregue e publicada! 🎉', time: 'Ontem 11:00' },
      { who: 'me', text: 'Ficou incrível, muito obrigado!', time: 'Ontem 11:05' },
    ],
    4: [
      { who: 'me', text: 'Pode começar na semana que vem?', time: 'Seg 10:00' },
      { who: 'them', text: 'Confirmado o início na semana que vem.', time: 'Seg 10:30' },
    ],
  },

  notifications: [
    { id: 1, type: 'proposal', icon: 'bi-lightning-charge-fill', color: 'c-purple', text: 'Nova proposta recebida de <strong>João Oliveira</strong> para Chatbot com IA', time: 'Agora mesmo', unread: true },
    { id: 2, type: 'message', icon: 'bi-chat-dots-fill', color: 'c-blue', text: '<strong>Ana Rodrigues</strong> te enviou uma mensagem', time: 'Há 15 min', unread: true },
    { id: 3, type: 'project', icon: 'bi-kanban-fill', color: 'c-orange', text: 'Prazo do projeto <strong>API REST de Pagamentos</strong> está se aproximando', time: 'Há 1 hora', unread: true },
    { id: 4, type: 'proposal', icon: 'bi-lightning-charge-fill', color: 'c-purple', text: 'Nova proposta de <strong>Patricia Alves</strong> para App iOS Fitness', time: 'Há 2 horas', unread: true },
    { id: 5, type: 'payment', icon: 'bi-wallet2', color: 'c-green', text: 'Pagamento de <strong>R$ 2.500</strong> para Mariana Silva foi processado', time: 'Há 3 horas', unread: false },
    { id: 6, type: 'project', icon: 'bi-check2-circle', color: 'c-green', text: 'Projeto <strong>Landing Page Campanha</strong> foi marcado como concluído', time: 'Ontem', unread: false },
    { id: 7, type: 'message', icon: 'bi-chat-dots-fill', color: 'c-blue', text: '<strong>Carlos Mendes</strong> enviou uma atualização sobre o projeto', time: 'Ontem', unread: false },
    { id: 8, type: 'proposal', icon: 'bi-lightning-charge-fill', color: 'c-purple', text: 'Nova proposta de <strong>Diego Santos</strong> para Dashboard BI', time: '2 dias atrás', unread: false },
  ],

  payments: [
    { freelancer: 'Mariana Silva', project: 'Landing Page Campanha', value: 'R$ 2.500', date: '10/04/2026', status: 'paid' },
    { freelancer: 'Ana Rodrigues', project: 'Redesign App Mobile (50%)', value: 'R$ 2.400', date: '01/04/2026', status: 'paid' },
    { freelancer: 'Rafael Pinto', project: 'E-commerce B2B (início)', value: 'R$ 3.300', date: '20/03/2026', status: 'paid' },
    { freelancer: 'Carlos Mendes', project: 'API REST de Pagamentos', value: 'R$ 7.200', date: '—', status: 'awaiting' },
    { freelancer: 'Fernanda Bastos', project: 'Identidade Visual', value: 'R$ 1.800', date: '—', status: 'awaiting' },
    { freelancer: 'Patricia Costa', project: 'Relatório Trimestral', value: 'R$ 900', date: '15/02/2026', status: 'paid' },
    { freelancer: 'Bruno Lima', project: 'Integração CRM', value: 'R$ 4.200', date: '28/01/2026', status: 'paid' },
  ],

  reviews: [
    { name: 'Mariana Silva', initials: 'MS', stars: 5, text: 'Empresa excelente! Briefing muito claro, comunicação ágil e pagamentos sempre em dia. Adorei trabalhar no projeto de landing page. Com certeza voltarei a colaborar!', project: 'Landing Page Campanha', date: 'Abr 2026' },
    { name: 'Ana Rodrigues', initials: 'AN', stars: 5, text: 'Ótima empresa para trabalhar. Feedback construtivo, respeito ao trabalho criativo e prazo flexível quando necessário.', project: 'Redesign App Mobile', date: 'Mar 2026' },
    { name: 'Bruno Lima', initials: 'BL', stars: 4, text: 'Projeto bem estruturado, escopo bem definido. Apenas algumas mudanças de requisito no meio do caminho, mas resolvemos bem.', project: 'Integração CRM', date: 'Jan 2026' },
    { name: 'Patricia Costa', initials: 'PC', stars: 4, text: 'Empresa séria e respeitosa. Pagamento no prazo, comunicação clara. Recomendo para outros freelancers da plataforma.', project: 'Relatório Trimestral', date: 'Fev 2026' },
  ],
};

// ============================================================
// ESTADO DA APLICAÇÃO
// ============================================================

const state = {
  currentSection: 'overview',
  activeConv: 1,
  proposals: JSON.parse(JSON.stringify(DATA.proposals)),
  jobs: JSON.parse(JSON.stringify(DATA.jobs)),
  notifications: JSON.parse(JSON.stringify(DATA.notifications)),
  chatMessages: JSON.parse(JSON.stringify(DATA.chatMessages)),
  projectFilter: 'all',
  proposalFilter: 'all',
};

// ============================================================
// NAVEGAÇÃO
// ============================================================

const sectionTitles = {
  overview:    'Visão Geral',
  projects:    'Projetos',
  proposals:   'Propostas',
  'publish-job': 'Publicar Vaga',
  messages:    'Mensagens',
  notifications: 'Notificações',
  financial:   'Financeiro',
  reviews:     'Avaliações',
  profile:     'Perfil da Empresa',
};

function byId(id) {
  return document.getElementById(id);
}

function bindIfExists(id, eventName, handler) {
  const element = byId(id);
  if (element) {
    element.addEventListener(eventName, handler);
  }
}

function navigateTo(section) {
  // Ocultar todas as seções
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  // Mostrar seção alvo
  const target = byId('sec-' + section);
  if (!target) return;
  target.classList.add('active');

  // Atualizar nav
  const navLink = document.querySelector(`.nav-link[data-section="${section}"]`);
  if (navLink) navLink.classList.add('active');

  // Atualizar título
  const topbarTitle = byId('topbarTitle');
  if (topbarTitle) {
    topbarTitle.textContent = sectionTitles[section] || section;
  }
  state.currentSection = section;

  // Fechar sidebar no mobile
  closeSidebar();

  // Renderizar conteúdo dinâmico
  renderSection(section);
}

function renderSection(section) {
  switch (section) {
    case 'projects':    renderProjects(); break;
    case 'proposals':   renderProposals(); break;
    case 'publish-job': renderJobs(); break;
    case 'messages':    renderMessages(); break;
    case 'notifications': renderNotifications(); break;
    case 'financial':   renderPayments(); break;
    case 'reviews':     renderReviews(); break;
  }
}

// ============================================================
// SIDEBAR
// ============================================================

function openSidebar() {
  const sidebar = byId('sidebar');
  const sidebarOverlay = byId('sidebarOverlay');
  if (!sidebar || !sidebarOverlay) return;

  sidebar.classList.add('open');
  sidebarOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  const sidebar = byId('sidebar');
  const sidebarOverlay = byId('sidebarOverlay');
  if (!sidebar || !sidebarOverlay) return;

  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// RENDER: PROJECTS
// ============================================================

function renderProjects() {
  const grid = byId('projectsGrid');
  if (!grid) return;
  const filter = state.projectFilter;
  const list = filter === 'all' ? DATA.projects : DATA.projects.filter(p => p.status === filter);

  grid.innerHTML = list.map(p => {
    const statusLabel = { 'in-progress': 'Em andamento', 'completed': 'Concluído', 'delayed': 'Atrasado' };
    return `
      <div class="project-card" data-id="${p.id}">
        <div class="project-card-top">
          <div>
            <div class="project-card-title">${p.title}</div>
            <div class="project-card-cat">${p.category}</div>
          </div>
          <span class="status-tag ${p.status}">${statusLabel[p.status]}</span>
        </div>
        <div class="project-freelancer">
          <div class="pf-avatar">${p.freelancerInitials}</div>
          <div class="pf-name">${p.freelancer}</div>
        </div>
        <div class="project-progress-label">
          <span>Progresso</span>
          <span>${p.progress}%</span>
        </div>
        <div class="progress-bar-full">
          <div class="progress-fill-full" style="width:${p.progress}%"></div>
        </div>
        <div class="project-card-footer">
          <div>
            <div class="project-value">${p.value}</div>
            <div class="project-deadline"><i class="bi bi-calendar3"></i> ${p.deadline}</div>
          </div>
          <button class="btn-outline-sm open-project-modal" data-id="${p.id}">
            <i class="bi bi-eye"></i> Detalhes
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Evento de abrir modal
  grid.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', () => openProjectModal(parseInt(btn.dataset.id)));
  });
}

// ============================================================
// RENDER: PROJECT MODAL
// ============================================================

function openProjectModal(id) {
  const p = DATA.projects.find(x => x.id === id);
  if (!p) return;

  const statusLabel = { 'in-progress': 'Em andamento', 'completed': 'Concluído', 'delayed': 'Atrasado' };

  const modalTitle = byId('modalProjectTitle');
  const modalBody = byId('modalProjectBody');
  const modal = byId('projectModal');
  if (!modalTitle || !modalBody || !modal) return;

  modalTitle.textContent = p.title;
  modalBody.innerHTML = `
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">${p.description}</p>
    <div class="modal-detail-row"><span>Status</span><span class="status-tag ${p.status}">${statusLabel[p.status]}</span></div>
    <div class="modal-detail-row"><span>Freelancer</span><span>${p.freelancer}</span></div>
    <div class="modal-detail-row"><span>Categoria</span><span>${p.category}</span></div>
    <div class="modal-detail-row"><span>Valor do Projeto</span><span style="color:var(--accent)">${p.value}</span></div>
    <div class="modal-detail-row"><span>Prazo Final</span><span>${p.deadline}</span></div>
    <div class="modal-detail-row"><span>Progresso</span><span>${p.progress}%</span></div>
    <div style="margin-top:16px;">
      <div class="progress-bar-full"><div class="progress-fill-full" style="width:${p.progress}%"></div></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:20px;">
      <button class="btn-outline" onclick="closeProjectModal()"><i class="bi bi-x"></i> Fechar</button>
      <button class="btn-primary" onclick="navigateTo('messages');closeProjectModal();"><i class="bi bi-chat-dots"></i> Falar com Freelancer</button>
    </div>
  `;

  modal.classList.add('open');
}

function closeProjectModal() {
  const modal = byId('projectModal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// ============================================================
// RENDER: PROPOSALS
// ============================================================

function renderProposals() {
  const list = byId('proposalsList');
  if (!list) return;
  const filter = state.proposalFilter;
  const proposals = filter === 'all' ? state.proposals : state.proposals.filter(p => p.status === filter);

  const statusLabel = { pending: 'Pendente', accepted: 'Aceito', refused: 'Recusado' };

  list.innerHTML = proposals.map(p => `
    <div class="proposal-card" data-id="${p.id}">
      <div class="proposal-avatar">${p.initials}</div>
      <div class="proposal-info">
        <div class="proposal-name">${p.name}</div>
        <div class="proposal-job">${p.job}</div>
        <div class="proposal-tags">
          ${p.skills.map(s => `<span class="status-tag in-progress" style="background:rgba(255,255,255,0.06);color:var(--text-secondary);border-color:var(--border);">${s}</span>`).join('')}
          <span style="font-size:12px;color:var(--c-yellow);margin-left:4px;"><i class="bi bi-star-fill"></i> ${p.rating}</span>
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div class="proposal-value">${p.value}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:3px;"><i class="bi bi-clock"></i> ${p.deadline}</div>
      </div>
      <div class="proposal-actions">
        <span class="status-tag ${p.status}">${statusLabel[p.status]}</span>
        ${p.status === 'pending' ? `
          <button class="btn-accept" data-accept="${p.id}"><i class="bi bi-check-lg"></i> Aceitar</button>
          <button class="btn-refuse" data-refuse="${p.id}"><i class="bi bi-x-lg"></i> Recusar</button>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Eventos aceitar/recusar
  list.querySelectorAll('[data-accept]').forEach(btn => {
    btn.addEventListener('click', () => respondProposal(parseInt(btn.dataset.accept), 'accepted'));
  });
  list.querySelectorAll('[data-refuse]').forEach(btn => {
    btn.addEventListener('click', () => respondProposal(parseInt(btn.dataset.refuse), 'refused'));
  });
}

function respondProposal(id, action) {
  const p = state.proposals.find(x => x.id === id);
  if (!p) return;
  p.status = action;
  renderProposals();
  showToast(action === 'accepted' ? 'success' : 'error', action === 'accepted' ? `Proposta de ${p.name} aceita!` : `Proposta de ${p.name} recusada.`);
}

// ============================================================
// RENDER: JOBS
// ============================================================

function renderJobs() {
  const el = document.getElementById('jobsList');
  if (!el) return;

  if (state.jobs.length === 0) {
    el.innerHTML = `<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:24px 0;">Nenhuma vaga publicada ainda.</p>`;
    return;
  }

  el.innerHTML = state.jobs.map(j => `
    <div class="job-item">
      <div class="job-item-top">
        <div class="job-item-title">${j.title}</div>
        <span class="status-tag in-progress" style="font-size:10px;">${j.proposals} propostas</span>
      </div>
      <div class="job-item-meta">
        <span><i class="bi bi-tag"></i> ${j.category}</span>
        <span><i class="bi bi-currency-dollar"></i> ${j.budget}</span>
        <span><i class="bi bi-calendar3"></i> ${j.deadline}</span>
      </div>
    </div>
  `).join('');
}

// PUBLICAR VAGA
function publishJob() {
  const title    = document.getElementById('jobTitle').value.trim();
  const desc     = document.getElementById('jobDesc').value.trim();
  const category = document.getElementById('jobCategory').value;
  const budget   = document.getElementById('jobBudget').value;
  const deadline = document.getElementById('jobDeadline').value;

  if (!title) { showToast('error', 'Informe o título da vaga.'); return; }
  if (!budget) { showToast('error', 'Informe o orçamento.'); return; }
  if (!deadline) { showToast('error', 'Informe o prazo.'); return; }

  const newJob = {
    id: state.jobs.length + 1,
    title,
    category,
    budget: `R$ ${parseFloat(budget).toLocaleString('pt-BR')}`,
    deadline: formatDate(deadline),
    proposals: 0,
  };

  state.jobs.unshift(newJob);
  renderJobs();

  // Limpar form
  document.getElementById('jobTitle').value   = '';
  document.getElementById('jobDesc').value    = '';
  document.getElementById('jobBudget').value  = '';
  document.getElementById('jobDeadline').value = '';

  showToast('success', `Vaga "${title}" publicada com sucesso!`);
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

// ============================================================
// RENDER: MESSAGES
// ============================================================

function renderMessages() {
  renderConversations();
  openConversation(state.activeConv);
}

function renderConversations() {
  const list = byId('convList');
  if (!list) return;
  list.innerHTML = DATA.conversations.map(c => `
    <div class="conv-item ${c.id === state.activeConv ? 'active' : ''}" data-conv="${c.id}">
      <div class="conv-avatar ${c.online ? 'conv-online' : ''}">${c.initials}</div>
      <div class="conv-info">
        <div class="conv-name">${c.name}</div>
        <div class="conv-preview">${c.preview}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
        <div class="conv-time">${c.time}</div>
        ${c.unread ? `<div class="conv-unread">${c.unread}</div>` : ''}
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.conv-item').forEach(item => {
    item.addEventListener('click', () => {
      state.activeConv = parseInt(item.dataset.conv);
      renderConversations();
      openConversation(state.activeConv);
    });
  });
}

function openConversation(id) {
  const conv = DATA.conversations.find(c => c.id === id);
  if (!conv) return;

  const chatAvatar = byId('chatAvatar');
  const chatName = byId('chatName');
  const el = byId('chatMessages');
  if (!chatAvatar || !chatName || !el) return;

  chatAvatar.textContent = conv.initials;
  chatName.textContent   = conv.name;

  const msgs = state.chatMessages[id] || [];

  el.innerHTML = msgs.map(m => `
    <div class="chat-msg ${m.who}">
      ${m.text}
      <div class="chat-msg-time">${m.time}</div>
    </div>
  `).join('');

  el.scrollTop = el.scrollHeight;
}

function sendMessage() {
  const input = byId('chatInput');
  if (!input) return;
  const text  = input.value.trim();
  if (!text) return;

  const id = state.activeConv;
  if (!state.chatMessages[id]) state.chatMessages[id] = [];

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  state.chatMessages[id].push({ who: 'me', text, time });
  input.value = '';
  openConversation(id);

  // Resposta automática simulada
  setTimeout(() => {
    const autoReplies = [
      'Entendido, vou verificar isso!',
      'Ok! Atualizo você em breve.',
      'Perfeito, pode deixar comigo.',
      'Tudo certo, obrigado pelo retorno!',
    ];
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    const now2  = new Date();
    const t2    = `${String(now2.getHours()).padStart(2,'0')}:${String(now2.getMinutes()).padStart(2,'0')}`;
    state.chatMessages[id].push({ who: 'them', text: reply, time: t2 });
    openConversation(id);
  }, 1200);
}

// ============================================================
// RENDER: NOTIFICATIONS
// ============================================================

function renderNotifications() {
  const list = byId('notificationsList');
  if (!list) return;
  list.innerHTML = state.notifications.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
      <div class="notif-icon ${n.color}"><i class="bi ${n.icon}"></i></div>
      <div class="notif-body">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${n.unread ? `<div style="width:8px;height:8px;background:var(--accent);border-radius:50%;flex-shrink:0;"></div>` : ''}
    </div>
  `).join('');

  list.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', () => {
      const n = state.notifications.find(x => x.id === parseInt(item.dataset.id));
      if (n) { n.unread = false; item.classList.remove('unread'); }
    });
  });
}

function markAllRead() {
  state.notifications.forEach(n => n.unread = false);
  renderNotifications();
  showToast('success', 'Todas as notificações foram marcadas como lidas.');
}

// ============================================================
// RENDER: PAYMENTS
// ============================================================

function renderPayments() {
  const tbody = byId('paymentsTableBody');
  if (!tbody) return;
  const statusLabel = { paid: 'Pago', awaiting: 'Aguardando' };

  tbody.innerHTML = DATA.payments.map(p => `
    <tr>
      <td>${p.freelancer}</td>
      <td>${p.project}</td>
      <td style="font-family:'Syne',sans-serif;font-weight:700;color:var(--accent)">${p.value}</td>
      <td>${p.date}</td>
      <td><span class="status-tag ${p.status}">${statusLabel[p.status]}</span></td>
    </tr>
  `).join('');
}

// ============================================================
// RENDER: REVIEWS
// ============================================================

function renderReviews() {
  const list = byId('reviewsList');
  if (!list) return;
  list.innerHTML = DATA.reviews.map(r => `
    <div class="review-card">
      <div class="review-card-top">
        <div class="review-card-avatar">${r.initials}</div>
        <div>
          <div class="review-card-name">${r.name}</div>
          <div class="review-card-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        </div>
        <div class="review-card-date">${r.date}</div>
      </div>
      <div class="review-card-text">"${r.text}"</div>
      <span class="review-card-project"><i class="bi bi-kanban"></i> ${r.project}</span>
    </div>
  `).join('');
}

// ============================================================
// CHARTS (Chart.js)
// ============================================================

function initCharts() {
  // Gráfico de Investimento Mensal
  const investCtx = document.getElementById('investChart');
  if (investCtx) {
    new Chart(investCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          {
            label: '2026',
            data: [8200, 9100, 7800, 9450, null, null, null, null, null, null, null, null],
            borderColor: '#7c4dff',
            backgroundColor: 'rgba(124,77,255,0.08)',
            borderWidth: 2.5,
            pointBackgroundColor: '#7c4dff',
            pointRadius: 4,
            fill: true,
            tension: 0.4,
          },
          {
            label: '2025',
            data: [6100, 7200, 8000, 7300, 8900, 9200, 7800, 8400, 9100, 8600, 9800, 10200],
            borderColor: '#3a3a4a',
            backgroundColor: 'rgba(58,58,74,0.05)',
            borderWidth: 2,
            pointBackgroundColor: '#3a3a4a',
            pointRadius: 3,
            fill: true,
            tension: 0.4,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#16161f',
            borderColor: 'rgba(124,77,255,0.3)',
            borderWidth: 1,
            titleColor: '#f0eeff',
            bodyColor: '#a09cb8',
            callbacks: {
              label: ctx => ` R$ ${ctx.raw?.toLocaleString('pt-BR') ?? '—'}`,
            }
          },
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#5e5a75', font: { size: 11 } } },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#5e5a75', font: { size: 11 }, callback: v => `R$ ${(v/1000).toFixed(0)}k` },
          },
        },
      }
    });
  }

  // Gráfico de Categoria (Doughnut)
  const catCtx = document.getElementById('categoryChart');
  if (catCtx) {
    new Chart(catCtx, {
      type: 'doughnut',
      data: {
        labels: ['Dev Web', 'Design', 'Backend', 'Mobile', 'Marketing', 'Dados'],
        datasets: [{
          data: [38, 22, 18, 12, 6, 4],
          backgroundColor: ['#7c4dff','#3b82f6','#22c55e','#f97316','#eab308','#a78bfa'],
          borderWidth: 0,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#a09cb8', font: { size: 11 }, padding: 12, boxWidth: 10 }
          },
          tooltip: {
            backgroundColor: '#16161f',
            borderColor: 'rgba(124,77,255,0.3)',
            borderWidth: 1,
            titleColor: '#f0eeff',
            bodyColor: '#a09cb8',
            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` }
          },
        },
      }
    });
  }
}

// ============================================================
// TOAST
// ============================================================

function showToast(type, message) {
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
  const container = byId('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `
    <i class="bi ${icons[type]} toast-icon"></i>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = 'all 0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ============================================================
// PERFIL — EDITAR
// ============================================================

function toggleProfileEdit(edit) {
  const profileViewMode = byId('profileViewMode');
  const profileEditMode = byId('profileEditMode');
  if (!profileViewMode || !profileEditMode) return;

  profileViewMode.style.display = edit ? 'none' : 'block';
  profileEditMode.style.display = edit ? 'block' : 'none';
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Navegação via nav links ---
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.section);
    });
  });

  // --- Navegação via data-nav (botões externos) ---
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-nav]');
    if (el) navigateTo(el.dataset.nav);
  });

  // --- Sidebar toggle ---
  bindIfExists('menuToggle', 'click', openSidebar);
  bindIfExists('sidebarOverlay', 'click', closeSidebar);

  // --- Fechar modal projeto ---
  bindIfExists('closeProjectModal', 'click', closeProjectModal);
  bindIfExists('projectModal', 'click', e => {
    if (e.target === byId('projectModal')) closeProjectModal();
  });

  // --- Filtro de projetos ---
  bindIfExists('projectFilter', 'change', function () {
    state.projectFilter = this.value;
    renderProjects();
  });

  // --- Filtro de propostas ---
  bindIfExists('proposalFilter', 'change', function () {
    state.proposalFilter = this.value;
    renderProposals();
  });

  // --- Publicar vaga ---
  bindIfExists('publishJobBtn', 'click', publishJob);

  // --- Chat: enviar mensagem ---
  bindIfExists('chatSendBtn', 'click', sendMessage);
  bindIfExists('chatInput', 'keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });

  // --- Pesquisa de conversas ---
  bindIfExists('convSearch', 'input', function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.conv-item').forEach(item => {
      const name = item.querySelector('.conv-name').textContent.toLowerCase();
      item.style.display = name.includes(q) ? '' : 'none';
    });
  });

  // --- Marcar notificações como lidas ---
  bindIfExists('markAllReadBtn', 'click', markAllRead);

  // --- Notif button no topbar ---
  bindIfExists('notifToggle', 'click', () => navigateTo('notifications'));

  // --- Perfil: editar / salvar / cancelar ---
  bindIfExists('editProfileBtn', 'click', () => toggleProfileEdit(true));
  bindIfExists('saveProfileBtn', 'click', () => {
    toggleProfileEdit(false);
    showToast('success', 'Perfil atualizado com sucesso!');
  });
  bindIfExists('cancelProfileBtn', 'click', () => toggleProfileEdit(false));

  // --- Avatar: simular troca ---
  bindIfExists('changeAvatarBtn', 'click', () => {
    showToast('info', 'Funcionalidade de upload em breve!');
  });

  // --- Inicializar charts ---
  initCharts();

  // --- Render inicial ---
  navigateTo('overview');
});
