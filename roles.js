// This file is a shared list of role constants, usable by multiple commands.

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
    'Admin',
    'Bot Commander',
    'Bot Developer',
    'Bot Restricted',
    'Bots',
    'DJ',
    'DiscoBot',
    'ErisBot',
    'Event Manager',
    'Keyboard GOD!',
    'Keyboard Warrior',
    'Mee6',
    'Member',
    'Moderator',
    'No links/files',
    'Push-to-talk',
    'Restricted',
    'Under 18'
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
