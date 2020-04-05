import {KitchenModel} from './kitchen.model';

export interface Category {
  category_id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  active: number;
  image: string;
  kitchens?: KitchensModel;
}


export interface KitchensModel{
  count: number;
  kitchens: KitchenModel[];
}
