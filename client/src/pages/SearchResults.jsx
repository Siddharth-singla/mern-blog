import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import BlogCard from '@/components/BlogCard'
import { IoSearchOutline } from 'react-icons/io5'

const SearchResults = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''

    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/blog/search?q=${encodeURIComponent(query)}`,
        {
            method: 'get',
            credentials: 'include'
        },
        [query]
    )

    if (loading) return <Loading />

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <IoSearchOutline className="text-violet-500 text-3xl" />
                <h1 className="text-2xl font-bold text-violet-600">
                    Search Result For: <span className="text-gray-800">{query}</span>
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
                        No results found for "{query}".
                    </p>
                </div>
            )}
        </div>
    )
}

export default SearchResults
