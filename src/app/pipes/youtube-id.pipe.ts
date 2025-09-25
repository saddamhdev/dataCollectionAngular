import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'youtubeId',
  standalone: true
})
export class YoutubeIdPipe implements PipeTransform {
  transform(url: string): string {
    if (!url) return '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }
}
