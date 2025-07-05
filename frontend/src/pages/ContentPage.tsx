import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Download, Eye, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ContentData {
  linkedinRegular: string;
  linkedinCarousel: string[];
  youtubeEducational: string;
  youtubeSketch: string;
}

interface PredictedMetrics {
  likes: number;
  comments: number;
  views: number;
}

const ContentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'linkedin-regular' | 'linkedin-carousel' | 'youtube-educational' | 'youtube-sketch'>('linkedin-regular');
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<ContentData | null>(null);
  const [metrics, setMetrics] = useState<PredictedMetrics>({ likes: 0, comments: 0, views: 0 });

  const mockContent: ContentData = {
    linkedinRegular: `🚀 How to Build Your Personal Brand in 2025

Personal branding isn't just about having a nice headshot and a catchy tagline anymore. It's about creating authentic connections and providing real value to your audience.

Here are 5 key strategies that will set you apart:

1️⃣ Define Your Unique Value Proposition
What makes you different? What unique perspective do you bring to your industry? This isn't about being perfect—it's about being authentic and owning your story.

2️⃣ Consistency Across All Platforms
Your message, tone, and visual identity should be recognizable whether someone finds you on LinkedIn, Twitter, or your website. Consistency builds trust.

3️⃣ Share Your Learning Journey
Don't wait until you're an "expert" to start sharing. People connect with growth stories more than perfection. Document your journey, share your failures and wins.

4️⃣ Engage Meaningfully
Stop broadcasting and start conversing. Respond to comments, ask questions, and genuinely engage with your community. Relationships are the foundation of personal branding.

5️⃣ Provide Value First
Before asking for anything, give. Share insights, resources, and help others succeed. When you lead with value, opportunities naturally follow.

Your personal brand is your reputation digitized. What story are you telling?

#PersonalBranding #CareerGrowth #ProfessionalDevelopment #Leadership`,

    linkedinCarousel: [
      "Slide 1: The Personal Branding Revolution\n\n2025 isn't about perfect profiles—it's about authentic connections.\n\nYour brand = Your reputation digitized",
      "Slide 2: Define Your Unique Value\n\n• What makes you different?\n• What's your unique perspective?\n• Own your story, don't copy others",
      "Slide 3: Consistency is Key\n\n✅ Same message across platforms\n✅ Recognizable tone and style\n✅ Visual identity alignment",
      "Slide 4: Share Your Journey\n\n• Document your learning\n• Share failures AND wins\n• Growth stories > Perfection",
      "Slide 5: Engage, Don't Broadcast\n\n• Respond to every comment\n• Ask meaningful questions\n• Build real relationships",
      "Slide 6: Value First, Always\n\n• Share insights freely\n• Help others succeed\n• Opportunities follow value"
    ],

    youtubeEducational: `[INTRO - 0:00-0:15]
Hey everyone! Welcome back to the channel. If you're new here, I'm [Your Name] and I help creators build authentic personal brands that actually convert.

Today we're diving deep into personal branding for 2025. And I'm going to share the exact 5-step framework that helped me grow from zero to [your numbers] in just [timeframe].

But first, if this type of content helps you, smash that like button and subscribe for more creator growth tips every week.

[HOOK - 0:15-0:30]
Here's the thing about personal branding that most people get wrong: they think it's about being perfect. But in 2025, authenticity beats perfection every single time.

I learned this the hard way when I spent months crafting the "perfect" content that nobody cared about. Then I shared one vulnerable post about my failures, and it went viral.

[MAIN CONTENT - 0:30-8:00]

Step 1: Define Your Unique Value Proposition (1:00-2:00)
This isn't about finding a niche that doesn't exist. It's about finding the intersection of:
- What you're passionate about
- What you're good at  
- What the world needs

I'll show you the exact exercise I use with my clients...

Step 2: Consistency Across All Platforms (2:00-3:30)
Your LinkedIn shouldn't feel like a different person than your Twitter. Here's my content pillar framework...

Step 3: Share Your Learning Journey (3:30-5:00)
Stop waiting until you're an expert. I'll show you how to document your journey in a way that provides value...

Step 4: Engage Meaningfully (5:00-6:30)
The algorithm rewards engagement, but more importantly, your audience rewards authenticity...

Step 5: Provide Value First (6:30-8:00)
Here's my 80/20 rule for content creation...

[CONCLUSION - 8:00-8:30]
So there you have it - the 5-step framework for building an authentic personal brand in 2025. 

Which step resonates most with you? Let me know in the comments below.

And if you want to dive deeper into personal branding, check out my free guide in the description. It includes templates and worksheets for everything we covered today.

Don't forget to like this video if it helped you, subscribe for more creator tips, and I'll see you in the next one!

[END SCREEN - 8:30-8:45]
*Point to subscribe button and related videos*`,

    youtubeSketch: `[SCENE: Split screen showing "2024 Personal Branding" vs "2025 Personal Branding"]

NARRATOR (V.O.): Personal branding in 2024 vs 2025...

[LEFT SIDE - 2024]
*Person in suit, perfectly posed, fake smile*
PERSON: "I'm a thought leader and industry expert with 10+ years of experience in synergistic solutions..."

[RIGHT SIDE - 2025]  
*Person in casual clothes, genuine expression*
PERSON: "Hey, I'm Sarah. I failed at my first three startups, but here's what I learned..."

[CUT TO: Montage of "perfect" content]
NARRATOR (V.O.): 2024 was all about the highlight reel...

*Stock photos, generic quotes, corporate speak*

[CUT TO: Montage of authentic content]
NARRATOR (V.O.): 2025 is about the real reel...

*Behind-the-scenes, work-in-progress, honest struggles*

[SCENE: Two people at coffee shop]
FRIEND 1: "But what if people judge me for not having it all figured out?"

FRIEND 2: "That's exactly why they'll connect with you!"

[MONTAGE: Comments and engagement]
- "Thank you for being so real!"
- "I needed to hear this today"
- "Finally, someone who gets it"

[FINAL SCENE: Person speaking to camera]
PERSON: "Your personal brand isn't about being perfect. It's about being perfectly you."

[TEXT OVERLAY: "What's your authentic story?"]

[END CARD: Subscribe for more real talk about building your brand]`
  };

  const mockMetrics = {
    likes: Math.floor(Math.random() * 1000) + 500,
    comments: Math.floor(Math.random() * 100) + 50,
    views: Math.floor(Math.random() * 10000) + 2000
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setContent(mockContent);
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [id]);

  const tabs = [
    { id: 'linkedin-regular', label: 'LinkedIn Regular' },
    { id: 'linkedin-carousel', label: 'LinkedIn Carousel' },
    { id: 'youtube-educational', label: 'YouTube Educational' },
    { id: 'youtube-sketch', label: 'YouTube Sketch' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadAsText = (text: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getCurrentContent = () => {
    if (!content) return '';
    
    switch (activeTab) {
      case 'linkedin-regular':
        return content.linkedinRegular;
      case 'linkedin-carousel':
        return content.linkedinCarousel.join('\n\n---\n\n');
      case 'youtube-educational':
        return content.youtubeEducational;
      case 'youtube-sketch':
        return content.youtubeSketch;
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Generating your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/topics')}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Topics
            </button>
            
            <h1 className="text-2xl font-bold text-white">
              Content <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Created</span>
            </h1>
            
            <div className="w-32"></div> {/* Spacer */}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Display */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(getCurrentContent())}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => downloadAsText(getCurrentContent(), `${activeTab}-content.txt`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {getCurrentContent()}
              </pre>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-gray-800/30 backdrop-blur-xl border-l border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Predicted Performance</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Views</span>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.views.toLocaleString()}</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-gray-400">Likes</span>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.likes.toLocaleString()}</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">Comments</span>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.comments.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Performance Tip</span>
            </div>
            <p className="text-gray-300 text-sm">
              Post this content during peak engagement hours (9-11 AM or 1-3 PM) for maximum reach.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center py-6 space-x-2">
        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        <div className="w-8 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default ContentPage;