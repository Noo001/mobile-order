import { useEffect, useState } from "react";
import { Select } from "./ui/select";

export function SelectField({
                                label,
                                fetch,
                                value,
                                onChange,
                            }: {
    label: string;
    fetch: () => Promise<{ data: any[] }>;
    value: any;
    onChange: (item: any) => void;
}) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch()
            .then((res) => {
                setItems(res.data || []);
            })
            .catch((err) => {
                console.error(`Ошибка загрузки ${label}:`, err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [fetch, label]);

    if (loading) return <div className="h-10 animate-pulse bg-gray-200 rounded"></div>;
    if (error) return <div className="text-red-500 text-sm">Ошибка: {error}</div>;
    if (items.length === 0) return <div className="text-gray-500 text-sm">Нет данных</div>;

    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <Select
                value={value?.id || ""}
                onChange={(e) => {
                    const selected = items.find((i) => i.id === Number(e.target.value));
                    onChange(selected || null);
                }}
            >
                <option value="">-- Выберите --</option>
                {items.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </Select>
        </div>
    );
}
