const axios = require('axios')
const Router = require('koa-router')
const pick = require('lodash/pick')

const router = new Router()

const BASE_URL = 'https://swgoh.gg/api'
const unitProps = [
  'base_id',
  'combat_type',
  'gear_level',
  'level',
  'power',
  'rarity',
  'zeta_abilities',
]
const playerProps = ['name', 'url']

const unitMapper = ({ data }) => ({
  data: pick(data, unitProps),
})

const filterByCombatType = (units, type) =>
  [1, 2].includes(type)
    ? units.filter(unit => unit.data.combat_type === type)
    : units

router.get('/api/guild/:guildId', async ctx => {
  const { data } = await axios.get(`${BASE_URL}/guild/${ctx.params.guildId}/`)
  const combatType = parseInt(ctx.query.combat_type)
  const players = data.players.map(({ data, units }) => ({
    data: pick(data, playerProps),
    units: filterByCombatType(units, combatType).map(unitMapper),
  }))

  ctx.body = {
    ...data,
    players,
  }

  ctx.set('Cache-Control', 'public, max-age=3600')
})

module.exports = router
