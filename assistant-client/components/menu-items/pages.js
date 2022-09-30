// assets
import { IconKey, IconReceipt2, IconBug, IconBellRinging, IconPhoneCall } from '@tabler/icons';
import { PersonOutlined, SupervisedUserCircleOutlined, RuleOutlined } from '@material-ui/icons';

// constant
const icons = {
    IconKey: IconKey,
    IconReceipt2: IconReceipt2,
    IconBug: IconBug,
    IconBellRinging: IconBellRinging,
    IconPhoneCall: IconPhoneCall,
    IconPersonOutlined: PersonOutlined,
    IconSupervisedUserCircle: SupervisedUserCircleOutlined,
    IconRuleOutlined: RuleOutlined
};

//-----------------------|| EXTRA PAGES MENU ITEMS ||-----------------------//

export const pages = {
    id: 'usersManagment',
    title: 'Users Managment',
    type: 'group',
    children: [
        {
            id: 'users',
            title: 'Users',
            type: 'collapse',
            icon: icons['IconPersonOutlined'],

            children: [
                {
                    id: 'listUser',
                    title: 'View Users',
                    type: 'item',
                    url: '/users',
                },
                {
                    id: 'createUser',
                    title: 'Create User',
                    type: 'item',
                    url: '/createUser',
                }
            ]

        },
        {
            id: 'groups',
            title: 'Groups',
            type: 'collapse',
            icon: icons['IconSupervisedUserCircle'],
            children: [
                {
                    id: 'listGroups',
                    title: 'View Groups',
                    type: 'item',
                    url: '/groups',
                },
                {
                    id: 'createGroups',
                    title: 'Create Group',
                    type: 'item',
                    url: '/createGroup',
                }
            ]
        },
        {
            id: 'roles',
            title: 'Roles',
            type: 'collapse',
            icon: icons['IconRuleOutlined'],
            children: [
                {
                    id: 'listRoles',
                    title: 'View Roles',
                    type: 'item',
                    url: '/roles',
                },
                {
                    id: 'createRoles',
                    title: 'Create Role',
                    type: 'item',
                    url: '/createRole',
                }]

        }
    ]
};
