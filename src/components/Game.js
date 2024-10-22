// src/components/Game.js

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import songs from '../Songs';

const Game = ({ selectedSong }) => {
    const mountRef = useRef(null);
    const [scene, setScene] = useState(null);
    const [camera, setCamera] = useState(null);
    const [renderer, setRenderer] = useState(null);
    const [audio, setAudio] = useState(null);
    const [notes, setNotes] = useState([]); // Store notes for the song
    const [score, setScore] = useState(0);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        setScene(scene);
        setCamera(camera);
        setRenderer(renderer);
        camera.position.z = 5; // Set camera position

        // Clean up on component unmount
        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    useEffect(() => {
        if (selectedSong) {
            // Load audio
            const audio = new Audio(selectedSong.url);
            setAudio(audio);
            audio.play();

            // Generate notes for the song
            generateNotes(); // Function to generate notes based on the song

            return () => {
                audio.pause();
                audio.currentTime = 0; // Reset audio on unmount
            };
        }
    }, [selectedSong]);

    const generateNotes = () => {
        // Example: Generate notes at fixed intervals (replace with actual timing logic)
        const newNotes = [];
        for (let i = 0; i < 20; i++) {
            newNotes.push({
                position: new THREE.Vector3(Math.random() * 5 - 2.5, -5, 0), // Random positions
                isHit: false,
            });
        }
        setNotes(newNotes);
    };

    const handleKeyDown = (event) => {
        // Basic input handling to check if notes are hit
        notes.forEach((note, index) => {
            if (!note.isHit && event.code === 'KeyA') { // Example key (change as needed)
                note.isHit = true;
                setScore((prev) => prev + 1); // Increase score
            }
        });
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [notes]);

    const animate = () => {
        requestAnimationFrame(animate);
        // Update note positions
        // Example logic to move notes down (replace with actual gameplay logic)
        notes.forEach(note => {
            if (!note.isHit) {
                note.position.y += 0.1; // Move notes down
                if (note.position.y > 5) {
                    note.isHit = true; // Mark as hit when out of bounds
                }
            }
        });
        // Re-render notes in the scene (update Three.js logic here)
        renderer.render(scene, camera);
    };

    useEffect(() => {
        if (scene && renderer) {
            animate();
        }
    }, [scene, renderer]);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Game;
