// price.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
  standalone: true
})
export class PricePipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) return '$0.00';
    return `$${value.toFixed(2)}`;
  }
}