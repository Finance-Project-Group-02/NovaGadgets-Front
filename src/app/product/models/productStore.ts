import { Product } from "./Product";
import { Store } from "./Store";

export class ProductStore{
    id:number=0
    product: Product = new Product()
    store: Store = new Store()
    quantity: number = 0
    price: number = 0

}