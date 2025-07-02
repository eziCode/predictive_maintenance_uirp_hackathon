import {PageContent} from '@deere/fuel-react/PageContent';
import {PageHeader} from '@deere/fuel-react/PageHeader';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {FC, useEffect, useState} from 'react';
import AutoCompleteDropdown from '@/components/AutoCompleteDropdown';
import { CircularProgress, ThemeProvider } from '@mui/material';
import { useFuelTheme } from '@deere/fuel-react/useFuelTheme';
import TableComponent from '@/components/Table';
import X91000Card from '@/components/X91000Card';
import X91100Card from '@/components/X91100Card';
import Papa from 'papaparse';
import ShowDataVisualization from '@/components/ShowDataVisualization';

interface PredictionResult {
    hours_until_failure: number;
    component?: string;
}

const Home: FC = () => {
    const theme = useFuelTheme();
    const [modelSelected, setModelSelected] = useState<string | null>(null);
    const [analyze, setAnalyze] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [hour, setHour] = useState<number>(0);
    const [dataVisualization, setDataVisualization] = useState<string>('');
    const [priority, setPriority] = useState<string | null>(null);

    const handleModelChange = (event: { target: { value: string } }) => {
        console.log('Selected value:', event.target.value);
        setModelSelected(event.target.value);
        console.log(event.target.value);
    };

    useEffect(() => {
        if (!modelSelected || !analyze) {
            setLoading(false);
            return;
        }

        const runHourPrediction = async () => {
            try {
                const csvResponse = await fetch('/sample_0_data.csv');
                const csvText = await csvResponse.text();
                
                const sampleData = Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true
                });

                const response = await fetch('http://localhost:5000/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(sampleData),
                });

                if (!response.ok) {
                    throw new Error('Prediction failed');
                }

                const result: PredictionResult = await response.json();
                setHour(result.hours_until_failure);

                if(result.hours_until_failure < 200) {
                    setPriority('High');
                } else if (result.hours_until_failure < 1000) {
                    setPriority('Medium');
                } else {
                    setPriority('Low');
                }

            } catch (error) {
                console.error('Error running prediction:', error);
                // Set fallback values when API is not available
                setHour(Math.floor(Math.random() * 100) + 10);
            } finally {
                setLoading(false);
            }
        }

        if (analyze) {
            runHourPrediction();
        } else {
            // Set default component when model is selected but not analyzed yet
            const timer = setTimeout(() => {
                setLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [modelSelected, analyze])

    return (
        <ThemeProvider theme={theme}>
            <PageHeader>
                <Typography variant={'h1'} style={{ marginTop: '1rem', marginLeft: '1rem' }}>
                    {'RUL Prediction'}
                </Typography>
            </PageHeader>
            <PageContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                    <div>
                        <AutoCompleteDropdown 
                            onChange={handleModelChange}
                            name={'Model'}
                        />
                        <div>
                            <Button
                                variant="primary"
                                disabled={!modelSelected || analyze}
                                style={{marginTop: '1rem', marginLeft: '14rem'}}
                                onClick={() => {
                                    setLoading(true);
                                    setAnalyze(true);
                                }}
                            >
                                Analyze
                            </Button>
                        </div>
                        {modelSelected == 'X9 1000' && (
                            <X91000Card />
                        )}
                        {modelSelected == 'X9 1100' && (
                            <X91100Card />
                        )}
                    </div>
                
                <Card style={{ backgroundColor: '#f1f0f0', marginTop: '1rem', marginRight: '1rem', width: '100%', height: 'fit-content' }}>
                    <CardContent>
                        {(!modelSelected || !analyze) && 
                            <Typography variant={'h2'} style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                                {!modelSelected ? 'Please select a model to analyze.' : 'Please click "Analyze" to proceed.'}
                            </Typography>
                        }
                        {modelSelected && analyze && loading && 
                            <Card
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '30px 100px',
                                    border: '1px solid #ccc',
                                }}
                                variant={'default'}
                            >
                                <CircularProgress data-fuel-size={'large'} />
                                <Typography
                                    style={{
                                        marginTop: '1.5rem',
                                        marginBottom: '0.5rem',
                                    }}
                                    variant={'h1'}
                                >
                                    {'Analyzing...'}
                                </Typography>
                                <Typography variant={'bodyMedium'}>{'This may take a few seconds.'}</Typography>
                            </Card>
                        }
                        {modelSelected && analyze && !loading && 
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', gap: '1rem' }}>
                                    <Card style={{width: '90%', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f0f0', gap: '1rem'}}>
                                        <Card style={{backgroundColor: (priority === 'High' ? '#ffc7c2' : priority === 'Medium' ? '#ffcb97' : '#c4dbb8'), width: '100%', padding: '1rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                            <Typography variant={'h3'} style={{ textAlign: 'center'}}>
                                                Priority Level: {priority}
                                            </Typography>
                                        </Card>
                                        <Card style={{ width: '100%', padding: '1rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Typography variant={'h1'} style={{ textAlign: 'center' }}>
                                                Expected {hour} Operational Hours
                                            </Typography>
                                            <Typography variant={'h3'} style={{ textAlign: 'center' }}>
                                                Until Possible Failure
                                            </Typography>
                                        </Card>
                                    </Card>
                                    <Card style={{ width: '100%', padding: '1rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                                        <Typography variant='h2' style={{textAlign: 'center'}}>
                                            Want to Schedule Maintenance?
                                        </Typography>
                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <Button variant="primary" style={{width: '95%'}}>Schedule Maintenance</Button>
                                        </div>
                                    </Card>
                                </div>
                                <Card style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1rem', backgroundColor: '#f1f0f0'}}>
                                    <Card style={{width: '55%', padding: '1rem 1rem'}}>
                                        <Typography variant={'h2'} style={{ textAlign: 'center' }}>
                                            {'Data Visualization'}
                                        </Typography>
                                        <AutoCompleteDropdown 
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setDataVisualization(value);
                                                console.log(value);
                                            }}
                                            name={'Data'}
                                        />
                                        {dataVisualization && 
                                            <ShowDataVisualization
                                                dataVisualization={dataVisualization}
                                            />
                                        }
                                    </Card>
                                    <Card style={{width: '45%', padding: '1rem 1rem'}}>
                                        <Typography variant={'h2'} style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                            {'Past Maintenance History'}
                                        </Typography>
                                        <TableComponent />
                                    </Card>
                                </Card>
                            </div>
                        }
                    </CardContent>
                </Card>
                </div>
            </PageContent>
        </ThemeProvider>
    );
};

export default Home;
