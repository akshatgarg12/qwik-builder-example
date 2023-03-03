import { $, component$, useSignal } from "@builder.io/qwik";
import SearchComponent from '../../integrations/react/search'
const Search = component$(() => {
    const searchText = useSignal("")
    return (
        <div>
            <SearchComponent 
                searchText = {searchText.value}
                // onInput = {$((e:any) => {
                //     console.log('Search run')
                //     searchText.value = e.target.value
                // })}
                onChange = {$((e:any) => {
                    console.log('Search run')
                    searchText.value = e.target.value
                })}
            />
        </div>
    )
})

export default Search