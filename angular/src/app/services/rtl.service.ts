// rtl.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RtlService {
  private rtlDirectionSubject = new BehaviorSubject<boolean>(false);
  rtlDirection$ = this.rtlDirectionSubject.asObservable();

  setDirection(isRtl: boolean) {
    this.rtlDirectionSubject.next(isRtl);
  }

  getCurrentDirection() {
    return this.rtlDirectionSubject.value;
  }
}
