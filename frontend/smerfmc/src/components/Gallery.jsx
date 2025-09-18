function Gallery({description, images}) {
    console.log("images are", images)
    return (
        <div className="gallery">
            <div className="description">
                <p>{description}</p>
            </div>

            <div className="images">
                {images.map(i => (
                    <div key={i.url} className="item">
                        <div className="outer-frame">
                            <img className="image" src={i.url} />
                        </div>
                        <div className="caption-outer-frame">
                            {i.caption === null ? <p className="caption"><br /></p> : <p className="caption">{i.caption}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Gallery