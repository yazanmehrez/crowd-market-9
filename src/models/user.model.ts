export interface UserModel {
  user_id: string ;
  email: string ;
  first_name: string ;
  last_name: string ;
  password: string ;
  currentPassword: string ;
  phone: string ;
  user_type: string ;
  joining_date?: string ;
  otp?: string ;
  active?: number ;
  profile?: string ;
}


