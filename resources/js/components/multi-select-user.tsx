import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useInitials } from '@/hooks/use-initials';

import { cn } from '@/lib/utils';
import { User } from '@/types';
import { Check, UserCircle2 } from 'lucide-react';
import { useState } from 'react';

interface MultiSelectUserProps {
    users: User[];
    selectedUsers: User[];
    onUsersChange: (users: User[]) => void;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    disabled?: boolean;
}

export default function MultiSelectUser({
    users,
    selectedUsers,
    onUsersChange,
    placeholder = 'Select users...',
    emptyMessage = 'No users found.',
    className,
    disabled = false,
}: MultiSelectUserProps) {
    const [open, setOpen] = useState(false);
    const getInitials = useInitials();

    const handleSelect = (user: User) => {
        const isSelected = selectedUsers.some(
            (selected) => selected.id === user.id,
        );

        let newSelected: User[];
        if (isSelected) {
            newSelected = selectedUsers.filter(
                (selected) => selected.id !== user.id,
            );
        } else {
            newSelected = [...selectedUsers, user];
        }

        onUsersChange(newSelected);
    };

    const handleRemove = (userId: number) => {
        const newSelected = selectedUsers.filter((user) => user.id !== userId);
        onUsersChange(newSelected);
    };

    const getUserDisplayName = (user: User) => {
        return user.name || user.email;
    };

    return (
        <div className={cn('w-full', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className="flex w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed"
                    >
                        <UserCircle2
                            className={`h-7 w-7 text-muted-foreground ${selectedUsers.length > 0 ? 'hidden' : ''}`}
                        />
                        <div className="flex flex-1 flex-wrap items-center gap-1">
                            {selectedUsers.length === 0 ? (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            ) : (
                                <div className="flex -space-x-2">
                                    {selectedUsers
                                        .slice(0, 5)
                                        .map((user, index) => (
                                            <Avatar
                                                key={user.id || index}
                                                className="h-8 w-8 border-2 border-background"
                                            >
                                                {user.avatar ? (
                                                    <AvatarImage
                                                        src={user.avatar}
                                                        alt={user.name}
                                                    />
                                                ) : (
                                                    <AvatarFallback className="rounded-full">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                        ))}

                                    {selectedUsers.length > 5 && (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-slate-700 text-xs font-semibold text-white">
                                            +{selectedUsers.length - 5}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {users.map((user) => {
                                    const isSelected = selectedUsers.some(
                                        (selected) => selected.id === user.id,
                                    );

                                    return (
                                        <CommandItem
                                            key={user.id}
                                            onSelect={() => handleSelect(user)}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    isSelected
                                                        ? 'opacity-100'
                                                        : 'opacity-0',
                                                )}
                                            />
                                            <div className="flex items-center">
                                                {user.avatar && (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="mr-2 h-6 w-6 rounded-full"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
