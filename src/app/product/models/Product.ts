import { CategoriaClass } from "../../categoria/models/categoria"
import { ProductStore } from "./productStore"

export class Product{
    id:number=0
    name: string=""
    image:string=""
    details: string=""
    categoryName: CategoriaClass = new CategoriaClass()
    quantity: number=0
    price: number=0
    storeName: ProductStore = new ProductStore()
}