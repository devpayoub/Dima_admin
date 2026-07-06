import React, { useState, useRef, useEffect } from 'react';
import type { Template } from '@/types';
import { templates } from '@/data/templates';
import { LoyaltyCard } from '@/components/LoyaltyCard';
import { cn } from '@/lib/utils';
import { Stamp, TrendingUp } from 'lucide-react';

const CATEGORIES = ["All", "Food & Drink", "Beauty & Wellness", "Services"];

const TEMPLATE_CATEGORIES: Record<string, string> = {
  'cookie-classic': 'Food & Drink',
  'midnight-brew': 'Food & Drink',
  'pizza-party': 'Food & Drink',
  'sweet-scoops': 'Food & Drink',
  'massage-bliss': 'Beauty & Wellness',
  'laundry-fresh': 'Services',
  'sharp-cuts': 'Beauty & Wellness',
  'boba-time': 'Food & Drink',
  'burger-joint': 'Food & Drink',
  'cookie-classic-points': 'Food & Drink',
  'midnight-brew-points': 'Food & Drink',
  'pizza-party-points': 'Food & Drink',
  'sweet-scoops-points': 'Food & Drink',
  'massage-bliss-points': 'Beauty & Wellness',
  'laundry-fresh-points': 'Services',
  'sharp-cuts-points': 'Beauty & Wellness',
  'boba-time-points': 'Food & Drink',
  'burger-joint-points': 'Food & Drink',
};

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  unitLabel: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, unitLabel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const BASE_WIDTH = 380;
  const BASE_HEIGHT = 750;

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        setScale(width / BASE_WIDTH);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="group flex flex-col items-center gap-4 cursor-pointer w-full max-w-[340px] mx-auto"
      onClick={() => onSelect(template)}
    >
      <div
        ref={containerRef}
        className="relative w-full aspect-[380/750] rounded-[2.5rem] shadow-lg border border-gray-100 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 overflow-hidden ring-1 ring-black/5"
      >
        <div
          className="origin-top-left absolute top-0 left-0 will-change-transform"
          style={{
            width: `${BASE_WIDTH}px`,
            height: `${BASE_HEIGHT}px`,
            transform: `scale(${scale})`
          }}
        >
          <LoyaltyCard
            template={template}
            mode="active"
            className="w-full h-full pointer-events-none"
          />
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none z-10" />
      </div>

      <div className="text-center space-y-1.5 w-full px-2">
        <h3 className="font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
          {template.name}
        </h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-secondary text-secondary-foreground border">
            {template.totalStamps} {unitLabel}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[180px]" title={template.rewardName}>
            {template.rewardName}
          </span>
        </div>
      </div>
    </div>
  );
};

interface TemplatePickerProps {
  onSelect: (template: Template) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({ onSelect }) => {
  const [selectedMode, setSelectedMode] = useState<'stamps' | 'points' | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const unitLabel = selectedMode === 'points' ? 'Steps' : 'Stamps';

  const filteredTemplates = templates.filter(template => {
    const matchesMode = selectedMode === 'points' ? template.mode === 'points' : template.mode !== 'points';
    const matchesCategory = activeCategory === "All" || TEMPLATE_CATEGORIES[template.id] === activeCategory;
    return matchesMode && matchesCategory;
  });

  if (!selectedMode) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Campaign Type</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose how customers earn rewards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedMode('stamps')}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Stamp size={28} className="text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-foreground">Stamps</h3>
              <p className="text-sm text-muted-foreground mt-1">Customers collect individual stamps on a grid card</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedMode('points')}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <TrendingUp size={28} className="text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-foreground">Points</h3>
              <p className="text-sm text-muted-foreground mt-1">Customers earn points on a progress bar toward a goal</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedMode(null)}
          className="text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {selectedMode === 'points' ? 'Points' : 'Stamps'} Templates
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Select a design to start with.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              activeCategory === category
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-white hover:bg-gray-100 border border-gray-200 text-gray-600"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 max-h-[55vh] overflow-y-auto pr-1 pb-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onSelect}
            unitLabel={unitLabel}
          />
        ))}
      </div>
    </div>
  );
};
