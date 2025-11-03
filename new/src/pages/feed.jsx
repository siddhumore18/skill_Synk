import React from "react"

const roleBadgeClasses = {
	Investor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
	Entrepreneur: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
	Freelancer: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
}

function getUserRole() {
	try {
		const cuStr = localStorage.getItem("currentUser")
		if (cuStr) {
			const cu = JSON.parse(cuStr)
			if (cu && cu.role) return cu.role
		}
	} catch {}
	const r = localStorage.getItem("role")
	return r || "entrepreneur"
}

function Avatar({ name }) {
	const initials = (name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
	return (
		<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold shrink-0">
			{initials}
		</div>
	)
}

function PostCard({ post }) {
	return (
		<div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-4 md:p-5 mb-5">
			{/* Author */}
			<div className="flex items-start gap-3">
				<Avatar name={post.author} />
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<p className="font-semibold truncate">{post.author}</p>
						<span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeClasses[post.role] || "bg-muted text-muted-foreground"}`}>
							{post.role}
						</span>
						<span className="text-xs text-muted-foreground">• {post.timestamp}</span>
					</div>
					<h3 className="mt-1 font-bold">{post.title}</h3>
				</div>
			</div>

			{/* Description */}
			<p className="text-muted-foreground mt-3 whitespace-pre-line">{post.description}</p>

			{/* Media */}
			{post.mediaUrl && post.mediaType === "image" && (
				<div className="mt-3 overflow-hidden rounded-lg border border-border">
					<img src={post.mediaUrl} alt="attachment" className="w-full h-auto object-cover" />
				</div>
			)}
			{post.mediaUrl && post.mediaType === "video" && (
				<div className="mt-3 overflow-hidden rounded-lg border border-border">
					<video src={post.mediaUrl} controls className="w-full h-auto" />
				</div>
			)}

			{/* Actions */}
			<div className="mt-4 pt-3 border-t border-border flex items-center gap-6 text-sm text-muted-foreground">
				<button type="button" className="hover:text-foreground">👍 Like</button>
				<button type="button" className="hover:text-foreground">💬 Comment</button>
				<button type="button" className="hover:text-foreground">↗️ Share</button>
			</div>
		</div>
	)
}

export default function FeedPage() {
	const posts = [
		{
			id: 1,
			author: "Aarya Sharma",
			role: "Entrepreneur",
			timestamp: "2h ago",
			title: "Launching our beta for SkillSync",
			description: "We just opened early access. Looking for feedback from freelancers and investors. Drop your thoughts!",
			mediaType: "image",
			mediaUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
		},
		{
			id: 2,
			author: "Rahul Verma",
			role: "Investor",
			timestamp: "5h ago",
			title: "Market insights: SaaS growth in APAC",
			description: "APAC SaaS is growing 25% YoY. Keen to chat with founders building B2B tools for SMBs.",
			mediaType: "video",
			mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
		},
		{
			id: 3,
			author: "Neha Patel",
			role: "Freelancer",
			timestamp: "1d ago",
			title: "Available for product design sprints",
			description: "Helping startups validate ideas with 1-week design sprints. Portfolio on request.",
			mediaType: null,
			mediaUrl: null,
		},
	]

	const role = getUserRole()
	const roleTheme = role === 'freelancer' ? 'theme-freelancer' : (role === 'investor' ? 'theme-investor' : 'theme-entrepreneur')

	return (
		<div className={`min-h-screen bg-background text-foreground ${roleTheme}`}>
			<header className="bg-background border-b border-border">
				<div className="max-w-2xl mx-auto px-4 py-4">
					<h1 className="text-xl font-bold">StartupConnect</h1>
				</div>
			</header>
			<main className="max-w-2xl mx-auto px-4 py-6">
				{posts.map((p) => (
					<PostCard key={p.id} post={p} />
				))}
			</main>
		</div>
	)
}


