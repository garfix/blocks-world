import { } from '../vendor/three'

export default function () {

    const colors = {
        red: 0xa31f34,
        green: 0x25a31f,
        blue: 0x1f2aa3,
        white: 0xc0c0c0,
        brown: 0x654321,
        black: 0x000000
    }

    const scale = 90;
    const opacity = 0.9;
    const boxOpacity = 0.4;
    const tableOpacity = 1.0;
    const tableThickness = 55;

    let scene = null;
    let camera = null;
    let renderer = null;
    let objects = {}

    return {
        build(monitor, data) {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xc2c0bf)
            camera = this.createCamera();
            renderer = new THREE.WebGLRenderer({ antialias: true });

            const ambientLight = new THREE.AmbientLight(0xc0c0c0); // soft white light
            scene.add(ambientLight);

            const spotlight = new THREE.SpotLight(0xffffff, 0.4);
            spotlight.position.set(7, 5, 5);
            scene.add(spotlight);
            objects['camera'] = spotlight

            for (let i = 0; i < data.length; i++) {
                let datum = data[i];
                let object = this.createObject(datum);
                objects[datum.E] = object
                scene.add(object);
            }

            this.addTableLegs(scene)

            renderer.render(scene, camera);
            monitor.innerHTML = "";
            monitor.appendChild(renderer.domElement);

            this.resize();
        },

        resize() {
            const width = window.innerWidth
            const height = window.innerHeight
            const size = (width > height) ? Math.min(Math.min(width, 1500) / 2, height - 50) : Math.min(Math.min(width, 1500), (height - 50) / 2)
            renderer.setSize(size, size);
            renderer.render(scene, camera);
        },

        addTableLegs(scene) {
            scene.add(this.createBlock({
                Width: 50,
                Height: 150,
                Length: 50,
                X: 50,
                Y: -(tableThickness + 150),
                Z: 50,
                Color: 'brown'
            }));
            scene.add(this.createBlock({
                Width: 50,
                Height: 150,
                Length: 50,
                X: 900,
                Y: -(tableThickness + 150),
                Z: 50,
                Color: 'brown'
            }));
            scene.add(this.createBlock({
                Width: 50,
                Height: 150,
                Length: 50,
                X: 900,
                Y: -(tableThickness + 150),
                Z: 950,
                Color: 'brown'
            }));
        },

        createObjectAnimation(datum) {
            let object = objects[datum.E]
            let startX = object.position.x * scale;
            let startY = object.position.y * scale;
            let startZ = -object.position.z * scale;

            let duration = ((Math.sqrt(
                (datum.X - startX) * (datum.X - startX) +
                (datum.Y - startY) * (datum.Y - startY) +
                (datum.Z - startZ) * (datum.Z - startZ)
            )) / 600) * 1000;
            if (duration === 0) { duration = 1; }

            let animation = function (time) {
                if (time > duration) { time = duration; }
                let fract = time / duration;
                return {
                    E: datum.E,
                    X: startX + fract * (datum.X - startX),
                    Y: startY + fract * (datum.Y - startY),
                    Z: startZ + fract * (datum.Z - startZ)
                }
            }

            return {
                animation: animation,
                duration: duration
            }
        },

        runAnimations(animations, maxDuration) {
            let self = this;
            let prevTime = 0;
            let elapsed = 0;
            let frameHandler = function (time) {
                if (prevTime === 0) prevTime = time;
                let timeDiff = time - prevTime;

                prevTime = time;
                elapsed += timeDiff;

                let data = [];
                for (let a = 0; a < animations.length; a++) {
                    data.push(animations[a](elapsed))
                }

                self.update(data)

                if (elapsed < maxDuration) {
                    window.requestAnimationFrame(frameHandler);
                }
            }

            window.requestAnimationFrame(frameHandler);
        },

        update(data) {
            for (let i = 0; i < data.length; i++) {
                let datum = data[i];
                let x = (datum.X / scale);
                let y = (datum.Y / scale);
                let z = -(datum.Z / scale);
                let object = objects[datum.E]
                object.position.set(x, y, z);
                if (datum['E'] === 'camera') {
                    object.lookAt(objects['table:table']);
                }
            }

            renderer.render(scene, camera);
        },

        // https://stackoverflow.com/questions/26021618/how-can-i-create-an-axonometric-oblique-cavalier-cabinet-with-threejs
        createCamera() {
            let camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0, 1000);
            // let camera = new THREE.PerspectiveCamera(40, 2, 10, 500);
            let matrix = new THREE.Matrix4();

            let alpha = Math.PI / 6;
            let Syx = 0, Szx = - 0.5 * Math.cos(alpha), Sxy = 0, Szy = - 0.5 * Math.sin(alpha), Sxz = 0, Syz = 0;

            matrix.set(1, Syx, Szx, 0, Sxy, 1, Szy, 0, Sxz, Syz, 1, 0, 0, 0, 0, 1);

            camera.projectionMatrix.multiply(matrix);
            camera.projectionMatrixInverse.getInverse(camera.projectionMatrix);
            camera.position.set(23, 15, 35.5);

            return camera;
        },

        // https://stackoverflow.com/questions/36472653/drawing-edges-of-a-mesh-in-three-js
        createEdges(mesh) {
            let geometry = new THREE.EdgesGeometry(mesh.geometry);
            let material = new THREE.LineBasicMaterial({ color: 0xf0f0f0 });

            return new THREE.LineSegments(geometry, material);
        },

        createObject(datum) {
            if (datum.Type === "hand") {
                return this.createHand(datum)
            } else if (datum.Type === "pyramid") {
                return this.createPyramid(datum)
            } else if (datum.Type === "table") {
                datum.Y = -tableThickness
                datum.Height = tableThickness
                return this.createBlock(datum)
            } else if (datum.Type === "box") {
                return this.createBox(datum)
            } else {
                return this.createBlock(datum)
            }
        },

        createHand(datum) {
            const shaft = this.createBlockMesh({
                Width: 10,
                Height: 1990,
                Length: 10,
                Color: datum.Color
            })

            let shaftGroup = new THREE.Group();
            shaftGroup.add(shaft);
            shaftGroup.position.set(-5 / scale, 10 / scale, 5 / scale)


            const bottom = this.createBlockMesh({
                Width: 100,
                Height: 10,
                Length: 100,
                Color: datum.Color
            })

            let bottomGroup = new THREE.Group();
            bottomGroup.add(bottom)
            bottomGroup.position.set(-50 / scale, 0, 50 / scale)


            const group = new THREE.Group();
            group.add(shaftGroup);
            group.add(bottomGroup);

            let x = (datum.X / scale);
            let y = (datum.Y / scale);
            let z = -(datum.Z / scale);

            group.position.set(x, y, z)

            return group;
        },

        createPyramid(datum) {

            let x = (datum.X / scale);
            let y = (datum.Y / scale);
            let z = -(datum.Z / scale);
            let w = (datum.Width / scale);
            let l = -(datum.Length / scale);
            let h = (datum.Height / scale);

            const r = Math.sqrt(2 * w * w) / 2
            const geometry = new THREE.ConeGeometry(r, h, 4);

            let material = new THREE.MeshStandardMaterial({ color: colors[datum.Color], wireframe: false, transparent: true, opacity: opacity });
            let mesh = new THREE.Mesh(geometry, material);

            mesh.rotation.y = Math.PI / 4;
            mesh.position.set(w / 2, h / 2, l / 2)

            let group = new THREE.Group();

            group.add(mesh);

            group.position.set(x, y, z);

            return group;
        },

        createBox(datum) {

            const thickness = 5;

            let x = (datum.X / scale);
            let y = (datum.Y / scale);
            let z = -(datum.Z / scale);
            let w = (datum.Width / scale);
            let l = -(datum.Length / scale);
            let h = (datum.Height / scale);

            let group = new THREE.Group();

            const front = this.createBlockMesh({
                Width: datum.Width,
                Length: thickness,
                Height: datum.Height,
                Color: datum.Color
            })
            const back = this.createBlockMesh({
                Width: datum.Width,
                Length: thickness,
                Height: datum.Height,
                Color: datum.Color
            })
            const bottom = this.createBlockMesh({
                Width: datum.Width,
                Length: datum.Length,
                Height: thickness,
                Color: datum.Color
            })
            const left = this.createBlockMesh({
                Width: thickness,
                Length: datum.Length,
                Height: datum.Height,
                Color: datum.Color
            })
            const right = this.createBlockMesh({
                Width: thickness,
                Length: datum.Length,
                Height: datum.Height,
                Color: datum.Color
            })
            back.position.z += l + thickness / scale
            right.position.x += w - thickness / scale
            group.add(front);
            group.add(back);
            group.add(bottom);
            group.add(left);
            group.add(right)

            group.position.set(x, y, z);

            return group;
        },

        createBlock(datum) {
            let object = this.createBlockMesh(datum)

            let x = (datum.X / scale);
            let y = (datum.Y / scale);
            let z = -(datum.Z / scale);

            let group = new THREE.Group();
            group.add(object)

            group.position.set(x, y, z);

            return group;
        },

        createBlockMesh(datum) {

            let w = (datum.Width / scale);
            let l = -(datum.Length / scale);
            let h = ((datum.Height ? datum.Height : 0.01) / scale);

            let blockOpacity = opacity

            if (datum.Type === "box") {
                blockOpacity = boxOpacity;
            } else if (datum.Type === "table") {
                blockOpacity = tableOpacity;
            }

            let mesh = new THREE.Mesh(
                new THREE.BoxGeometry(w, h, -l),
                new THREE.MeshStandardMaterial({
                    color: colors[datum.Color],
                    transparent: true,
                    opacity: blockOpacity
                })
            );

            mesh.position.set(w / 2, h / 2, l / 2)

            return mesh;
        }
    }
};
