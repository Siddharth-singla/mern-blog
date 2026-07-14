import React from 'react'

const Loading = () => {
    return (
        <div className='flex min-h-62.5 items-center justify-center py-16'>
            <div
                style={{
                    width: 48,
                    height: 48,
                    border: '4px solid #e5e7eb',
                    borderTop: '4px solid #8b5cf6',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }}
            />
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default Loading