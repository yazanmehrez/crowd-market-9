import {MealModel} from './meal.model';
import {ReviewsModel} from './reviews.model';
import {UserModel} from './user.model';

export interface KitchenModel {
  kitchen_id: string;
  description: string;
  featured: number;
  name: string;
  image: string;
  user_id: string;
  category_id: string;
  final_quality_rate: number;
  final_delivery_rate: number;
  final_value_rate: number;
  final_order_pakaging_rate: number;
  final_rate: number;
  served_count: number;
  end_time: string;
  start_time: string;
  busy: number;
  Menus?: MenuModel[];
  reviews?: ReviewsModel[];
  user?: UserModel;

}


export interface MenuModel {
  menu_id: string;
  name: string;
  active: number;
  Meals: MealModel[];
}
