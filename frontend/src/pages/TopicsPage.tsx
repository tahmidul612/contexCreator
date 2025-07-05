import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Topic {
  id: string;
  title: string;
  platform: 'LI' | 'YT' | 'IG';
  platformColor: string;
}

const TopicsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);

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
    </div>
  );

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