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
    '1st Place Pumky',
    '406',
    'Admin',
    'Alliance',
    'Bot Commander',
    'Bot Developer',
    'Bot Restricted',
    'Bots',
    'D.Va',
    'DiscoBot',
    'Discord Server List',
    'DiscordServers.com',
    'Discordservers.me',
    'Event Manager',
    'GaymersBot',
    'Gift Goblin',
    'GiveawayBot',
    'Goddess of Death',
    'Gym Leader',
    'Halloween Contest Winners',
    'Horde',
    'Invulnerable',
    'Mercy',
    'Moderator',
    'Nitro Booster',
    'No links/files',
    'Pokémon Master',
    'Private Avatar',
    'Push-to-talk',
    'Restricted',
    'Smash Queen',
    'Sombra',
    'Staff',
    'Statbot',
    'Trial Moderator',
    'Under 18',
    'Winston',
    'XP Bot',
    'PokeBot',
    'Normal',
    'Fire',
    'Fighting',
    'Water',
    'Flying',
    'Grass',
    'Poison',
    'Electric',
    'Ground',
    'Psychic',
    'Rock',
    'Ice',
    'Bug',
    'Dragon',
    'Ghost',
    'Dark',
    'Steel',
    'Fairy',
    'Pink Lemonade',
    'Deep Lake',
    'Blue Depths'
  ],

  // A user must have one of these roles to use the bot (unless in a DM)
  REQUIRED_TO_USE_BOT: [],

  // A user with any of these roles will have their messages ignored by the bot
  // (unless in a DM). This ban supersedes the REQUIRED_TO_USE_BOT check.
  BANNED_FROM_BOT: [
    'Bot Restricted',
    'Restricted'
  ]
};
