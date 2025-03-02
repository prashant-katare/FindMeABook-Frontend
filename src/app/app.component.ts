import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/Layouts/header/header.component';
import { FooterComponent } from './components/Layouts/footer/footer.component';
import { NotFoundComponent } from "./components/Pages/not-found/not-found.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FindMeABook';
}
