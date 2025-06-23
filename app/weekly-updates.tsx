"use client";

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
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import styles from './weekly-updates.module.css';
import Image from 'next/image';

const MDPreview = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default.Markdown), { ssr: false })
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

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
// const mockComments = [
//   {
//     id: 1,
//     updateId: 1,
//     author: "Emily Johnson",
//     content: "Great progress on the onboarding flow! The 40% improvement is impressive.",
//     timestamp: "2 hours ago",
//     replies: [
//       {
//         id: 2,
//         author: "Alex Chen",
//         content: "Thanks Emily! The team did amazing work on this.",
//         timestamp: "1 hour ago",
//       },
//     ],
//   },
//   {
//     id: 3,
//     updateId: 1,
//     author: "Mike Rodriguez",
//     content: "I can help with the API performance issues mentioned in blockers.",
//     timestamp: "1 hour ago",
//     replies: [],
//   },
// ]

// Mock went well / can improve data
// const mockFeedback = [
//   {
//     id: 1,
//     updateId: 1,
//     type: "went-well",
//     author: "Sarah Chen",
//     content: "The cross-team collaboration was excellent this week",
//     timestamp: "30 minutes ago",
//   },
//   {
//     id: 2,
//     updateId: 1,
//     type: "can-improve",
//     author: "David Kim",
//     content: "We could improve our testing process to catch issues earlier",
//     timestamp: "25 minutes ago",
//   },
// ]

// Mock data for demonstration
// const mockUpdates = [
//   {
//     id: 1,
//     weekRange: "Dec 16-20, 2024",
//     highlights:
//       "Launched new user onboarding flow with 40% improvement in completion rates. Completed Q4 planning sessions with all stakeholders.",
//     metrics: [
//       { key: "User Signups", value: "1,247 (+15%)" },
//       { key: "Feature Adoption", value: "68%" },
//       { key: "Customer Satisfaction", value: "4.2/5" },
//     ],
//     blockers:
//       "Waiting on legal approval for new privacy policy changes. Backend API performance issues affecting mobile app.",
//     keyFocus:
//       "Mobile performance optimization and user experience improvements. Focus on reducing app load times by 30%.",
//     otherProgress: "Continuing work on design system documentation. Testing new analytics dashboard with beta users.",
//     upcomingProjects:
//       "Q1 mobile redesign project kicks off in January. Planning user research sessions for new feature discovery.",
//     shoutouts: "Amazing work by @sarah on the design system updates and @mike for the quick API fixes!",
//     miscellaneous: "Team holiday party planning is underway. New office space tour scheduled for next month.",
//     tags: ["Q4 Planning", "Onboarding", "Mobile", "Performance"],
//     author: "Alex Chen",
//     date: "Dec 20, 2024",
//   },
//   {
//     id: 2,
//     weekRange: "Dec 9-13, 2024",
//     highlights: "Completed user research interviews for Q1 roadmap. Shipped critical bug fixes for checkout flow.",
//     metrics: [
//       { key: "User Signups", value: "1,089 (+8%)" },
//       { key: "Conversion Rate", value: "3.2%" },
//       { key: "Support Tickets", value: "23 (-40%)" },
//     ],
//     blockers: "Delayed integration with payment provider. Need additional engineering resources for Q1 projects.",
//     keyFocus: "Complete checkout flow testing and performance optimization.",
//     otherProgress: "Working on Q1 capacity planning and team resource allocation.",
//     upcomingProjects: "New payment integration project and mobile app performance improvements.",
//     shoutouts: "Great collaboration between @emily and @david on the testing framework!",
//     tags: ["Q1 Planning", "Checkout", "User Research", "Bug Fixes"],
//     author: "Alex Chen",
//     date: "Dec 13, 2024",
//   },
//   {
//     id: 3,
//     weekRange: "Dec 2-6, 2024",
//     highlights: "Successfully migrated 80% of users to new dashboard. Positive feedback from early adopters.",
//     metrics: [
//       { key: "Migration Progress", value: "80%" },
//       { key: "User Satisfaction", value: "4.1/5" },
//     ],
//     keyFocus: "Complete dashboard migration for remaining 20% of users.",
//     shoutouts: "Kudos to @tom for the seamless deployment process and @rachel for the insightful analytics!",
//     tags: ["Dashboard", "Migration", "User Experience"],
//     author: "Alex Chen",
//     date: "Dec 6, 2024",
//   },
// ]

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

