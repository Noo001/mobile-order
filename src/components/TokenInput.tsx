import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

export function TokenInput({ onTokenSubmit }: { onTokenSubmit: (token: string) => void }) {
    const [token, setToken] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (token.trim()) onTokenSubmit(token.trim());
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-4">
                            <h1 className="text-xl font-semibold">TableCRM</h1>
                            <p className="text-sm text-gray-500">Введите токен кассы</p>
                        </div>
                        <Input
                            placeholder="Токен (например, af1874616430...)"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <Button type="submit" className="w-full">Войти</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
