"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Twitter, Linkedin, Instagram, Copy, RefreshCw, Send, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { contentApi } from "@/lib/api/content"
import { setSocialPosts } from "@/store/content-slice"
import { addToast, setScheduleModalOpen } from "@/store/ui-slice"
import type { RootState } from "@/store/store"
import { characterCount, getCharacterLimit } from "@/lib/utils/format"

export function SocialPosts() {
  const dispatch = useDispatch()
  const { currentBlog, socialPosts } = useSelector((state: RootState) => state.content)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!currentBlog) return null

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const posts = await contentApi.generateSocial({
        blogContent: currentBlog.markdown,
        topic: currentBlog.topic,
        tone: currentBlog.tone,
        platforms: ["twitter", "linkedin", "instagram"],
      })
      dispatch(setSocialPosts(posts))
      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Social posts generated!",
          description: "We've created tailored posts for your platforms.",
        }),
      )
    } catch (error: any) {
      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Failed to generate posts",
          description: error.message,
          variant: "destructive",
        }),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    dispatch(
      addToast({
        id: Date.now().toString(),
        title: "Copied!",
        description: "Post content copied to clipboard.",
      }),
    )
  }

  return (
    <Card className="min-h-[500px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Social Media Posts</CardTitle>
            <CardDescription>Tailored content for your social channels based on your blog.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            {socialPosts.length > 0 ? "Regenerate" : "Generate Social Posts"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {socialPosts.length > 0 ? (
          <Tabs defaultValue="twitter" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="twitter" className="gap-2">
                <Twitter className="h-4 w-4" />X (Twitter)
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </TabsTrigger>
              <TabsTrigger value="instagram" className="gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </TabsTrigger>
            </TabsList>

            {socialPosts.map((post) => (
              <TabsContent key={post.platform} value={post.platform} className="space-y-4">
                <div className="relative group">
                  <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm min-h-[200px] whitespace-pre-wrap leading-relaxed">
                    {post.content}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(post.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-32 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          characterCount(post.content) > getCharacterLimit(post.platform)
                            ? "bg-destructive"
                            : "bg-primary"
                        }`}
                        style={{
                          width: `${Math.min((characterCount(post.content) / getCharacterLimit(post.platform)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {characterCount(post.content)} / {getCharacterLimit(post.platform)}
                    </span>
                  </div>
                  <Button size="sm" onClick={() => dispatch(setScheduleModalOpen(true))}>
                    <Send className="h-4 w-4 mr-2" />
                    Schedule Post
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-muted/20 rounded-xl border-2 border-dashed">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">No posts generated yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto text-balance">
                Click the generate button above to create social media content for this blog post.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
