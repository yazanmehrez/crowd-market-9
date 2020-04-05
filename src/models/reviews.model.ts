import {UserModel} from './user.model';

export interface ReviewsModel {
  review_id: string;
  user_id: string;
  kitchen_id: string;
  meal_id: string;
  comment: string;
  order_pakaging_rate: number;
  value_rate: number;
  delivery_rate: number;
  final_rate: number;
  meal_rate: number;
  date: string;
  user: UserModel;
}
