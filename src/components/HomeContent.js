import React, { useContext } from 'react';
import AppContext from '../context/AppContext.js';
import ServiceDetails from './ServiceDetails';

const HomeContent = () => {
    const { selectedService, services, handleServiceClick } = useContext(AppContext);

    return (
        <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            {selectedService ? (
                <ServiceDetails />
            ) : (
                <div className="d-flex flex-column align-items-center w-100" style={{ height: '100%' }}>
                    {services.map((service, index) => (
                        <span
                            key={service.name}
                            className={`d-flex flex-column align-items-center justify-content-center header-nav-icon ${selectedService === service.name ? 'header-nav-icon-selected' : ''}`}
                            style={{ 
                                height: '154.2px', 
                                width: '100%', 
                                padding: '1rem 0', 
                                borderBottom: index !== services.length - 1 ? '1px solid white' : 'none',
                                boxSizing: 'border-box'  // Ensure padding and border are included in the element's total height and width
                            }}
                            onClick={() => handleServiceClick(service)}
                        >
                            <img
                                src={`${process.env.PUBLIC_URL}/images/main/${service.icon}`}
                                alt={service.name.toLowerCase()}
                                style={{ width: '50px', height: '5rem' }}
                            />
                            <span style={{ fontSize: '18px', marginTop: '10px', color: 'white' }}>{service.name}</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomeContent;
