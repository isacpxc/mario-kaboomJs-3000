kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    background: [0,0,0,1]
})

setGravity(1600)

// loadRoot("https://i.imgur.com/")

loadSprite("bloco","sprites/bloco.png")
loadSprite("goomba","sprites/goomba.png")
loadSprite("surpresa","sprites/surpresa.png")
loadSprite("unboxed","sprites/unboxed.png")
loadSprite("moeda","sprites/moeda.png")
// loadSprite("mario","sprites/mario.png")
loadSprite("cogumelo","sprites/cogumelo.png")

loadSprite("tubo","sprites/tubo.png")
loadSprite("tijolo","sprites/tijolo.png")
loadSprite("tubo-top-left","sprites/tubo-top-left.png")
loadSprite("tubo-top-right","sprites/tubo-top-right.png")
loadSprite("tubo-bottom-left","sprites/tubo-bottom-left.png")
loadSprite("tubo-bottom-right","sprites/tubo-bottom-right.png")

loadSprite("blue-bloco","sprites/blue-bloco.png")
loadSprite("blue-tijolo","sprites/blue-tijolo.png")
loadSprite("blue-aco","sprites/blue-aco.png")
loadSprite("blue-goomba","sprites/blue-goomba.png")

loadSprite("mario","sprites/mario-move.png", {
    sliceX: 3.9,
    anims: {
        idle: {
            from: 0, 
            to: 0,
        },
        run: {
            from: 1,
            to: 2,
            loop: true,
            speed: 10
        }
    }
})

// loadSpriteAtlas("sprites/mario-move.png", {
//     "mario": {
//         x: 0,
//         y: 0,
//         width: 90,
//         height: 25,
//         sliceX: 4,
//         anims: {
//             idle: { from: 0, to: 0 },
//             move: { from: 1, to: 3 },
//         },
//     },
// })


var isJumping = false
var isBig = false



