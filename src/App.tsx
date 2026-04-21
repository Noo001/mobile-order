import { useState, useEffect } from "react";
import { TokenInput } from "./components/TokenInput";
import { CustomerSearch } from "./components/CustomerSearch";
import { SelectField } from "./components/SelectField";
import { ProductList } from "./components/ProductList";
import { SubmitButtons } from "./components/SubmitButtons";
import { createApiClient } from "./lib/api";
import { Customer, Paybox, Organization, Warehouse, PriceType, CartItem } from "./types";

function App() {
    const storedToken = localStorage.getItem("token");
    const [token, setToken] = useState<string>(storedToken && storedToken !== "undefined" ? storedToken : "");
    const [api, setApi] = useState<any>(null);

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [paybox, setPaybox] = useState<Paybox | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
    const [priceType, setPriceType] = useState<PriceType | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            setApi(createApiClient(token));
        }
    }, [token]);

    const handleTokenSubmit = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const validate = () => {
        if (!customer) {
            alert("Выберите клиента");
            return false;
        }
        if (!paybox) {
            alert("Выберите счёт");
            return false;
        }
        if (!organization) {
            alert("Выберите организацию");
            return false;
        }
        if (!warehouse) {
            alert("Выберите склад");
            return false;
        }
        if (!priceType) {
            alert("Выберите тип цен");
            return false;
        }
        if (cart.length === 0) {
            alert("Добавьте хотя бы один товар");
            return false;
        }
        return true;
    };

    const createSale = async (conducted: boolean) => {
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = {
                contragent_id: customer!.id,
                paybox_id: paybox!.id,
                organization_id: organization!.id,
                warehouse_id: warehouse!.id,
                price_type_id: priceType!.id,
                positions: cart.map((item) => ({
                    nomenclature_id: item.id,
                    count: item.quantity,
                    price: item.price,
                })),
                is_conducted: conducted,
            };
            const result = await api.createSale(payload);
            alert(`Продажа успешно ${conducted ? "проведена" : "создана"}! ID: ${result.id}`);
        } catch (err: any) {
            alert("Ошибка: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return <TokenInput onTokenSubmit={handleTokenSubmit} />;
    }

    if (!api) {
        return <div className="p-4">Загрузка API...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-4 pb-24 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-xl font-bold text-center">Оформление заказа</h1>

            <CustomerSearch api={api} onSelect={setCustomer} selected={customer} />
            <SelectField label="Счёт" fetch={api.getPayboxes} value={paybox} onChange={setPaybox} />
            <SelectField label="Организация" fetch={api.getOrganizations} value={organization} onChange={setOrganization} />
            <SelectField label="Склад" fetch={api.getWarehouses} value={warehouse} onChange={setWarehouse} />
            <SelectField label="Тип цен" fetch={api.getPriceTypes} value={priceType} onChange={setPriceType} />

            {priceType && (
                <ProductList api={api} priceTypeId={priceType.id} onCartChange={setCart} />
            )}

            <SubmitButtons
                onCreate={() => createSale(false)}
                onCreateAndConduct={() => createSale(true)}
                disabled={loading}
            />
        </div>
    );
}

export default App;
