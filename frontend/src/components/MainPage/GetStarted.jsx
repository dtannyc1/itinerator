import './GetStarted.css'

const GetStarted = () => {
    return (
        <div className="get-started-wrap">
            <div className='circle'>Museum</div>
            <div className='circle'>Park</div>
            <div className='circle'>Bar</div>
            <div className='circle'>Restaurant</div>
            <div className='circle'>Soccer</div>
            <div className='circle'>Basketball</div>
            <div className='circle'>Bowling</div>
            <div className='circle'>Pool</div>
            <input 
                className='search-bar'
                placeholder="Location"
            />
        </div>
    )
}

export default GetStarted;