import React from 'react'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import { Link } from 'react-router-dom'
import { RouteBlogDetails } from '@/helpers/RouteName'
import Loading from '@/components/Loading'

const RelatedBlog = ({ props }) => {
    const { category, blog } = props
    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/blog/related/${category._id}/${blog}`,
        {
            method: 'get',
            credentials: 'include',
        },
        [category._id, blog]
    )

    if (loading) return <Loading />

    return (
        <div className='p-5'>
            <h3 className='text-xl font-bold mb-4'>Related Blogs</h3>

            <div className='space-y-4'>
                {data && data.relatedBlogs && data.relatedBlogs.length > 0 ? (
                    data.relatedBlogs.map((b) => (
                        <Link
                            to={RouteBlogDetails(category.slug, b.slug)}
                            key={b._id}
                            className='flex items-center gap-3 group'
                        >
                            <img
                                src={b.featuredImage}
                                alt={b.title}
                                className='w-16 h-16 rounded object-cover shrink-0'
                            />
                            <p className='text-sm font-medium line-clamp-2 group-hover:text-violet-600 transition-colors'>
                                {b.title}
                            </p>
                        </Link>
                    ))
                ) : (
                    <p className='text-sm text-muted-foreground'>No related blogs found.</p>
                )}
            </div>
        </div>
    )
}

export default RelatedBlog
