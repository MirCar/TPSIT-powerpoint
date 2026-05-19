const ModeToggle = {
  mode: 'vulnerable',

  create(container) {
    container.innerHTML = `
      <div class="mode-toggle-container">
        <span class="mode-toggle-label vuln">VULNERABILE</span>
        <label class="mode-toggle">
          <input type="checkbox" id="modeSwitch">
          <span class="slider"></span>
        </label>
        <span class="mode-toggle-label prot">PROTETTO</span>
      </div>
    `;

    const input = container.querySelector('#modeSwitch');
    input.checked = this.mode === 'protected';
    input.addEventListener('change', () => {
      this.mode = input.checked ? 'protected' : 'vulnerable';
      document.dispatchEvent(new CustomEvent('mode-changed', { detail: { mode: this.mode } }));
    });
  },

  getMode() {
    return this.mode;
  },

  reset() {
    this.mode = 'vulnerable';
    const input = document.querySelector('#modeSwitch');
    if (input) input.checked = false;
  }
};

window.ModeToggle = ModeToggle;
