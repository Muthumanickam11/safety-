"use client"

import { useMemo } from "react"
import { useSelector } from "react-redux"
import { Search, TrendingUp, AlertCircle, CheckCircle2, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { RootState } from "@/store/store"
import { analyzeSeo } from "@/lib/utils/seo"

export function SeoPanel() {
  const { currentBlog } = useSelector((state: RootState) => state.content)

  const analysis = useMemo(() => {
    if (!currentBlog) return null
    return analyzeSeo(currentBlog.markdown, currentBlog.keywords)
  }, [currentBlog])

  if (!analysis || !currentBlog) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-green-500/5"
    if (score >= 50) return "from-yellow-500/20 to-yellow-500/5"
    return "from-red-500/20 to-red-500/5"
  }

  return (
    <div className="space-y-6 sticky top-24">
      <Card
        className={`glass border-primary/20 bg-gradient-to-br ${getScoreGradient(analysis.seoScore)} hover:border-primary/30 transition-all duration-300`}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              SEO Analysis
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-3">
            <div className={`text-6xl font-extrabold ${getScoreColor(analysis.seoScore)} tracking-tight`}>
              {analysis.seoScore}
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Overall Score</p>
            <Progress value={analysis.seoScore} className="h-2.5 bg-muted/50" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="text-center space-y-1 p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="text-3xl font-bold text-primary">{analysis.wordCount}</div>
              <p className="text-xs text-muted-foreground font-medium">Words</p>
            </div>
            <div className="text-center space-y-1 p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="text-3xl font-bold text-accent">{analysis.readingTime}m</div>
              <p className="text-xs text-muted-foreground font-medium">Read Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-primary/20 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider">
            <Target className="h-4 w-4 text-primary" />
            Target Keywords
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(analysis.keywordDensity).map(([keyword, density]) => {
            const isOptimal = density >= 0.5 && density <= 2.5
            return (
              <div key={keyword} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm truncate max-w-[140px]">{keyword}</span>
                  <Badge
                    variant={isOptimal ? "default" : "secondary"}
                    className={isOptimal ? "bg-primary/20 text-primary border-primary/30" : ""}
                  >
                    {density.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={Math.min(density * 20, 100)} className="h-1.5 bg-muted/50" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="glass border-primary/20 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {analysis.suggestions.length > 0 ? (
              analysis.suggestions.map((suggestion, i) => (
                <div key={i} className="flex gap-3 p-4 items-start hover:bg-muted/30 transition-colors">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-balance leading-relaxed">{suggestion}</p>
                </div>
              ))
            ) : (
              <div className="flex gap-3 p-4 items-start bg-green-500/5">
                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                <p className="text-sm text-balance leading-relaxed">Your content is perfectly optimized!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
