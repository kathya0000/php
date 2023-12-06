import { INavData } from '@coreui/angular';
import { APP_API_CONFIG } from '../api/app-api.config';
import { APP_TRANSLATION_CONFIG } from '../translation/app-translation.config';

const appMainNavItems: INavData[] = [
  {
    name: 'Inicio',
    url: '/dashboard',
    iconComponent: { name: 'cil-applications' },
  },
  {
    title: true,
    name: 'OBRAS',
    iconComponent: { name: 'cil-building' },
  },
  {
    name: 'Añadir Obra',
    url: '/projects/add/step1',
    iconComponent: { name: 'cil-house' },
  },
  {
    name: 'Listado Obras',
    url: '/projects/list',
    iconComponent: { name: 'cil-list' },
  },
];

const appFooterNavItems: INavData[] = [];
// -----------------------------------------------------------------------------------------

const sideBarMainNavItems: INavData[] = [
  ...appMainNavItems,
  ...appFooterNavItems,
];

// ----------------------------------------------------------------------------------------

const sideBarFooterNavItems: INavData[] = [...appFooterNavItems];

// ----------------------------------------------------------------------------------------

const userDropdownNavItems: INavData[] = [
  {
    title: true,
    name: 'base.layout.block.menu.user.system',
    iconComponent: { name: 'cil-apps' },
  },
  {
    name: 'base.layout.block.menu.user.settings',
    href: APP_API_CONFIG.laravel9_api_base_path + '/admin',
    iconComponent: { name: 'cil-settings' },
    attributes: {
      target: '_blank',
    },
  },
  {
    divider: true,
  },
  {
    name: 'base.layout.block.menu.user.login',
    url: '/login',
    iconComponent: { name: 'cil-user' },
    attributes: {
      disabledForLogged: true,
    },
  },
  {
    name: 'base.layout.block.menu.user.logout',
    url: '/logout',
    iconComponent: { name: 'cil-account-logout' },
  },
];

// ----------------------------------------------------------------------------------------

export const APP_NAV_CONFIG = {
  sidebar: {
    main: sideBarMainNavItems,
    footer: sideBarFooterNavItems,
  },
  user: {
    dropdown: userDropdownNavItems,
  },
  lang: {
    available: APP_TRANSLATION_CONFIG.languages,
  },
};
