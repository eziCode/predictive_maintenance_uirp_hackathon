import type {AppProps} from 'next/app';
import Head from 'next/head';
import {FC} from 'react';
import {useFuelTheme} from '@deere/fuel-react/useFuelTheme';
import {ApplicationLayout} from '@deere/fuel-react/ApplicationLayout';
import {PageLayout} from '@deere/fuel-react/PageLayout';
import {Header} from '@deere/fuel-react/Header';
import {Footer} from '@deere/fuel-react/Footer';
import {Nav} from '@deere/fuel-react/Nav';
import {navTopSubNavItems} from '../components/NavTopSubNavItems';
import {AppCacheProvider} from '@mui/material-nextjs/v15-pagesRouter';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const applicationName = 'Operations Center';

const App: FC<AppProps> = ({
    Component, pageProps
}) => {
    const theme = useFuelTheme();

    return (
        <AppCacheProvider>
            <Head>
                <title>{applicationName}</title>
                <meta charSet={'UTF-8'}/>
                <meta
                    content={'Generated by create fuel react with a little help from create next app ;)'}
                    name={'description'}
                />
                <meta
                    content={theme.fuel6Tokens.JddcColorBackgroundPrimary}
                    name={'theme-color'}
                />
                <meta
                    content={'width=device-width, initial-scale=1'}
                    name={'viewport'}
                />
                <link
                    href={'https://cdn-ux.deere.com'}
                    rel={'preconnect'}
                />
                <link
                    href={'https://cdn-ux.deere.com/brand-foundations/2.0.0/favicons/green-favicon/apple-touch-icon.png'}
                    rel={'apple-touch-icon'}
                    sizes={'180x180'}
                />
                <link
                    href={'https://cdn-ux.deere.com/brand-foundations/2.0.0/favicons/green-favicon/favicon-32x32.png'}
                    rel={'icon'}
                    sizes={'32x32'}
                    type={'image/png'}
                />
                <link
                    href={'https://cdn-ux.deere.com/brand-foundations/2.0.0/favicons/green-favicon/favicon-16x16.png'}
                    rel={'icon'}
                    sizes={'16x16'}
                    type={'image/png'}
                />
                <link
                    href={'https://cdn-ux.deere.com/brand-foundations/2.0.0/favicons/green-favicon/site.webmanifest'}
                    rel={'manifest'}
                />
                <link
                    content={theme.fuel6Tokens.JddcColorActionBackgroundTheme}
                    href={'https://cdn-ux.deere.com/brand-foundations/2.0.0/favicons/green-favicon/safari-pinned-tab.svg'}
                    rel={'mask-icon'}
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <ApplicationLayout>
                    <Header applicationName={applicationName}/>
                    <Nav
                        items={navTopSubNavItems}
                        variant={'top'}
                    />
                    <PageLayout>
                        <Component {...pageProps}/>
                    </PageLayout>
                    <Footer/>
                </ApplicationLayout>
            </ThemeProvider>
        </AppCacheProvider>
    );
};

export default App;
