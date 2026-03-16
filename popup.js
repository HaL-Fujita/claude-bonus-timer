// Promo period: March 13 - March 27, 2026 (PT 23:59)
// Peak (normal 1x): Weekdays 8:00-14:00 ET = 22:00-04:00 JST
// Bonus (2x): Everything else + weekends

const PROMO_START = new Date('2026-03-13T00:00:00-08:00');
const PROMO_END = new Date('2026-03-27T23:59:59-07:00');

const PEAK_START_JST = 22;
const PEAK_END_JST = 4;

let previousBonusState = null;

function getJSTDate(date) {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}

function isWeekend(jstDate) {
  const day = jstDate.getDay();
  return day === 0 || day === 6;
}

function isInPromo(now) {
  return now >= PROMO_START && now <= PROMO_END;
}

function isBonusTime(now) {
  if (!isInPromo(now)) return false;
  const jst = getJSTDate(now);
  if (isWeekend(jst)) return true;
  const hour = jst.getHours();
  const isPeak = hour >= PEAK_START_JST || hour < PEAK_END_JST;
  return !isPeak;
}

function getNextTransition(now) {
  const currentBonus = isBonusTime(now);
  for (let m = 1; m <= 7 * 24 * 60; m++) {
    const future = new Date(now.getTime() + m * 60000);
    if (isBonusTime(future) !== currentBonus) {
      return { time: future, toBonus: !currentBonus };
    }
  }
  return null;
}

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatPromoCountdown(ms) {
  if (ms <= 0) return '終了しました';
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${days}日 ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function buildTimeline(now) {
  const jst = getJSTDate(now);
  const isWE = isWeekend(jst);
  const bar = document.getElementById('timelineBar');
  const labels = document.getElementById('timeLabels');

  bar.innerHTML = '';
  labels.innerHTML = '';

  for (let h = 0; h <= 24; h += 3) {
    const label = document.createElement('span');
    label.textContent = `${h}`;
    labels.appendChild(label);
  }

  if (isWE) {
    const seg = document.createElement('div');
    seg.className = 'timeline-segment segment-weekend active';
    seg.style.width = '100%';
    seg.textContent = '終日ボーナス x2';
    bar.appendChild(seg);
  } else {
    const segments = [
      { start: 0, end: 4, type: 'normal', label: 'x1' },
      { start: 4, end: 22, type: 'bonus', label: 'x2 ボーナス' },
      { start: 22, end: 24, type: 'normal', label: 'x1' },
    ];
    const currentHour = jst.getHours() + jst.getMinutes() / 60;
    segments.forEach(seg => {
      const div = document.createElement('div');
      const width = ((seg.end - seg.start) / 24) * 100;
      div.className = `timeline-segment segment-${seg.type}`;
      div.style.width = `${width}%`;
      div.textContent = seg.label;
      if (currentHour >= seg.start && currentHour < seg.end) {
        div.classList.add('active');
      }
      bar.appendChild(div);
    });
  }

  const indicator = document.getElementById('timeIndicator');
  const currentHour = jst.getHours() + jst.getMinutes() / 60;
  indicator.style.left = `${(currentHour / 24) * 100}%`;
}

function buildWeekly(now) {
  const grid = document.getElementById('weeklyGrid');
  grid.innerHTML = '';

  const jst = getJSTDate(now);
  const today = new Date(jst.getFullYear(), jst.getMonth(), jst.getDate());
  const start = new Date(2026, 2, 13);
  const end = new Date(2026, 2, 27);
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'weekly-day';

    const dayNum = d.getDay();
    const isToday = d.getTime() === today.getTime();
    const isPast = d < today;
    const isWE = dayNum === 0 || dayNum === 6;

    if (isToday) dayDiv.classList.add('today');
    if (isPast) dayDiv.classList.add('past');

    const nameSpan = document.createElement('div');
    nameSpan.className = `day-name${isWE ? ' weekend' : ''}`;
    nameSpan.textContent = dayNames[dayNum];

    const dateSpan = document.createElement('div');
    dateSpan.className = 'day-date';
    dateSpan.textContent = d.getDate();

    const bonusSpan = document.createElement('div');
    bonusSpan.className = `day-bonus ${isWE ? 'full' : 'partial'}`;
    bonusSpan.textContent = isWE ? '終日x2' : '18hx2';

    dayDiv.appendChild(nameSpan);
    dayDiv.appendChild(dateSpan);
    dayDiv.appendChild(bonusSpan);
    grid.appendChild(dayDiv);
  }
}

