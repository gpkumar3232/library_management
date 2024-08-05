import SearchIcon from '@mui/icons-material/Search';

import './commonSearchBar.css'
//functional component to render SearchBar
function CommonSearchBar(props) {

    return (
        <div className="searchContainer">

            <div className='iconContainer'>
                <SearchIcon className="icon" />
            </div>
            <input
                placeholder={props?.placeholder}
                type="search"
                required
                id='search'
                name='search'
                autoComplete='off'
                value={props.search}
                onChange={(e) => props.setSearch(e.target.value)}
            />
        </div>
    )
}
export default CommonSearchBar;