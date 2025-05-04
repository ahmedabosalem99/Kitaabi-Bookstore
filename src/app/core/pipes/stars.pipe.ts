// stars.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stars',
  standalone: true
})
export class StarsPipe implements PipeTransform {
  transform(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fa fa-star"></i>';
    if (hasHalfStar) stars += '<i class="fa fa-star-half-o"></i>';
    for (let i = 0; i < emptyStars; i++) stars += '<i class="fa fa-star-o"></i>';
    
    return stars;
  }
}