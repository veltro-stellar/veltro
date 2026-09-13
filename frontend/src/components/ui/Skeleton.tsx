import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  style
}) => {
  const variantStyles = {
    text: "h-4 rounded",
    circle: "rounded-full",
    rect: "rounded",
    card: "rounded-lg",
  };

  return (
    <div
      className={`animate-shimmer bg-muted/50 ${variantStyles[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = "",
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" className={i === lines - 1 ? "w-4/5" : "w-full"} />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`glass-card rounded-xl border border-border p-6 ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <Skeleton variant="circle" className="w-10 h-10" />
    </div>
    <SkeletonText lines={1} className="mb-2" />
    <Skeleton className="h-8 w-24 mb-2" />
    <SkeletonText lines={1} className="w-32" />
  </div>
);

export const SkeletonCorridorCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`glass-card rounded-xl border border-border p-6 ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <Skeleton className="h-6 w-32 mb-2" />
        <SkeletonText lines={1} className="w-48" />
      </div>
      <Skeleton variant="circle" className="w-8 h-8" />
    </div>
    <div className="space-y-3 mb-4">
      {[0,1,2].map(i => (
        <div key={i} className="flex justify-between">
          <SkeletonText lines={1} className="w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const SkeletonMetricsCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`glass-card rounded-xl border border-border p-4 ${className}`}>
    <SkeletonText lines={1} className="w-40 mb-4" />
    <Skeleton className="h-32 w-full mb-4" />
    <div className="grid grid-cols-2 gap-4">
      <div><SkeletonText lines={1} className="w-20 mb-2" /><Skeleton className="h-6 w-24" /></div>
      <div><SkeletonText lines={1} className="w-20 mb-2" /><Skeleton className="h-6 w-24" /></div>
    </div>
  </div>
);

const SKELETON_BAR_HEIGHTS = [45, 72, 28, 91, 56, 38, 82, 63, 47, 75, 33, 58];

export const SkeletonChart: React.FC<{ className?: string; height?: string | number }> = ({
  className = "",
  height = 300,
}) => (
  <div className={`glass-card rounded-xl border border-border p-6 ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-24" />
    </div>
    <div
      className="w-full flex items-end justify-between gap-2"
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      {SKELETON_BAR_HEIGHTS.map((h, i) => (
        <Skeleton key={i} className="w-full rounded-t" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

export const SkeletonAnchorRow: React.FC = () => (
  <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-shimmer">
    <div className="flex-1 flex items-center gap-3 w-full sm:w-auto">
      <div className="w-10 h-10 rounded-full bg-muted/50 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 w-32 bg-muted/50 rounded mb-2" />
        <div className="h-3 w-24 bg-muted/50 rounded" />
      </div>
    </div>
    <div className="w-full sm:w-32 hidden lg:block"><div className="h-6 w-20 bg-muted/50 rounded-full" /></div>
    <div className="w-full sm:w-32 hidden lg:block"><div className="h-4 w-24 bg-muted/50 rounded" /></div>
    <div className="w-full sm:w-32 hidden lg:block"><div className="h-4 w-20 bg-muted/50 rounded" /></div>
    <div className="w-full sm:w-48 hidden lg:block"><div className="h-10 w-full bg-muted/50 rounded" /></div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="glass-card rounded-xl border border-border overflow-hidden">
    <div className="hidden lg:flex p-4 border-b border-border bg-muted/20">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`flex-1 ${i === 0 ? "min-w-[200px]" : ""}`}>
          <div className="h-4 w-24 bg-muted/50 rounded" />
        </div>
      ))}
    </div>
    <div>
      {[...Array(rows)].map((_, i) => (
        <SkeletonAnchorRow key={i} />
      ))}
    </div>
  </div>
);
