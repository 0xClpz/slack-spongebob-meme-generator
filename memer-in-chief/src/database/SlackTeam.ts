import {
  attribute,
  rangeKey,
  table
} from "@aws/dynamodb-data-mapper-annotations";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { DataMapper } from "@aws/dynamodb-data-mapper";

class Bot {
  @attribute()
  bot_access_token: string;

  @attribute()
  bot_user_id: string;
}

@table("slackTeam")
export class SlackTeam {
  @attribute()
  team_id: string;

  @rangeKey()
  access_token: string;

  @attribute()
  team_name: string;

  @attribute()
  bot: Bot;

  @attribute({ defaultProvider: () => 0 })
  memes_created?: number;
}

const client = new DynamoDB({ region: "us-east-1" });
const mapper = new DataMapper({ client });

export const createOrUpdateSlackTeam = async (payload: SlackTeam) => {
  const slackTeam = Object.assign(new SlackTeam(), payload);
  await mapper.put({ item: slackTeam });
  return slackTeam;
};

export const searchSlackTeam = async (team_id: string) => {
  let items = [];
  for await (const foo of mapper.query(SlackTeam, { team_id })) {
    items.push(foo);
  }
  return items[0];
};

export const getAnalytics = async () => {
  let totalMemes = 0;
  let totalTeams = 0;
  for await (const item of mapper.scan(SlackTeam)) {
    totalMemes += item?.memes_created ?? 0;
    totalTeams += 1;
  }

  return {
    memes: totalMemes,
    teams: totalTeams
  };
};
