import {component$} from '@builder.io/qwik';
import {StaticGenerateHandler, useLocation} from '@builder.io/qwik-city';

export const onStaticGenerate: StaticGenerateHandler = async () => {
    console.log('onStaticGenerate running')
    return {
        params : [
            {
                doc : '/developers-1'
            },
            {
                doc : '/getting-started'
            }
        ]
    }
}

const DocPage = component$(() => {
    const url = useLocation().url;
    return (
        <h1>Hello world from : {url.pathname}!</h1>
    );
})
 
export default DocPage;