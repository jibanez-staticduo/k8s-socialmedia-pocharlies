const shell = document.querySelector('.app-shell');

if (shell) {
  // iOS Safari can ignore viewport scale limits; keep the chat surface at app scale.
  for (const type of ['gesturestart', 'gesturechange']) {
    shell.addEventListener(type, event => event.preventDefault(), {passive: false});
  }
  shell.addEventListener('touchmove', event => {
    if (event.touches.length > 1) event.preventDefault();
  }, {passive: false});
}