function createParticles(isBonus) {
  const container = document.getElementById('particles');
  container.innerHTML = '';
  if (!isBonus) return;

  const colors = ['#ff1744', '#ffd700', '#ff6b00', '#ff00ff', '#00bfff'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = `${2 + Math.random() * 4}s`;
    p.style.animationDelay = `${Math.random() * 5}s`;
    p.style.width = p.style.height = `${2 + Math.random() * 3}px`;
    container.appendChild(p);
  }
}

function triggerFlash() {
  const overlay = document.getElementById('flashOverlay');
  overlay.classList.remove('active');
  void overlay.offsetWidth;
  overlay.classList.add('active');
}

function animateReels(isBonus) {
  const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3'),
  ];
  const symbols = isBonus ? ['7', '7', '7'] : ['-', '-', '-'];
  const cls = isBonus ? 'bonus' : 'off';

  reels.forEach((reel, i) => {
    reel.className = 'reel spinning';
    setTimeout(() => {
      reel.className = `reel ${cls}`;
      reel.querySelector('.reel-inner').textContent = symbols[i];
    }, 500 + i * 300);
  });
}

function update() {
  const now = new Date();
  const bonus = isBonusTime(now);
  const inPromo = isInPromo(now);

  if (previousBonusState !== null && previousBonusState !== bonus) {
    triggerFlash();
    animateReels(bonus);
  }
  previousBonusState = bonus;

  // GOGO Lamp
  const lamp = document.getElementById('gogoLamp');
  if (bonus) {
    const isRainbow = Math.random() < 0.1;
    lamp.className = `gogo-lamp bonus${isRainbow ? ' rainbow' : ''}`;
    document.getElementById('lampText').textContent = 'GOGO!';
    document.getElementById('lampSub').textContent = 'x2 BONUS';
  } else {
    lamp.className = 'gogo-lamp off';
    document.getElementById('lampText').textContent = 'GOGO!';
    document.getElementById('lampSub').textContent = 'WAIT...';
  }

  // Status
  const statusText = document.getElementById('statusText');
  const statusLabel = document.getElementById('statusLabel');
  if (!inPromo) {
    statusText.textContent = 'キャンペーン期間外';
    statusText.className = 'status-text off';
    statusLabel.textContent = 'ステータス';
  } else if (bonus) {
    statusText.textContent = '激アツ ボーナスタイム！';
    statusText.className = 'status-text bonus';
    statusLabel.textContent = '現在のステータス';
  } else {
    statusText.textContent = '通常モード';
    statusText.className = 'status-text off';
    statusLabel.textContent = '現在のステータス';
  }

  // Multiplier
  const badge = document.getElementById('multiplierBadge');
  if (bonus) {
    badge.textContent = 'x2';
    badge.className = 'multiplier-badge x2';
  } else {
    badge.textContent = 'x1';
    badge.className = 'multiplier-badge x1';
  }

  // Countdown
  const next = getNextTransition(now);
  const countdownLabel = document.getElementById('countdownLabel');
  const countdownTime = document.getElementById('countdownTime');
  if (next) {
    const ms = next.time.getTime() - now.getTime();
    if (bonus) {
      countdownLabel.textContent = 'ボーナス終了まで';
      countdownTime.textContent = formatCountdown(ms);
      countdownTime.className = 'countdown-time to-end';
    } else {
      countdownLabel.textContent = '次のボーナスまで';
      countdownTime.textContent = formatCountdown(ms);
      countdownTime.className = 'countdown-time to-bonus';
    }
  }

  // LED Border
  document.getElementById('ledBorder').className = bonus ? 'led-border' : 'led-border off';

  // Reels (static state)
  document.querySelectorAll('.reel').forEach(reel => {
    if (!reel.classList.contains('spinning')) {
      reel.className = `reel ${bonus ? 'bonus' : 'off'}`;
    }
  });

  // Timeline
  buildTimeline(now);

  // Promo end countdown
  const promoMs = PROMO_END.getTime() - now.getTime();
  document.getElementById('promoEndCountdown').textContent = formatPromoCountdown(promoMs);

  // Particles
  createParticles(bonus);
}

// Init
buildWeekly(new Date());
animateReels(isBonusTime(new Date()));
update();
setInterval(update, 1000);
