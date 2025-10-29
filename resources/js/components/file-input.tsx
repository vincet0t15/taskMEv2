'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, X } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';

interface FileInputProps {
    value: File[];
    onChange: (files: File[]) => void;
}

export default function FileInput({ value, onChange }: FileInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        onChange([...value, ...files]);
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = [...value];
        newFiles.splice(index, 1);
        onChange(newFiles);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleButtonClick}
                >
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach Files
                </Button>
                <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                />
            </div>
            {value.length > 0 && (
                <div className="mt-2 space-y-2">
                    {value.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-md bg-muted p-2"
                        >
                            <span className="text-sm text-muted-foreground">
                                {file.name}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFile(index)}
                                className="cursor-pointer hover:text-muted-foreground"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
