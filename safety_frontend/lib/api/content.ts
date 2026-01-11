import apiClient from "../api-client"

export const contentApi = {
  generateBlog: async (data: any) => {
    const response = await apiClient.post("/content/generate-blog", data)
    return response.data
  },
  generateSocial: async (data: { blogContent: string; topic: string; tone: string; platforms: string[] }) => {
    const response = await apiClient.post("/content/generate-social", {
      topic: data.topic,
      source_content: data.blogContent,
      platforms: data.platforms,
    })

    // Transform SocialResponse to SocialPost[]
    const apiData = response.data
    const transformed: any[] = []

    if (apiData.twitter && apiData.twitter.length > 0) {
      transformed.push({ platform: "twitter", content: apiData.twitter[0], hashtags: apiData.hashtag_candidates || [] })
    }
    if (apiData.linkedin && apiData.linkedin.length > 0) {
      transformed.push({ platform: "linkedin", content: apiData.linkedin[0], hashtags: apiData.hashtag_candidates || [] })
    }
    if (apiData.instagram && apiData.instagram.length > 0) {
      transformed.push({ platform: "instagram", content: apiData.instagram[0], hashtags: apiData.hashtag_candidates || [] })
    }

    return transformed
  },
  generateImage: async (data: { topic: string; style: string; type: "hero" | "social" }) => {
    const response = await apiClient.post("/content/generate-image", {
      topic: data.topic,
      image_style: data.style,
      usage: data.type === "hero" ? "blog_hero" : "social",
    })

    return {
      url: response.data.image_url,
      type: data.type,
    }
  },
  saveBlog: async (data: any) => {
    // Transform to SaveBlogRequest
    const payload = {
      user_id: 1, // Default user
      topic: data.topic,
      blog: {
        title: data.title || data.topic,
        slug: data.topic.toLowerCase().replace(/ /g, "-"),
        content_markdown: data.markdown,
        keywords: data.keywords,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
        tone: data.tone,
        outline: [],
        word_count: data.markdown.split(/\s+/).length
      }
    }
    const response = await apiClient.post("/save/save-blog", payload)
    return response.data
  },
  schedule: async (data: { contentId: string | number; platform: string; scheduledDate: string; scheduledTime: string }) => {
    const publishAt = new Date(`${data.scheduledDate}T${data.scheduledTime}:00`).toISOString()

    const response = await apiClient.post("/schedule/", {
      item_type: "blog",
      item_id: typeof data.contentId === "string" ? 1 : data.contentId, // Fallback for temp IDs
      platform_targets: [data.platform],
      publish_at: publishAt
    })
    return response.data
  },
  getHistory: async () => {
    const response = await apiClient.get("/history/")
    // Normalize keys
    return response.data.map((item: any) => ({
      ...item,
      createdAt: item.created_at,
      markdown: item.content_markdown,
      analytics: item.analytics
    }))
  },

  getBlogDetail: async (id: number) => {
    const response = await apiClient.get(`/history/${id}`)
    const data = response.data
    // Transform to Blog state
    return {
      id: data.blog.id,
      topic: data.blog.topic,
      title: data.blog.title,
      markdown: data.blog.content_markdown,
      tone: data.blog.tone || "professional",
      keywords: data.blog.keywords || [],
      metaTitle: data.blog.meta_title,
      metaDescription: data.blog.meta_description
    }

  }
}




