import { useState, useEffect } from 'react'
import './App.css'
import Header from "./components/Header"
import Gallery from "./components/Gallery"

function App() {
  const API = import.meta.env.VITE_API_BASE
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  // Initially load all the categories
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then(r => r.json())
      .then(data => {
        setCategories(data); // array of categories
        data.length > 0 ? setSelected(data[0]) : setSelected("No categories found."); // selected category is always the first
      })
  }, [])

  useEffect(() => {
    if (!selected) return // initially will be Null
    Promise.all([
      fetch(`${API}/api/category-description/${encodeURIComponent(selected)}`).then(r => r.json()),
      fetch(`${API}/api/category-images/${encodeURIComponent(selected)}`).then(r => r.json())
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
