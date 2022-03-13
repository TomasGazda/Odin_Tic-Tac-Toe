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
    let maxdepth =9;


    const newgame = (withFriend,name1,name2,bestofGames) =>{
        bestof = bestofGames;
        player1 = player(name1,false,'X',0);
        $('#player1_name').text(name1);
        $('#player1_score').text(0);
        if(withFriend){
            
            player2 = player(name2,false,'O',0);
        }else{
            player2 = player(name2,true,'O',$('input[name="level"]:checked').val());
        }
        $('#player2_name').text(name2);
        $('#player2_score').text(0);
        board = [0,0,0,0,0,0,0,0,0];

        readyBoard();
        bestof = bestofGames;
        
        

        playermove = player1;
        



    } ;

    const player = (name,isComp,playersymbol,level) =>{
        const playerName = name;
        const isComputer = isComp;
        const symbol = playersymbol;
        let score = 0;
        let nodesMap = [];
        let treshhold = level;
        return{playerName,isComputer,symbol,score,nodesMap,treshhold};

    };

    const move = (element) =>{ 
        movecount ++;
       element.html(playermove.symbol);
       element.addClass("dis");
       let position = parseInt(element.data("position"));
       board[position] = playermove.symbol;

        
        let end = checkend(board,playermove);
        

        if(!end.isWinning && !end.fullboard){
            if(playermove == player1){
                playermove = player2;
            }else{
                playermove = player1;
            }
            if(!twoplayers & playermove.isComputer){
                move(computerMove(board,playermove));
            }
        }else {
            if(end.isWinning){ 
                winningBoard(end.combination);
                end.winner.score ++;
                if(end.winner == player1){
                    $('#player1_score').text(player1.score);
                
                }else{
                   $('#player2_score').text(player2.score);
                }
            }
           
             if(end.winner != null && end.winner.score > bestof/2 ){
                 cleanBoard();
                $('#winner_name').text(end.winner.playerName);
                $('#winnermodal').modal('show'); 
             }else{
                movecount = 0;
                board = [0,0,0,0,0,0,0,0,0];
                gamesplayed++;
                setTimeout(
                    function() 
                    {
                        readyBoard();
                        if(gamesplayed%2 == 0){
                            playermove = player1;
                        }
                        else{
                            playermove = player2;
                        }
                        if(playermove.isComputer){
                            move(computerMove);
                        }
                    }, 1500);
                
             }
            
        }

    }

    const fullboard = (board) =>{
        for (let index = 0; index < board.length; index++) {
           
            if(board[index] == 0){
                return false;
            }
    
        }
        return true;


    }
    const checkend = (board,player) =>{
        const winners = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        let positions = [];

    for (let index = 0; index < board.length; index++) {
        if(board[index] == player.symbol){
            positions.push(index);
        }
        

    }
    let isWinning = false;
    let winner = null;
    let = combination = {};
    winners.forEach(elem => {
        let Included = elem.every(val => positions.includes(val));
        if(Included) {
            
            isWinning = true;
            winner = player;
            combination = elem;
        }


   
        
    });
    
     return {fullboard:fullboard(board),isWinning:isWinning,winner:winner,combination:combination};
    
     
    

    }

    const computerMove = (board,player) =>{
        

        function getRandommove(board){
            let emptycells = [];
            for (let index = 0; index < board.length; index++) {
                const element = board[index];
                
                if(element == 0){
                    emptycells.push(index);

                }
            }
            let move = emptycells[Math.floor(Math.random() * emptycells.length)]
            return $('#cell_'+(move+1));
        }


        function getbestmove(board,max,depth,playeronMove){
                let state = checkend(board,playeronMove);

               if(state.isWinning || state.fullboard || depth == maxdepth){
                   if(state.winner == player){
                       return 100 - depth;
                   }else {
                       return -100 + depth;
                   }
                   return 0;
               }
                if(max){
                    let best = -100;
                    let bestindex = 10;

                    for (let index = 0; index < board.length; index++) {
                        if(board[index] == 0 ){
                            const child = [...board]
                            child[index] =playeronMove.symbol;
                            let nodeValue = 0;
                            if(playeronMove == player1){
                                nodeValue = getbestmove(child,!max,depth+1,player2);
                            }else{
                                nodeValue = getbestmove(child,!max,depth+1,player1);
                            }
                            if(best<= nodeValue){
                                best = nodeValue;
                                bestindex = index;
                            }
                        }
                        
                    }
                    playeronMove.nodesMap.push({boardposition:board,index:bestindex});

                    return best;
                
                }else{
                    let best = 100;

                    for (let index = 0; index < board.length; index++) {
                        if(board[index] == 0 ){
                            const child = [...board]
                            child[index] =playeronMove.symbol;
                            let nodeValue = 0;
                            if(playeronMove == player1){
                                nodeValue = getbestmove(child,!max,depth+1,player2);
                            }else{
                                nodeValue = getbestmove(child,!max,depth+1,player1);
                            }
                            if(best>= nodeValue){
                                best = nodeValue;
                            }
                        }
                        
                    }

                    return best;
                }









         }
         if(Math.random()>player.treshhold){
            do{
                if(player.nodesMap.length == 0 || maxdepth<9 ){
                    player.nodesMap = [];
                    let bestscore = getbestmove(board,true,0,player);
                 }
                 for (let index = 0; index < player.nodesMap.length; index++) {
                     const element = player.nodesMap[index];
                     if (compareArrays(board,element.boardposition)){
                         return $('#cell_'+(element.index+1));
                     }
                     
                 }
                 player.nodesMap = [];
    
             }while(true);

         }else{
             return getRandommove(board);

         }

         
         


        }


  
    return {move,newgame};
  })();


function readyBoard(){
    $('.cell').each(function (index, element) {
        $(this).removeClass('dis winning losing');
        $(this).html('');       
    });


}
function cleanBoard(){
    $('.cell').each(function (index, element) {
        $(this).removeClass(' winning losing');
        $(this).html('');       
    });


}

$('.cell').click(function () { 
    tictactoe.move($(this));
    
});

 $( document ).ready(function() {
   $('#newGameModal').modal('show'); 
}); 



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
        $('#level').removeAttr('hidden');
    }
    
   
  })

  document.getElementById('winnermodal').addEventListener('hide.bs.modal', function (event) {  
    cleanBoard(); 
  })
function compareArrays(arr1, arr2) {
    for (let index = 0; index < arr1.length; index++) {
        const elem1 = arr1[index];
        const elem2 = arr2[index];
        if(elem1 != elem2){
            return false;
        }
        
    }
    return true;
};

function winningBoard (combination){
    $('.cell').each(function (index) {
        if(combination.includes(parseInt($(this).data("position")))){
            $(this).addClass("dis winning")
        }else{
            $(this).addClass("dis losing")
        }
        
    });   
}