import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RouteSignIn } from '@/helpers/RouteName'

const AuthGuard = ({ children }) => {
    const user = useSelector((state) => state.user)

    if (!user.isLoggedIn) {
        return <Navigate to={RouteSignIn} replace />
    }

    return children ? children : <Outlet />
}

export default AuthGuard
