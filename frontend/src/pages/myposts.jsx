import React from "react"
import Feed from "@/components/feed/Feed"

export default function MyPostsPage() {
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser')) } catch { return null }
  })()
  const uid = currentUser?.uid || localStorage.getItem('uid') || null

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Posts</h1>
      <Feed filterAuthorId={uid} filterMode="only" />
    </div>
  )
}


