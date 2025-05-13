import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
  import { BookService } from '../../core/services/book.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { Book } from '../../core/models/book';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sales-by-category',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './sales-by-category.component.html',
  styleUrls: ['./sales-by-category.component.scss']
})
export class SalesByCategoryComponent implements OnInit {

  chart!: Chart;

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    forkJoin({
      books: this.bookService.getBooks(),
      categories: this.categoryService.getCategories()
    }).subscribe(({ books, categories }: { books: Book[], categories: Category[] }) => {
      

      const approvedBooks = books.filter(b => b.isApproved);

      const categoryMap: { [id: string]: string } = {};
      categories.forEach(cat => {
        categoryMap[cat.id] = cat.name;
      });

      // Aggregate sales by category
      const categorySales: { [categoryId: string]: number } = {};
      approvedBooks.forEach(book => {
        const total = parseFloat(book.price) * parseInt(book.quantity);
        if (categorySales[book.categoryId]) {
          categorySales[book.categoryId] += total;
        } else {
          categorySales[book.categoryId] = total;
        }
      });

      // Prepare chart data
      const chartData = Object.entries(categorySales).map(([categoryId, total]) => ({
        name: categoryMap[categoryId] || `Category ${categoryId}`,
        y: total,
      }));

      // Create chart
      this.chart = new Chart({
        chart: {
          type: 'pie',
          height: 325
        },
        title: {
          text: 'Category wise sales'
        },
        series: [{
          type: 'pie',
          data: chartData
        }],
        credits: {
          enabled: false
        }
      });
    });
  }
}
