export const FONTS_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@400;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }
`

export const KEYFRAMES_STYLE = `
@keyframes spin-slow {
  to { transform: rotate(360deg); }
}
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.65; }
}
@keyframes skeleton {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
@keyframes slide-up {
  from { transform: translateY(8px);  opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`
