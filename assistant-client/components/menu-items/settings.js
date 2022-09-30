// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';
import {Computer, AddCircleOutline, Cloud} from '@material-ui/icons';
// constant
const icons = {
    IconTypography: IconTypography,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconWindmill: IconWindmill,
    IconBrandFramer: IconBrandFramer,
    IconLayoutGridAdd: IconLayoutGridAdd,
    IconComputer: Computer,
    IconAddBox:AddCircleOutline,
    IconCloud:Cloud
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const settings = {
    id: 'settings',
    title: 'Settings',
    type: 'group',
    children: [
        {
            id: 'Accounts',
            title: 'Accounts',
            type: 'item',
            url: '/accounts',
            icon: icons['IconCloud'],
            breadcrumbs: false
        },
        {
            id: 'create-account',
            title: 'Create Account',
            type: 'item',
            url: '/createAccount',
            icon: icons['IconAddBox'],
            breadcrumbs: false

        }
    ]
};
