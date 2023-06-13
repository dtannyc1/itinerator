import './GetStarted.css'

const GetStarted = () => {
    return (
        <div className="get-started-wrap">
            <div className='circle'><i className="fa-solid fa-building-columns fa-2xl"></i></div>
            <div className='circle'><i className="fa-solid fa-tree fa-2xl"></i></div>
            <div className='circle'><i className="fa-solid fa-martini-glass fa-2xl"></i></div>
            <div className='circle'><i className="fa-solid fa-utensils fa-2xl"></i></div>
            <div className='circle'><i className="fa-solid fa-futbol fa-2xl"></i></div>
            <div className='circle'><i className="fa-solid fa-basketball fa-2xl"></i></div>
            <div className='circle'><i className="fa-solid fa-bowling-ball fa-2xl"></i></div>
            <div className='circle'><i className="fa-solid fa-person-swimming fa-2xl"></i></div>
            <input 
                className='search-bar'
                placeholder="Enter desired location"
            />
        </div>
    )
}

export default GetStarted;