import {NavTopProps} from '@deere/fuel-react/NavTop';
import FolderIcon from '@mui/icons-material/Folder';
import BookIcon from '@mui/icons-material/Book';
import BarChartIcon from '@mui/icons-material/BarChart';
import CompostIcon from '@mui/icons-material/Compost';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export const navTopSubNavItems: NavTopProps['items'] = [
    {
        label: 'Home',
        startIcon: <fuel-icon name={'home'}/>,
        href: '#/'
    },
    {
        label: 'Map',
        startIcon: <fuel-icon name={'map'}/>,
        href: '#/'
    },
    {
        label: 'Setup',
        startIcon: <FolderIcon />,
        subNav: [
            {
                label: 'Product 1',
                href: '#/product1'
            },
            {
                label: 'Product 2',
                href: '#/product2'
            },
            {
                label: 'Product 3',
                href: '#/product3',
                selected: true
            }
        ]
    },
    {
        label: 'Plan',
        startIcon: <BookIcon />,
        subNav: [
            {
                label: 'Product 1',
                href: '#/product1'
            },
            {
                label: 'Product 2',
                href: '#/product2'
            },
            {
                label: 'Product 3',
                href: '#/product3',
                selected: true
            }
        ]
    },
    {
        label: 'Analyze',
        selected: true,
        startIcon: <BarChartIcon />,
        subNav: [
            {
                label: 'Product 1',
                href: '#/product1'
            },
            {
                label: 'Product 2',
                href: '#/product2'
            },
            {
                label: 'Product 3',
                href: '#/product3',
                selected: true
            }
        ]
    },
    {
        label: 'Sustainability',
        startIcon: <CompostIcon />,
        subNav: [
            {
                label: 'Product 1',
                href: '#/product1'
            },
            {
                label: 'Product 2',
                href: '#/product2'
            },
            {
                label: 'Product 3',
                href: '#/product3',
                selected: true
            }
        ]
    },
    {
        label: 'More',
        startIcon: <MoreHorizIcon />,
        subNav: [
            {
                label: 'Product 1',
                href: '#/product1'
            },
            {
                label: 'Product 2',
                href: '#/product2'
            },
            {
                label: 'Product 3',
                href: '#/product3',
                selected: true
            }
        ]
    },
];
