/**
 * No-flash theme bootstrap. Runs before paint so the correct reading mode
 * (Movement Black or Bone) is set with zero shift. Dark is the brand default;
 * an explicit user choice persisted in localStorage wins.
 */
export function ThemeScript() {
  const js = `(function(){try{var s=localStorage.getItem('esc-theme');var m=window.matchMedia('(prefers-color-scheme: light)').matches;var t=s||(m?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
