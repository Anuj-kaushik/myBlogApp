import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    error,
    ...props
}, ref) {
    const id = useId()
    
    return (
        <div className='w-full'>
            {label && (
                <label 
                    className='inline-block mb-2 text-sm font-medium text-gray-700' 
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`
                    w-full px-4 py-3 rounded-lg border transition-colors duration-200 outline-none
                    ${error 
                        ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500'
                    }
                    focus:ring-2 focus:ring-opacity-20
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${className}
                `}
                ref={ref}
                {...props}
                id={id}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
})

export default Input