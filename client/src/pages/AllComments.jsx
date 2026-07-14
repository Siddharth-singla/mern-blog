import React, { useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { showToast } from '@/helpers/showtoast'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FaRegTrashAlt } from 'react-icons/fa'

const AllComments = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/comment/get-all`,
        {
            method: 'get',
            credentials: 'include'
        },
        [refreshKey]
    )

    const handleDelete = async (commentId) => {
        try {
            const response = await fetch(
                `${getEnv('VITE_API_BASE_URL')}/comment/delete/${commentId}`,
                {
                    method: 'delete',
                    credentials: 'include'
                }
            )
            const result = await response.json()
            if (!response.ok) {
                showToast('error', result.message)
                return
            }
            showToast('success', result.message)
            setRefreshKey(prev => prev + 1)
        } catch (err) {
            showToast('error', err.message)
        }
    }

    if (loading) return <Loading />

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[45%]">Blog</TableHead>
                        <TableHead>Commented By</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.comments && data.comments.length > 0 ? (
                        data.comments.map(comment => (
                            <TableRow key={comment._id}>
                                <TableCell className="font-medium">
                                    {comment.blogid?.title || 'Deleted Blog'}
                                </TableCell>
                                <TableCell>
                                    {comment.user?.name || 'Unknown User'}
                                </TableCell>
                                <TableCell>{comment.comment}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 cursor-pointer"
                                        onClick={() => handleDelete(comment._id)}
                                    >
                                        <FaRegTrashAlt className="text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                No comments found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AllComments
