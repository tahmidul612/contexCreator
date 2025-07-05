import React, { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Upload, X, FileText, Lightbulb, TrendingUp, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedOffers, setSelectedOffers, uploadedFiles, setUploadedFiles } = useAppContext();
  const [isDragOver, setIsDragOver] = useState(false);

  const offers = [
    {
      id: 'contentSuggestions',
      title: 'Content Suggestions',
      description: 'Get AI-powered content ideas tailored to your audience',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'brandDealReports',
      title: 'Brand Deal Reports',
      description: 'Analyze potential brand partnerships and opportunities',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'analysisIdealFollowers',
      title: 'Analysis of Ideal Followers',
      description: 'Understand your target audience demographics and interests',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'createContents',
      title: 'Create Contents',
      description: 'Generate ready-to-post content for your platforms',
      icon: Zap,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const toggleOffer = (offerId: string) => {
    setSelectedOffers(prev => ({
      ...prev,
      [offerId]: !prev[offerId as keyof typeof prev]
    }));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    setUploadedFiles(prev => [...prev, ...files]);
  }, [setUploadedFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const hasSelections = Object.values(selectedOffers).some(Boolean);

  const handleGenerateTopics = () => {
    if (hasSelections) {
      navigate('/topics');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
      
      <div className="relative max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            What <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CreatorCompass</span> Offers
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the services that will help accelerate your creative journey
          </p>
        </div>

        {/* Offer Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {offers.map((offer) => {
            const Icon = offer.icon;
            const isSelected = selectedOffers[offer.id as keyof typeof selectedOffers];
            
            return (
              <div
                key={offer.id}
                onClick={() => toggleOffer(offer.id)}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${offer.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{offer.title}</h3>
                    <p className="text-gray-400">{offer.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-600'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PDF Upload Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Optional PDF Upload</h3>
          <p className="text-gray-400 mb-6">Upload any relevant documents to help us better understand your brand</p>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Drag and drop PDF files here</p>
            <p className="text-gray-400 mb-4">or</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              Browse Files
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <FileText className="w-5 h-5 text-red-400" />
                    <span className="text-white flex-1">{file.name}</span>
                    <span className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleGenerateTopics}
            disabled={!hasSelections}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              hasSelections
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            Generate Topics
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-12 space-x-2">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-8 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;