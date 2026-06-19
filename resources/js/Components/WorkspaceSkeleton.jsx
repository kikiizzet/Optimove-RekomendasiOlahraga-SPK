import React from 'react';
import { Skeleton, SkeletonCircle, SkeletonText, SkeletonCard } from './Skeleton';

export default function WorkspaceSkeleton() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Greeting Header Mockup */}
            <div className="flex flex-col space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Grid for top metrics (4 cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} className="flex items-center gap-4 p-4 md:p-5">
                        <SkeletonCircle size="w-12 h-12" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <div className="flex items-baseline gap-1">
                                <Skeleton className="h-6 w-10" />
                                <Skeleton className="h-3.5 w-8" />
                            </div>
                        </div>
                    </SkeletonCard>
                ))}
            </div>

            {/* Dashboard Content Grid: 2 columns */}
            <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
                
                {/* Left side: Today's activities & weight progress */}
                <div className="lg:col-span-8 space-y-6 md:space-y-8">
                    {/* Active Program Card */}
                    <SkeletonCard className="p-5 md:p-6 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        
                        <div className="grid sm:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="p-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 space-y-2">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            ))}
                        </div>
                    </SkeletonCard>

                    {/* Weight Chart Mockup */}
                    <SkeletonCard className="p-5 md:p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-44" />
                                <Skeleton className="h-3 w-36" />
                            </div>
                            <Skeleton className="h-8 w-20 rounded-full" />
                        </div>
                        {/* Simulating chart grid */}
                        <div className="h-64 flex items-end justify-between px-2 pt-6 border-b border-l border-stone-200">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="flex flex-col items-center w-full gap-2">
                                    <Skeleton 
                                        className="w-8 rounded-t-lg bg-stone-moss/30" 
                                        style={{ height: `${30 + idx * 10}px` }} 
                                    />
                                    <Skeleton className="h-3 w-8" />
                                </div>
                            ))}
                        </div>
                    </SkeletonCard>
                </div>

                {/* Right side: Daily To-Do list & Testimonial */}
                <div className="lg:col-span-4 space-y-6 md:space-y-8">
                    {/* To-Do List Card */}
                    <SkeletonCard className="p-5 md:p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-28" />
                            <SkeletonCircle size="w-6 h-6" />
                        </div>
                        
                        {/* 3 To-do items */}
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl border border-stone-100 bg-stone-50/20">
                                    <Skeleton className="h-5 w-5 rounded-md" /> {/* checkbox */}
                                    <div className="flex-1 space-y-1.5">
                                        <Skeleton className="h-3.5 w-36" />
                                        <Skeleton className="h-2.5 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SkeletonCard>

                    {/* Weekly Checklist Card */}
                    <SkeletonCard className="p-5 md:p-6 space-y-4">
                        <Skeleton className="h-4 w-36" />
                        <div className="flex flex-wrap gap-2">
                            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                                <div key={day} className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-stone-100 shrink-0">
                                    <Skeleton className="h-3 w-6" />
                                    <SkeletonCircle size="w-6 h-6" />
                                </div>
                            ))}
                        </div>
                    </SkeletonCard>
                </div>

            </div>
        </div>
    );
}
