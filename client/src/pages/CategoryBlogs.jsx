import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import BlogCard from '@/components/BlogCard'
import { BiCategoryAlt } from 'react-icons/bi'

const CategoryBlogs = () => {
    const { slug } = useParams()

    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/blog/by-category/${slug}`,
        {
            method: 'get',
            credentials: 'include'
        },
        [slug]
    )

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <p className="text-muted-foreground text-lg">Category not found.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <BiCategoryAlt className="text-violet-500 text-3xl" />
                <h1 className="text-3xl font-bold text-violet-600">
                    {data?.category?.name}
                </h1>
            </div>

            {data?.blogs && data.blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {data.blogs.map(blog => (
                        <BlogCard key={blog._id} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-[30vh]">
                    <p className="text-muted-foreground text-lg">
                        No blogs found in this category.
                    </p>
                </div>
            )}
        </div>
    )
}

export default CategoryBlogs
