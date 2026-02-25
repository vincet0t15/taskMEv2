import { Head, router, usePage as useInertiaPage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData, User } from '@/types';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { KeyboardEventHandler, useState } from 'react';
import { PaginatedDataResponse } from '@/types/pagination';
import { FilterProps } from '@/types/filter';
import * as accounts from '@/routes/accounts';
import Pagination from '@/components/paginationData';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
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
    const { auth } = useInertiaPage<SharedData>().props;
    const currentUser = auth.user;

    const [search, setSearch] = useState(filters.search || '');
    // ... existing state ...

    const handleToggleActive = (user: User) => {
        if (user.id === currentUser.id) {
            toast.error("You cannot deactivate your own account.");
            return;
        }

        const action = user.is_active ? 'deactivate' : 'activate';
        if (!confirm(`Are you sure you want to ${action} this account?`)) {
            return;
        }

        router.put(accounts.toggleActive.url(user.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully.`);
            },
            onError: () => {
                toast.error("Failed to update user status.");
            }
        });
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

                                            <TableCell className="flex justify-end items-center gap-3">
                                                <span
                                                    className={cn(
                                                        "text-xs font-medium px-2 py-1 rounded-full",
                                                        account.is_active
                                                            ? "bg-teal-100 text-teal-800"
                                                            : "bg-red-100 text-red-800"
                                                    )}
                                                >
                                                    {account.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                <Switch
                                                    checked={!!account.is_active}
                                                    onCheckedChange={() => handleToggleActive(account)}
                                                    disabled={account.id === currentUser.id}
                                                />
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
