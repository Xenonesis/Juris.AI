'use client';

import React from 'react';

interface FeatureHighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  icon,
  title,
  description,
  color
}) => {
  return (
    <div className="text-center p-6">
      <div className={`w-16 h-16 mx-auto mb-4 ${color} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
