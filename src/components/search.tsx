import { component$, useSignal } from "@builder.io/qwik";

const Search = component$(() => {
    const searchText = useSignal("")
    return (
        <div>
            <label>Search</label>
            <input type="text" onChange$={(e) => searchText.value = e.target.value}/>
        </div>
    )
})

export default Search