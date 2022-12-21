import { resolveJsonOrRejectWithError } from './apiHelpers';
import {
  BrightcoveAccessToken,
  BrightcoveVideoSource,
  AccessToken,
} from '../interfaces';
import config from '../config';

export function brightcoveApiResourceUrl(path: string) {
  return config.brightcoveApiUrl + path;
}

export const getBrightcoveToken = (): AccessToken | undefined => {
  if (
    localStorage.getItem('brightcove_access_token') == null ||
    localStorage.getItem('brightcove_access_token_expires_at') == null
  ) {
    return undefined;
  }
  return {
    access_token: localStorage.getItem('brightcove_access_token')!,
    expires_in: Number.parseInt(
      localStorage.getItem('brightcove_access_token_expires_at')!,
    ),
  };
};

const baseBrightCoveUrlV3 = brightcoveApiResourceUrl(
  `/v1/accounts/${config.brightCoveAccountId}/videos`,
);

const getHeaders = (accessToken: AccessToken) => ({
  headers: {
    'content-type': 'Content-Type: application/json',
    Authorization: `Bearer ${accessToken.access_token}`,
  },
});

export const fetchBrightcoveAccessToken = () =>
  fetch('/get_brightcove_token').then(r =>
    resolveJsonOrRejectWithError<BrightcoveAccessToken>(r),
  );

export const setBrightcoveAccessTokenInLocalStorage = (
  brightcoveAccessToken: BrightcoveAccessToken,
) => {
  localStorage.setItem(
    'brightcove_access_token',
    brightcoveAccessToken.access_token,
  );
  localStorage.setItem(
    'brightcove_access_token_expires_at',
    (brightcoveAccessToken.expires_in * 1000 + new Date().getTime()).toString(),
  );
};

export async function fetchVideoSources(
  videoId: string,
  accountId: string | undefined | null,
  accessToken: AccessToken,
): Promise<BrightcoveVideoSource[] | undefined> {
  const url = `https://cms.api.brightcove.com/v1/accounts/${accountId}/videos/${
    `${videoId}`.split('&t=')[0]
  }/sources`;
  const response = await fetch(url, {
    method: 'GET',
    ...getHeaders(accessToken),
  });
  return resolveJsonOrRejectWithError<BrightcoveVideoSource[]>(response);
}

export const fetchWithBrightCoveToken = (url: string) => {
  const brightcoveAccessToken = localStorage.getItem('brightcove_access_token');
  const expiresAt =
    brightcoveAccessToken !== 'undefined'
      ? JSON.parse(localStorage.getItem('brightcove_access_token_expires_at')!)
      : 0;
  if (new Date().getTime() > expiresAt || !expiresAt) {
    return fetchBrightcoveAccessToken().then(res => {
      setBrightcoveAccessTokenInLocalStorage(res!);
      return fetch(url, {
        headers: { Authorization: `Bearer ${res!.access_token}` },
      });
    });
  }
  return fetch(url, {
    headers: { Authorization: `Bearer ${brightcoveAccessToken}` },
  });
};

export const fetchBrightcoveVideo = (videoId: string) =>
  fetchWithBrightCoveToken(`${baseBrightCoveUrlV3}/${videoId}`).then(r =>
    resolveJsonOrRejectWithError<BrightcoveApiType>(r),
  );

export interface BrightcoveApiType {
  account_id?: string | null;
  clip_source_video_id: string;
  ad_keys: string | null;
  complete: boolean;
  created_at: string;
  created_by: {
    type: string;
    id: string;
    email: string;
  };
  cue_points: {
    id: string;
    metadata: string;
    name: string;
    time: number;
    type: string;
  }[];
  custom_fields: Record<string, any>;
  delivery_type: string;
  description: string;
  digital_master_id: number;
  drm_disabled: boolean;
  duration: number;
  economics: string;
  folder_id: string;
  forensic_watermarking: string;
  geo: {
    countries: string[];
    exclude_countries: boolean;
    restricted: boolean;
  };
  has_digital_master: boolean;
  id: string;
  images: Record<string, BrightcoveImage>;
  labels: string[];
  link: {
    text: string;
    url: string;
  };
  long_description: string;
  name: string;
  offline_enabled: boolean;
  original_filename: string;
  playback_rights_id: string;
  projection?: string;
  published_at: string;
  reference_id: string;
  schedule: {
    ends_at: string;
    starts_at: string;
  };
  sharing: {
    by_external_acct: boolean;
    by_id: number;
    by_reference: boolean;
    source_id: boolean;
    to_external_acct: boolean;
  };
  state: string;
  tags: string[];
  text_tracks: {
    default: boolean;
    id: string;
    kind: string;
    label: string;
    mime_type: string;
    src: string;
    srclang: string;
  }[];
  updated_at: string;
  updated_by: {
    email: string;
    id: string;
    type: string;
  };
  variants: {
    language: string;
    name: string;
    description: string;
    long_description: string;
    custom_fields: Record<string, any>;
  }[];
}

interface BrightcoveImage {
  src: string;
  sources: {
    src: string;
    width: number;
    height: number;
  }[];
}
