import {FC} from 'react';
import Card from '@mui/material/Card';
import Image from 'next/image';

const ShowDataVisualization: FC<{dataVisualization: string}> = ({dataVisualization}) => (
    <Card>
        <div style={{ position: 'relative', width: '100%', minHeight: '250px' }}>
            {dataVisualization === 'Engine Temperature' && (
                <Image
                    alt={'Engine Temperature Visualization'}
                    src={'/engine-temperature.png'}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            )}
            {dataVisualization === 'Oil Pressure' && (
                <Image
                    alt={'Oil Pressure Visualization'}
                    src={'/oil-pressure.png'}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            )}
            {dataVisualization === 'Engine Vibration' && (
                <Image
                    alt={'Engine Vibration Visualization'}
                    src={'/engine-vibration.png'}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            )}
            {dataVisualization === 'Hydraulic Pressure' && (
                <Image
                    alt={'Hydraulic Pressure Visualization'}
                    src={'/hydraulic-pressure.png'}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            )}
            {dataVisualization === 'Battery Voltage' && (
                <Image
                    alt={'Battery Voltage Visualization'}
                    src={'/battery-voltage.png'}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            )}
        </div>
    </Card>
);

export default ShowDataVisualization;
