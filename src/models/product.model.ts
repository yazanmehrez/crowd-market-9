import {FarmerModel} from './farmer.model';

export interface ProductModel {
  product_id: string;
  name: string;
  description: string;
  price: number;
  image: number;
  type: number;
  active: number;
  final_rate: number;
  new_price: number;
  discount: number;
  quantity: number;
  order_quantity: number;
  Farmer: FarmerModel;
  Unit: UnitModel;
  Box_Products?: BoxProduct[];
  Favourite?: FavouriteModel;
  Country: CountryModel;


}


export class FavouriteModel {
  favourite_id: string;
  product_id: string;
  status: number;
  Product: ProductModel;
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