type Reply = {
  id: number;
  comment_id: number;
  author: string;
  content: string;
  created_at?: string;
  parent_reply_id: string | null;
};

type Comment = {
  id: number;
  update_id: number;
  author: string;
  content: string;
  created_at?: string;
  replies: Reply[];
};

type Feedback = {
  id: number;
  update_id: string;
  type: "went-well" | "can-improve";
  author: string;
  content: string;
  timestamp: string;
};

export default function WeeklyUpdates() {
  const [activeMode, setActiveMode] = useState<"form" | "feed">("form")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [formData, setFormData] = useState({
    author: "",
    highlights: "",
    metrics: [{ key: "", value: "" }],
    blockers: "",
    keyFocus: "",
    otherProgress: "",
    upcomingProjects: "",
    shoutouts: "",
    miscellaneous: "",
  })
  const [expandedUpdates, setExpandedUpdates] = useState<any[]>([])
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
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

  // Add a new state for updates
  const [updates, setUpdates] = useState<any[]>([])

  // Add a new state for replies
  const [replies, setReplies] = useState<Reply[]>([])

  // Add a new state for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [updateIdToDelete, setUpdateIdToDelete] = useState<number | null>(null)

  // Fetch comments from API
  async function fetchComments() {
    try {
      const response = await fetch('/api/weekly-updates/comments');
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setComments([]);
    }
  }

  // Fetch replies from API
  async function fetchReplies() {
    const response = await fetch('/api/weekly-updates/comments/replies');
    if (response.ok) {
      setReplies(await response.json());
    }
  }

  // Fetch feedback from API
  async function fetchFeedback() {
    try {
      const response = await fetch('/api/weekly-updates/feedback');
      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setFeedback([]);
    }
  }

  // Set document title and fetch updates/comments on mount
  useEffect(() => {
    document.title = "Weekly Updates";
    fetchWeeklyUpdates().then(x => {
      setUpdates(x);
      if (x && x.length > 0) {
        setTimeout(() => {
          toggleUpdateExpansion(x[0].id);
        }, 100);
      } else {
        setExpandedUpdates([]);
      }
    });
    fetchComments();
    fetchReplies();
    fetchFeedback();
  }, []);

  const filteredUpdates = updates.filter(
    (update) => filterTags.length === 0 || filterTags.some((tag) => update.tags.includes(tag)),
  )

  useEffect(() => {
    if (
      activeMode === "feed" &&
      expandedUpdates.length === 0 &&
      filteredUpdates.length > 0
    ) {
      setExpandedUpdates([filteredUpdates[0].id]);
    }
    if (activeMode !== "feed" && expandedUpdates.length > 0) {
      setExpandedUpdates([]);
    }
    // eslint-disable-next-line
  }, [activeMode, filteredUpdates.length]);

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

  const addComment = async (updateId: number) => {
    if (newComment.trim() && newCommentAuthor.trim()) {
      const commentData = {
        updateId,
        author: newCommentAuthor,
        content: newComment,
      };
      try {
        const response = await fetch('/api/weekly-updates/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(commentData),
        });
        if (!response.ok) {
          const error = await response.json();
          alert('Error: ' + error.error);
          return;
        }
        // Refetch comments after successful submit
        await fetchComments();
        setNewComment("");
        setNewCommentAuthor("");
      } catch (err) {
        alert('Failed to submit comment.');
      }
    }
  }

  const addReply = async (commentId: number) => {
    if (newReply.trim() && newReplyAuthor.trim()) {
      try {
        await fetch('/api/weekly-updates/comments/replies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            commentId,
            author: newReplyAuthor,
            content: newReply,
          }),
        });
        await fetchReplies(); // Refetch all replies from backend
        setNewReply('');
        setNewReplyAuthor('');
        setReplyingTo(null);
      } catch (err) {
        alert('Failed to submit reply.');
      }
    }
  }

  const addFeedbackItem = async (updateId: string, type: "went-well" | "can-improve") => {
    const content = type === "went-well" ? newWentWell : newCanImprove;
    const author = type === "went-well" ? newWentWellAuthor : newCanImproveAuthor;
    if (content.trim() && author.trim()) {
      try {
        const response = await fetch('/api/weekly-updates/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ update_id: updateId, type, author, content }),
        });
        if (!response.ok) {
          const error = await response.json();
          alert('Error: ' + error.error);
          return;
        }
        await fetchFeedback();
        if (type === "went-well") {
          setNewWentWell("");
          setNewWentWellAuthor("");
        } else {
          setNewCanImprove("");
          setNewCanImproveAuthor("");
        }
      } catch (err) {
        alert('Failed to submit feedback.');
      }
    }
  };

  const deleteUpdate = async (updateId: number) => {
    // Call the API to delete the update
    try {
      const response = await fetch(`/api/weekly-updates?id=${updateId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        alert('Error: ' + error.error);
        return;
      }
      alert('Update deleted!');
      fetchWeeklyUpdates().then(setUpdates);
    } catch (err) {
      alert('Failed to delete update.');
    }
  }

  const submitAppFeedback = async () => {
    if (appFeedback.trim() && appFeedbackName.trim()) {
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: appFeedbackName, feedback: appFeedback }),
        });
        if (!response.ok) {
          const error = await response.json();
          alert('Error: ' + error.error);
          return;
        }
        setAppFeedback("");
        setAppFeedbackName("");
        setFeedbackDialogOpen(false);
        alert("Thank you for your feedback!");
      } catch (err) {
        alert('Failed to submit feedback.');
      }
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

  // Helper function to check if a field has content
  const hasContent = (value: string | { key: string; value: string }[]) => {
    if (Array.isArray(value)) {
      return value.some((item) => item.key.trim() || item.value.trim())
    }
    return value && value.trim().length > 0
  }

  const getCommentsForUpdate = (updateId: number) => {
    return comments.filter((comment) => comment.update_id === updateId);
  }

  const getFeedbackForUpdate = (updateId: string, type: "went-well" | "can-improve") => {
    return feedback.filter((item) => item.update_id === updateId && item.type === type);
  }

  useEffect(() => {
    const handleClickOutside = () => setShowMentions(false)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const [showUpdateDialog, setShowUpdateDialog] = useState(false)

  // On successful submit, reset form and close dialog
  async function submitWeeklyUpdate(formData: any) {
    const response = await fetch('/api/weekly-updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Handle error
      const error = await response.json();
      alert('Error: ' + error.error);
      return;
    }

    const data = await response.json();
    // Optionally reset form or show success
    alert('Update submitted!');

    fetchWeeklyUpdates().then(setUpdates);
    setFormData({
      author: "",
      highlights: "",
      metrics: [{ key: "", value: "" }],
      blockers: "",
      keyFocus: "",
      otherProgress: "",
      upcomingProjects: "",
      shoutouts: "",
      miscellaneous: "",
    });
    setSelectedTags([]);
    setShowUpdateDialog(false);
    return data;
  }

  async function fetchWeeklyUpdates() {
    const response = await fetch('/api/weekly-updates');
    if (!response.ok) {
      // Handle error
      const error = await response.json();
      alert('Error: ' + error.error);
      return [];
    }
    const data = await response.json();
    console.log("data",data);
    return data; // Array of updates
  }

  function getMondayDateString() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }

  function getFridayDateString() {
    const monday = new Date(getMondayDateString());
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    return friday.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }

  // Format date as 'DD MMM'
  function formatDateDM(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  }

  // When fetching comments, map replies to their parent comment:
  const commentsWithReplies = comments.map(comment => ({
    ...comment,
    replies: replies.filter(reply => reply.comment_id === comment.id),
  }));

  function renderRepliesForComment(commentId: string, allReplies: Reply[], parentId: string | null = null, level = 0) {
    // Get replies to this comment or reply
    const children = allReplies.filter(r => String(r.comment_id) === commentId && String(r.parent_reply_id) === String(parentId));
    if (children.length === 0) return null;
    return (
      <div className={level > 0 ? `ml-6 space-y-2` : ''}>
        {children.map(reply => (
          <div key={reply.id} className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-900">{reply.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {reply.author} • {reply.created_at ? new Date(reply.created_at).toLocaleString() : ''}
            </p>
            {/* Only render one more level of replies */}
            {level === 0 && renderRepliesForComment(String(reply.comment_id), allReplies, String(reply.id), 1)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/comms pod.png" alt="Comms Pod Logo" width={40} height={40} className="rounded" priority />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Communications Pod - Weekly Updates</h1>
              </div>
              {/* <p className="text-gray-600 text-sm sm:text-base">
                Create and manage weekly progress updates for your team
              </p> */}
            </div>
            <div className="flex gap-2">
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
              <Button variant="default" size="sm" onClick={() => setShowUpdateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Update
              </Button>
            </div>
          </div>
        </div>

        {/* Add Update Dialog */}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Weekly Update - {getCurrentWeekRange()}</DialogTitle>
              <DialogDescription>Fill out your weekly progress update </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pl-2 pr-2">
              {/* Author (Your Name) */}
              <div className="space-y-2">
                <Label htmlFor="author">Your Name <span className="text-red-500">*</span></Label>
                <Input
                  id="author"
                  placeholder="Enter your name"
                  value={formData.author}
                  onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  required
                  className="px-3 py-2 focus:outline-none"
                />
              </div>
              {/* Highlights */}
              <div className="space-y-2">
                <Label htmlFor="highlights">🔥 Highlights</Label>
                <MDEditor value={formData.highlights} onChange={val => setFormData(prev => ({ ...prev, highlights: val || '' }))} />
                <MDPreview source={formData.highlights} className={styles['wmde-markdown']} />
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
                      className="flex-1 px-3 py-2 focus:outline-none"
                    />
                    <Input
                      placeholder="Value"
                      value={metric.value}
                      onChange={(e) => updateMetric(index, "value", e.target.value)}
                      className="flex-1 px-3 py-2 focus:outline-none"
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
                <MDEditor value={formData.blockers} onChange={val => setFormData(prev => ({ ...prev, blockers: val || '' }))} />
                <MDPreview source={formData.blockers} className={styles['wmde-markdown']} />
              </div>
              {/* Key Focus */}
              <div className="space-y-2">
                <Label htmlFor="key-focus">🎯 Key Focus</Label>
                <MDEditor value={formData.keyFocus} onChange={val => setFormData(prev => ({ ...prev, keyFocus: val || '' }))} />
                <MDPreview source={formData.keyFocus} className={styles['wmde-markdown']} />
              </div>
              {/* Other Things in Progress */}
              <div className="space-y-2">
                <Label htmlFor="other-progress">⚙️ Other Things in Progress</Label>
                <MDEditor value={formData.otherProgress} onChange={val => setFormData(prev => ({ ...prev, otherProgress: val || '' }))} />
                <MDPreview source={formData.otherProgress} className={styles['wmde-markdown']} />
              </div>
              {/* Upcoming Projects */}
              <div className="space-y-2">
                <Label htmlFor="upcoming-projects">🚀 Upcoming Projects</Label>
                <MDEditor value={formData.upcomingProjects} onChange={val => setFormData(prev => ({ ...prev, upcomingProjects: val || '' }))} />
                <MDPreview source={formData.upcomingProjects} className={styles['wmde-markdown']} />
              </div>
              {/* Shoutouts */}
              <div className="space-y-2">
                <Label htmlFor="shoutouts">👏 Shoutouts</Label>
                <MDEditor value={formData.shoutouts} onChange={val => setFormData(prev => ({ ...prev, shoutouts: val || '' }))} />
                <MDPreview source={formData.shoutouts} className={styles['wmde-markdown']} />
              </div>
              {/* Miscellaneous */}
              <div className="space-y-2">
                <Label htmlFor="miscellaneous">📝 Miscellaneous</Label>
                <MDEditor value={formData.miscellaneous} onChange={val => setFormData(prev => ({ ...prev, miscellaneous: val || '' }))} />
                <MDPreview source={formData.miscellaneous} className={styles['wmde-markdown']} />
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
                      className="flex-1 px-3 py-2 focus:outline-none"
                    />
                    <Button variant="outline" size="icon" onClick={() => addTag(newTag)} className="shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => submitWeeklyUpdate({
                  start_date: getMondayDateString(),
                  end_date: getFridayDateString(),
                  author: formData.author,
                  highlights: formData.highlights,
                  key_metrics: formData.metrics,
                  blockers: formData.blockers,
                  key_focus: formData.keyFocus,
                  other_progress: formData.otherProgress,
                  upcoming: formData.upcomingProjects,
                  shoutouts: formData.shoutouts,
                  misc: formData.miscellaneous,
                  tags: selectedTags,
                })}
                disabled={!formData.author.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Updates Feed (always visible) */}
        <div className="space-y-6">
          {/* Filters */}
          {/* <Card>
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
          </Card> */}

          {/* Updates List */}
          <div className="space-y-4">
            {filteredUpdates.map((update, idx) => (
              update && update.start_date ? (
                <Card key={update.id ?? idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">
                          📅 {formatDateDM(update.start_date)} - {formatDateDM(update.end_date)}
                        </CardTitle>
                        <CardDescription>
                          By {update.author}
                        </CardDescription>
                        {/* Collapsed summary */}
                        {!expandedUpdates.includes(update.id) && (
                          <div className="mt-2 space-y-1 text-xs text-gray-700">
                            {update.highlights && (
                              <div><span className="font-semibold">Highlights:</span> {update.highlights.slice(0, 100)}{update.highlights.length > 100 ? '…' : ''}</div>
                            )}
                            {update.key_focus && (
                              <div><span className="font-semibold">Key Focus:</span> {update.key_focus.slice(0, 100)}{update.key_focus.length > 100 ? '…' : ''}</div>
                            )}
                            {update.blockers && (
                              <div><span className="font-semibold">Blockers:</span> {update.blockers.slice(0, 100)}{update.blockers.length > 100 ? '…' : ''}</div>
                            )}
                            {/* What Went Well/Can Improve summary */}
                            {(() => {
                              const wentWell = getFeedbackForUpdate(update.id, "went-well")[0];
                              const canImprove = getFeedbackForUpdate(update.id, "can-improve")[0];
                              return (
                                <>
                                  {wentWell && (
                                    <div><span className="font-semibold">What Went Well:</span> {wentWell.content.slice(0, 60)}{wentWell.content.length > 60 ? '…' : ''}</div>
                                  )}
                                  {canImprove && (
                                    <div><span className="font-semibold">Can Improve:</span> {canImprove.content.slice(0, 60)}{canImprove.content.length > 60 ? '…' : ''}</div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:flex gap-1">
                          {update.tags && update.tags.slice(0, 3).map((tag: string, tagIdx: number) => (
                            <Badge key={tag ?? tagIdx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {update.tags && update.tags.length > 3 && (
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
                            {commentsWithReplies.filter(comment => comment.update_id === update.id).length}
                          </Button>
                          {/* Dropdown menu for card actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-700">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700"
                                onClick={() => {
                                  setUpdateIdToDelete(update.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                    {/* Mobile tags */}
                    <div className="flex sm:hidden gap-1 flex-wrap">
                      {update.tags && update.tags.slice(0, 3).map((tag: string, tagIdx: number) => (
                        <Badge key={tag ?? tagIdx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {update.tags && update.tags.length > 3 && (
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
                              <MDPreview source={update.highlights} className={styles['wmde-markdown']} />
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Metrics */}
                        {hasContent(update.key_metrics) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">📊 Key Metrics</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {update.key_metrics
                                  .filter((metric: { key: string; value: string }) => metric.key.trim() || metric.value.trim())
                                  .map((metric: { key: string; value: string }, index: number) => (
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
                              <MDPreview source={update.blockers} className={styles['wmde-markdown']} />
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Key Focus */}
                        {hasContent(update.key_focus) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">🎯 Key Focus</h4>
                              <MDPreview source={update.key_focus} className={styles['wmde-markdown']} />
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Other Progress */}
                        {hasContent(update.other_progress) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">⚙️ Other Things in Progress</h4>
                              <MDPreview source={update.other_progress} className={styles['wmde-markdown']} />
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Upcoming Projects */}
                        {hasContent(update.upcoming) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">🚀 Upcoming Projects</h4>
                              <MDPreview source={update.upcoming} className={styles['wmde-markdown']} />
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Shoutouts */}
                        {hasContent(update.shoutouts) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">👏 Shoutouts</h4>
                              <MDPreview source={update.shoutouts} className={styles['wmde-markdown']} />
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Miscellaneous */}
                        {hasContent(update.misc) && (
                          <>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">📝 Miscellaneous</h4>
                              <MDPreview source={update.misc} className={styles['wmde-markdown']} />
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
                          

                          {/* Footer */}
                          {/* <div className="flex items-center justify-end pt-2">
                            <div className="flex gap-1 flex-wrap">
                              {update.tags && update.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div> */}
                        </div>

                        {/* Comments Section */}
                        <Collapsible open={showComments.includes(update.id)}>
                          <CollapsibleContent>
                            <CardContent className="border-t bg-gray-50">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2 pt-4">
                                  <MessageCircle className="w-4 h-4" />
                                  Comments ({commentsWithReplies.filter(comment => comment.update_id === update.id).length})
                                </h4>

                                {/* Existing Comments */}
                                <div className="space-y-3">
                                  {commentsWithReplies.filter(comment => comment.update_id === update.id).map((comment) => {
                                    const replies = comment.replies || [];
                                    return (
                                      <div key={comment.id} className="space-y-2">
                                        <div className="bg-white rounded-lg p-3 border">
                                          <p className="text-sm text-gray-900">{comment.content}</p>
                                          <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-gray-500">
                                              {comment.author} • {comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}
                                            </p>
                                            {/* <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                              className="text-xs"
                                            >
                                              <Reply className="w-3 h-3 mr-1" />
                                              Reply
                                            </Button> */}
                                          </div>
                                        </div>
                                        {/* Replies */}
                                        {renderRepliesForComment(String(comment.id), replies)}
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
                                    );
                                  })}
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
                      </CardContent>
                    </CollapsibleContent>
                    {/* View More/View Less Button at the bottom */}
                    <div className="px-6 pb-4 pt-2">
                      <Button
                        variant="outline"
                        className="w-full font-semibold text-blue-700 border-blue-200 hover:bg-blue-50"
                        onClick={() => toggleUpdateExpansion(update.id)}
                        aria-label={expandedUpdates.includes(update.id) ? 'View Less' : 'View More'}
                      >
                        {expandedUpdates.includes(update.id) ? 'View Less' : 'View More'}
                        {expandedUpdates.includes(update.id) ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                      </Button>
                    </div>
                  </Collapsible>
                </Card>
              ) : null
            ))}
          </div>
        </div>

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

        {/* Global AlertDialog for delete confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
                onClick={async () => {
                  if (updateIdToDelete !== null) {
                    await deleteUpdate(updateIdToDelete);
                    setDeleteDialogOpen(false);
                    setUpdateIdToDelete(null);
                  }
                }}
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
  )
}
