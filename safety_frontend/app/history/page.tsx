"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowUpRight, BarChart3, Clock, FileText, TrendingUp } from "lucide-react"
import { contentApi } from "@/lib/api/content"
import { setHistory, setCurrentBlog } from "@/store/content-slice"
import type { RootState } from "@/store/store"
import { formatDate } from "@/lib/utils/format"
import { useRouter } from "next/navigation"
import { Suspense } from "react"

export default function HistoryPage() {
  return (
    <Suspense fallback={null}>
      <HistoryContent />
    </Suspense>
  )
}

function HistoryContent() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { history } = useSelector((state: RootState) => state.content)
  const [search, setSearch] = useState("")

  const historyList = Array.isArray(history) ? history : []

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await contentApi.getHistory()
        dispatch(setHistory(Array.isArray(data) ? data : []))
      } catch (error) {
        console.error("Failed to fetch history", error)
      }
    }
    fetchHistory()
  }, [dispatch])

  const filteredHistory = historyList.filter((item) => item.topic.toLowerCase().includes(search.toLowerCase()))

  const handleOpen = async (item: any) => {
    try {
      const fullBlog = await contentApi.getBlogDetail(item.id)
      dispatch(setCurrentBlog(fullBlog))
      router.push("/")
    } catch (error) {
      console.error("Failed to load blog details", error)
    }
  }


  const totalWords = historyList.reduce((acc, item) => acc + (item.analytics?.word_count || 0), 0)
  const avgSeo = historyList.length > 0
    ? Math.round(historyList.reduce((acc, item) => acc + (item.analytics?.seo_score || 0), 0) / historyList.length)
    : 0

  // Estimate: 1 min reading ~ 15 mins writing
  const totalReadingTimeMins = historyList.reduce((acc, item) => acc + (item.analytics?.reading_time_minutes || 0), 0)
  const timeSavedHours = Math.round((totalReadingTimeMins * 15) / 60)

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12 max-w-7xl">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Content{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">Manage and analyze your generated content.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  className="pl-10 w-[200px] md:w-[300px] bg-card/50 border-border/50 focus:border-primary/50 transition-all duration-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="hover-lift hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200 bg-transparent"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <StatsCard
              title="Total Articles"
              value={historyList.length.toString()}
              description="Generated content"
              icon={FileText}
              trend="--"
              gradient="from-primary/20 to-primary/5"
            />
            <StatsCard
              title="Total Words"
              value={(totalWords / 1000).toFixed(1) + "k"}
              description="Content output"
              icon={BarChart3}
              trend="--"
              gradient="from-accent/20 to-accent/5"
            />
            <StatsCard
              title="Avg. SEO Score"
              value={avgSeo.toString()}
              description="Optimization level"
              icon={TrendingUp}
              trend="--"
              gradient="from-green-500/20 to-green-500/5"
            />
            <StatsCard
              title="Time Saved"
              value={timeSavedHours + "h"}
              description="Est. writing time"
              icon={Clock}
              trend="--"
              gradient="from-yellow-500/20 to-yellow-500/5"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Content</h2>
              <Badge variant="secondary" className="px-3 py-1">
                {filteredHistory.length} {filteredHistory.length === 1 ? "item" : "items"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, i) => (
                  <Card
                    key={i}
                    className="group glass border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer hover-lift overflow-hidden"
                    onClick={() => handleOpen(item)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs text-muted-foreground font-medium">
                          {formatDate(item.createdAt || new Date())}
                        </span>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {item.topic}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {item.markdown.replace(/[#*`_~]/g, "").slice(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">Tone:</span>
                          <span className="capitalize font-medium">{item.tone}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 group-hover:translate-x-1"
                        >
                          Open
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-24 text-center space-y-6 border-2 border-dashed border-primary/20 rounded-2xl bg-card/30 glass backdrop-blur-sm animate-in fade-in duration-500">
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">No content history found</p>
                    <p className="text-muted-foreground">
                      {search
                        ? "Try adjusting your search criteria"
                        : "Start creating content to see your history here"}
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover-lift mt-4"
                  >
                    Create New Content
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatsCard({ title, value, description, icon: Icon, trend, gradient }: any) {
  return (
    <Card
      className={`glass border-primary/20 hover:border-primary/30 bg-gradient-to-br ${gradient} transition-all duration-300 hover-lift`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider">{title}</CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant="secondary"
            className="text-xs font-semibold bg-green-500/10 text-green-400 border-green-500/30"
          >
            {trend}
          </Badge>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
