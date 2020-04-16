import {ProductModel} from './product.model';
import {KitchenModel} from './kitchen.model';

export interface Category {
  category_id: string;
  name: string;
  // name_en?: string;
  // name_ar?: string;
  active: number;
  image?: string;
  Products?: ProductModel[];
  kitchens?: KitchensModel;


}


export interface KitchensModel {
  count: number;
  kitchens: KitchenModel[];
}


export interface ContactModel {
  name: string;
  email: string;
  message: string;
}

