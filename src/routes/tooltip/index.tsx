import { component$ } from '@builder.io/qwik'
import {MUITooltip} from '../../integrations/react/tooltip'

export default component$(() => {
    return (
        <div>
            <h1>Render a tooltip component from MUI, qwikified with clientOnly as true</h1>
            <MUITooltip />            
        </div>
    )
})