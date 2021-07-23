import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  subscribed = false;
  title = 'Uragsha';
  email = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  subscribe(): void {
    this.http.get(environment.subscribeUrl + '?email=' + this.email).subscribe(
      (res) => {
        console.log(res);
        this.subscribed = true;
      },
      (res: HttpErrorResponse) => {
        console.log(res.error);
      }
    );
  }
}
