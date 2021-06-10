let win = null;
function window_open(path) {
  const opts = { show: false };
  if (BrowserWindow.getFocusedWindow()) {
    current_win = BrowserWindow.getFocusedWindow();
    const pos = current_win.getPosition();
    Object.assign(opts, {
      x: pos[0] + 22,
      y: pos[1] + 22,
    });
  };
  win = new BrowserWindow(opts);
  win.loadURL(path);
  win.once('ready-to-show', () => { win.show() });
};

app.once('ready', event => {
  window_open(`file://${__dirname}/index.html`);
});