import React from 'react';

/**
 * Base pulsing block skeleton.
 */
export function Skeleton({ className = '', variant = 'rect', ...props }) {
    const baseClass = "animate-pulse bg-stone-moss/50";
    const shapeClass = variant === 'circle' ? 'rounded-full' : 'rounded-2xl';
    
    return (
        <div 
            className={`${baseClass} ${shapeClass} ${className}`} 
            {...props} 
        />
    );
}

/**
 * Circle pulsing skeleton helper.
 */
export function SkeletonCircle({ size = 'w-10 h-10', className = '', ...props }) {
    return (
        <Skeleton 
            variant="circle" 
            className={`${size} ${className}`} 
            {...props} 
        />
    );
}

/**
 * Text line skeletons. Generates a set of pulsing lines representing text paragraphs.
 */
export function SkeletonText({ lines = 3, className = '', ...props }) {
    const lineWidths = ['w-full', 'w-11/12', 'w-4/5', 'w-10/12', 'w-3/4'];
    
    return (
        <div className={`space-y-2.5 ${className}`} {...props}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton 
                    key={i} 
                    className={`h-3 ${lineWidths[i % lineWidths.length]}`} 
                />
            ))}
        </div>
    );
}

/**
 * Card skeleton helper.
 */
export function SkeletonCard({ className = '', children, ...props }) {
    return (
        <div className={`bg-white border border-stone-200/60 rounded-3xl p-5 md:p-6 shadow-xs ${className}`} {...props}>
            {children}
        </div>
    );
}
