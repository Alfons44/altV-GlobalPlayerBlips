import {Blip, emitServerRaw, onServer, Player, Vehicle} from "alt-client";
import {getVehicleClass} from "natives";

// ============================================================ \\
// ServerSide setter broken, work around with Client Side setter \\
// ============================================================== \\

onServer('server::globalPlayerBlips::refresh::category', () => {
  Blip.all.forEach(blip => { if(blip.category != 7) blip.category = 7 })
})

onServer('server::globalPlayerBlips::hide::blipFromPlayer', (player: Player) => {
  Blip.all.forEach(blip => { if(blip.name == player.name && blip.display != 0) blip.display = 0 })
})

onServer('client::globalPlayerBlips::get::vehicleClass', async () => {
  let veh: Vehicle = Player.local.vehicle as Vehicle
  const interval = setTimeout(() => {
    veh = Player.local.vehicle as Vehicle
    if(veh.scriptID) {
      clearInterval(interval)
      emitServerRaw('client::globalPlayerBlips::set::vehicleClass', getVehicleClass(veh.scriptID))
    }
  }, 50)
})
