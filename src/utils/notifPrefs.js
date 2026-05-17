const KEY = "notif_prefs";

const DEFAULTS = { os: true, toast: true };

export function getNotifPrefs() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function setNotifPrefs(partial) {
  const next = { ...getNotifPrefs(), ...partial };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(
    new CustomEvent("notif-prefs:changed", { detail: next }),
  );
  return next;
}
