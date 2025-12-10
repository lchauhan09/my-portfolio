// ============================================
// Aurora Command - 3D Background Network
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e14, 0.0015); // Aurora void fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap for performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Aurora Colors ---
    const auroraColors = [
        0x00d4aa, // Teal
        0x0099ff, // Blue
        0x8b5cf6, // Violet
    ];

    // --- Particles ---
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 180;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 140;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

        // Random aurora color per particle
        const color = new THREE.Color(auroraColors[Math.floor(Math.random() * auroraColors.length)]);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        velocities.push({
            x: (Math.random() - 0.5) * 0.03,
            y: (Math.random() - 0.5) * 0.03,
            z: (Math.random() - 0.5) * 0.015
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
        size: 0.6,
        transparent: true,
        opacity: 0.9,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // --- Connection Lines ---
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4aa,
        transparent: true,
        opacity: 0.08
    });

    const maxConnections = particleCount * 2;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Mouse Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.0003;
        mouseY = (event.clientY - windowHalfY) * 0.0003;
    });

    // --- Animation Loop ---
    let frameCount = 0;

    function animate() {
        requestAnimationFrame(animate);
        frameCount++;

        // Gentle scene rotation
        scene.rotation.y += 0.0003;
        scene.rotation.x += (mouseY - scene.rotation.x) * 0.02;
        scene.rotation.y += (mouseX - scene.rotation.y) * 0.02;

        // Update particle positions
        const pos = particleSystem.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] += velocities[i].x;
            pos[i * 3 + 1] += velocities[i].y;
            pos[i * 3 + 2] += velocities[i].z;

            // Bounce
            if (Math.abs(pos[i * 3]) > 90) velocities[i].x *= -1;
            if (Math.abs(pos[i * 3 + 1]) > 70) velocities[i].y *= -1;
            if (Math.abs(pos[i * 3 + 2]) > 40) velocities[i].z *= -1;
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Update connections every 2 frames for performance
        if (frameCount % 2 === 0) {
            let lineIndex = 0;
            const connectionDistance = 18;

            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount && lineIndex < maxConnections; j++) {
                    const dx = pos[i * 3] - pos[j * 3];
                    const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                    const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                    const dist = dx * dx + dy * dy + dz * dz;

                    if (dist < connectionDistance * connectionDistance) {
                        linePositions[lineIndex * 6] = pos[i * 3];
                        linePositions[lineIndex * 6 + 1] = pos[i * 3 + 1];
                        linePositions[lineIndex * 6 + 2] = pos[i * 3 + 2];
                        linePositions[lineIndex * 6 + 3] = pos[j * 3];
                        linePositions[lineIndex * 6 + 4] = pos[j * 3 + 1];
                        linePositions[lineIndex * 6 + 5] = pos[j * 3 + 2];
                        lineIndex++;
                    }
                }
            }

            // Clear unused
            for (let k = lineIndex * 6; k < linePositions.length; k++) {
                linePositions[k] = 0;
            }

            lines.geometry.attributes.position.needsUpdate = true;
            lines.geometry.setDrawRange(0, lineIndex * 2);
        }

        renderer.render(scene, camera);
    }

    animate();

    // --- Resize Handler ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
