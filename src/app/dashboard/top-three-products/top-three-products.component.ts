import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
  import { BookService } from '../../core/services/book.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { Book } from '../../core/models/book';
import { ChartModule } from 'angular-highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-three-products',
  standalone: true ,
  imports: [ChartModule , CommonModule],
 
  templateUrl: './top-three-products.component.html',
  styleUrls: ['./top-three-products.component.css']
})



export class TopThreeProductsComponent implements OnInit {
  chart!: Chart;
  categories: Category[] = [];

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;

      this.bookService.getBooks().subscribe(books => {
        const top3 = [...books]
          .sort((a, b) => Number(b.quantity) - Number(a.quantity))
          .slice(0, 3);
        this.initChart(top3);
      });
    });
  }

  getCategoryName(id: string): string {
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  }

  getColor(index: number): string {
    const colors = ['#044342', '#7e0505', '#ed9e20'];
    return colors[index % colors.length];
  }

  initChart(books: Book[]): void {
    this.chart = new Chart({
      chart: {
        type: 'bar',
        height: 225
      },
      title: {
        text: 'Top 3 Books by Sales'
      },
      xAxis: {
        categories: books.map(book => `${book.bookName} (${this.getCategoryName(book.categoryId)})`)
      },
      yAxis: {
        title: {
          text: 'Quantity Sold'
        }
      },
      series: [
        {
          type: 'bar',
          showInLegend: false,
          data: books.map((book, index) => ({
            name: book.bookName,
            y: Number(book.quantity),
            color: this.getColor(index)
          }))
        }
      ],
      credits: {
        enabled: false
      }
    });
  }
}
