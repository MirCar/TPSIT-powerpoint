class CodeViewer {
  static render(container, config) {
    const { vulnerable, protected: safe, language = 'javascript' } = config;
    container.innerHTML = `
      <div class="code-comparison">
        <div class="code-panel vuln">
          <div class="code-panel-header">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Codice Vulnerabile
          </div>
          <pre><code>${CodeViewer.highlight(vulnerable, language)}</code></pre>
        </div>
        <div class="code-panel prot">
          <div class="code-panel-header">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Codice Protetto
          </div>
          <pre><code>${CodeViewer.highlight(safe, language)}</code></pre>
        </div>
      </div>
    `;
  }

  static highlight(code, language) {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    escaped = escaped.replace(/(\/\/.*)/g, '<span style="color:#6A9955">$1</span>');
    escaped = escaped.replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#CE9178">$1</span>');

    if (language === 'sql' || language === 'javascript') {
      const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES',
        'UPDATE', 'SET', 'DELETE', 'UNION', 'LIKE', 'CREATE', 'TABLE', 'DROP',
        'const', 'let', 'var', 'function', 'return', 'if', 'else', 'try', 'catch',
        'await', 'async', 'new', 'require', 'module', 'exports'];
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b(${kw})\\b`, 'g');
        escaped = escaped.replace(regex, '<span style="color:#569CD6">$1</span>');
      });
    }

    escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#B5CEA8">$1</span>');

    return escaped;
  }
}

window.CodeViewer = CodeViewer;
