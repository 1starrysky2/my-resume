import { useState } from 'react'
import type { ListSection, ResumeData, ResumeItem } from '../data/resumeSchema'
import { newEmptyItem } from '../data/resumeSchema'
import { GlassSection } from './GlassSection'
import { GradientHeading } from './GradientHeading'

type Props = {
  section: ListSection
  sectionIndex: number
  editMode: boolean
  setResume: (updater: (prev: ResumeData) => ResumeData) => void
}

function moveItemInSection(
  items: ResumeItem[],
  from: number,
  to: number,
): ResumeItem[] {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [spliced] = next.splice(from, 1)
  next.splice(to, 0, spliced)
  return next
}

export function ListSectionBlock({
  section,
  sectionIndex,
  editMode,
  setResume,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<ResumeItem | null>(null)

  const startEdit = (item: ResumeItem) => {
    setEditingId(item.id)
    setDraft({ ...item })
  }

  const saveEdit = () => {
    if (!draft || editingId === null) return
    setResume((prev) => {
      const sections = prev.sections.map((s, i) => {
        if (i !== sectionIndex) return s
        return {
          ...s,
          items: s.items.map((it) => (it.id === editingId ? { ...draft } : it)),
        }
      })
      return { ...prev, sections }
    })
    setEditingId(null)
    setDraft(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(null)
  }

  const addItem = () => {
    const item = newEmptyItem()
    setResume((prev) => {
      const sections = prev.sections.map((s, i) =>
        i === sectionIndex ? { ...s, items: [...s.items, item] } : s,
      )
      return { ...prev, sections }
    })
    startEdit(item)
  }

  const removeItem = (id: string) => {
    if (!confirm('确定删除该条经历？')) return
    setResume((prev) => {
      const sections = prev.sections.map((s, i) => {
        if (i !== sectionIndex) return s
        return { ...s, items: s.items.filter((it) => it.id !== id) }
      })
      return { ...prev, sections }
    })
    if (editingId === id) cancelEdit()
  }

  const move = (itemId: string, dir: -1 | 1) => {
    setResume((prev) => {
      const sections = prev.sections.map((s, i) => {
        if (i !== sectionIndex) return s
        const idx = s.items.findIndex((it) => it.id === itemId)
        if (idx < 0) return s
        return { ...s, items: moveItemInSection(s.items, idx, idx + dir) }
      })
      return { ...prev, sections }
    })
  }

  const campusClass = section.id === 'campus' ? 'is-campus' : ''

  return (
    <GlassSection
      className={`list-section ${campusClass}`.trim()}
      id={section.id}
    >
      <div className="section-head">
        {editMode ? (
          <input
            className="section-title-input"
            value={section.title}
            onChange={(e) =>
              setResume((prev) => {
                const sections = prev.sections.map((s, i) =>
                  i === sectionIndex
                    ? { ...s, title: e.target.value }
                    : s,
                )
                return { ...prev, sections }
              })
            }
            aria-label="模块标题"
          />
        ) : (
          <GradientHeading as="h2">{section.title}</GradientHeading>
        )}
        {editMode && (
          <button type="button" className="btn-soft" onClick={addItem}>
            + 添加经历
          </button>
        )}
      </div>

      <ul className="item-list">
        {section.items.length === 0 && !editMode && (
          <li className="item-card item-card--empty">
            <p className="item-content">
              暂无内容（开启“编辑内容”后可添加）
            </p>
          </li>
        )}
        {section.items.map((item, i) => {
          const isEditing = editMode && editingId === item.id
          if (isEditing && draft) {
            return (
              <li key={item.id} className="item-card item-card--editing">
                <div className="field-grid">
                  <label>
                    标题
                    <input
                      value={draft.title}
                      onChange={(e) =>
                        setDraft({ ...draft, title: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    时间 / 标签
                    <input
                      value={draft.meta ?? ''}
                      onChange={(e) =>
                        setDraft({ ...draft, meta: e.target.value || undefined })
                      }
                    />
                  </label>
                  <label className="span-2">
                    副标题（选填）
                    <input
                      value={draft.subtitle ?? ''}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          subtitle: e.target.value || undefined,
                        })
                      }
                    />
                  </label>
                  <label className="span-2">
                    详细描述
                    <textarea
                      rows={4}
                      value={draft.content}
                      onChange={(e) =>
                        setDraft({ ...draft, content: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={saveEdit}
                  >
                    保存
                  </button>
                  <button type="button" className="btn-ghost" onClick={cancelEdit}>
                    取消
                  </button>
                </div>
              </li>
            )
          }

          return (
            <li key={item.id} className="item-card">
              <div className="item-top">
                <h3 className="item-title">{item.title}</h3>
                {item.meta && <span className="item-meta">{item.meta}</span>}
              </div>
              {item.subtitle && (
                <p className="item-subtitle">{item.subtitle}</p>
              )}
              <p className="item-content">{item.content}</p>
              {editMode && (
                <div className="row-actions item-toolbar">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => startEdit(item)}
                    disabled={editingId !== null}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => move(item.id, -1)}
                    disabled={i === 0 || editingId !== null}
                    aria-label="上移"
                  >
                    上移
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => move(item.id, 1)}
                    disabled={i === section.items.length - 1 || editingId !== null}
                    aria-label="下移"
                  >
                    下移
                  </button>
                  <button
                    type="button"
                    className="btn-ghost danger"
                    onClick={() => removeItem(item.id)}
                    disabled={editingId !== null}
                  >
                    删除
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </GlassSection>
  )
}
