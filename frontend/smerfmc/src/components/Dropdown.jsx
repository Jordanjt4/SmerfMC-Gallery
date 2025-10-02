import { useState } from "react";

function Dropdown({categories, selected, setSelected}) {
  const [open, toggleOpen] = useState(false);

  const handleSelect = (c) => {
    setSelected(c);
    toggleOpen(false)
  }

  console.log("Categories are", categories);
  return (
    <div className="dropdown-container">
      <div className="dropdown">
          <div className="select" onClick={() => toggleOpen(!open)}>
              <span>{selected || "Select a category"}</span>
              <i className="fa fa-chevron-left"></i>
          </div>
          
          {open && (
              <ul className="dropdown-menu">
                  {categories.map(c => (
                      // list all the categories
                      // toggle close and open
                      <li key={c} onClick={() => (handleSelect(c))}>{c}</li> 
                  ))}    
              </ul>
          )}
      </div>
    </div>
  )
  
}

export default Dropdown;