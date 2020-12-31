document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div');
    const scoreDisplay = document.querySelector('span');
    const startBtn = document.querySelector('.start');

    const width = 10;
    let currentIndex = 0;
    let appleIndex = 0
    let currentSnake = [2,1,0]; //the div in a grid being 2 (HEAD) and 0 (TAIL) and 1(Snake BODY)
    let direction = 1;
    let score = 0;
    let speed = 0.9;
    let intervalTime = 0;
    let interval = 0;

    //to start and restart the game
    function startGame() {
    currentSnake.forEach(index => squares[index].classList.remove('snake'));
    squares[appleIndex].classList.remove('apple');
    clearInterval(interval);
    score = 0;
    randomApple();
    direction = 1;
    scoreDisplay.innerHTML = score;
    intervalTime = 1000;
    currentSnake = [2,1,0];
    currentIndex = 0;
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    interval = setInterval(moveOutComes, intervalTime);
    }


    //function that deals with all outcomes of a Snake
    function moveOutComes () {

        //deals with snake hitting self and the border
        if (
          (currentSnake[0] + width >= (width * width) && direction === width) || //if snake hits bottom
          (currentSnake[0] % width === width -1 && direction === 1) || //if snake hits right wall
          (currentSnake[0] % width === 0 && direction === -1) || //if snake hits left wall
          (currentSnake[0] - width < 0 && direction === -width) || //if snake hits the top
          squares[currentSnake[0] + direction].classList.contains('snake') // if snake goes into itself
        ) {
            return clearInterval(interval); //clear interval if any above happen
        }

        const tail = currentSnake.pop(); //remove laast item of the array and show it
        squares[tail].classList.remove('snake'); //remove class snake from the tail
        currentSnake.unshift(currentSnake[0] + direction); // give direction to the head of the snake


        //deals with snake getting an apple
        if (squares[currentSnake[0]].classList.contains('apple')) {
            squares[currentSnake[0]].classList.remove('apple');
            squares[tail].classList.add('snake');
            currentSnake.push(tail);
            randomApple();
            score++;
            scoreDisplay.textContent = score;
            clearInterval(interval);
            intervalTime = intervalTime * speed;
            interval = setInterval(moveOutComes, intervalTime);
        }
        squares[currentSnake[0]].classList.add('snake');
    }

    //random generate new apple
    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * squares.length);
        } while (squares[appleIndex].classList.contains('snake'))

        squares[appleIndex].classList.add('apple');
    }



    //assign function to keycodes
    function control(e) {
        squares[currentIndex].classList.remove('snake') //remove class snake

        if(e.keyCode === 37) {
            direction = -1; //if we press left, the snake will go left one div
        } else if (e.keyCode === 38) {
            direction = -width; //if we press up, the snake will go back 10 divs appearing to go up
        } else if (e.keyCode === 39) {
            direction = 1; //if we press right, the snake will go right one div
        } else if (e.keyCode === 40) {
            direction = +width; // if we press down the snake will appear in the div, 10 divs from           where we were before
        }
    }

    document.addEventListener('keyup', control);

    startBtn.addEventListener('click', startGame);







    // function moveSnake() {
    //      if (currentIndex < width - 1) {
    //         squares[currentIndex].classList.remove('snake');
    //         squares[currentIndex+1].classList.add('snake');
    //         currentIndex = currentIndex + 1;
    //      }
    //      else {
    //          clearInterval(timerId);
    //      }
    // }
    //
    // let timerId = setInterval(moveSnake, 500);

})