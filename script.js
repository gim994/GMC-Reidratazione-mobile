// === Language switch (UNICO modulo) ===
(function(){
  const htmlEl = document.documentElement;
  const body = document.body;
  const btnIT = document.getElementById('btnIT');
  const btnEN = document.getElementById('btnEN');

  function setPressed(lang){
    if (!btnIT || !btnEN) return;
    btnIT.setAttribute('aria-pressed', String(lang==='it'));
    btnEN.setAttribute('aria-pressed', String(lang==='en'));
  }

  function applyAttr(lang){
    const spec = [
      { attr: 'placeholder', dataIt: 'data-placeholder-it', dataEn: 'data-placeholder-en' },
      { attr: 'title',       dataIt: 'data-title-it',       dataEn: 'data-title-en' },
      { attr: 'aria-label',  dataIt: 'data-aria-it',        dataEn: 'data-aria-en' },
    ];
    const nodes = document.querySelectorAll(
      '[data-placeholder-it], [data-placeholder-en], [data-title-it], [data-title-en], [data-aria-it], [data-aria-en]'
    );
    nodes.forEach(el => {
      spec.forEach(({attr, dataIt, dataEn}) => {
        const val = (lang === 'it') ? el.getAttribute(dataIt) : el.getAttribute(dataEn);
        if (val != null) el.setAttribute(attr, val);
      });
    });
  }

  function applyText(lang){
    const nodes = document.querySelectorAll('[data-text-it], [data-text-en]');
    nodes.forEach(el => {
      const val = (lang==='it') ? el.getAttribute('data-text-it') : el.getAttribute('data-text-en');
      if (val != null) el.textContent = val;
    });
  }

  function applyInner(lang){
    document.querySelectorAll('[data-it],[data-en]').forEach(el=>{
      const val = el.getAttribute(lang === 'it' ? 'data-it' : 'data-en');
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll('option[data-it], option[data-en]').forEach(opt=>{
      const t = opt.getAttribute(lang==='it'?'data-it':'data-en');
      if (t != null) opt.textContent = t;
    });
  }

  function getLang(){
    try {
      const saved = localStorage.getItem('lang') || localStorage.getItem('ui_lang');
      if (saved === 'it' || saved === 'en') return saved;
    } catch(e){}
    return (document.documentElement.lang === 'en') ? 'en' : 'it';
  }

  function setLang(lang){
    try { localStorage.setItem('lang', lang); localStorage.setItem('ui_lang', lang); } catch(e){}
    htmlEl.lang = lang;
    htmlEl.setAttribute('data-ui-lang', lang);
    if (body) body.setAttribute('data-ui-lang', lang);
    setPressed(lang);
    applyInner(lang);
    applyText(lang);
    applyAttr(lang);

    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle){
      const aria = menuToggle.getAttribute(lang==='it'?'data-aria-it':'data-aria-en');
      if (aria) menuToggle.setAttribute('aria-label', aria);
    }
    const menuClose = document.getElementById('menuClose');
    if (menuClose){
      const aria = menuClose.getAttribute(lang==='it'?'data-aria-it':'data-aria-en');
      if (aria) menuClose.setAttribute('aria-label', aria);
    }
  }

  if (btnIT) btnIT.addEventListener('click', ()=> setLang('it'));
  if (btnEN) btnEN.addEventListener('click', ()=> setLang('en'));

  // Init
  const initialLang = getLang();
  setLang(initialLang);

  // Aggiorna anche i testi dei bottoni toggle in base alla lingua corrente
  document.querySelectorAll('[data-text-it][data-text-en]').forEach(btn => {
    const currentLang = document.documentElement.getAttribute('data-ui-lang') || initialLang || 'it';
    const val = btn.getAttribute(currentLang === 'it' ? 'data-text-it' : 'data-text-en');
    if (val) btn.textContent = val;
  });

  // Hint placeholder per datepicker
  const dateInput = document.getElementById('birthdate');
  if (dateInput) {
    const userLang = navigator.language || 'it-IT';
    dateInput.setAttribute('placeholder', userLang === 'en-US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY');
  }
})();
