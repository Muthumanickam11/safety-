"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { ProfileForm } from "@/components/content/profile-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Award } from "lucide-react"
import { contentApi } from "@/lib/api/content"


export default function ProfilePage() {
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    contentApi.getHistory().then((data) => {
      setRecentActivity(data.slice(0, 5)) // Get last 5 items
    })
  }, [])

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and view your activity.</p>
            </div>
            <ProfileForm />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="text-lg">Account Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Drafts</span>
                  </div>
                  <span className="text-lg font-bold">{recentActivity.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Credits</span>
                  </div>
                  <span className="text-lg font-bold">Unlimited</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Plan</span>
                  </div>
                  <span className="text-sm font-bold text-primary">Admin</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((item, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium">Generated Blog Post</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString()} • "{item.topic}"
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

