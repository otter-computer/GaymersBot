Role Constants
==============

Role constant lists are defined in `roles.js`. These are used by many commands
to define the behavior around a user's roles.

Region Roles (`REGION_ROLES`)
-----------------------------

These are the roles used with the `!setregion` command (et al). This list is
used by `!regions`, `!unsetregion` (iterates through this list and removes
them all), and `!role` (which will reject modification to region roles and
direct the user towards `!setregion` instead).

Restricted Roles (`RESTRICTED_ROLES`)
-------------------------------------

These are roles that cannot be managed with the `!role` command. An example of
this is the 'Under 18' role that we assign to users to prevent them from using
the `!set18` command.

Required Roles (`REQUIRED_TO_USE_BOT`)
--------------------------------------

If this list is not empty, the bot will ignore messages from users that don't
have a role listed in this list. This is used where you don't want the bot
used by new users that don't yet have the 'Member' role, for example. Note
that this check does not happen in a DM since the user has no roles there.

Banned Roles (`BANNED_ROLES`)
-----------------------------

Users that have a role listed in this list are ignored by the bot. This check
supersedes the 'Required Roles' check from above. This is used if you have a
role like 'Restricted' which is kind of a soft-ban and you don't want the user
using your bot. Note that this doesn't restrict DMs since the user doesn't
have roles there.
