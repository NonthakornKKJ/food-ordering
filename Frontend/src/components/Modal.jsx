import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Mobile-first size classes
    const sizeClasses = {
        sm: 'w-full md:max-w-sm',
        md: 'w-full md:max-w-lg',
        lg: 'w-full md:max-w-2xl',
        xl: 'w-full md:max-w-4xl',
        full: 'w-full'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`
                    relative bg-white shadow-2xl 
                    ${sizeClasses[size]} 
                    max-h-[90vh] md:max-h-[85vh]
                    overflow-hidden
                    rounded-t-2xl md:rounded-2xl
                    animate-slide-up md:animate-fade-in
                    mx-0 md:mx-4
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b bg-white sticky top-0 z-10">
                    {/* Mobile drag indicator */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full md:hidden" />

                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mt-2 md:mt-0">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-60px)] md:max-h-[calc(85vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
