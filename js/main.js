/* =========================================================
   AETHERNOS — 인터랙션
   · 해시 주소(#/world, #/characters/ranos …)로 챕터 페이지를 나눠 보여줍니다.
   · 인물 링크 공유:  주소 뒤에 #/c/인물id  (예: #/c/vivian)
   · 언어: 한국어(기본) · English · 日本語 · 繁體中文
     번역은 js/lang/en.js · ja.js · zh.js 에 있고, 고른 언어의 파일만 불러옵니다.
   ========================================================= */
(() => {
  'use strict';

  const D = window.AETHERNOS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const body = document.body;

  if (!D) { body.classList.remove('is-locked'); root.classList.remove('i18n-wait'); return; }
  const { FACTIONS, ORDER, REGIONS, CHARACTERS, RELATIONS, SEAL_BOUND } = D;

  /* ═════════════════════════════════════════════
     언어
     ═════════════════════════════════════════════ */
  const WANT = window.AETH_LANG || 'ko';
  const LX = WANT !== 'ko' && window.AETH_L10N && window.AETH_L10N.code === WANT ? window.AETH_L10N : null;
  const LANG = LX ? WANT : 'ko';

  /* 스크립트가 만드는 문구 — 한국어 기본값 (번역 파일에 같은 키가 있으면 그쪽을 씀) */
  const KO = {
    'site.title': '에테르노스 연대기',
    'nav.world': '세계관', 'nav.map': '대륙 지도', 'nav.regions': '지역', 'nav.power': '무력 체계',
    'nav.characters': '인물', 'nav.relations': '관계도', 'nav.eight': '팔대열강',
    'nav.menuOpen': '메뉴 열기', 'nav.menuClose': '메뉴 닫기',
    'common.abyss': '나락 · 타르타로스', 'common.prev': '이전', 'common.next': '다음',
    'common.viewDetail': '{name} 상세 보기', 'common.openRecord': '상세 기록 보기', 'common.sealedShort': '봉인',
    'secret.title': '비밀 기록 — 눌러서 보기',
    'secret.on': '비밀 기록이 드러났습니다 — 스포일러 주의',
    'secret.off': '비밀 기록을 다시 봉인했습니다',
    'eight.aff': '팔대열강 · {rank}위 {title}',
    'eight.rankLine': '팔대열강 {rank}위 · {title}',
    'eight.sealed': '封印 · 봉인 중',
    'eight.sigilAria': '{rank}위 {title} {name}의 문장',
    'eight.stripItem': '{rank}위 {title} {name}',
    'eight.prev': '이전 문장', 'eight.next': '다음 문장',
    'spot.openAria': '{name} 상세 기록 열기', 'spot.shuffle': '다른 인물',
    'omen.unstable': '불안정', 'omen.alert': '파동 감지',
    'world.facMore': '인물 {n}명 · 지역 기록',
    'map.regionAlt': '{name} 풍경', 'map.open': '지역 기록 펼치기',
    'regions.stepAria': '이전 · 다음 지역', 'regions.prev': '이전 지역', 'regions.next': '다음 지역',
    'regions.abyssAlt': '나락 · 타르타로스 — 붉은 봉인광이 솟는 흑색 대협곡과 석주, 거대한 사슬',
    'regions.meter': '봉인광', 'regions.meterV': '맥동 중 · 약화',
    'regions.sealCast': '봉인에 얽힌 자들', 'regions.toGraph': '관계도에서 보기',
    'regions.rumor': 'Rumor · 떠도는 소문',
    'regions.castAria': '{name}의 인물', 'regions.castH': '이 땅의 인물 · {n}명', 'regions.toCards': '카드로 보기',
    'regions.guest': '{rank}위 {title} · 설산 정상에 머무는 자',
    'style.flash': '일섬류', 'style.flow': '유전류', 'style.chaos': '난전류',
    'sw.flash.7': '섬신 閃神', 'sw.flash.6': '섬제 閃帝', 'sw.flash.5': '섬왕 閃王', 'sw.flash.4': '섬성 閃聖',
    'sw.flow.7': '유신 流神', 'sw.flow.6': '유제 流帝', 'sw.flow.5': '유왕 流王', 'sw.flow.4': '유성 流聖',
    'sw.chaos.7': '난신 亂神', 'sw.chaos.6': '난제 亂帝', 'sw.chaos.5': '난왕 亂王', 'sw.chaos.4': '난성 亂聖',
    'power.apex': '정점 · 단 한 명', 'power.styleWho': '{style}의 검사들',
    'pm.sylvia': '섬성', 'pm.gareth': '기사 부단장', 'pm.liese': '상급',
    'pm.brunnhilde': '유왕', 'pm.vivian': '기사단장', 'pm.otto': '중급',
    'pm.cassius': '난성', 'pm.rosamund': 'A급 모험가',
    'mage.violetta': '팔대열강 6위 · 마도왕', 'mage.adelheid': '대현자 · 학장', 'mage.frieda': '소환 · 계약 교수',
    'mage.sera': '상급 · 화염', 'mage.reiner': '중급 · 뇌격', 'mage.nina': '치유 견습',
    'card.rankPos': '{rank}위 {title} · {pos}',
    'card.silent': '— 말이 없다. 시선과 검으로만 답한다.',
    'card.aria': '{name}, {pos} — 상세 보기',
    'card.hook': '이야기의 열쇠를 쥔 인물',
    'roster.found': '“{q}” 검색 결과 <b>{n}</b>명 · 모든 소속에서 찾았습니다',
    'roster.none': '“{q}”에 해당하는 인물이 기록에 없습니다.',
    'roster.count': '<b>{n}</b>인물', 'roster.toRegion': '지역 기록', 'roster.toRing': '문장의 원으로',
    'roster.stepAria': '이전 · 다음 소속',
    'rel.seal': '봉인', 'rel.sealAria': '나락 · 타르타로스의 봉인',
    'rel.openSeal': '봉인지 기록 열기', 'rel.openRecord': '상세 기록 열기',
    'rel.none': '알려진 관계가 없다',
    'rel.sealDesc': '태고의 마왕이 잠든 봉인지', 'rel.sealRecord': '봉인지 기록', 'rel.sealRecordOpen': '봉인지 기록 펼치기',
    'rel.record': '상세 기록',
    'rel.legendSeal': '봉인과 이어진 인연', 'rel.legendSecret': '비밀 관계',
    'rel.hint': '<b>인연의 실</b>인물이나 선을 가리키면 이어진 관계가 이곳에 표시됩니다. 한 번 누르면 고정되고, 고정된 인물을 한 번 더 누르면 상세 기록이 열립니다. 가운데 붉은 원은 나락 · 타르타로스의 봉인입니다.',
    'dos.silent': '— 말이 없다. 시선과 검의 움직임으로만 답한다.',
    'dos.hook': '✦ 이야기의 열쇠', 'dos.speech': '말투 — {s}', 'dos.cue': '프로필 · 이야기 · 관계',
    'dos.tabsAria': '기록 분류', 'dos.tProfile': '프로필', 'dos.tStory': '이야기', 'dos.tRel': '관계',
    'dos.story': '배경', 'dos.looks': '외형', 'dos.traits': '성격', 'dos.items': '소지품', 'dos.aff': '소속',
    'dos.secretNote': '붉게 가려진 문장은 <b>비밀 기록</b>입니다. 눌러서 하나씩 보거나, 상단의 ‘비밀 기록’ 스위치로 한꺼번에 드러낼 수 있습니다.',
    'dos.regionLink': '{name} 지역 기록', 'dos.noRel': '기록된 관계가 없다.',
    'dos.prevAria': '이전 인물 {name}', 'dos.nextAria': '다음 인물 {name}', 'dos.link': '링크',
    'dos.artAlt': '{name} 원화', 'dos.zoom': '원화 크게 보기',
    'dos.copied': '{name}의 기록 링크를 복사했습니다', 'dos.copyFail': '복사하지 못했습니다 — {url}',
    'pal.gChapters': 'Chapters · 챕터', 'pal.gRegions': 'Regions · 지역', 'pal.gPeople': 'People · 인물',
    'pal.prologue': '프롤로그', 'pal.prologueS': '처음 화면 · 오늘의 인물',
    'pal.sWorld': 'I · 봉인과 마물, 종족과 진영', 'pal.sMap': 'II · 다섯 터전의 위치', 'pal.sRegions': 'III · 다섯 터전과 봉인지',
    'pal.sPower': 'IV · 검술 3대 유파 · 마법 · 모험가 등급', 'pal.sChars': 'V · 소속별 인물 카드',
    'pal.sRel': 'VI · 진영을 넘어 얽힌 인연', 'pal.sEight': 'VII · 현세 무력의 정점에 선 여덟',
    'pal.none': '“{q}”에 해당하는 기록이 없습니다.'
  };
  const T = (k, vars) => {
    let s = LX && LX.ui && LX.ui[k] != null ? LX.ui[k] : KO[k] != null ? KO[k] : k;
    if (vars) s = String(s).replace(/\{(\w+)\}/g, (m, n) => (vars[n] != null ? vars[n] : ''));
    return s;
  };

  /* 번역 데이터를 원본 위에 덮어쓰기 (원래 한국어 이름은 c.ko 로 보관 → 검색에 사용) */
  CHARACTERS.forEach(c => { c.ko = c.name; });
  if (LX) {
    Object.entries(LX.factions || {}).forEach(([id, o]) => {
      const F = FACTIONS[id]; if (!F) return;
      const koName = F.name;
      Object.assign(F, o);
      if (LANG === 'en') F.en = koName;
    });
    REGIONS.forEach(r => {
      const o = (LX.regions || {})[r.id]; if (!o) return;
      const koName = r.name;
      Object.assign(r, o);
      if (LANG === 'en') r.en = koName;
    });
    CHARACTERS.forEach(c => {
      const o = (LX.chars || {})[c.id]; if (!o) return;
      const rel = c.rel || [];
      Object.assign(c, o, { rel: rel.map(([id, label], i) => [id, (o.rel && o.rel[i] != null) ? o.rel[i] : label]) });
      if (LANG === 'en') c.en = c.ko;
    });
    (LX.relations || []).forEach((t, i) => { if (RELATIONS[i] && t) { RELATIONS[i][2] = t[0]; RELATIONS[i][3] = t[1]; } });
    (LX.seal || []).forEach((t, i) => { if (SEAL_BOUND[i] && t != null) SEAL_BOUND[i][1] = t; });
  }

  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = () => mqReduce.matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const byId = new Map(CHARACTERS.map(c => [c.id, c]));
  const regionById = new Map(REGIONS.map(r => [r.id, r]));
  const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const EIGHT = CHARACTERS.filter(c => c.f === 'eight').sort((a, b) => a.rank - b.rank);

  const imgSrc = c => encodeURI(`images/캐릭터/${c.img}.jpg`);
  const logoSrc = c => encodeURI(`images/팔대열강 로고/${c.logo}.png`);
  const regionSrc = r => encodeURI(`images/지역/${r.img}.jpg`);
  const BG_MAIN = encodeURI('images/배경/메인 배경.jpg');
  const BG_MAP = encodeURI('images/지역/전체 메인 지도.jpg');
  const BG_ABYSS = encodeURI('images/지역/나락.jpg');

  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const SECRET_RE = /\{\{([\s\S]*?)\}\}/g;
  /* {{…}} → 가려진 비밀 기록 */
  const fmt = s => esc(s).replace(SECRET_RE, (_, t) => `<span class="secret" tabindex="0" role="button" title="${esc(T('secret.title'))}">${t}</span>`);
  const plain = s => String(s).replace(SECRET_RE, '').trim();
  const isAllSecret = s => /^\{\{[\s\S]*\}\}$/.test(String(s).trim());
  const shortName = c => c.short || c.name.split(/[\s·・‧•]/)[0];
  const smooth = () => (reduce() ? 'auto' : 'smooth');
  const icon = (id, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true"><use href="#${id}"/></svg>`;
  const regionOf = f => REGIONS.find(r => r.f === f);
  const affOf = c => (c.f === 'eight' ? T('eight.aff', { rank: c.rank, title: c.title }) : FACTIONS[c.f].name);
  const later = (fn, ms) => setTimeout(fn, ms);
  const siteTitle = sub => (sub ? `${sub} — ${T('site.title')}` : T('site.title'));

  /* 정적인 문구 번역 (data-i18n · data-i18n-html · data-i18n-attr) */
  (() => {
    if (LX) {
      const ui = LX.ui || {};
      $$('[data-i18n]').forEach(el => { const v = ui[el.dataset.i18n]; if (v != null) el.textContent = v; });
      $$('[data-i18n-html]').forEach(el => { const v = ui[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v; });
      $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        if (ui[key] != null) el.setAttribute(attr, ui[key]);
      }));
    }
    // 본문에 박힌 인물 이름 (예: 위계표의 버튼)
    $$('[data-cname]').forEach(el => {
      const c = byId.get(el.dataset.cname);
      if (c) el.textContent = el.hasAttribute('data-short') ? shortName(c) : c.name;
    });
    document.title = siteTitle();
    root.classList.remove('i18n-wait');
  })();

  /* ─────────────────────────────────────────────
     언어 고르기 메뉴
     ───────────────────────────────────────────── */
  (() => {
    const box = $('#lang'), btn = $('#langBtn'), menu = $('#langMenu');
    if (!box) return;
    const CODES = { ko: 'KO', en: 'EN', ja: 'JA', zh: '繁中' };
    $('#langCur').textContent = CODES[LANG];
    $$('[data-lang]', menu).forEach(b => b.setAttribute('aria-checked', String(b.dataset.lang === LANG)));
    const set = open => { box.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', e => { e.stopPropagation(); set(!box.classList.contains('is-open')); });
    document.addEventListener('click', e => { if (!box.contains(e.target)) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    menu.addEventListener('click', e => {
      const b = e.target.closest('[data-lang]');
      if (!b) return;
      const L = b.dataset.lang;
      if (L === LANG) { set(false); return; }
      try { localStorage.setItem('aeth-lang', L); sessionStorage.setItem('aeth-unsealed', '1'); } catch (err) { /* 무시 */ }
      const u = new URL(location.href);
      if (u.searchParams.has('lang')) { u.searchParams.delete('lang'); location.replace(u.href); }
      else location.reload();
    });
  })();

  /* ─────────────────────────────────────────────
     알림
     ───────────────────────────────────────────── */
  const toast = (() => {
    const el = $('#toast');
    let t = 0;
    return msg => {
      el.textContent = msg;
      el.classList.add('is-on');
      clearTimeout(t);
      t = setTimeout(() => el.classList.remove('is-on'), 2200);
    };
  })();

  /* ─────────────────────────────────────────────
     비밀 기록 (스포일러) 스위치
     ───────────────────────────────────────────── */
  const Secrets = (() => {
    const btn = $('#secretBtn');
    const subs = [];
    let on = false;
    try { on = localStorage.getItem('aeth-secrets') === '1'; } catch (e) { /* 저장소 없음 */ }
    function set(v, announce) {
      on = v;
      root.classList.toggle('show-secrets', on);
      btn.setAttribute('aria-pressed', String(on));
      $('use', btn).setAttribute('href', on ? '#i-unlock' : '#i-lock');
      try { localStorage.setItem('aeth-secrets', on ? '1' : '0'); } catch (e) { /* 무시 */ }
      if (announce) toast(T(on ? 'secret.on' : 'secret.off'));
      subs.forEach(f => f(on));
    }
    btn.addEventListener('click', () => set(!on, true));
    set(on, false);
    return { get on() { return on; }, sub(f) { subs.push(f); } };
  })();

  /* ─────────────────────────────────────────────
     에테르 입자 (canvas)
     ───────────────────────────────────────────── */
  const Aether = (() => {
    const cv = $('#aether');
    const ctx = cv && cv.getContext && cv.getContext('2d');
    if (!ctx) return { burst() {} };
    let w = 0, h = 0, motes = [], sparks = [], raf = 0, running = false;

    const sprite = rgb => {
      const s = document.createElement('canvas');
      s.width = s.height = 64;
      const g = s.getContext('2d');
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, `rgba(${rgb},1)`);
      grd.addColorStop(0.22, `rgba(${rgb},.5)`);
      grd.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grd;
      g.fillRect(0, 0, 64, 64);
      return s;
    };
    const SPR = [sprite('143,227,245'), sprite('244,222,163'), sprite('255,255,255')];
    const mote = anywhere => ({
      x: Math.random() * w, y: anywhere ? Math.random() * h : h + 20,
      r: 0.8 + Math.random() * 2.6, vy: -(0.1 + Math.random() * 0.35), vx: (Math.random() - 0.5) * 0.1,
      ph: Math.random() * Math.PI * 2, sp: 0.006 + Math.random() * 0.014, s: Math.random() < 0.35 ? 1 : 0
    });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: Math.round(Math.min(90, (w * h) / 18000)) }, () => mote(true));
    }
    function paint(step) {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const m of motes) {
        if (step) {
          m.ph += m.sp; m.y += m.vy; m.x += m.vx + Math.sin(m.ph) * 0.2;
          if (m.y < -20) Object.assign(m, mote(false));
        }
        const size = m.r * 6;
        ctx.globalAlpha = 0.18 + 0.4 * (0.5 + 0.5 * Math.sin(m.ph * 1.7));
        ctx.drawImage(SPR[m.s], m.x - size / 2, m.y - size / 2, size, size);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx; p.y += p.vy; p.vx *= 0.962; p.vy *= 0.962; p.vy -= 0.015; p.life -= p.decay;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        const size = p.r * 9 * p.life + 2;
        ctx.globalAlpha = Math.min(1, p.life * 1.3);
        ctx.drawImage(SPR[p.s], p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    }
    function frame() { paint(true); raf = requestAnimationFrame(frame); }
    function start() { if (running || reduce()) return; running = true; raf = requestAnimationFrame(frame); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize();
    addEventListener('resize', () => { resize(); if (!running) paint(false); });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    if (reduce()) paint(false); else start();

    return {
      burst(x, y, n = 150) {
        if (reduce()) return;
        for (let i = 0; i < n; i++) {
          const dir = Math.random() < 0.5 ? -1 : 1;
          sparks.push({
            x: x + (Math.random() - 0.5) * 6, y: y + (Math.random() - 0.5) * h * 0.9,
            vx: dir * (1.5 + Math.random() * 11), vy: (Math.random() - 0.5) * 3,
            r: 0.6 + Math.random() * 1.8, life: 1, decay: 0.007 + Math.random() * 0.016,
            s: Math.random() < 0.5 ? 1 : (Math.random() < 0.6 ? 0 : 2)
          });
        }
      }
    };
  })();

  /* ─────────────────────────────────────────────
     뒷배경 원화 (두 겹 교차)
     ───────────────────────────────────────────── */
  const Backdrop = (() => {
    const A = $('#bgA'), B = $('#bgB');
    let front = A, cur = null;
    return {
      set(url) {
        if (url === cur) return;
        cur = url;
        const back = front === A ? B : A;
        back.style.backgroundImage = url ? `url("${url}")` : 'none';
        back.classList.add('is-on');
        front.classList.remove('is-on');
        front = back;
      }
    };
  })();

  /* ─────────────────────────────────────────────
     스크롤 등장
     ───────────────────────────────────────────── */
  const revealIO = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' })
    : null;
  const observeReveals = scope => $$('.rv:not(.is-in)', scope).forEach(el => (revealIO ? revealIO.observe(el) : el.classList.add('is-in')));

  /* 카드 3D 기울임 */
  function bindTilt(container) {
    if (!container || !finePointer) return;
    container.addEventListener('pointermove', e => {
      if (reduce()) return;
      const card = e.target.closest('.tilt');
      if (!card || !container.contains(card)) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
    container.addEventListener('pointerout', e => {
      const card = e.target.closest('.tilt');
      if (card && !card.contains(e.relatedTarget)) { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); }
    });
  }

  /* 공용 조각 */
  const personBtn = (c, label) =>
    `<button class="person" type="button" data-open="${c.id}" style="--pc:${FACTIONS[c.f].color}">` +
    `<img src="${imgSrc(c)}" alt="" loading="lazy" decoding="async"><span><b>${esc(c.name)}</b><small>${fmt(label)}</small></span></button>`;
  const avatarBtn = c =>
    `<button class="avatar" type="button" data-open="${c.id}" data-name="${esc(c.name)}" aria-label="${esc(T('common.viewDetail', { name: c.name }))}" style="--ac:${FACTIONS[c.f].color}">` +
    `<img src="${imgSrc(c)}" alt="" loading="lazy" decoding="async"></button>`;
  const silentLine = () => T('dos.silent');

  /* ═════════════════════════════════════════════
     페이지들
     ═════════════════════════════════════════════ */

  /* ── 0. 프롤로그 ── */
  const Home = {
    init() {
      this.el = $('#spotlight');
      this.shuffle();
      this.wave();
    },
    shuffle() {
      const pool = CHARACTERS.filter(c => c !== this.cur && c.quote);
      const c = pool[Math.floor(Math.random() * pool.length)];
      this.cur = c;
      const F = FACTIONS[c.f];
      this.el.innerHTML = `
        <article class="spot is-swap" style="--fc:${F.color}">
          <button class="spot__art" type="button" data-open="${c.id}" aria-label="${esc(T('spot.openAria', { name: c.name }))}"><img src="${imgSrc(c)}" alt="" decoding="async"></button>
          <div class="spot__body">
            <p class="spot__aff">${icon(F.emblem)}${esc(affOf(c))}</p>
            <h3 class="spot__name">${esc(c.name)}</h3>
            <p class="spot__en">${esc(c.en)}</p>
            <blockquote class="spot__quote">${esc(c.quote)}</blockquote>
            <p class="spot__pos">${esc(c.pos)}</p>
            <div class="spot__actions">
              <button class="btn btn--gold" type="button" data-open="${c.id}">${esc(T('common.openRecord'))}${icon('i-arrow')}</button>
              <button class="btn btn--ghost" type="button" data-shuffle>${icon('i-shuffle')}${esc(T('spot.shuffle'))}</button>
            </div>
          </div>
        </article>`;
    },
    /* 봉인 관측 파형 */
    wave() {
      const path = $('#omenPath'), state = $('#omenState');
      if (!path) return;
      const W = 240, H = 64, N = 72;
      let t = 0, spike = 0, at = 0.75, last = 0;
      const build = () => {
        let d = '';
        for (let i = 0; i <= N; i++) {
          const k = i / N;
          let y = Math.sin(k * 10 + t * 2.2) * 4.5 + Math.sin(k * 27 - t * 3.4) * 2 + Math.sin(k * 3 + t * 0.7) * 3;
          y += spike * Math.exp(-Math.pow((k - at) * 10, 2)) * 24 * Math.sin(k * 70 + t * 9);
          d += (i ? 'L' : 'M') + (k * W).toFixed(1) + ' ' + (H / 2 + y).toFixed(1);
        }
        path.setAttribute('d', d);
      };
      const loop = now => {
        requestAnimationFrame(loop);
        if (Router.page !== 'home' || document.hidden || now - last < 40) return;
        last = now; t += 0.05;
        if (spike < 0.03 && Math.random() < 0.016) { spike = 1; at = 0.5 + Math.random() * 0.4; }
        spike *= 0.94;
        const alert = spike > 0.45;
        state.classList.toggle('is-alert', alert);
        state.textContent = T(alert ? 'omen.alert' : 'omen.unstable');
        build();
      };
      build();
      if (!reduce()) requestAnimationFrame(loop);
    },
    bg: () => BG_MAIN
  };

  /* ── I. 세계관 ── */
  const World = {
    init() {
      $('#worldFactions').innerHTML = REGIONS.filter(r => !r.abyss).map(r => {
        const F = FACTIONS[r.f];
        const n = CHARACTERS.filter(c => c.f === r.f).length;
        return `<a class="faction rv" href="#/regions/${r.id}" style="--fc:${F.color}">
          <span class="faction__art" style="background-image:url('${regionSrc(r)}')"></span>
          ${icon(F.emblem, 'faction__em')}
          <small>${esc(F.en)}</small>
          <b>${esc(F.name)}</b>
          <p>${esc(F.blurb)}</p>
          <span class="faction__more">${esc(T('world.facMore', { n }))}${icon('i-arrow')}</span>
        </a>`;
      }).join('');
      $('#worldEight').innerHTML = EIGHT.map(c => `
        <li><a class="e8 rv${c.sealed ? ' is-sealed' : ''}" href="#/eight/${c.rank}" style="--d:${c.rank}">
          <img src="${logoSrc(c)}" alt="" loading="lazy" decoding="async">
          <i>${ROMAN[c.rank]}</i><b>${esc(c.title)}</b><span>${esc(c.domain)}${c.sealed ? ' · ' + esc(T('common.sealedShort')) : ''}</span>
        </a></li>`).join('');

      // 하위 목차 — 현재 읽는 부분 표시
      const nav = $('[data-subnav]', this.el);
      const btns = $$('button', nav);
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => entries.forEach(en => {
          if (!en.isIntersecting) return;
          btns.forEach(b => b.classList.toggle('is-on', b.dataset.scroll === en.target.id));
        }), { rootMargin: '-35% 0px -60% 0px' });
        btns.forEach(b => { const s = document.getElementById(b.dataset.scroll); if (s) io.observe(s); });
      }
    },
    bg: () => BG_MAIN
  };

  /* ── II. 대륙 지도 ── */
  const MapPage = {
    init() {
      const frame = $('#mapFrame');
      frame.insertAdjacentHTML('beforeend', REGIONS.filter(r => r.pin).map(r => {
        const F = FACTIONS[r.f];
        return `<button class="pin${r.pinLeft ? ' pin--left' : ''}" type="button" data-pin="${r.id}" style="--x:${r.pin[0]}%;--y:${r.pin[1]}%;--c:${F.color}" aria-label="${esc(r.name)}">
          <span class="pin__dot"></span><span class="pin__label"><b>${esc(FACTIONS[r.f].short)}</b><small>${esc(r.dir)}</small></span></button>`;
      }).join(''));
      frame.addEventListener('click', e => {
        const p = e.target.closest('[data-pin]');
        if (!p) return;
        this.select(p.dataset.pin);
        history.replaceState(null, '', '#/map/' + p.dataset.pin);
        if (innerWidth <= 1040) $('#mapCard').scrollIntoView({ behavior: smooth(), block: 'nearest' });
      });
    },
    enter(arg) { this.select(regionById.has(arg) && arg !== 'abyss' ? arg : (this.cur || 'asrahel')); },
    select(id) {
      if (id === this.cur) return;
      this.cur = id;
      const r = regionById.get(id), F = FACTIONS[r.f];
      $$('[data-pin]').forEach(p => p.classList.toggle('is-active', p.dataset.pin === id));
      const card = $('#mapCard');
      const cast = CHARACTERS.filter(c => c.f === r.f);
      card.style.setProperty('--fc', F.color);
      card.innerHTML = `
        <div class="mc__art"><img src="${regionSrc(r)}" alt="${esc(T('map.regionAlt', { name: r.name }))}" decoding="async"></div>
        <div class="mc__body">
          <p class="mc__dir">${esc(r.dir)}</p>
          <h3>${esc(r.name)}</h3>
          <p class="mc__en">${esc(r.en)}</p>
          <p>${esc(r.lead)}</p>
          <div class="avatars">${cast.map(avatarBtn).join('')}</div>
          <a class="btn btn--ghost btn--sm" href="#/regions/${r.id}">${esc(T('map.open'))}${icon('i-arrow')}</a>
        </div>`;
      if (!reduce()) { card.classList.remove('is-swap'); void card.offsetWidth; card.classList.add('is-swap'); }
    },
    bg: () => BG_MAP
  };

  /* ── III. 지역 ── */
  const Regions = {
    init() {
      $('#regionTabs').innerHTML = REGIONS.map(r => {
        const F = r.f ? FACTIONS[r.f] : null;
        return `<a class="rtab${r.abyss ? ' rtab--abyss' : ''}" role="tab" href="#/regions/${r.id}" data-rtab="${r.id}" aria-selected="false" style="${F ? `--c:${F.color}` : ''}">
          ${icon(F ? F.emblem : 'em-seal')}<span>${esc(r.abyss ? r.name : F.short)}</span></a>`;
      }).join('');
    },
    enter(arg) {
      const id = regionById.has(arg) ? arg : (this.cur || 'asrahel');
      const changed = id !== this.cur;
      this.cur = id;
      const r = regionById.get(id);
      $$('[data-rtab]').forEach(t => {
        const on = t.dataset.rtab === id;
        t.setAttribute('aria-selected', String(on));
        if (on) t.parentElement.scrollTo({ left: t.offsetLeft - 20, behavior: smooth() });
      });
      Backdrop.set(regionSrc(r));
      document.title = siteTitle(r.name);
      if (!changed && this.rendered) return;
      this.rendered = true;
      this.render(r);
    },
    render(r) {
      const view = $('#regionView');
      const i = REGIONS.indexOf(r);
      const prev = REGIONS[(i - 1 + REGIONS.length) % REGIONS.length];
      const next = REGIONS[(i + 1) % REGIONS.length];
      const stepper = `<nav class="stepper" aria-label="${esc(T('regions.stepAria'))}">
        <a class="is-prev" href="#/regions/${prev.id}">${icon('i-arrow')}<span>${esc(T('regions.prev'))} · <b>${esc(prev.name)}</b></span></a>
        <a class="is-next" href="#/regions/${next.id}"><span>${esc(T('regions.next'))} · <b>${esc(next.name)}</b></span>${icon('i-arrow')}</a>
      </nav>`;
      view.className = 'rview' + (r.abyss ? ' rview--abyss' : '');

      if (r.abyss) {
        view.style.removeProperty('--fc');
        view.innerHTML = `
          <div class="rv-hero">
            <img src="${regionSrc(r)}" alt="${esc(T('regions.abyssAlt'))}" decoding="async">
            <span class="rv-ghost" aria-hidden="true">${r.hanja}</span>
            <span class="rv-hero__cap">${esc(r.cap)}</span>
            <div class="rv-hero__title">${icon('em-seal')}<div>
              <p class="rv-hero__dir">${esc(r.dir)}</p>
              <h2>${esc(r.name)}<span>${r.hanja}</span></h2>
              <p class="rv-hero__en">${esc(r.en)}</p>
            </div></div>
          </div>
          <div>
            <svg class="chain" viewBox="0 0 1200 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs><pattern id="chainLinks" width="46" height="30" patternUnits="userSpaceOnUse">
                <rect x="3" y="6" width="30" height="18" rx="9" class="lk"/><rect x="29" y="12.5" width="20" height="5" rx="2.5" class="lk-side"/>
              </pattern></defs>
              <rect x="0" y="0" width="574" height="30" fill="url(#chainLinks)"/>
              <rect x="626" y="0" width="574" height="30" fill="url(#chainLinks)"/>
              <g class="brk"><path d="M578 15 q10 -9 18 -2 l-4 5 l6 1"/><path d="M622 15 q-10 9 -18 2 l4 -5 l-6 -1"/><circle cx="600" cy="15" r="3"/></g>
            </svg>
            <div class="rv-body">
              <div class="rv-text">
                <p class="rv-lead">${esc(r.lead)}</p>
                <p>${esc(r.desc)}</p>
                <p>${esc(r.desc2)}</p>
                <dl class="facts">${r.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
              </div>
              <div class="rv-side">
                <div class="meter"><div class="meter__head"><span>${esc(T('regions.meter'))}</span><b>${esc(T('regions.meterV'))}</b></div><div class="meter__bar" aria-hidden="true"><i></i></div></div>
                <ol class="omens">${r.omens.map(([k, v], n) => `<li${n === r.omens.length - 1 ? ' class="is-last"' : ''}><small>${esc(k)}</small><p>${esc(v)}</p></li>`).join('')}</ol>
              </div>
            </div>
          </div>
          <section class="rv-cast" aria-label="${esc(T('regions.sealCast'))}">
            <div class="rv-cast__head"><h3>${esc(T('regions.sealCast'))}</h3><a class="link-arrow link-arrow--crimson" href="#/relations">${esc(T('regions.toGraph'))}${icon('i-arrow')}</a></div>
            <div class="people">${SEAL_BOUND.map(([id, label]) => byId.get(id) ? personBtn(byId.get(id), label) : '').join('')}</div>
            ${stepper}
          </section>`;
      } else {
        const F = FACTIONS[r.f];
        const cast = CHARACTERS.filter(c => c.f === r.f);
        const guests = (r.guests || []).map(id => byId.get(id)).filter(Boolean);
        view.style.setProperty('--fc', F.color);
        view.innerHTML = `
          <div class="rv-hero">
            <img src="${regionSrc(r)}" alt="${esc(T('map.regionAlt', { name: r.name }))}" decoding="async">
            <span class="rv-hero__cap">${esc(r.cap)}</span>
            <div class="rv-hero__title">${icon(F.emblem)}<div>
              <p class="rv-hero__dir">${esc(r.dir)}</p>
              <h2>${esc(r.name)}</h2>
              <p class="rv-hero__en">${esc(r.en)}</p>
            </div></div>
          </div>
          <div class="rv-body">
            <div class="rv-text">
              <p class="rv-lead">${esc(r.lead)}</p>
              <p>${esc(r.desc)}</p>
            </div>
            <div class="rv-side">
              <dl class="facts">${r.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
              ${r.rumor ? `<aside class="rumor"><b>${esc(T('regions.rumor'))}</b>${fmt(r.rumor)}</aside>` : ''}
            </div>
          </div>
          <section class="rv-cast" aria-label="${esc(T('regions.castAria', { name: F.name }))}">
            <div class="rv-cast__head"><h3>${esc(T('regions.castH', { n: cast.length }))}</h3><a class="link-arrow" href="#/characters/${r.f}">${esc(T('regions.toCards'))}${icon('i-arrow')}</a></div>
            <div class="people">${cast.map(c => personBtn(c, c.pos)).join('')}${guests.map(c => personBtn(c, T('regions.guest', { rank: c.rank, title: c.title }))).join('')}</div>
            ${stepper}
          </section>`;
      }
      if (!reduce()) { view.classList.remove('is-swap'); void view.offsetWidth; view.classList.add('is-swap'); }
    },
    bg() { return regionSrc(regionById.get(this.cur || 'asrahel')); }
  };

  /* ── IV. 무력 체계 ── */
  const Power = {
    HOLD: {
      flash: { 3: ['liese'], 4: ['sylvia'] },
      flow: { 2: ['otto'], 5: ['brunnhilde'] },
      chaos: { 4: ['cassius'] }
    },
    MEMBERS: {
      flash: ['sylvia', 'gareth', 'liese'],
      flow: ['brunnhilde', 'vivian', 'otto'],
      chaos: ['cassius', 'rosamund']
    },
    init() {
      $('#ladder').insertAdjacentHTML('afterend', '<p class="style-who" id="styleWho"></p>');
      $('#styles').addEventListener('click', e => { const b = e.target.closest('[data-style]'); if (b) this.setStyle(b.dataset.style); });
      this.setStyle('flash');
      const MAGES = ['violetta', 'adelheid', 'frieda', 'sera', 'reiner', 'nina'];
      $('#mages').innerHTML = MAGES.map(id => `<li>${personBtn(byId.get(id), T('mage.' + id))}</li>`).join('');
    },
    enter(arg) {
      const tab = ['sword', 'magic', 'guild'].includes(arg) ? arg : (this.tab || 'sword');
      this.tab = tab;
      $$('[data-power-tab]').forEach(t => t.setAttribute('aria-selected', String(t.dataset.powerTab === tab)));
      $$('[data-power]').forEach(p => { p.hidden = p.dataset.power !== tab; });
    },
    setStyle(style) {
      $$('#styles [data-style]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.style === style)));
      $('#ladderBadge').textContent = T('style.' + style);
      $$('#ladder .rung__title[data-lv]').forEach(el => {
        el.textContent = T(`sw.${style}.${el.dataset.lv}`);
        el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap');
      });
      $$('#ladder .rung__who').forEach(el => {
        const lv = +el.dataset.lv;
        const ids = this.HOLD[style][lv] || [];
        el.innerHTML = ids.map(id => `<button class="who" type="button" data-open="${id}">${esc(byId.get(id).name)}</button>`).join('') ||
          (lv === 7 ? `<span class="rung__note">${esc(T('power.apex'))}</span>` : '');
      });
      $('#styleWho').innerHTML = `<span>${esc(T('power.styleWho', { style: T('style.' + style) }))}</span>` +
        this.MEMBERS[style].map(id => `<button class="who" type="button" data-open="${id}">${esc(byId.get(id).name)}<small>${esc(T('pm.' + id))}</small></button>`).join('');
    },
    bg: () => encodeURI('images/지역/그랑바젤.jpg')
  };

  /* ── V. 인물 ── */
  const Roster = {
    init() {
      this.tabs = $('#rosterTabs');
      this.box = $('#roster');
      this.search = $('#rosterSearch');
      this.tabs.innerHTML = ORDER.map(f => {
        const F = FACTIONS[f];
        const n = CHARACTERS.filter(c => c.f === f).length;
        return `<a class="ftab" role="tab" href="#/characters/${f}" data-ftab="${f}" aria-selected="false" tabindex="-1" style="--tc:${F.color}">${icon(F.emblem)}<span>${esc(F.short)}</span><span class="n">${n}</span></a>`;
      }).join('');
      this.tabs.addEventListener('keydown', e => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault();
        const i = ORDER.indexOf(this.f);
        const n = e.key === 'Home' ? 0 : e.key === 'End' ? ORDER.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + ORDER.length) % ORDER.length;
        location.hash = '#/characters/' + ORDER[n];
        later(() => $(`[data-ftab="${ORDER[n]}"]`).focus(), 0);
      });
      let tmr = 0;
      this.search.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(() => this.render(), 120); });
      bindTilt(this.box);
    },
    enter(arg) {
      const f = ORDER.includes(arg) ? arg : (this.f || 'asrahel');
      const changed = f !== this.f;
      this.f = f;
      $$('[data-ftab]', this.tabs).forEach(t => {
        const on = t.dataset.ftab === f;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on) this.tabs.scrollTo({ left: t.offsetLeft - 16, behavior: smooth() });
      });
      Backdrop.set(this.bg());
      if (changed && this.search.value) this.search.value = '';
      if (changed || !this.rendered) { this.rendered = true; this.render(); }
    },
    card(c) {
      const F = FACTIONS[c.f];
      const pos = c.rank ? T('card.rankPos', { rank: c.rank, title: c.title, pos: c.pos }) : c.pos;
      const quote = c.quote ? `“${esc(c.quote)}”` : esc(T('card.silent'));
      return `<button class="card tilt${c.sealed ? ' is-sealed' : ''}" type="button" data-open="${c.id}" style="--fc:${F.color}" aria-label="${esc(T('card.aria', { name: c.name, pos }))}">
        <span class="card__frame">
          <img class="card__img" src="${imgSrc(c)}" alt="" loading="lazy" decoding="async">
          <span class="card__shade"></span><span class="card__glare"></span>
          <span class="card__chips">${c.chips.map(x => `<span>${esc(x)}</span>`).join('')}</span>
          ${c.logo ? `<span class="card__rank"><img src="${logoSrc(c)}" alt="" loading="lazy"></span>` : c.hook ? `<span class="card__hook" title="${esc(T('card.hook'))}">✦</span>` : ''}
          <span class="card__text">
            <span class="card__pos">${esc(pos)}</span>
            <span class="card__name">${esc(c.name)}</span>
            <span class="card__en">${esc(c.en)}</span>
            <span class="card__quote">${quote}</span>
          </span>
        </span>
      </button>`;
    },
    list(f) {
      const l = CHARACTERS.filter(c => c.f === f);
      return f === 'eight' ? l.sort((a, b) => a.rank - b.rank) : l;
    },
    match(c, q) {
      const hay = [c.name, c.ko, c.en, c.pos, FACTIONS[c.f].name, c.title || '', ...c.chips, ...c.traits.map(plain), ...c.info.map(x => x[1]), c.looks].join(' ').toLowerCase();
      return q.split(/\s+/).every(tok => hay.includes(tok));
    },
    render() {
      const raw = this.search.value.trim();
      let html = '';
      if (raw) {
        const q = raw.toLowerCase();
        const res = CHARACTERS.filter(c => this.match(c, q));
        html = res.length
          ? `<p class="roster__count">${T('roster.found', { q: esc(raw), n: res.length })}</p><div class="cards">${res.map(c => this.card(c)).join('')}</div>`
          : `<p class="roster__empty">${T('roster.none', { q: esc(raw) })}</p>`;
      } else {
        const f = this.f, F = FACTIONS[f], list = this.list(f);
        const r = regionOf(f);
        const i = ORDER.indexOf(f);
        const prev = ORDER[(i - 1 + ORDER.length) % ORDER.length], next = ORDER[(i + 1) % ORDER.length];
        const art = r ? regionSrc(r) : f === 'eight' ? BG_ABYSS : BG_MAIN;
        html = `
          <header class="plate" style="--fc:${F.color}">
            <span class="plate__art" style="background-image:url('${art}')"></span>
            ${icon(F.emblem, 'plate__em')}
            <div>
              <p class="plate__en">${esc(F.en)}</p>
              <h2 class="plate__name">${esc(F.name)}</h2>
              <p class="plate__blurb">${esc(F.blurb)}</p>
            </div>
            <div class="plate__side">
              <p class="plate__count">${T('roster.count', { n: list.length })}</p>
              ${r ? `<a class="link-arrow" href="#/regions/${r.id}">${esc(T('roster.toRegion'))}${icon('i-arrow')}</a>` : f === 'eight' ? `<a class="link-arrow" href="#/eight">${esc(T('roster.toRing'))}${icon('i-arrow')}</a>` : ''}
            </div>
          </header>
          <div class="cards">${list.map(c => this.card(c)).join('')}</div>
          <nav class="stepper" aria-label="${esc(T('roster.stepAria'))}">
            <a class="is-prev" href="#/characters/${prev}">${icon('i-arrow')}<span>${esc(T('common.prev'))} · <b>${esc(FACTIONS[prev].short)}</b></span></a>
            <a class="is-next" href="#/characters/${next}"><span>${esc(T('common.next'))} · <b>${esc(FACTIONS[next].short)}</b></span>${icon('i-arrow')}</a>
          </nav>`;
      }
      this.box.innerHTML = html;
      if (!reduce()) { this.box.classList.remove('is-swap'); void this.box.offsetWidth; this.box.classList.add('is-swap'); }
    },
    bg() {
      const r = regionOf(this.f || 'asrahel');
      return r ? regionSrc(r) : this.f === 'eight' ? BG_ABYSS : BG_MAIN;
    }
  };

  /* ── VI. 관계도 ── */
  const Graph = {
    init() {
      this.svg = $('#graph');
      this.wrap = $('.graph');
      this.info = $('#graphInfo');
      this.pinned = null;
      this.egoId = 'seal';
      this.build();
      Secrets.sub(() => { if (this.svg) { this.pinned = null; this.build(); } });
      // 인물 중심 관계도 (휴대폰)
      const ego = $('#ego');
      const goEgo = (t, fromList) => {
        this.renderEgo(t);
        if (fromList) ego.scrollIntoView({ behavior: smooth(), block: 'start' });
      };
      ego.addEventListener('click', e => {
        const t = e.target.closest('[data-ego]');
        if (t) { goEgo(t.dataset.ego, !!t.closest('#egoInfo')); return; }
        if (e.target.closest('[data-ego-center]')) {
          if (this.egoId === 'seal') location.hash = '#/regions/abyss'; else Dossier.open(this.egoId);
        }
      });
      ego.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const t = e.target.closest('g[data-ego], g[data-ego-center]');
        if (!t) return;
        e.preventDefault();
        t.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      const nodeOf = e => e.target.closest && e.target.closest('[data-node]');
      const edgeOf = e => e.target.closest && e.target.closest('[data-edge]');
      this.svg.addEventListener('pointerover', e => {
        if (this.pinned) return;
        const n = nodeOf(e), ed = edgeOf(e);
        if (n) this.focusNode(n.dataset.node); else if (ed) this.focusEdge(+ed.dataset.edge);
      });
      this.svg.addEventListener('pointerleave', () => { if (!this.pinned) this.clear(); });
      this.svg.addEventListener('click', e => {
        const n = nodeOf(e), ed = edgeOf(e);
        if (n) {
          const key = 'n:' + n.dataset.node;
          if (this.pinned === key && n.dataset.node !== 'seal') { Dossier.open(n.dataset.node); return; }
          this.pinned = key; this.focusNode(n.dataset.node);
        } else if (ed) {
          this.pinned = 'e:' + ed.dataset.edge; this.focusEdge(+ed.dataset.edge);
        } else { this.pinned = null; this.clear(); }
      });
      this.svg.addEventListener('keydown', e => {
        const n = nodeOf(e);
        if (!n || (e.key !== 'Enter' && e.key !== ' ')) return;
        e.preventDefault();
        this.pinned = 'n:' + n.dataset.node; this.focusNode(n.dataset.node);
      });
      this.svg.addEventListener('focusin', e => { const n = nodeOf(e); if (n && !this.pinned) this.focusNode(n.dataset.node); });
    },
    visible() { return RELATIONS.map((r, i) => ({ a: r[0], b: r[1], label: r[2], desc: r[3], secret: !!r[4], i })).filter(r => !r.secret || Secrets.on); },
    build() {
      const edges = this.visible();
      this.edges = edges;
      const ids = new Set();
      edges.forEach(e => { if (e.a !== 'seal') ids.add(e.a); if (e.b !== 'seal') ids.add(e.b); });
      const nodes = CHARACTERS.filter(c => ids.has(c.id)).sort((x, y) => ORDER.indexOf(x.f) - ORDER.indexOf(y.f));
      const R = 330, NR = 35, CR = NR - 2, SR = 50;
      const pos = { seal: [0, 0] }, ang = {};
      nodes.forEach((c, i) => {
        const a = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
        ang[c.id] = a;
        pos[c.id] = [Math.cos(a) * R, Math.sin(a) * R];
      });
      // 이름표는 원 바깥쪽으로 — 이웃 인물과 겹치지 않게
      const label = id => {
        const a = ang[id], cx = Math.cos(a), cy = Math.sin(a);
        const anchor = cx > 0.35 ? 'start' : cx < -0.35 ? 'end' : 'middle';
        const d = anchor === 'middle' ? 54 : 46;
        return `x="${(cx * d).toFixed(1)}" y="${(cy * d + 6).toFixed(1)}" text-anchor="${anchor}"`;
      };
      this.pos = pos;
      const path = e => {
        const [x1, y1] = pos[e.a], [x2, y2] = pos[e.b];
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const k = e.a === 'seal' || e.b === 'seal' ? 1 : 0.32;
        return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(mx * k).toFixed(1)} ${(my * k).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      };
      const edgeColor = e => {
        if (e.secret) return '';
        if (e.a === 'seal' || e.b === 'seal') return '';
        const fa = byId.get(e.a).f, fb = byId.get(e.b).f;
        return fa === fb ? `style="--ec:${FACTIONS[fa].color}"` : '';
      };
      const edgesSVG = edges.map((e, n) => {
        const cls = 'gedge' + (e.secret ? ' is-secret' : '') + (e.a === 'seal' || e.b === 'seal' ? ' is-seal' : '');
        return `<g data-edge="${n}"><path class="gedge-hit" d="${path(e)}"/><path class="${cls}" d="${path(e)}" ${edgeColor(e)}/></g>`;
      }).join('');
      const nodesSVG = nodes.map(c => {
        const [x, y] = pos[c.id];
        return `<g class="gnode" data-node="${c.id}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" tabindex="0" role="button" aria-label="${esc(c.name)}" style="--nc:${FACTIONS[c.f].color}">
          <circle class="bd" r="${NR}"/>
          <image href="${imgSrc(c)}" x="${-CR}" y="${(-CR * 0.76).toFixed(1)}" width="${CR * 2}" height="${(CR * 2 * 1216 / 832).toFixed(1)}" clip-path="url(#gclip)" preserveAspectRatio="xMidYMin slice"/>
          <text ${label(c.id)}>${esc(shortName(c))}</text>
        </g>`;
      }).join('');
      this.svg.innerHTML = `
        <defs><clipPath id="gclip"><circle r="${CR}"/></clipPath></defs>
        <circle class="gring" r="${R}"/>
        <circle class="gring" r="${R * 0.52}"/>
        ${edgesSVG}
        <g class="gnode gnode--seal" data-node="seal" tabindex="0" role="button" aria-label="${esc(T('rel.sealAria'))}">
          <circle class="halo" r="${Math.round(SR * 1.24)}"/>
          <circle class="bd" r="${SR}"/>
          <svg class="seal-glyph" x="${-SR * 0.6}" y="${-SR * 0.6}" width="${SR * 1.2}" height="${SR * 1.2}" viewBox="0 0 48 48"><use href="#em-seal"/></svg>
          <text y="${SR + 26}">${esc(T('common.abyss'))}</text>
        </g>
        ${nodesSVG}`;
      this.legend(nodes);
      this.threads();
      this.clear();
      this.buildEgo(nodes);
    },

    /* ── 인물 중심 관계도 (휴대폰) ── */
    buildEgo(nodes) {
      this.egoIds = ['seal', ...nodes.map(c => c.id)];
      $('#egoPicker').innerHTML = this.egoIds.map(id => {
        if (id === 'seal') return `<button class="ego__pick" type="button" role="option" data-ego="seal" aria-selected="false" style="--pc:var(--crimson)"><span class="av av--seal">${icon('em-seal')}</span><span>${esc(T('rel.seal'))}</span></button>`;
        const c = byId.get(id);
        return `<button class="ego__pick" type="button" role="option" data-ego="${id}" aria-selected="false" style="--pc:${FACTIONS[c.f].color}"><span class="av"><img src="${imgSrc(c)}" alt="" loading="lazy"></span><span>${esc(shortName(c))}</span></button>`;
      }).join('');
      if (!this.egoIds.includes(this.egoId)) this.egoId = 'seal';
      this.renderEgo(this.egoId);
    },
    renderEgo(id) {
      this.egoId = id;
      const colorOf = oid => (oid === 'seal' ? 'var(--crimson)' : FACTIONS[byId.get(oid).f].color);
      const labelTxt = s => (Secrets.on ? String(s).replace(/\{\{|\}\}/g, '') : plain(s));
      const pic = (oid, r, clip) => (oid === 'seal'
        ? `<svg class="seal-glyph" x="${(-r * 0.62).toFixed(1)}" y="${(-r * 0.62).toFixed(1)}" width="${(r * 1.24).toFixed(1)}" height="${(r * 1.24).toFixed(1)}" viewBox="0 0 48 48"><use href="#em-seal"/></svg>`
        : `<image href="${imgSrc(byId.get(oid))}" x="${-(r - 2)}" y="${(-(r - 2) * 0.76).toFixed(1)}" width="${(r - 2) * 2}" height="${((r - 2) * 2 * 1216 / 832).toFixed(1)}" clip-path="url(#${clip})" preserveAspectRatio="xMidYMin slice"/>`);

      const mine = this.edges.filter(e => e.a === id || e.b === id);
      const n = mine.length, R = 88, NR = 30, CR = 44;
      const pts = mine.map((e, i) => {
        const oid = e.a === id ? e.b : e.a;
        // 1~2명이면 좌우로(균형), 3명 이상이면 12시부터 둥글게
        const start = n === 1 ? 0 : n === 2 ? Math.PI : -Math.PI / 2;
        const a = start + (i / Math.max(n, 1)) * Math.PI * 2;
        return { e, oid, a, x: Math.cos(a) * R, y: Math.sin(a) * R };
      });
      // 이름표는 원 바깥쪽으로 뻗게 — 이웃 인물과 겹치지 않도록
      const labelAt = a => {
        const c = Math.cos(a), s = Math.sin(a), d = NR + 9;
        const dx = (c * d).toFixed(1), dy = s * d;
        if (c > 0.3 || c < -0.3) {
          const anchor = c > 0 ? 'start' : 'end';
          return { anchor, dx, ny: (dy - 2).toFixed(1), ly: (dy + 14).toFixed(1) };
        }
        return s < 0
          ? { anchor: 'middle', dx, ny: (dy - 3).toFixed(1), ly: (dy - 20).toFixed(1) }
          : { anchor: 'middle', dx, ny: (dy + 13).toFixed(1), ly: (dy + 29).toFixed(1) };
      };

      const lines = pts.map((p, i) =>
        `<line class="eline${p.e.secret ? ' is-secret' : ''}${p.oid === 'seal' || id === 'seal' ? ' is-seal' : ''}" x1="0" y1="0" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" pathLength="1" style="--k:${i}"/>`).join('');
      const nodes = pts.map((p, i) => {
        const name = p.oid === 'seal' ? T('rel.seal') : shortName(byId.get(p.oid));
        const L = labelAt(p.a);
        return `<g class="enode" data-ego="${p.oid}" tabindex="0" role="button" aria-label="${esc(this.nameOf(p.oid))} — ${esc(labelTxt(p.e.label))}" style="--x:${p.x.toFixed(1)};--y:${p.y.toFixed(1)};--k:${i};--nc:${colorOf(p.oid)}">
          <circle class="bd" r="${NR}"/>${pic(p.oid, NR, 'eclipN')}
          <text class="n" x="${L.dx}" y="${L.ny}" text-anchor="${L.anchor}">${esc(name)}</text>
          <text class="l" x="${L.dx}" y="${L.ly}" text-anchor="${L.anchor}">${esc(labelTxt(p.e.label))}</text>
        </g>`;
      }).join('');
      $('#egoSvg').innerHTML = `
        <defs><clipPath id="eclipN"><circle r="${NR - 2}"/></clipPath><clipPath id="eclipC"><circle r="${CR - 2}"/></clipPath></defs>
        <circle class="gring" r="${R}"/>
        ${lines}
        <g class="ecenter${id === 'seal' ? ' ecenter--seal' : ''}" data-ego-center tabindex="0" role="button" aria-label="${esc(this.nameOf(id))} — ${esc(T(id === 'seal' ? 'rel.openSeal' : 'rel.openRecord'))}" style="--nc:${colorOf(id)}">
          <circle class="halo" r="${CR + 10}"/><circle class="bd" r="${CR}"/>${pic(id, CR, 'eclipC')}
        </g>
        ${nodes}
        ${n ? '' : `<text class="ego__empty" y="80">${esc(T('rel.none'))}</text>`}`;

      // 인물 줄 — 선택 표시 + 가운데로
      const picker = $('#egoPicker');
      $$('[data-ego]', picker).forEach(b => {
        const on = b.dataset.ego === id;
        b.setAttribute('aria-selected', String(on));
        if (on) picker.scrollTo({ left: b.offsetLeft - picker.clientWidth / 2 + b.clientWidth / 2, behavior: smooth() });
      });

      // 아래 설명 카드
      const head = id === 'seal'
        ? `<div class="gi__who"><span class="gi__seal">${icon('em-seal')}</span><div><b>${esc(T('common.abyss'))}</b><small>${esc(T('rel.sealDesc'))}</small></div></div>
           <a class="btn btn--ghost btn--sm" href="#/regions/abyss">${esc(T('rel.sealRecord'))}${icon('i-arrow')}</a>`
        : `<div class="gi__who" style="--nc:${colorOf(id)}"><img src="${imgSrc(byId.get(id))}" alt=""><div><b>${esc(byId.get(id).name)}</b><small>${esc(affOf(byId.get(id)))}</small></div></div>
           <button class="btn btn--gold btn--sm" type="button" data-open="${id}">${esc(T('rel.record'))}${icon('i-arrow')}</button>`;
      const info = $('#egoInfo');
      info.innerHTML = `<div class="ego__head">${head}</div>
        <ul class="ego__rels">${pts.map(p => `<li><button class="ego-rel" type="button" data-ego="${p.oid}" style="--pc:${colorOf(p.oid)}">
          ${p.oid === 'seal' ? `<span class="seal-dot">${icon('em-seal')}</span>` : `<img src="${imgSrc(byId.get(p.oid))}" alt="" loading="lazy">`}
          <span class="ego-rel__t"><b>${esc(this.nameOf(p.oid))}<em>${fmt(p.e.label)}</em></b><small>${fmt(p.e.desc)}</small></span>${icon('i-chev', 'rel__go')}
        </button></li>`).join('')}</ul>`;
      if (!reduce()) { info.classList.remove('is-swap'); void info.offsetWidth; info.classList.add('is-swap'); }
    },
    legend(nodes) {
      const fs = [...new Set(nodes.map(c => c.f))];
      $('#graphLegend').innerHTML = fs.map(f => `<span><i style="--lc:${FACTIONS[f].color}"></i>${esc(FACTIONS[f].short)}</span>`).join('') +
        `<span><i style="--lc:var(--crimson)"></i>${esc(T('rel.legendSeal'))}</span>` +
        (Secrets.on ? `<span><i class="ln"></i>${esc(T('rel.legendSecret'))}</span>` : '');
    },
    nameOf(id) { return id === 'seal' ? T('common.abyss') : byId.get(id).name; },
    relLine(e, from) {
      const other = e.a === from ? e.b : e.a;
      return `<li><em>${fmt(e.label)}</em><b>${esc(this.nameOf(other))}</b><br>${fmt(e.desc)}</li>`;
    },
    highlight(nodeIds, edgeIdx) {
      this.wrap.classList.add('is-focus');
      $$('[data-node]', this.svg).forEach(n => n.classList.toggle('is-hl', nodeIds.has(n.dataset.node)));
      $$('[data-edge]', this.svg).forEach(g => $('.gedge', g).classList.toggle('is-hl', edgeIdx.has(+g.dataset.edge)));
    },
    swapInfo(html) {
      this.info.innerHTML = html;
      if (!reduce()) { this.info.classList.remove('is-swap'); void this.info.offsetWidth; this.info.classList.add('is-swap'); }
    },
    focusNode(id) {
      if (this.focused === 'n:' + id) return;
      this.focused = 'n:' + id;
      const nodeIds = new Set([id]), edgeIdx = new Set();
      const mine = this.edges.filter((e, n) => {
        if (e.a !== id && e.b !== id) return false;
        edgeIdx.add(n); nodeIds.add(e.a); nodeIds.add(e.b); return true;
      });
      this.highlight(nodeIds, edgeIdx);
      if (id === 'seal') {
        this.swapInfo(`
          <div class="gi__who"><span class="gi__seal">${icon('em-seal')}</span><div><b>${esc(T('common.abyss'))}</b><small>${esc(T('rel.sealDesc'))}</small></div></div>
          <ul class="gi__list">${mine.map(e => this.relLine(e, 'seal')).join('')}</ul>
          <a class="btn btn--ghost btn--sm gi__open" href="#/regions/abyss">${esc(T('rel.sealRecordOpen'))}${icon('i-arrow')}</a>`);
        return;
      }
      const c = byId.get(id);
      this.swapInfo(`
        <div class="gi__who" style="--nc:${FACTIONS[c.f].color}"><img src="${imgSrc(c)}" alt=""><div><b>${esc(c.name)}</b><small>${esc(affOf(c))}</small></div></div>
        <ul class="gi__list">${mine.map(e => this.relLine(e, id)).join('')}</ul>
        <button class="btn btn--gold btn--sm gi__open" type="button" data-open="${c.id}">${esc(T('common.openRecord'))}${icon('i-arrow')}</button>`);
    },
    focusEdge(n) {
      if (this.focused === 'e:' + n) return;
      this.focused = 'e:' + n;
      const e = this.edges[n];
      this.highlight(new Set([e.a, e.b]), new Set([n]));
      this.swapInfo(`
        <div class="thread__pair gi__pair">${this.who(e.a)}${this.who(e.b)}</div>
        <p class="gi__hint"><b>${esc(this.nameOf(e.a))} ↔ ${esc(this.nameOf(e.b))}</b></p>
        <ul class="gi__list"><li><em>${fmt(e.label)}</em><br>${fmt(e.desc)}</li></ul>`);
    },
    who(id) {
      if (id === 'seal') return `<button type="button" class="seal-dot" data-go-abyss aria-label="${esc(T('common.abyss'))}">${icon('em-seal')}</button>`;
      const c = byId.get(id);
      return `<button type="button" data-open="${id}" style="--pc:${FACTIONS[c.f].color}" aria-label="${esc(c.name)}"><img src="${imgSrc(c)}" alt="" loading="lazy"></button>`;
    },
    clear() {
      this.focused = null;
      this.wrap.classList.remove('is-focus');
      $$('.is-hl', this.svg).forEach(n => n.classList.remove('is-hl'));
      this.swapInfo(`<p class="gi__hint">${T('rel.hint')}</p>`);
    },
    threads() {
      $('#threads').innerHTML = this.edges.map(e => {
        return `<li class="thread${e.secret ? ' is-secret' : ''}">
          <div class="thread__pair">${this.who(e.a)}${this.who(e.b)}</div>
          <div><p class="thread__head">${esc(this.nameOf(e.a))} ↔ ${esc(this.nameOf(e.b))}<em>${fmt(e.label)}</em></p><p>${fmt(e.desc)}</p></div>
        </li>`;
      }).join('');
    },
    bg: () => BG_ABYSS
  };

  /* ── VII. 팔대열강 ── */
  const Eight = {
    init() {
      this.ring = $('#ring'); this.orbit = $('#ringOrbit'); this.core = $('#ringCore'); this.info = $('#sigilInfo');
      this.idx = -1; this.turn = 0;
      this.orbit.insertAdjacentHTML('beforeend', EIGHT.map((c, i) => `
        <button class="sigil${c.sealed ? ' sigil--sealed' : ''}" type="button" data-sigil="${i}" style="--i:${i}" aria-pressed="false" tabindex="-1" aria-label="${esc(T('eight.sigilAria', { rank: c.rank, title: c.title, name: c.name }))}">
          <span class="sigil__disc"><img src="${logoSrc(c)}" alt="" decoding="async"></span>
          <span class="sigil__label"><b>${ROMAN[c.rank]}</b>${esc(c.title)}</span>
        </button>`).join(''));
      this.btns = $$('.sigil', this.orbit);
      $('#eightStrip').innerHTML = EIGHT.map((c, i) => `
        <li><button class="es" type="button" data-sigil-pick="${i}" aria-current="false" aria-label="${esc(T('eight.stripItem', { rank: c.rank, title: c.title, name: c.name }))}">
          <img src="${imgSrc(c)}" alt="" loading="lazy" decoding="async"><span><i>${ROMAN[c.rank]}</i><b>${esc(c.title)}</b></span>
        </button></li>`).join('');

      this.orbit.addEventListener('click', e => {
        const b = e.target.closest('[data-sigil]');
        if (!b) return;
        const i = +b.dataset.sigil;
        if (i === this.idx) Dossier.open(EIGHT[i].id); else this.pick(i);
      });
      $('#eightStrip').addEventListener('click', e => { const b = e.target.closest('[data-sigil-pick]'); if (b) this.pick(+b.dataset.sigilPick); });
      this.core.addEventListener('click', () => Dossier.open(EIGHT[this.idx].id));
      this.ring.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); this.pick(this.idx + 1, true); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); this.pick(this.idx - 1, true); }
      });
      this.info.addEventListener('click', e => { const s = e.target.closest('[data-sigil-step]'); if (s) this.pick(this.idx + Number(s.dataset.sigilStep)); });
    },
    enter(arg) {
      const n = parseInt(arg, 10);
      this.select(n >= 1 && n <= 8 ? n - 1 : Math.max(0, this.idx));
    },
    pick(i, focus) {
      this.select(i, focus);
      history.replaceState(null, '', '#/eight/' + EIGHT[this.idx].rank);
    },
    select(i, focus) {
      i = (i + EIGHT.length) % EIGHT.length;
      if (i === this.idx) return;
      const c = EIGHT[i];
      const step = 360 / EIGHT.length;
      const delta = ((-i * step - this.turn) % 360 + 540) % 360 - 180;
      this.turn += delta;
      this.orbit.style.setProperty('--turn', this.turn + 'deg');
      this.idx = i;
      this.btns.forEach((b, k) => { b.setAttribute('aria-pressed', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
      $$('[data-sigil-pick]').forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
      if (focus) this.btns[i].focus({ preventScroll: true });

      const art = new Image();
      art.alt = ''; art.src = imgSrc(c);
      this.core.appendChild(art);
      const olds = $$('img', this.core).slice(0, -1);
      later(() => olds.forEach(o => o.remove()), 900);
      this.core.setAttribute('aria-label', T('spot.openAria', { name: c.name }));

      const tags = c.tag.split(' · ').map(t => `<li>${esc(t)}</li>`).join('') + (c.sealed ? `<li class="is-sealed">${esc(T('eight.sealed'))}</li>` : '');
      this.info.innerHTML = `
        <img class="si__ghost" src="${logoSrc(c)}" alt="">
        <p class="si__rank" style="--k:0"><b>${ROMAN[c.rank]}</b><span>${c.hanja}</span><small>${esc(T('eight.rankLine', { rank: c.rank, title: c.title }))}</small></p>
        <h2 class="si__name" style="--k:1">${esc(c.name)}</h2>
        <p class="si__en" style="--k:1">${esc(c.en)}</p>
        <p class="si__pos" style="--k:2">${esc(c.pos)}</p>
        ${c.quote ? `<blockquote class="si__quote" style="--k:3">${esc(c.quote)}</blockquote>` : `<blockquote class="si__quote is-silent" style="--k:3">${esc(silentLine())}</blockquote>`}
        <ul class="tags si__tags" style="--k:4">${tags}</ul>
        <div class="si__actions" style="--k:5">
          <button class="btn btn--gold" type="button" data-open="${c.id}">${esc(T('common.openRecord'))}${icon('i-arrow')}</button>
          <button class="si__step" type="button" data-sigil-step="-1" aria-label="${esc(T('eight.prev'))}">${icon('i-arrow')}</button>
          <button class="si__step" type="button" data-sigil-step="1" aria-label="${esc(T('eight.next'))}">${icon('i-arrow')}</button>
        </div>`;
      if (!reduce()) { this.info.classList.remove('is-swap'); void this.info.offsetWidth; this.info.classList.add('is-swap'); }
    },
    bg: () => BG_ABYSS
  };

  /* ═════════════════════════════════════════════
     인물 상세 (dialog)
     ═════════════════════════════════════════════ */
  const Dossier = (() => {
    const dlg = $('#dossier'), art = $('#dosArt'), scroll = $('#dosScroll'), foot = $('#dosFoot');
    let cur = null, tab = 'profile';

    const listFor = c => Roster.list(c.f);

    const relsOf = c => (c.rel || []).filter(([, l]) => Secrets.on || !isAllSecret(l));

    function head(c) {
      const F = FACTIONS[c.f];
      const rels = relsOf(c);
      return `
        <div class="dos__intro">
          <p class="dos__aff">${icon(F.emblem)}${esc(affOf(c))}</p>
          <h2 class="dos__name" id="dosName">${esc(c.name)}</h2>
          <p class="dos__en">${esc(c.en)}</p>
          <p class="dos__pos">${esc(c.pos)}${c.hook ? `<span class="dos__hook">${esc(T('dos.hook'))}</span>` : ''}${c.sealed ? `<span class="secret-tag">${esc(T('eight.sealed'))}</span>` : ''}</p>
          <figure class="dos__quote${c.quote ? '' : ' is-silent'}">
            <blockquote>${c.quote ? esc(c.quote) : esc(silentLine())}</blockquote>
            <figcaption>${esc(T('dos.speech', { s: c.speech }))}</figcaption>
          </figure>
          <button class="dos__cue" type="button" data-cue>${esc(T('dos.cue'))}${icon('i-chev')}</button>
        </div>
        <div class="dos__tabs" role="tablist" aria-label="${esc(T('dos.tabsAria'))}">
          <button type="button" role="tab" data-dtab="profile" aria-selected="${tab === 'profile'}">${esc(T('dos.tProfile'))}</button>
          <button type="button" role="tab" data-dtab="story" aria-selected="${tab === 'story'}">${esc(T('dos.tStory'))}</button>
          <button type="button" role="tab" data-dtab="rel" aria-selected="${tab === 'rel'}">${esc(T('dos.tRel'))}<span class="n">${rels.length}</span></button>
        </div>
        <div class="dos__panel" role="tabpanel">${panel(c, rels)}</div>`;
    }

    function panel(c, rels) {
      const F = FACTIONS[c.f];
      if (tab === 'story') {
        const r = regionOf(c.f);
        const hasSecret = /\{\{/.test(c.story);
        return `
          <section class="dos__sec"><h4>Story<span>${esc(T('dos.story'))}</span></h4><p class="dos__story">${fmt(c.story)}</p></section>
          ${hasSecret && !Secrets.on ? `<p class="dos__empty">${T('dos.secretNote')}</p>` : ''}
          ${r ? `<a class="link-arrow" href="#/regions/${r.id}" data-close-go>${esc(T('dos.regionLink', { name: r.name }))}${icon('i-arrow')}</a>` : ''}`;
      }
      if (tab === 'rel') {
        if (!rels.length) return `<p class="dos__empty">${esc(T('dos.noRel'))}</p>`;
        return `<ul class="rels">${rels.map(([id, label]) => {
          const r = byId.get(id);
          if (!r) return '';
          return `<li><button class="rel" type="button" data-open="${r.id}" style="--rc:${FACTIONS[r.f].color}">
            <img src="${imgSrc(r)}" alt="" loading="lazy"><span><b>${esc(r.name)}</b><small>${fmt(label)}</small></span>${icon('i-chev', 'rel__go')}</button></li>`;
        }).join('')}</ul>`;
      }
      const affKey = T('dos.aff');
      const info = (c.info.some(([k]) => k === affKey) ? [] : [[affKey, F.name]]).concat(c.info);
      const traits = c.traits.filter(t => Secrets.on || !isAllSecret(t));
      return `
        <dl class="dos__info">${info.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <section class="dos__sec"><h4>Appearance<span>${esc(T('dos.looks'))}</span></h4><p>${esc(c.looks)}</p></section>
        <section class="dos__sec"><h4>Personality<span>${esc(T('dos.traits'))}</span></h4><ul class="traits">${traits.map(t => `<li>${fmt(t)}</li>`).join('')}</ul></section>
        <section class="dos__sec"><h4>Belongings<span>${esc(T('dos.items'))}</span></h4><ul class="items">${c.items.map(t => `<li>${icon('i-item')}<span>${fmt(t)}</span></li>`).join('')}</ul></section>`;
    }

    function footer(c) {
      const list = listFor(c);
      const i = list.indexOf(c);
      const prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
      return `
        <button class="dos__step dos__step--prev" type="button" data-step="-1" aria-label="${esc(T('dos.prevAria', { name: prev.name }))}">${icon('i-arrow')}<img src="${imgSrc(prev)}" alt=""><span>${esc(prev.name)}</span></button>
        <div class="dos__mid"><span>${i + 1} / ${list.length}</span><button class="dos__link" type="button" data-copy-link>${icon('i-link')}${esc(T('dos.link'))}</button></div>
        <button class="dos__step dos__step--next" type="button" data-step="1" aria-label="${esc(T('dos.nextAria', { name: next.name }))}">${icon('i-arrow')}<img src="${imgSrc(next)}" alt=""><span>${esc(next.name)}</span></button>`;
    }

    function fill(c) {
      cur = c;
      const F = FACTIONS[c.f];
      dlg.style.setProperty('--fc', F.color);
      art.innerHTML = `<img src="${imgSrc(c)}" alt="${esc(T('dos.artAlt', { name: c.name }))}">` +
        (c.rank ? `<span class="dos__badge">${c.logo ? `<img src="${logoSrc(c)}" alt="">` : ''}<b>${ROMAN[c.rank]}</b><i>${c.hanja}</i></span>` : '') +
        (c.sealed ? '<span class="dos__sealed">封印</span>' : '') +
        `<button class="dos__zoom" type="button" data-zoom>${icon('i-expand')}${esc(T('dos.zoom'))}</button>`;
      scroll.innerHTML = head(c);
      foot.innerHTML = footer(c);
      scroll.scrollTop = 0;
      if (dlg.firstElementChild) dlg.firstElementChild.scrollTop = 0;
      // 다음 · 이전 원화 미리 불러오기
      const list = listFor(c), i = list.indexOf(c);
      [list[(i + 1) % list.length], list[(i - 1 + list.length) % list.length]].forEach(x => { const im = new Image(); im.src = imgSrc(x); });
    }

    function swap(c) {
      fill(c);
      if (reduce()) return;
      dlg.classList.remove('is-swap'); void dlg.offsetWidth; dlg.classList.add('is-swap');
    }

    function open(id) {
      const c = byId.get(id);
      if (!c) return;
      if (Palette.isOpen()) Palette.close();
      if (dlg.open) { if (c !== cur) swap(c); return; }
      tab = 'profile';
      fill(c);
      root.classList.add('has-modal');
      dlg.showModal();
      $('.dossier__close', dlg).focus({ preventScroll: true });
    }

    function close() {
      if (!dlg.open || dlg.classList.contains('is-closing')) return;
      const done = () => { dlg.classList.remove('is-closing', 'is-swap'); dlg.close(); root.classList.remove('has-modal'); };
      // 공유 링크(#/c/…)로 열렸다면 닫을 때 주소를 소속 페이지로 되돌림
      if (/^#\/c\//.test(location.hash)) history.replaceState(null, '', cur.f === 'eight' ? '#/eight/' + cur.rank : '#/characters/' + cur.f);
      if (reduce()) return done();
      dlg.classList.add('is-closing');
      later(done, 280);
    }

    function step(d) {
      if (!cur) return;
      const list = listFor(cur);
      swap(list[(list.indexOf(cur) + d + list.length) % list.length]);
    }

    function copyLink() {
      const u = new URL(location.href);
      u.hash = '#/c/' + cur.id;
      if (LANG !== 'ko') u.searchParams.set('lang', LANG); // 링크를 받은 사람도 같은 언어로
      const url = u.href;
      const ok = () => toast(T('dos.copied', { name: cur.name }));
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(ok, () => fallback(url));
      else fallback(url);
      function fallback(link) {
        const ta = document.createElement('textarea');
        ta.value = link; ta.style.position = 'fixed'; ta.style.opacity = '0';
        dlg.appendChild(ta); ta.select();
        try { document.execCommand('copy'); ok(); } catch (e) { toast(T('dos.copyFail', { url: link })); }
        ta.remove();
      }
    }

    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dlg.addEventListener('close', () => root.classList.remove('has-modal'));
    dlg.addEventListener('click', e => {
      if (e.target === dlg || e.target.closest('[data-close]')) { close(); return; }
      if (e.target.closest('[data-close-go]')) { close(); return; }
      const s = e.target.closest('[data-step]');
      if (s) { step(+s.dataset.step); return; }
      const t = e.target.closest('[data-dtab]');
      if (t) {
        if (t.dataset.dtab === tab) return;
        tab = t.dataset.dtab;
        $$('[data-dtab]', scroll).forEach(b => b.setAttribute('aria-selected', String(b.dataset.dtab === tab)));
        $('.dos__panel', scroll).outerHTML = `<div class="dos__panel" role="tabpanel">${panel(cur, relsOf(cur))}</div>`;
        return;
      }
      if (e.target.closest('[data-copy-link]')) { copyLink(); return; }
      if (e.target.closest('[data-cue]')) {
        const shell = dlg.firstElementChild, tabs = $('.dos__tabs', scroll);
        shell.scrollTo({ top: tabs.offsetTop - 4, behavior: smooth() });
        return;
      }
      if (e.target.closest('[data-zoom]')) Viewer.open(imgSrc(cur), `${cur.name} · ${cur.en}`);
    });
    dlg.addEventListener('keydown', e => {
      if (e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
    // 손가락으로 좌우 넘기기
    let sx = 0, sy = 0;
    dlg.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    dlg.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 70 && Math.abs(dy) < 45) step(dx < 0 ? 1 : -1);
    }, { passive: true });
    Secrets.sub(() => { if (dlg.open && cur) scroll.innerHTML = head(cur); });

    return { open, close, get isOpen() { return dlg.open; } };
  })();

  /* 원화 크게 보기 */
  const Viewer = (() => {
    const dlg = $('#viewer'), img = $('#viewerImg'), cap = $('#viewerCap');
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-close]') || e.target === img) dlg.close(); });
    return {
      open(src, text) { img.src = src; img.alt = text; cap.textContent = text; dlg.showModal(); }
    };
  })();

  /* ═════════════════════════════════════════════
     빠른 검색 (Ctrl+K · /)
     ═════════════════════════════════════════════ */
  const Palette = (() => {
    const dlg = $('#palette'), input = $('#paletteInput'), list = $('#paletteList');
    const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
    const chosung = s => Array.from(s).map(ch => {
      const code = ch.charCodeAt(0) - 0xac00;
      return code >= 0 && code <= 11171 ? CHO[Math.floor(code / 588)] : ch;
    }).join('');
    const isCho = q => /^[ㄱ-ㅎ\s]+$/.test(q);

    const items = [
      { kind: 'ch', label: T('pal.prologue'), sub: T('pal.prologueS'), href: '#/', ic: 'em-seal' },
      { kind: 'ch', label: T('nav.world'), sub: T('pal.sWorld'), href: '#/world', ic: 'i-book' },
      { kind: 'ch', label: T('nav.map'), sub: T('pal.sMap'), href: '#/map', ic: 'i-book' },
      { kind: 'ch', label: T('nav.regions'), sub: T('pal.sRegions'), href: '#/regions', ic: 'i-book' },
      { kind: 'ch', label: T('nav.power'), sub: T('pal.sPower'), href: '#/power', ic: 'i-book', kw: '검술 유파 일섬류 유전류 난전류 마법 위계 등급 투기 길드' },
      { kind: 'ch', label: T('nav.characters'), sub: T('pal.sChars'), href: '#/characters', ic: 'i-person' },
      { kind: 'ch', label: T('nav.relations'), sub: T('pal.sRel'), href: '#/relations', ic: 'i-link' },
      { kind: 'ch', label: T('nav.eight'), sub: T('pal.sEight'), href: '#/eight', ic: 'em-eight', kw: '8강 최강 무황 마왕 용제 명왕 검신 마도왕 수왕 암왕' }
    ].concat(REGIONS.map(r => ({
      kind: 'rg', label: r.name, sub: r.dir, href: '#/regions/' + r.id,
      ic: r.f ? FACTIONS[r.f].emblem : 'em-seal', color: r.f ? FACTIONS[r.f].color : 'var(--crimson)', kw: r.en + ' ' + (r.abyss ? '나락 봉인 타르타로스 봉인지 tartarus abyss' : '')
    }))).concat(CHARACTERS.map(c => ({
      kind: 'pp', label: c.name, sub: `${affOf(c)} · ${c.pos}`, open: c.id, img: imgSrc(c), color: FACTIONS[c.f].color,
      kw: [c.ko, c.en, ...c.chips, c.title || '', ...c.info.map(x => x[1]), ...c.traits.map(plain), c.looks].join(' ')
    })));
    items.forEach(it => { it.hay = `${it.label} ${it.sub} ${it.kw || ''}`.toLowerCase(); it.cho = chosung(it.label + ' ' + (it.kw || '').split(' ')[0]); });
    const GROUP = { ch: 'pal.gChapters', rg: 'pal.gRegions', pp: 'pal.gPeople' };

    let shown = [], active = 0;

    function search(q) {
      q = q.trim().toLowerCase();
      if (!q) return items.filter(it => it.kind !== 'pp').concat(items.filter(it => it.kind === 'pp').slice(0, 5));
      const cho = isCho(q) ? q.replace(/\s+/g, '') : null;
      return items.map(it => {
        let s = 0;
        if (cho) { if (it.cho.replace(/\s+/g, '').includes(cho)) s = it.cho.startsWith(cho) ? 3 : 2; }
        else {
          const toks = q.split(/\s+/);
          if (toks.every(t => it.hay.includes(t))) s = it.label.toLowerCase().startsWith(q) ? 4 : it.label.toLowerCase().includes(q) ? 3 : 1;
        }
        return [s, it];
      }).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).map(([, it]) => it).slice(0, 30);
    }

    const hl = (text, q) => {
      q = q.trim();
      if (!q || isCho(q)) return esc(text);
      const i = text.toLowerCase().indexOf(q.toLowerCase());
      return i < 0 ? esc(text) : esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
    };

    function render() {
      const q = input.value;
      shown = search(q);
      active = 0;
      if (!shown.length) { list.innerHTML = `<li class="pal-empty">${T('pal.none', { q: esc(q) })}</li>`; return; }
      let html = '', last = '';
      shown.forEach((it, i) => {
        if (it.kind !== last) { html += `<li class="pal-group" role="presentation">${esc(T(GROUP[it.kind]))}</li>`; last = it.kind; }
        const pic = it.img ? `<img src="${it.img}" alt="" loading="lazy">` : `<span class="pal-ic">${icon(it.ic)}</span>`;
        html += `<li class="pal-item" role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === 0}" style="${it.color ? `--pc:${it.color}` : ''}">${pic}<span><b>${hl(it.label, q)}</b><small>${esc(it.sub)}</small></span>${icon('i-arrow', 'pal-go')}</li>`;
      });
      list.innerHTML = html;
      input.setAttribute('aria-activedescendant', 'pal-0');
    }

    function move(d) {
      if (!shown.length) return;
      active = (active + d + shown.length) % shown.length;
      $$('.pal-item', list).forEach(el => el.setAttribute('aria-selected', String(+el.dataset.i === active)));
      const el = $(`#pal-${active}`, list);
      input.setAttribute('aria-activedescendant', 'pal-' + active);
      el && el.scrollIntoView({ block: 'nearest' });
    }

    function choose(i) {
      const it = shown[i];
      if (!it) return;
      close();
      if (it.open) Dossier.open(it.open);
      else location.hash = it.href;
    }

    function open() {
      if (dlg.open || body.classList.contains('is-locked')) return;
      if (Dossier.isOpen) Dossier.close();
      input.value = '';
      render();
      dlg.showModal();
      input.focus();
    }
    function close() { if (dlg.open) dlg.close(); }

    input.addEventListener('input', render);
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    });
    list.addEventListener('click', e => { const li = e.target.closest('[data-i]'); if (li) choose(+li.dataset.i); });
    list.addEventListener('pointermove', e => {
      const li = e.target.closest('[data-i]');
      if (li && +li.dataset.i !== active) move(+li.dataset.i - active);
    });
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
    $('#searchBtn').addEventListener('click', open);

    return { open, close, isOpen: () => dlg.open };
  })();

  /* ═════════════════════════════════════════════
     라우터 — 챕터 페이지 전환
     ═════════════════════════════════════════════ */
  const CHAPTERS = [
    { id: 'home', n: '', key: 'pal.prologue', h: Home },
    { id: 'world', n: 'I', key: 'nav.world', h: World },
    { id: 'map', n: 'II', key: 'nav.map', h: MapPage },
    { id: 'regions', n: 'III', key: 'nav.regions', h: Regions },
    { id: 'power', n: 'IV', key: 'nav.power', h: Power },
    { id: 'characters', n: 'V', key: 'nav.characters', h: Roster },
    { id: 'relations', n: 'VI', key: 'nav.relations', h: Graph },
    { id: 'eight', n: 'VII', key: 'nav.eight', h: Eight }
  ];
  const chapterById = new Map(CHAPTERS.map(c => [c.id, c]));
  const pageEls = new Map($$('.page').map(el => [el.dataset.page, el]));

  const Router = {
    page: null,
    parse() {
      const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(s => { try { return decodeURIComponent(s); } catch (e) { return s; } });
      if (parts[0] === 'c' && byId.has(parts[1])) {
        const c = byId.get(parts[1]);
        return c.f === 'eight' ? { page: 'eight', arg: String(c.rank), open: c.id } : { page: 'characters', arg: c.f, open: c.id };
      }
      const page = chapterById.has(parts[0]) ? parts[0] : 'home';
      return { page, arg: parts[1] };
    },
    go() {
      const { page, arg, open } = this.parse();
      const ch = chapterById.get(page);
      const el = pageEls.get(page);
      const changed = page !== this.page;
      Nav.close();
      if (changed) {
        pageEls.forEach((p, id) => { if (id !== page) { p.hidden = true; p.classList.remove('is-active'); } });
        el.hidden = false;
        if (!ch.h.ready) { ch.h.el = el; ch.h.init && ch.h.init(); ch.h.ready = true; }
        this.page = page;
        this.replay();
        window.scrollTo(0, 0);
        document.title = page === 'home' ? siteTitle() : siteTitle(T(ch.key));
        Nav.mark(page);
        Pager.render(page);
        observeReveals(el);
      }
      ch.h.enter && ch.h.enter(arg, changed);
      if (page !== 'regions') Backdrop.set(ch.h.bg ? ch.h.bg() : BG_MAIN);
      observeReveals(el);
      if (open) {
        if (body.classList.contains('is-locked')) this.pending = open; // 봉인이 풀린 뒤에 연다
        else later(() => Dossier.open(open), changed ? 250 : 0);
      } else if (Dossier.isOpen && changed) Dossier.close();
    },
    replay() {
      const el = pageEls.get(this.page);
      if (!el || reduce()) { el && el.classList.add('is-active'); return; }
      el.classList.remove('is-active'); void el.offsetWidth; el.classList.add('is-active');
    }
  };

  /* 이전 · 다음 챕터 */
  const Pager = {
    render(page) {
      const i = CHAPTERS.findIndex(c => c.id === page);
      const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1];
      const lab = c => (c.n ? `Chapter ${c.n}` : 'Prologue');
      $('#pager').innerHTML =
        (prev ? `<a class="is-prev" href="#/${prev.id === 'home' ? '' : prev.id}"><small>${esc(T('common.prev'))} · ${lab(prev)}</small><b>${icon('i-arrow')}${esc(T(prev.key))}</b></a>` : '') +
        (next ? `<a class="is-next" href="#/${next.id}"><small>${esc(T('common.next'))} · ${lab(next)}</small><b>${esc(T(next.key))}${icon('i-arrow')}</b></a>` : '');
    }
  };

  /* ─────────────────────────────────────────────
     내비게이션
     ───────────────────────────────────────────── */
  const Nav = (() => {
    const nav = $('#nav'), toggle = $('#navToggle'), links = $('#navLinks'), progress = $('#progress');
    const setOpen = open => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', T(open ? 'nav.menuClose' : 'nav.menuOpen'));
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = Math.max(1, root.scrollHeight - innerHeight);
      progress.style.transform = `scaleX(${(scrollY / max).toFixed(4)})`;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    setOpen(false);
    return {
      close: () => setOpen(false),
      mark(page) {
        $$('a[data-nav]', links).forEach(a => {
          const on = a.dataset.nav === page;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
        update();
      }
    };
  })();

  /* ═════════════════════════════════════════════
     인트로 — 봉인의 문 (길게 눌러 해제)
     ═════════════════════════════════════════════ */
  const Gate = (() => {
    const g = $('#gate'), key = $('#gateKey'), hint = $('#gateHint'), skip = $('#gateSkip');
    const HOLD = 1150;
    let state = 'closed', p = 0, holding = false, raf = 0, last = 0, downAt = 0;
    const timers = [];

    function unlock() {
      body.classList.remove('is-locked');
      Router.replay();
      if (Router.pending) { const id = Router.pending; Router.pending = null; later(() => Dossier.open(id), 1100); }
    }
    function remember() { try { sessionStorage.setItem('aeth-unsealed', '1'); } catch (e) { /* 무시 */ } }

    if (root.classList.contains('skip-gate')) { g.hidden = true; body.classList.remove('is-locked'); }
    $('.gate__half--r .gate__art', g).innerHTML = $('.gate__half--l .gate__art', g).innerHTML;

    const setP = v => { p = Math.max(0, Math.min(1, v)); g.style.setProperty('--p', p.toFixed(3)); };
    function tick(now) {
      const dt = Math.min(50, now - last); last = now;
      setP(holding ? p + dt / HOLD : p - dt / (HOLD * 0.45));
      if (p >= 1) { raf = 0; unseal(); return; }
      raf = holding || p > 0 ? requestAnimationFrame(tick) : 0;
    }
    function start() {
      if (state !== 'closed') return;
      if (reduce()) { unseal(); return; }
      holding = true; downAt = performance.now();
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    }
    function end() {
      if (!holding) return;
      holding = false;
      if (performance.now() - downAt < 300 && state === 'closed') {
        hint.classList.remove('is-nudge'); void hint.offsetWidth; hint.classList.add('is-nudge');
      }
    }
    function unseal() {
      if (state !== 'closed') return;
      state = 'opening'; holding = false; setP(1); remember();
      const quick = reduce();
      g.classList.add('is-unsealing');
      timers.push(later(() => {
        g.classList.add('is-open');
        unlock();
        Aether.burst(innerWidth / 2, innerHeight / 2, 170);
      }, quick ? 30 : 750));
      timers.push(later(() => { g.hidden = true; state = 'open'; }, quick ? 300 : 2300));
    }
    function skipNow() {
      if (state !== 'closed') return;
      state = 'open'; remember(); g.hidden = true; unlock();
    }

    // 마우스 · 펜
    g.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch' || e.button !== 0 || e.target.closest('.gate__skip')) return;
      e.preventDefault();
      start();
    });
    addEventListener('pointerup', e => { if (e.pointerType !== 'touch') end(); });
    addEventListener('pointercancel', e => { if (e.pointerType !== 'touch') end(); });
    // 휴대폰 — 터치 이벤트로 직접 처리해야 '길게 누르기 메뉴 · 선택 표시'에 누르기가 끊기지 않는다
    g.addEventListener('touchstart', e => {
      if (e.target.closest('.gate__skip')) return;
      e.preventDefault();
      start();
    }, { passive: false });
    g.addEventListener('touchend', e => { if (!e.target.closest('.gate__skip')) e.preventDefault(); end(); }, { passive: false });
    g.addEventListener('touchcancel', end);
    g.addEventListener('contextmenu', e => e.preventDefault());
    g.addEventListener('selectstart', e => e.preventDefault());
    addEventListener('keydown', e => {
      if (state !== 'closed' || g.hidden) return;
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement !== skip) { e.preventDefault(); if (!e.repeat) start(); }
      if (e.key === 'Escape') skipNow();
    });
    addEventListener('keyup', e => { if (e.key === 'Enter' || e.key === ' ') end(); });
    skip.addEventListener('click', skipNow);
    if (!g.hidden) later(() => key.focus({ preventScroll: true }), 60);

    function reseal() {
      timers.splice(0).forEach(clearTimeout);
      if (Dossier.isOpen) Dossier.close();
      g.classList.remove('is-unsealing', 'is-open');
      setP(0);
      body.classList.add('is-locked');
      g.hidden = false; state = 'closed';
      root.classList.remove('skip-gate');
      try { sessionStorage.removeItem('aeth-unsealed'); } catch (e) { /* 무시 */ }
      window.scrollTo(0, 0);
      key.focus({ preventScroll: true });
    }
    return { reseal };
  })();

  /* ═════════════════════════════════════════════
     전역 클릭 · 키보드
     ═════════════════════════════════════════════ */
  function revealSecret(el) {
    if (Secrets.on || el.classList.contains('is-open')) return false;
    el.classList.add('is-open');
    el.removeAttribute('title');
    return true;
  }

  document.addEventListener('click', e => {
    const secret = e.target.closest('.secret');
    if (secret && revealSecret(secret)) { e.preventDefault(); e.stopPropagation(); return; }

    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); Dossier.open(opener.dataset.open); return; }

    if (e.target.closest('[data-go-abyss]')) { location.hash = '#/regions/abyss'; return; }

    const sc = e.target.closest('[data-scroll]');
    if (sc) {
      const id = sc.dataset.scroll;
      if (id === 'top') window.scrollTo({ top: 0, behavior: smooth() });
      else { const t = document.getElementById(id); t && t.scrollIntoView({ behavior: smooth(), block: 'start' }); }
      return;
    }

    if (e.target.closest('[data-shuffle]')) { Home.shuffle(); return; }

    const red = e.target.closest('[data-reveal]');
    if (red) red.classList.toggle('is-open');
  }, true);

  document.addEventListener('keydown', e => {
    const t = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && t.matches) {
      if (t.matches('.secret')) { e.preventDefault(); revealSecret(t); return; }
      if (t.matches('[data-reveal]')) { e.preventDefault(); t.classList.toggle('is-open'); return; }
    }
    const typing = t.matches && t.matches('input, textarea, [contenteditable]');
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); Palette.isOpen() ? Palette.close() : Palette.open(); }
    else if (e.key === '/' && !typing && !Dossier.isOpen) { e.preventDefault(); Palette.open(); }
  });

  $('#reseal').addEventListener('click', () => Gate.reseal());
  addEventListener('hashchange', () => Router.go());

  /* 시작 */
  Router.go();
  observeReveals(document);
})();
