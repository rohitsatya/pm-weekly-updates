"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  Filter,
  Plus,
  Send,
  X,
  AtSign,
  MessageCircle,
  Reply,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

// Mock team members for mentions
const teamMembers = [
  { id: 1, name: "Sarah Chen", role: "Senior Designer", username: "sarah" },
  { id: 2, name: "Mike Rodriguez", role: "Backend Engineer", username: "mike" },
  { id: 3, name: "Emily Johnson", role: "Frontend Engineer", username: "emily" },
  { id: 4, name: "David Kim", role: "QA Engineer", username: "david" },
  { id: 5, name: "Lisa Wang", role: "Product Designer", username: "lisa" },
  { id: 6, name: "Tom Anderson", role: "DevOps Engineer", username: "tom" },
  { id: 7, name: "Rachel Green", role: "Data Analyst", username: "rachel" },
  { id: 8, name: "James Wilson", role: "Engineering Manager", username: "james" },
]

// Function to get current week range (Monday to Friday)
const getCurrentWeekRange = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)

  // Adjust to get Monday (0 = Sunday, 1 = Monday, etc.)
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  monday.setDate(today.getDate() + daysToMonday)

  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return `${formatDate(monday)} - ${formatDate(friday)}`
}

// Mock comments data
const mockComments = [
  {
    id: 1,
    updateId: 1,
    author: "Emily Johnson",
    content: "Great progress on the onboarding flow! The 40% improvement is impressive.",
    timestamp: "2 hours ago",
    replies: [
      {
        id: 2,
        author: "Alex Chen",
        content: "Thanks Emily! The team did amazing work on this.",
        timestamp: "1 hour ago",
      },
    ],
  },
  {
    id: 3,
    updateId: 1,
    author: "Mike Rodriguez",
    content: "I can help with the API performance issues mentioned in blockers.",
    timestamp: "1 hour ago",
    replies: [],
  },
]

// Mock went well / can improve data
const mockFeedback = [
  {
    id: 1,
    updateId: 1,
    type: "went-well",
    author: "Sarah Chen",
    content: "The cross-team collaboration was excellent this week",
    timestamp: "30 minutes ago",
  },
  {
    id: 2,
    updateId: 1,
    type: "can-improve",
    author: "David Kim",
    content: "We could improve our testing process to catch issues earlier",
    timestamp: "25 minutes ago",
  },
]

// Mock data for demonstration
const mockUpdates = [
  {
    id: 1,
    weekRange: "Dec 16-20, 2024",
    highlights:
      "Launched new user onboarding flow with 40% improvement in completion rates. Completed Q4 planning sessions with all stakeholders.",
    metrics: [
      { key: "User Signups", value: "1,247 (+15%)" },
      { key: "Feature Adoption", value: "68%" },
      { key: "Customer Satisfaction", value: "4.2/5" },
    ],
    blockers:
      "Waiting on legal approval for new privacy policy changes. Backend API performance issues affecting mobile app.",
    keyFocus:
      "Mobile performance optimization and user experience improvements. Focus on reducing app load times by 30%.",
    otherProgress: "Continuing work on design system documentation. Testing new analytics dashboard with beta users.",
    upcomingProjects:
      "Q1 mobile redesign project kicks off in January. Planning user research sessions for new feature discovery.",
    shoutouts: "Amazing work by @sarah on the design system updates and @mike for the quick API fixes!",
    miscellaneous: "Team holiday party planning is underway. New office space tour scheduled for next month.",
    tags: ["Q4 Planning", "Onboarding", "Mobile", "Performance"],
    author: "Alex Chen",
    date: "Dec 20, 2024",
  },
  {
    id: 2,
    weekRange: "Dec 9-13, 2024",
    highlights: "Completed user research interviews for Q1 roadmap. Shipped critical bug fixes for checkout flow.",
    metrics: [
      { key: "User Signups", value: "1,089 (+8%)" },
      { key: "Conversion Rate", value: "3.2%" },
      { key: "Support Tickets", value: "23 (-40%)" },
    ],
    blockers: "Delayed integration with payment provider. Need additional engineering resources for Q1 projects.",
    keyFocus: "Complete checkout flow testing and performance optimization.",
    otherProgress: "Working on Q1 capacity planning and team resource allocation.",
    upcomingProjects: "New payment integration project and mobile app performance improvements.",
    shoutouts: "Great collaboration between @emily and @david on the testing framework!",
    tags: ["Q1 Planning", "Checkout", "User Research", "Bug Fixes"],
    author: "Alex Chen",
    date: "Dec 13, 2024",
  },
  {
    id: 3,
    weekRange: "Dec 2-6, 2024",
    highlights: "Successfully migrated 80% of users to new dashboard. Positive feedback from early adopters.",
    metrics: [
      { key: "Migration Progress", value: "80%" },
      { key: "User Satisfaction", value: "4.1/5" },
    ],
    keyFocus: "Complete dashboard migration for remaining 20% of users.",
    shoutouts: "Kudos to @tom for the seamless deployment process and @rachel for the insightful analytics!",
    tags: ["Dashboard", "Migration", "User Experience"],
    author: "Alex Chen",
    date: "Dec 6, 2024",
  },
]

