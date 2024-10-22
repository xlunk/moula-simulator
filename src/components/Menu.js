import React from 'react';

const Menu = ({ startGame }) => {
    return (
        <div id="menu">
            <h1>FireParkour</h1>
            <button onClick={startGame}>Play</button>
            <button onClick={() => alert("Levels coming soon!")}>Levels</button>
            <button onClick={() => alert("Settings coming soon!")}>Settings</button>
        </div>
    );
};

export default Menu;
