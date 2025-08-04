import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const logoutHandler = async () => {
        setLoading(true)
        try {
            await authService.logout()
            dispatch(logout())
        } catch (error) {
            console.error("Logout error:", error)
            // Still dispatch logout to clear local state even if API call fails
            dispatch(logout())
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            className='flex items-center px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium'
            onClick={logoutHandler}
            disabled={loading}
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing out...
                </>
            ) : (
                <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </>
            )}
        </button>
    )
}

export default LogoutBtn