'use strict';

import TrackStats = require('./trackstats');

/**
 * Statistics for a remote {@link Track}.
 * @extends TrackStats
 * @property {string} direction - 'receiving'
 * @property {?number} bytesReceived - Number of bytes received
 * @property {?number} packetsReceived - Number of packets received
 * @param {string} trackId - {@link Track} ID
 * @param {StandardizedTrackStatsReport} statsReport
 * @constructor
 */
class RemoteTrackStats extends TrackStats {
  constructor(trackId: string, statsReport) {
    super(trackId, statsReport);

    Object.defineProperties(this, {
      direction: {
        value: 'receiving',
        enumerable: true
      },
      bytesReceived: {
        value: typeof statsReport.bytesReceived === 'number'
          ? statsReport.bytesReceived
          : null,
        enumerable: true
      },
      packetsReceived: {
        value: typeof statsReport.packetsReceived === 'number'
          ? statsReport.packetsReceived
          : null,
        enumerable: true
      }
    });
  }
}

export = RemoteTrackStats;
