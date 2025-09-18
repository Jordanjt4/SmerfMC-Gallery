import Dropdown from "./Dropdown"

function Header({categories, selected, setSelected}) {
    return (
        <div className="header-container">
            <div className="navigation">
                <h1>SmerfMC Gallery</h1>

                <Dropdown 
                    categories={categories}
                    selected={selected}
                    setSelected={setSelected}
                />
            </div>

            <img id="squirrel" src="/images/squirrel.png" alt="squirrel" />
            <div id="grass" />
        </div>
    );
}

export default Header;