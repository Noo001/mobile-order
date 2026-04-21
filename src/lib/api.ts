const BASE_URL = 'https://app.tablecrm.com/api/v1';

export function createApiClient(token: string) {
    const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
        const url = new URL(`${BASE_URL}${endpoint}`);
        url.searchParams.append('token', token);
        const res = await fetch(url.toString(), {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API error ${res.status}: ${text}`);
        }
        return res.json();
    };

    return {
        searchCustomers: (phone: string) =>
            request<{ data: Customer[] }>(`/contragents/?search=${encodeURIComponent(phone)}`),

        getPayboxes: () => request<{ data: Paybox[] }>('/payboxes/'),

        getOrganizations: () => request<{ data: Organization[] }>('/organizations/'),

        getWarehouses: () => request<{ data: Warehouse[] }>('/warehouses/'),

        getPriceTypes: () => request<{ data: PriceType[] }>('/price_types/'),

        getProducts: () => request<{ data: Product[] }>('/nomenclature/'),

        createSale: (payload: any) =>
            request<any>('/docs_sales/', { method: 'POST', body: JSON.stringify(payload) }),
    };
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
}

export interface Paybox {
    id: number;
    name: string;
}

export interface Organization {
    id: number;
    name: string;
}

export interface Warehouse {
    id: number;
    name: string;
}

export interface PriceType {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    prices?: { price_type_id: number; price: number }[];
}