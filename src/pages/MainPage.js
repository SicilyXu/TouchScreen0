import React, { useContext, useState, useEffect } from 'react';
import Header from '../components/Header.js';
import HomeContent from '../components/HomeContent.js';
import GeneralContent from '../components/GeneralContent.js';
import NewsContent from '../components/NewsContent.js';
import FlightsContent from '../components/FlightsContent.js';
import Footer from '../components/Footer.js';
import AppContext from '../context/AppContext.js';
import ServiceDetail from '../components/ServiceDetails.js';
import { useSearchParams } from 'react-router-dom';

const MainPage = () => {
    const { selectedService, setHotelId, hotelData } = useContext(AppContext);
    const [searchParams] = useSearchParams();
    const hotel_id = searchParams.get('hotel_id');
    const [showVideo, setShowVideo] = useState(true);

    useEffect(() => {
        setHotelId(hotel_id);
    }, [hotel_id, setHotelId]);

    function renderContent(selectedService) {
        switch (selectedService) {
            case "News":
                return <NewsContent />;
            case "Flights":
                return <FlightsContent />;
            default:
                return <GeneralContent />;
        }
    }

    return (
        <div style={{ width: '1920px', height: '1080px', display: 'flex' }}>
            <div style={{ width: '480px', height: '1080px', display: 'flex', flexDirection: 'column' }}>
                <Header onClick={() => setShowVideo(false)} />
            </div>
            <div style={{ width: '136px', height: '1080px', display: 'flex', flexDirection: 'column' }}>
                <HomeContent onIconClick={() => setShowVideo(false)} />
            </div>
            <div style={{ width: showVideo ? '1304px' : '764px', height: '1080px', display: 'flex', flexDirection: 'column', transition: 'width 0.3s' }}>
                {showVideo ? (
                    <Footer showVideo={showVideo} videoUrl={hotelData && hotelData["landing"]["public_hotel_videos"][0]} />
                ) : (
                    selectedService ? renderContent(selectedService) : <ServiceDetail />
                )}
            </div>
            {!showVideo && (
                <div style={{ width: '540px', height: '1080px', display: 'flex', flexDirection: 'column' }}>
                    <Footer showVideo={false} />
                </div>
            )}
        </div>
    );
}

export default MainPage;
