// This file is a shared list of role constants, usable by multiple commands.

module.exports = {
  // Roles that are associated with regions.
  REGION_ROLES: [
    'Africa',
    'Asia',
    'Europe',
    'Middle East',
    'Oceania',
    'North America',
    'South America'
  ],

  // Roles that cannot be managed with !role
  RESTRICTED_ROLES: [
    'Admin',
    'Moderator',
    'Bots',
    'Bot Developer',
    'Restricted',
    'Bot Restricted',
    'No links/files',
    'Under 18',
    'DJ',
    'ErisBot',
    'Event Manager',
    'DiscoBot',
    '18+',
    'Push-to-talk',
    'Bot Commander',
    'Mee6',
    'Keyboard Warrior',
    'Keyboard GOD!',
    'Member'
  ],

  // A user must have one of these roles to use the bot (unless in a DM)
  REQUIRED_TO_USE_BOT: [
    'Member'
  ],

  // A user with any of these roles will have their messages ignored by the bot
  // (unless in a DM). This ban supersedes the REQUIRED_TO_USE_BOT check.
  BANNED_FROM_BOT: [
    'Bot Restricted',
    'Restricted'
  ]
}
