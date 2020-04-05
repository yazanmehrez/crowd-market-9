import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeliveryModel} from '../../../models/delivery.model';
import {DatePipe} from '@angular/common';
import {MealModel} from '../../../models/meal.model';
import {AppService} from '../../app.service';
import {OrderModel} from '../../../models/order.model';
import {BasketModel, Meal} from '../../../models/basket.model';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss'],
  providers: [DatePipe]

})
export class DeliveryDetailsComponent implements OnInit {
  deliveryForm: FormGroup;
  min = new Date();
  data: MealModel;
  allOrders: any[] = [];
  meals: any[] = [];

  constructor(private fb: FormBuilder,
              public datepipe: DatePipe,
              private appService: AppService) {
  }

  get f() {
    return this.deliveryForm.controls;
  }

  currentDateTime() {
    if (this.f.currentDate.value) {
      this.f.date.setValue(new Date());
      this.f.time.setValue(new Date());

    } else {
      this.f.date.setValue('');
      this.f.time.setValue('');
    }
  }

  prepareForm() {
    this.deliveryForm = this.fb.group({
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      foodComment: [''],
      deliveryComment: [''],
      currentDate: [''],
      type: ['', [Validators.required]],
    });
  }



  onSubmit() {
    let deliveryModel: DeliveryModel = this.deliveryForm.value as DeliveryModel;
    deliveryModel.date = this.datepipe.transform(this.f.date.value, 'MM-dd-yyyy');
    deliveryModel.time = this.datepipe.transform(this.f.time.value, 'hh:mm a');
    let order = new BasketModel();
    let meal = new Meal();
    meal.price = this.data.price;
    meal.meal_id = this.data.meal_id;
    meal.meal_name = this.data.name;
    meal.quantity = this.data.quantity;
    order.kitchen_id = this.data.Kitchen.kitchen_id;
    order.kitchen_name = this.data.Kitchen.name;
    this.meals.push(meal);
    order.meals = this.meals;
    this.allOrders.push(order);
    localStorage.setItem('orders' , JSON.stringify(this.allOrders) );
    this.appService.allOrders.next(this.allOrders);
  }


  ngOnInit() {
    this.prepareForm();
    this.appService.allOrders.subscribe(value =>{
      if(value){
        this.allOrders = value;

      }
    });

  }

}
