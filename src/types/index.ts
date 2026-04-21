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

export interface CartItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}
