export interface RateModel {
  order_id: string;
  driver_id: string;
  driverRate: number;
  kitchen_id: string;
  order_pakaging_rate: number;
  delivery_rate: number;
  value_rate: number;
  quality_rate: string;
  comment: string;
  meals_rates: MealRateModel[];


}
export interface MealRateModel {
  meal_id: string;
  final_rate: number;

}
