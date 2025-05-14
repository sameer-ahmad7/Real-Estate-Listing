import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secureUrl'
})
export class SecureUrlPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace('http://', 'https://') : value;
  }
}