const availableTags = [
  "Q4 Planning",
  "Q1 Planning",
  "Onboarding",
  "Mobile",
  "Performance",
  "Checkout",
  "User Research",
  "Bug Fixes",
  "Design System",
  "API",
  "Analytics",
  "Dashboard",
  "Migration",
  "User Experience",
]

export default function WeeklyUpdates() {
  const [activeMode, setActiveMode] = useState<"form" | "feed">("form")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [formData, setFormData] = useState({
    highlights: "",
    metrics: [{ key: "", value: "" }],
    blockers: "",
    keyFocus: "",
    otherProgress: "",
    upcomingProjects: "",
    shoutouts: "",
    miscellaneous: "",
  })
  const [expandedUpdates, setExpandedUpdates] = useState<number[]>([])
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [comments, setComments] = useState(mockComments)
  const [feedback, setFeedback] = useState(mockFeedback)
  const [newComment, setNewComment] = useState("")
  const [newCommentAuthor, setNewCommentAuthor] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [newReply, setNewReply] = useState("")
  const [newReplyAuthor, setNewReplyAuthor] = useState("")
  const [showComments, setShowComments] = useState<number[]>([])
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [appFeedback, setAppFeedback] = useState("")
  const [appFeedbackName, setAppFeedbackName] = useState("")
  const [newWentWell, setNewWentWell] = useState("")
  const [newWentWellAuthor, setNewWentWellAuthor] = useState("")
  const [newCanImprove, setNewCanImprove] = useState("")
  const [newCanImproveAuthor, setNewCanImproveAuthor] = useState("")
  const [activeUpdateForFeedback, setActiveUpdateForFeedback] = useState<number | null>(null)

  // Mention functionality
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [activeField, setActiveField] = useState<string>("")
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})

  // Set document title
  useEffect(() => {
    document.title = "Communications Pod - Weekly Updates"
  }, [])

  const addMetric = () => {
    setFormData((prev) => ({
      ...prev,
      metrics: [...prev.metrics, { key: "", value: "" }],
    }))
  }

  const removeMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }))
  }

  const updateMetric = (index: number, field: "key" | "value", value: string) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics.map((metric, i) => (i === index ? { ...metric, [field]: value } : metric)),
    }))
  }

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setNewTag("")
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const toggleUpdateExpansion = (id: number) => {
    setExpandedUpdates((prev) => (prev.includes(id) ? prev.filter((updateId) => updateId !== id) : [...prev, id]))
  }

  const toggleComments = (updateId: number) => {
    setShowComments((prev) => (prev.includes(updateId) ? prev.filter((id) => id !== updateId) : [...prev, updateId]))
  }

  const addComment = (updateId: number) => {
    if (newComment.trim() && newCommentAuthor.trim()) {
      const comment = {
        id: Date.now(),
        updateId,
        author: newCommentAuthor,
        content: newComment,
        timestamp: "Just now",
        replies: [],
      }
      setComments([...comments, comment])
      setNewComment("")
      setNewCommentAuthor("")
    }
  }

  const addReply = (commentId: number) => {
    if (newReply.trim() && newReplyAuthor.trim()) {
      const reply = {
        id: Date.now(),
        author: newReplyAuthor,
        content: newReply,
        timestamp: "Just now",
      }
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
        ),
      )
      setNewReply("")
      setNewReplyAuthor("")
      setReplyingTo(null)
    }
  }

  const addFeedbackItem = (updateId: number, type: "went-well" | "can-improve") => {
    const content = type === "went-well" ? newWentWell : newCanImprove
    const author = type === "went-well" ? newWentWellAuthor : newCanImproveAuthor

    if (content.trim() && author.trim()) {
      const feedbackItem = {
        id: Date.now(),
        updateId,
        type,
        author,
        content,
        timestamp: "Just now",
      }
      setFeedback([...feedback, feedbackItem])

      if (type === "went-well") {
        setNewWentWell("")
        setNewWentWellAuthor("")
      } else {
        setNewCanImprove("")
        setNewCanImproveAuthor("")
      }
    }
  }

  const deleteUpdate = (updateId: number) => {
    // In a real app, this would make an API call
    console.log(`Deleting update ${updateId}`)
  }

  const submitAppFeedback = () => {
    if (appFeedback.trim() && appFeedbackName.trim()) {
      // In a real app, this would send feedback to the backend
      console.log("App feedback submitted:", { name: appFeedbackName, feedback: appFeedback })
      setAppFeedback("")
      setAppFeedbackName("")
      setFeedbackDialogOpen(false)
      // Show success message
      alert("Thank you for your feedback!")
    }
  }

  // Handle mention functionality
  const handleTextareaChange = (field: string, value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    const textarea = event.target
    const cursorPosition = textarea.selectionStart
    const textBeforeCursor = value.substring(0, cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf("@")

    if (lastAtIndex !== -1 && lastAtIndex === cursorPosition - 1) {
      // Just typed @
      const rect = textarea.getBoundingClientRect()
      setMentionPosition({ top: rect.bottom + 5, left: rect.left })
      setShowMentions(true)
      setMentionQuery("")
      setActiveField(field)
    } else if (lastAtIndex !== -1 && cursorPosition > lastAtIndex) {
      // Typing after @
      const query = textBeforeCursor.substring(lastAtIndex + 1)
      if (query.includes(" ")) {
        setShowMentions(false)
      } else {
        setMentionQuery(query)
        setShowMentions(true)
        setActiveField(field)
      }
    } else {
      setShowMentions(false)
    }
  }

  const insertMention = (member: (typeof teamMembers)[0]) => {
    const currentValue = formData[activeField as keyof typeof formData] as string
    const textarea = textareaRefs.current[activeField]

    if (textarea) {
      const cursorPosition = textarea.selectionStart
      const textBeforeCursor = currentValue.substring(0, cursorPosition)
      const textAfterCursor = currentValue.substring(cursorPosition)
      const lastAtIndex = textBeforeCursor.lastIndexOf("@")

      const newValue = textBeforeCursor.substring(0, lastAtIndex) + `@${member.username} ` + textAfterCursor

      setFormData((prev) => ({ ...prev, [activeField]: newValue }))
      setShowMentions(false)
    }
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(mentionQuery.toLowerCase()),
  )

  const filteredUpdates = mockUpdates.filter(
    (update) => filterTags.length === 0 || filterTags.some((tag) => update.tags.includes(tag)),
  )

  // Helper function to check if a field has content
  const hasContent = (value: string | { key: string; value: string }[]) => {
    if (Array.isArray(value)) {
      return value.some((item) => item.key.trim() || item.value.trim())
    }
    return value && value.trim().length > 0
  }

  const getCommentsForUpdate = (updateId: number) => {
    return comments.filter((comment) => comment.updateId === updateId)
  }

  const getFeedbackForUpdate = (updateId: number, type: "went-well" | "can-improve") => {
    return feedback.filter((item) => item.updateId === updateId && item.type === type)
  }

  useEffect(() => {
    const handleClickOutside = () => setShowMentions(false)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Weekly Team Updates</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Create and manage weekly progress updates for your team
              </p>
            </div>
            <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="self-start sm:self-auto">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  App Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Your Feedback</DialogTitle>
                  <DialogDescription>
                    Help us improve the Communications Pod. Your feedback is valuable!
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="feedback-name">Your Name</Label>
                    <Input
                      id="feedback-name"
                      value={appFeedbackName}
                      onChange={(e) => setAppFeedbackName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="feedback-content">Feedback</Label>
                    <Textarea
                      id="feedback-content"
                      value={appFeedback}
                      onChange={(e) => setAppFeedback(e.target.value)}
                      placeholder="Share your thoughts, suggestions, or report issues..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitAppFeedback}>Submit Feedback</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 w-full sm:w-auto">
            <Button
              variant={activeMode === "form" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveMode("form")}
              className="rounded-md flex-1 sm:flex-none"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Create Update
            </Button>
            <Button
              variant={activeMode === "feed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveMode("feed")}
              className="rounded-md flex-1 sm:flex-none"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Updates
            </Button>
          </div>
        </div>

        {activeMode === "form" ? (
          <div className="max-w-2xl mx-auto">
            {/* Submission Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Weekly Update - {getCurrentWeekRange()}</CardTitle>
                <CardDescription>Fill out your weekly progress update (all fields are optional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Highlights */}
                <div className="space-y-2">
                  <Label htmlFor="highlights">🔥 Highlights</Label>
                  <Textarea
                    ref={(el) => (textareaRefs.current.highlights = el)}
                    id="highlights"
                    placeholder="What were the key wins and accomplishments this week?"
                    value={formData.highlights}
                    onChange={(e) => handleTextareaChange("highlights", e.target.value, e)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  <Label>📊 Key Metrics</Label>
                  {formData.metrics.map((metric, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Metric name"
                        value={metric.key}
                        onChange={(e) => updateMetric(index, "key", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={metric.value}
                        onChange={(e) => updateMetric(index, "value", e.target.value)}
                        className="flex-1"
                      />
                      {formData.metrics.length > 1 && (
                        <Button variant="outline" size="icon" onClick={() => removeMetric(index)} className="shrink-0">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addMetric} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Metric
                  </Button>
                </div>

                {/* Blockers */}
                <div className="space-y-2">
                  <Label htmlFor="blockers">🚧 Blockers & Risks</Label>
                  <Textarea
                    ref={(el) => (textareaRefs.current.blockers = el)}
                    id="blockers"
                    placeholder="What's blocking progress or creating risk?"
                    value={formData.blockers}
                    onChange={(e) => handleTextareaChange("blockers", e.target.value, e)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Key Focus */}
                <div className="space-y-2">
                  <Label htmlFor="key-focus">🎯 Key Focus</Label>
                  <Textarea
                    ref={(el) => (textareaRefs.current.keyFocus = el)}
                    id="key-focus"
                    placeholder="What are the main priorities and focus areas?"
                    value={formData.keyFocus}
                    onChange={(e) => handleTextareaChange("keyFocus", e.target.value, e)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Other Things in Progress */}
                <div className="space-y-2">
                  <Label htmlFor="other-progress">⚙️ Other Things in Progress</Label>
                  <Textarea
                    ref={(el) => (textareaRefs.current.otherProgress = el)}
                    id="other-progress"
                    placeholder="What other work is ongoing or in progress?"
                    value={formData.otherProgress}
                    onChange={(e) => handleTextareaChange("otherProgress", e.target.value, e)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Upcoming Projects */}
                <div className="space-y-2">
                  <Label htmlFor="upcoming-projects">🚀 Upcoming Projects</Label>
                  <Textarea
                    ref={(el) => (textareaRefs.current.upcomingProjects = el)}
                    id="upcoming-projects"
                    placeholder="What projects are coming up or being planned?"
                    value={formData.upcomingProjects}
                    onChange={(e) => handleTextareaChange("upcomingProjects", e.target.value, e)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Shoutouts */}
                <div className="space-y-2">
                  <Label htmlFor="shoutouts">👏 Shoutouts</Label>
                  <Textarea
                    ref={(el) => (textareaRefs.current.shoutouts = el)}
                    id="shoutouts"
                    placeholder="Recognize team members and great work (use @username to mention)"
                    value={formData.shoutouts}
                    onChange={(e) => handleTextareaChange("shoutouts", e.target.value, e)}
                    rows={2}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    <AtSign className="w-3 h-3 inline mr-1" />
                    Type @ to mention team members
                  </p>
                </div>

                {/* Miscellaneous */}
                <div className="space-y-2">
                  <Label htmlFor="miscellaneous">📝 Miscellaneous</Label>
                  <Textarea
                    ref={(el) => (textareaRefs.current.miscellaneous = el)}
                    id="miscellaneous"
                    placeholder="Any other updates, notes, or information to share"
                    value={formData.miscellaneous}
                    onChange={(e) => handleTextareaChange("miscellaneous", e.target.value, e)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>🏷️ Tags (Optional)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select onValueChange={addTag}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Add tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags
                          .filter((tag) => !selectedTags.includes(tag))
                          .map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      <Input
                        placeholder="Custom tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTag(newTag)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" onClick={() => addTag(newTag)} className="shrink-0">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Update
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Update Feed */
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Label className="text-sm">Filter by tags:</Label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={filterTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => {
                          setFilterTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {filterTags.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setFilterTags([])}>
                      Clear filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Updates List */}
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <Card key={update.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">📅 {update.weekRange}</CardTitle>
                        <CardDescription>
                          By {update.author} • {update.date}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:flex gap-1">
                          {update.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {update.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{update.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleComments(update.id)}
                            className="text-xs"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {getCommentsForUpdate(update.id).length}
                          </Button>
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => toggleUpdateExpansion(update.id)}>
                                {expandedUpdates.includes(update.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Update</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this weekly update? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUpdate(update.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                    {/* Mobile tags */}
                    <div className="flex sm:hidden gap-1 flex-wrap">
                      {update.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {update.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{update.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <Collapsible open={expandedUpdates.includes(update.id)}>
                    <CollapsibleContent>
                      <CardContent className="space-y-4">
                        {/* Highlights */}
                        {hasContent(update.highlights) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">🔥 Highlights</h4>
                              <p className="text-gray-900 text-sm sm:text-base">{update.highlights}</p>
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Metrics */}
                        {hasContent(update.metrics) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">📊 Key Metrics</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {update.metrics
                                  .filter((metric) => metric.key.trim() || metric.value.trim())
                                  .map((metric, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                                      <div className="text-xs sm:text-sm text-gray-600">{metric.key}</div>
                                      <div className="text-base sm:text-lg font-semibold text-gray-900">
                                        {metric.value}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Blockers */}
                        {hasContent(update.blockers) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">🚧 Blockers & Risks</h4>
                              <p className="text-gray-900 text-sm sm:text-base">{update.blockers}</p>
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Key Focus */}
                        {hasContent(update.keyFocus) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">🎯 Key Focus</h4>
                              <p className="text-gray-900 text-sm sm:text-base">{update.keyFocus}</p>
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Other Progress */}
                        {hasContent(update.otherProgress) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">⚙️ Other Things in Progress</h4>
                              <p className="text-gray-900 text-sm sm:text-base">{update.otherProgress}</p>
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Upcoming Projects */}
                        {hasContent(update.upcomingProjects) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">🚀 Upcoming Projects</h4>
                              <p className="text-gray-900 text-sm sm:text-base">{update.upcomingProjects}</p>
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Shoutouts */}
                        {hasContent(update.shoutouts) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">👏 Shoutouts</h4>
                              <p className="text-gray-900 text-sm sm:text-base">{update.shoutouts}</p>
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Miscellaneous */}
                        {hasContent(update.miscellaneous) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">📝 Miscellaneous</h4>
                              <p className="text-gray-900 text-sm sm:text-base">{update.miscellaneous}</p>
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* What Went Well & Can Improve */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* What Went Well */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                              <ThumbsUp className="w-4 h-4" />
                              What Went Well
                            </h4>
                            <div className="space-y-2">
                              {getFeedbackForUpdate(update.id, "went-well").map((item) => (
                                <div key={item.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <p className="text-sm text-gray-900">{item.content}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    — {item.author} • {item.timestamp}
                                  </p>
                                </div>
                              ))}
                              <div className="space-y-2">
                                <Input
                                  placeholder="Your name"
                                  value={newWentWellAuthor}
                                  onChange={(e) => setNewWentWellAuthor(e.target.value)}
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="What went well this week?"
                                    value={newWentWell}
                                    onChange={(e) => setNewWentWell(e.target.value)}
                                    className="flex-1 text-sm"
                                    onKeyPress={(e) => e.key === "Enter" && addFeedbackItem(update.id, "went-well")}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => addFeedbackItem(update.id, "went-well")}
                                    disabled={!newWentWell.trim() || !newWentWellAuthor.trim()}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* What Can Improve */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                              <ThumbsDown className="w-4 h-4" />
                              What Can Be Improved
                            </h4>
                            <div className="space-y-2">
                              {getFeedbackForUpdate(update.id, "can-improve").map((item) => (
                                <div key={item.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                  <p className="text-sm text-gray-900">{item.content}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    — {item.author} • {item.timestamp}
                                  </p>
                                </div>
                              ))}
                              <div className="space-y-2">
                                <Input
                                  placeholder="Your name"
                                  value={newCanImproveAuthor}
                                  onChange={(e) => setNewCanImproveAuthor(e.target.value)}
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="What could be improved?"
                                    value={newCanImprove}
                                    onChange={(e) => setNewCanImprove(e.target.value)}
                                    className="flex-1 text-sm"
                                    onKeyPress={(e) => e.key === "Enter" && addFeedbackItem(update.id, "can-improve")}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => addFeedbackItem(update.id, "can-improve")}
                                    disabled={!newCanImprove.trim() || !newCanImproveAuthor.trim()}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end pt-2">
                          <div className="flex gap-1 flex-wrap">
                            {update.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Comments Section */}
                  <Collapsible open={showComments.includes(update.id)}>
                    <CollapsibleContent>
                      <CardContent className="border-t bg-gray-50">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Comments ({getCommentsForUpdate(update.id).length})
                          </h4>

                          {/* Existing Comments */}
                          <div className="space-y-3">
                            {getCommentsForUpdate(update.id).map((comment) => (
                              <div key={comment.id} className="space-y-2">
                                <div className="bg-white rounded-lg p-3 border">
                                  <p className="text-sm text-gray-900">{comment.content}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-gray-500">
                                      {comment.author} • {comment.timestamp}
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                      className="text-xs"
                                    >
                                      <Reply className="w-3 h-3 mr-1" />
                                      Reply
                                    </Button>
                                  </div>
                                </div>

                                {/* Replies */}
                                {comment.replies.length > 0 && (
                                  <div className="ml-6 space-y-2">
                                    {comment.replies.map((reply) => (
                                      <div key={reply.id} className="bg-white rounded-lg p-3 border border-gray-200">
                                        <p className="text-sm text-gray-900">{reply.content}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                          {reply.author} • {reply.timestamp}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Reply Form */}
                                {replyingTo === comment.id && (
                                  <div className="ml-6 space-y-2">
                                    <Input
                                      placeholder="Your name"
                                      value={newReplyAuthor}
                                      onChange={(e) => setNewReplyAuthor(e.target.value)}
                                      className="text-sm"
                                    />
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="Write a reply..."
                                        value={newReply}
                                        onChange={(e) => setNewReply(e.target.value)}
                                        className="flex-1 text-sm"
                                        onKeyPress={(e) => e.key === "Enter" && addReply(comment.id)}
                                      />
                                      <Button
                                        size="sm"
                                        onClick={() => addReply(comment.id)}
                                        disabled={!newReply.trim() || !newReplyAuthor.trim()}
                                      >
                                        Reply
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* New Comment Form */}
                          <div className="space-y-2">
                            <Input
                              placeholder="Your name"
                              value={newCommentAuthor}
                              onChange={(e) => setNewCommentAuthor(e.target.value)}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 text-sm"
                                onKeyPress={(e) => e.key === "Enter" && addComment(update.id)}
                              />
                              <Button
                                size="sm"
                                onClick={() => addComment(update.id)}
                                disabled={!newComment.trim() || !newCommentAuthor.trim()}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Mention Dropdown */}
        {showMentions && (
          <div
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto w-64"
            style={{ top: mentionPosition.top, left: mentionPosition.left }}
          >
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => insertMention(member)}
                >
                  <div className="font-medium text-sm">@{member.username}</div>
                  <div className="text-xs text-gray-500">
                    {member.name} • {member.role}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">No members found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
