kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    background: [0,0,0,1]
})

// loadRoot("https://i.imgur.com/")

loadSprite("bloco","sprites/bloco.png")
loadSprite("goomba","sprites/goomba.png")
loadSprite("surpresa","sprites/surpresa.png")
loadSprite("unboxed","sprites/unboxed.png")
loadSprite("moeda","sprites/moeda.png")
loadSprite("mario","sprites/mario.png")
loadSprite("cogumelo","sprites/cogumelo.png")






scene("gameMain", ()=>{
    // add([
    //     sprite("bloco"),
    //     pos(),
    //     scale(2),
    //     area(),
    //     body({ isStatic: true })
    // ])

    const map = [
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ", 
        "======================================"
    ]

    const levelCfg = {
        tileWidth: 20,
        tileHeight: 20,
        tiles:{
            "=": ()=>[
                sprite("bloco"),
                area(),
                body({ isStatic: true })
            ]
        }
    }

    const gameLevel = addLevel(map,levelCfg)


})



// const floor = add([
//     sprite("bloco"),
//     pos(0, 0),
//     scale(2),
//     area(),
//     body({ isStatic: true }),
    
// ])



go('gameMain')