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
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { FaRegTrashAlt } from 'react-icons/fa'
import usericon from '@/assets/images/user.png'

const AllUsers = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/user/get-all`,
        {
            method: 'get',
            credentials: 'include'
        },
        [refreshKey]
    )

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(
                `${getEnv('VITE_API_BASE_URL')}/user/delete/${userId}`,
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

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        return new Date(dateStr)
            .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
            .replace(/\//g, '-')
    }

    if (loading) return <Loading />

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[30%]">Email</TableHead>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Dated</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.users && data.users.length > 0 ? (
                        data.users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>{user.role}</TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage
                                            src={user.avatar || usericon}
                                            className="object-cover"
                                        />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{formatDate(user.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 cursor-pointer"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        <FaRegTrashAlt className="text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AllUsers
