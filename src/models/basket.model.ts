export class BasketModel {
  farmer_name: string;
  products: any[];
  farmer_id: string;
}



export class Order {
  product_name: string;
  product_id: string;
  farmer_id: string;
  quantity: string;
  order_quantity: number;
  price: number;
  image: string;
  delivery_charges: number;
}
