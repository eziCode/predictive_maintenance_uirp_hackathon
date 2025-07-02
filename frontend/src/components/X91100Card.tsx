import {FC} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Image from 'next/image';

const x9Card: FC = () => (
    <Card>
        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            <Image
                alt={'X9 1100 Tractor'}
                src={'/x91100.jpeg'}
                fill
                style={{ objectFit: 'cover' }}
            />
        </div>
        <CardContent>
            <Typography
                color={'text.theme'}
                component={'p'}
                variant={'bodySmall'}
            >
                {'X Series Combines'}
            </Typography>
            <Typography
                variant={'labelLarge'}
            >
                {'X9 1100'}
            </Typography>
            <Typography
                color={'secondary'}
                component={'p'}
                style={{marginBottom: '8px'}}
            >
                {'Commonly used for: High moisture corn, tough-threshing small grains'}
            </Typography>
            <Typography component={'ul'} style={{ paddingLeft: '16px', margin: 0 }}>
                <Typography component={'li'}>
                    {'Unload rate: 5.3 bu/s (186.7 liters/s)'}
                </Typography>
                <Typography component={'li'}>
                    {'Power Folding Grain Tank: 460-bushel (16,210-liter)'}
                </Typography>
                <Typography component={'li'}>
                    {'Engine Type: John Deere JD14 13.6L'}
                </Typography>
                <Typography component={'li'}>
                    {'Horsepower Engine: 690 max'}
                </Typography>
            </Typography>
        </CardContent>
        <CardActions
            sx={{
                justifyContent: 'flex-start'
            }}
        >
            <Button 
                variant={'tertiary'}
                onClick={() => window.open('https://johndeere.widen.net/s/8kjdzrklgw/4592750-x-series-combines', '_blank')}
            >
                {'Product Brochure'}
            </Button>
            <Button 
                variant={'tertiary'}
                onClick={() => window.open('https://techinfo-omview.apps-prod-vpn.us.e06.c01.johndeerecloud.com/omview/omhxe162878/Prop65_English', '_blank')}
            >
                {'User Manual'}
            </Button>
        </CardActions>
    </Card>
);

export default x9Card;
