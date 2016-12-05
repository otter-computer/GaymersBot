const TARGET_ROLE = 'Member';
const PROGRESS_EVERY = 100;

module.exports = {
  usage: '',
  description: 'Add all users in this server to the \'Member\' role.',
  process: (bot, message) => {
    const role = message.guild.roles.find('name', TARGET_ROLE);
    let numCompleted = 0;
    let numFailed = 0;
    let numTotal = message.guild.memberCount;
    message.guild.fetchMembers('').then((guild) => {
      guild.members.forEach((member) => {
        let prom = member.addRole(role);

        prom.then(() => {
          numCompleted++;
          if (numCompleted % PROGRESS_EVERY === 0) {
            const progMsg = 'Progress: ' + numCompleted + '/' + numTotal +
              ' (' + numFailed + ' failed)';
            console.log(progMsg);
            message.reply(progMsg);
          } else if (numCompleted === numTotal) {
            const progMsg = 'Completed. ' + numCompleted + ' users processed ' +
                'with ' + numFailed + ' failures.';
            console.log(progMsg);
            message.reply(progMsg);
          }
        });

        prom.catch((reason) => {
          numCompleted++;
          numFailed++;
          console.error(reason);
          message.reply('```' + reason + '```');
          if (numCompleted % PROGRESS_EVERY === 0) {
            const progMsg = 'Progress: ' + numCompleted + '/' + numTotal +
              ' (' + numFailed + ' failed)';
            console.log(progMsg);
            message.reply(progMsg);
          } else if (numCompleted === numTotal) {
            const progMsg = 'Completed. ' + numCompleted + ' users processed ' +
              'with ' + numFailed + ' failures.';
            console.log(progMsg);
            message.reply(progMsg);
          }
        });
      });
    }).catch((reason) => {
      console.error(reason);
      message.reply('```' + reason + '```');
    })
  }
}
