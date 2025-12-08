// 3D Background with Three.js - Network Nodes Theme
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002); // Deep Void Fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent
    container.appendChild(renderer.domElement);

    // --- Particles & Interactive Network ---
    const particleCount = 250;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    // Initialize random positions and velocities
    for (let i = 0; i < particleCount; i++) {
        // Spread particles across a wide volume
        positions[i * 3] = (Math.random() - 0.5) * 200;     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 150; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z

        velocities.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Material
    const pMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // Lines for connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x7000ff,
        transparent: true,
        opacity: 0.15
    });

    // We will draw lines dynamically using a LineSegments geometry
    // Max 2 connections per particle to keep performance high
    const maxConnections = particleCount * 2;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 3 * 2); // 2 points per line, 3 coords per point
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);


    // --- Interaction ---
    const mouse = { x: 0, y: 0 };
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX - windowHalfX);
        mouse.y = (event.clientY - windowHalfY);
    });

    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);

        // Smooth camera movement based on mouse
        targetX = mouse.x * 0.001;
        targetY = mouse.y * 0.001;

        scene.rotation.y += 0.0005; // Auto rotate slightly
        // scene.rotation.x += (targetY - scene.rotation.x) * 0.05;
        // scene.rotation.y += (targetX - scene.rotation.y) * 0.05;

        // Update Particles
        const positions = particleSystem.geometry.attributes.position.array;

        let lineVertexIndex = 0;

        // Reset line positions
        // We'll reconstruct the line buffer every frame or periodically. 
        // For performance, let's just connect close particles.

        // Loop through particles
        for (let i = 0; i < particleCount; i++) {
            // Update Positions
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

            // Bounce off boundaries
            if (Math.abs(positions[i * 3]) > 100) velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 75) velocities[i].y *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 50) velocities[i].z *= -1;

            // Mouse Interaction: Repel/Attract
            // Simple parallax for now
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Connect nearby particles (Brute force for < 300 particles is usually fine)
        let lineIndex = 0;
        const connectionDistance = 15;

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectionDistance) {
                    if (lineIndex < maxConnections) {
                        // Point A
                        linePositions[lineIndex * 6] = positions[i * 3];
                        linePositions[lineIndex * 6 + 1] = positions[i * 3 + 1];
                        linePositions[lineIndex * 6 + 2] = positions[i * 3 + 2];

                        // Point B
                        linePositions[lineIndex * 6 + 3] = positions[j * 3];
                        linePositions[lineIndex * 6 + 4] = positions[j * 3 + 1];
                        linePositions[lineIndex * 6 + 5] = positions[j * 3 + 2];

                        // Opacity based on distance (hack: we can't change opacity per line in single draw call easily without shadermaterial, 
                        // so we just draw them. Ideally we use buffer attribute for color/alpha)

                        lineIndex++;
                    }
                }
            }
        }

        // Zero out remaining lines
        for (let k = lineIndex * 6; k < linePositions.length; k++) {
            linePositions[k] = 0;
        }

        lines.geometry.attributes.position.needsUpdate = true;
        // Optional: dynamic drawing range
        lines.geometry.setDrawRange(0, lineIndex * 2);

        renderer.render(scene, camera);
    }

    animate();

    // --- Resize Hander ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
