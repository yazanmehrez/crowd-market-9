import {MealModel} from './meal.model';

export class BasketModel {
  kitchen_name: string;
  meals: any[];
  kitchen_id: string;
}


export class Meal{
  meal_id: string;
  meal_name: string;
  quantity: number;
  price: number;
  offer_id: string;
  delivery_charges: number;
}
