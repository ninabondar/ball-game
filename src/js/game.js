import * as most from "most";

//Mykhailo made a game tick called animation, most.periodic
const animation = most.periodic(1000 / 60);
const keyDown = most.fromEvent('keydown', document);
const gameHeight = 400;
const gameWidth = 600;
let ballSpeed = 3;
const platformSpeed = 15;
let bricks = [];
const brickHeight = 18;
const brickWidth = 62;


class Game {
    constructor() {
        const bricks = Brick.draw();
        let pl = Platform(document.querySelector(".platform"), 400, 400);
        Ball(document.querySelector('.ball'), gameWidth / 2, gameHeight - 10);

    }
}

const intersects = (ball, pos) => {
    for(let i=0; i < bricks.length; i++) {
        let brickX1 = bricks[i][0];
        let brickX2 = brickWidth + brickX1;
        let brickY1 = bricks[i][1];
        let brickY2 = brickY1 + brickHeight;
        //if the ball hits the brick, from any side
        if (brickX1 <= ball[0] && ball[0] <= brickX2) {
            if( (brickY1 -2  < ball[1] && ball[1] < brickY1) ||
                (brickY2  < ball[1] && ball[1] < brickY2)) {
                pos[1] = -pos[1];
                document.getElementsByClassName(".brick")[i].remove();
                bricks.splice(i, 1);
            }
        }
        //now check Y coord-s
        if(brickY1 <= ball[1] && ball[1] <= brickY2){
            if( (brickX1 < ball[0] && ball[0] < brickX1) ||
                (brickX2 < ball[0] && ball[0] < brickX2) ){
                pos[0] = -pos[0];
                document.getElementsByClassName(".brick")[i].remove();
                bricks.splice(i, 1);
            }
        }
    }
};

const Ball = (ball, x, y) => {
    ball.setAttribute("cx", x);
    ball.setAttribute("cy", y);
    const moveX = animation.scan(
            (nextX) => {
                if (nextX >= gameWidth || nextX < 0) {
                    ballSpeed = -ballSpeed;
                }
                return nextX + ballSpeed;
            }, x)
        .observe((step) => {
            x = step;
            ball.setAttribute("cx", step);
        });


    const moveY = animation.scan((nextY) => {
            const platform = document.getElementsByClassName(".platform")[0];
            const platformX = parseInt(platform.getAttribute("x"));
            const platformX2 = parseInt(platform.getAttribute("width")) + platformX;
            if (nextY >= gameHeight) {
                //hitting the ball
                    if (platformX <= x && x <= platformX2) {
                        stepY = -stepY;
                    }
                    else {
                        stepX = 0;
                        stepY = 0;
                    }
                }
                let v = intersects([x,nextY], [stepX,stepY]);
                stepX = v[0];
                stepY = v[1];

                if (nextY < 0) {
                    stepY = -stepY;
                }
                return nextY + stepY;
            },
            y).observe((a) => {
            ball.setAttribute("cy", a);

        });
};

const Platform = (platform, x, y) => {
    platform.setAttribute("x", x);
    platform.setAttribute("y", y);
    keyDown
        .observe(action => {
            if (action.key === 'ArrowLeft' && x > 0) {
                x -= platformSpeed;
            }
            else if (action.key === 'ArrowRight' && x < (gameWidth - platform.getAttribute("width"))) {
                x += platformSpeed;
            }
            platform.setAttribute("x", x);
        });
};

const Brick = () => {
    const draw = () => {
        let svg = document.getElementsByClassName(".Game")[0];
        let svgNS = svg.namespaceURI;
        let coordinates = [];
        const columns = 9;
        const rows = 5;
        for(let r = 0; r < rows; r++) {
            for (let i = 0; i < columns; i++) {
                let brick = document.createElementNS(svgNS, 'rect');
                brick.setAttribute('class', 'brick');
                brick.setAttribute('x', (brickWidth + 5) * i);
                brick.setAttribute('y', (brickHeight + 5) * r);
                brick.setAttribute('width', brickWidth);
                brick.setAttribute('height', brickHeight);
                coordinates.push([(brickWidth + 5) * i,(brickHeight + 5) * r]);
                svg.appendChild(brick);
            }
        }
    };
    return bricks;
};


export default Game;