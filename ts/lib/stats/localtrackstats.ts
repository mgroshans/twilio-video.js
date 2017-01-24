'use strict';

import TrackStats = require('./trackstats');

/**
 * Statistics for a {@link LocalTrack}.
 * @extends TrackStats
 * @property {string} direction - 'sending'
 * @property {?number} bytesSent - Number of bytes sent
 * @property {?number} packetsSent - Number of packets sent
 * @property {?number} roundTripTime - Round trip time in milliseconds
 * @param {string} trackId - {@link LocalTrack} ID
 * @param {StandardizedTrackStatsReport} statsReport
 * @constructor
 */
class LocalTrackStats extends TrackStats {
  constructor(trackId, statsReport) {
    super(trackId, statsReport);

    Object.defineProperties(this, {
      direction: {
        value: 'sending',
        enumerable: true
      },
      bytesSent: {
        value: typeof statsReport.bytesSent === 'number'
          ? statsReport.bytesSent
          : null,
        enumerable: true
      },
      packetsSent: {
        value: typeof statsReport.packetsSent === 'number'
          ? statsReport.packetsSent
          : null,
        enumerable: true
      },
      roundTripTime: {
        value: typeof statsReport.roundTripTime === 'number'
          ? statsReport.roundTripTime
          : null,
        enumerable: true
      }
    });
  }
}

export = LocalTrackStats;
