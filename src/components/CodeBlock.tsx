// ============================================================
// CodeBlock.tsx — Syntax-highlighted code component
// ============================================================
import type { FC } from 'react';
import type { CodeExample } from '../types';

interface CodeBlockProps {
  code: CodeExample;
}

const KEYWORD_MAP: Record<string, string[]> = {
  typescript: [
    'interface','type','class','extends','implements','const','let','var',
    'function','async','await','return','new','import','from','export',
    'default','if','else','throw','try','catch','private','public',
    'readonly','string','number','boolean','void','unknown','Record',
    'Promise','Map','Array',
  ],
  json: [],
  bash: ['npm','npx','export','echo'],
};

function highlight(code: string, lang: string): string {
  if (lang === 'json') {
    return code
      .replace(/(".*?")\s*:/g, '<span class="c-key">$1</span>:')
      .replace(/:\s*(".*?")/g, ': <span class="c-str">$1</span>')
      .replace(/:\s*(\d+)/g, ': <span class="c-num">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="c-kw">$1</span>');
  }

  if (lang === 'bash') {
    return code
      .replace(/^(#.*)$/gm, '<span class="c-comment">$1</span>')
      .replace(/\b(npm|npx|export|echo)\b/g, '<span class="c-kw">$1</span>')
      .replace(/(["'`].*?["'`])/g, '<span class="c-str">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="c-num">$1</span>');
  }

  // TypeScript / JavaScript
  const keywords = KEYWORD_MAP['typescript'] ?? [];
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Comments
  result = result.replace(/(\/\/.*$)/gm, '<span class="c-comment">$1</span>');
  result = result.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="c-comment">$1</span>');
  // Template literals
  result = result.replace(/(`[^`]*`)/g, '<span class="c-tmpl">$1</span>');
  // Strings
  result = result.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="c-str">$1</span>');
  result = result.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="c-str">$1</span>');
  // Numbers
  result = result.replace(/\b(\d+(?:\.\d+)?(?:_\d+)*)\b/g, '<span class="c-num">$1</span>');
  // Keywords
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b(${kw})\\b`, 'g');
    result = result.replace(re, '<span class="c-kw">$1</span>');
  });
  // Function calls
  result = result.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="c-fn">$1</span>(');
  // Types (PascalCase)
  result = result.replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="c-type">$1</span>');

  return result;
}

const CodeBlock: FC<CodeBlockProps> = ({ code }) => {
  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        {code.label && <span className="code-label">{code.label}</span>}
        <span className="code-lang-badge">{code.lang}</span>
      </div>
      <pre
        className="code-body"
        dangerouslySetInnerHTML={{ __html: highlight(code.code, code.lang) }}
      />
    </div>
  );
};

export default CodeBlock;
