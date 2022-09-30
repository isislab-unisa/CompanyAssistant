// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';
import {Computer, AddCircleOutline} from '@material-ui/icons';
// constant
const icons = {
    IconTypography: IconTypography,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconWindmill: IconWindmill,
    IconBrandFramer: IconBrandFramer,
    IconLayoutGridAdd: IconLayoutGridAdd,
    IconComputer: Computer,
    IconAddBox:AddCircleOutline
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const vmManagment = {
    id: 'vm-managment',
    title: 'Vm Managment',
    type: 'group',
    children: [
        {
            id: 'machines',
            title: 'Machines',
            type: 'item',
            url: '/vms',
            icon: icons['IconComputer'],
            breadcrumbs: false
        },
        {
            id: 'create-vm',
            title: 'Create',
            type: 'item',
            url: '/createVm',
            icon: icons['IconAddBox'],
            breadcrumbs: false

        }
    ]
};
