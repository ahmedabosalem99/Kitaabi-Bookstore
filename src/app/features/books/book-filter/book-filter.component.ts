import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
// import { Category } from '../../../core/models/category';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookFilterService } from '../../../core/services/book-filter.service';
import { Category } from '../../../core/models/category';

@Component({
  selector: 'app-book-filter',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-filter.component.html',
  styleUrl: './book-filter.component.css'
})
export class BookFilterComponent implements OnInit {

  constructor(private categoryService: CategoryService, private filterService: BookFilterService){}

  categories: Category[] = [];
  isLoading: Boolean = true;
  error: string | null = null;


  selectedAuthors: any = {};
  selectedCategories: { [key: string]: boolean } = {};
  // selectedPrices: any = {};
  selectedPrices: { [key: string]: boolean } = {};


  priceRanges = [
    { label: '< $10', value: '0-10' },
    { label: '$10 - $20', value: '10-20' },
    { label: '$20 - $50', value: '20-50' },
    { label: '> $50', value: '50-1000' }
  ];

  @Output() filtersApplied = new EventEmitter<any>();

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories. Please try again later.';
        this.isLoading = false;
        console.log(err);
      }
    });
  }

  applyFilters(): void {
    const selectedFilters = {
      categories: this.getSelectedItems(this.selectedCategories),
      prices: this.getSelectedItems(this.selectedPrices)
    };
    console.log(selectedFilters);
    this.filterService.updateFilters(selectedFilters);
    this.filtersApplied.emit(selectedFilters);
  }

  // applyFilters(): void {
  //   const selectedFilters = {
  //     categories: this.getSelectedItems(this.selectedCategories),
  //   };
  //   this.filterService.updateFilters(selectedFilters);
  //   this.filtersApplied.emit(selectedFilters); // Emit the event
  // }

  // applyFilters(): void {
  //   const selectedFilters = {
  //     // authors: this.getSelectedItems(this.selectedAuthors),
  //     categories: this.getSelectedItems(this.selectedCategories)
  //     // prices: this.getSelectedItems(this.selectedPrices),
  //   };
  //   console.log(selectedFilters);
  //   this.filterService.updateFilters(selectedFilters);  // Emit the selected filters to the parent component
  // }

  onFilterChange(): void {
    // Optionally, you can apply filters immediately when checkboxes change
    this.applyFilters();
  }

  // resetFilters(): void {
  //   this.selectedAuthors = {};
  //   this.selectedCategories = {};
  //   this.selectedPrices = {};
  //   this.applyFilters();  // Reset filters to parent
  // }

  resetFilters(): void {
    this.selectedAuthors = {};
    this.selectedCategories = {};
    this.selectedPrices = {};
    this.applyFilters();
  }

  private getSelectedItems(selections: any): string[] {
    console.log(Object.keys(selections).filter(key => selections[key]))
    return Object.keys(selections).filter(key => selections[key]);
  }

  // onCategoryChange(categoryId: string, event: Event): void {
  //   // Cast the event.target to HTMLInputElement
  //   const target = event.target as HTMLInputElement;

  //   if (target.checked) {
  //     this.selectedCategories.push(categoryId); // Add the category ID if checked
  //   } else {
  //     const index = this.selectedCategories.indexOf(categoryId);
  //     if (index > -1) {
  //       this.selectedCategories.splice(index, 1); // Remove it if unchecked
  //     }
  //   }

  //   this.filterService.updateFilters({
  //     categories: this.selectedCategories.map(String)
  //   });

  // }

}
