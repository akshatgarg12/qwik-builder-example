/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react"

export const Search = ({searchText, onChange}:any) => {
    return (
        <div>
            {searchText}
            <label>Search</label>
            <input type="text" onChange={onChange}/>
        </div>
    )
}

export default qwikify$(Search)