import React, { useState } from 'react';
import { Send, Sparkles, Loader2, Copy, Check, Zap, BookOpen, Lightbulb } from 'lucide-react';

interface GeneratedContent {
  id: string;
  prompt: string;
  content: string;
  timestamp: Date;
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with your actual backend endpoint
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        prompt,
        content: data.content || 'Generated content would appear here. This is a demo response showcasing how your content will be displayed with proper formatting and styling.',
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Content Context Generator
              </h1>
              <p className="text-gray-400 text-sm">Transform your ideas into compelling content</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <Zap className="h-8 w-8 text-blue-400 mb-2" />
            <h3 className="font-semibold text-gray-100">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Generate content in seconds</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <BookOpen className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="font-semibold text-gray-100">Context Aware</h3>
            <p className="text-gray-400 text-sm">Understands your specific needs</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <Lightbulb className="h-8 w-8 text-yellow-400 mb-2" />
            <h3 className="font-semibold text-gray-100">Creative Output</h3>
            <p className="text-gray-400 text-sm">Unique and engaging content</p>
          </div>
        </div>

        {/* Main Content */}
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

          {/* Usage Tips */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">💡 Tips for Better Results</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>Be specific about your target audience and purpose</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>Include context like tone, style, and key points to cover</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>Mention desired length or format (blog post, social media, etc.)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>Add relevant keywords or themes you want to include</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;