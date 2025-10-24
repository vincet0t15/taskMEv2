import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
interface Option {
    label: string;
    value: string;
    color: string;
}

interface CustomSelectProps {
    options?: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    widthClass?: string;
    disabled?: boolean;
}

export default function CustomSelectWithColor({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    widthClass = 'w-[180px]',
    disabled,
}: CustomSelectProps) {
    return (
        <Select
            value={value || undefined}
            onValueChange={onChange}
            disabled={disabled}
        >
            <SelectTrigger className={widthClass}>
                {value == '0' ? placeholder : <SelectValue />}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <Checkbox
                                checked={false}
                                id="terms"
                                style={{ backgroundColor: option.color }}
                            />
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
