import React from 'react';
import { Skeleton, SkeletonCircle } from './Skeleton';

export default function TableSkeleton({ rows = 5, cols = 6 }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-stone-moss/70 bg-white">
            <table className="w-full text-xs">
                {/* Table Header Mock */}
                <thead>
                    <tr className="bg-adaline-ink text-canvas-ice">
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={i} className="px-4 py-3.5 text-left font-bold uppercase tracking-wider text-[10px]">
                                <div className="h-3 w-16 bg-white/25 rounded-sm animate-pulse" />
                            </th>
                        ))}
                    </tr>
                </thead>
                {/* Table Body Mock */}
                <tbody>
                    {Array.from({ length: rows }).map((_, rIdx) => (
                        <tr 
                            key={rIdx} 
                            className="border-t border-stone-moss/70"
                        >
                            {Array.from({ length: cols }).map((_, cIdx) => (
                                <td key={cIdx} className="px-4 py-3.5">
                                    {cIdx === 0 ? (
                                        /* Gender / Badge mock */
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    ) : cIdx === cols - 1 ? (
                                        /* Action button mock */
                                        <div className="flex justify-center">
                                            <Skeleton className="h-6 w-16 rounded-lg" />
                                        </div>
                                    ) : (
                                        /* Text cells */
                                        <Skeleton className={`h-3.5 ${cIdx % 2 === 0 ? 'w-24' : 'w-20'}`} />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
