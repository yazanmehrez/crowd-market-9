import {MealModel} from './meal.model';
import {KitchenModel} from './kitchen.model';
import {AddressModel} from './address.model';
import {UserModel} from './user.model';

export interface OrderModel {
  order_id: string;
  user_id: string;
  address_id: string;
  totalPrice: string;
  date: string;
  kitchen_id: string;
  status: string;
  alkebetna_sub_orders: SubOrderModel[];
  Kitchen: KitchenModel;
  Address: AddressModel;
  user: UserModel;
}


export interface SubOrderModel {
  sub_order_id: string;
  order_id: string;
  meal_id: string;
  quantity: string;
  Meal: MealModel[];

}
