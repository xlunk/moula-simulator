// src/components/SongSelect.js

import React from 'react';
import songs from '../Songs';

const SongSelect = ({ onSelect }) => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Select a Song</h2>
            <ul>
                {songs.map((song, index) => (
                    <li key={index}>
                        <button onClick={() => onSelect(song)}>Play {song.title}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SongSelect;
