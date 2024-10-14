import SquareAsteroid from './SquareAsteroid.js';
import CapsuleAsteroid from './CapsuleAsteroid.js';
import SphereAsteroid from './SphereAsteroid.js';
import TorusAsteroid from './TorusAsteroid.js';
import TorusKnotAsteroid from './TorusKnotAsteroid.js';
import TetrahedronAsteroid from './TetrahedronAsteroid.js';

// ObjectPool class:
// This class is used to create a pool of objects to allow for object recycling.
export default class ObjectPool {
    // The constructor takes in a number n and creates a pool of n objects.
    constructor(n) {
        this.pool = [];
        this.active = [];

        for (var i = 0; i < n; i++) {
            this.pool.push(this.createObject());
        }
    }

    // This function creates a random asteroid object.
    createObject() { 
        var random = Math.random() * 100;
        if (random < 30) {
            return new SquareAsteroid();
        }
        else if (random < 50) {
            return new CapsuleAsteroid();
        }
        else if (random < 70) {
            return new SphereAsteroid();
        }
        else if (random < 85) {
            return new TetrahedronAsteroid();
        }
        else if (random < 95) {
            return new TorusAsteroid();
        }
        else {
            return new TorusKnotAsteroid();
        }
    }

    // This function gets an object from the pool.
    getObject() {
        if (this.pool.length > 0) {
            this.active.push(this.pool.pop());
        }
        this.active.push(this.createObject());
    }

    // This function returns an object to the pool.
    returnObject(object) {
        this.pool.push(object);
    }
}