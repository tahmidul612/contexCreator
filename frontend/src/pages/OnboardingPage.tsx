import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SocialChips from '../components/SocialChips';
import WebsiteInput from '../components/WebsiteInput';
import ObjectiveDropdown from '../components/ObjectiveDropdown';

interface FormData {
  socials: string[];
  website: string;
  objective: string;
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setOnboardingData } = useAppContext();
  const [formData, setFormData] = useState<FormData>({
    socials: [],
    website: '',
    objective: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    
    try {
      // Mock API call - simulate successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store form data in context
      setOnboardingData(formData);
      
      // Navigate to offers page
      navigate('/offers');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
      
      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CreatorCompass</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Let's get your creative journey started with some personal details
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Socials Section */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Social Platforms
              </label>
              <p className="text-gray-400 text-sm">
                Select the platforms where you're most active
              </p>
              <SocialChips 
                selectedSocials={formData.socials}
                onSelectionChange={(socials) => updateFormData('socials', socials)}
              />
            </div>

            {/* Website Section */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Website
              </label>
              <WebsiteInput
                value={formData.website}
                onChange={(website) => updateFormData('website', website)}
              />
            </div>

            {/* Objective Section */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Primary Objective
              </label>
              <ObjectiveDropdown
                value={formData.objective}
                onChange={(objective) => updateFormData('objective', objective)}
              />
            </div>

            {/* Continue Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-8 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;