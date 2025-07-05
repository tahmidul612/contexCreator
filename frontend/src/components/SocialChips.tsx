import React from 'react';
import { Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

interface SocialChipsProps {
  selectedSocials: string[];
  onSelectionChange: (socials: string[]) => void;
}

const socialPlatforms = [
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
];

const SocialChips: React.FC<SocialChipsProps> = ({ selectedSocials, onSelectionChange }) => {
  const toggleSocial = (socialId: string) => {
    const newSelection = selectedSocials.includes(socialId)
      ? selectedSocials.filter(id => id !== socialId)
      : [...selectedSocials, socialId];
    onSelectionChange(newSelection);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {socialPlatforms.map((platform) => {
        const Icon = platform.icon;
        const isSelected = selectedSocials.includes(platform.id);
        
        return (
          <button
            key={platform.id}
            type="button"
            onClick={() => toggleSocial(platform.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
              isSelected
                ? `bg-gradient-to-r ${platform.color} text-white shadow-lg transform scale-105`
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            {platform.name}
          </button>
        );
      })}
    </div>
  );
};

export default SocialChips;