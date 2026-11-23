// Replace placeholder JS with chat UI client logic
// Handles sending messages to backend and updating the UI

(function(){
  const messagesEl = document.getElementById('messages');
  const form = document.getElementById('composer');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  const BASE_URL = "http://localhost:5000";
  const API_ENDPOINT = joinUrl(BASE_URL, '/hello'); // adjust if your backend runs elsewhere

  function escapeHtml(str){
    if(!str) return '';
    return str.replace(/&/g,'&amp;')
              .replace(/</g,'&lt;')
              .replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;')
              .replace(/'/g,'&#039;');
  }

  function formatText(text){
    return escapeHtml(text).replace(/\n/g,'<br>');
  }

  function scrollToBottom(){
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendMessage(role, text){
    const el = document.createElement('div');
    el.className = 'message ' + role;
    el.innerHTML = `<div class="content">${formatText(text)}</div><small>${new Date().toLocaleTimeString()}</small>`;
    messagesEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  function createTyping(){
    const el = document.createElement('div');
    el.className = 'message ai';
    const typing = document.createElement('div');
    typing.className = 'typing';
    for(let i=0;i<3;i++){ const d = document.createElement('span'); d.className = 'dot'; typing.appendChild(d); }
    el.appendChild(typing);
    messagesEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  async function sendToApi(text){
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    if(!res.ok) {
      let detail = 'Network response was not ok';
      try {
        const errBody = await res.json();
        if (errBody && errBody.detail) detail = errBody.detail;
      } catch (parseError) {
        // Keep the status error when the body is not JSON.
      }
      throw new Error(detail);
    }
    let json =  await res.json();
    return json.response;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    appendMessage('user', text);
    input.value = '';
    input.focus();
    sendBtn.disabled = true;

    const typingEl = createTyping();
    try{
      const reply = await sendToApi(text);
      typingEl.remove();
      appendMessage('ai', reply || '(no response)');
    }catch(err){
      typingEl.remove();
      appendMessage('ai', 'Error: ' + err.message);
      console.error(err);
    }finally{
      sendBtn.disabled = false;
    }
  });

  // Enter to send, Shift+Enter for newline
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  // Small welcome message
  appendMessage('ai', 'Hello! I\'m your AI assistant. Ask me anything.');

  const appEl = document.getElementById('app');
  const themeToggle = document.getElementById('themeToggle');
  const clearChat = document.getElementById('clearChat');

  function applyTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    if (appEl) appEl.setAttribute('data-theme', next);
    document.body.setAttribute('data-theme', next);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = appEl && appEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
    applyTheme(appEl && appEl.getAttribute('data-theme'));
  }

  if (clearChat) {
    clearChat.addEventListener('click', () => {
      if (!messagesEl) return;
      messagesEl.replaceChildren();
      appendMessage('ai', 'Chat cleared. Ask me anything.');
    });
  }

})();
