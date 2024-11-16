export interface FacturaSummary {
    id: number;
    state: string;
    startDate: string;
    paymentDate: string;
    discountDate: string;
    retention: number;
    effectiveRate: number;
    rateTerm: number;
    dayByYear: number;
    totalInvoiced: number;
    nominalValue: number;
    initialCosts: number;
    finalCosts: number;
    days: number;
    newEffectiveRate: number;
    discountedRate: number;
    discount: number;
    netWorth: number;
    valueDelivered: number;
    valueReceived: number;
    tcea: number;
}
