import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: '',
      separator: false,
      items: [ 
        {
          icon: 'assets/icons/heroicons/outline/setting-web-website-svgrepo-com.svg',
          label: 'Configurations',
          route: '/view/config',
          children: [
            { label: 'Locations', route: '/view/config/location' },
            { label: 'Purchase', route: '/view/config/purchase' }
          ],
        }, 
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Reports',
          route: '/view/report',
          children: [
            { label: 'Weekly Food Report', route: '/view/report/weekfoodreport' }
          ],
        }
      ],
    }
  ];
}
