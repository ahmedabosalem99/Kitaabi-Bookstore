import { Component, OnInit } from '@angular/core';
import { TopWidgetsComponent } from '../top-widgets/top-widgets.component';
import {SalesByMonthComponent} from '../sales-by-month/sales-by-month.component'
import { TopThreeProductsComponent } from '../top-three-products/top-three-products.component';
import { LastFewTransactionsComponent } from '../last-few-transactions/last-few-transactions.component';
import { SalesByCategoryComponent } from "../sales-by-category/sales-by-category.component";
@Component({
  selector: 'app-main',
  standalone:true ,
  imports: [TopWidgetsComponent, SalesByMonthComponent, TopThreeProductsComponent, LastFewTransactionsComponent, SalesByCategoryComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
