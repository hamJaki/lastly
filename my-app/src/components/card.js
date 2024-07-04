import React from 'react';
import { Link } from 'react-router-dom';

function Card({ title, text, icon, link, bgColor, buttonText }) {
    const cardStyle = {
        width: '350px',
        height: '380px',
        backgroundColor: bgColor,
        borderRadius: '8px',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };

    const titleStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px'
    };

    const iconStyle = {
        width: '250px',
        height: '250px',
        marginBottom: '10px'
    };

    const textStyle = {
        fontSize: '14px',
        marginBottom: '20px'
    };

    const buttonStyle = {
        color: 'white',
        fontSize: '14px',
        textDecoration: 'none',
        textAlign: 'left'
    };

    return (
            <Link to={link} style={buttonStyle}>
        <div style={cardStyle}>
            <div>
                <h3 style={titleStyle}>{title}</h3>
                <img src={icon} alt="icon" style={iconStyle} />
                <p style={textStyle}>{text}</p>
            </div>
                {buttonText} →
        </div>
            </Link>
    );
}

export default Card;