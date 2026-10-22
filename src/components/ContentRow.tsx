// ============================================================
// ContentRow.tsx — Single table row with all content types
// ============================================================
import { useState, type FC } from 'react';
import type { ContentRow as ContentRowType } from '../types';
import CodeBlock from './CodeBlock';

interface ContentRowProps {
  row: ContentRowType;
  compareMode?: boolean;
}

const BADGE_CLASS: Record<string, string> = {
  pos: 'badge-pos',
  neg: 'badge-neg',
  warn: 'badge-warn',
  neutral: 'badge-neutral',
};

const CAT_CLASS: Record<string, string> = {
  'AI Agent': 'cat-agent',
  'MCP': 'cat-mcp',
  'Context': 'cat-context',
  'Maps AI': 'cat-maps',
  'สำเร็จ': 'badge-pos',
  'แก้ไขแล้ว': 'badge-warn',
};

const ContentRowComponent: FC<ContentRowProps> = ({ row, compareMode = false }) => {
  const [expanded, setExpanded] = useState(false);

  const hasExtra = !!(row.code || (row.list && row.list.length > 0));

  return (
    <div className={`ct-row ${expanded ? 'ct-row-expanded' : ''}`}>
      <div className="ct-row-main" onClick={() => hasExtra && setExpanded(!expanded)}>
        {/* Tag */}
        <div className="ct-col-tag">
          <span className="ct-tag">{row.tag}</span>
        </div>

        {/* Title + subtitle */}
        <div className="ct-col-title">
          <span className="ct-title">{row.title}</span>
          {row.subtitle && <span className="ct-subtitle">{row.subtitle}</span>}
          {row.chips && (
            <div className="ct-chips">
              {row.chips.map((chip) => (
                <span key={chip} className="topic-chip">{chip}</span>
              ))}
            </div>
          )}
        </div>

        {/* Compare mode: Rule-Based | Agentic */}
        {compareMode ? (
          <>
            <div className="ct-col-half">
              <span className="score-neg-text">{row.colLeft}</span>
            </div>
            <div className="ct-col-half">
              <span className="score-pos-text">{row.colRight}</span>
            </div>
          </>
        ) : (
          <>
            {/* Body preview */}
            <div className="ct-col-body">
              {row.body && <p className="ct-body-text">{row.body}</p>}
              {/* Component grid for 2.1 */}
              {row.components && (
                <div className="component-grid">
                  {row.components.map((c) => (
                    <div key={c.name} className="component-item">
                      <span className="comp-icon">{c.icon}</span>
                      <strong className="comp-name">{c.name}</strong>
                      <span className="comp-desc">{c.desc}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* MCP flow */}
              {row.mcpFlow && (
                <div className="mcp-flow">
                  {row.mcpFlow.map((node, i) => (
                    <span key={node.label}>
                      <span className={`mcp-node ${node.highlight ? 'mcp-node-accent' : ''}`}>
                        {node.label}
                        <small>{node.sublabel}</small>
                      </span>
                      {i < row.mcpFlow!.length - 1 && (
                        <span className="mcp-arrow">→</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Badge */}
            <div className="ct-col-badge">
              {row.badge && (
                <span className={`cat-badge ${CAT_CLASS[row.badge] ?? (row.badgeVariant ? BADGE_CLASS[row.badgeVariant] : '')}`}>
                  {row.badge}
                </span>
              )}
              {hasExtra && (
                <button className="expand-btn" aria-label="expand">
                  {expanded ? '▲' : '▼'}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="ct-row-detail">
          {row.list && (
            <ul className="detail-list">
              {row.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {row.code && <CodeBlock code={row.code} />}
        </div>
      )}

      {/* If compareMode with list/code, show inline */}
      {compareMode && (row.list || row.code) && (
        <div className="ct-row-detail ct-compare-detail">
          {row.list && (
            <ul className="detail-list">
              {row.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {row.code && <CodeBlock code={row.code} />}
        </div>
      )}
    </div>
  );
};

export default ContentRowComponent;
