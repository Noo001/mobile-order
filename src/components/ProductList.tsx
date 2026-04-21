import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Product, CartItem } from "../types";

export function ProductList({
                                api,
                                priceTypeId,
                                onCartChange,
                            }: {
    api: any;
    priceTypeId?: number;
    onCartChange: (cart: CartItem[]) => void;
}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .getProducts()
            .then((res: { data: Product[] }) => {
                setProducts(res.data || []);
            })
            .catch((err: Error) => {
                console.error("Ошибка загрузки товаров", err);
                alert("Не удалось загрузить товары");
            })
            .finally(() => setLoading(false));
    }, [api]);

    const getPrice = (product: Product) => {
        if (!priceTypeId) return 0;
        const priceObj = product.prices?.find((p) => p.price_type_id === priceTypeId);
        return priceObj?.price || 0;
    };

    const addToCart = (product: Product) => {
        const price = getPrice(product);
        const existing = cart.find((i) => i.id === product.id);
        if (existing) {
            const newCart = cart.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            );
            setCart(newCart);
            onCartChange(newCart);
        } else {
            const newCart = [
                ...cart,
                { id: product.id, name: product.name, quantity: 1, price },
            ];
            setCart(newCart);
            onCartChange(newCart);
        }
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            const newCart = cart.filter((i) => i.id !== id);
            setCart(newCart);
            onCartChange(newCart);
        } else {
            const newCart = cart.map((i) => (i.id === id ? { ...i, quantity } : i));
            setCart(newCart);
            onCartChange(newCart);
        }
    };

    if (loading) return <div>Загрузка товаров...</div>;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Товары</label>
                <div className="max-h-64 overflow-auto space-y-1">
                    {products.map((product) => (
                        <Card key={product.id} className="cursor-pointer" onClick={() => addToCart(product)}>
                            <CardContent className="p-2 flex justify-between items-center">
                                <span>{product.name}</span>
                                <Button size="sm" variant="outline">
                                    +
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {cart.length > 0 && (
                <div className="border rounded p-2 space-y-2">
                    <h4 className="font-medium">Корзина</h4>
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="flex-1">{item.name}</span>
                            <Input
                                type="number"
                                className="w-16 mx-2"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, +e.target.value)}
                                min={1}
                            />
                            <span className="w-20 text-right">{item.price} ₽</span>
                            <span className="w-24 text-right">{item.quantity * item.price} ₽</span>
                        </div>
                    ))}
                    <div className="text-right font-bold pt-2 border-t">
                        Итого: {cart.reduce((sum, i) => sum + i.price * i.quantity, 0)} ₽
                    </div>
                </div>
            )}
        </div>
    );
}
