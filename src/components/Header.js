import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext.js';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const [images, setImages] = useState([]);
    const [dateTime, setDateTime] = useState('');
    const [weather, setWeather] = useState([]);
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState('dateTime');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentFlightDisplay, setCurrentFlightDisplay] = useState("");
    const [currentNewsDisplay, setCurrentNewsDisplay] = useState("");
    const { services, setServices, hotelData, setGlobalId, selectedService, setSelectedService, weatherData, flightsData, newsData, handleServiceReset, handleServiceClick, hotelId, } = useContext(AppContext);
    const navigate = useNavigate();
    const liWidth = document.body.clientWidth;

    const nameIdMap = [{ name: 'SERVICES', icon: 'services_icon.png', globalId: '01000000' },
    { name: 'MAPS', icon: 'maps_icon.png', globalId: '02000000' },
    { name: 'ACTIVITIES', icon: 'activities_icon.png', globalId: '03000000' },
    { name: 'DESTINATIONS', icon: 'destionations_icon.png', globalId: '04000000' },
    { name: 'EVENTS', icon: 'events_icon.png', globalId: '05000000' },
    { name: 'EATING OUT', icon: 'eating_out_icon.png', globalId: '06000000' },
    { name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' }]


    const handleAdvClick = (link_id) => {
        if (link_id) {
            setGlobalId(link_id);
            setSelectedService(nameIdMap.find(tempmap => tempmap.globalId === link_id.substring(0, 2) + '000000').name);
            // Reorder services to put the clicked service in the middle
            const index = services.findIndex(s => s.globalId === link_id.substring(0, 2) + '000000');
            console.log(index);
            const middleIndex = 3;
            if (index < middleIndex) {
                // Move selected service to the middle from start
                const firstHalf = services.slice(0, 4 + index);
                const secondHalf = services.slice(4 + index);
                setServices([...secondHalf, ...firstHalf,]);
            } else if (index > middleIndex) {
                // Move selected service to the middle from end
                const firstHalf = services.slice(0, index - 3);
                const secondHalf = services.slice(index - 3);
                setServices([...secondHalf, ...firstHalf]);
            }
            // If it's already in the middle, do nothing
        }
    }

    useEffect(() => {
        if (weatherData && weatherData.length) {
            const formattedWeatherData = weatherData.map(item => {
                const date = new Date(item.date);
                const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}`;
                const weatherCondition = item.condition.text.split(' ').slice(0, 2).join(' ');
                const tempRange = `${item.mintemp_c}\u2103-${item.maxtemp_c}\u2103`;
                return `${formattedDate} ${weatherCondition} ${tempRange}`;
            });
            setWeather(formattedWeatherData);
        }
    }, [weatherData]);

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const amPm = hours >= 12 ? 'PM' : 'AM';
            // Convert 24h hour to 12h format
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const minutes = now.getMinutes().toString().padStart(2, '0');
            // Formatting the date as dd-MM-yyyy
            const date = now.getDate().toString().padStart(2, '0');
            // Array of month names
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            // Get the month name from the array using the month number as an index
            const month = monthNames[now.getMonth()];
            const year = now.getFullYear();
            const formattedDateTime = `${hours}:${minutes} ${amPm} | ${date}-${month}-${year}`;
            setDateTime(formattedDateTime);
        };

        // Update the date and time now, and then every 5 seconds
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 5000);

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, []);


    // flipping displays
    useEffect(() => {
        const intervals = ['dateTime', 0, 'dateTime', 1, 'dateTime', 2]
        let currentIndex = 0;

        const updateDisplay = () => {
            setCurrentTimeDisplay(intervals[currentIndex]);
            currentIndex = (currentIndex + 1) % intervals.length;
        };

        updateDisplay();
        const intervalId = setInterval(updateDisplay, 3000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (flightsData && flightsData.length) {
            let interval = 0
            const updateDisplay = () => {
                const time = flightsData[interval].departure.estimated.split('T')[1].substring(0, 5); // Extract HH:mm
                let [hours, minutes] = time.split(':').map(Number); // Convert to numbers
                hours += 10; // Add 10 hours
                // Handle day rollover
                let dayRollover = '';
                if (hours >= 24) {
                    hours -= 24;
                    dayRollover = ' (+1)';
                }
                // Format hours and minutes
                const formattedHours = hours.toString().padStart(2, '0');
                const formattedMinutes = minutes.toString().padStart(2, '0');

                setCurrentFlightDisplay(
                    `${flightsData[interval].flight.iata}: ${flightsData[interval].departure.iata}→${flightsData[interval].arrival.iata} ${formattedHours}:${formattedMinutes}${dayRollover}`
                )
                interval = (interval + 1) % flightsData.length;
            };
            updateDisplay();
            const intervalId = setInterval(updateDisplay, 5000);

            return () => clearInterval(intervalId);
        }
    }, [flightsData])

    useEffect(() => {
        if (newsData && newsData.length) {
            let currentIndex = 0;
            const updateDisplay = () => {
                setCurrentNewsDisplay(newsData[currentIndex].header);
                currentIndex = (currentIndex + 1) % newsData.length;
            };
            updateDisplay();
            const intervalId = setInterval(updateDisplay, 6000);
            return () => clearInterval(intervalId);
        }
    }, [newsData]);

    useEffect(() => {
        const imageTimer = setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotelData["landing"]["public_hotel_slides"].length);
        }, 3000); // Change image every 3 seconds

        return () => clearTimeout(imageTimer);
    }, [currentImageIndex, hotelData]);

    const getSlideStyles = (index) => {
        const slidesLength = hotelData["landing"]["public_hotel_slides"].length;
        let positionDifference = index - currentImageIndex;

        if (index === 0 && currentImageIndex === slidesLength - 1) {
            positionDifference = 1;
        } else if (index === slidesLength - 1 && currentImageIndex === 0) {
            positionDifference = -1;
        }

        return {
            position: 'absolute',
            transition: 'all 1s ease-out',
            right: `${positionDifference * liWidth}px`,
            opacity: index === currentImageIndex ? 1 : 0,
            width: '100%',
            height: '100%'
        };
    };

    useEffect(() => {
        if (hotelId !== "") {
            const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}/GetAdvertisementByHotelId/${hotelId}`;
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setImages(data);
                })
        }

    }, [hotelId]);


    return (
        <header style={{ height: '1080px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {hotelData && <div style={{ backgroundImage: `url(${hotelData["landing"]["public_hotel_logo"]})`, backgroundSize: '100% 100%', width: '480px', height: '360px' }}
                onClick={() => {
                    if (!selectedService)
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            window.location.href = `https://www.pladdypus.com/`;
                        }
                    else
                        handleServiceReset();
                }}>
            </div>}
            <div className="header-nav-icon-selected align-items-center justify-content-center flip-animation" style={{
                width: '480px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                fontSize: '2.5rem',
                color: 'white',
                border: 0,
                textAlign: 'center',  // 确保文本在容器中水平居中
                lineHeight: '30px'   // 确保文本在容器中垂直居中
            }} key={currentNewsDisplay} onClick={() => { setSelectedService("News") }}>
                &nbsp;&nbsp;NEWS: {currentNewsDisplay}
            </div>
            <div className="flex-column w-100" style={{ width: '480px', color: 'white' }}>
                <div className="d-flex flex-column align-items-center justify-content-center header-nav-icon" style={{ height: '80px', width: '480px', fontSize: '2.5rem' }}
                    onClick={() => { setSelectedService("Flights") }}>
                    {flightsData && flightsData.length !== 0 &&
                        <span key={currentFlightDisplay} className="flip-animation">
                            {currentFlightDisplay}
                        </span>}
                    {flightsData && flightsData.length === 0 && <span>No Flight Today</span>}
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center header-nav-icon-selected" style={{ height: '80px', width: '480px', fontSize: '2.5rem' }}>
                    {currentTimeDisplay === 'dateTime' && <span className="flip-animation">{dateTime}</span>}
                    {typeof currentTimeDisplay === 'number' && <span className="flip-animation" style={{ whiteSpace: "nowrap" }}>{weather[currentTimeDisplay]}</span>}
                </div>
            </div>
            {/* Image Carousel */}
            <div className="carousel" style={{ width: '480px', overflow: 'hidden', flexGrow: 1, }} onClick={() => {
                handleServiceClick({ name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' })
            }}>
                {hotelData && hotelData["landing"]["public_hotel_slides"].map((img, index) => (
                    <img key={index} style={getSlideStyles(index)}
                        src={`${img}`}
                        alt={index}
                    />
                ))}
            </div>
            {/* Carousel Wrapper at the bottom */}
            <div className="carousel-wrapper" style={{ width: '480px', overflow: 'hidden', }}>
                {images.length > 0 &&
                    <Carousel interval={5000} pause={false} indicators={false} style={{ width: '100%', height: '100%' }}>
                        {images.map((image, index) => (
                            <Carousel.Item key={index} style={{ width: '100%', height: '100%' }}>
                                <img
                                    className="d-block w-100 h-100"
                                    src={image.public_image_url}
                                    alt={`carousel-item-${index}`}
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    onClick={() => handleAdvClick(image.link_id)}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                }
            </div>
        </header>
    );
};

export default Header;


