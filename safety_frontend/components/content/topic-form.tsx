"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Sparkles, Loader2, Globe, MessageSquare, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { contentApi } from "@/lib/api/content"
import { setCurrentBlog, setIsGenerating } from "@/store/content-slice"
import { addToast } from "@/store/ui-slice"
import type { RootState } from "@/store/store"

export function TopicForm() {
  const dispatch = useDispatch()
  const { isGenerating } = useSelector((state: RootState) => state.content)

  const [formData, setFormData] = useState({
    topic: "",
    audience: "general",
    tone: "professional",
    length: "medium",
    language: "english",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.topic) return

    dispatch(setIsGenerating(true))
    try {
      const response = await contentApi.generateBlog({
        ...formData,
      })

      dispatch(
        setCurrentBlog({
          ...formData,
          title: response.title,
          markdown: response.content_markdown,
          keywords: response.keywords,
          metaTitle: response.meta_title,
          metaDescription: response.meta_description,
        }),

      )

      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Success!",
          description: "Your blog content has been generated.",
        }),
      )
    } catch (error: any) {
      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Generation Failed",
          description: error.message || "Something went wrong while generating content.",
          variant: "destructive",
        }),
      )
    } finally {
      dispatch(setIsGenerating(false))
    }
  }

  return (
    <Card className="w-full glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent animate-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          What are we creating today?
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Enter a topic and customize the settings to generate AI-powered content in seconds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-base font-medium">
              Topic or Keywords
            </Label>
            <Input
              id="topic"
              placeholder="e.g., The future of AI in marketing, How to cook sourdough bread..."
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
              className="text-lg py-6 bg-input/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-primary" />
                Audience
              </Label>
              <Select
                value={formData.audience}
                onValueChange={(value) => setFormData({ ...formData, audience: value })}
              >
                <SelectTrigger className="bg-input/50 border-border/50 hover:border-primary/30 transition-all duration-200">
                  <SelectValue placeholder="Target Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="h-4 w-4 text-primary" />
                Tone
              </Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                <SelectTrigger className="bg-input/50 border-border/50 hover:border-primary/30 transition-all duration-200">
                  <SelectValue placeholder="Content Tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" />
                Length
              </Label>
              <Select value={formData.length} onValueChange={(value) => setFormData({ ...formData, length: value })}>
                <SelectTrigger className="bg-input/50 border-border/50 hover:border-primary/30 transition-all duration-200">
                  <SelectValue placeholder="Content Length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (~300 words)</SelectItem>
                  <SelectItem value="medium">Medium (~700 words)</SelectItem>
                  <SelectItem value="long">Long (~1500 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4 text-primary" />
                Language
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="bg-input/50 border-border/50 hover:border-primary/30 transition-all duration-200">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-primary/50 transition-all duration-300 hover-lift font-semibold"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating magic...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
