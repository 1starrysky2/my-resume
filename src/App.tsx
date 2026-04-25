import { useState } from 'react'
import type { Profile, ResumeData } from './data/resumeSchema'
import { useResumeStorage } from './hooks/useResumeStorage'
import { GlassSection } from './components/GlassSection'
import { GradientHeading } from './components/GradientHeading'
import { ListSectionBlock } from './components/ListSectionBlock'
import { MouseGlow } from './components/MouseGlow'
import { ParticleBackground } from './components/ParticleBackground'

function ProfilePanel({
  profile,
  editMode,
  onChange,
}: {
  profile: Profile
  editMode: boolean
  onChange: (p: Partial<Profile>) => void
}) {
  if (editMode) {
    return (
      <div className="field-grid profile-fields">
        <label>
          姓名
          <input
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </label>
        <label>
          身份 / 岗位
          <input
            value={profile.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </label>
        <label className="span-2">
          一句话介绍
          <input
            value={profile.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
          />
        </label>
        <label>
          邮箱
          <input
            type="email"
            value={profile.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </label>
        <label>
          电话
          <input
            value={profile.phone ?? ''}
            onChange={(e) => onChange({ phone: e.target.value || undefined })}
          />
        </label>
        <label>
          城市
          <input
            value={profile.location ?? ''}
            onChange={(e) => onChange({ location: e.target.value || undefined })}
          />
        </label>
        <div className="span-2 social-editor">
          <span className="field-label">社交链接</span>
          {profile.social.map((row, i) => (
            <div key={i} className="social-row">
              <input
                placeholder="名称"
                value={row.label}
                onChange={(e) => {
                  const social = profile.social.map((s, j) =>
                    j === i ? { ...s, label: e.target.value } : s,
                  )
                  onChange({ social })
                }}
              />
              <input
                placeholder="https://"
                value={row.href}
                onChange={(e) => {
                  const social = profile.social.map((s, j) =>
                    j === i ? { ...s, href: e.target.value } : s,
                  )
                  onChange({ social })
                }}
              />
              <button
                type="button"
                className="btn-icon"
                onClick={() =>
                  onChange({
                    social: profile.social.filter((_, j) => j !== i),
                  })
                }
                aria-label="删除链接"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-soft"
            onClick={() =>
              onChange({
                social: [...profile.social, { label: '链接', href: 'https://' }],
              })
            }
          >
            + 添加链接
          </button>
        </div>
      </div>
    )
  }
  return (
    <>
      <p className="eyebrow">PORTFOLIO / RESUME</p>
      <h1 className="hero-name">{profile.name}</h1>
      <p className="hero-role">{profile.title}</p>
      <p className="hero-tagline">{profile.tagline}</p>
      <ul className="meta-row">
        <li>{profile.email}</li>
        {profile.phone && <li>{profile.phone}</li>}
        {profile.location && <li>{profile.location}</li>}
      </ul>
      <ul className="link-row">
        {profile.social.map((s) => (
          <li key={s.href + s.label}>
            <a href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

function App() {
  const { data, setResume, reset, exportJson, importFromFile, hydrated } =
    useResumeStorage()
  const [editMode, setEditMode] = useState(false)
  const [skillDraft, setSkillDraft] = useState('')

  const updateProfile = (p: Partial<Profile>) => {
    setResume((prev) => ({ ...prev, profile: { ...prev.profile, ...p } }))
  }

  const addSkill = () => {
    const t = skillDraft.trim()
    if (!t) return
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.includes(t) ? prev.skills : [...prev.skills, t],
    }))
    setSkillDraft('')
  }

  const removeSkill = (i: number) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, j) => j !== i),
    }))
  }

  if (!hydrated) {
    return (
      <div className="app-loading">
        <div className="shimmer" />
        <p>加载中…</p>
      </div>
    )
  }

  return (
    <div className="app-root">
      <ParticleBackground />
      <MouseGlow />

      <header className="top-bar glass-bar">
        <div className="logo-mark" aria-hidden>
          <span />
        </div>
        <div className="bar-actions">
          <button
            type="button"
            className={editMode ? 'btn-primary' : 'btn-soft'}
            onClick={() => setEditMode((e) => !e)}
          >
            {editMode ? '完成编辑' : '编辑内容'}
          </button>
          <button type="button" className="btn-ghost" onClick={exportJson}>
            导出 JSON
          </button>
          <button type="button" className="btn-ghost" onClick={importFromFile}>
            导入 JSON
          </button>
          <button type="button" className="btn-ghost danger" onClick={reset}>
            恢复默认
          </button>
        </div>
      </header>

      <main className="app-main">
        <GlassSection className="hero-card">
          <ProfilePanel
            profile={data.profile}
            editMode={editMode}
            onChange={updateProfile}
          />
        </GlassSection>

        <GlassSection id="about">
          <div className="section-head">
            <GradientHeading as="h2">个人简介</GradientHeading>
          </div>
          {editMode ? (
            <textarea
              className="about-textarea"
              rows={6}
              value={data.about}
              onChange={(e) =>
                setResume((prev: ResumeData) => ({ ...prev, about: e.target.value }))
              }
            />
          ) : (
            <p className="about-text">{data.about}</p>
          )}
        </GlassSection>

        <GlassSection id="skills">
          <div className="section-head">
            <GradientHeading as="h2">技能标签</GradientHeading>
          </div>
          {editMode && (
            <div className="skill-input-row">
              <input
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="输入技能后点击添加"
              />
              <button type="button" className="btn-soft" onClick={addSkill}>
                添加
              </button>
            </div>
          )}
          <ul className="skill-tags">
            {data.skills.map((s, i) => (
              <li key={`${s}-${i}`} className="skill-tag">
                {s}
                {editMode && (
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => removeSkill(i)}
                    aria-label={`删除 ${s}`}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        </GlassSection>

        {data.sections.map((section, sectionIndex) => (
          <ListSectionBlock
            key={section.id}
            section={section}
            sectionIndex={sectionIndex}
            editMode={editMode}
            setResume={setResume}
          />
        ))}
      </main>

      <footer className="app-footer">
        <p>
          数据仅保存在本机浏览器（localStorage）。换设备可导出/导入 JSON。
        </p>
      </footer>
    </div>
  )
}

export default App
