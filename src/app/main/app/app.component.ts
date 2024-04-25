import { Component } from '@angular/core'; 
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common'; 
import { ResponsiveHelperComponent } from '../../shared/components/responsive-helper/responsive-helper.component';
import { ThemeService } from '../../core/services/theme.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html', 
  standalone: true,
  imports: [NgClass, RouterOutlet, ResponsiveHelperComponent],
})
export class AppComponent {
  title = 'Angular Tailwind';

  constructor(public themeService: ThemeService) {}
}
