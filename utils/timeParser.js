function parseTime(timeString) {
  const timeUnits = {
    's': 1000,
    'm': 1000 * 60,
    'h': 1000 * 60 * 60,
    'd': 1000 * 60 * 60 * 24,
    'w': 1000 * 60 * 60 * 24 * 7
  };

  const regex = /(\d+)([smhdw])/g;
  let totalMs = 0;
  let match;

  while ((match = regex.exec(timeString)) !== null) {
    const amount = parseInt(match[1]);
    const unit = match[2];
    totalMs += amount * timeUnits[unit];
  }

  return totalMs;
}

function formatTime(ms) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  const parts = [];
  if (days > 0) parts.push(`${days}gün`);
  if (hours > 0) parts.push(`${hours}saat`);
  if (minutes > 0) parts.push(`${minutes}dakika`);
  if (seconds > 0) parts.push(`${seconds}saniye`);

  return parts.join(' ') || '0 saniye';
}

module.exports = { parseTime, formatTime };