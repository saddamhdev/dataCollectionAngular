import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGlobal'
})
export class FilterGlobalPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return Object.values(item).some(val => {
        if (Array.isArray(val)) {
          return val.some(innerVal => 
            String(innerVal).toLowerCase().includes(searchText)
          );
        }
        return String(val).toLowerCase().includes(searchText);
      });
    });
  }
}
