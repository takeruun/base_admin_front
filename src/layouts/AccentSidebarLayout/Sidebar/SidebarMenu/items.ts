import type { ReactNode } from 'react';

import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CategoryIcon from '@mui/icons-material/Category';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ImageIcon from '@mui/icons-material/Image';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  badgeTooltip?: string;

  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: 'General',
    items: [
      {
        name: 'お客様一覧',
        icon: AssignmentIndTwoToneIcon,
        link: '/dashboards/customers'
      },
      {
        name: 'カルテ一覧',
        icon: ContentCutIcon,
        link: '/dashboards/orders'
      },
      {
        name: '予約カレンダー',
        icon: CalendarTodayIcon,
        link: '/dashboards/calendar'
      },
      {
        name: '画像保管',
        icon: ImageIcon,
        link: '/dashboards/image_saves'
      }
    ]
  },
  {
    heading: 'Product',
    items: [
      {
        name: 'コース一覧',
        icon: AssignmentIcon,
        link: '/dashboards/courses'
      },
      {
        name: '商品一覧',
        icon: DesignServicesIcon,
        link: '/dashboards/products'
      }
    ]
  },
  {
    heading: 'Setting',
    items: [
      {
        name: 'カテゴリ',
        icon: CategoryIcon,
        link: '/dashboards/categories'
      },
      {
        name: '管理者',
        icon: ManageAccountsIcon,
        link: '/dashboards/administrators'
      }
    ]
  }
];

export default menuItems;
