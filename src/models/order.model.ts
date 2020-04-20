import {AddressModel} from './address.model';
import {UserModel} from './user.model';
import {ProductModel} from "./product.model";
import {FarmerModel} from "./farmer.model";

export interface OrderModel {
  order_id: string;
  user_id: string;
  address_id: string;
  total_price: string;
  date: string;
  farmer_id: string;
  status: string;
  comments: string;
  order_timing: string;
  delivery_charges: string;
  transaction_id: string;
  payment_type: string;
  isRate: number;
  Crowdmarket_sub_orders: SubOrderModel[];
  Farmer: FarmerModel;
  Address: AddressModel;
  user: UserModel;
}


export interface SubOrderModel {
  sub_order_id: string;
  product_id: string;
  offer_id?: string;
  order_id: string;
  subscription_id: string;
  quantity: string;
  Product: ProductModel;

}
