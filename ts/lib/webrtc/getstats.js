/* global webkitRTCPeerConnection, mozRTCPeerConnection */
'use strict';

/**
 * Get the standardized {@link RTCPeerConnection} statistics.
 * @param {RTCPeerConnection} peerConnection
 * @param {object} [options] - Used for testing
 * @returns {Promise.<StandardizedStatsResponse>}
 */
function getStats(peerConnection, options) {
  if (!(peerConnection && typeof peerConnection.getStats === 'function')) {
    return Promise.reject(new Error('Given PeerConnection does not support getStats'));
  }
  return _getStats(peerConnection, options);
}

/**
 * getStats() implementation.
 * @param {RTCPeerConnection} peerConnection
 * @param {object} [options] - Used for testing
 * @returns {Promise.<StandardizedStatsResponse>}
 */
function _getStats(peerConnection, options) {
  var localAudioTracks = getTracks(peerConnection, 'audio', 'local');
  var localVideoTracks = getTracks(peerConnection, 'video', 'local');
  var remoteAudioTracks = getTracks(peerConnection, 'audio');
  var remoteVideoTracks = getTracks(peerConnection, 'video');

  var statsResponse = {
    localAudioTrackStats: [],
    localVideoTrackStats: [],
    remoteAudioTrackStats: [],
    remoteVideoTrackStats: []
  };

  var trackStatsPromises = [].concat(localAudioTracks.map(function(track) {
      return getTrackStats(peerConnection, track, options)
        .then(function(stats) {
          stats.trackId = track.id;
          statsResponse.localAudioTrackStats.push(stats);
        });
    }),
    localVideoTracks.map(function(track) {
      return getTrackStats(peerConnection, track, options)
        .then(function(stats) {
          stats.trackId = track.id;
          statsResponse.localVideoTrackStats.push(stats);
        });
    }),
    remoteAudioTracks.map(function(track) {
      return getTrackStats(peerConnection, track, options)
        .then(function(stats) {
          stats.trackId = track.id;
          statsResponse.remoteAudioTrackStats.push(stats);
        });
    }),
    remoteVideoTracks.map(function(track) {
      return getTrackStats(peerConnection, track, options)
        .then(function(stats) {
          stats.trackId = track.id;
          statsResponse.remoteVideoTrackStats.push(stats);
        });
    }));

  return Promise.all(trackStatsPromises).then(function() {
    return statsResponse;
  });
}

/**
 * Get local/remote audio/video MediaStreamTracks.
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {string} kind - 'audio' or 'video'
 * @param {string} [localOrRemote] - 'local' or 'remote'
 * @returns {Array<MediaStreamTrack>}
 */
function getTracks(peerConnection, kind, localOrRemote) {
  var getStreams = localOrRemote === 'local' ? 'getLocalStreams' : 'getRemoteStreams';
  return peerConnection[getStreams]().reduce(function(localTracks, localStream) {
    var getTracks = kind === 'audio' ? 'getAudioTracks' : 'getVideoTracks';
    return localTracks.concat(localStream[getTracks]());
  }, []);
}

/**
 * Get the standardized statistics for a particular MediaStreamTrack.
 * @param {RTCPeerConnection} peerConnection
 * @param {MediaStreamTrack} track
 * @param {object} [options] - Used for testing
 * @returns {Promise.<StandardizedTrackStatsReport>}
 */
function getTrackStats(peerConnection, track, options) {
  options = options || {};

  if (typeof options.testForChrome !== 'undefined' ||
      typeof webkitRTCPeerConnection !== 'undefined') {
    return chromeGetTrackStats(peerConnection, track);
  }
  if (typeof options.testForFirefox  !== 'undefined' ||
      typeof mozRTCPeerConnection !== 'undefined') {
    return firefoxGetTrackStats(peerConnection, track);
  }
  return Promise.reject(new Error('RTCPeerConnection#getStats() not supported'));
}

/**
 * Get the standardized statistics for a particular MediaStreamTrack in Chrome.
 * @param {RTCPeerConnection} peerConnection
 * @param {MediaStreamTrack} track
 * @returns {Promise.<StandardizedTrackStatsReport>}
 */
function chromeGetTrackStats(peerConnection, track) {
  return new Promise(function(resolve, reject) {
    peerConnection.getStats(function(response) {
      resolve(standardizeChromeStats(response));
    }, track, reject);
  });
}

/**
 * Get the standardized statistics for a particular MediaStreamTrack in Firefox.
 * @param {RTCPeerConnection} peerConnection
 * @param {MediaStreamTrack} track
 * @returns {Promise.<StandardizedTrackStatsReport>}
 */
function firefoxGetTrackStats(peerConnection, track) {
  return new Promise(function(resolve, reject) {
    peerConnection.getStats(track, function(response) {
      resolve(standardizeFirefoxStats(response));
    }, reject);
  });
}

/**
 * Standardize the MediaStreamTrack's statistics in Chrome.
 * @param {RTCStatsResponse} response
 * @returns {StandardizedTrackStatsReport}
 */
