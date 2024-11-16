import { CostDTO } from "./costDTO";

export interface FacturaRequestDTO{
    state: String,
    startDate: String,
    paymentDate: String,
    discountDate: String,
    retention: number,
    type: String,
    effectiveRate: number,
    capitalization: number,
    rateTerm: number,
    dayByYear: String,
    initialCosts: CostDTO[],
    finalCosts: CostDTO[]
}