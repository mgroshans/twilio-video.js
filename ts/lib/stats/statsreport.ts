'use strict';

import LocalAudioTrackStats = require('./localaudiotrackstats');
import LocalVideoTrackStats = require('./localvideotrackstats');
import RemoteAudioTrackStats = require('./remoteaudiotrackstats');
import RemoteVideoTrackStats = require('./remotevideotrackstats');
import {StandardizedStatsResponse} from '../webrtc/standardizedstatsresponse';

/**
 * Statistics report for an RTCPeerConnection.
 * @property {Array<LocalAudioTrackStats>} localAudioTrackStats - List of {@link LocalAudioTrackStats}
 * @property {Array<LocalVideoTrackStats>} localVideoTrackStats - List of {@link LocalVideoTrackStats}
 * @property {Array<RemoteAudioTrackStats>} remoteAudioTrackStats - List of {@link RemoteAudioTrackStats}
 * @property {Array<RemoteVideoTrackStats>} remoteVideoTrackStats - List of {@link RemoteVideoTrackStats}
 * @param {string} peerConnectionId - RTCPeerConnection ID
 * @param {StandardizedStatsResponse} statsResponse
 * @constructor
 */
class StatsReport {
  constructor(peerConnectionId: string, statsResponse: StandardizedStatsResponse) {
    if (typeof peerConnectionId !== 'string') {
      throw new Error('RTCPeerConnection id must be a string');
    }

    Object.defineProperties(this, {
      peerConnectionId: {
        value: peerConnectionId,
        enumerable: true
      },
      localAudioTrackStats: {
        value: statsResponse.localAudioTrackStats.map(function(report) {
          return new LocalAudioTrackStats(report.trackId, report);
        }),
        enumerable: true
      },
      localVideoTrackStats: {
        value: statsResponse.localVideoTrackStats.map(function(report) {
          return new LocalVideoTrackStats(report.trackId, report);
        }),
        enumerable: true
      },
      remoteAudioTrackStats: {
        value: statsResponse.remoteAudioTrackStats.map(function(report) {
          return new RemoteAudioTrackStats(report.trackId, report);
        }),
        enumerable: true
      },
      remoteVideoTrackStats: {
        value: statsResponse.remoteVideoTrackStats.map(function(report) {
          return new RemoteVideoTrackStats(report.trackId, report);
        }),
        enumerable: true
      }
    });
  }
}

export = StatsReport;
