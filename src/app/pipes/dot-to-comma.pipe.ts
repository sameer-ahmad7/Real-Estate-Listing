import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dotToComma',
  standalone: true
})

export class DotToCommaPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\./g, ','); // Replaces all dots with commas
  }
}
