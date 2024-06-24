import React, { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../context/AppContext.js';

const Footer = ({ showVideo, videoUrl }) => {
    const [images, setImages] = useState([]);
    const { hotelData, hotelId } = useContext(AppContext);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(hotelData ? Math.floor(Math.random() * hotelData["landing"]["public_hotel_videos"].length) : 0);

    const videoRef = useRef(null);

    useEffect(() => {
        if (hotelData) {
            setCurrentVideoIndex(Math.floor(Math.random() * hotelData["landing"]["public_hotel_videos"].length));
        }
    }, [hotelData]);

    useEffect(() => {
        const videoElement = videoRef.current;

        let isCancelled = false;

        if (videoElement) {
            videoElement.src = videoUrl ? videoUrl : `${hotelData["landing"]["public_hotel_videos"][currentVideoIndex]}`;

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
    }, [currentVideoIndex, hotelData, videoUrl]);

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
                });
        }

    }, [hotelId]);

    return (
        <footer>
            <>
                {/* Video Player */}
                {hotelData &&
                    <div className="video-player" style={{ width: showVideo ? '100%' : '560px', height: showVideo ? '100%' : '400px' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        >
                            <source
                                src={videoUrl ? videoUrl : `${hotelData["landing"]["public_hotel_videos"][currentVideoIndex]}`}
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                }
            </>
        </footer>
    );
};

export default Footer;
