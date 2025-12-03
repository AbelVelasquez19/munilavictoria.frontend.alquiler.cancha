import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScriptLoaderService } from './shared/scripts/niubiz-loader.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'complejoDeportivo';

  constructor(private scriptLoader: ScriptLoaderService) {}

   ngOnInit() {
    this.scriptLoader.loadScript(environment.checkoutJs)
      .then(() => {
        console.log('Niubiz script cargado:', environment.checkoutJs);
      })
      .catch(err => console.error(err));
  }
}
