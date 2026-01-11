"use client"

import { useDispatch, useSelector } from "react-redux"
import { Edit3, Eye, Copy, Save, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { updateBlogMarkdown } from "@/store/content-slice"
import { addToast } from "@/store/ui-slice"
import { contentApi } from "@/lib/api/content"
import type { RootState } from "@/store/store"

import ReactMarkdown from "react-markdown"

export function BlogEditor() {
  const dispatch = useDispatch()
  const { currentBlog } = useSelector((state: RootState) => state.content)

  if (!currentBlog) return null

  const handleSave = async () => {
    try {
      await contentApi.saveBlog(currentBlog)
      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Saved!",
          description: "Your blog post has been saved to the database.",
        }),
      )
    } catch (error: any) {
      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Save Failed",
          description: error.message,
          variant: "destructive",
        }),
      )
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentBlog.markdown)
    dispatch(
      addToast({
        id: Date.now().toString(),
        title: "Copied!",
        description: "Markdown content copied to clipboard.",
      }),
    )
  }

  return (
    <Card className="min-h-[600px] flex flex-col glass border-primary/20 hover:border-primary/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50">
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Content Editor
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="hover-lift hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200 bg-transparent"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover-lift"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs defaultValue="write" className="h-full flex flex-col">
          <div className="px-6 py-3 border-b border-border/50 bg-muted/30">
            <TabsList className="bg-transparent gap-6 p-0">
              <TabsTrigger
                value="write"
                className="bg-transparent data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg border-0 px-4 py-2 transition-all duration-200 hover:bg-muted"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Write
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="bg-transparent data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg border-0 px-4 py-2 transition-all duration-200 hover:bg-muted"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="write" className="flex-1 p-0 m-0">
            <Textarea
              className="w-full h-full min-h-[500px] resize-none border-0 focus-visible:ring-0 p-6 text-base leading-relaxed font-mono bg-transparent"
              value={currentBlog.markdown}
              onChange={(e) => dispatch(updateBlogMarkdown(e.target.value))}
              placeholder="Start writing your masterpiece here..."
            />
          </TabsContent>
          <TabsContent
            value="preview"
            className="flex-1 p-8 m-0 overflow-auto prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
          >
            <ReactMarkdown>{currentBlog.markdown}</ReactMarkdown>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
