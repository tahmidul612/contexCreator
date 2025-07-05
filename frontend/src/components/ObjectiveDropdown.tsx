import React, { useState } from 'react';
import { ChevronDown, TrendingUp, DollarSign, Star } from 'lucide-react';

interface ObjectiveDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const objectives = [
  { id: 'grow-followers', name: 'Grow Followers', icon: TrendingUp, description: 'Increase your audience and reach' },
  { id: 'increase-sales', name: 'Increase Sales', icon: DollarSign, description: 'Drive more revenue and conversions' },
  { id: 'get-brand-deals', name: 'Get Brand Deals', icon: Star, description: 'Attract sponsorships and partnerships' },
];

const ObjectiveDropdown: React.FC<ObjectiveDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedObjective = objectives.find(obj => obj.id === value);

  const handleSelect = (objectiveId: string) => {
    onChange(objectiveId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-4 bg-gray-700/50 border-2 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
          isOpen ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <div className="flex items-center gap-3">
          {selectedObjective ? (
            <>
              <selectedObjective.icon className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-white font-medium">{selectedObjective.name}</div>
                <div className="text-gray-400 text-sm">{selectedObjective.description}</div>
              </div>
            </>
          ) : (
            <span className="text-gray-400">Select your primary objective</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          {objectives.map((objective) => {
            const Icon = objective.icon;
            return (
              <button
                key={objective.id}
                type="button"
                onClick={() => handleSelect(objective.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-700/50 transition-all duration-200 ${
                  value === objective.id ? 'bg-blue-500/20 border-l-4 border-blue-500' : ''
                }`}
              >
                <Icon className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-white font-medium">{objective.name}</div>
                  <div className="text-gray-400 text-sm">{objective.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ObjectiveDropdown;