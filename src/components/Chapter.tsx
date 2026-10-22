// ============================================================
// Chapter.tsx — Full chapter section with filter + table
// ============================================================
import { useState, type FC } from 'react';
import type { ChapterData, CategoryId } from '../types';
import FilterPills from './FilterPills';
import ContentRowComponent from './ContentRow';

interface ChapterProps {
  data: ChapterData;
}

const Chapter: FC<ChapterProps> = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState<CategoryId>('all');

  const visibleRows = data.rows.filter(
    (row) => activeFilter === 'all' || row.category === activeFilter,
  );

  return (
    <section className="chapter-section" id={data.id}>
      <div className="container">
        {/* Header */}
        <div className="chapter-eyebrow">{data.num}</div>
        <h2 className="chapter-title">{data.title}</h2>
        <p className="chapter-desc">{data.desc}</p>

        {/* Filter Pills */}
        <FilterPills
          pills={data.pills}
          active={activeFilter}
          onSelect={setActiveFilter}
        />

        {/* Table */}
        <div className="content-table">
          {/* Table header */}
          <div className={`ct-header ${data.compareMode ? 'ct-header-compare' : ''}`}>
            <div className="ct-col-tag">หัวข้อ</div>
            {data.compareMode ? (
              <>
                <div className="ct-col-title">ด้าน</div>
                <div className="ct-col-half">Rule-Based</div>
                <div className="ct-col-half">Agentic AI + MCP</div>
              </>
            ) : (
              <>
                <div className="ct-col-title">เนื้อหา</div>
                <div className="ct-col-body">รายละเอียด</div>
                <div className="ct-col-badge">หมวด</div>
              </>
            )}
          </div>

          {/* Rows */}
          {visibleRows.length > 0 ? (
            visibleRows.map((row) => (
              <ContentRowComponent
                key={row.id}
                row={row}
                compareMode={data.compareMode}
              />
            ))
          ) : (
            <div className="ct-empty">ไม่มีข้อมูลในหมวดนี้</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Chapter;
