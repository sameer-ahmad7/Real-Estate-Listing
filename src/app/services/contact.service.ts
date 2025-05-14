import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiURL=`${environment.apiURL}/contact-form-7/v1/contact-forms/15483/feedback`

  constructor(private http:HttpClient) { }

  submitForm(formData:FormData){
    return this.http.post(this.apiURL,formData);
  }
}
