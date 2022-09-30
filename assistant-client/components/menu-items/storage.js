// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd , IconArchive} from '@tabler/icons';
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
    IconAddBox:AddCircleOutline,
    IconArchive:IconArchive
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const storage = {
    id: 'storage',
    title: 'Storage',
    type: 'group',
    children: [
        {
            id: 'storage',
            title: 'MyStorage',
            type: 'item',
            url: '/storage',
            icon: icons['IconArchive'],
            breadcrumbs: false
        },
        {
            id: 'create-storage',
            title: 'Create',
            type: 'item',
            url: '/createStorage',
            icon: icons['IconAddBox'],
            breadcrumbs: false

        }
    ]
};
