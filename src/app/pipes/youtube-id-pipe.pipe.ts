import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'youtubeIdPipe'
})
export class YoutubeIdPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
