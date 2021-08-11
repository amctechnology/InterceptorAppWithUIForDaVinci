import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDashes'
})
export class RemoveDashesPipe implements PipeTransform {

  transform(value: string): string {
    // let res = "";

    // for (let word of value.split('_')) {
    //   res += word.toLowerCase() + ' ';
    // }

    // return res.trimRight();

    return value.replace(/[_]/g, ' ');
  }

}
