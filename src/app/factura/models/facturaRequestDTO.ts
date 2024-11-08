export interface FacturaRequestDTO{
    state: String,
    startDate: String,
    paymentDate: String,
    discountDate: String,
    retention: number,
    effectiveRate: number,
    rateTerm: number,
    dayByYear: String,
    initialCosts: number[],
    finalCosts: number[]
}