scene("gameMain", ({level, score, big})=>{
    // add([
    //     sprite("bloco"),
    //     pos(),
    //     scale(2),
    //     area(),
    //     body({ isStatic: true })
    // ])

    const maps = [
        [
        "=                                    =",
        "=                                    =",
        "=                                    =",
        "=                                    =",
        "=                                    =",
        "=                                    =",
        "=                                    =",
        "=                                    =",
        "=      %   =*=%=                     =",
        "=                                    =",
        "=                              -+    =",
        "=                  ^   ^       ()    =", 
        "======================================"
        ],
        [       
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/     @@@@@@                          /',
        '/                      x x            /',
        '/                    x x x x    -+    /',
        '/           z   z  x x x x x x  ()    /',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        ],
        [
            '                                      ',
            '                             !        ',
            '                            %%%%%%    ',
            '                     !                ',
            '             %%    %%%%%              ',
            '      %%%                             ',
            '                                      ',
            '   %                                  ',
            '=     !    !   =  ^  ^    !    !      ',
            '===========================    ===== /',
            '                          =    =     /',
            '                                     /',
            '        !                            /',
            '      %*%                            /',
            ' -+           %                      /',
            ' ()!         !    ^                  /',
            '%%%%%%%%%%%%%%%%%%   =============== /',
            '                                      ',
            '                                      ',
            '                                      ',
          ],
          [
            '=                                     =',
            '=                                     =',
            '=                                     =',
            '=                                     =',
            '=                                     =',
            '=                                     =',
            '=                                     =',
            '=    ======          =                =',
            '=                 =  =  =             =',
            '=              =  =  =  =  =   -+     =',
            '=              =  =  =  =  =   ()     =',
            '=======================================',
          ],
    ]

    const levelCfg = {
        tileWidth: 20,
        tileHeight: 20,
        tiles:{
            "=": ()=>[area(),body({ isStatic: true }),sprite("bloco")],
            "$": ()=>[sprite("moeda"),area(),"moeda"],
            "%": ()=>[sprite("surpresa"),area(),body({isStatic: true}),"moeda-surpresa"],
            "*": ()=>[sprite("surpresa"),area(),body({isStatic: true}),"cogumelo-surpresa"],
            "}": ()=>[sprite("unboxed"),body({ isStatic: true }), area()],
            "^": ()=>[sprite("goomba"),body(),area(),"dangerous"],
            "#": ()=>[sprite("cogumelo"),body(),area(),"cogumelo"],

            '~': ()=>[sprite('tijolo'), body({isStatic: true})],
            '(': ()=>[sprite('tubo-bottom-left'), body({isStatic: true}),area(), scale(0.5)],
            ')': ()=>[sprite('tubo-bottom-right'), body({isStatic: true}),area(), scale(0.5)],
            '-': ()=>[sprite('tubo-top-left'), body({isStatic: true}), 'tubo',area(), scale(0.5)],
            '+': ()=>[sprite('tubo-top-right'), body({isStatic: true}), 'tubo',area(), scale(0.5)],
            '!': ()=>[sprite('blue-bloco'), body({isStatic: true}),area(), scale(0.5)],
            '/': ()=>[sprite('blue-tijolo'), area(), body({isStatic: true}), scale(0.5)],
            'z': ()=>[sprite('blue-goomba'),body(), 'dangerous',area(), scale(0.5)],
            'x': ()=>[sprite('blue-aco'), body({isStatic: true}),area(), scale(0.5)],
        }
    }

    const gameLevel = addLevel(maps[level],levelCfg)
    const scoreLabel = add([
        text('Moedas: '+score,10),
        pos(12,5),
        z(100),
        {
            value: score
        }
    ])

    add([text('Level: '+parseInt(level+1),10),pos(12,30)])

    function big(){
        return{
            isBig(){
                return isBig
            },
            smallify(){
                this.scale = vec2(1)
                isBig = false
            },
            biggify(){
                this.scale = vec2(1.5)
                isBig = true
            }
        }
    }

    const player = add([
        sprite("mario", {
            // anim: "idle",
            // animSpeed: 0.1,
            frame: 0
        }),
        big(),
        body(),
        area(),
        pos(120,0),
        anchor('center'), // sem muito uso nesse caso, ja que gravity é o que vai puxar as coisas para baixo, aparentemente anchor só movimenta o sprite no próprio eixo
        // state('idle',['idle', 'jumping'])
    ])

if(isBig){
    player.biggify()
}

    onKeyDown("left", () => {
        player.flipX = true
        player.move(-120,0)
    })

    onKeyPress('left', ()=>{
        player.flipX = true
        player.play('run')
    })

    onKeyPress('right', ()=>{
        player.flipX = false
        player.play('run')
    })

    onKeyDown("right", () => {
        player.flipX = false
        player.move(120,0)
    })


    /////// parado animação
    onKeyRelease("left", ()=>{
        player.play('idle')
    })

    onKeyRelease("right", ()=>{
        player.play('idle')
    })

    onKeyPress('space', ()=>{
        if (player.isGrounded()/*se retorna uma função no console.log, então o erro é que não esta colocando "()" no final pra chamar a função*/){
            // player.enterState('jumping')
            player.jump(525)
            isJumping = true
        }   
        // doubleJump({numberJump: 2})
        // console.log(get("dangerous"))
    })

    onUpdate('dangerous', (obj)=>{
        obj.move(-20,0)
    })
    
    onUpdate('cogumelo', (obj)=>{
        obj.move(20,0)
    })

    player.onUpdate(()=>{
        if (player.isGrounded()){
            isJumping = false
        }
        // console.log(isJumping)
    })

    player.on('headbutt', obj =>{
        if (obj.is('moeda-surpresa')){
            // console.log(obj.tilePos)
            gameLevel.spawn('$',[obj.tilePos.x,obj.tilePos.y-1])
            destroy(obj)
            gameLevel.spawn('}',[obj.tilePos.x,obj.tilePos.y])
        }

        if (obj.is('cogumelo-surpresa')){
            // console.log(obj.tilePos)
            gameLevel.spawn('#',[obj.tilePos.x,obj.tilePos.y-1])
            destroy(obj)
            gameLevel.spawn('}',[obj.tilePos.x,obj.tilePos.y])
        }
    })

    player.onCollide('cogumelo', (obj)=>{
        destroy(obj)
        player.biggify()
    })
    
    player.onCollide('dangerous', (obj)=>{
        if(isJumping){
            destroy(obj)
        } else {
            if (isBig){
                player.smallify()
            } else {
                go('lose',({score: scoreLabel.value}))
            }
        }
    })
    
    
    player.onCollide('moeda', (obj)=>{
        destroy(obj)
        scoreLabel.value++
        scoreLabel.text = 'Moedas: '+ scoreLabel.value
    })

    player.onCollide('tubo', () =>{
        onKeyPress('down', ()=>{
            go('gameMain', {
                level: (level+1) % maps.length,
                score: scoreLabel.value,
                Big: isBig
            })
        })
    })


})

scene('lose', ({score})=>{
    add([
        text('Score: '+score+"\nPress Space",18),
        anchor('center'),
        pos(width()/2, height()/2)
    ])
    onKeyPress('space', ()=>{
        go('gameMain', {level:0, score: 0, big: isBig})
    })
})

scene('win', ()=>{
    add([
        text('You Win'),
        anchor('center'),
        pos(width()/2, height()/2)
    ])
})

// const floor = add([
//     sprite("bloco"),
//     pos(0, 0),
//     scale(2),
//     area(),
//     body({ isStatic: true }),

// ])



go('gameMain',({level: 0, score: 0, Big: isBig}))