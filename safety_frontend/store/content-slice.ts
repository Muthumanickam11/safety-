import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface SocialPost {
  platform: string
  content: string
  hashtags: string[]
}

interface Image {
  url: string
  type: "hero" | "social"
}

interface Blog {
  id?: string
  topic: string
  title?: string
  markdown: string
  tone: string
  audience?: string
  length?: string
  language?: string
  keywords: string[]
  metaTitle: string
  metaDescription: string
}


interface HistoryItem {
  id: number
  topic: string
  title: string
  createdAt: string
  markdown: string
  tone: string
  analytics?: {
    word_count: number
    seo_score: number
    reading_time_minutes: number
  }
}

interface ContentState {
  currentBlog: Blog | null
  socialPosts: SocialPost[]
  images: Image[]
  history: HistoryItem[]
  isGenerating: boolean
}


const initialState: ContentState = {
  currentBlog: null,
  socialPosts: [],
  images: [],
  history: [],
  isGenerating: false,
}

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload
    },
    updateBlogMarkdown: (state, action: PayloadAction<string>) => {
      if (state.currentBlog) {
        state.currentBlog.markdown = action.payload
      }
    },
    setCurrentBlog: (state, action: PayloadAction<Blog>) => {
      state.currentBlog = action.payload
    },
    setSocialPosts: (state, action: PayloadAction<SocialPost[]>) => {
      state.socialPosts = action.payload
    },
    setImages: (state, action: PayloadAction<Image[]>) => {
      state.images = action.payload
    },
    setHistory: (state, action: PayloadAction<HistoryItem[]>) => {
      state.history = action.payload
    },
  },
})

export const { setIsGenerating, updateBlogMarkdown, setCurrentBlog, setSocialPosts, setImages, setHistory } =
  contentSlice.actions
export default contentSlice.reducer

