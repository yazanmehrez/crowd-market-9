import {MealModel} from './meal.model';
import {KitchenModel} from './kitchen.model';

export interface HomeModel {
  banners: BannerModel[];
  featuredKitchens: KitchenModel[];
  featuredMeals: MealModel[];
}


export interface BannerModel {
  banner_id: string;
  url: string;
  button: number;
  redirect: number;
  image: string;
  description: string;
}
