export interface PostMedia {
  id: number;
  post:number;
  media_details: {
    width: number,
    height: number,
    sizes: {
      thumbnail: {
        width: number,
        height: number,
        sources: {
          'image/jpeg': {
            source_url: string;
          },
          'image/webp': {
            source_url: string;
          }
        },
        source_url: string;
      },
      full: {
        width: number,
        height: number,
        source_url: string
      }
    }
  }
}

export interface RepeatableMedia {
  thumbnail: string;
  fullImage: string;
}
