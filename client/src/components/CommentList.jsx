import React, { useEffect, useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import usericon from '@/assets/images/user.png'
import Loading from '@/components/Loading'

const CommentList = ({ props }) => {
    const blogid = props?.blogid
    const refreshKey = props?.refreshKey
    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/comment/get/${blogid}`, {
        method: 'get',
        credentials: 'include',
    }, [blogid, refreshKey])

    const [comments, setComments] = useState([])

    useEffect(() => {
        if (data && data.comments) {
            setComments(data.comments)
        }
    }, [data])

    if (loading) return <Loading />

    return (
        <div className='mt-6'>
            <h3 className='text-xl font-bold mb-4'>
                {comments.length} Comments
            </h3>

            <div className='space-y-4'>
                {comments.length > 0 ? (
                    comments.map((c) => (
                        <div key={c._id} className='flex gap-3'>
                            <Avatar>
                                <AvatarImage src={c.user?.avatar || usericon} />
                            </Avatar>
                            <div>
                                <div className='flex items-center gap-2'>
                                    <span className='font-semibold'>{c.user?.name}</span>
                                    <span className='text-sm text-muted-foreground'>
                                        {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        }).replace(/\//g, '-')}
                                    </span>
                                </div>
                                <p className='mt-1'>{c.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-muted-foreground'>No comments yet.</p>
                )}
            </div>
        </div>
    )
}

export default CommentList