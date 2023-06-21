import './Footer.css';

const openExternalLink = (e, link) => {
    e.preventDefault();
    window.open(link, "_blank")
}

const Footer = () => {
    return (
        <div className="footer-wrap">
            <div className='team-member-capsule'>
                <div className='footer-name-holder'>David Tan</div>
                <div className='footer-links-holder'>
                    <a href='https://www.linkedin.com/in/dtannyc1/'
                        onClick={e => openExternalLink(e, 'https://www.linkedin.com/in/dtannyc1/')}>
                        <i className="fa-brands fa-linkedin fa-2xl"></i>
                    </a>

                    <a href='https://wellfound.com/u/david-tan-47'
                        onClick={e => openExternalLink(e, 'https://wellfound.com/u/david-tan-47')}>
                        <i className="fa-brands fa-angellist fa-2xl"></i>
                    </a>

                    <a href='https://github.com/dtannyc1'
                        onClick={e => openExternalLink(e, 'https://github.com/dtannyc1')}>
                        <i className="fa-brands fa-github fa-2xl"></i>
                    </a>
                </div>
            </div>

            <div className='team-member-capsule'>
                <div className='footer-name-holder'>Anton James</div>
                <div className='footer-links-holder'>
                    <a href='https://www.linkedin.com/in/anton-james-ja/'
                        onClick={e => openExternalLink(e, 'https://www.linkedin.com/in/anton-james-ja/')}>
                        <i className="fa-brands fa-linkedin fa-2xl"></i>
                    </a>

                    <a href='https://wellfound.com/u/anton-james'
                        onClick={e => openExternalLink(e, 'https://wellfound.com/u/anton-james')}>
                        <i className="fa-brands fa-angellist fa-2xl"></i>
                    </a>

                    <a href='https://github.com/AntonJames-Sistence'
                        onClick={e => openExternalLink(e, 'https://github.com/AntonJames-Sistence')}>
                        <i className="fa-brands fa-github fa-2xl"></i>
                    </a>
                </div>
            </div>
            <div className='team-member-capsule'>
                <div className='footer-name-holder'>Brandon Choi</div>
                <div className='footer-links-holder'>
                    <a href='https://www.linkedin.com/in/brandonchoi28/'
                        onClick={e => openExternalLink(e, 'https://www.linkedin.com/in/brandonchoi28/')}>
                        <i className="fa-brands fa-linkedin fa-2xl"></i>
                    </a>

                    <a href='https://www.linkedin.com/in/brandonchoi28/'
                        onClick={e => openExternalLink(e, 'https://www.linkedin.com/in/brandonchoi28/')}>
                        <i className="fa-brands fa-angellist fa-2xl"></i>
                    </a>

                    <a href='https://github.com/bchoi28'
                        onClick={e => openExternalLink(e, 'https://github.com/bchoi28')}>
                        <i className="fa-brands fa-github fa-2xl"></i>
                    </a>
                </div>
            </div>


        </div>
    )
}

export default Footer;
