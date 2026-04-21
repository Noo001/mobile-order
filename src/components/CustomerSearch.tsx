import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Customer } from "../types";

export function CustomerSearch({
                                   api,
                                   onSelect,
                                   selected,
                               }: {
    api: any;
    onSelect: (customer: Customer | null) => void;
    selected?: Customer | null;
}) {
    const [phone, setPhone] = useState("");
    const [results, setResults] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        if (!phone.trim()) return;
        setLoading(true);
        try {
            const res = await api.searchCustomers(phone);
            setResults(res.data || []);
        } catch (err) {
            console.error(err);
            alert("Ошибка поиска клиентов");
        } finally {
            setLoading(false);
        }
    };

    const selectCustomer = (cust: Customer) => {
        onSelect(cust);
        setResults([]);
        setPhone("");
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Клиент</label>
            {selected ? (
                <div className="flex justify-between items-center p-2 border rounded bg-gray-50">
                    <span>{selected.name} ({selected.phone})</span>
                    <Button variant="ghost" size="sm" onClick={() => onSelect(null)}>Изменить</Button>
                </div>
            ) : (
                <>
                    <div className="flex gap-2">
                        <Input
                            type="tel"
                            placeholder="Телефон клиента"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <Button onClick={search} disabled={loading}>Поиск</Button>
                    </div>
                    {results.length > 0 && (
                        <div className="space-y-1 max-h-48 overflow-auto">
                            {results.map((cust) => (
                                <Card key={cust.id} className="cursor-pointer hover:bg-gray-50" onClick={() => selectCustomer(cust)}>
                                    <CardContent className="p-2">
                                        <div className="font-medium">{cust.name}</div>
                                        <div className="text-sm text-gray-500">{cust.phone}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
