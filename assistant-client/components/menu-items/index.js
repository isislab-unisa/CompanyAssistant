import { dashboard } from './dashboard';
import { pages } from './pages';
import { storage } from './storage';
import { settings } from './settings';
import { vmManagment } from './vm-managment';
import { other } from './other';

//-----------------------|| MENU ITEMS ||-----------------------//

const menuItems = {
    items: [dashboard, pages, vmManagment,storage,settings, other]
};

export default menuItems;
