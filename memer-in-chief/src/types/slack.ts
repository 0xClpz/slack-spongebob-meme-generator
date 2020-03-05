export type SlackOauthResponse = {
  ok?: boolean;
  error?: string;
  access_token: string;
  scope: string;
  team_name: string;
  team_id: string;
  incoming_webhook: {
    url: string;
    channel: string;
    configuration_url: string;
  };
  bot: {
    bot_user_id: string;
    bot_access_token: string;
  };
};

export type SlackOauthAccessResponse = {
  access_token: string;
  scope: string;
};

export type SlackOauthAccessPayload = {
  client_id: string;
  client_secret: string;
  code: string;
};
