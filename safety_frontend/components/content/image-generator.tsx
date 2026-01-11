"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ImageIcon, Sparkles, Download, RefreshCw, Loader2, Palette } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { contentApi } from "@/lib/api/content"
import { setImages } from "@/store/content-slice"
import { addToast } from "@/store/ui-slice"
import type { RootState } from "@/store/store"
import Image from "next/image"

const STYLES = [
  { id: "photorealistic", label: "Photorealistic" },
  { id: "digital-art", label: "Digital Art" },
  { id: "minimalist", label: "Minimalist" },
  { id: "3d-render", label: "3D Render" },
  { id: "flat-illustration", label: "Flat Illustration" },
]

export function ImageGenerator() {
  const dispatch = useDispatch()
  const { currentBlog, images } = useSelector((state: RootState) => state.content)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState("photorealistic")

  if (!currentBlog) return null

  const handleGenerate = async (type: "hero" | "social") => {
    setIsGenerating(true)
    try {
      const newImage = await contentApi.generateImage({
        topic: currentBlog.topic,
        style: selectedStyle,
        type,
      })

      // Update store - append if exists or set initial
      dispatch(setImages([...images, newImage]))

      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Image ready!",
          description: `Your ${type} image has been generated successfully.`,
        }),
      )
    } catch (error: any) {
      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Generation Failed",
          description: error.message,
          variant: "destructive",
        }),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="min-h-[500px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>AI Image Studio</CardTitle>
            <CardDescription>Create stunning visuals for your blog and social media.</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
              <Palette className="h-4 w-4" />
              Style:
            </div>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Style" />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hero Image Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hero Image (16:9)</h3>
            <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center bg-muted/20 group">
              {images.find((img) => img.type === "hero") ? (
                <>
                  <Image
                    src={images.find((img) => img.type === "hero")?.url || "/placeholder.svg"}
                    alt="Hero"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleGenerate("hero")}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <Button size="sm" onClick={() => handleGenerate("hero")} disabled={isGenerating}>
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate Hero
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Social Image Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Social Share (1:1)</h3>
            <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center bg-muted/20 group">
              {images.find((img) => img.type === "social") ? (
                <>
                  <Image
                    src={images.find((img) => img.type === "social")?.url || "/placeholder.svg"}
                    alt="Social"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleGenerate("social")}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <Button size="sm" onClick={() => handleGenerate("social")} disabled={isGenerating}>
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate Social
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 py-4 border-t text-xs text-muted-foreground justify-center">
        Powered by AI Studio Image Generation Engine
      </CardFooter>
    </Card>
  )
}
