export class BasketModel {
  farmer_name: string;
  products: any[];
  farmer_id: string;
}


export class Meal {
  meal_id: string;
  meal_name: string;
  quantity: number;
  price: number;
  offer_id: string;
  delivery_charges: number;
}


export class Order {
  product_name: string;
  product_id: string;
  quantity: string;
  order_quantity: number;
  price: number;
  image: string;

  // delivery_charges: number;
}
