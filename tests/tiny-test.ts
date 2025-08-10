// ultra minimal test harness to run in-browser
export const describe = (name: string, fn: () => void) => {
  console.group(`%c${name}`, 'color:#7c3aed;font-weight:bold');
  try { fn(); } finally { console.groupEnd(); }
};
export const it = (name: string, fn: () => void) => {
  try {
    fn();
    console.log('%c✔ ' + name, 'color:#16a34a');
  } catch (e) {
    console.error('%c✘ ' + name, 'color:#dc2626', e);
  }
};
export const expect = (value: any) => ({
  toBe: (other: any) => { if (value !== other) throw new Error(`Expected ${value} to be ${other}`); },
  toBeTruthy: () => { if (!value) throw new Error('Expected value to be truthy'); }
});

