"use client"

import { Header } from "@/components/layout/header"

import { TopicForm } from "@/components/content/topic-form"
import { BlogEditor } from "@/components/content/blog-editor"
import { SeoPanel } from "@/components/content/seo-panel"
import { SocialPosts } from "@/components/content/social-posts"
import { ImageGenerator } from "@/components/content/image-generator"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScheduleModal } from "@/components/content/schedule-modal"
import { Zap, Wand2, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12 max-w-7xl">
        <div className="flex flex-col gap-10">
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
              <Zap className="h-4 w-4" />
              Powered by Advanced AI
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              Ship Content{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Faster
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
              The all-in-one AI studio for creators. Generate blogs, social media posts, and custom images in seconds.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Unlimited generations</span>
              </div>
            </div>
          </div>

          <TopicForm />

          <ContentArea />
        </div>
      </main>
      <ScheduleModal />
    </div>
  )
}

function ContentArea() {
  const { currentBlog } = useSelector((state: RootState) => state.content)

  if (!currentBlog) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="lg:col-span-8 space-y-8">
        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass p-1">
            <TabsTrigger value="blog" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Blog Post
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Social Media
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Visuals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="blog" className="mt-6">
            <BlogEditor />
          </TabsContent>
          <TabsContent value="social" className="mt-6">
            <SocialPosts />
          </TabsContent>
          <TabsContent value="images" className="mt-6">
            <ImageGenerator />
          </TabsContent>
        </Tabs>
      </div>
      <div className="lg:col-span-4">
        <SeoPanel />
      </div>
    </div>
  )
}
