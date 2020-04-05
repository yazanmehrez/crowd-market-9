import {KitchenModel} from './kitchen.model';

export interface OfferModel {
  offer_id: string;
  title: string;
  quantity?: number;
  description: string;
  type: string;
  status: string;
  price: number;
  image: string;
  is_delivery?: number;

  Kitchen: KitchenModel;

}
