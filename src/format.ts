export function formatShortDate(ts: number): string {
  const date = new Date(ts);
  return new Intl.DateTimeFormat(navigator.language, { dateStyle: 'short' }).format(date);
}

export function formatLongDate(ts: number): string {
  const date = new Date(ts);
  return new Intl.DateTimeFormat(navigator.language, { dateStyle: 'full', timeStyle: 'medium' }).format(date);
}

export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) {
    return '0 Bytes';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i == 0) {
    return bytes + ' ' + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}
