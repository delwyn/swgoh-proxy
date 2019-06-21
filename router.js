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

const combatTypeFilter = type => unit => unit.data.combat_type === type

router.get('/api/guild/:guildId', async ctx => {
  const { data } = await axios.get(`${BASE_URL}/guild/${ctx.params.guildId}/`)
  const combatType = ctx.query.combat_type || 1
  const players = data.players.map(({ data, units }) => ({
    data: pick(data, playerProps),
    units: units.filter(combatTypeFilter(combatType)).map(unitMapper),
  }))

  ctx.body = {
    ...data,
    players,
  }
})

module.exports = router
