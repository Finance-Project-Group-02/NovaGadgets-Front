import { CategoriaClass } from "../../categoria/models/categoria"

export class Product{
    id:number=0
    name: string=""
    image:string=""
    details: string=""
    category: CategoriaClass = new CategoriaClass()
}