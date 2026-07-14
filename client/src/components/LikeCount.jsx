import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import { showToast } from '@/helpers/showtoast';
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { FaRegHeart, FaHeart } from "react-icons/fa";

const LikeCount = ({ props }) => {
    const user = useSelector((state) => state.user);
    const [likeCount, setLikeCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [loading, setLoading] = useState(false)

    const { data } = useFetch(`${getEnv('VITE_API_BASE_URL')}/like/get-count/${props.blogid}`, {
        method: 'get',
        credentials: 'include',
    }, [props.blogid])

    useEffect(() => {
        if (data) {
            setLikeCount(data.likeCount)
            setIsLiked(data.isLiked)
        }
    }, [data])
    const handleLike = async () => {
        if (!user || !user.isLoggedIn) {
            return showToast('error', 'Please sign in to like.')
        }
        if (loading) return

        setLoading(true)
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/like/toggle`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ blogid: props.blogid }),
            })
            const result = await response.json()
            if (!response.ok) {
                return showToast('error', result.message)
            }

            // Update state optimistically
            if (result.liked) {
                setIsLiked(true)
                setLikeCount((prev) => prev + 1)
            } else {
                setIsLiked(false)
                setLikeCount((prev) => prev - 1)
            }
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type='button'
            onClick={handleLike}
            className={`flex justify-between items-center gap-1 transition-colors duration-200 ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            disabled={loading}
        >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
            {likeCount}
        </button>
    )
}

export default LikeCount
