import {Category} from './category';
import {KitchenModel} from './kitchen.model';

export interface MealModel {
  meal_id: string;
  name: string;
  menu_id: string;
  description: string;
  featured: number;
  image: string;
  price_weekly: number;
  type: number;
  price: number;
  isRate: number;
  final_rate: number;
  price_monthly: number;
  total_served: number;
  quantity: number;
  is_delivery?: number;
  Category?: Category;
  Kitchen?: KitchenModel;
  Favourite?: FavouriteModel;
}


export class FavouriteModel{
  favourite_id: string;
  user_id: string;
  meal_id?: string;
  date: string;
  status?: number;
  Meal?: MealModel;
}

export interface TypeModel {
  type_id: string;
  name: string;
}
