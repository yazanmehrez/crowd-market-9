import {ProductModel} from './product.model';

export interface Category {
  category_id: string;
  name: string;
  active: number;
  image?: string;
  Products?: ProductModel[];


}



export interface ContactModel {
  name: string;
  email: string;
  message: string;
}

