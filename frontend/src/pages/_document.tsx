import {DocumentContext, DocumentProps, Head, Html, Main, NextScript} from 'next/document';
import {ReactElement} from 'react';
import {documentGetInitialProps, DocumentHeadTags, DocumentHeadTagsProps} from '@mui/material-nextjs/v15-pagesRouter';

export default function Document(props: DocumentProps & DocumentHeadTagsProps): ReactElement {
    return (
        <Html lang='en'>
            <Head>
                <DocumentHeadTags {...props}/>
                <link
                    href={'https://fonts.googleapis.com'}
                    rel={'preconnect'}
                />
                <link
                    crossOrigin={'anonymous'}
                    href={'https://fonts.gstatic.com'}
                    rel={'preconnect'}
                />
                <link
                    href={'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'}
                    rel={'stylesheet'}
                />
                <link
                    href={'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap'}
                    rel={'stylesheet'}
                />
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    );
}

type DocumentInitialProps = ReturnType<typeof documentGetInitialProps>;

Document.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
    return await documentGetInitialProps(ctx);
};
