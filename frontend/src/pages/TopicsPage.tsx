import React, { useState, useEffect } from 'react';
import { Send,ArrowLeft, Sparkles, Loader2, Copy, Check, Zap, BookOpen, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Topic {
  id: string;
  title: string;
  platform: 'LI' | 'YT' | 'IG';
  platformColor: string;
}

interface GeneratedContent {
  id: string;
  prompt: string;
  content: string;
  timestamp: Date;
}

const TopicsPage: React.FC = () => {
  const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
    const [error, setError] = useState<string | null>(null);
      const [copiedId, setCopiedId] = useState<string | null>(null);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with your actual backend endpoint
      const response = await fetch('http://localhost:8000/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,          // renamed from prompt to query
          format: 'social_post',  // optional: include/expose as needed
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      console.log(data)
      
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        prompt,
        content: data.result || 'Generated content would appear here. This is a demo response showcasing how your content will be displayed with proper formatting and styling.',
        timestamp: new Date(),
      };

      setGeneratedContent(newContent);
    } catch (error) {
      // For demo purposes, we'll show a mock response
      const mockContent: GeneratedContent = {
        id: Date.now().toString(),
        prompt,
        content: `Here's your generated content based on: "${prompt}"\n\nThis is a comprehensive response that demonstrates the content generation capabilities. The actual response from your backend would replace this mock content.\n\nKey features:\n• Contextual understanding\n• Structured output\n• Relevant insights\n• Professional formatting\n\nThe content maintains consistency with your prompt while providing valuable, actionable information.`,
        timestamp: new Date(),
      };
      setGeneratedContent(mockContent);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

   const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
    const handleClear = () => {
    setPrompt('');
    setGeneratedContent(null);
    setError(null);
  };

  const mockTopics: Topic[] = [
    {
      id: '1',
      title: 'How to Build Your Personal Brand in 2025',
      platform: 'LI',
      platformColor: 'from-blue-600 to-blue-700'
    },
    {
      id: '2',
      title: '10 Content Creation Mistakes That Kill Engagement',
      platform: 'YT',
      platformColor: 'from-red-500 to-red-600'
    },
    {
      id: '3',
      title: 'Behind the Scenes: My Creative Process',
      platform: 'IG',
      platformColor: 'from-pink-500 to-purple-600'
    },
    {
      id: '4',
      title: 'The Psychology of Viral Content',
      platform: 'LI',
      platformColor: 'from-blue-600 to-blue-700'
    },
    {
      id: '5',
      title: 'From Zero to 100K: My Growth Strategy',
      platform: 'YT',
      platformColor: 'from-red-500 to-red-600'
    },
    {
      id: '6',
      title: 'Quick Tips for Better Instagram Stories',
      platform: 'IG',
      platformColor: 'from-pink-500 to-purple-600'
    },
    {
      id: '7',
      title: 'Networking Secrets Every Creator Should Know',
      platform: 'LI',
      platformColor: 'from-blue-600 to-blue-700'
    },
    {
      id: '8',
      title: 'The Future of Content Creation',
      platform: 'YT',
      platformColor: 'from-red-500 to-red-600'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTopics(mockTopics);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const SkeletonCard = () => (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-4 bg-gray-700 rounded w-16"></div>
        <div className="h-6 w-6 bg-gray-700 rounded"></div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-6 bg-gray-700 rounded w-full"></div>
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="h-10 bg-gray-700 rounded w-full"></div>
    </div>
  );

  const TopicCard: React.FC<{ topic: Topic }> = ({ topic }) => (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${topic.platformColor}`}>
          {topic.platform}
        </span>
        <Sparkles className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-6 leading-tight">
        {topic.title}
      </h3>
      
      <button
        onClick={() => navigate(`/content/${topic.id}`)}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        Create Content
      </button>
               {/* Main Content */}
          </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
      
      <div className="relative max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/offers')}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Topic <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Suggestions</span>
            </h1>
            <p className="text-gray-400">
              {isLoading ? 'Generating personalized content ideas...' : 'Choose a topic to create content'}
            </p>
          </div>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

          <div className="space-y-6">
          {/* Prompt Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                  What content would you like to generate?
                </label>
                <div className="relative">
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here... (e.g., 'Write a blog post about sustainable living', 'Create a product description for eco-friendly water bottles', 'Generate social media content for a fitness brand')"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                    rows={4}
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {prompt.length}/2000
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                  disabled={isLoading}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Generate Content</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
    </div>


        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))
          }
        </div>

{/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Generated Content */}
          {generatedContent && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Generated Content</h3>
                <button
                  onClick={() => copyToClipboard(generatedContent.content, generatedContent.id)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {copiedId === generatedContent.id ? (
                    <>
                      <Check className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Original Prompt:</p>
                  <p className="text-gray-300 italic">"{generatedContent.prompt}"</p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-3">Generated Content:</p>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
                      {generatedContent.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Generated on {generatedContent.timestamp.toLocaleString()}</span>
                  <span>{generatedContent.content.length} characters</span>
                </div>
              </div>
            </div>
          )}

        {/* Progress Indicator */}
        <div className="flex justify-center mt-12 space-x-2">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-8 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );        

};

export default TopicsPage;