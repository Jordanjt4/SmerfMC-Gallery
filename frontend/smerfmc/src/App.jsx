import { useState, useEffect } from 'react'
import './App.css'
import Header from "./components/Header"
import Gallery from "./components/Gallery"

function App() {
  const API = import.meta.env.VITE_API_BASE
  const [categories, setCategories] = useState([]); // all of the categories that will be displayed in dropdown menu
  const [selected, setSelected] = useState(null); // the category which the user selects from the dropdown
  const [description, setDescription] = useState(""); // the corresponding description from the selected category
  const [images, setImages] = useState([]); // the corresponding images from the selected category

console.log("api is", API)

  // when site first loads, fetch all categories and populate the dropdown menu
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then(r => r.json())
      .then(data => {
        setCategories(data); 
        // api orders categories by creation date
        // default selected category is the most recently created category
        data.length > 0 ? setSelected(data[0]) : setSelected("No categories found."); // selected category is always the first
      })
  }, [])

  // load the appropriate images and description upon selecting a category
  useEffect(() => {
    // selected is initialized to null, so this effect shouldn't occur until categories are fully loaded
    if (!selected) return 
    Promise.all([
      fetch(`${API}/api/category-description?category=${encodeURIComponent(selected)}`).then(r => r.json()),
      fetch(`${API}/api/category-images?category=${encodeURIComponent(selected)}`).then(r => r.json())
    ])
    .then(([descData, imagesData]) => {
      setDescription(descData.description || "")
      setImages(imagesData || [])
    })
  }, [selected])

 return(
  <>
    <Header categories={categories} selected={selected} setSelected = {setSelected}/>
    <Gallery description={description} images={images}/>
  </>
 )
  

}

export default App
