import React from 'react';
import { Skeleton, SkeletonCircle, SkeletonText, SkeletonCard } from './Skeleton';

export default function RecommendationSkeleton() {
    return (
        <SkeletonCard className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <SkeletonCircle size="w-10 h-10" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-64" />
                </div>
            </div>

            {/* BMI Display Mockup */}
            <div className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 flex items-center justify-between">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-48" />
                    <div className="flex items-baseline gap-1.5 mt-1">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-3.5 w-24" />
                    </div>
                </div>
                <Skeleton className="h-7 w-20 rounded-full" />
            </div>

            {/* Recommendations List (5 items) */}
            <div className="space-y-3.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <div 
                        key={idx} 
                        className="flex flex-col p-4 rounded-2xl border border-stone-200/80 bg-white"
                    >
                        <div className="flex items-center gap-3.5">
                            {/* Rank circle */}
                            <SkeletonCircle size="w-8 h-8" />
                            
                            {/* Title and subtext */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-24" />
                                    {idx % 3 === 0 && <Skeleton className="h-4 w-16 rounded" />}
                                </div>
                                <Skeleton className="h-3 w-36" />
                            </div>
                            
                            {/* Score percent & progress bar */}
                            <div className="shrink-0 flex flex-col items-end space-y-2">
                                <Skeleton className="h-3.5 w-8" />
                                <Skeleton className="h-1.5 w-16 md:w-24 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Recommendation Highlight Mockup */}
            <div className="bg-valley-green/95 text-white rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-forest-dew/10 flex items-center justify-center shrink-0 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-28 bg-forest-dew/25" />
                        <div className="flex items-baseline gap-1.5">
                            <Skeleton className="h-5 w-32 bg-white/30" />
                            <Skeleton className="h-3.5 w-12 bg-white/20" />
                        </div>
                    </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-full bg-white/20 shrink-0" />
            </div>

            {/* Workspace Prompt Mockup */}
            <div className="pt-4 border-t border-stone-100 flex flex-col items-center text-center space-y-2">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-3.5 w-72" />
                <Skeleton className="h-10 w-48 rounded-full mt-2" />
            </div>
        </SkeletonCard>
    );
}
