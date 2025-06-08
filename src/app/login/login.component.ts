import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    CommonModule
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private http: HttpClient) {}

  onSubmit(event: Event) {
    event.preventDefault();

    const body = new URLSearchParams();
    body.set('username', this.username);
    body.set('password', this.password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    this.http.post('/login', body.toString(), { headers, observe: 'response' })
      .subscribe({
        next: response => {
          if (response.status === 200) {
            // Auth réussi, rediriger ou afficher message
            alert('Connexion réussie !');
            // Ici tu peux rediriger vers page sécurisée
          }
        },
        error: err => {
          this.error = 'Échec de connexion';
        }
      });
  }
}
