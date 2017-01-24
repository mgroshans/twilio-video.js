'use strict';

import RemoteTrackStats = require('./remotetrackstats');
import {StandardizedTrackStatsReport} from '../webrtc/standardizedtrackstatsreport';

/**
 * Statistics for an {@link AudioTrack}.
 * @extends RemoteTrackStats
 * @property {?AudioLevel} audioLevel - Output {@link AudioLevel}
 * @property {?number} jitter - Audio jitter in milliseconds
 * @param {string} trackId - {@link AudioTrack} ID
 * @param {StandardizedTrackStatsReport} statsReport
 * @constructor
 */
class RemoteAudioTrackStats extends RemoteTrackStats {
  constructor(trackId: string, statsReport:StandardizedTrackStatsReport) {
    super(trackId, statsReport);

    Object.defineProperties(this, {
      audioLevel: {
        value: typeof statsReport.audioOutputLevel === 'number'
          ? statsReport.audioOutputLevel
          : null,
        enumerable: true
      },
      jitter: {
        value: typeof statsReport.jitter === 'number'
          ? statsReport.jitter
          : null,
        enumerable: true
      }
    });
  }
}

export = RemoteAudioTrackStats;
