export default function ApplicationLogo({ className = '', ...props }) {
    const sizeClasses = (className.includes('w-') || className.includes('h-')) ? '' : 'w-8 h-8';
    return (
        <div className={`rounded-lg bg-valley-green flex items-center justify-center text-white shadow-xs shrink-0 ${sizeClasses} ${className}`} {...props}>
            <svg className="w-[62.5%] h-[62.5%] text-forest-dew" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
        </div>
    );
}
