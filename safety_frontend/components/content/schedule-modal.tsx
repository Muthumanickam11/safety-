"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Calendar, Clock, Globe, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { setScheduleModalOpen, addToast } from "@/store/ui-slice"
import { contentApi } from "@/lib/api/content"
import type { RootState } from "@/store/store"

export function ScheduleModal() {
  const dispatch = useDispatch()
  const { isScheduleModalOpen } = useSelector((state: RootState) => state.ui)
  const { currentBlog } = useSelector((state: RootState) => state.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    platform: "twitter",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
  })

  const handleSchedule = async () => {
    if (!currentBlog) return

    setIsSubmitting(true)
    try {
      await contentApi.schedule({
        contentId: currentBlog.id || "temp-id",
        platform: formData.platform,
        scheduledDate: formData.date,
        scheduledTime: formData.time,
      })

      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Post Scheduled!",
          description: `Your post is set for ${formData.platform} on ${formData.date} at ${formData.time}.`,
        }),
      )
      dispatch(setScheduleModalOpen(false))
    } catch (error: any) {
      dispatch(
        addToast({
          id: Date.now().toString(),
          title: "Scheduling Failed",
          description: error.message,
          variant: "destructive",
        }),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isScheduleModalOpen} onOpenChange={(open) => dispatch(setScheduleModalOpen(open))}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
          <DialogDescription>Choose your platform and timing to automatically publish your content.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="platform" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Platform
            </Label>
            <Select value={formData.platform} onValueChange={(val) => setFormData({ ...formData, platform: val })}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">X (Twitter)</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => dispatch(setScheduleModalOpen(false))}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Scheduling...
              </>
            ) : (
              "Confirm Schedule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
