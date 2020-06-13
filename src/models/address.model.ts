export interface AddressModel {
  address_id: string;
  user_id: string;
  landline: string;
  city_id: string;
  area: string;
  building: string;
  floor: string;
  phone: string;
  street: string;
  additional: string;
  type: string;
  apartment: string;
  city: CityModel;
}


export interface CityModel {
  city_id: string;
  name: string;
  active: number;
}
