import React, { useState } from 'react';
import { Globe, AlertCircle, Check } from 'lucide-react';

interface WebsiteInputProps {
  value: string;
  onChange: (value: string) => void;
}

const WebsiteInput: React.FC<WebsiteInputProps> = ({ value, onChange }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue) {
      setIsValid(validateUrl(newValue));
    } else {
      setIsValid(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Globe className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="url"
          value={value}
          onChange={handleChange}
          placeholder="https://yourwebsite.com"
          className={`w-full pl-12 pr-12 py-4 bg-gray-700/50 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
            isValid === false
              ? 'border-red-500 focus:border-red-500'
              : isValid === true
              ? 'border-green-500 focus:border-green-500'
              : 'border-gray-600 focus:border-blue-500'
          }`}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {isValid === false && <AlertCircle className="w-5 h-5 text-red-500" />}
          {isValid === true && <Check className="w-5 h-5 text-green-500" />}
        </div>
      </div>
      {isValid === false && (
        <p className="text-red-400 text-sm flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          Please enter a valid website URL
        </p>
      )}
    </div>
  );
};

export default WebsiteInput;