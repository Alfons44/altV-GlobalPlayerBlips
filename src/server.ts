import {emitAllClientsRaw, emitClientRaw, on, onClient, Player, PointBlip} from "alt-server";

const cfg = {
  defaultBlip: {
    sprite: 1,
    scale: 1.0,
    alpha: 225,
    color: 0,
  },
  vehicleBlip: {
    sprite: 326,  // Config in vehicleSprite
    scale: 1.0,
    alpha: 225,
    color: 0,
  },
}
const vehicleSprite = [
  326,    // Compacts
  724,    // Sedan
  821,    // SUV
  326,    // Coupes
  824,    // Muscle
  756,    // Sport Classic
  523,    // Sport
  825,    // Super Sport
  348,    // Motorcycle
  757,    // Off-Road
  318,    // Industrial
  85,     // Utility
  67,     // Van
  348,    // Bike / Cycle
  410,    // Boat
  422,    // Helicopter
  423,    // Planes
  513,    // Service
  56,     // Emergency
  421,    // Military
  477,    // Commercial
  795,    // Train
]

const createdBlips: PointBlip[] = []
PointBlip.all.forEach(blip => blip.destroy())
on('playerConnect', async (player: Player) => {
  const playerBlip = new PointBlip(0,0,0)
  playerBlip.alpha = 0
  createdBlips[player.id] = playerBlip
  await updatePlayerBlip(player, cfg.defaultBlip)
  emitAllClientsRaw('server::globalPlayerBlips::refresh::category')
  emitClientRaw(player, 'server::globalPlayerBlips::hide::blipFromPlayer', player)
})

on('playerDisconnect', (player: Player) => {
  if(!createdBlips[player.id]) return;
  createdBlips[player.id].display = 0
  createdBlips[player.id].destroy()
})

on('playerEnteredVehicle', (player: Player) => {
  emitClientRaw(player, 'client::globalPlayerBlips::get::vehicleClass')
})

on('playerLeftVehicle', (player: Player) => {
  updatePlayerBlip(player, cfg.defaultBlip)
})

onClient('client::globalPlayerBlips::set::vehicleClass', (src: Player, vClass: number) => {
  updatePlayerBlip(src, cfg.vehicleBlip, vehicleSprite[vClass])
})

setInterval(() => {
  Player.all.forEach(player => {
    if(createdBlips[player.id] == null) return;
    createdBlips[player.id].pos = player.pos
  })
}, 50)

function updatePlayerBlip(player: Player, data: any, sprite?: number) {
  const blip = createdBlips[player.id]
  blip.sprite = sprite? sprite : data.sprite
  blip.color = data.color
  blip.alpha = data.alpha
  blip.name = player.name
  createdBlips[player.id] = blip
}
