// Level.js
import * as THREE from 'three'; // Import THREE library

const levels = [
    {
        name: "Level 1",
        spawnPoint: new THREE.Vector3(0, 1.6, 5),
        create: function(scene) {
            // Create Level 1
            const redCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
            redCube.position.set(0, 1, -10);
            scene.add(redCube);
            
            const greenPlatform = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 10), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
            greenPlatform.position.set(0, 0, -5);
            scene.add(greenPlatform);
        }
    },
    {
        name: "Level 2",
        spawnPoint: new THREE.Vector3(0, 1.6, 10),
        create: function(scene) {
            // Create Level 2
            const blueCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
            blueCube.position.set(2, 1, -15);
            scene.add(blueCube);
            
            const platform = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 10), new THREE.MeshBasicMaterial({ color: 0xffa500 }));
            platform.position.set(0, 0, -10);
            scene.add(platform);
        }
    },
    {
        name: "Level 3",
        spawnPoint: new THREE.Vector3(0, 1.6, 15),
        create: function(scene) {
            // Create Level 3
            const yellowCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
            yellowCube.position.set(-3, 1, -20);
            scene.add(yellowCube);
            
            const platform = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 10), new THREE.MeshBasicMaterial({ color: 0x8a2be2 }));
            platform.position.set(0, 0, -20);
            scene.add(platform);
        }
    }
];

export default levels; // Export the levels array
