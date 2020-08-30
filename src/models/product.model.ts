import {FarmerModel} from './farmer.model';
import {Category, CategoryTypeModel, TypeModel} from "./category";

export interface ProductModel {
  product_id: string;
  name: string;
  description: string;
  price: number;
  image: number;
  active: number;
  final_rate: number;
  new_price: number;
  discount: number;
  quantity: number;
  order_quantity: number;
  quantity_start: number;
  quantity_increase: number;
  max_quantity: number;
  farmer: FarmerModel;
  unit: UnitModel;
  type: TypeModel;
  box_products?: BoxProduct[];
  favourite?: FavouriteModel;
  country: CountryModel;
  category: Category;


}


export class FavouriteModel {
  favourite_id: string;
  product_id: string;
  status: number;
  product: ProductModel;
}




export class CountryModel {
  country_id: string;
  image: string;
  name: string;
}





export interface BoxProduct {
  box_product_id: string;
  box_id: string;
  product_id: string;
  Product: ProductModel[];
}

export interface UnitModel {
  unit_id: string;
  name: string;
}
