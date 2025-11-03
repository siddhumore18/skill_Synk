import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function PostForm({ onSuccess, onClose }) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [mediaType, setMediaType] = React.useState("image")
  const [imageFile, setImageFile] = React.useState(null)
  const [youtubeUrl, setYoutubeUrl] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser')) } catch { return null }
  })()
  const authorId = currentUser?.uid || localStorage.getItem('uid') || "anon"
  const authorName = currentUser?.name || currentUser?.email?.split('@')[0] || "User"
  const role = currentUser?.role || localStorage.getItem('role') || "entrepreneur"

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title || !description) return
    setIsSubmitting(true)
    try {
      let res
      if (mediaType === 'image') {
        const fd = new FormData()
        fd.append('authorId', authorId)
        fd.append('authorName', authorName)
        fd.append('role', role)
        fd.append('title', title)
        fd.append('description', description)
        fd.append('mediaType', 'image')
        if (imageFile) fd.append('image', imageFile)
        res = await fetch('http://localhost:3001/api/posts', { method: 'POST', body: fd })
      } else {
        const body = {
          authorId, authorName, role, title, description,
          mediaType: 'youtube', youtubeUrl
        }
        res = await fetch('http://localhost:3001/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      }
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to create post')
      onSuccess && onSuccess(data.post)
      onClose && onClose()
      setTitle("")
      setDescription("")
      setImageFile(null)
      setYoutubeUrl("")
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Post submit error:', err)
      alert(err.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What’s new?" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Share more details..." rows={5} required />
      </div>

      <div className="space-y-2">
        <Label>Attachment</Label>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="mediaType" value="image" checked={mediaType === 'image'} onChange={() => setMediaType('image')} />
            Image
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="mediaType" value="youtube" checked={mediaType === 'youtube'} onChange={() => setMediaType('youtube')} />
            YouTube Link (pitch deck)
          </label>
        </div>
      </div>

      {mediaType === 'image' ? (
        <div className="space-y-2">
          <Label htmlFor="image">Image file</Label>
          <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB. Videos are not accepted.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="yt">YouTube URL</Label>
          <Input id="yt" type="url" placeholder="https://youtu.be/VIDEO_ID" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
          <p className="text-xs text-muted-foreground">Paste a public YouTube link for your pitch deck.</p>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Posting...' : 'Post'}</Button>
      </div>
    </form>
  )
}


