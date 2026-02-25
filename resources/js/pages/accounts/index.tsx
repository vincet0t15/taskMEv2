import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, User } from '@/types';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { KeyboardEventHandler, useState } from 'react';
import { PaginatedDataResponse } from '@/types/pagination';
import { FilterProps } from '@/types/filter';
import accounts from '@/routes/accounts';
import Pagination from '@/components/paginationData';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Accounts',
        href: accounts.index().url,
    },

];

interface Props {
    accountList: PaginatedDataResponse<User>;
    filters: FilterProps
}
export default function AccountList({ accountList, filters }: Props) {
    console.log(accountList)
    const [search, setSearch] = useState(filters.search || '');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openCreateSection, setOpenCreateSection] = useState(false);
    const [openEditYearSectionDialog, setOpenEditYearSectionDialog] = useState(false);
    const [openDeleteSectionDialog, setOpenDeleteSectionDialog] = useState(false);
    const [expandedYearLevels, setExpandedYearLevels] = useState<number[]>([]);

    const toggleYearLevel = (id: number) => {
        setExpandedYearLevels(prev =>
            prev.includes(id)
                ? prev.filter(expandedId => expandedId !== id)
                : [...prev, id]
        );
    };


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = search ? { search: search } : undefined;

            router.get(accounts.index().url, queryString,
                {
                    preserveState: true,
                    preserveScroll: true,
                })
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">


                    <div className="flex items-center gap-2">
                        <Input placeholder="Search..." value={search} onChange={handleSearch} onKeyDown={handleKeyDown} />
                    </div>
                </div>


                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">Account Name</TableHead>

                                <TableHead className="text-primary font-bold text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accountList.data.length > 0 ? (
                                accountList.data.map((account) => (
                                    <React.Fragment key={account.id}>

                                        <TableRow className="text-sm font-medium hover:bg-muted/50 transition-colors">
                                            <TableCell>
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer select-none"

                                                >

                                                    <span className="font-semibold">{account.name}</span>
                                                    <span className="text-xs text-muted-foreground ml-2">
                                                        ({account.username})
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="flex justify-end gap-3">
                                                <span
                                                    className="cursor-pointer text-teal-800 hover:text-teal-900 hover:underline"

                                                >
                                                    Create Section
                                                </span>
                                                <span
                                                    className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"

                                                >
                                                    Edit
                                                </span>

                                                <span
                                                    className="cursor-pointer text-red-500 hover:text-red-700 hover:underline"

                                                >
                                                    Delete
                                                </span>
                                            </TableCell>
                                        </TableRow>



                                    </React.Fragment>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="py-3 text-center text-gray-500">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={accountList} />
                </div>
            </div>

        </AppLayout >
    );
}
