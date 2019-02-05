/* *
 * DiscoBot - Gaymers Discord Bot
 * Copyright (C) 2015 - 2017 DiscoBot Authors
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 * */

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
    '1st Place Pumky',
    'Admin',
    'Alliance',
    'Bot Commander',
    'Bot Developer',
    'Bot Restricted',
    'Bots',
    'D.Va',
    'DiscoBot',
    'Discord Me Bot',
    'Discordservers.me',
    'Event Manager',
    'GaymersBot',
    'Gift Goblin',
    'Goddess of Death',
    'Gym Leader',
    'Halloween Contest Winners',
    'Horde',
    'Invulnerable',
    'Mercy',
    'Moderator',
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
    'Fairy'
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
