import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByBatch',
  standalone: true
})
export class FilterByBatchPipe implements PipeTransform {
  transform(images: any[], batch: string): any[] {
    if (!images || !batch || batch === 'All') return images;
    return images.filter(img => img.batch === batch);
  }
}
