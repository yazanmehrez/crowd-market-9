import {ProductModel} from './product.model';

export interface FarmerModel {
  farmer_id: string;
  title: string;
  lng: string;
  lat: string;
  description: string;
  location_address: string;
  image: string;
  featured: string;
  user_id: string;
  final_rate: number;
  quality_rate: number;
  value_rate: number;
  delivery_rate: number;
  Products?: ProductModel[];
}
