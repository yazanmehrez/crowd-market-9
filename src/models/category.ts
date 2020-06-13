import {ProductModel} from './product.model';

export interface Category {
  category_id: string;
  name: string;
  active: number;
  image?: string;
  products?: ProductModel[];
  category_types: CategoryTypeModel[];


}



export interface ContactModel {
  name: string;
  email: string;
  message: string;
}

export interface CategoryTypeModel {
  category_type_id: number;
  type_id: number;
  category_id: number;
  type: TypeModel;

}

export interface TypeModel {
  name: string;
  type_id: string;
  active?: number;

}
