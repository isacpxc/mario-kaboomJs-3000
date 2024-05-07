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
loadSprite("mario","sprites/mario.png")
loadSprite("cogumelo","sprites/cogumelo.png")


var isJumping = false
var isBig = false



scene("gameMain", ({score})=>{
    // add([
    //     sprite("bloco"),
    //     pos(),
    //     scale(2),
    //     area(),
    //     body({ isStatic: true })
    // ])

    const map = [
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
        "=                                    =",
        "=                  ^   ^             =", 
        "======================================"
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
            "#": ()=>[sprite("cogumelo"),body(),area(),"cogumelo"]
        }
    }

    const gameLevel = addLevel(map,levelCfg)
    const scoreLabel = add([
        text('Moedas: '+score,10),
        pos(12,5),
        z(100),
        {
            value: score
        }
    ])

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
        sprite("mario"),
        big(),
        body(),
        area(),
        pos(120,0),
        anchor('center'), // sem muito uso nesse caso, ja que gravity é o que vai puxar as coisas para baixo, aparentemente anchor só movimenta o sprite no próprio eixo
        // state('idle',['idle', 'jumping'])
    ])

    

    onKeyDown("left", () => {
        player.flipX = true
        player.move(-120,0)
    })

    onKeyDown("right", () => {
        player.flipX = false
        player.move(120,0)
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


})

scene('lose', ({score})=>{
    add([
        text('Score: '+score,18),
        anchor('center'),
        pos(width()/2, height()/2)
    ])
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



go('gameMain',({score: 0}))