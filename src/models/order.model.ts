import {AddressModel} from './address.model';
import {UserModel} from './user.model';
import {ProductModel} from "./product.model";
import {FarmerModel} from "./farmer.model";

export interface OrderModel {
  order_id: string;
  user_id: string;
  address_id: string;
  total_price: string;
  discount: string;
  tax: string;
  subtotal: string;
  date: string;
  farmer_id: string;
  status: number;
  comments: string;
  coupon: string;
  order_timing: string;
  delivery_charges: string;
  transaction_id: string;
  payment_type: string;
  isRate: number;
  crowdmarket_sub_orders: SubOrderModel[];
  farmer: FarmerModel;
  address: AddressModel;
  user: UserModel;



}


export interface OrderGuestGModel {
  order_id: string;
  user_id: string;
  address_id: string;
  total_price: string;
  tax: string;
  subtotal: string;
  date: string;
  farmer_id: string;
  status: number;
  comments: string;
  order_timing: string;
  delivery_charges: string;
  transaction_id: string;
  payment_type: string;
  isRate: number;
  discount: string;
  city_id: string;
  area: string;
  building: string;
  floor: string;
  phone: string;
  street: string;
  additional: string;
  type: string;
  landline: string;
  apartment: string;
  email: string;
  first_name: string;
  last_name: string;
  SubOrders: SubOrderModel[];

}


export interface SubOrderModel {
  sub_order_id: string;
  product_id: string;
  offer_id?: string;
  order_id: string;
  subscription_id: string;
  quantity: string;
  product: ProductModel;

}
