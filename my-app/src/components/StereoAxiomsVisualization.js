import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const Sketch = () => {
    const sketchRef = useRef();

    useEffect(() => {
        const sketch = (p) => {
            let shapes = [];

            p.setup = () => {
                p.createCanvas(1000, 800, p.WEBGL).parent(sketchRef.current);
                p.noFill();
                p.stroke(255);

                // Initialize shapes with position and rotation details
                shapes.push(new Shape(p, 'cube', -400, 0, 100));
                shapes.push(new Shape(p, 'cuboid', -200, 0, 100, 150, 200));
                shapes.push(new Shape(p, 'sphere', 0, 0, 50));
                shapes.push(new Shape(p, 'cylinder', 200, 0, 50, 150));
                shapes.push(new Shape(p, 'cone', 400, 0, 50, 150));
                shapes.push(new Shape(p, 'pyramid', -200, 200, 50, 100));
                shapes.push(new Shape(p, 'tetrahedron', 0, 200, 100));
                shapes.push(new Shape(p, 'triangular_prism', 200, 200, 50, 100, 3));
                shapes.push(new Shape(p, 'hexagonal_prism', 400, 200, 50, 100, 6));
            };

            p.draw = () => {
                p.background(0);
                shapes.forEach(shape => shape.display());
            };

            p.mousePressed = () => {
                for (let shape of shapes) {
                    if (shape.contains(p.mouseX - p.width / 2, p.mouseY - p.height / 2)) {
                        shape.startDragging(p.mouseX, p.mouseY);
                        break;
                    }
                }
            };

            p.mouseDragged = () => {
                shapes.forEach(shape => shape.drag(p.mouseX, p.mouseY));
            };

            p.mouseReleased = () => {
                shapes.forEach(shape => shape.stopDragging());
            };

            class Shape {
                constructor(p, type, x, y, ...params) {
                    this.p = p;
                    this.type = type;
                    this.x = x;
                    this.y = y;
                    this.params = params;
                    this.angleX = 0;
                    this.angleY = 0;
                    this.dragging = false;
                    this.previousMouseX = 0;
                    this.previousMouseY = 0;
                }

                display() {
                    this.p.push();
                    this.p.translate(this.x, this.y);
                    this.p.rotateX(this.angleX);
                    this.p.rotateY(this.angleY);
                    switch (this.type) {
                        case 'cube':
                            this.p.box(...this.params);
                            break;
                        case 'cuboid':
                            this.p.box(...this.params);
                            break;
                        case 'sphere':
                            this.p.sphere(...this.params);
                            break;
                        case 'cylinder':
                            this.p.cylinder(...this.params);
                            break;
                        case 'cone':
                            this.p.cone(...this.params);
                            break;
                        case 'pyramid':
                            this.pyramid(...this.params);
                            break;
                        case 'tetrahedron':
                            this.tetrahedron(...this.params);
                            break;
                        case 'triangular_prism':
                            this.prism(...this.params);
                            break;
                        case 'hexagonal_prism':
                            this.prism(...this.params);
                            break;
                        default:
                            break;
                    }
                    this.p.pop();
                }

                contains(mx, my) {
                    // For simplicity, we are using a bounding box check here. You may need more precise hit detection for complex shapes.
                    return mx > this.x - this.params[0] && mx < this.x + this.params[0] &&
                        my > this.y - this.params[0] && my < this.y + this.params[0];
                }

                startDragging(mx, my) {
                    this.dragging = true;
                    this.previousMouseX = mx;
                    this.previousMouseY = my;
                }

                drag(mx, my) {
                    if (this.dragging) {
                        let dx = mx - this.previousMouseX;
                        let dy = my - this.previousMouseY;
                        this.angleX += dy * 0.01;
                        this.angleY += dx * 0.01;
                        this.previousMouseX = mx;
                        this.previousMouseY = my;
                    }
                }

                stopDragging() {
                    this.dragging = false;
                }

                pyramid(baseSize, height) {
                    this.p.beginShape(this.p.TRIANGLES);
                    this.p.vertex(-baseSize, -baseSize, 0);
                    this.p.vertex(baseSize, -baseSize, 0);
                    this.p.vertex(0, 0, -height);
                    this.p.vertex(baseSize, -baseSize, 0);
                    this.p.vertex(baseSize, baseSize, 0);
                    this.p.vertex(0, 0, -height);
                    this.p.vertex(baseSize, baseSize, 0);
                    this.p.vertex(-baseSize, baseSize, 0);
                    this.p.vertex(0, 0, -height);
                    this.p.vertex(-baseSize, baseSize, 0);
                    this.p.vertex(-baseSize, -baseSize, 0);
                    this.p.vertex(0, 0, -height);
                    this.p.endShape();
                }

                tetrahedron(size) {
                    this.p.beginShape(this.p.TRIANGLES);
                    for (let i = 0; i < 3; i++) {
                        let theta = this.p.TWO_PI / 3 * i;
                        let nextTheta = this.p.TWO_PI / 3 * (i + 1);
                        this.p.vertex(0, 0, -size);
                        this.p.vertex(this.p.cos(theta) * size, this.p.sin(theta) * size, 0);
                        this.p.vertex(this.p.cos(nextTheta) * size, this.p.sin(nextTheta) * size, 0);
                    }
                    for (let i = 0; i < 3; i++) {
                        let theta = this.p.TWO_PI / 3 * i;
                        let nextTheta = this.p.TWO_PI / 3 * (i + 1);
                        this.p.vertex(this.p.cos(theta) * size, this.p.sin(theta) * size, 0);
                        this.p.vertex(this.p.cos(nextTheta) * size, this.p.sin(nextTheta) * size, 0);
                        this.p.vertex(0, 0, size);
                    }
                    this.p.endShape();
                }

                prism(radius, height, sides) {
                    this.p.beginShape(this.p.QUADS);
                    for (let i = 0; i < sides; i++) {
                        let angle = this.p.TWO_PI / sides * i;
                        let nextAngle = this.p.TWO_PI / sides * (i + 1);
                        let x1 = radius * this.p.cos(angle);
                        let y1 = radius * this.p.sin(angle);
                        let x2 = radius * this.p.cos(nextAngle);
                        let y2 = radius * this.p.sin(nextAngle);
                        this.p.vertex(x1, y1, -height / 2);
                        this.p.vertex(x2, y2, -height / 2);
                        this.p.vertex(x2, y2, height / 2);
                        this.p.vertex(x1, y1, height / 2);
                    }
                    this.p.endShape();
                }
            }
        };

        const myP5 = new p5(sketch);

        return () => {
            myP5.remove();
        };
    }, []);

    return <div ref={sketchRef}></div>;
};

export default Sketch;
