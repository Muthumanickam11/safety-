"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Save, Camera, Github, Twitter, Linkedin } from "lucide-react"
import { useDispatch } from "react-redux"
import { addToast } from "@/store/ui-slice"

export function ProfileForm() {
  const dispatch = useDispatch()
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "AI Content Creator",
    avatar: "/user-avatar.jpg",
  })


  const handleSave = () => {
    dispatch(
      addToast({
        id: Date.now().toString(),
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      }),
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Information</CardTitle>
          <CardDescription>Update your personal details and public bio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg transition-transform group-hover:scale-105">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-3xl">JD</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full shadow-md border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border/50">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleSave} className="px-8 bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
