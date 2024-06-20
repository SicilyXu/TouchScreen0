import React, { useState, useEffect, useRef, useContext } from 'react';
import { Carousel } from 'react-bootstrap';
import AppContext from '../context/AppContext.js';
import { useNavigate } from 'react-router-dom';

const nameIdMap = [{ name: 'SERVICES', icon: 'services_icon.png', globalId: '01000000' },
{ name: 'MAPS', icon: 'maps_icon.png', globalId: '02000000' },
{ name: 'ACTIVITIES', icon: 'activities_icon.png', globalId: '03000000' },
{ name: 'DESTINATIONS', icon: 'destionations_icon.png', globalId: '04000000' },
{ name: 'EVENTS', icon: 'events_icon.png', globalId: '05000000' },
{ name: 'EATING OUT', icon: 'eating_out_icon.png', globalId: '06000000' },
{ name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' }]


const Footer = () => {
    const [images, setImages] = useState([]);
    const { hotelData, setGlobalId, setSelectedService, services, setServices, hotelId, selectedService, handleServiceReset } = useContext(AppContext);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(hotelData ? Math.floor(Math.random() * hotelData["landing"]["public_hotel_videos"].length) : 0);

    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (hotelData) {
            setCurrentVideoIndex(Math.floor(Math.random() * hotelData["landing"]["public_hotel_videos"].length))
        }
    }, [hotelData]);

    useEffect(() => {
        const videoElement = videoRef.current;

        let isCancelled = false;

        if (videoElement) {
            videoElement.src = `${hotelData["landing"]["public_hotel_videos"][currentVideoIndex]}`;

            videoElement.load();
            const playPromise = videoElement.play();

            if (playPromise instanceof Promise) {
                playPromise.then(() => {
                    if (isCancelled) {
                        videoElement.pause();
                    }
                }).catch(error => {
                    if (!isCancelled) {
                        console.error('Error attempting to play video:', error);
                    }
                });
            }
        }

        const handleVideoEnd = () => {
            if (!isCancelled) {
                setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % hotelData["landing"]["public_hotel_videos"].length);
            }
        };

        videoElement?.addEventListener('ended', handleVideoEnd);

        return () => {
            isCancelled = true;
            videoElement?.removeEventListener('ended', handleVideoEnd);
            videoElement?.pause();
        };
    }, [currentVideoIndex, hotelData]);



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

    return (
        <footer>
            <>
                {/* Video Player */}
                {hotelData &&
                    <div className="video-player" style={{ width: '560px', height: '400px' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        >
                            <source
                                src={`${hotelData["landing"]["public_hotel_videos"][currentVideoIndex]}`}
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                }
                {images &&
                    <Carousel interval={5000} pause={false} style={{ width: '560px', height: '178.94px', overflow: 'hidden' }} indicators={false}>
                        {images.map((image, index) => (
                            <Carousel.Item key={index} style={{ width: '100%', height: '100%' }}>
                                <img
                                    className="d-block w-100 h-100"
                                    src={`${image.public_image_url}`}
                                    alt={`carousel-item-${index}`}
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    onClick={() => handleAdvClick(image.link_id)}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                }
                {/* Background Image */}
                {hotelData && <div style={{ backgroundImage: `url(${hotelData["landing"]["public_hotel_logo"]})`, backgroundSize: '100% 100%', width: '560px', height: '500.77px' }}
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
            </>
        </footer>
    );
};

export default Footer;
