export function timeAgo(timestamp: number) {
  const now = Date.now();

  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);

  const minutes = Math.floor(seconds / 60);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "À l'instant";
  }

  if (minutes < 60) {
    return `Il y a ${minutes} min`;
  }

  if (hours < 24) {
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }

  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
}
