 let twoplayers = true;

 const tictactoe =  ( () => {
    let board = [0,0,0,0,0,0,0,0,0];
    let playermove;
    let bestof = 0;
    let gamesplayed = 0;
    let player1;
    let player2;
    let twoplayers;
    let movecount = 0;

    const newgame = (withFriend,name1,name2,bestofGames) =>{
        bestof = bestofGames;
        player1 = player(name1,false,'X');
        $('#player1_name').text(name1);
        $('#player1_score').text(0);
        if(withFriend){
            
            player2 = player(name2,false,'O');
        }else{
            player2 = player(name2,true,'0');
        }
        $('#player2_name').text(name2);
        $('#player2_score').text(0);
        board = [0,0,0,0,0,0,0,0,0];

        cleanBoard();
        bestof = bestofGames;
        
        

        playermove = player1;
        



    } ;

    const player = (name,isComp,playersymbol) =>{
        const playerName = name;
        const isComputer = isComp;
        const symbol = playersymbol;
        let score = 0
        return{playerName,isComputer,symbol,score};

    };

    const move = (element) =>{ 
        movecount ++;
       element.html(playermove.symbol);
       element.addClass("dis");
       let position = parseInt(element.data("position"));
       board[position] = playermove.symbol;

        let end = false;
        if(movecount>4){
            end = checkend(board,playermove.symbol);
        }

        if(!end[1] && !end[0]){
            if(playermove == player1){
                playermove = player2;
            }else{
                playermove = player1;
            }
            if(!twoplayers & playermove.isComputer){
                move(computerMove());
            }
        }else {
            if(end[1]){ 
                if(playermove == player1){
                    player1.score++;
                    $('#player1_score').text(player1.score);
                
                }else{
                    player2.score++;
                   $('#player2_score').text(player2.score);
                }
            }
           
             if(player1.score > bestof/2 || player2.score > bestof/2){
                if(player1.score > bestof/2){
                    $('#winner_name').text(player1.playerName);
                }else{
                    $('#winner_name').text(player2.playerName);
                }
                $('#winnermodal').modal('show'); 
             }else{
                movecount = 0;
                board = [0,0,0,0,0,0,0,0,0];
                gamesplayed++;
                setTimeout(
                    function() 
                    {
                        cleanBoard();
                        if(gamesplayed%2 == 0){
                            playermove = player1;
                        }
                        else{
                            playermove = player2;
                        }
                    }, 1500);
                
             }
            
        }

    }
  
    return {move,newgame};
  })();


function cleanBoard(){
    $('.cell').each(function (index, element) {
        $(this).removeClass('dis winning losing');
        $(this).html('');
        
    });


}

$('.cell').click(function () { 
    tictactoe.move($(this));
    
});

function computerMove () {

}
 $( document ).ready(function() {
   $('#newGameModal').modal('show'); 
}); 

function checkend(board,symbol){
    const winners = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let positions = [];
    let zeros= 0;

    for (let index = 0; index < board.length; index++) {
        if(board[index] == symbol){
            positions.push(index);
        }
        if(board[index] == 0){
            zeros++;
        }

    }
    let isWinning = false;
    winners.forEach(elem => {
        let Included = elem.every(val => positions.includes(val));
        if(Included) {
            $('.cell').each(function (index, element) {
                if(elem.includes(parseInt($(this).data("position")))){
                    $(this).addClass("dis winning")
                }else{
                    $(this).addClass("dis losing")
                }
                
            });
            
            isWinning = true;
        }
        
    });
    if(zeros == 0 ){
     return [true,isWinning];
    }else{
        return [false,isWinning];
    }
}

$('#start_game').click(function () { 
    $('#gameSettingModal').modal('hide'); 
    tictactoe.newgame(twoplayers,$('#player1name').val(),$('#player2name').val(),$('input[name="options"]:checked').val());
    $('#player2name').val("");
    $('#player1name').val("");
    $("#player2name").prop('disabled', false);

   
});


document.getElementById('gameSettingModal').addEventListener('show.bs.modal', function (event) {
    
    var button = event.relatedTarget;
    var option = button.getAttribute('data-bs-mode');
    if (option == "1") {
        twoplayers = false;
        $('#player2name').val("Computer");
        $("#player2name").prop('disabled', true);
    }
    
   
  })
