import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

 // public queryId:string ;

  constructor(private _httpClient: HttpClient) { }

  get(url: string): Observable<any> {
    return this._httpClient.get(url);
  }

  postImages(url: string, model: any): Observable<any> {
    return this._httpClient.post(url, model);
  }
 

  post(url: string, model: any): Observable<any> {
    const body = JSON.stringify(model);
    let httpHeaders = new HttpHeaders()
      .set('content-Type', 'application/json');
    let options = {
      headers: httpHeaders
    };
    return this._httpClient.post(url, body, options);
  }

}
