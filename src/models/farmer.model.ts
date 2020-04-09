import {ProductModel} from './product.model';

export interface FarmerModel {
  farmer_id: string;
  title: string;
  lng: string;
  lat: string;
  description: string;
  Products?: ProductModel[];
}
