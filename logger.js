const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: function() {
          return new Date().toISOString() 
        },
        formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
        }
     }),
      new (winston.transports.File)({ 
        filename: 'logfile.log',
        timestamp: function() {
          return new Date().toISOString() 
        },
        formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
        }
     })
    ]
  });

logger.emitErrs = false;

module.exports.logger = logger;