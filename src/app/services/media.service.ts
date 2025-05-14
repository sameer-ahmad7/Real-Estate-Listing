import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PostMedia, RepeatableMedia } from '../model/media.model';
import { combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiURL = `${environment.apiURL}/wp/v2/media`;

  constructor(private http: HttpClient) { }

  getMediaDetails(id: number) {
    return this.http.get<PostMedia>(`${this.apiURL}/${id}`);
  }

  getThumbnailImages(ids: number[]) {
    const obs$: Observable<PostMedia>[] = [];
    for (const id of ids) {
      obs$.push(this.http.get<PostMedia>(`${this.apiURL}/${id}`));
    }

    return combineLatest(obs$).pipe(map(res => {
      const repeatableMedias: RepeatableMedia[] = [];
      for (const obj of res) {
        const repeatableMedia: RepeatableMedia = {
          thumbnail: obj.media_details.sizes.thumbnail.source_url,
          fullImage: obj.media_details.sizes.full.source_url
        }
        repeatableMedias.push(repeatableMedia);
      }
      return repeatableMedias;
    }))

  }

}
