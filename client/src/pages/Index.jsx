import React from 'react'
import { useFetch } from '@/hooks/useFetch'
import Loading from '@/components/Loading'
import BlogCard from '@/components/BlogCard'
import { getEnv } from '@/helpers/getEnv'

const Index = () => {
    const { data: blogData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-all`, {
        method: 'get',
        credentials: 'include'
    })
    if (loading) return <Loading />
    return (
        <div className='grid grid-cols-3 gap-10'>
            {blogData && blogData.blog.length > 0
                ?
                blogData.blog.map(blog => <BlogCard key={blog._id} blog={blog} />)
                :
                <div>Data Not Found.</div>
            }
        </div>
    )
}

export default Index