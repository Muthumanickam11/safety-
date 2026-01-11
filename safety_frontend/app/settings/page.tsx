"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Key, User, Bell, Palette, Save, Eye, EyeOff } from "lucide-react"
import { useDispatch } from "react-redux"
import { addToast } from "@/store/ui-slice"
import { ProfileForm } from "@/components/content/profile-form"

export default function SettingsPage() {
  const dispatch = useDispatch()
  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState({
    apiKey: "sk-proj-...",
    name: "",
    email: "",
    notifications: {
      email: true,
      push: false,
      contentGeneration: true,
      scheduling: true,
    },
    preferences: {
      theme: "light",
      defaultTone: "professional",
      defaultLength: "medium",
      defaultLanguage: "english",
    },
  })

  const handleSave = () => {
    dispatch(
      addToast({
        id: Date.now().toString(),
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      }),
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container py-8 max-w-4xl">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>

          <Tabs defaultValue="api" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="api" className="gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Palette className="h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="api" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>
                    Configure your API keys for content generation. Your keys are stored securely and encrypted.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">OpenAI API Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="openai-key"
                          type={showApiKey ? "text" : "password"}
                          value={settings.apiKey}
                          onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                          placeholder="sk-proj-..."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-8 w-8"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get your API key from{" "}
                      <a
                        href="https://platform.openai.com"
                        className="underline"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        platform.openai.com
                      </a>
                    </p>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save API Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <ProfileForm />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to receive notifications about your content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, push: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Content Generation</Label>
                      <p className="text-sm text-muted-foreground">Notify when content generation completes</p>
                    </div>
                    <Switch
                      checked={settings.notifications.contentGeneration}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, contentGeneration: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Scheduled Posts</Label>
                      <p className="text-sm text-muted-foreground">Notify when scheduled posts are published</p>
                    </div>
                    <Switch
                      checked={settings.notifications.scheduling}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, scheduling: checked },
                        })
                      }
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Defaults</CardTitle>
                  <CardDescription>
                    Set default values for content generation to speed up your workflow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={(val) =>
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, theme: val },
                        })
                      }
                    >
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-tone">Default Tone</Label>
                    <Select
                      value={settings.preferences.defaultTone}
                      onValueChange={(val) =>
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, defaultTone: val },
                        })
                      }
                    >
                      <SelectTrigger id="default-tone">
                        <SelectValue />
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
                    <Label htmlFor="default-length">Default Length</Label>
                    <Select
                      value={settings.preferences.defaultLength}
                      onValueChange={(val) =>
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, defaultLength: val },
                        })
                      }
                    >
                      <SelectTrigger id="default-length">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (~300 words)</SelectItem>
                        <SelectItem value="medium">Medium (~700 words)</SelectItem>
                        <SelectItem value="long">Long (~1500 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Default Language</Label>
                    <Select
                      value={settings.preferences.defaultLanguage}
                      onValueChange={(val) =>
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, defaultLanguage: val },
                        })
                      }
                    >
                      <SelectTrigger id="default-language">
                        <SelectValue />
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
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