function standardizeChromeStats(response) {
  var ssrcReport = response.result().reduce(function(ssrcReport, report) {
    return report.type === 'ssrc' ? report : ssrcReport;
  }, null);

  var standardizedStats = {};

  if (ssrcReport) {
    standardizedStats.timestamp = Math.round(Number(ssrcReport.timestamp));
    standardizedStats = ssrcReport.names().reduce(function(stats, name) {
      switch (name) {
        case 'googCodecName':
          stats.codecName = ssrcReport.stat(name);
          break;
        case 'googRtt':
          stats.roundTripTime = Number(ssrcReport.stat(name)) * 1000;
          break;
        case 'googJitterReceived':
          stats.jitter = Number(ssrcReport.stat(name));
          break;
        case 'googFrameWidthInput':
          stats.frameWidthInput = Number(ssrcReport.stat(name));
          break;
        case 'googFrameHeightInput':
          stats.frameHeightInput = Number(ssrcReport.stat(name));
          break;
        case 'googFrameWidthSent':
          stats.frameWidthSent = Number(ssrcReport.stat(name));
          break;
        case 'googFrameHeightSent':
          stats.frameHeightSent = Number(ssrcReport.stat(name));
          break;
        case 'googFrameWidthReceived':
          stats.frameWidthReceived = Number(ssrcReport.stat(name));
          break;
        case 'googFrameHeightReceived':
          stats.frameHeightReceived = Number(ssrcReport.stat(name));
          break;
        case 'googFrameRateInput':
          stats.frameRateInput = Number(ssrcReport.stat(name));
          break;
        case 'googFrameRateSent':
          stats.frameRateSent = Number(ssrcReport.stat(name));
          break;
        case 'googFrameRateReceived':
          stats.frameRateReceived = Number(ssrcReport.stat(name));
          break;
        case 'ssrc':
          stats[name] = ssrcReport.stat(name);
          break;
        case 'bytesReceived':
        case 'bytesSent':
        case 'packetsLost':
        case 'packetsReceived':
        case 'packetsSent':
        case 'audioInputLevel':
        case 'audioOutputLevel':
          stats[name] = Number(ssrcReport.stat(name));
          break;
      }

      return stats;
    }, standardizedStats);
  }

  return standardizedStats;
}

/**
 * Standardize the MediaStreamTrack's statistics in Firefox.
 * @param {RTCStatsReport} response
 * @returns {StandardizedTrackStatsReport}
 */
function standardizeFirefoxStats(response) {
  var inbound = Object.keys(response).reduce(function(report, id) {
    return response[id].type === 'inboundrtp' ? response[id] : report;
  }, null);

  var outbound = Object.keys(response).reduce(function(report, id) {
    return response[id].type === 'outboundrtp' ? response[id] : report;
  }, null);

  var standardizedStats = {};

  function getStatValue(name) {
    var first = outbound;
    var second = inbound;

    if (outbound.isRemote) {
      first = inbound;
      second = outbound;
    }

    return typeof first[name] !== 'undefined' ? first[name] : second[name];
  }

  var timestamp = getStatValue('timestamp');
  standardizedStats.timestamp = Math.round(timestamp);

  var ssrc = getStatValue('ssrc');
  if (typeof ssrc === 'string') {
    standardizedStats.ssrc = ssrc;
  }

  var bytesSent = getStatValue('bytesSent');
  if (typeof bytesSent === 'number') {
    standardizedStats.bytesSent = bytesSent;
  }

  var packetsLost = getStatValue('packetsLost');
  if (typeof packetsLost === 'number') {
    standardizedStats.packetsLost = packetsLost;
  }

  var packetsSent = getStatValue('packetsSent');
  if (typeof packetsSent === 'number') {
    standardizedStats.packetsSent = packetsSent;
  }

  var roundTripTime = getStatValue('mozRtt');
  if (typeof roundTripTime === 'number') {
    standardizedStats.roundTripTime = roundTripTime * 1000;
  }

  var jitter = getStatValue('jitter');
  if (typeof jitter === 'number') {
    standardizedStats.jitter = Math.round(jitter * 1000);
  }

  var frameRateSent = getStatValue('framerateMean');
  if (typeof frameRateSent === 'number') {
    standardizedStats.frameRateSent = Math.round(frameRateSent);
  }

  var bytesReceived = getStatValue('bytesReceived');
  if (typeof bytesReceived === 'number') {
    standardizedStats.bytesReceived = bytesReceived;
  }

  var packetsReceived = getStatValue('packetsReceived');
  if (typeof packetsReceived === 'number') {
    standardizedStats.packetsReceived = packetsReceived;
  }

  var frameRateReceived = getStatValue('framerateMean');
  if (typeof frameRateReceived === 'number') {
    standardizedStats.frameRateReceived = Math.round(frameRateReceived);
  }

  return standardizedStats;
}

module.exports = getStats;
