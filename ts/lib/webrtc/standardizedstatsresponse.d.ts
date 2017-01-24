import {StandardizedTrackStatsReport} from '../webrtc/standardizedtrackstatsreport';

/**
 * Standardized {@link RTCPeerConnection} statistics.
 * @typedef {Object} StandardizedStatsResponse
 * @property Array<StandardizedTrackStatsReport> localAudioTrackStats - Stats for local audio MediaStreamTracks
 * @property Array<StandardizedTrackStatsReport> localVideoTrackStats - Stats for local video MediaStreamTracks
 * @property Array<StandardizedTrackStatsReport> remoteAudioTrackStats - Stats for remote audio MediaStreamTracks
 * @property Array<StandardizedTrackStatsReport> remoteVideoTrackStats - Stats for remote video MediaStreamTracks
 */
export interface StandardizedStatsResponse {
    localAudioTrackStats: Array<StandardizedTrackStatsReport>;
    localVideoTrackStats: Array<StandardizedTrackStatsReport>;
    remoteAudioTrackStats: Array<StandardizedTrackStatsReport>;
    remoteVideoTrackStats: Array<StandardizedTrackStatsReport>;
}
