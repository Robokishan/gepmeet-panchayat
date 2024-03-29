import {
  RtpCodecCapability,
  WebRtcServerOptions,
  WorkerLogLevel,
  WorkerLogTag
} from 'mediasoup/node/lib/types';

export default {
  domain: process.env.DOMAIN || 'localhost',
  mediasoup: {
    numWorkers: 1,
    workerSettings: {
      logLevel: 'warn' as WorkerLogLevel,
      logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp'
        // 'rtx',
        // 'bwe',
        // 'score',
        // 'simulcast',
        // 'svc',
        // 'sctp'
      ] as WorkerLogTag[],
      rtcMinPort: Number(process.env.WEBRTC_MIN_PORT),
      rtcMaxPort: Number(process.env.WEBRTC_MAX_PORT)
    },

    routerOptions: {
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000
          }
        }
      ] as RtpCodecCapability[]
    },
    // mediasoup WebRtcServer options for WebRTC endpoints (mediasoup-client,
    // libmediasoupclient).
    // See https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcServerOptions
    // NOTE: mediasoup-demo/server/lib/Room.js will increase this port for
    // each mediasoup Worker since each Worker is a separate process.
    webRtcServerOptions: {
      listenInfos: [
        {
          protocol: 'udp',
          ip: process.env.WEBRTC_LISTEN_IP || '0.0.0.0',
          announcedIp: process.env.WEBRTC_A_IP,
          port: Number(process.env.WEBRTC_SERVER_PORT)
        },
        {
          protocol: 'tcp',
          ip: process.env.WEBRTC_LISTEN_IP || '0.0.0.0',
          announcedIp: process.env.WEBRTC_A_IP,
          port: Number(process.env.WEBRTC_SERVER_PORT)
        }
      ]
    } as WebRtcServerOptions,
    webRtcTransportOptions: {
      // listenIps: [
      //   {
      //     ip: process.env.WEBRTC_LISTEN_IP || '0.0.0.0',
      //     announcedIp: process.env.WEBRTC_A_IP
      //   }
      // ] as TransportListenIp[],
      initialAvailableOutgoingBitrate: 1000000,
      // minimumAvailableOutgoingBitrate: 600000,
      // maxSctpMessageSize: 262144,
      maxIncomingBitrate: 1500000
    }
  }
};
