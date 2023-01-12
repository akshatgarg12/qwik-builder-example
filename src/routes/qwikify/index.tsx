import {component$} from '@builder.io/qwik'
import { QwikifyCar } from '~/integrations/react/class-based-component'

export default component$(() => {
    return (
        <div>
            <h1>Hello world</h1>
            <QwikifyCar />
        </div>
    )
})

