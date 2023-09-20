
class Perlin{
    constructor(){
        this.gradients = {};//random set of vectors on coners of node
        this.memory = {};
    }

    random_vector(){
        let angle = Math.random() * 2 * Math.PI;
        return {x: Math.cos(angle), y: Math.sin(angle)};
    }
    
    dot_product_grid(x, y, vx, vy){//calculates how much the vectors are pointing in the same direction
        let g_vect;//random set of vectors on coners of node
        let d_vect = {x: x - vx, y: y - vy};//vector pointing towards point in node
        if (this.gradients[[vx,vy]]){
            g_vect = this.gradients[[vx,vy]];
        } else {
            g_vect = this.random_vector();
            this.gradients[[vx, vy]] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }

    smootherstep(x){
        return 6*x**5 - 15*x**4 + 10*x**3; // perlin quintic curve for fade between cells
    }

    interpolate(x, a, b){
        return a + this.smootherstep(x) * (b-a);//value in between a and b depending on x (0.5, 100, 300) = 200
    }

    get(x,y){
        if (this.memory.hasOwnProperty([x,y]))
            return this.memory[[x,y]];

        let xFloor = Math.floor(x); 
        let yFloor = Math.floor(y);
        //dotproduct of corners with point in node to check its state(https://www.youtube.com/watch?v=MJ3bvCkHJtE (13:00-15:00))
        let topLeft = this.dot_product_grid(x, y, xFloor,   yFloor);
        let topRight = this.dot_product_grid(x, y, xFloor+1, yFloor);
        let bottomLeft = this.dot_product_grid(x, y, xFloor, yFloor+1);
        let bottomRight = this.dot_product_grid(x, y, xFloor+1, yFloor+1);
        //(https://www.youtube.com/watch?v=MJ3bvCkHJtE (16:00-17:30))
        let xTop = this.interpolate(x-xFloor, topLeft, topRight);
        let xBottom = this.interpolate(x-xFloor, bottomLeft, bottomRight);
        let intensity = this.interpolate(y-yFloor, xTop, xBottom);
        //add to memory for faster search
        this.memory[[x,y]]= (intensity + 1)/2; //from -1/1 to 0/1
        return intensity;
    }
}




