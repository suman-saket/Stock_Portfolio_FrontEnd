export interface Stock {
    _id: string;
    userId: string;
    stockName: string;
    purchasePrice: number;
    quantity: number;
    investment: number;
    portfolio: number;
    exchangeCode: "NSE" | "BSE";
    sector: string;
    cmp?: number;
    peRatio?: number;
    earnings?: number;
}

export interface CellInfo {
    getValue: () => string | number | undefined;
}

export interface TableColumn {
    accessorKey: keyof Stock;
    header: string;
    cell?: (info: CellInfo) => string;
}
