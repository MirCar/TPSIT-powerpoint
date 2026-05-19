class TerminalEngine {
  constructor(container) {
    this.container = container;
    this.paused = false;
    this._resumeResolve = null;
    this.aborted = false;
  }

  clear() {
    this.container.innerHTML = '';
  }

  async _waitIfPaused() {
    if (this.aborted) throw new Error('aborted');
    if (this.paused) {
      await new Promise(resolve => { this._resumeResolve = resolve; });
    }
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    if (this._resumeResolve) {
      this._resumeResolve();
      this._resumeResolve = null;
    }
  }

  abort() {
    this.aborted = true;
    this.resume();
  }

  reset() {
    this.aborted = false;
    this.paused = false;
    this._resumeResolve = null;
    this.clear();
  }

  _scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  async typeLine(text, className = 'command', speed = 30) {
    await this._waitIfPaused();
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    this.container.appendChild(line);

    for (let i = 0; i < text.length; i++) {
      if (this.aborted) throw new Error('aborted');
      line.textContent += text[i];
      this._scrollToBottom();
      await this._sleep(speed);
    }
    this._scrollToBottom();
  }

  printLine(text, className = 'output') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    this.container.appendChild(line);
    this._scrollToBottom();
  }

  printHtml(html, className = 'output') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = html;
    this.container.appendChild(line);
    this._scrollToBottom();
  }

  async printLines(lines, className = 'output', delay = 50) {
    for (const text of lines) {
      await this._waitIfPaused();
      if (this.aborted) throw new Error('aborted');
      this.printLine(text, className);
      await this._sleep(delay);
    }
  }

  printTable(headers, rows, highlightRow = -1) {
    const table = document.createElement('table');
    table.className = 'terminal-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    rows.forEach((row, i) => {
      const tr = document.createElement('tr');
      if (i === highlightRow) tr.className = 'highlight';
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    this.container.appendChild(table);
    this._scrollToBottom();
  }

  async showProgress(label, durationMs = 2000, steps = 20) {
    const line = document.createElement('div');
    line.className = 'terminal-line terminal-progress';
    this.container.appendChild(line);

    for (let i = 0; i <= steps; i++) {
      if (this.aborted) throw new Error('aborted');
      await this._waitIfPaused();
      const pct = Math.round((i / steps) * 100);
      const filled = Math.round((i / steps) * 30);
      const empty = 30 - filled;
      const bar = '█'.repeat(filled) + '░'.repeat(empty);
      line.textContent = `${label} [${bar}] ${pct}%`;
      this._scrollToBottom();
      await this._sleep(durationMs / steps);
    }
  }

  showCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    const line = document.createElement('div');
    line.className = 'terminal-line';
    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    line.appendChild(prompt);
    line.appendChild(cursor);
    this.container.appendChild(line);
    this._scrollToBottom();
    return cursor;
  }

  removeCursor() {
    const cursor = this.container.querySelector('.terminal-cursor');
    if (cursor) cursor.parentElement.remove();
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

window.TerminalEngine = TerminalEngine;
