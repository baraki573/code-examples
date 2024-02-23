import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class ImageService {

  http = inject(HttpClient);

  baseURL = `${environment.api_base}/image`;

  imageKeys$ = new BehaviorSubject<string[]>([]);

  get imageKeys() {
    return this.imageKeys$.asObservable();
  }

  get initObservable() {
    return this.getAllImageKeys();
  }

  getAllImageKeys(): Observable<string[]> {
    return this.http.get<string[]>(this.baseURL).pipe(
      tap(keys => this.imageKeys$.next(keys))
    );
  }

  getBase64Image(key: string): Observable<string | null> {
    const url = `${this.baseURL}/${key}`;

    return this.http.get(url, {responseType: "text"});
  }

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append("image", image);

    return this.http.post(this.baseURL, formData, {responseType: "text"}).pipe(
      tap(key => this.imageKeys$.next([...this.imageKeys$.value, key]))
    );
  }

  deleteImage(key: string): Observable<void> {
    const url = `${this.baseURL}/${key}`;

    return this.http.delete<void>(url).pipe(
      tap(() => this.imageKeys$.next(this.imageKeys$.value.filter(k => k !== key)))
    );
  }
}
