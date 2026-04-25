export type ResumeItem = {
  id: string
  title: string
  subtitle?: string
  content: string
  meta?: string
}

export type ListSection = {
  id: 'education' | 'work' | 'project' | 'honors' | 'campus'
  title: string
  items: ResumeItem[]
}

export type Profile = {
  name: string
  title: string
  tagline: string
  email: string
  phone?: string
  location?: string
  social: { label: string; href: string }[]
}

export type ResumeData = {
  version: 1
  profile: Profile
  about: string
  skills: string[]
  sections: ListSection[]
}

export const STORAGE_KEY = 'resume-v1'

function id(): string {
  return crypto.randomUUID()
}

export const DEFAULT_RESUME: ResumeData = {
  version: 1,
  profile: {
    name: '麦章远',
    title: 'Agent 开发工程师 · 大模型应用开发',
    tagline: '多 Agent 协作 / RAG / 本地部署 · 用工程能力把 AI 变成可落地产品',
    email: '2915973308@qq.com',
    phone: '18933774960',
    location: '广东省湛江市霞山区',
    social: [
      { label: '邮箱', href: 'mailto:2915973308@qq.com' },
    ],
  },
  about:
    '性格开朗随和，善于团队协作；工作踏实严谨，责任心强。学习能力突出，熟练使用 AI 工具提升工作效率，可快速掌握大模型应用等前沿技术，具备较强的自主学习能力与抗压能力，能快速适应工作环境并高效完成任务。',
  skills: [
    'Vue',
    'FastAPI',
    'LangChain',
    'LangGraph',
    'RAG',
    'Qwen3-VL-2B-Instruct（本地部署）',
    'Redis',
    'MySQL',
    'JWT',
    'Three.js',
    'n8n',
    'ChromaDB',
    'BitsAndBytes（4bit 量化）',
  ],
  sections: [
    {
      id: 'education',
      title: '教育背景',
      items: [
        {
          id: 'seed-edu-1',
          title: '珠海科技学院 · 软件工程（本科）',
          meta: '2024.09 – 至今',
          content: '在读本科。毕业院校：珠海科技学院。',
        },
      ],
    },
    {
      id: 'work',
      title: '实践 / 参与经历',
      items: [
        {
          id: 'seed-work-1',
          title: '奕瑞科技 · 比对系统项目（参与）',
          meta: '2025.11 – 2026.01',
          content: '参与公司比对系统相关项目建设与协作开发。',
        },
        {
          id: 'seed-work-2',
          title: '英诺赛科 · 项目参与（参与）',
          meta: '2025.10 – 至今',
          content: '参与公司项目开发与协作交付。',
        },
        {
          id: 'seed-work-3',
          title: '实验室 · 简历系统项目（参与）',
          meta: '2026.03 – 至今',
          content: '参与实验室简历系统项目研发与迭代。',
        },
      ],
    },
    {
      id: 'project',
      title: '项目经历',
      items: [
        {
          id: 'seed-proj-1',
          title: '智脉协同 —— 基于双 Agent 的工业研发协同与状态感知平台（独立开发）',
          meta: '2026.01 – 2026.03',
          content:
            '技术架构：Vue、FastAPI、LangChain、LangGraph、本地部署 Qwen3-VL-2B-Instruct 多模态模型、Redis、MySQL、Three.js、JWT。\n负责多 Agent 架构设计（业务决策 Agent + 多模态图文分析 Agent）；优化遗传算法与个性化动态心率安全区间算法，提升设备状态感知准确率；使用大模型实现图片/文档/3D 模型工业数据解析；通过提示词工程将通用大模型扩展到工业领域。',
        },
        {
          id: 'seed-proj-2',
          title: '基于 n8n 的聊天机器人（独立开发）',
          meta: '2026.03 – 2026.04',
          content:
            '技术架构：n8n、RAG、Qwen 大模型 API、LangChain、ChromaDB。\n使用 n8n 排班触发器实现定时任务联动大模型生成个性化问候；设计并优化聊天人设与检索规则（skill），提高回答准确率；构建本地向量知识库，支持自定义文档导入与检索，实现基于个人知识库的精准问答。',
        },
        {
          id: 'seed-proj-3',
          title: '本草代谢智配 —— 基于多 Agent 平台（参与）',
          meta: '2026.01 – 2026.03',
          content:
            '技术架构：Vue、MySQL、FastAPI、LangGraph、BitsAndBytes、RAG、本地部署 Qwen3-VL-2B-Instruct。\n设计多智能体并按流程串联协作，完成中医辨证论治全流程；采用 4bit 量化减少显存占用，实现消费级显卡本地部署；构造中医 RAG 知识库，提升推荐准确性并减少模型幻觉。',
        },
      ],
    },
    {
      id: 'honors',
      title: '荣誉奖项',
      items: [
        {
          id: 'seed-honor-1',
          title: '实用型专利',
          meta: '1 项',
          content:
            '已获得实用型专利 1 项。',
        },
        {
          id: 'seed-honor-2',
          title: '软件著作权',
          meta: '2 项',
          content:
            '已登记软件著作权 2 项。',
        },
        {
          id: 'seed-honor-3',
          title: '小挑战赛校铜奖',
          meta: '1 次',
          content: '获得校级小挑战赛铜奖。',
        },
      ],
    },
    {
      id: 'campus',
      title: '校园经历',
      items: [],
    },
  ],
}

export function newEmptyItem(): ResumeItem {
  return {
    id: id(),
    title: '新标题',
    content: '在此描述经历与成果……',
  }
}

export function parseResume(json: string): ResumeData {
  const data = JSON.parse(json) as ResumeData
  if (data?.version !== 1 || !data.profile || !Array.isArray(data.sections)) {
    throw new Error('无效的简历数据')
  }
  return data
}
