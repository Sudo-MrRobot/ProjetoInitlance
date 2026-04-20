/* ======================================================
   INITLANCE DASHBOARD — script.js
   Funcionalidades:
   - Navegação entre seções via sidebar
   - Toggle da sidebar no mobile
   - Filtros dos projetos
   - Chat funcional (simulado)
   - Notificações (marcar como lido)
   - Gráfico de receita com Chart.js
   - Botão "Enviar Proposta" nos jobs
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. NAVEGAÇÃO POR SEÇÕES
     ============================================ */
  const navItems   = document.querySelectorAll('.nav-item[data-section]');
  const sections   = document.querySelectorAll('.section');
  const topbarTitle = document.getElementById('topbarTitle');

  // Mapeamento de seção → título exibido na topbar
  const sectionTitles = {
    overview:      'Visão Geral',
    projects:      'Projetos',
    proposals:     'Propostas',
    jobs:          'Buscar Trabalhos',
    messages:      'Mensagens',
    notifications: 'Notificações',
    financial:     'Financeiro',
    reviews:       'Avaliações',
  };

  /**
   * Ativa uma seção pelo id (ex: "overview")
   * e atualiza o estado ativo do nav
   */
  function activateSection(sectionId) {
    // Esconde todas as seções
    sections.forEach(s => s.classList.add('d-none'));

    // Mostra a seção alvo
    const target = document.getElementById(`sec-${sectionId}`);
    if (target) {
      target.classList.remove('d-none');
    }

    // Atualiza nav items
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Atualiza título da topbar
    topbarTitle.textContent = sectionTitles[sectionId] || '';

    // Fecha sidebar no mobile
    closeSidebar();
  }

  // Vincula clique a cada item do nav
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      activateSection(item.dataset.section);
    });
  });

  // Clique no ícone de notificação na topbar → abre seção de notificações
  document.getElementById('notifBtn').addEventListener('click', () => {
    activateSection('notifications');
  });


  /* ============================================
     2. SIDEBAR MOBILE (toggle)
     ============================================ */
  const sidebar        = document.getElementById('sidebar');
  const sidebarToggle  = document.getElementById('sidebarToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  sidebarOverlay.addEventListener('click', closeSidebar);


  /* ============================================
     3. FILTRO DE PROJETOS
     ============================================ */
  const filterBtns  = document.querySelectorAll('#sec-projects .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Mapeamento de texto do filtro → classe do badge de status
  const filterMap = {
    'Todos':         null,
    'Em andamento':  'ongoing',
    'Concluído':     'done',
    'Atrasado':      'late',
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualiza botão ativo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = filterMap[btn.textContent.trim()];

      projectCards.forEach(card => {
        if (!filter) {
          // "Todos" → mostra tudo
          card.style.display = '';
        } else {
          const badge = card.querySelector('.status-badge');
          const match = badge && badge.classList.contains(filter);
          card.style.display = match ? '' : 'none';
        }
      });
    });
  });


  /* ============================================
     4. CHAT FUNCIONAL (simulado)
     ============================================ */
  const chatInput   = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatMessages = document.getElementById('chatMessages');
  const chatItems   = document.querySelectorAll('.chat-item');
  const chatWinName = document.querySelector('.chat-win-name');
  const chatWinHeader = document.querySelector('.chat-win-header .chat-avatar');

  // Dados fictícios de conversas
  const chatData = {
    beatriz: {
      name: 'Beatriz Ramos',
      initials: 'BR',
      avatarClass: 'av-pink',
      status: 'Online agora',
      messages: [
        { type: 'received', text: 'Oi Luis! Tudo bem? Você consegue entregar o redesign até sexta-feira?', time: '10:28' },
        { type: 'sent',     text: 'Oi Beatriz! Estou finalizando os detalhes, acredito que sim 😊', time: '10:30' },
        { type: 'received', text: 'Ótimo! Pode me enviar um preview antes de finalizar?', time: '10:31' },
        { type: 'received', text: 'Você pode entregar até sexta?', time: '10:32' },
      ]
    },
    guilherme: {
      name: 'Guilherme Santos',
      initials: 'GS',
      avatarClass: 'av-purple',
      status: 'Visto há 2h',
      messages: [
        { type: 'received', text: 'Luis, o dashboard tá quase pronto né?', time: 'Ontem' },
        { type: 'sent',     text: 'Sim! Só falta ajustar os gráficos de análise.', time: 'Ontem' },
        { type: 'received', text: 'Ok! Vou revisar o layout', time: 'Ontem' },
      ]
    },
    maria: {
      name: 'Maria Lima',
      initials: 'ML',
      avatarClass: 'av-green',
      status: 'Visto há 1 dia',
      messages: [
        { type: 'sent',     text: 'Maria, acabei de subir a versão final do e-commerce!', time: '19 Abr' },
        { type: 'received', text: 'Muito obrigada! Ficou perfeito ⭐', time: '19 Abr' },
      ]
    },
    foodrocket: {
      name: 'FoodRocket',
      initials: 'FR',
      avatarClass: 'av-blue',
      status: 'Visto há 2 dias',
      messages: [
        { type: 'sent',     text: 'Olá! Estou interessado no projeto do App de Delivery. Segue minha proposta.', time: '18 Abr' },
        { type: 'received', text: 'Proposta recebida, analisando...', time: '18 Abr' },
      ]
    },
  };

  /**
   * Renderiza as mensagens de um chat no painel direito
   */
  function renderChat(chatId) {
    const data = chatData[chatId];
    if (!data) return;

    // Atualiza header
    chatWinName.textContent = data.name;
    chatWinHeader.textContent = data.initials;
    chatWinHeader.className = `chat-avatar ${data.avatarClass}`;
    document.querySelector('.chat-win-status').innerHTML =
      `<span class="dot-online"></span> ${data.status}`;

    // Renderiza mensagens
    chatMessages.innerHTML = '';
    data.messages.forEach(msg => addMessageBubble(msg.type, msg.text, msg.time));

    // Scroll ao final
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Cria e adiciona um bubble de mensagem ao DOM
   */
  function addMessageBubble(type, text, time) {
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.innerHTML = `
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <div class="msg-time">${time}</div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /** Sanitiza texto antes de inserir no DOM */
  function escapeHtml(text) {
    const map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Clique nos itens da lista de chat
  let activeChatId = 'beatriz';
  chatItems.forEach(item => {
    item.addEventListener('click', () => {
      chatItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activeChatId = item.dataset.chat;
      renderChat(activeChatId);
      // Remove badge de não lido ao abrir
      const badge = item.querySelector('.badge-count.red');
      if (badge) badge.remove();
    });
  });

  // Enviar mensagem
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Adiciona ao DOM
    addMessageBubble('sent', text, 'Agora');

    // Salva no chatData
    if (chatData[activeChatId]) {
      chatData[activeChatId].messages.push({ type: 'sent', text, time: 'Agora' });
    }

    chatInput.value = '';

    // Simula resposta automática após 1.5s
    setTimeout(() => {
      const replies = [
        'Entendido! Vou verificar.',
        'Ótimo, obrigado pela atualização! 👍',
        'Perfeito, aguardarei.',
        'Pode deixar, logo retorno.',
        'Recebido! Qualquer dúvida aviso.',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      addMessageBubble('received', reply, 'Agora');
      if (chatData[activeChatId]) {
        chatData[activeChatId].messages.push({ type: 'received', text: reply, time: 'Agora' });
      }
    }, 1500);
  }

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Renderiza chat inicial
  renderChat('beatriz');


  /* ============================================
     5. NOTIFICAÇÕES — marcar como lido
     ============================================ */
  const markAllBtn = document.getElementById('markAllRead');

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      document.querySelectorAll('.notif-item.unread').forEach(item => {
        item.classList.remove('unread');
        const dot = item.querySelector('.notif-dot-marker');
        if (dot) dot.remove();
      });

      // Zera badge de notificações no sidebar e topbar
      document.querySelector('.notif-dot')?.remove();
      document.querySelectorAll('.nav-item[data-section="notifications"] .badge-count')
        .forEach(b => b.remove());

      showToast('Todas as notificações foram marcadas como lidas.');
    });
  }


  /* ============================================
     6. GRÁFICO DE RECEITA (Chart.js)
     ============================================ */
  const ctx = document.getElementById('revenueChart');

  if (ctx) {
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const data2026 = [2100, 2800, 3400, 4750, null, null, null, null, null, null, null, null];
    const data2025 = [1200, 1800, 2200, 2900, 3100, 2400, 2800, 3200, 2700, 3500, 3100, 2600];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: '2026',
            data: data2026,
            borderColor: '#9d5cf6',
            backgroundColor: 'rgba(157, 92, 246, 0.12)',
            borderWidth: 2.5,
            pointBackgroundColor: '#9d5cf6',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: true,
            spanGaps: false,
          },
          {
            label: '2025',
            data: data2025,
            borderColor: '#333344',
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.4,
            borderDash: [5, 4],
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#18181f',
            borderColor: '#2a2a3a',
            borderWidth: 1,
            titleColor: '#f0eeff',
            bodyColor: '#a09ab8',
            padding: 12,
            callbacks: {
              label: ctx => ctx.parsed.y !== null
                ? ` R$ ${ctx.parsed.y.toLocaleString('pt-BR')}`
                : ' Sem dados',
            }
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#635e80', font: { size: 11 } },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: '#635e80',
              font: { size: 11 },
              callback: v => 'R$ ' + v.toLocaleString('pt-BR'),
            },
            beginAtZero: true,
          },
        },
      }
    });
  }


  /* ============================================
     7. BOTÃO "VER DETALHES" DOS PROJETOS
     ============================================ */
  document.querySelectorAll('.project-card .btn-outline-sm').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.closest('.project-card').querySelector('.project-name').textContent;
      showToast(`Abrindo detalhes: ${name}`);
    });
  });


  /* ============================================
     8. BOTÃO "ENVIAR PROPOSTA" NOS JOBS
     ============================================ */
  document.querySelectorAll('.job-card .btn-grad').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.closest('.job-card').querySelector('.job-title').textContent;
      btn.textContent = '✓ Proposta enviada!';
      btn.style.background = 'var(--green)';
      btn.disabled = true;
      showToast(`Proposta enviada para: ${title}`);
    });
  });


  /* ============================================
     9. TOAST DE FEEDBACK
     ============================================ */
  /**
   * Exibe um toast simples de notificação na tela
   * @param {string} message - texto a exibir
   */
  function showToast(message) {
    // Remove toast anterior se existir
    const existing = document.querySelector('.toast-notif');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notif';
    toast.textContent = message;

    // Estilo inline para o toast (não depende do CSS externo)
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: '#1f1f28',
      border: '1px solid rgba(157,92,246,0.3)',
      color: '#f0eeff',
      padding: '12px 20px',
      borderRadius: '10px',
      fontSize: '13px',
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      zIndex: '9999',
      opacity: '0',
      transform: 'translateY(10px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      maxWidth: '320px',
    });

    document.body.appendChild(toast);

    // Anima entrada
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Remove após 3 segundos
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }


  /* ============================================
     10. INICIALIZAÇÃO — começa na seção Overview
     ============================================ */
  activateSection('overview');

}); // end DOMContentLoaded