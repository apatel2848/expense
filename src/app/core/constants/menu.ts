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
            { label: 'Data entry', route: '/view/config/data-entry' }
          ],
        }, 
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Reports',
          route: '/view/report',
          children: [
            { label: 'Weekly Food Report', route: '/view/report/weeklyfoodreport' }
          ],
        }
      ],
    }
  ];
}
