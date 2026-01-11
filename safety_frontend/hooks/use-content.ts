"use client"

import { useState, useCallback } from "react"
import apiClient from "@/lib/api-client"

export interface ContentState {
  topic: string
  audience: string
  tone: string
  length: string
  language: string
  blogContent: string
  socialPosts: {
    twitter: string
    linkedin: string
    instagram: string
  }
  images: string[]
  seoData: {
    score: number
    keywords: string[]
    metaTitle: string
    metaDescription: string
  }
}

export function useContent() {
  const [content, setContent] = useState<ContentState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateBlog = useCallback(async (payload: any) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post("/generate-blog", payload)
      setContent((prev) => ({
        ...prev,
        ...payload,
        blogContent: response.data.content,
        seoData: response.data.seo,
      }))
    } catch (err: any) {
      setError(err.message || "Failed to generate blog")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ... other methods will be added in subsequent tasks

  return { content, setContent, isLoading, error, generateBlog }
}
