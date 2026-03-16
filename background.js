// Background service worker - updates badge based on bonus status

const PROMO_START = new Date('2026-03-13T00:00:00-08:00');
const PROMO_END = new Date('2026-03-27T23:59:59-07:00');
const PEAK_START_JST = 22;
const PEAK_END_JST = 4;

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

function updateBadge() {
  const now = new Date();
  const bonus = isBonusTime(now);
  const inPromo = isInPromo(now);

  if (!inPromo) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  if (bonus) {
    chrome.action.setBadgeText({ text: 'x2' });
    chrome.action.setBadgeBackgroundColor({ color: '#ff1744' });
  } else {
    chrome.action.setBadgeText({ text: 'x1' });
    chrome.action.setBadgeBackgroundColor({ color: '#333333' });
  }
}

// Update badge every minute via alarms
chrome.alarms.create('updateBadge', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateBadge') {
    updateBadge();
  }
});

// Initial update
updateBadge();
