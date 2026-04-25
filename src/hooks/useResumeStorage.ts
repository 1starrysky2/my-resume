import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_RESUME,
  parseResume,
  type ResumeData,
  STORAGE_KEY,
} from '../data/resumeSchema'

function loadFromStorage(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_RESUME)
    return parseResume(raw)
  } catch {
    return structuredClone(DEFAULT_RESUME)
  }
}

function saveToStorage(data: ResumeData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useResumeStorage() {
  const [data, setData] = useState<ResumeData>(() => loadFromStorage())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (ready) saveToStorage(data)
  }, [data, ready])

  const setResume = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setData((prev) => updater(structuredClone(prev)))
  }, [])

  const reset = useCallback(() => {
    if (!confirm('确定清除本地数据并恢复默认内容？此操作无法撤销。')) return
    const fresh = structuredClone(DEFAULT_RESUME)
    setData(fresh)
    saveToStorage(fresh)
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `resume-${data.profile.name || 'export'}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [data])

  const importFromFile = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const parsed = parseResume(String(reader.result))
          setData(parsed)
          saveToStorage(parsed)
          alert('导入成功')
        } catch (e) {
          alert(
            e instanceof Error ? e.message : '无法解析该 JSON 文件',
          )
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  return {
    data,
    setResume,
    reset,
    exportJson,
    importFromFile,
    hydrated: ready,
  }
}
