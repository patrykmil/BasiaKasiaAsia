import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const forumPosts = [
    {
        id: 1,
        username: "Username",
        date: "01.01.2001",
        avatar: "/src/assets/img/default-user.svg",
        content: "Finally someone let me out of my cage. Now time for me is nuthin', 'cause I'm countin' no age. Now I couldn't be there, now you shouldn't be scared. I'm good at repairs, and I'm under each snare. Intangible (an y'all), bet you didn't think. So I command you to, panoramic view (you). Look, I'll make it all manageable. Pick and lockable, all and love and I unpackable. Picture you gettin down in a picture tube. Like you lit the fuse. You think it's fictional? Mystical? Maybe. Spiritual hero who appears on you to clear your view. When you're too crazy. Lifeless to those the definition for what life is. Priceless to you because I put you on the hype shit. Did you like it? Got smokin' righteous with one toke. You're psychic among knows possesses you with one go."
    },
    {
        id: 2,
        username: "Username",
        date: "01.01.2001",
        avatar: "/src/assets/img/default-user.svg",
        content: "Finally someone let me out of my cage. Now time for me is nuthin', 'cause I'm countin' no age. Now I couldn't be there, now you shouldn't be scared. I'm good at repairs, and I'm under each snare. Intangible (an y'all), bet you didn't think. So I command you to, panoramic view (you). Look, I'll make it all manageable. Pick and lockable, all and love and I unpackable. Picture you gettin down in a picture tube. Like you lit the fuse. You think it's fictional? Mystical? Maybe. Spiritual hero who appears on you to clear your view. When you're too crazy. Lifeless to those the definition for what life is. Priceless to you because I put you on the hype shit. Did you like it? Got smokin' righteous with one toke. You're psychic among knows possesses you with one go."
    }
];

function Title() {
    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <h1 className="text-3xl font-bold mb-6">Title</h1>
            
            {/* Forum Posts */}
            <div className="space-y-4">
                {forumPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start space-x-3">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={post.avatar} alt={post.username} />
                                <AvatarFallback>{post.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="font-semibold text-gray-900">{post.username}</span>
                                    <span className="text-sm text-gray-500">{post.date}</span>
                                </div>
                                
                                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                    {post.content}
                                </p>
                                
                                <div className="flex justify-end">
                                    <Button variant="secondary" size="sm">
                                        Respond
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* New Post Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mt-6">
                <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src="/src/assets/img/default-user.svg" alt="Your avatar" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900">Username</span>
                        </div>
                        
                        <Textarea 
                            placeholder="TEXT EDITOR" 
                            className="min-h-[100px] mb-3 resize-none"
                        />
                        
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                                Cancel
                            </Button>
                            <Button size="sm">
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Title;
