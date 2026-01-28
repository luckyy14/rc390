/**
 * Fume Worker - Fluid Simulation
 * Implements Jos Stam's Stable Fluids algorithm.
 */

const SIZE = 64;
const ITER = 16;
const SCALE = 1;

function IX(x, y) {
    return x + y * SIZE;
}

class FluidSolver {
    constructor(dt, diffusion, viscosity) {
        this.dt = dt;
        this.diff = diffusion;
        this.visc = viscosity;

        this.s = new Float32Array(SIZE * SIZE);
        this.density = new Float32Array(SIZE * SIZE);

        this.Vx = new Float32Array(SIZE * SIZE);
        this.Vy = new Float32Array(SIZE * SIZE);

        this.Vx0 = new Float32Array(SIZE * SIZE);
        this.Vy0 = new Float32Array(SIZE * SIZE);
    }

    addDensity(x, y, amount) {
        this.density[IX(x, y)] += amount;
    }

    addVelocity(x, y, amountX, amountY) {
        const index = IX(x, y);
        this.Vx[index] += amountX;
        this.Vy[index] += amountY;
    }

    step() {
        let visc = this.visc;
        let diff = this.diff;
        let dt = this.dt;
        let Vx = this.Vx;
        let Vy = this.Vy;
        let Vx0 = this.Vx0;
        let Vy0 = this.Vy0;
        let s = this.s;
        let density = this.density;

        this.diffuse(1, Vx0, Vx, visc, dt);
        this.diffuse(2, Vy0, Vy, visc, dt);

        this.project(Vx0, Vy0, Vx, Vy);

        this.advect(1, Vx, Vx0, Vx0, Vy0, dt);
        this.advect(2, Vy, Vy0, Vx0, Vy0, dt);

        this.project(Vx, Vy, Vx0, Vy0);

        this.diffuse(0, s, density, diff, dt);
        this.advect(0, density, s, Vx, Vy, dt);
    }

    diffuse(b, x, x0, diff, dt) {
        let a = dt * diff * (SIZE - 2) * (SIZE - 2);
        this.lin_solve(b, x, x0, a, 1 + 6 * a);
    }

    lin_solve(b, x, x0, a, c) {
        let cRecip = 1.0 / c;
        for (let k = 0; k < ITER; k++) {
            for (let j = 1; j < SIZE - 1; j++) {
                for (let i = 1; i < SIZE - 1; i++) {
                    x[IX(i, j)] =
                        (x0[IX(i, j)] +
                            a *
                            (x[IX(i + 1, j)] +
                                x[IX(i - 1, j)] +
                                x[IX(i, j + 1)] +
                                x[IX(i, j - 1)])) *
                        cRecip;
                }
            }
            this.set_bnd(b, x);
        }
    }

    project(velocX, velocY, p, div) {
        for (let j = 1; j < SIZE - 1; j++) {
            for (let i = 1; i < SIZE - 1; i++) {
                div[IX(i, j)] =
                    (-0.5 *
                        (velocX[IX(i + 1, j)] -
                            velocX[IX(i - 1, j)] +
                            velocY[IX(i, j + 1)] -
                            velocY[IX(i, j - 1)])) /
                    SIZE;
                p[IX(i, j)] = 0;
            }
        }
        this.set_bnd(0, div);
        this.set_bnd(0, p);
        this.lin_solve(0, p, div, 1, 6);

        for (let j = 1; j < SIZE - 1; j++) {
            for (let i = 1; i < SIZE - 1; i++) {
                velocX[IX(i, j)] -= 0.5 * (p[IX(i + 1, j)] - p[IX(i - 1, j)]) * SIZE;
                velocY[IX(i, j)] -= 0.5 * (p[IX(i, j + 1)] - p[IX(i, j - 1)]) * SIZE;
            }
        }
        this.set_bnd(1, velocX);
        this.set_bnd(2, velocY);
    }

    advect(b, d, d0, velocX, velocY, dt) {
        let i0, i1, j0, j1;

        let dtx = dt * (SIZE - 2);
        let dty = dt * (SIZE - 2);

        let s0, s1, t0, t1;
        let tmp1, tmp2, x, y;

        let Nfloat = SIZE - 2;
        let ifloat, jfloat;
        let i, j;

        for (j = 1, jfloat = 1; j < SIZE - 1; j++, jfloat++) {
            for (i = 1, ifloat = 1; i < SIZE - 1; i++, ifloat++) {
                tmp1 = dtx * velocX[IX(i, j)];
                tmp2 = dty * velocY[IX(i, j)];
                x = ifloat - tmp1;
                y = jfloat - tmp2;

                if (x < 0.5) x = 0.5;
                if (x > Nfloat + 0.5) x = Nfloat + 0.5;
                i0 = Math.floor(x);
                i1 = i0 + 1.0;
                if (y < 0.5) y = 0.5;
                if (y > Nfloat + 0.5) y = Nfloat + 0.5;
                j0 = Math.floor(y);
                j1 = j0 + 1.0;

                s1 = x - i0;
                s0 = 1.0 - s1;
                t1 = y - j0;
                t0 = 1.0 - t1;

                let i0i = parseInt(i0);
                let i1i = parseInt(i1);
                let j0i = parseInt(j0);
                let j1i = parseInt(j1);

                d[IX(i, j)] =
                    s0 * (t0 * d0[IX(i0i, j0i)] + t1 * d0[IX(i0i, j1i)]) +
                    s1 * (t0 * d0[IX(i1i, j0i)] + t1 * d0[IX(i1i, j1i)]);
            }
        }
        this.set_bnd(b, d);
    }

    set_bnd(b, x) {
        for (let i = 1; i < SIZE - 1; i++) {
            x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
            x[IX(i, SIZE - 1)] = b === 2 ? -x[IX(i, SIZE - 2)] : x[IX(i, SIZE - 2)];
        }
        for (let j = 1; j < SIZE - 1; j++) {
            x[IX(0, j)] = b === 1 ? -x[IX(1, j)] : x[IX(1, j)];
            x[IX(SIZE - 1, j)] = b === 1 ? -x[IX(SIZE - 2, j)] : x[IX(SIZE - 2, j)];
        }

        x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
        x[IX(0, SIZE - 1)] = 0.5 * (x[IX(1, SIZE - 1)] + x[IX(0, SIZE - 2)]);
        x[IX(SIZE - 1, 0)] = 0.5 * (x[IX(SIZE - 2, 0)] + x[IX(SIZE - 1, 1)]);
        x[IX(SIZE - 1, SIZE - 1)] =
            0.5 * (x[IX(SIZE - 2, SIZE - 1)] + x[IX(SIZE - 1, SIZE - 2)]);
    }

    fade(amount) {
        for (let i = 0; i < this.density.length; i++) {
            this.density[i] *= amount;
        }
    }
}

const solver = new FluidSolver(0.1, 0.0000001, 0.000001);

self.onmessage = function (e) {
    const { type, x, y, dx, dy, amount } = e.data;

    if (type === 'step') {
        // Constant exhaust source (bottom center-ish)
        solver.addDensity(32, 10, 20);
        solver.addVelocity(32, 10, (Math.random() - 0.5) * 5, 10);

        solver.step();
        solver.fade(0.98);
        self.postMessage({ density: solver.density });
    } else if (type === 'interaction') {
        const ix = Math.floor(x * SIZE);
        const iy = Math.floor(y * SIZE);
        if (ix >= 0 && ix < SIZE && iy >= 0 && iy < SIZE) {
            solver.addDensity(ix, iy, amount || 100);
            solver.addVelocity(ix, iy, dx * 10, dy * 10);
        }
    }
};
