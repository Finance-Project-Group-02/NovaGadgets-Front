export interface FacturaResponseDTO{
    startDate: String,
    totalInvoiced: number,
    paymentDate: String,
    days: number,
    retention: number,
    newEffectiveRate: number,
    discountedRate: number,
    discount: number,
    initialCosts: number,
    finalCosts: number,
    netWorth: number,
    valueDelivered: number,
    valueReceived: number,
    tcea: number
}