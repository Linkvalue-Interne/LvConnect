// @flow

declare type HookRunRequest = {
  headers: string;
  body: string;
};

declare type HookRunResponse = HookRunRequest & {
  statusCode: number;
};

declare type HookRun = {
  identifier: string;
  status: string;
  dateStart: Date;
  dateEnd: Date;
  request: HookRunRequest;
  response?: HookRunResponse;
}

declare type Hook = {
  id: string;
  name: string;
  appId: string;
  listingTo: Array<string>;
  uri: string;
  secret: string;
  active: boolean;
  runs?: Array<HookRun>;
}
