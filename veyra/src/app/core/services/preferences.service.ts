import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private _showActivityLog = signal<boolean>(localStorage.getItem('showActivityLog') !== 'false');

  get showActivityLog() {
    return this._showActivityLog();
  }

  setActivityLog(value: boolean) {
    this._showActivityLog.set(value);
    localStorage.setItem('showActivityLog', String(value));
  }
}
