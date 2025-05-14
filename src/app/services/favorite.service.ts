import { Injectable } from '@angular/core';
import { Home } from '../model/home.model';
import { Plot } from '../model/plot.model';
import { BusinessProperty } from '../model/business-property.model';
import { HolidayHome } from '../model/holiday-home.model';
import { DataTypes } from '../model/filter.model';
import { Favorite } from '../model/favorite.model';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private _storageKey = 'favorites';

  constructor() { }

  async saveFavorites(favorites: Favorite[]) {
    await Preferences.set({
      key: this._storageKey,
      value: JSON.stringify(favorites),
    });
  }

  async getFavorites(): Promise<Favorite[]> {
    const { value } = await Preferences.get({ key: this._storageKey });
    return value ? JSON.parse(value) : [];
  }

  async addFavorite(item: Favorite) {
    let favorites = await this.getFavorites();
    favorites.push(item);
    await this.saveFavorites(favorites);
  }

  async removeFavorite(itemId: string) {
    let favorites = await this.getFavorites();
    favorites = favorites.filter(item => item.id !== itemId);
    await this.saveFavorites(favorites);
  }

  async clearFavorites() {
    await Preferences.remove({ key: this._storageKey });
  }


}
