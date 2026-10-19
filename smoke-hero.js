/**
 * WebGL smoke — viewport-aware, no debug UI.
 * Based on reference/webgl-smoke (CodePen teolitto/KwOVvL).
 */
(function () {
    'use strict';

    var canvasHosts = document.querySelectorAll('[data-smoke-canvas]');
    if (!canvasHosts.length) {
        return;
    }

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
        canvasHosts.forEach(function (host) {
            host.style.display = 'none';
        });
        document.querySelectorAll('.hero--smoke-intro').forEach(function (hero) {
            hero.classList.remove('hero--smoke-intro');
        });
        return;
    }

    var THREE_URL = 'assets/js/three.min.js';
    var SMOKE_TEXTURE = 'assets/smoke-element.png';
    var OVERLAY_FADE_DELAY_MS = 3500;
    var threeLoadPromise = null;
    var instances = [];

    canvasHosts.forEach(function (canvasHost) {
        var section = canvasHost.closest('section') || canvasHost.parentElement;
        var mode = canvasHost.getAttribute('data-smoke-mode') || 'standalone';
        var isOverlay = mode === 'overlay';

        instances.push(createInstance(canvasHost, section, isOverlay));
    });

    if (instances.some(function (instance) { return instance.isOverlay; })) {
        loadThree();
    }

    function createInstance(canvasHost, section, isOverlay) {
        return {
            canvasHost: canvasHost,
            section: section,
            isOverlay: isOverlay,
            initialized: false,
            initializing: false,
            running: false,
            firstFrameRendered: false,
            animationId: null,
            clock: null,
            renderer: null,
            scene: null,
            camera: null,
            smokeParticles: [],
            delta: 0,
            resizeHandler: null,
            fadeTimer: null,
            fadeComplete: false
        };
    }

    function revealHeroWithoutSmoke(instance) {
        if (instance.section) {
            instance.section.classList.remove('hero--smoke-intro', 'hero--smoke-revealing');
        }
        instance.canvasHost.style.display = 'none';
    }

    function scheduleOverlayFade(instance) {
        if (!instance.isOverlay || instance.fadeComplete || instance.fadeTimer !== null) {
            return;
        }

        instance.fadeTimer = window.setTimeout(function () {
            instance.fadeTimer = null;
            if (instance.section) {
                instance.section.classList.add('hero--smoke-revealing');
            }
            instance.canvasHost.classList.add('hero-smoke--revealed');
        }, OVERLAY_FADE_DELAY_MS);
    }

    function completeOverlayFade(instance) {
        if (instance.fadeComplete) {
            return;
        }
        instance.fadeComplete = true;
        if (instance.fadeTimer !== null) {
            window.clearTimeout(instance.fadeTimer);
            instance.fadeTimer = null;
        }
        if (instance.section) {
            instance.section.classList.remove('hero--smoke-intro', 'hero--smoke-revealing');
        }
        pauseInstance(instance);
    }

    function bindOverlayFade(instance) {
        if (!instance.isOverlay || instance.fadeBound) {
            return;
        }
        instance.fadeBound = true;
        instance.canvasHost.addEventListener('transitionend', function (event) {
            if (event.target === instance.canvasHost && event.propertyName === 'opacity') {
                completeOverlayFade(instance);
            }
        });
    }

    function loadThree() {
        if (window.THREE) {
            return Promise.resolve(window.THREE);
        }
        if (threeLoadPromise) {
            return threeLoadPromise;
        }

        threeLoadPromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = THREE_URL;
            script.async = true;
            script.onload = function () {
                resolve(window.THREE);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });

        return threeLoadPromise;
    }

    function particleCount() {
        return window.matchMedia('(max-width: 768px)').matches ? 48 : 96;
    }

    function getSize(canvasHost) {
        var rect = canvasHost.getBoundingClientRect();
        return {
            width: Math.max(1, Math.round(rect.width)),
            height: Math.max(1, Math.round(rect.height))
        };
    }

    function resizeInstance(instance) {
        if (!instance.renderer || !instance.camera) {
            return;
        }
        var size = getSize(instance.canvasHost);
        instance.renderer.setSize(size.width, size.height, false);
        instance.camera.aspect = size.width / size.height;
        instance.camera.updateProjectionMatrix();
    }

    async function initInstance(instance) {
        if (instance.initialized || instance.initializing) {
            return;
        }
        instance.initializing = true;

        try {
            var THREE = await loadThree();
            var size = getSize(instance.canvasHost);

            instance.clock = new THREE.Clock();

            instance.renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha: false,
                powerPreference: 'high-performance'
            });
            instance.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
            instance.renderer.setSize(size.width, size.height, false);
            instance.renderer.setClearColor(0x050807, 1);

            instance.canvasHost.appendChild(instance.renderer.domElement);

            instance.scene = new THREE.Scene();
            instance.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 1, 10000);
            instance.camera.position.z = 1000;
            instance.scene.add(instance.camera);

            var light = new THREE.DirectionalLight(0xffffff, 0.5);
            light.position.set(-1, 0, 1);
            instance.scene.add(light);

            var textureLoader = new THREE.TextureLoader();
            var smokeTexture = await new Promise(function (resolve, reject) {
                textureLoader.load(SMOKE_TEXTURE, resolve, undefined, reject);
            });

            var smokeMaterial = new THREE.MeshLambertMaterial({
                color: 0x00dddd,
                map: smokeTexture,
                transparent: true,
                opacity: 1
            });
            var smokeGeo = new THREE.PlaneGeometry(300, 300);
            var count = particleCount();

            for (var p = 0; p < count; p++) {
                var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
                particle.position.set(
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                    Math.random() * 1000 - 100
                );
                particle.rotation.z = Math.random() * Math.PI * 2;
                particle.userData.spin = (Math.random() > 0.5 ? 1 : -1) * 0.2;
                instance.scene.add(particle);
                instance.smokeParticles.push(particle);
            }

            instance.resizeHandler = function () {
                resizeInstance(instance);
            };
            window.addEventListener('resize', instance.resizeHandler, { passive: true });

            instance.initialized = true;
            if (instance.isOverlay) {
                bindOverlayFade(instance);
            }
            resumeInstance(instance);
        } catch (error) {
            instance.initializing = false;
            throw error;
        }
    }

    function evolveSmoke(instance) {
        var sp = instance.smokeParticles.length;
        while (sp--) {
            instance.smokeParticles[sp].rotation.z += instance.delta * instance.smokeParticles[sp].userData.spin;
        }
    }

    function markFirstFrame(instance) {
        if (instance.firstFrameRendered || !instance.isOverlay) {
            return;
        }
        instance.firstFrameRendered = true;
        scheduleOverlayFade(instance);
    }

    function renderFrame(instance) {
        if (!instance.running || !instance.renderer) {
            return;
        }
        instance.delta = instance.clock.getDelta();
        evolveSmoke(instance);
        instance.renderer.render(instance.scene, instance.camera);
        markFirstFrame(instance);
        instance.animationId = requestAnimationFrame(function () {
            renderFrame(instance);
        });
    }

    function resumeInstance(instance) {
        if (!instance.initialized || instance.running || instance.fadeComplete) {
            return;
        }
        instance.running = true;
        if (instance.clock) {
            instance.clock.getDelta();
        }
        renderFrame(instance);
    }

    function pauseInstance(instance) {
        instance.running = false;
        if (instance.animationId !== null) {
            cancelAnimationFrame(instance.animationId);
            instance.animationId = null;
        }
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                var instance = entry.target.__smokeInstance;
                if (!instance) {
                    return;
                }
                if (entry.isIntersecting) {
                    if (instance.initialized) {
                        resumeInstance(instance);
                    } else if (!instance.isOverlay && !instance.initializing) {
                        initInstance(instance).catch(function () {
                            revealHeroWithoutSmoke(instance);
                        });
                    }
                } else {
                    pauseInstance(instance);
                }
            });
        },
        { rootMargin: '120px 0px', threshold: 0.05 }
    );

    instances.forEach(function (instance) {
        if (!instance.section) {
            return;
        }
        instance.section.__smokeInstance = instance;
        if (instance.isOverlay) {
            initInstance(instance).catch(function () {
                revealHeroWithoutSmoke(instance);
            });
        }
        observer.observe(instance.section);
    });
})();
