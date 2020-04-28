module.exports = {
  // Roles that are associated with regions.
  REGION_ROLES: [
    'Africa',
    'Asia',
    'Europe',
    'Middle East',
    'North America',
    'Oceania',
    'South America'
  ],

  // Roles that cannot be managed with !role
  RESTRICTED_ROLES: [
    '18+',
    '406',
    'Admin',
    'Bot Commander',
    'Bot Developer',
    'Bot Restricted',
    'Bots',
    'D.Va',
    'DiscoBot',
    'Discord Partner',
    'Discord Server List',
    'DiscordServers.com',
    'Discordservers.me',
    'Event Manager',
    'GaymersBot',
    'GiveawayBot',
    'Gym Leader',
    'Invulnerable',
    'Mercy',
    'Moderator',
    'Nitro Booster',
    'No links/files',
    'Pokémon Master',
    'Priority Speaker',
    'Private Avatar',
    'Push-to-talk',
    'Restricted',
    'Restricted 2',
    'Silenced',
    'Smash Queen',
    'Sombra',
    'Staff',
    'Statbot',
    'Trial Moderator',
    'Under 18',
    'Winston',
    'XP Bot',
    'PokeBot'
  ],

  NITRO_ROLE: 'Nitro Booster',

  NITRO_ONLY_ROLES: [
    'Mart\'s Dirty Banana',
    'Blue Cosmo'
  ],

  // A user must have one of these roles to use the bot (unless in a DM)
  REQUIRED_TO_USE_BOT: [],

  // A user with any of these roles will have their messages ignored by the bot
  // (unless in a DM). This ban supersedes the REQUIRED_TO_USE_BOT check.
  BANNED_FROM_BOT: [
    'Bot Restricted',
    'Restricted',
    'Silenced'
  ]
};
